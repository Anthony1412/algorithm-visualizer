class AnimationHelper {
    constructor() {
        this.animationQueue = [];
        this.isProcessingQueue = false;
        this.performanceStats = {
            totalDelays: 0,
            totalSwaps: 0,
            totalComparisons: 0,
            startTime: null
        };
        this.isPaused = false;
        this.pauseResolve = null;
    }

    // Enhanced delay with pause support and speed scaling
    async delay(ms, context = 'normal') {
        if (window.visualizer && window.visualizer.isSorting === false) {
            throw new Error('Animation interrupted');
        }

        // Wait if paused
        if (this.isPaused) {
            await new Promise(resolve => {
                this.pauseResolve = resolve;
            });
        }

        this.performanceStats.totalDelays++;
        
        const delayTime = this.calculateAdjustedDelay(ms, context);
        return new Promise(resolve => setTimeout(resolve, delayTime));
    }

    // Calculate delay based on speed setting and context
    calculateAdjustedDelay(baseDelay, context = 'normal') {
        if (!window.visualizer) return baseDelay;
        
        const speed = window.visualizer.speed || 3; // 1-5 scale
        
        // Speed multipliers (1=slowest, 5=fastest)
        const speedMultipliers = [3, 1.5, 1, 0.5, 0.2];
        const speedMultiplier = speedMultipliers[speed - 1] || 1;
        
        // Context-based adjustments
        const contextMultipliers = {
            'comparison': 1.0,
            'swap': 1.2,
            'pivot': 0.8,
            'partition': 0.9,
            'merge': 1.1,
            'final': 1.5,
            'highlight': 0.7,
            'default': 1.0
        };
        
        const contextMultiplier = contextMultipliers[context] || contextMultipliers.default;
        
        let adjustedDelay = baseDelay * speedMultiplier * contextMultiplier;
        
        // Adjust based on array size (slightly faster for larger arrays)
        const arraySize = window.visualizer.arraySize || 30;
        const sizeFactor = Math.max(0.7, Math.min(1.3, 30 / arraySize));
        adjustedDelay *= sizeFactor;
        
        // Ensure minimum delay for smooth animations
        return Math.max(10, adjustedDelay);
    }

    // Toggle pause state
    togglePause() {
        this.isPaused = !this.isPaused;
        if (!this.isPaused && this.pauseResolve) {
            this.pauseResolve();
            this.pauseResolve = null;
        }
    }

    // Enhanced swap with validation and tracking
    swap(array, i, j, trackPerformance = true) {
        if (i === j) return array;
        
        // Validate indices
        if (i < 0 || j < 0 || i >= array.length || j >= array.length) {
            console.warn(`Invalid swap indices: ${i}, ${j}. Array length: ${array.length}`);
            return array;
        }

        // Perform swap
        [array[i], array[j]] = [array[j], array[i]];
        
        if (trackPerformance) {
            this.performanceStats.totalSwaps++;
        }
        
        return array;
    }

    // Multi-swap for complex operations
    multiSwap(array, swaps) {
        if (!Array.isArray(swaps)) {
            console.warn('multiSwap requires an array of swap pairs');
            return array;
        }
        
        swaps.forEach(([i, j]) => {
            if (i !== j && i >= 0 && j >= 0 && i < array.length && j < array.length) {
                [array[i], array[j]] = [array[j], array[i]];
            }
        });
        
        this.performanceStats.totalSwaps += swaps.length;
        return array;
    }

    // Compare function with performance tracking
    compare(a, b, trackPerformance = true) {
        if (trackPerformance) {
            this.performanceStats.totalComparisons++;
        }
        return a - b;
    }

    // Get speed setting
    getSpeed() {
        return window.visualizer?.speed || 3;
    }

    // Get delay for specific operation context
    getDelay(context = 'normal') {
        const baseDelays = {
            'comparison': 300,
            'swap': 400,
            'pivot': 500,
            'partition': 600,
            'merge': 350,
            'highlight': 200,
            'default': 300
        };
        
        const baseDelay = baseDelays[context] || baseDelays.default;
        return this.calculateAdjustedDelay(baseDelay, context);
    }

    // Start performance tracking
    startPerformanceTracking() {
        this.performanceStats = {
            totalDelays: 0,
            totalSwaps: 0,
            totalComparisons: 0,
            startTime: performance.now()
        };
    }

    // Get performance metrics
    getPerformanceMetrics() {
        const endTime = performance.now();
        const totalTime = this.performanceStats.startTime ? 
            (endTime - this.performanceStats.startTime) / 1000 : 0;
        
        const totalOperations = this.performanceStats.totalComparisons + this.performanceStats.totalSwaps;
        
        return {
            totalTime: totalTime.toFixed(2),
            totalDelays: this.performanceStats.totalDelays,
            totalSwaps: this.performanceStats.totalSwaps,
            totalComparisons: this.performanceStats.totalComparisons,
            totalOperations: totalOperations,
            operationsPerSecond: totalTime > 0 ? (totalOperations / totalTime).toFixed(1) : '0'
        };
    }

    // Reset performance tracking
    resetPerformanceTracking() {
        this.performanceStats = {
            totalDelays: 0,
            totalSwaps: 0,
            totalComparisons: 0,
            startTime: performance.now()
        };
    }

    // Clear animation queue
    clearQueue() {
        this.animationQueue = [];
        this.isProcessingQueue = false;
    }

    // Array utility functions
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Check if array is sorted
    isSorted(array) {
        for (let i = 1; i < array.length; i++) {
            if (array[i - 1] > array[i]) {
                return false;
            }
        }
        return true;
    }

    // Create shuffled array
    createShuffledArray(length, min = 10, max = 350) {
        const array = Array.from({ length }, () => this.getRandomInt(min, max));
        return this.shuffleArray(array);
    }

    // Fisher-Yates shuffle
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Create sorted array
    createSortedArray(length, min = 10, max = 350) {
        const array = Array.from({ length }, () => this.getRandomInt(min, max));
        return array.sort((a, b) => a - b);
    }

    // Create reversed array
    createReversedArray(length, min = 10, max = 350) {
        const array = this.createSortedArray(length, min, max);
        return array.reverse();
    }

    // Create nearly sorted array
    createNearlySortedArray(length, min = 10, max = 350, swaps = 3) {
        const array = this.createSortedArray(length, min, max);
        for (let i = 0; i < swaps; i++) {
            const idx1 = this.getRandomInt(0, length - 1);
            const idx2 = this.getRandomInt(0, length - 1);
            [array[idx1], array[idx2]] = [array[idx2], array[idx1]];
        }
        return array;
    }

    // Create array with few unique values
    createFewUniqueArray(length, uniqueValues = 5) {
        const values = Array.from({ length: uniqueValues }, (_, i) => 
            Math.floor((i + 1) * (350 / uniqueValues))
        );
        return Array.from({ length }, () => {
            const randomIndex = this.getRandomInt(0, uniqueValues - 1);
            return values[randomIndex];
        });
    }

    // Generate array based on preset type
    generateArray(preset, length) {
        switch (preset) {
            case 'random':
                return this.createShuffledArray(length);
            case 'sorted':
                return this.createSortedArray(length);
            case 'reversed':
                return this.createReversedArray(length);
            case 'nearly-sorted':
                return this.createNearlySortedArray(length);
            case 'few-unique':
                return this.createFewUniqueArray(length);
            default:
                return this.createShuffledArray(length);
        }
    }

    // Create array copy with metadata
    createArrayCopy(array) {
        return {
            data: [...array],
            timestamp: Date.now(),
            length: array.length,
            isSorted: this.isSorted(array)
        };
    }

    // Find array statistics
    getArrayStats(array) {
        return {
            min: Math.min(...array),
            max: Math.max(...array),
            sum: array.reduce((a, b) => a + b, 0),
            average: array.reduce((a, b) => a + b, 0) / array.length,
            sorted: this.isSorted(array)
        };
    }

    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for performance
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Format time for display
    formatTime(seconds) {
        if (seconds < 60) {
            return `${seconds.toFixed(2)}s`;
        } else {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = (seconds % 60).toFixed(2);
            return `${minutes}m ${remainingSeconds}s`;
        }
    }

    // Format large numbers with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Calculate algorithm progress
    calculateProgress(currentStep, totalSteps, algorithm, arraySize) {
        if (totalSteps === 0) return 0;
        
        const progress = (currentStep / totalSteps) * 100;
        
        // Cap at 100% and ensure minimum 0%
        return Math.max(0, Math.min(100, progress));
    }

    // Reset helper state
    reset() {
        this.clearQueue();
        this.resetPerformanceTracking();
        this.isPaused = false;
        if (this.pauseResolve) {
            this.pauseResolve();
            this.pauseResolve = null;
        }
    }
}

// Create global instance
const animationHelper = new AnimationHelper();

// Legacy function support for existing code
function delay(ms, context = 'normal') {
    return animationHelper.delay(ms, context);
}

function swap(array, i, j, trackPerformance = true) {
    return animationHelper.swap(array, i, j, trackPerformance);
}

function getSpeed() {
    return animationHelper.getSpeed();
}

// Make functions globally available
window.animationHelper = animationHelper;
window.delay = delay;
window.swap = swap;
window.getSpeed = getSpeed;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        AnimationHelper, 
        animationHelper, 
        delay, 
        swap, 
        getSpeed 
    };
}

console.log('Helper functions loaded successfully');