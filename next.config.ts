import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite probar el sitio desde el celular en la red local (solo en desarrollo).
  allowedDevOrigins: ["192.168.100.185", "192.168.*.*"],
};

export default nextConfig;
