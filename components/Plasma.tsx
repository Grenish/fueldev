"use client";

import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

interface PlasmaProps {
  color?: string;
  speed?: number;
  direction?: "forward" | "reverse" | "pingpong";
  scale?: number;
  opacity?: number;
  mouseInteractive?: boolean;
  quality?: "low" | "medium" | "high";
  className?: string;
}

// Constants
const SPEED_MULTIPLIER = 0.4;
const MOUSE_SENSITIVITY = 0.0002;
const PINGPONG_DURATION = 10;
const DEFAULT_COLOR_RGB: [number, number, number] = [1, 0.5, 0.2];

// Quality settings map
const QUALITY_SETTINGS = {
  low: 30,
  medium: 45,
  high: 60,
} as const;

// Shader source
const VERTEX_SHADER = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const createFragmentShader = () => `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
uniform float uQuality;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;

  vec2 mouseOffset = (uMouse - center) * ${MOUSE_SENSITIVITY};
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);

  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < uQuality; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y));
    p.z -= 4.;
    S = p;
    d = p.y-T;

    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05);
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T));
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4;
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }

  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);

  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));

  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}`;

// Utility functions
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return DEFAULT_COLOR_RGB;
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

export const Plasma: React.FC<PlasmaProps> = ({
  color = "#ffffff",
  speed = 1,
  direction = "forward",
  scale = 1,
  opacity = 1,
  mouseInteractive = true,
  quality = "medium",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const programRef = useRef<Program | null>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const mousePos = useRef({ x: 0, y: 0 });
  const isInitialized = useRef(false);
  const lastMouseMoveTime = useRef<number>(0);

  // Memoize calculated values
  const customColorRgb = useMemo(() => hexToRgb(color), [color]);
  const useCustomColor = useMemo(() => (color ? 1.0 : 0.0), [color]);
  const directionMultiplier = useMemo(
    () => (direction === "reverse" ? -1.0 : 1.0),
    [direction],
  );
  const qualityValue = useMemo(() => QUALITY_SETTINGS[quality], [quality]);
  const fragmentShader = useMemo(() => createFragmentShader(), []);

  // Inline throttled mouse handler
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!mouseInteractive || !containerRef.current || !programRef.current)
        return;

      const now = Date.now();
      if (now - lastMouseMoveTime.current < 16) return; // ~60fps
      lastMouseMoveTime.current = now;

      const rect = containerRef.current.getBoundingClientRect();
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;

      const program = programRef.current;
      const uniforms = program.uniforms as Record<
        string,
        { value: Float32Array | number }
      >;
      const mouseUniform = uniforms.uMouse.value as Float32Array;
      mouseUniform[0] = mousePos.current.x;
      mouseUniform[1] = mousePos.current.y;
    },
    [mouseInteractive],
  );

  // Update uniforms without recreating WebGL context
  useEffect(() => {
    if (!programRef.current) return;

    const program = programRef.current;
    const uniforms = program.uniforms as Record<
      string,
      { value: Float32Array | number }
    >;

    (uniforms.uCustomColor.value as Float32Array).set(customColorRgb);
    uniforms.uUseCustomColor.value = useCustomColor;
    uniforms.uSpeed.value = speed * SPEED_MULTIPLIER;
    uniforms.uDirection.value = directionMultiplier;
    uniforms.uScale.value = scale;
    uniforms.uOpacity.value = opacity;
    uniforms.uMouseInteractive.value = mouseInteractive ? 1.0 : 0.0;
    uniforms.uQuality.value = qualityValue;
  }, [
    customColorRgb,
    useCustomColor,
    speed,
    directionMultiplier,
    scale,
    opacity,
    mouseInteractive,
    qualityValue,
  ]);

  // Initialize WebGL only once
  useEffect(() => {
    if (!containerRef.current || isInitialized.current) return;

    // Store ref values for cleanup
    const container = containerRef.current;
    isInitialized.current = true;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });

    rendererRef.current = renderer;
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uCustomColor: { value: new Float32Array(customColorRgb) },
        uUseCustomColor: { value: useCustomColor },
        uSpeed: { value: speed * SPEED_MULTIPLIER },
        uDirection: { value: directionMultiplier },
        uScale: { value: scale },
        uOpacity: { value: opacity },
        uMouse: { value: new Float32Array([0, 0]) },
        uMouseInteractive: { value: mouseInteractive ? 1.0 : 0.0 },
        uQuality: { value: qualityValue },
      },
    });

    programRef.current = program;
    const mesh = new Mesh(gl, { geometry, program });

    // Setup resize observer
    const setSize = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height);
      const uniforms = program.uniforms as Record<
        string,
        { value: Float32Array | number }
      >;
      (uniforms.iResolution.value as Float32Array)[0] = gl.drawingBufferWidth;
      (uniforms.iResolution.value as Float32Array)[1] = gl.drawingBufferHeight;
    };

    const resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(container);
    setSize();

    // Animation loop
    startTimeRef.current = performance.now();

    const animate = (timestamp: number) => {
      const timeValue = (timestamp - startTimeRef.current) * 0.001;
      const uniforms = program.uniforms as Record<
        string,
        { value: Float32Array | number }
      >;

      if (direction === "pingpong") {
        const segmentTime = timeValue % PINGPONG_DURATION;
        const isForward = Math.floor(timeValue / PINGPONG_DURATION) % 2 === 0;
        const u = segmentTime / PINGPONG_DURATION;
        const smooth = u * u * (3 - 2 * u);
        const pingpongTime = isForward
          ? smooth * PINGPONG_DURATION
          : (1 - smooth) * PINGPONG_DURATION;
        uniforms.uDirection.value = 1.0;
        uniforms.iTime.value = pingpongTime;
      } else {
        uniforms.iTime.value = timeValue;
      }

      renderer.render({ scene: mesh });
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // Event listeners
    const mouseMoveHandler = (e: MouseEvent) => handleMouseMove(e);
    if (mouseInteractive) {
      container.addEventListener("mousemove", mouseMoveHandler);
    }

    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      resizeObserver.disconnect();
      if (mouseInteractive) {
        container.removeEventListener("mousemove", mouseMoveHandler);
      }
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
      isInitialized.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - only initialize once

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden ${className}`}
    />
  );
};

export default Plasma;
