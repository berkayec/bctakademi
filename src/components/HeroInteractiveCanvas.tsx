import React, { useEffect, useRef } from 'react';
interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originalX: number;
  originalY: number;
  opacity: number;
}
export function HeroInteractiveCanvas() {
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
          // Reduced node velocity from 0.3 to 0.1 for a more stable atmosphere
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    };
    initNodes();
    let offset = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      // Smoother global fade-in on mount (increment reduced from 0.01 to 0.005)
      if (opacityRef.current < 1) opacityRef.current += 0.005;
      // Smooth parallax transition
      currentParallaxX += (mouseRef.current.targetX - currentParallaxX) * 0.05;
      currentParallaxY += (mouseRef.current.targetY - currentParallaxY) * 0.05;
      const parallaxShiftX = currentParallaxX * 45;
      const parallaxShiftY = currentParallaxY * 45;
      // Node Interaction & Rendering
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
        // Optimized Mesh Logic
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
      // ECG Wave System
      const centerY = height / 2;
      const numWavePoints = 140;
      const step = width / numWavePoints;
      ctx.beginPath();
      ctx.lineWidth = 3;
      const waveGradient = ctx.createLinearGradient(0, 0, width, 0);
      waveGradient.addColorStop(0, 'rgba(20, 184, 166, 0)');
      waveGradient.addColorStop(0.3, 'rgba(20, 184, 166, 0.4)');
      waveGradient.addColorStop(0.5, 'rgba(243, 128, 32, 0.8)'); 
      waveGradient.addColorStop(0.7, 'rgba(20, 184, 166, 0.4)');
      waveGradient.addColorStop(1, 'rgba(20, 184, 166, 0)');
      ctx.strokeStyle = waveGradient;
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(20, 184, 166, 0.4)';
      for (let i = 0; i <= numWavePoints; i++) {
        const x = i * step;
        let y = Math.sin(i * 0.12 + offset) * 6;
        // Complex PQRST simulation
        const waveCycle = (i + Math.floor(offset * 5)) % 40;
        if (waveCycle === 2) y -= 12; // P
        if (waveCycle === 5) y -= 80; // R
        if (waveCycle === 6) y += 35; // S
        if (waveCycle === 12) y -= 15; // T
        // Mouse Depth Interaction
        const mouseDx = x - (width / 2 + currentParallaxX * width * 0.4);
        const mouseDist = Math.abs(mouseDx);
        if (mouseDist < 300) {
          const power = (300 - mouseDist) / 300;
          y += Math.sin(offset * 6) * 12 * power;
        }
        const renderX = x + parallaxShiftX * -0.6;
        const renderY = centerY + y + parallaxShiftY * -0.4;
        if (i === 0) ctx.moveTo(renderX, renderY);
        else ctx.lineTo(renderX, renderY);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      // Significantly slowed down ECG propagation from 0.035 to 0.012
      offset += 0.012;
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full pointer-events-none opacity-60"
    />
  );
}