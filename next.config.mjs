/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/graphql',
        destination: 'https://v3.velog.io/graphql',
      },
    ];
  },
};

export default nextConfig;
