class ArrayRenderer {
    constructor() {
        this.container = document.getElementById('arrayContainer');
        this.barCache = new Map();
        this.animationState = {
            activeAnimations: 0,
            maxConcurrentAnimations: 10
        };
        this.initializeContainer();
    }

    initializeContainer() {
        // Add CSS variables for consistent styling
        this.container.style.setProperty('--bar-spacing', '2px');
        this.container.style.setProperty('--animation-duration', '0.3s');
        this.container.style.setProperty('--border-radius', '3px 3px 0 0');
    }

    renderArray(array, options = {}) {
        const {
            comparingIndices = [],
            swappingIndices = [],
            pivotIndex = -1,
            sortedIndices = [],
            partitionRange = [],
            customStyles = {},
            animationType = 'normal'
        } = options;

        this.container.innerHTML = '';
        
        const maxValue = Math.max(...array);
        const containerWidth = this.container.clientWidth;
        const containerHeight = this.container.clientHeight;
        
        const barWidth = this.calculateBarWidth(array.length, containerWidth);
        const shouldShowValues = this.shouldDisplayValues(array.length);

        array.forEach((value, index) => {
            const bar = this.createBar(value, maxValue, containerHeight, barWidth, index);
            this.applyBarStates(bar, index, {
                comparingIndices,
                swappingIndices,
                pivotIndex,
                sortedIndices,
                partitionRange,
                customStyles
            });
            
            if (shouldShowValues) {
                this.addValueLabel(bar, value);
            }

            this.container.appendChild(bar);
        });

        // Trigger animations after render
        this.triggerAnimations(animationType);
    }

    calculateBarWidth(arrayLength, containerWidth) {
        const spacing = parseInt(getComputedStyle(this.container).getPropertyValue('--bar-spacing')) || 2;
        const availableWidth = containerWidth - (spacing * (arrayLength - 1));
        const minWidth = 4;
        const calculatedWidth = availableWidth / arrayLength;
        return Math.max(minWidth, calculatedWidth);
    }

    createBar(value, maxValue, containerHeight, width, index) {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.dataset.index = index;
        bar.dataset.value = value;

        // Calculate dimensions
        const heightPercentage = (value / maxValue) * 95; // Leave 5% margin
        const actualHeight = (heightPercentage / 100) * containerHeight;

        // Apply styles
        Object.assign(bar.style, {
            width: `${width}px`,
            height: `${actualHeight}px`,
            minHeight: '4px',
            backgroundColor: this.getBarColor(value, maxValue),
            transition: `all var(--animation-duration, 0.3s) ease`,
            borderRadius: 'var(--border-radius, 3px 3px 0 0)',
            position: 'relative',
            cursor: 'pointer'
        });

        // Add hover effect
        this.addBarTooltip(bar, value, index);

        return bar;
    }

    getBarColor(value, maxValue) {
        // Color based on value (gradient from blue to purple)
        const hue = 240 + (value / maxValue) * 60; // Blue (240) to Purple (300)
        return `hsl(${hue}, 70%, 60%)`;
    }

    applyBarStates(bar, index, states) {
        const {
            comparingIndices,
            swappingIndices,
            pivotIndex,
            sortedIndices,
            partitionRange,
            customStyles
        } = states;

        // Reset classes
        bar.className = 'array-bar';

        // Apply state classes
        if (comparingIndices.includes(index)) {
            bar.classList.add('comparing');
            bar.style.backgroundColor = '#ff6b6b';
            bar.style.transform = 'scale(1.05)';
        } else if (swappingIndices.includes(index)) {
            bar.classList.add('swapping');
            bar.style.backgroundColor = '#f06595';
            bar.style.transform = 'scale(1.1) translateY(-5px)';
        } else if (index === pivotIndex) {
            bar.classList.add('pivot');
            bar.style.backgroundColor = '#ffd43b';
            bar.style.boxShadow = '0 0 8px #ffd43b';
        } else if (sortedIndices.includes(index)) {
            bar.classList.add('sorted');
            bar.style.backgroundColor = '#51cf66';
            bar.style.transform = 'scale(1.02)';
        } else if (this.isInPartition(index, partitionRange)) {
            bar.classList.add('partition');
            bar.style.backgroundColor = '#cc5de8';
            bar.style.opacity = '0.8';
        } else {
            bar.style.transform = 'scale(1)';
            bar.style.opacity = '1';
        }

        // Apply custom styles
        Object.assign(bar.style, customStyles);
    }

    isInPartition(index, range) {
        return range.length === 2 && index >= range[0] && index <= range[1];
    }

    addValueLabel(bar, value) {
        const label = document.createElement('span');
        label.className = 'bar-value';
        label.textContent = value;
        label.style.cssText = `
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 10px;
            color: white;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
            white-space: nowrap;
        `;
        bar.appendChild(label);
        bar.style.position = 'relative';
    }

    addBarTooltip(bar, value, index) {
        bar.title = `Index: ${index} | Value: ${value}`;
        
        bar.addEventListener('mouseenter', () => {
            bar.style.filter = 'brightness(1.2)';
            bar.style.zIndex = '10';
        });
        
        bar.addEventListener('mouseleave', () => {
            bar.style.filter = 'brightness(1)';
            bar.style.zIndex = '1';
        });
    }

    shouldDisplayValues(arrayLength) {
        return arrayLength <= 40;
    }

    triggerAnimations(animationType) {
        const bars = this.container.querySelectorAll('.array-bar');
        
        bars.forEach((bar, index) => {
            // Reset animation
            bar.style.animation = 'none';
            
            setTimeout(() => {
                switch (animationType) {
                    case 'stagger':
                        bar.style.animation = `staggerAppear 0.3s ease ${index * 0.05}s both`;
                        break;
                    case 'wave':
                        bar.style.animation = `wave 0.5s ease ${index * 0.1}s both`;
                        break;
                    case 'bounce':
                        bar.style.animation = `bounceIn 0.6s ease ${index * 0.05}s both`;
                        break;
                    default:
                        bar.style.animation = 'fadeIn 0.4s ease both';
                }
            }, 10);
        });
    }

    // Method to update specific bars without full re-render
    updateBars(indices, updateFunction) {
        indices.forEach(index => {
            const bar = this.container.querySelector(`.array-bar[data-index="${index}"]`);
            if (bar) {
                updateFunction(bar, index);
            }
        });
    }

    // Highlight a specific range
    highlightRange(start, end, color = 'rgba(255, 255, 0, 0.3)') {
        const bars = this.container.querySelectorAll('.array-bar');
        bars.forEach((bar, index) => {
            if (index >= start && index <= end) {
                bar.style.boxShadow = `inset 0 0 0 2px ${color}`;
            }
        });
    }

    // Clear all highlights
    clearHighlights() {
        const bars = this.container.querySelectorAll('.array-bar');
        bars.forEach(bar => {
            bar.style.boxShadow = 'none';
        });
    }

    // Get bar information
    getBarInfo(index) {
        const bar = this.container.querySelector(`.array-bar[data-index="${index}"]`);
        return bar ? {
            value: parseInt(bar.dataset.value),
            element: bar,
            isComparing: bar.classList.contains('comparing'),
            isSwapping: bar.classList.contains('swapping'),
            isSorted: bar.classList.contains('sorted')
        } : null;
    }
}

// Create global instance
const arrayRenderer = new ArrayRenderer();

// Legacy function for backward compatibility
function renderArray(array, comparingIndices = [], swappingIndices = [], pivotIndex = -1) {
    arrayRenderer.renderArray(array, {
        comparingIndices,
        swappingIndices,
        pivotIndex
    });
}

// Additional CSS animations (add to your style.css)
const additionalStyles = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes staggerAppear {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
}

@keyframes wave {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
}

@keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.05); opacity: 0.9; }
    100% { transform: scale(1); opacity: 1; }
}

.bar-value {
    user-select: none;
    pointer-events: none;
}

.array-bar {
    will-change: transform, background-color;
    backface-visibility: hidden;
}
`;

// Inject additional styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ArrayRenderer, arrayRenderer, renderArray };
}