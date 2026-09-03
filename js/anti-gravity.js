document.addEventListener('DOMContentLoaded', () => {
    const portfolioSection = document.getElementById('portfolio');
    if (!portfolioSection) return;

    const videoBoxes = portfolioSection.querySelectorAll('.featured-video-box');
    if (videoBoxes.length === 0) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // To prevent Safari/iOS hit-testing touch bugs (which blocked clicking/unmuting),
    // we strictly REMOVE true CSS perspective and preserve-3d.
    // Instead, we will simulate Z-depth perfectly using scale(), keeping the elements firmly on the clickable 2D plane!
    
    // 3D configuration for the 8 videos (matching user requirements)
    const configs = [
        { z: -50,  floatX: 8,  floatY: 12, rotX: -2,   rotY: 1,   speed: 0.0008, phase: 0 },
        { z: -150, floatX: -6, floatY: -10, rotX: 1,   rotY: -1,  speed: 0.0005, phase: 1.2 },
        { z: -100, floatX: 10, floatY: -8,  rotX: -1,  rotY: 0.5, speed: 0.0006, phase: 2.4 },
        { z: -200, floatX: -12,floatY: 12,  rotX: 2,   rotY: -1.5,speed: 0.0004, phase: 3.6 },
        { z: -75,  floatX: 6,  floatY: -10, rotX: -1.5,rotY: 1,   speed: 0.0007, phase: 4.8 },
        { z: -175, floatX: -8, floatY: 8,   rotX: 1,   rotY: -0.5,speed: 0.0005, phase: 6.0 },
        { z: -100, floatX: 12, floatY: -6,  rotX: -2,  rotY: 2,   speed: 0.0006, phase: 7.2 },
        { z: -200, floatX: -10,floatY: -12, rotX: 1.5, rotY: -1,  speed: 0.0004, phase: 8.4 }
    ];

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let hoveredBoxIndex = -1;

    // Track mouse over the entire section for parallax
    portfolioSection.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 768) return; // Disable complex parallax on mobile
        
        const rect = portfolioSection.getBoundingClientRect();
        // Normalize to -1 to 1
        targetMouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        targetMouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    });

    portfolioSection.addEventListener('mouseleave', () => {
        targetMouseX = 0;
        targetMouseY = 0;
    });

    // We need current values for each box to lerp smoothly
    const currentValues = Array.from({length: videoBoxes.length}).map(() => ({
        z: 0,
        rotX: 0,
        rotY: 0,
        scale: 1,
        boxShadowAlpha: 0.5,
        boxShadowGlow: 0
    }));

    // Setup each box
    videoBoxes.forEach((box, index) => {
        // Initial setup for transitions (disable CSS transitions for transforms, we handle via JS)
        box.style.transition = 'none';
        box.style.willChange = 'transform, box-shadow';
        
        // Hover effects
        box.addEventListener('mouseenter', () => {
            hoveredBoxIndex = index;
            box.style.zIndex = '10';
        });
        
        box.addEventListener('mouseleave', () => {
            if(hoveredBoxIndex === index) hoveredBoxIndex = -1;
            box.style.zIndex = '1';
        });
    });

    // Lerp function for smooth interpolation
    const lerp = (start, end, factor) => start + (end - start) * factor;

    // Animation loop
    function animate() {
        if (window.innerWidth > 768) {
            // Smooth mouse interpolation
            mouseX = lerp(mouseX, targetMouseX, 0.05);
            mouseY = lerp(mouseY, targetMouseY, 0.05);
        } else {
            mouseX = 0;
            mouseY = 0;
        }

        const now = Date.now();

        // Only animate if section is somewhat in viewport to save CPU
        const rect = portfolioSection.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;

        if (inViewport) {
            videoBoxes.forEach((box, index) => {
                const config = configs[index % configs.length];
                const current = currentValues[index];
                
                // If mobile, reduce effect drastically
                const isMobile = window.innerWidth <= 768;
                const mobileMultiplier = isMobile ? 0.2 : 1;
                
                // Target values based on base config
                let targetZ = config.z * mobileMultiplier;
                let targetRotX = config.rotX * mobileMultiplier;
                let targetRotY = config.rotY * mobileMultiplier;
                let targetHoverScale = 1;
                let targetShadowAlpha = 0.5;
                let targetShadowGlow = 0;

                // Hover override (only on desktop)
                if (!isMobile) {
                    if (hoveredBoxIndex === index) {
                        targetZ = 30; // Pop forward
                        targetHoverScale = 1.03;
                        // Rotate slightly toward cursor
                        targetRotX = -targetMouseY * 5;
                        targetRotY = targetMouseX * 5;
                        targetShadowAlpha = 0.8;
                        targetShadowGlow = 0.2;
                    } else if (hoveredBoxIndex !== -1) {
                        // Push others slightly back when one is hovered
                        targetZ -= 20;
                    }
                }

                // Lerp current values towards target values
                const lerpFactor = (hoveredBoxIndex === index) ? 0.1 : 0.05;
                current.z = lerp(current.z, targetZ, lerpFactor);
                current.rotX = lerp(current.rotX, targetRotX, lerpFactor);
                current.rotY = lerp(current.rotY, targetRotY, lerpFactor);
                current.scale = lerp(current.scale, targetHoverScale, lerpFactor);
                current.boxShadowAlpha = lerp(current.boxShadowAlpha, targetShadowAlpha, lerpFactor);
                current.boxShadowGlow = lerp(current.boxShadowGlow, targetShadowGlow, lerpFactor);

                // Continuous float (added directly to transform, not lerped to preserve organic math)
                const floatOffset = Math.sin(now * config.speed + config.phase);
                const xFloat = floatOffset * config.floatX * mobileMultiplier;
                const yFloat = Math.cos(now * config.speed * 0.8 + config.phase) * config.floatY * mobileMultiplier;

                // Parallax depth intensity (closer objects move more)
                const depthFactor = (1000 + config.z) / 1000; 
                
                let xParallax = mouseX * 30 * depthFactor;
                let yParallax = mouseY * 30 * depthFactor;

                // SIMULATED Z-DEPTH VIA SCALE
                // Instead of moving them backward in 3D space (which breaks touch events),
                // we calculate what the scale WOULD be in a 1200px perspective camera.
                const simulatedZScale = (1200 + current.z) / 1200;
                const finalScale = simulatedZScale * current.scale;

                // Final transform (Z is kept strictly at 0px to ensure clickability)
                box.style.transform = `
                    translate3d(${xFloat + xParallax}px, ${yFloat + yParallax}px, 0px) 
                    rotateX(${current.rotX}deg) 
                    rotateY(${current.rotY}deg)
                    scale(${finalScale})
                `;
                
                box.style.boxShadow = `0 10px 30px rgba(0, 0, 0, ${current.boxShadowAlpha}), 0 0 20px rgba(128, 0, 255, ${current.boxShadowGlow})`;
            });
        }

        requestAnimationFrame(animate);
    }

    // Start loop
    requestAnimationFrame(animate);
});
