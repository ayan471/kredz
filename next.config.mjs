/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    images: {
          remotePatterns: [
            {
              protocol: 'https',
              hostname: 'images.pexels.com',
              port: '',
            },
            {
              protocol: 'https',
              hostname: 'cdn.sanity.io',
              port: '',
            },
          ],
      },    
};

export default nextConfig;
