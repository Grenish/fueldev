import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              svgo: true,
              svgoConfig: {
                plugins: [
                  {
                    name: "preset-default",
                    params: {
                      overrides: {
                        removeViewBox: false,
                      },
                    },
                  },
                  {
                    name: "removeAttrs",
                    params: {
                      attrs: "(width|height)",
                    },
                  },
                  {
                    name: "convertColors",
                    params: {
                      currentColor: true,
                    },
                  },
                ],
              },
              replaceAttrValues: {
                "var(--color-contrast-high)": "currentColor",
                "#000": "currentColor",
                "#000000": "currentColor",
                black: "currentColor",
              },
            },
          },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
