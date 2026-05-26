document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Set dynamic year for copyright
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.innerHTML = `&copy; ${new Date().getFullYear()} Syauqi Arkan. All rights reserved.`;
    }

    // 3. Hero animations on load
    setTimeout(() => {
        const heroContent = document.getElementById('hero-content');
        if (heroContent) {
            heroContent.classList.remove('opacity-0', 'scale-90');
            heroContent.classList.add('opacity-100', 'scale-100');
        }
        
        const heroButtons = document.getElementById('hero-buttons');
        if (heroButtons) {
            heroButtons.classList.remove('opacity-0', 'translate-y-5');
            heroButtons.classList.add('opacity-100', 'translate-y-0');
        }
    }, 100);

    // 4. Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Special handle for skill bars
                if (entry.target.classList.contains('skill-fill')) {
                    const width = entry.target.getAttribute('data-width');
                    entry.target.style.width = width + '%';
                    entry.target.style.transform = 'scaleX(1)';
                }

                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe standard animated elements
    document.querySelectorAll('[data-animate]').forEach((el) => {
        observer.observe(el);
    });

    // Observe skill bars specifically since they are nested
    document.querySelectorAll('.skill-fill').forEach((el) => {
        observer.observe(el);
    });

    // 5. Particle Canvas Background (Translated from React component)
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        const connectionDistance = 150;
        const colors = ['#ffffff', '#e0b0ff', '#b026ff', '#7000ff', '#ff00ff'];
        let mouse = { x: -1000, y: -1000 };
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const initParticles = () => {
            const count = window.innerWidth < 768 ? 50 : 120;
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 2.5,
                    vy: (Math.random() - 0.5) * 2.5,
                    size: Math.random() * 2.5 + 1.2,
                    color: colors[Math.floor(Math.random() * colors.length)],
                });
            }
        };

        const draw = () => {
            time += 0.05;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                p.x += p.vx + Math.sin(time + i) * 0.3;
                p.y += p.vy + Math.cos(time + i) * 0.3;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                const mdx = mouse.x - p.x;
                const mdy = mouse.y - p.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                
                if (mdist < 200) {
                    const angle = Math.atan2(mdy, mdx);
                    const force = (200 - mdist) / 200;
                    p.x -= Math.cos(angle) * force * 8;
                    p.y -= Math.sin(angle) * force * 8;
                }

                const pulse = Math.sin(time * 1.5 + i) * 0.4 + 1;
                const currentSize = p.size * pulse;

                ctx.beginPath();
                ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = 0.6;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    
                    if (Math.abs(dx) < connectionDistance && Math.abs(dy) < connectionDistance) {
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < connectionDistance) {
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = p.color;
                            ctx.globalAlpha = (1 - dist / connectionDistance) * 0.3;
                            ctx.lineWidth = 0.8;
                            ctx.stroke();
                        }
                    }
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        
        // Initial setup
        resize();
        draw();
    }
});
