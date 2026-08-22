import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  images: {
    unoptimized: true,
  },
  outputFileTracingIncludes: {
    "/api/markdown/**": ["./content/docs/**/*"],
    "/r/**": ["./public/r/**/*"],
  },
  reactStrictMode: true,
};

export default withMDX(config);
