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
      // Mouse interaction kept for nodes, but separated from wave logic
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
    let offset = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      if (opacityRef.current < 1) opacityRef.current += 0.005;
      // Smoothed parallax for nodes
      currentParallaxX += (mouseRef.current.targetX - currentParallaxX) * 0.05;
      currentParallaxY += (mouseRef.current.targetY - currentParallaxY) * 0.05;
      // Background Nodes: Keep parallax for depth
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
      // ECG Wave System: Strictly Horizontal & Linear
      // centerY is fixed to ensure no vertical jitter
      const centerY = height / 2;
      const numWavePoints = 140;
      const step = width / numWavePoints;
      ctx.beginPath();
      ctx.lineWidth = 2.5; // Slightly refined line width for clinical look
      const waveGradient = ctx.createLinearGradient(0, 0, width, 0);
      waveGradient.addColorStop(0, 'rgba(20, 184, 166, 0)');
      waveGradient.addColorStop(0.2, 'rgba(20, 184, 166, 0.3)');
      waveGradient.addColorStop(0.5, 'rgba(243, 128, 32, 0.7)'); // Orange peak highlight
      waveGradient.addColorStop(0.8, 'rgba(20, 184, 166, 0.3)');
      waveGradient.addColorStop(1, 'rgba(20, 184, 166, 0)');
      ctx.strokeStyle = waveGradient;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(20, 184, 166, 0.2)';
      // We calculate the wave from right-to-left
      // offset controls the horizontal propagation
      for (let i = 0; i <= numWavePoints; i++) {
        const x = i * step;
        // Base sine for idle pulse
        let y = Math.sin(i * 0.15 + offset) * 3;
        // PQRST Peak Logic
        // The cycle is based on horizontal position + global time offset
        // This creates the "moving through" effect from right to left
        const waveCycle = (i + Math.floor(offset * 6)) % 45;
        if (waveCycle === 2) y -= 10;   // P wave
        if (waveCycle === 5) y -= 70;   // R peak
        if (waveCycle === 6) y += 30;   // S wave
        if (waveCycle === 12) y -= 12;  // T wave
        // NO Mouse proximity vertical jitter or Parallax Y shift applied to wave
        const renderX = x; 
        const renderY = centerY + y;
        if (i === 0) ctx.moveTo(renderX, renderY);
        else ctx.lineTo(renderX, renderY);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      // offset increment controls speed of right-to-left flow
      // 0.01 is calm and professional
      offset += 0.01;
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
      className="w-full h-full pointer-events-none opacity-50"
    />
  );
}