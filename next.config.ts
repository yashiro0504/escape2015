import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // GitHub Pages 배포를 위한 설정
  // 리포지토리 이름이 'escape2015'인 경우를 가정합니다.
  basePath: process.env.NODE_ENV === 'production' ? '/escape2015' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/escape2015/' : '',
};

export default nextConfig;
