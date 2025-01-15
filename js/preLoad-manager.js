// preload-manager.js
class PreloadManager {
    constructor(cardData) {
        this.cardData = cardData;
        this.loadedAssets = new Map();
        this.preloadQueue = [];
        this.maxConcurrentLoads = 6; // Adjust based on your needs
        this.activeLoads = 0;
    }

    async initialize() {
        // Add preload links to head for critical assets (first 6 cards)
        this.addPreloadLinks();
        
        // Start preloading all assets
        await this.preloadAllAssets();
    }

    addPreloadLinks() {
        const head = document.head;
        
        // Preload first 6 cards' assets with high priority
        this.cardData.slice(0, 6).forEach(card => {
            // Preload images
            const imageLink = document.createElement('link');
            imageLink.rel = 'preload';
            imageLink.as = 'image';
            imageLink.href = card.imageUrl;
            head.appendChild(imageLink);

            // Preload videos if they're local
            if (card.videoUrl && !card.videoUrl.includes('youtube.com') && !card.videoUrl.includes('vimeo.com')) {
                const videoLink = document.createElement('link');
                videoLink.rel = 'preload';
                videoLink.as = 'video';
                videoLink.href = card.videoUrl;
                head.appendChild(videoLink);
            }
        });
    }

    async preloadAllAssets() {
        // Queue all assets for preloading
        this.cardData.forEach(card => {
            this.queueAsset(card.imageUrl, 'image');
            if (card.videoUrl && !card.videoUrl.includes('youtube.com') && !card.videoUrl.includes('vimeo.com')) {
                this.queueAsset(card.videoUrl, 'video');
            }
        });

        // Start the preloading process
        this.processQueue();
    }

    queueAsset(url, type) {
        this.preloadQueue.push({ url, type });
    }

    async processQueue() {
        while (this.preloadQueue.length > 0 && this.activeLoads < this.maxConcurrentLoads) {
            const asset = this.preloadQueue.shift();
            this.activeLoads++;
            
            try {
                await this.preloadAsset(asset.url, asset.type);
            } catch (error) {
                console.warn(`Failed to preload ${asset.url}:`, error);
            }
            
            this.activeLoads--;
            this.processQueue();
        }
    }

    async preloadAsset(url, type) {
        if (this.loadedAssets.has(url)) {
            return this.loadedAssets.get(url);
        }

        return new Promise((resolve, reject) => {
            if (type === 'image') {
                const img = new Image();
                img.onload = () => {
                    this.loadedAssets.set(url, img);
                    resolve(img);
                };
                img.onerror = reject;
                img.src = url;
            } else if (type === 'video') {
                const video = document.createElement('video');
                video.preload = 'auto';
                video.onloadeddata = () => {
                    this.loadedAssets.set(url, video);
                    resolve(video);
                };
                video.onerror = reject;
                video.src = url;
            }
        });
    }

    isAssetLoaded(url) {
        return this.loadedAssets.has(url);
    }

    getLoadedAsset(url) {
        return this.loadedAssets.get(url);
    }
}

// Modified Carousel class constructor
class Carousel {
    constructor(element, cards) {
        // ... existing constructor code ...
        
        // Initialize PreloadManager
        this.preloadManager = new PreloadManager(cards);
        this.preloadManager.initialize().then(() => {
            console.log('Initial assets preloaded');
        });
        
        // Modify setupCards to use preloaded assets
        this.setupCards = function() {
            this.cards.forEach((card, i) => {
                const element = document.createElement('div');
                element.className = 'card';
                
                // Use preloaded image if available
                if (this.preloadManager.isAssetLoaded(card.imageUrl)) {
                    const img = this.preloadManager.getLoadedAsset(card.imageUrl).cloneNode();
                    element.appendChild(img);
                } else {
                    element.innerHTML = `<img src="${card.imageUrl}" alt="${card.title}" loading="lazy">`;
                }
                
                this.positionCard(element, i);
                element.addEventListener('click', () => this.showPopup(card));
                this.element.appendChild(element);
            });
        };
    }
}

// Export both classes
export { PreloadManager, Carousel };