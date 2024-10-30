// carousel.js - Core carousel functionality
class Carousel {
    constructor(element, cards) {
        this.element = element;
        this.cards = cards;
        // Increase radius for a wider circle
        this.radius = 620;
        // Calculate angle between each card
        this.theta = (2 * Math.PI) / cards.length;
        this.currentRotation = 0;
        this.lastScrollTime = Date.now();    
        this.setupCards();
        this.setupControls();
    }

    setupCards() {
        this.cards.forEach((card, i) => {
            const element = document.createElement('div');
            element.className = 'card';
            element.innerHTML = `<img src="${card.imageUrl}" alt="${card.title}" loading="lazy">`;
            
            // Calculate position on the circle
            const angle = this.theta * i;
            // Use sine and cosine for x and z coordinates to create circular positioning
            const x = this.radius * Math.sin(angle);
            const z = this.radius * Math.cos(angle);
            
            element.style.transform = `
            translate(-50%, -50%)
            translate3d(${x}px, 0, ${z}px)
            rotateY(${angle}rad)
        `;

        element.addEventListener('click', () => this.showPopup(card));
            this.element.appendChild(element);
        });
    }

    rotate(direction) {
        this.currentRotation += direction * (this.theta / 2);
        this.element.style.transform = `rotateX(-10deg) rotateY(${this.currentRotation}rad)`;
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

 // Update the showPopup method in the Carousel class
showPopup(card) {
    const popup = document.querySelector('.popup-overlay');
    const title = document.getElementById('popup-title');
    const content = document.getElementById('popup-content');
    
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

        title.textContent = card.title;
        
        // Create content wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'popup-content-wrapper';
        
        // Add video 
        if (card.videoUrl) {
            let videoEmbed;
            
            // YouTube URL handling
            if (card.videoUrl.includes('youtube.com') || card.videoUrl.includes('youtu.be')) {
                const videoId = card.videoUrl.includes('youtube.com') 
                    ? card.videoUrl.split('v=')[1]?.split('&')[0]
                    : card.videoUrl.split('youtu.be/')[1];
                videoEmbed = document.createElement('iframe');
                videoEmbed.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                videoEmbed.allow = 'autoplay; encrypted-media; picture-in-picture';
                videoEmbed.allowFullscreen = true;
            
            // Vimeo URL handling
            } else if (card.videoUrl.includes('vimeo.com')) {
                const videoId = card.videoUrl.split('vimeo.com/')[1];
                videoEmbed = document.createElement('iframe');
                videoEmbed.src = `https://player.vimeo.com/video/${videoId}`;
                videoEmbed.allow = 'autoplay; fullscreen; picture-in-picture';
                videoEmbed.allowFullscreen = true;
    
            // Local video file handling
            } else {
                videoEmbed = document.createElement('video');
                videoEmbed.src = card.videoUrl;
                videoEmbed.controls = true;
                videoEmbed.autoplay = true;
            }
    
            // Styling for video         
            wrapper.appendChild(videoEmbed);
        }
    
        // Add image if no video URL is provided
        if (!card.videoUrl && card.imageUrl) {
            const img = document.createElement('img');
            img.src = card.imageUrl;
            img.alt = card.title;
            wrapper.appendChild(img);
        }

        
        // Add description
        const description = document.createElement('p');
        description.textContent = card.description;
        wrapper.appendChild(description);
        

        
        // Add wrapper to content
        content.appendChild(wrapper);
        
        // Show popup
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Setup close functionality
        const closeButton = popup.querySelector('.close-button');
        const closePopup = () => {
            popup.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
            
            // Remove the video content to stop playback
            while (content.firstChild) {
                content.removeChild(content.firstChild);
            }
        };
        closeButton.onclick = closePopup;
        popup.onclick = (e) => {
            if (e.target === popup) closePopup();
        };
        
        // Add escape key listener
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closePopup();
                window.removeEventListener('keydown', escapeHandler);
            }
        };
        window.addEventListener('keydown', escapeHandler);
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

