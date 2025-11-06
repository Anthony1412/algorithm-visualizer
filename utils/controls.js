class Controls {
    constructor() {
        this.isPaused = false;
        this.currentStep = 0;
        this.totalSteps = 0;
        this.stepHistory = [];
        this.currentAlgorithm = '';
        this.animationFrameId = null;
        this.startTime = null;
        this.elapsedTime = 0;
        
        this.initializeControls();
        this.initializePerformanceMetrics();
    }

    initializeControls() {
        this.createControlPanel();
        this.initializeEventListeners();
        this.updateSpeedDisplay();
    }

    createControlPanel() {
        const controls = document.querySelector('.controls');
        
        // Add control buttons
        const controlButtons = `
            <div class="playback-controls">
                <button id="playPause" class="control-btn" title="Play/Pause">
                    <span class="icon">⏯️</span>
                    <span class="text">Play</span>
                </button>
                <button id="stepForward" class="control-btn" title="Step Forward">
                    <span class="icon">⏭️</span>
                    <span class="text">Step</span>
                </button>
                <button id="reset" class="control-btn" title="Reset Visualization">
                    <span class="icon">🔄</span>
                    <span class="text">Reset</span>
                </button>
                <button id="slowMotion" class="control-btn" title="Slow Motion Mode">
                    <span class="icon">🐌</span>
                    <span class="text">Slow Mo</span>
                </button>
            </div>
            <div class="progress-controls">
                <div class="progress-info">
                    <span id="stepCounter">Step: 0/0</span>
                    <span id="progressPercentage">0%</span>
                </div>
                <input type="range" id="progressBar" class="progress-bar" min="0" max="100" value="0">
            </div>
        `;
        
        controls.insertAdjacentHTML('beforeend', controlButtons);
    }

    initializeEventListeners() {
        document.getElementById('playPause').addEventListener('click', () => this.togglePlayPause());
        document.getElementById('stepForward').addEventListener('click', () => this.stepForward());
        document.getElementById('reset').addEventListener('click', () => this.resetVisualization());
        document.getElementById('slowMotion').addEventListener('click', () => this.toggleSlowMotion());
        
        document.getElementById('progressBar').addEventListener('input', (e) => {
            this.seekToStep(parseInt(e.target.value));
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyboardControls(e));
    }

    initializePerformanceMetrics() {
        const infoPanel = document.querySelector('.info');
        infoPanel.innerHTML += `
            <div class="performance-metrics">
                <p id="timeElapsed">Time: 0.00s</p>
                <p id="operationsPerSecond">OPS: 0/s</p>
                <p id="memoryUsage">Memory: -</p>
                <p id="currentOperation">Operation: -</p>
            </div>
        `;
    }

    // Enhanced reset function
    resetVisualization() {
        this.isPaused = false;
        this.currentStep = 0;
        this.totalSteps = 0;
        this.stepHistory = [];
        this.elapsedTime = 0;
        
        // Reset visual state
        const bars = document.querySelectorAll('.array-bar');
        bars.forEach(bar => {
            bar.classList.remove('comparing', 'swapping', 'sorted', 'pivot', 'partition', 'merging');
            bar.style.transform = 'scale(1)';
            bar.style.opacity = '1';
        });

        // Reset controls
        this.updateProgressBar();
        this.updateStepCounter();
        this.updatePlayPauseButton();
        
        // Reset performance metrics
        this.updatePerformanceMetrics();
        
        // Cancel any ongoing animations
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // Enable all buttons
        this.setControlsState(true);
        
        console.log('Visualization reset complete');
    }

    togglePlayPause() {
        this.isPaused = !this.isPaused;
        this.updatePlayPauseButton();
        
        if (!this.isPaused && this.currentStep < this.totalSteps) {
            this.startAnimation();
        } else {
            this.pauseAnimation();
        }
    }

    updatePlayPauseButton() {
        const playPauseBtn = document.getElementById('playPause');
        const icon = playPauseBtn.querySelector('.icon');
        const text = playPauseBtn.querySelector('.text');
        
        if (this.isPaused) {
            icon.textContent = '▶️';
            text.textContent = 'Play';
            playPauseBtn.classList.remove('paused');
        } else {
            icon.textContent = '⏸️';
            text.textContent = 'Pause';
            playPauseBtn.classList.add('paused');
        }
    }

    stepForward() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.executeStep(this.currentStep);
            this.updateProgressBar();
            this.updateStepCounter();
        }
    }

    seekToStep(stepPercentage) {
        const targetStep = Math.floor((stepPercentage / 100) * this.totalSteps);
        this.currentStep = Math.max(0, Math.min(targetStep, this.totalSteps));
        this.executeStep(this.currentStep);
        this.updateStepCounter();
    }

    executeStep(stepIndex) {
        if (this.stepHistory[stepIndex]) {
            const step = this.stepHistory[stepIndex];
            // Execute the step (this would be implemented based on your specific step data structure)
            this.visualizeStep(step);
        }
    }

    visualizeStep(step) {
        // Reset all bars to default state
        const bars = document.querySelectorAll('.array-bar');
        bars.forEach(bar => {
            bar.classList.remove('comparing', 'swapping', 'pivot', 'partition', 'merging');
        });

        // Apply step-specific visualizations
        if (step.comparing) {
            step.comparing.forEach(index => {
                if (bars[index]) {
                    bars[index].classList.add('comparing');
                    this.animateBar(bars[index], 'pulse');
                }
            });
        }

        if (step.swapping) {
            step.swapping.forEach(index => {
                if (bars[index]) {
                    bars[index].classList.add('swapping');
                    this.animateBar(bars[index], 'bounce');
                }
            });
        }

        if (step.pivot !== undefined && bars[step.pivot]) {
            bars[step.pivot].classList.add('pivot');
        }

        // Update performance metrics
        this.updatePerformanceMetrics();
    }

    animateBar(bar, animationType) {
        bar.style.animation = 'none';
        void bar.offsetWidth; // Trigger reflow
        bar.style.animation = `${animationType} 0.3s ease`;
    }

    startAnimation() {
        this.startTime = performance.now();
        this.animate();
    }

    pauseAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    animate() {
        if (this.isPaused || this.currentStep >= this.totalSteps) {
            return;
        }

        const currentTime = performance.now();
        this.elapsedTime = (currentTime - this.startTime) / 1000;

        // Calculate steps based on speed and time
        const targetStep = Math.min(
            Math.floor((this.elapsedTime / this.getTotalEstimatedTime()) * this.totalSteps),
            this.totalSteps
        );

        while (this.currentStep < targetStep) {
            this.currentStep++;
            this.executeStep(this.currentStep);
        }

        this.updateProgressBar();
        this.updateStepCounter();
        this.updatePerformanceMetrics();

        if (this.currentStep < this.totalSteps) {
            this.animationFrameId = requestAnimationFrame(() => this.animate());
        } else {
            this.onAnimationComplete();
        }
    }

    getTotalEstimatedTime() {
        // Estimate total time based on algorithm complexity and array size
        const baseTime = visualizer.arraySize * 0.1; // Base time per element
        const algorithmMultipliers = {
            'bubble': 1.2,
            'selection': 1.1,
            'insertion': 1.0,
            'merge': 0.8,
            'quick': 0.7
        };
        
        return baseTime * (algorithmMultipliers[this.currentAlgorithm] || 1);
    }

    onAnimationComplete() {
        this.isPaused = true;
        this.updatePlayPauseButton();
        
        // Visual celebration for completion
        this.celebrateCompletion();
    }

    celebrateCompletion() {
        const bars = document.querySelectorAll('.array-bar');
        bars.forEach((bar, index) => {
            setTimeout(() => {
                bar.classList.add('sorted');
                bar.style.animation = 'celebrate 0.5s ease';
            }, index * 50);
        });
    }

    updateProgressBar() {
        const progressBar = document.getElementById('progressBar');
        const progressPercentage = document.getElementById('progressPercentage');
        
        const percentage = this.totalSteps > 0 ? (this.currentStep / this.totalSteps) * 100 : 0;
        
        progressBar.value = percentage;
        progressPercentage.textContent = `${Math.round(percentage)}%`;
        
        // Update progress bar color based on completion
        progressBar.style.background = `linear-gradient(to right, #4facfe 0%, #00f2fe ${percentage}%, #374151 ${percentage}%)`;
    }

    updateStepCounter() {
        const stepCounter = document.getElementById('stepCounter');
        stepCounter.textContent = `Step: ${this.currentStep}/${this.totalSteps}`;
    }

    updatePerformanceMetrics() {
        const timeElapsed = document.getElementById('timeElapsed');
        const ops = document.getElementById('operationsPerSecond');
        const memoryUsage = document.getElementById('memoryUsage');
        const currentOperation = document.getElementById('currentOperation');

        timeElapsed.textContent = `Time: ${this.elapsedTime.toFixed(2)}s`;
        
        const opsRate = this.elapsedTime > 0 ? (this.currentStep / this.elapsedTime).toFixed(1) : '0';
        ops.textContent = `OPS: ${opsRate}/s`;
        
        // Memory usage (approximate)
        if (performance.memory) {
            const usedMB = (performance.memory.usedJSHeapSize / 1048576).toFixed(1);
            memoryUsage.textContent = `Memory: ${usedMB} MB`;
        }
    }

    updateSpeedDisplay() {
        const speedValue = document.getElementById('speed').value;
        const speedDisplay = document.createElement('span');
        speedDisplay.id = 'speedValue';
        speedDisplay.textContent = `${speedValue}%`;
        
        const speedControl = document.querySelector('.speed-control');
        if (!document.getElementById('speedValue')) {
            speedControl.appendChild(speedDisplay);
        } else {
            document.getElementById('speedValue').textContent = `${speedValue}%`;
        }
    }

    toggleSlowMotion() {
        const slowMotionBtn = document.getElementById('slowMotion');
        const isSlowMo = slowMotionBtn.classList.toggle('active');
        
        if (isSlowMo) {
            // Reduce speed for slow motion
            document.getElementById('speed').value = 10;
        } else {
            // Restore normal speed
            document.getElementById('speed').value = 50;
        }
        
        this.updateSpeedDisplay();
    }

    handleKeyboardControls(e) {
        if (e.target.tagName === 'INPUT') return; // Ignore if typing in input
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.stepForward();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.currentStep = Math.max(0, this.currentStep - 1);
                this.executeStep(this.currentStep);
                this.updateProgressBar();
                break;
            case 'KeyR':
                e.preventDefault();
                this.resetVisualization();
                break;
        }
    }

    setControlsState(enabled) {
        const buttons = document.querySelectorAll('.control-btn');
        buttons.forEach(btn => {
            if (btn.id !== 'reset') {
                btn.disabled = !enabled;
            }
        });
    }

    // Method to record steps for playback
    recordStep(stepData) {
        this.stepHistory.push(stepData);
        this.totalSteps = this.stepHistory.length;
    }

    // Method to start a new visualization session
    startNewVisualization(algorithmName) {
        this.resetVisualization();
        this.currentAlgorithm = algorithmName;
        this.stepHistory = [];
        this.startTime = performance.now();
        this.isPaused = false;
    }
}

// Initialize controls
let controls;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Controls };
}