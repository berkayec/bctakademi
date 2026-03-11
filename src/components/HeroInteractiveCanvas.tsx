import React, { useEffect, useRef } from 'react';
export function HeroInteractiveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = 400);
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = 400;
    };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    // ECG Wave Parameters
    let offset = 0;
    const points: { x: number; y: number }[] = [];
    const numPoints = 100;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const centerY = height / 2;
      const step = width / numPoints;
      ctx.beginPath();
      ctx.lineWidth = 2;
      // Gradient for the stroke
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, 'rgba(20, 184, 166, 0)');
      gradient.addColorStop(0.2, 'rgba(20, 184, 166, 0.4)');
      gradient.addColorStop(0.5, 'rgba(20, 184, 166, 0.8)');
      gradient.addColorStop(0.8, 'rgba(20, 184, 166, 0.4)');
      gradient.addColorStop(1, 'rgba(20, 184, 166, 0)');
      ctx.strokeStyle = gradient;
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(20, 184, 166, 0.5)';
      for (let i = 0; i <= numPoints; i++) {
        const x = i * step;
        // Base sine wave
        let y = Math.sin(i * 0.2 + offset) * 10;
        // Simulate ECG "QRS complex" spikes at intervals
        if ((i + Math.floor(offset * 5)) % 40 === 0) {
          y -= 80; // R wave
        } else if ((i + Math.floor(offset * 5)) % 40 === 1) {
          y += 30; // S wave
        } else if ((i + Math.floor(offset * 5)) % 40 === 39) {
          y += 20; // Q wave
        }
        // Mouse interaction: distort wave near cursor
        const dx = x - mouseRef.current.x;
        const dist = Math.sqrt(dx * dx);
        if (dist < 200) {
          const force = (200 - dist) / 200;
          y += Math.sin(offset * 10) * 20 * force;
        }
        if (i === 0) ctx.moveTo(x, centerY + y);
        else ctx.lineTo(x, centerY + y);
      }
      ctx.stroke();
      // Add a subtle technical grid overlay
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      offset += 0.05;
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
      className="w-full h-[400px] pointer-events-none opacity-40"
    />
  );
}