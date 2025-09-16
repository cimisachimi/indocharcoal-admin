/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is the line you need to add
  output: 'export',

  // This is recommended for static exports as the default image optimization won't work
  images: {
    unoptimized: true,
  },
};

export default nextConfig;