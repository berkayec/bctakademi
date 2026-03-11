import React, { useEffect, useRef, useState, memo } from 'react';
import { motion } from 'framer-motion';
interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originalX: number;
  originalY: number;
  opacity: number;
}
const BackgroundNodes = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const opacityRef = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight * 0.95);
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight * 0.95;
      initNodes();
    };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current.targetX = (x / width - 0.5) * 2;
      mouseRef.current.targetY = (y / height - 0.5) * 2;
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    const nodes: Node[] = [];
    const nodeCount = Math.floor((width * height) / 12000);
    const initNodes = () => {
      nodes.length = 0;
      for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        nodes.push({
          x,
          y,
          originalX: x,
          originalY: y,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    };
    initNodes();
    let currentParallaxX = 0;
    let currentParallaxY = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      if (opacityRef.current < 1) opacityRef.current += 0.005;
      currentParallaxX += (mouseRef.current.targetX - currentParallaxX) * 0.05;
      currentParallaxY += (mouseRef.current.targetY - currentParallaxY) * 0.05;
      const parallaxShiftX = currentParallaxX * 45;
      const parallaxShiftY = currentParallaxY * 45;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.originalX += node.vx;
        node.originalY += node.vy;
        if (node.originalX < 0) node.originalX = width;
        if (node.originalX > width) node.originalX = 0;
        if (node.originalY < 0) node.originalY = height;
        if (node.originalY > height) node.originalY = 0;
        node.x = node.originalX + parallaxShiftX;
        node.y = node.originalY + parallaxShiftY;
        ctx.fillStyle = `rgba(20, 184, 166, ${node.opacity * opacityRef.current})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distSq = dx * dx + dy * dy;
          const maxDist = 160;
          if (distSq < maxDist * maxDist) {
            const dist = Math.sqrt(distSq);
            const opacity = (1 - dist / maxDist) * 0.15 * opacityRef.current;
            ctx.strokeStyle = `rgba(20, 184, 166, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-50" />;
});
BackgroundNodes.displayName = 'BackgroundNodes';
const ECGWavePattern = memo(({ width, height }: { width: number; height: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    const centerY = height / 2;
    const numPoints = 140;
    const step = width / numPoints;
    ctx.beginPath();
    ctx.lineWidth = 2.5;
    const waveGradient = ctx.createLinearGradient(0, 0, width, 0);
    waveGradient.addColorStop(0, 'rgba(20, 184, 166, 0.2)');
    waveGradient.addColorStop(0.5, 'rgba(243, 128, 32, 0.8)');
    waveGradient.addColorStop(1, 'rgba(20, 184, 166, 0.2)');
    ctx.strokeStyle = waveGradient;
    ctx.shadowBlur = 12;
    ctx.shadowColor = 'rgba(20, 184, 166, 0.3)';
    for (let i = 0; i <= numPoints; i++) {
      const x = i * step;
      let y = Math.sin(i * 0.2) * 2; 
      const waveCycle = i % 45;
      if (waveCycle === 2) y -= 10;   
      if (waveCycle === 5) y -= 75;   
      if (waveCycle === 6) y += 35;   
      if (waveCycle === 12) y -= 12;  
      const renderX = x;
      const renderY = centerY + y;
      if (i === 0) ctx.moveTo(renderX, renderY);
      else ctx.lineTo(renderX, renderY);
    }
    ctx.stroke();
  }, [width, height]);
  return <canvas ref={canvasRef} width={width} height={height} className="shrink-0" />;
});
ECGWavePattern.displayName = 'ECGWavePattern';
export function HeroInteractiveCanvas() {
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight * 0.95 : 0
  }));
  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight * 0.95
      });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return (
    <div className="relative w-full h-full overflow-hidden">
      <BackgroundNodes />
      {dimensions.width > 0 && (
        <div className="absolute inset-0 flex items-center pointer-events-none opacity-40">
          <motion.div
            className="flex will-change-transform"
            initial={{ x: 0 }}
            animate={{ x: `-${dimensions.width}px` }}
            transition={{
              duration: 25,
              ease: "linear",
              repeat: Infinity
            }}
          >
            <ECGWavePattern width={dimensions.width} height={dimensions.height} />
            <ECGWavePattern width={dimensions.width} height={dimensions.height} />
          </motion.div>
        </div>
      )}
    </div>
  );
}