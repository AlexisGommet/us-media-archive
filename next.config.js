/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        formats: ['image/jpeg'],
        domains: ['storage.googleapis.com'],
    },
};

module.exports = nextConfig
