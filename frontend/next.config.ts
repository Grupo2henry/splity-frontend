// next.config.ts

import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  // podés incluir más configuraciones estándar si lo necesitás
};

// Exportá tanto la config como tus variables personalizadas si son necesarias en otro lado
module.exports = {
  ...nextConfig,
  allowedDevOrigins: [
    'local-origin.dev',
    '*.local-origin.dev',
    '27a0-2803-9800-98c5-a8c-c49b-6af8-fc85-6d76.ngrok-free.app',
    'https://669c-181-4-211-243.ngrok-free.app',
    'https://two-eagles-beam.loca.lt',
  ],
};