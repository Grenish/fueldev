"use client";

import { motion, useMotionValue, useTransform } from "motion/react";
import {
  useState,
  Children,
  ReactNode,
  isValidElement,
  cloneElement,
} from "react";

interface CardRotateProps {
  id: number;
  children: ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
}

function CardRotate({
  id,
  children,
  onSendToBack,
  sensitivity,
}: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_: never, info: { offset: { x: number; y: number } }) {
    if (
      Math.abs(info.offset.x) > sensitivity ||
      Math.abs(info.offset.y) > sensitivity
    ) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      className="absolute cursor-grab"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

interface StackProps {
  children: ReactNode;
  randomRotation?: boolean;
  sensitivity?: number;
  animationConfig?: { stiffness: number; damping: number };
  sendToBackOnClick?: boolean;
  width?: number | string;
  height?: number | string;
}

export default function Stack({
  children,
  randomRotation = false,
  sensitivity = 200,
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  width = 208,
  height = 208,
}: StackProps) {
  const arrayChildren = Children.toArray(children).filter(isValidElement);

  const [order, setOrder] = useState(
    arrayChildren.map((_, i) => i), // indexes of children
  );

  const sendToBack = (idx: number) => {
    setOrder((prev) => {
      const arr = [...prev];
      const index = arr.indexOf(idx);
      const [removed] = arr.splice(index, 1);
      arr.unshift(removed);
      return arr;
    });
  };

  return (
    <div
      className="relative"
      style={{
        width,
        height,
        perspective: 600,
      }}
    >
      {order.map((childIndex, stackIndex) => {
        const child = arrayChildren[childIndex];

        const randomRotate = randomRotation ? Math.random() * 10 - 5 : 0;

        return (
          <CardRotate
            key={childIndex}
            id={childIndex}
            onSendToBack={() => sendToBack(childIndex)}
            sensitivity={sensitivity}
          >
            <motion.div
              className="rounded-2xl overflow-hidden"
              onClick={() => sendToBackOnClick && sendToBack(childIndex)}
              animate={{
                rotateZ: (order.length - stackIndex - 1) * 4 + randomRotate,
                scale: 1 + stackIndex * 0.06 - order.length * 0.06,
                transformOrigin: "90% 90%",
              }}
              initial={false}
              transition={{
                type: "spring",
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
              }}
              style={{
                width,
                height,
              }}
            >
              {cloneElement(child as any, {
                className: `${child.props.className || ""} pointer-events-none`,
              })}
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}
