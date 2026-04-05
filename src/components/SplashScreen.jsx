import React, { useState, useEffect, useRef } from 'react';

export default function SplashScreen() {
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // 1. 5-second Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 5000); // Ready after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  // 2. Geometric Nodes Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas to parent container bounds
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Create random particles
    const particles = Array.from({ length: 30 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
    }));

    const startTime = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = Date.now() - startTime;

      particles.forEach((p, i) => {
        // Move nodes for ~5 seconds, then smoothly stop
        if (elapsed > 4000) {
          p.vx *= 0.92;
          p.vy *= 0.92;
        }
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(50, 50, 50, 0.5)';
        ctx.fill();

        // Connect nodes that are close to each other
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          
          if (dist < 130) {
            ctx.beginPath();
            // Opacity increases as nodes get closer
            const opacity = 1 - dist / 130;
            ctx.strokeStyle = `rgba(50, 50, 50, ${opacity * 0.2})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // If the user clicked continue, don't render the splash screen anymore
  if (isDismissed) return null;

  return (
    <div 
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#F8F4E9', color: '#333333', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} 
      onClick={() => isReady && setIsDismissed(true)}
    >
      
      <div style={{ position: 'relative', width: '100%', maxWidth: '600px', height: '250px', marginBottom: '2rem' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
      </div>
        
      <div style={{ textAlign: 'center', maxWidth: '600px', padding: '0 20px' }}>
        <h1 className="main-name">desktop experience recommended</h1>
        <p className="subtitle" style={{ marginBottom: '40px' }}>
          this environment is highly interactive and is best viewed on a desktop or laptop device.
        </p>

        <div style={{ height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {isReady && (
            <span style={{ color: '#333333', fontWeight: '500', letterSpacing: '1px' }}>
              all connections established. click anywhere to continue.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}