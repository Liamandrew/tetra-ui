import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  redirects: async () => [
    {
      source: "/docs/llms.txt",
      destination: "/llms.txt",
      permanent: false,
    },
    {
      source: "/docs/llms-full.txt",
      destination: "/llms-full.txt",
      permanent: false,
    },
  ],
};

export default withMDX(config);
