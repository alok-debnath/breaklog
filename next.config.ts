import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['127.0.0.1', 'local-origin.dev', '*.local-origin.dev'],
};

export default nextConfig;
