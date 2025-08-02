/** @type {import('next').NextConfig} */
const nextConfig = {
  // Other configurations you might have...

  images: {
    // For Next.js 13 and newer, use remotePatterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/de9jbd6ve/**', // Use your actual Cloud Name here
      },
    ],
    // If you are using an older Next.js version (pre-13.0.0), you might use 'domains' instead:
    // domains: ['res.cloudinary.com'],
  },
};

module.exports = nextConfig;
