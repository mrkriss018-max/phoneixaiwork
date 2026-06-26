document.addEventListener('DOMContentLoaded', () => {
    // --- Dynamic Content Rendering ---
    
    // Render Services
    const servicesGrid = document.getElementById('servicesGrid');
    if (servicesGrid && window.store && window.store.services) {
        window.store.services.forEach(service => {
            const delayClass = service.delay ? ` ${service.delay}` : '';
            servicesGrid.innerHTML += `
                <div class="service-card fade-up${delayClass}">
                    <div class="service-icon"><i class="${service.icon}"></i></div>
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                </div>
            `;
        });
    }

    // Render Portfolio
    const portfolioGrid = document.getElementById('portfolioGrid');
    if (portfolioGrid && window.store && window.store.portfolio) {
        window.store.portfolio.forEach(item => {
            const delayClass = item.delay ? ` ${item.delay}` : '';
            portfolioGrid.innerHTML += `
                <div class="portfolio-item fade-up${delayClass} play-video-btn" data-category="${item.category}" data-video="${item.videoUrl}">
                    <div class="portfolio-thumb">
                        <img src="${item.thumbnail}" alt="${item.title}">
                        <div class="play-overlay"><i class="fas fa-play"></i></div>
                    </div>
                    <div class="portfolio-info">
                        <span class="category-tag">${item.categoryLabel}</span>
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                </div>
            `;
        });
    }

    // Render Why Choose Me
    const whyGrid = document.getElementById('whyGrid');
    if (whyGrid && window.store && window.store.reasons) {
        window.store.reasons.forEach(reason => {
            const delayClass = reason.delay ? ` ${reason.delay}` : '';
            whyGrid.innerHTML += `
                <div class="why-card fade-up${delayClass}">
                    <div class="why-icon"><i class="${reason.icon}"></i></div>
                    <h3>${reason.title}</h3>
                    <p>${reason.description}</p>
                </div>
            `;
        });
    }

    // Render Reviews
    const reviewsGrid = document.getElementById('reviewsGrid');
    if (reviewsGrid && window.store && window.store.reviews) {
        window.store.reviews.forEach(review => {
            let starsHtml = '';
            for(let i=0; i<review.stars; i++){
                starsHtml += '<i class="fas fa-star"></i>';
            }
            reviewsGrid.innerHTML += `
                <div class="review-card">
                    <div class="review-stars">
                        ${starsHtml}
                    </div>
                    <p class="review-text">${review.text}</p>
                    <h4 class="reviewer-name">${review.author}</h4>
                </div>
            `;
        });
    }

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const nav = document.getElementById('nav');

    mobileToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if(nav.classList.contains('active')){
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Sticky Header
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50){
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth Scrolling & Active Link Update
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if(scrollY >= (sectionTop - sectionHeight / 3)){
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-list li a').forEach(a => {
            a.classList.remove('active');
            if(a.getAttribute('href') === '#' + current){
                a.classList.add('active');
            }
        });
    });

    // Intersection Observer for Scroll Animations
    const faders = document.querySelectorAll('.fade-up, .fade-left');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if(!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Portfolio Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if(filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Video Modal Logic
    const videoModal = document.getElementById('videoModal');
    const videoContainer = document.getElementById('videoContainer');
    const closeModal = document.getElementById('closeModal');
    const playBtns = document.querySelectorAll('.play-video-btn');

    playBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const videoSrc = btn.getAttribute('data-video');
            videoContainer.innerHTML = `
                <video controls autoplay name="media">
                    <source src="${videoSrc}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
            videoModal.classList.add('active');
        });
    });

    closeModal.addEventListener('click', () => {
        videoModal.classList.remove('active');
        videoContainer.innerHTML = ''; // Stop video
    });

    videoModal.addEventListener('click', (e) => {
        if(e.target === videoModal) {
            videoModal.classList.remove('active');
            videoContainer.innerHTML = '';
        }
    });

    // Form submission
    const form = document.getElementById('contactForm');
    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const projectType = document.getElementById('project').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if(!name || !email || !message) {
                alert("Please fill in all required fields.");
                return;
            }

            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;
            
            try {
                // According to the user, send POST with Content-Type: application/json
                // We use mode: 'no-cors' as a fallback if CORS is an issue, but standard fetch is used first
                const response = await fetch("https://script.google.com/macros/s/AKfycbwP401b4jfU1Ud7yXcf5rse9tIVtVdz9IGp3QD0bxpDuETFaXlKLiSWb4zLXnEpxEdl/exec", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        projecttype: projectType,
                        message: message
                    })
                });

                // Google Apps Script can sometimes return a redirect/HTML or a JSON
                if (response.ok || response.type === 'opaque') {
                    btn.innerHTML = 'Thank you! Your message has been sent successfully.';
                    btn.classList.remove('btn-primary');
                    btn.style.background = '#28a745';
                    form.reset();
                } else {
                    throw new Error("Failed to send message");
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                btn.innerHTML = 'Error sending message. Please try again.';
                btn.classList.remove('btn-primary');
                btn.style.background = '#dc3545';
            } finally {
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.classList.add('btn-primary');
                    btn.disabled = false;
                }, 4000);
            }
        });
    }

    // Photo Lightbox Logic
    const photoLightbox = document.getElementById('photoLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeLightbox = document.getElementById('closeLightbox');

    if (photoLightbox && lightboxImage && closeLightbox) {
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.photo-card');
            if (card) {
                const img = card.querySelector('.photo-wrapper img');
                if (img) {
                    lightboxImage.src = img.src;
                    photoLightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }
        });

        closeLightbox.addEventListener('click', () => {
            photoLightbox.classList.remove('active');
            lightboxImage.src = '';
            document.body.style.overflow = '';
        });

        photoLightbox.addEventListener('click', (e) => {
            if (e.target === photoLightbox) {
                photoLightbox.classList.remove('active');
                lightboxImage.src = '';
                document.body.style.overflow = '';
            }
        });
    }
});
