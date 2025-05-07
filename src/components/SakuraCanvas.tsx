'use client';

import { useEffect, useRef, useState } from 'react';
import {
  sakuraPointVsh,
  sakuraPointFsh,
  fxCommonVsh,
  bgFsh,
  fxBrightbufFsh,
  fxDirblurR4Fsh,
  ppFinalVsh,
  ppFinalFsh,
} from '@/lib/shaders';
import { animate, makeCanvasFullScreen, setViewports } from '@/lib/sakura';

interface SakuraCanvasProps {
  className?: string;
}
// This component is a WebGL canvas that renders a sakura animation.
const SakuraCanvas: React.FC<SakuraCanvasProps> = ({className}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webGLError, setWebGLError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as WebGLRenderingContext);
      if (!gl) throw new Error('WebGL not supported');
    } catch (e) {
      console.error('WebGL not supported:', e);
      setWebGLError('WebGL is not supported in your browser. Please try a different browser or enable WebGL.');
      return;
    }

    const handleResize = () => {
      if (canvas && gl) {
        makeCanvasFullScreen(canvas);
        setViewports(gl, canvas);
      }
    };

    window.addEventListener('resize', handleResize);

    const stopAnimation = animate(
      gl,
      canvas,
      sakuraPointVsh,
      sakuraPointFsh,
      fxCommonVsh,
      bgFsh,
      fxBrightbufFsh,
      fxDirblurR4Fsh,
      ppFinalVsh,
      ppFinalFsh
    );

    return () => {
      window.removeEventListener('resize', handleResize);
      stopAnimation();
    };
  }, []);

  if (webGLError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
        <p>{webGLError}</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0">
      <canvas ref={canvasRef} id="sakura" className="w-full h-full" />
    </div>
  );
};

export default SakuraCanvas;