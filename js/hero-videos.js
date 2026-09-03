document.addEventListener('DOMContentLoaded', () => {
    // SINGLE SOURCE OF TRUTH FOR HERO VIDEOS
    const heroVideos = [
        {
            src: "assets/herovideo1.MP4",
            poster: "assets/poster1.jpg",
            gridClass: "hero-vid-1" // Large portrait
        },
        {
            src: "assets/herovideo2.mp4",
            poster: "assets/poster2.jpg",
            gridClass: "hero-vid-2" // Medium landscape
        },
        {
            src: "assets/herovideo3.MP4",
            poster: "assets/poster3.jpg",
            gridClass: "hero-vid-3" // Small portrait
        },
        {
            src: "assets/herovideo4.MP4",
            poster: "assets/poster4.jpg",
            gridClass: "hero-vid-4" // Small landscape
        },
        {
            src: "assets/herovideo5.MP4",
            poster: "assets/poster5.jpg",
            gridClass: "hero-vid-5" // Medium landscape
        },
        {
            src: "assets/herovideo6.mp4",
            poster: "assets/poster6.jpg",
            gridClass: "hero-vid-6" // Narrow portrait
        },
        {
            src: "assets/herovideo7.mp4",
            poster: "assets/poster7.jpg",
            gridClass: "hero-vid-7" // Medium cinematic
        }
    ];

    const collageContainer = document.getElementById('heroVideoCollage');
    if (!collageContainer) return;

    // 1. Render Video Tiles
    heroVideos.forEach((vid) => {
        const tile = document.createElement('div');
        tile.className = `hero-video-tile ${vid.gridClass}`;
        
        // Create actual video element
        const videoEl = document.createElement('video');
        videoEl.muted = true;
        videoEl.loop = true;
        videoEl.playsInline = true;
        videoEl.preload = "metadata";
        
        // Add poster if needed, we'll just set it
        if(vid.poster) videoEl.poster = vid.poster;

        const sourceEl = document.createElement('source');
        sourceEl.src = vid.src;
        sourceEl.type = "video/mp4";
        videoEl.appendChild(sourceEl);

        tile.appendChild(videoEl);
        collageContainer.appendChild(tile);
    });

    // 3. Intersection Observer for Performance (Play when visible, pause when hidden)
    const videos = collageContainer.querySelectorAll('video');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Play all videos
                videos.forEach(v => {
                    const playPromise = v.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            // Autoplay was prevented, usually requires user interaction first on some browsers
                            console.log("Autoplay prevented:", error);
                        });
                    }
                });
            } else {
                // Pause all videos to save CPU/Battery
                videos.forEach(v => v.pause());
            }
        });
    }, { 
        threshold: 0.1 // Trigger when at least 10% of the collage is visible
    });

    observer.observe(collageContainer);
});
