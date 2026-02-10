import { useEffect, useRef } from "react";

export const BackgroundParticles = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;
            isFloater: boolean;
            opacity: number;
            opacitySpeed: number;

            constructor(type: 'connected' | 'floater') {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;

                // Check if dark mode is active to determine init colors
                const isDark = document.documentElement.classList.contains("dark");
                const darkColors = ["139, 92, 246", "234, 179, 8", "16, 185, 129"]; // violet, yellow, emerald
                const lightColors = ["79, 70, 229", "234, 88, 12", "14, 165, 233"]; // indigo, orange, sky
                const colors = isDark ? darkColors : lightColors;
                const baseColor = colors[Math.floor(Math.random() * colors.length)];
                this.color = baseColor;

                if (type === 'floater') {
                    this.isFloater = true;
                    this.size = Math.random() * 36 + 22; // Increased again by 20%: ~22-58px
                    this.vx = (Math.random() - 0.5) * 0.15;
                    this.vy = (Math.random() - 0.5) * 0.15 - 0.05;
                    this.opacity = 0;
                    this.opacitySpeed = Math.random() * 0.005 + 0.002;
                } else {
                    this.isFloater = false;
                    this.size = Math.random() * 3 + 1.5; // Increased again by 20%
                    this.vx = (Math.random() - 0.5) * 0.5;
                    this.vy = (Math.random() - 0.5) * 0.5;
                    this.opacity = 0.8;
                    this.opacitySpeed = 0;
                }
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Wall collision/wrap
                if (this.x < 0) this.x = canvas!.width;
                if (this.x > canvas!.width) this.x = 0;
                if (this.y < 0) this.y = canvas!.height;
                if (this.y > canvas!.height) this.y = 0;

                // Floater pulse animation
                if (this.isFloater) {
                    this.opacity += this.opacitySpeed;
                    if (this.opacity > 0.5 || this.opacity < 0.1) {
                        this.opacitySpeed *= -1;
                    }
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

                // Re-check theme for dynamic color switching (optional optimization: store in a context)
                // For simplicity, we stick to the initialized color but apply theme-based opacity/blending
                const isDark = document.documentElement.classList.contains("dark");

                // Floaters get a glow
                if (this.isFloater) {
                    ctx.shadowBlur = isDark ? 15 : 5;
                    ctx.shadowColor = `rgba(${this.color}, 0.8)`;
                    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                } else {
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = `rgba(${this.color}, ${isDark ? 0.8 : 0.6})`; // Increased opacity
                }

                ctx.fill();
            }
        }

        const init = () => {
            resize();
            particles = [];

            // Create Connected Network (Background Mesh)
            for (let i = 0; i < 30; i++) {
                particles.push(new Particle('connected'));
            }

            // Create Floating Orbs (Increased count & size)
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle('floater'));
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                p.update();
                p.draw();

                // Connect particles close to each other (ONLY connected types)
                if (!p.isFloater) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        if (!p2.isFloater) {
                            const dx = p.x - p2.x;
                            const dy = p.y - p2.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);

                            if (dist < 100) {
                                ctx.beginPath();
                                ctx.strokeStyle = `rgba(${p.color}, ${1 - dist / 100})`;
                                ctx.lineWidth = 0.5;
                                ctx.moveTo(p.x, p.y);
                                ctx.lineTo(p2.x, p2.y);
                                ctx.stroke();
                            }
                        }
                    }
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resize);
        init();
        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none opacity-80"
        />
    );
};
