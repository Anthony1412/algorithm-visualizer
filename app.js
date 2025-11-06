class SortingVisualizer {
    constructor() {
        this.array = [];
        this.arraySize = 30;
        this.speed = 3;
        this.isSorting = false;
        this.isPaused = false;
        this.currentAlgorithm = null;
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = null;
        this.operations = 0;
        
        // Make visualizer globally available immediately
        window.visualizer = this;
        
        this.initializeEventListeners();
        this.generateNewArray();
        this.updateStats();
    }

    initializeEventListeners() {
        console.log('Initializing event listeners...');
        
        // Control buttons with null checks
        const generateBtn = document.getElementById('generateArray');
        const playPauseBtn = document.getElementById('playPause');
        const resetBtn = document.getElementById('reset');
        
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                if (!this.isSorting) this.generateNewArray();
            });
        }
        
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.togglePlayPause();
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetVisualization();
            });
        }

        // Algorithm buttons
        const algorithmButtons = document.querySelectorAll('.btn-algorithm');
        algorithmButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const algorithm = e.currentTarget.dataset.algo;
                if (!this.isSorting) {
                    this.selectAlgorithm(algorithm);
                }
            });
        });

        // Sliders
        const arraySizeSlider = document.getElementById('arraySize');
        const speedSlider = document.getElementById('speed');
        
        if (arraySizeSlider) {
            arraySizeSlider.addEventListener('input', (e) => {
                if (!this.isSorting) {
                    this.arraySize = parseInt(e.target.value);
                    const sizeValue = document.getElementById('arraySizeValue');
                    if (sizeValue) sizeValue.textContent = this.arraySize;
                    this.generateNewArray();
                }
            });
        }
        
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.speed = parseInt(e.target.value);
                this.updateSpeedDisplay();
            });
        }

        // Initialize displays
        const arraySizeValue = document.getElementById('arraySizeValue');
        if (arraySizeValue) arraySizeValue.textContent = this.arraySize;
        
        this.updateSpeedDisplay();
    }

    generateNewArray() {
        this.array = Array.from({ length: this.arraySize }, () => 
            Math.floor(Math.random() * 350) + 20
        );
        this.resetStats();
        this.renderArray();
        this.updateProgress(0);
    }

    selectAlgorithm(algorithm) {
        // Update UI
        document.querySelectorAll('.btn-algorithm').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const selectedBtn = document.querySelector(`[data-algo="${algorithm}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }
        
        // Enable play button
        const playPauseBtn = document.getElementById('playPause');
        if (playPauseBtn) {
            playPauseBtn.disabled = false;
        }
        
        this.currentAlgorithm = algorithm;
        
        const algorithmNameElement = document.getElementById('algorithmName');
        if (algorithmNameElement) {
            algorithmNameElement.textContent = this.getAlgorithmDisplayName(algorithm);
        }
    }

    getAlgorithmDisplayName(algo) {
        const names = {
            'bubble': 'Bubble Sort',
            'selection': 'Selection Sort',
            'insertion': 'Insertion Sort',
            'merge': 'Merge Sort',
            'quick': 'Quick Sort'
        };
        return names[algo] || algo;
    }

    async startSorting() {
        if (!this.currentAlgorithm || this.isSorting) return;

        this.isSorting = true;
        this.isPaused = false;
        this.startTime = performance.now();
        this.resetStats();
        this.disableControls(true);
        
        const playPauseBtn = document.getElementById('playPause');
        if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        }
        
        const arrayCopy = [...this.array];

        try {
            let algorithmFunc;
            switch (this.currentAlgorithm) {
                case 'bubble':
                    algorithmFunc = typeof bubbleSort !== 'undefined' ? bubbleSort : null;
                    break;
                case 'selection':
                    algorithmFunc = typeof selectionSort !== 'undefined' ? selectionSort : null;
                    break;
                case 'insertion':
                    algorithmFunc = typeof insertionSort !== 'undefined' ? insertionSort : null;
                    break;
                case 'merge':
                    algorithmFunc = typeof mergeSort !== 'undefined' ? mergeSort : null;
                    break;
                case 'quick':
                    algorithmFunc = typeof quickSort !== 'undefined' ? quickSort : null;
                    break;
            }

            if (!algorithmFunc) {
                throw new Error(`Algorithm ${this.currentAlgorithm} not found!`);
            }

            await algorithmFunc(arrayCopy, this.updateVisualization.bind(this));
            
            // Final completion animation
            await this.animateCompletion();
            
        } catch (error) {
            console.error('Sorting error:', error);
            if (error.message !== 'Sorting paused') {
                // Don't show alert for pause, show for other errors
                const algorithmInfo = document.getElementById('algorithmInfo');
                if (algorithmInfo) {
                    algorithmInfo.textContent = 'Error: ' + error.message;
                }
            }
        } finally {
            if (!this.isPaused) {
                this.isSorting = false;
                this.disableControls(false);
                const playPauseBtn = document.getElementById('playPause');
                if (playPauseBtn) {
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i> Play';
                    playPauseBtn.disabled = true;
                }
            }
        }
    }

    updateVisualization(state) {
        if (this.isPaused) {
            throw new Error('Sorting paused');
        }

        const { array, comparisons = 0, swaps = 0, comparing = [], swapping = [], pivot = -1, sorted = [], message = '' } = state;
        
        this.array = [...array];
        this.comparisons += comparisons;
        this.swaps += swaps;
        this.operations = this.comparisons + this.swaps;

        // Update stats
        this.updateStats();

        // Update message if provided
        if (message) {
            const algorithmInfo = document.getElementById('algorithmInfo');
            if (algorithmInfo) {
                algorithmInfo.textContent = message;
            }
        }

        // Calculate progress
        const progress = this.calculateProgress();
        this.updateProgress(progress);

        // Render with visual states
        this.renderArray(comparing, swapping, pivot, sorted);
    }

    calculateProgress() {
        if (!this.currentAlgorithm) return 0;
        
        // Simple progress calculation based on operations
        const maxOperations = this.arraySize * this.arraySize * 2;
        return Math.min((this.operations / maxOperations) * 100, 100);
    }

    renderArray(comparing = [], swapping = [], pivot = -1, sorted = []) {
        const container = document.getElementById('arrayContainer');
        if (!container) {
            console.error('Array container not found!');
            return;
        }
        
        container.innerHTML = '';
        
        const maxValue = Math.max(...this.array);
        const containerHeight = container.clientHeight - 10;

        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            
            // Calculate height
            const height = (value / maxValue) * (containerHeight - 30);
            bar.style.height = `${height}px`;
            
            // Calculate width based on array size
            const barWidth = Math.max(4, (container.clientWidth - (this.array.length * 2)) / this.array.length);
            bar.style.width = `${barWidth}px`;
            bar.style.margin = '0 1px';
            
            // Add value label for smaller arrays
            if (this.arraySize <= 40) {
                const label = document.createElement('div');
                label.className = 'bar-label';
                label.textContent = value;
                label.style.cssText = `
                    position: absolute;
                    bottom: -25px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 10px;
                    font-weight: 600;
                    color: var(--dark-color);
                    white-space: nowrap;
                `;
                bar.appendChild(label);
            }

            // Apply states with clear visual hierarchy
            if (sorted.includes(index)) {
                bar.classList.add('sorted');
                bar.style.backgroundColor = '#51cf66';
                bar.style.transform = 'scale(1.02)';
            } else if (index === pivot) {
                bar.classList.add('pivot');
                bar.style.backgroundColor = '#ffd43b';
                bar.style.boxShadow = '0 0 15px #ffd43b';
                bar.style.transform = 'scale(1.1)';
            } else if (swapping.includes(index)) {
                bar.classList.add('swapping');
                bar.style.backgroundColor = '#cc5de8';
                bar.style.transform = 'scale(1.1) translateY(-5px)';
            } else if (comparing.includes(index)) {
                bar.classList.add('comparing');
                bar.style.backgroundColor = '#ff6b6b';
                bar.style.transform = 'scale(1.05)';
            } else {
                // Default color based on value
                const hue = 240 + (value / maxValue) * 60;
                bar.style.backgroundColor = `hsl(${hue}, 70%, 60%)`;
                bar.style.transform = 'scale(1)';
            }

            container.appendChild(bar);
        });
    }

    togglePlayPause() {
        if (!this.isSorting && this.currentAlgorithm) {
            // Start sorting if not already running and algorithm is selected
            this.startSorting();
        } else if (this.isSorting) {
            // Toggle pause/resume
            this.isPaused = !this.isPaused;
            const playPauseBtn = document.getElementById('playPause');
            
            if (this.isPaused) {
                if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            } else {
                if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                // Resume sorting
                this.startSorting();
            }
        } else {
            console.log('Please select an algorithm first');
        }
    }

    resetVisualization() {
        this.isSorting = false;
        this.isPaused = false;
        this.currentAlgorithm = null;
        this.resetStats();
        this.disableControls(false);
        
        document.querySelectorAll('.btn-algorithm').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const playPauseBtn = document.getElementById('playPause');
        if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i> Play';
            playPauseBtn.disabled = true;
        }
        
        const algorithmName = document.getElementById('algorithmName');
        if (algorithmName) algorithmName.textContent = '-';
        
        const algorithmInfo = document.getElementById('algorithmInfo');
        if (algorithmInfo) algorithmInfo.textContent = '';
        
        this.generateNewArray();
    }

    resetStats() {
        this.comparisons = 0;
        this.swaps = 0;
        this.operations = 0;
        this.startTime = null;
        this.updateStats();
        this.updateProgress(0);
    }

    disableControls(disabled) {
        const generateBtn = document.getElementById('generateArray');
        if (generateBtn) generateBtn.disabled = disabled;
        
        document.querySelectorAll('.btn-algorithm').forEach(btn => {
            btn.disabled = disabled;
        });
        
        const arraySizeSlider = document.getElementById('arraySize');
        if (arraySizeSlider) arraySizeSlider.disabled = disabled;
    }

    updateStats() {
        const currentTime = performance.now();
        const elapsedTime = this.startTime ? (currentTime - this.startTime) / 1000 : 0;
        const opsPerSecond = elapsedTime > 0 ? (this.operations / elapsedTime).toFixed(1) : '0';

        const comparisonsElement = document.getElementById('comparisons');
        const swapsElement = document.getElementById('swaps');
        const timeElapsedElement = document.getElementById('timeElapsed');
        const operationsPerSecondElement = document.getElementById('operationsPerSecond');
        
        if (comparisonsElement) comparisonsElement.textContent = this.comparisons.toLocaleString();
        if (swapsElement) swapsElement.textContent = this.swaps.toLocaleString();
        if (timeElapsedElement) timeElapsedElement.textContent = `${elapsedTime.toFixed(2)}s`;
        if (operationsPerSecondElement) operationsPerSecondElement.textContent = `${opsPerSecond}/s`;
    }

    updateProgress(percentage) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `${Math.round(percentage)}% Complete`;
    }

    updateSpeedDisplay() {
        const speedNames = ['Very Slow', 'Slow', 'Normal', 'Fast', 'Very Fast'];
        const speedValue = document.getElementById('speedValue');
        if (speedValue) {
            speedValue.textContent = speedNames[this.speed - 1];
        }
    }

    async animateCompletion() {
        const bars = document.querySelectorAll('.array-bar');
        for (let i = 0; i < bars.length; i++) {
            bars[i].classList.add('sorted');
            bars[i].style.backgroundColor = '#51cf66';
            bars[i].style.transform = 'scale(1.02)';
            await this.delay(1000 / this.arraySize);
        }
        
        const algorithmInfo = document.getElementById('algorithmInfo');
        if (algorithmInfo) algorithmInfo.textContent = 'Sorting Complete!';
    }

    delay(ms) {
        const speedMultipliers = [3, 1.5, 1, 0.5, 0.2];
        const adjustedDelay = ms * speedMultipliers[this.speed - 1];
        return new Promise(resolve => setTimeout(resolve, adjustedDelay));
    }
}

// Initialize the visualizer when the page loads
let visualizer;
document.addEventListener('DOMContentLoaded', () => {
    visualizer = new SortingVisualizer();
    window.visualizer = visualizer;
});