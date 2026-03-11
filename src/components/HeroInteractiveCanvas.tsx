import React, { useEffect, useRef } from 'react';
interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originalX: number;
  originalY: number;
}
export function HeroInteractiveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
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
      // Normalized coordinates from -1 to 1 for parallax
      mouseRef.current.targetX = (x / width - 0.5) * 2;
      mouseRef.current.targetY = (y / height - 0.5) * 2;
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    // Node System
    const nodes: Node[] = [];
    const nodeCount = Math.floor((width * height) / 15000); // Responsive density
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
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }
    };
    initNodes();
    let offset = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      // Smooth parallax transition
      currentParallaxX += (mouseRef.current.targetX - currentParallaxX) * 0.05;
      currentParallaxY += (mouseRef.current.targetY - currentParallaxY) * 0.05;
      const parallaxShiftX = currentParallaxX * 30;
      const parallaxShiftY = currentParallaxY * 30;
      // Draw Tech Grid Lines (Connected Nodes)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        // Update position with subtle drift
        node.originalX += node.vx;
        node.originalY += node.vy;
        // Wrap around
        if (node.originalX < 0) node.originalX = width;
        if (node.originalX > width) node.originalX = 0;
        if (node.originalY < 0) node.originalY = height;
        if (node.originalY > height) node.originalY = 0;
        // Apply Parallax to current rendering position
        node.x = node.originalX + parallaxShiftX;
        node.y = node.originalY + parallaxShiftY;
        // Draw node
        ctx.fillStyle = 'rgba(20, 184, 166, 0.4)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        // Check distance to other nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const opacity = (1 - dist / 180) * 0.2;
            ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      }
      // ECG Wave Section
      const centerY = height / 2;
      const numWavePoints = 120;
      const step = width / numWavePoints;
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      const waveGradient = ctx.createLinearGradient(0, 0, width, 0);
      waveGradient.addColorStop(0, 'rgba(20, 184, 166, 0)');
      waveGradient.addColorStop(0.2, 'rgba(20, 184, 166, 0.3)');
      waveGradient.addColorStop(0.5, 'rgba(20, 184, 166, 0.8)');
      waveGradient.addColorStop(0.8, 'rgba(20, 184, 166, 0.3)');
      waveGradient.addColorStop(1, 'rgba(20, 184, 166, 0)');
      ctx.strokeStyle = waveGradient;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(20, 184, 166, 0.6)';
      for (let i = 0; i <= numWavePoints; i++) {
        const x = i * step;
        let y = Math.sin(i * 0.15 + offset) * 8;
        // ECG Complex
        const waveIndex = (i + Math.floor(offset * 6)) % 40;
        if (waveIndex === 0) y -= 90; // R
        else if (waveIndex === 1) y += 35; // S
        else if (waveIndex === 39) y += 20; // Q
        // Mouse influence on wave (Opposite parallax for depth effect)
        const mouseDx = x - (width / 2 + currentParallaxX * width * 0.4);
        const mouseDist = Math.abs(mouseDx);
        if (mouseDist < 250) {
          const power = (250 - mouseDist) / 250;
          y += Math.sin(offset * 8) * 15 * power;
        }
        const renderX = x + parallaxShiftX * -0.5; // Inverse parallax for depth
        const renderY = centerY + y + parallaxShiftY * -0.5;
        if (i === 0) ctx.moveTo(renderX, renderY);
        else ctx.lineTo(renderX, renderY);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      offset += 0.04;
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