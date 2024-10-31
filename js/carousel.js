// carousel.js - Core carousel functionality
class Carousel {
    constructor(element, cards) {
        this.element = element;
        this.cards = cards;
        this.baseRadius = 820; // Base radius for large screens
        this.baseCardWidth = 400; // Base card width
        this.baseCardHeight = 700; // Base card height
        this.theta = (2 * Math.PI) / cards.length;
        this.currentRotation = 0;
        this.lastScrollTime = Date.now();
        

     // Touch handling properties
     this.touchStartX = 0;
     this.touchStartY = 0;
     this.isSwiping = false;
     this.minSwipeDistance = 50; // Minimum distance for a swipe to register
     

 // Pinch handling properties
 this.currentScale = 1;
 this.initialPinchDistance = 0;
 this.isPinching = false;
 this.minScale = 0.5;
 this.maxScale = 2.0;

     // Initial setup
     this.updateViewportDimensions();
     this.setupCards();
     this.setupControls();
     this.setupTouchControls(); // New touch controls setup
     
     // Add resize listener with debounce
     let resizeTimeout;
     window.addEventListener('resize', () => {
         clearTimeout(resizeTimeout);
         resizeTimeout = setTimeout(() => {
             this.updateViewportDimensions();
             this.updateCarouselScale();
             this.repositionCards();
         }, 100);
     });
 }

 // Calculate distance between two touch points
 getPinchDistance(touches) {
     return Math.hypot(
         touches[0].clientX - touches[1].clientX,
         touches[0].clientY - touches[1].clientY
     );
 }

 // Add new touch control setup method
 setupTouchControls() {
    this.element.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            // Initialize pinch
            this.isPinching = true;
            this.initialPinchDistance = this.getPinchDistance(e.touches);
            this.isSwiping = false;
        } else if (e.touches.length === 1) {
            // Initialize swipe
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.isSwiping = true;
            this.isPinching = false;
        }
    }, { passive: true });

    this.element.addEventListener('touchmove', (e) => {
        if (this.isPinching && e.touches.length === 2) {
            e.preventDefault();
            
            // Calculate new scale
            const currentDistance = this.getPinchDistance(e.touches);
            const scaleDelta = currentDistance / this.initialPinchDistance;
            let newScale = this.currentScale * scaleDelta;
            
            // Clamp scale within bounds
            newScale = Math.min(Math.max(newScale, this.minScale), this.maxScale);
            
            // Apply the scale transform while maintaining other transformations
            this.applyTransform(newScale);
            
        } else if (this.isSwiping && e.touches.length === 1) {
            const touchEndX = e.touches[0].clientX;
            const touchEndY = e.touches[0].clientY;
            const deltaX = touchEndX - this.touchStartX;
            const deltaY = touchEndY - this.touchStartY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                e.preventDefault();
            }
        }
    }, { passive: false });

    this.element.addEventListener('touchend', (e) => {
        if (this.isPinching) {
            const transforms = new DOMMatrix(getComputedStyle(this.element).transform);
            this.currentScale = transforms.a;
            this.isPinching = false;
        } else if (this.isSwiping && e.changedTouches.length === 1) {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - this.touchStartX;
            const deltaY = touchEndY - this.touchStartY;
            if (Math.abs(deltaX) > this.minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
                const direction = deltaX > 0 ? -1 : 1;
                this.rotate(direction);
            }
            this.isSwiping = false;
        }
    }, { passive: true });
}

updateViewportDimensions() {
    this.viewport = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    const viewportScale = Math.min(this.viewport.width, this.viewport.height) / 1920;
    this.radius = Math.min(this.baseRadius, this.baseRadius * viewportScale * 1.2);

    const cardScale = Math.min(
        1,
        (this.viewport.width / 1920),
        (this.viewport.height / 1080)
    );

    this.cardSize = {
        width: this.baseCardWidth * cardScale * 0.8,
        height: this.baseCardHeight * cardScale * 0.8
    };
}


    updateCarouselScale() {
        // Calculate overall carousel scale
        const carouselScale = Math.min(
            1.3,
            (this.viewport.width * 1) / (this.radius * 1),
            (this.viewport.height * 1) / (this.radius * 1)
        );
        
        this.element.style.transform = `
            scale(${carouselScale}) 
            rotateX(-10deg) 
            rotateY(${this.currentRotation}rad)
        `;
    }

    setupCards() {
        this.cards.forEach((card, i) => {
            const element = document.createElement('div');
            element.className = 'card';
            element.innerHTML = `<img src="${card.imageUrl}" alt="${card.title}" loading="lazy">`;
            
            this.positionCard(element, i);
            element.addEventListener('click', () => this.showPopup(card));
            this.element.appendChild(element);
        });
    }

        positionCard(element, index) {
        const angle = this.theta * index;
        const x = this.radius * Math.sin(angle);
        const z = this.radius * Math.cos(angle);
        
        // Adjust the card positioning to maintain consistent gaps
        const cardScale = Math.min(
            1,
            this.cardSize.width / this.baseCardWidth,
            this.cardSize.height / this.baseCardHeight
        );
        
        element.style.transform = `
            translate(-50%, -50%)
            translate3d(${x}px, 0, ${z}px)
            rotateY(${angle}rad)
            scale(${cardScale})
        `;
        
        // Set base size
        element.style.width = `${this.baseCardWidth}px`;
        element.style.height = `${this.baseCardHeight}px`;
    }

    repositionCards() {
        const cards = this.element.querySelectorAll('.card');
        cards.forEach((card, i) => this.positionCard(card, i));
    }

    showPopup(card) {
        const popup = document.querySelector('.popup-overlay');
        const title = document.getElementById('popup-title');
        const content = document.getElementById('popup-content');
        
        // Clear existing content
        content.innerHTML = '';
        title.textContent = card.title;
        
        // Create responsive wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'popup-content-wrapper';
        
        // Handle video content
        if (card.videoUrl) {
            const videoContainer = document.createElement('div');
            videoContainer.style.cssText = `
                position: relative;
                width: 100%;
                padding-top: 45.25%; /* 16:9 Aspect ratio */
            `;
            
            let videoEmbed;
            if (card.videoUrl.includes('youtube.com') || card.videoUrl.includes('youtu.be')) {
                const videoId = card.videoUrl.includes('youtube.com') 
                    ? card.videoUrl.split('v=')[1]?.split('&')[0]
                    : card.videoUrl.split('youtu.be/')[1];
                videoEmbed = document.createElement('iframe');
                videoEmbed.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                videoEmbed.allow = 'autoplay; encrypted-media; picture-in-picture';
            } else if (card.videoUrl.includes('vimeo.com')) {
                const videoId = card.videoUrl.split('vimeo.com/')[1];
                videoEmbed = document.createElement('iframe');
                videoEmbed.src = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
                videoEmbed.allow = 'autoplay; fullscreen; picture-in-picture';
            } else {
                videoEmbed = document.createElement('video');
                videoEmbed.src = card.videoUrl;
                videoEmbed.controls = true;
                videoEmbed.autoplay = true;
            }
            
            videoEmbed.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
                border-radius: 8px;
            `;
            
            videoContainer.appendChild(videoEmbed);
            wrapper.appendChild(videoContainer);
        }
        
        // Add description with responsive text
        const description = document.createElement('p');
        description.textContent = card.description;
        description.style.cssText = `
            font-size: clamp(14px, 2vw, 18px);
            line-height: 1.6;
            margin-top: 20px;
            max-width: 80ch;
            margin: 0 auto;
        `;
        
        wrapper.appendChild(description);
        content.appendChild(wrapper);
        
        // Show popup
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Setup close functionality
        this.setupPopupClose(popup, content);
    }

    setupPopupClose(popup, content) {
        const closePopup = () => {
            popup.style.display = 'none';
            document.body.style.overflow = '';
            content.innerHTML = '';
        };
        
        const closeButton = popup.querySelector('.close-button');
        closeButton.onclick = closePopup;
        popup.onclick = (e) => {
            if (e.target === popup) closePopup();
        };
        
        window.addEventListener('keydown', function handler(e) {
            if (e.key === 'Escape') {
                closePopup();
                window.removeEventListener('keydown', handler);
            }
        });
    }

    rotate(direction) {
        this.currentRotation += direction * (this.theta / 2);
        this.updateCarouselScale();
    }

    setupControls() {
        window.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            const now = Date.now();
            if (now - this.lastScrollTime < 50) return;
            this.lastScrollTime = now;

            const direction = e.deltaY > 0 ? 1 : -1;
            this.rotate(direction);
            
        }, { passive: false });
    }
}
// app.js - Application initialization
const cardData = [
    {
        title: "Overthought 2100",
        description: "Overthought 2100 is a speculative future of the west. Visualized through live footage with 3d model compositing and VFX. With the way we see 'free speech and expression' being affected in the past decade or two in reality, for better or worse, we can imagine what the world would look like if we went so far left that we reach authoritarian control of what's politically correct. A society where truly free thought has been phased out over 70 years through combining cancel culture/wokeness with harsh prosecution and capital punishment, followed by censorship of novels, philosophies, hate groups, and any expression that reinforces or spreads topics of controversy. This is a detailed description for Project 1. You can add specific details about the project, technologies used, and outcomes achieved.",
        videoUrl: "https://vimeo.com/1021344781?share=copy",
        imageUrl: "/folio/images/img1_.png"
      },
      {
        title: "Barbican Expansion",
        description: "Filmed at the Barbican Centre in London, short form content for socials.",
        videoUrl: "/folio/images/video2.mp4",
        imageUrl: "/folio/images/img2_.png"
      },
      {
        title: "CCTV: Commonly Confused Tracking Visuals",
        description: "oo the classic red motion/facial tracking square! Do you hate being tracked? It’s your lucky day because now you can rest assured knowing that you’re not as important as you may think and unless you threaten public safety or the state you’ll be fine!!! :)",
        videoUrl: "/folio/images/video3.mp4",
        imageUrl: "/folio/images/img3_.png"
      },
      {
        title: "Video: The Consumer Medium",
        description: "Video content is being consumed more than ever as we see apps like Instagram and Facebook following TikTok's lead in promoting short video content as the standard. Immeasurable variety of content. Viral is no longer a word of any substance. We are now able to consume more content, more frequently, with more variety, than ever before. This is the current state of video, take a few minutes to observe the madness of it, bask in its absurdity. Acknowledge your ability to consume a style of video before and after forms that're wildly different ---- or feel free to continue scrolling.",
        videoUrl: "https://youtu.be/HoLc3T0ftzU",
        imageUrl: "/folio/images/img4_.png"
      },
      {
        title: "Project 5",
        description: "Project 5 combines aesthetic appeal with practical utility. Describe the key features and benefits of this project.",
        videoUrl: "/folio/images/video5.mp4",
        imageUrl: "/folio/images/img5_.png"
      },
      {
        title: "Project 6",
        description: "Project 6 pushes boundaries in interactive design. Detail the innovative approaches and technologies used here.",
        videoUrl: "/folio/images/video6.mp4",
        imageUrl: "/folio/images/img6_.png"
      },
      {
        title: "Everything is layers",
        description: "Short form video edit for socials, filmed at a neighbourhood centre in Suzhou, China",
        videoUrl: "https://youtu.be/xj5QK23z2cY",
        imageUrl: "/folio/images/img7_.png"
      },
      {
        title: "Anomaly.exe",
        description: "A part of the Overthought 2100 worldbuilding project, Anomoly.exe is a rebellious organisation that is one of ",
        videoUrl: "/folio/images/video8.mp4",
        imageUrl: "/folio/images/img8_.png"
      }

    // Add more cards as needed
];
// Update your existing event listener
document.addEventListener('DOMContentLoaded', () => {
    const carousel = new Carousel(
        document.querySelector('.carousel'),
        cardData
    );


// Add bio button handler
const bioButton = document.getElementById('bio');
bioButton.addEventListener('click', showBioOverlay);
});


    function showBioOverlay() {
        const overlay = document.getElementById('bio-overlay');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        overlay.style.display = 'flex'; // makes shit visible innit
        

        // Handle close button click
        const closeButton = overlay.querySelector('.close-button');
        const closeOverlay = () => {
            overlay.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        };
    
        closeButton.onclick = closeOverlay;
        
        // Close on overlay background click
        overlay.onclick = (e) => {
            if (e.target === overlay) closeOverlay();
        };
    
        // Add escape key listener
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeOverlay();
                window.removeEventListener('keydown', escapeHandler);
            }
        };
        window.addEventListener('keydown', escapeHandler);
    }
    

    // Assuming your `contact` button has an ID of "contact"
document.getElementById('contact').addEventListener('click', () => {
    import('./ContactForm.js').then(module => {
        module.showContactForm();
    });
});

