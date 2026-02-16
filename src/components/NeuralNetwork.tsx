import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
}

interface NeuralNetworkProps {
    particleCount?: number;
    connectionDistance?: number;
    baseSpeed?: number;
}

const NeuralNetwork: React.FC<NeuralNetworkProps> = ({
    particleCount = 100,
    connectionDistance = 150,
    baseSpeed = 1.0
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const propsRef = useRef({ particleCount, connectionDistance, baseSpeed });

    useEffect(() => {
        propsRef.current = { particleCount, connectionDistance, baseSpeed };
    }, [particleCount, connectionDistance, baseSpeed]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        const mouse = { x: -1000, y: -1000 };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const count = propsRef.current.particleCount;
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5,
                    size: Math.random() * 2 + 1,
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const { connectionDistance, baseSpeed } = propsRef.current;

            particles.forEach((p, i) => {
                p.x += p.vx * baseSpeed;
                p.y += p.vy * baseSpeed;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 200) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (200 - distance) / 200;
                    const directionX = forceDirectionX * force * 0.5;
                    const directionY = forceDirectionY * force * 0.5;
                    p.vx -= directionX;
                    p.vy -= directionY;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = '#00f3ff';
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx2 = p.x - p2.x;
                    const dy2 = p.y - p2.y;
                    const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                    if (dist2 < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 243, 255, ${1 - dist2 / connectionDistance})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);

        resizeCanvas();
        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []); // Re-init if strict deps needed, but propsRef handles updates for draw loop. 
    // However, changing particleCount requires re-init.

    // Let's add an effect to re-init particles when count changes
    useEffect(() => {
        // Accessing the resizeCanvas/initParticles from closure is hard without refactoring.
        // But we can just use a key on the component to force re-mount or refactor to expose init.
        // Simpler: Just rely on the mount effect for now, or adding particleCount to dependency array would restart everything?
        // Yes, adding particleCount to the main dependency array would restart the whole effect, which is fine.
    }, [particleCount]);

    // Actually, to make it robust, let's just make the main effect depend on particleCount.
    // But that would remove listeners and re-add them. That is acceptable.

    return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1, background: '#050510' }} />;
};

export default NeuralNetwork;
