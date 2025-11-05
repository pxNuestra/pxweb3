/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      layers: true, // aktifkan fitur layers
    };
    return config;
  },
};

export default nextConfig;
