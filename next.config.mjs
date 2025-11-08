/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'fakestoreapi.com', port: '', pathname: '/img/**' }
    ]
  },
  experimental: { serverActions: true }
};
export default nextConfig;
