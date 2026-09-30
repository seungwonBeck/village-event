"use client";

import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QrCodeProps {
  value: string;
  size?: number;
  className?: string;
}

/**
 * 오프라인/온라인 공용 QR 코드 캔버스 컴포넌트
 * 전달된 URL 값을 고해상도 캔버스로 렌더링합니다.
 */
export default function QrCode({ value, size = 160, className = "" }: QrCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(
        canvasRef.current,
        value,
        {
          width: size,
          margin: 1,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        () => {}
      );
    }
  }, [value, size]);

  return (
    <div className={`p-2 bg-white border-3 border-black rounded-2xl shadow-pop inline-block ${className}`}>
      <canvas ref={canvasRef} width={size} height={size} className="block rounded-lg" />
    </div>
  );
}
