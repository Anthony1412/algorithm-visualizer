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
// In your main app.js, add this to handle algorithm execution
let isVisualizing = false;
let currentAnimation = null;

async function startVisualization() {
    if (!currentAlgorithm || isVisualizing) return;
    
    isVisualizing = true;
    const playPauseButton = document.getElementById('playPause');
    playPauseButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
    
    // Get current array values from DOM
    const arrayBars = document.querySelectorAll('.array-bar');
    const array = Array.from(arrayBars).map(bar => parseInt(bar.textContent) || parseInt(bar.style.height));
    
    // Get animation speed
    const speed = getAnimationSpeed();
    
    try {
        // Reset all bars to normal state
        resetArrayColors();
        
        // Execute the selected algorithm
        switch(currentAlgorithm) {
            case 'quick':
                await quickSort([...array], updateVisualization, speed);
                break;
            case 'quick-middle':
                await quickSortMiddlePivot([...array], updateVisualization, speed);
                break;
            // Add other algorithms here...
        }
    } catch (error) {
        console.error('Visualization error:', error);
    } finally {
        isVisualizing = false;
        playPauseButton.innerHTML = '<i class="fas fa-play"></i> Play';
    }
}

function updateVisualization(state) {
    return new Promise(resolve => {
        const arrayBars = document.querySelectorAll('.array-bar');
        
        // Update array values if they changed
        if (state.array) {
            state.array.forEach((value, index) => {
                arrayBars[index].textContent = value;
                arrayBars[index].style.height = `${value}%`;
            });
        }
        
        // Reset all colors first
        resetArrayColors();
        
        // Apply new colors based on state
        if (state.comparing) {
            state.comparing.forEach(index => {
                arrayBars[index].classList.add('comparing');
            });
        }
        
        if (state.swapping) {
            state.swapping.forEach(index => {
                arrayBars[index].classList.add('swapping');
            });
        }
        
        if (state.pivot !== undefined) {
            arrayBars[state.pivot].classList.add('pivot');
        }
        
        if (state.sorted) {
            state.sorted.forEach(index => {
                arrayBars[index].classList.add('sorted');
            });
        }
        
        // Update statistics
        if (state.comparisons !== undefined) {
            document.getElementById('comparisons').textContent = state.comparisons;
        }
        
        if (state.swaps !== undefined) {
            document.getElementById('swaps').textContent = state.swaps;
        }
        
        if (state.message) {
            document.getElementById('algorithmInfo').textContent = state.message;
        }
        
        resolve();
    });
}

function resetArrayColors() {
    const arrayBars = document.querySelectorAll('.array-bar');
    arrayBars.forEach(bar => {
        bar.classList.remove('comparing', 'swapping', 'pivot', 'sorted');
        bar.classList.add('normal');
    });
}

function getAnimationSpeed() {
    const speedValue = parseInt(document.getElementById('speed').value);
    // Convert speed value to milliseconds (1-5 becomes 500ms to 100ms)
    return 600 - (speedValue * 100);
}
// Tree and Graph Visualization Functionality
class TreeGraphVisualizer {
    constructor() {
        this.currentStructure = 'tree';
        this.currentAlgorithm = null;
        this.isPlaying = false;
        this.animationSpeed = 300;
        this.treeData = null;
        this.graphData = null;
        this.animationSteps = [];
        this.currentStep = 0;
        
        this.initializeEventListeners();
        this.generateInitialTree();
    }
    
    initializeEventListeners() {
        // Structure tabs
        document.querySelectorAll('.structure-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const structure = e.target.getAttribute('data-structure');
                this.switchStructure(structure);
            });
        });
        
        // Algorithm buttons
        document.querySelectorAll('.tree-algorithms .btn-algorithm, .graph-algorithms .btn-algorithm').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const algorithm = e.currentTarget.getAttribute('data-algo');
                this.selectAlgorithm(algorithm);
            });
        });
        
        // Control buttons
        document.getElementById('generateTreeGraph').addEventListener('click', () => {
            this.generateNewStructure();
        });
        
        document.getElementById('playPauseTreeGraph').addEventListener('click', () => {
            this.togglePlayPause();
        });
        
        document.getElementById('resetTreeGraph').addEventListener('click', () => {
            this.resetVisualization();
        });
        
        document.getElementById('stepBackTreeGraph').addEventListener('click', () => {
            this.stepBackward();
        });
        
        document.getElementById('stepForwardTreeGraph').addEventListener('click', () => {
            this.stepForward();
        });
        
        // Configuration sliders
        document.getElementById('treeDepth').addEventListener('input', (e) => {
            document.getElementById('treeDepthValue').textContent = e.target.value;
        });
        
        document.getElementById('nodeCount').addEventListener('input', (e) => {
            document.getElementById('nodeCountValue').textContent = e.target.value;
        });
        
        document.getElementById('graphNodes').addEventListener('input', (e) => {
            document.getElementById('graphNodesValue').textContent = e.target.value;
        });
        
        document.getElementById('graphEdges').addEventListener('input', (e) => {
            const values = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
            document.getElementById('graphEdgesValue').textContent = values[e.target.value - 1];
        });
        
        // Tree presets
        document.querySelectorAll('.tree-presets .btn-small').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.getAttribute('data-tree');
                this.generateTree(type);
            });
        });
        
        // Graph presets
        document.querySelectorAll('.graph-presets .btn-small').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.getAttribute('data-graph');
                this.generateGraph(type);
            });
        });
    }
    
    switchStructure(structure) {
        this.currentStructure = structure;
        
        // Update active tab
        document.querySelectorAll('.structure-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-structure="${structure}"]`).classList.add('active');
        
        // Show/hide controls
        if (structure === 'tree') {
            document.querySelector('.tree-controls').style.display = 'block';
            document.querySelector('.graph-controls').style.display = 'none';
        } else {
            document.querySelector('.tree-controls').style.display = 'none';
            document.querySelector('.graph-controls').style.display = 'block';
        }
        
        // Generate new structure
        this.generateNewStructure();
    }
    
    selectAlgorithm(algorithm) {
        this.currentAlgorithm = algorithm;
        
        // Update UI
        document.getElementById('currentTreeGraphAlgorithm').textContent = this.getAlgorithmName(algorithm);
        document.getElementById('treeGraphDescription').textContent = this.getAlgorithmDescription(algorithm);
        
        // Update active button
        document.querySelectorAll('.tree-algorithms .btn-algorithm, .graph-algorithms .btn-algorithm').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-algo="${algorithm}"]`).classList.add('active');
        
        // Enable play button
        document.getElementById('playPauseTreeGraph').disabled = false;
        
        // Generate animation steps
        this.generateAnimationSteps();
    }
    
    getAlgorithmName(algorithm) {
        const names = {
            'bfs-tree': 'Breadth-First Search (Tree)',
            'dfs-tree': 'Depth-First Search (Tree)',
            'inorder': 'Inorder Traversal',
            'preorder': 'Preorder Traversal',
            'postorder': 'Postorder Traversal',
            'bfs-graph': 'Breadth-First Search (Graph)',
            'dfs-graph': 'Depth-First Search (Graph)',
            'dijkstra': "Dijkstra's Algorithm",
            'astar': 'A* Search Algorithm'
        };
        return names[algorithm] || 'Unknown Algorithm';
    }
    
    getAlgorithmDescription(algorithm) {
        const descriptions = {
            'bfs-tree': 'Explores all nodes at the current depth before moving to the next level',
            'dfs-tree': 'Explores as far as possible along each branch before backtracking',
            'inorder': 'Visits left subtree, then root, then right subtree',
            'preorder': 'Visits root, then left subtree, then right subtree',
            'postorder': 'Visits left subtree, then right subtree, then root',
            'bfs-graph': 'Explores all neighbors at current depth before moving to next level',
            'dfs-graph': 'Explores as far as possible along each branch before backtracking',
            'dijkstra': 'Finds the shortest path between nodes in a weighted graph',
            'astar': 'Finds the shortest path using heuristics to guide the search'
        };
        return descriptions[algorithm] || 'Select an algorithm to see its description';
    }
    
    generateNewStructure() {
        if (this.currentStructure === 'tree') {
            this.generateTree('random');
        } else {
            this.generateGraph('random');
        }
    }
    
    generateTree(type) {
        // Generate tree data based on type and configuration
        const depth = parseInt(document.getElementById('treeDepth').value);
        const maxChildren = parseInt(document.getElementById('nodeCount').value);
        const balanced = document.getElementById('balanceTree').checked;
        
        // Implementation for generating different tree types
        this.treeData = this.generateTreeData(type, depth, maxChildren, balanced);
        
        // Render the tree
        this.renderTree();
        
        // Reset visualization
        this.resetVisualization();
    }
    
    generateGraph(type) {
        // Generate graph data based on type and configuration
        const nodeCount = parseInt(document.getElementById('graphNodes').value);
        const edgeDensity = parseInt(document.getElementById('graphEdges').value);
        const directed = document.getElementById('directedGraph').checked;
        const weighted = document.getElementById('weightedGraph').checked;
        
        // Implementation for generating different graph types
        this.graphData = this.generateGraphData(type, nodeCount, edgeDensity, directed, weighted);
        
        // Render the graph
        this.renderGraph();
        
        // Reset visualization
        this.resetVisualization();
    }
    
    generateInitialTree() {
        this.generateTree('binary');
    }
    
    generateTreeData(type, depth, maxChildren, balanced) {
        // Simplified tree generation - in a real implementation, this would create
        // proper tree structures for different types
        return {
            type: type,
            depth: depth,
            maxChildren: maxChildren,
            balanced: balanced,
            root: this.generateTreeNode(0, depth, maxChildren, balanced)
        };
    }
    
    generateTreeNode(level, maxLevel, maxChildren, balanced) {
        if (level >= maxLevel) return null;
        
        const value = Math.floor(Math.random() * 100);
        const node = {
            value: value,
            level: level,
            children: []
        };
        
        const childCount = balanced ? maxChildren : Math.floor(Math.random() * maxChildren) + 1;
        
        for (let i = 0; i < childCount; i++) {
            const child = this.generateTreeNode(level + 1, maxLevel, maxChildren, balanced);
            if (child) {
                node.children.push(child);
            }
        }
        
        return node;
    }
    
    generateGraphData(type, nodeCount, edgeDensity, directed, weighted) {
        // Simplified graph generation
        const nodes = [];
        const edges = [];
        
        // Generate nodes
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                id: i,
                label: `Node ${i}`,
                x: Math.random() * 400 + 50,
                y: Math.random() * 300 + 50
            });
        }
        
        // Generate edges based on density
        const maxEdges = directed ? nodeCount * (nodeCount - 1) : nodeCount * (nodeCount - 1) / 2;
        const targetEdges = Math.floor(maxEdges * (edgeDensity / 5));
        
        for (let i = 0; i < targetEdges; i++) {
            const from = Math.floor(Math.random() * nodeCount);
            let to = Math.floor(Math.random() * nodeCount);
            
            // Ensure we don't have self-loops unless it's a specific graph type
            while (to === from) {
                to = Math.floor(Math.random() * nodeCount);
            }
            
            edges.push({
                from: from,
                to: to,
                weight: weighted ? Math.floor(Math.random() * 10) + 1 : 1,
                directed: directed
            });
        }
        
        return {
            type: type,
            nodes: nodes,
            edges: edges,
            directed: directed,
            weighted: weighted
        };
    }
    
    renderTree() {
        const svg = document.getElementById('treeGraphSVG');
        svg.innerHTML = '';
        
        // In a real implementation, this would use D3.js or similar
        // to render the tree with proper positioning
        
        // Placeholder implementation
        const placeholder = document.createElement('div');
        placeholder.style.textAlign = 'center';
        placeholder.style.padding = '2rem';
        placeholder.innerHTML = `
            <h3>Tree Visualization</h3>
            <p>Tree would be rendered here with ${this.treeData.depth} levels</p>
            <p>Algorithm: ${this.currentAlgorithm || 'None selected'}</p>
        `;
        
        // In a real implementation, we would add proper SVG elements here
        // For now, we'll just show a placeholder
        svg.appendChild(placeholder);
    }
    
    renderGraph() {
        const svg = document.getElementById('treeGraphSVG');
        svg.innerHTML = '';
        
        // In a real implementation, this would use D3.js or similar
        // to render the graph with proper force-directed layout
        
        // Placeholder implementation
        const placeholder = document.createElement('div');
        placeholder.style.textAlign = 'center';
        placeholder.style.padding = '2rem';
        placeholder.innerHTML = `
            <h3>Graph Visualization</h3>
            <p>Graph with ${this.graphData.nodes.length} nodes and ${this.graphData.edges.length} edges</p>
            <p>Algorithm: ${this.currentAlgorithm || 'None selected'}</p>
        `;
        
        // In a real implementation, we would add proper SVG elements here
        // For now, we'll just show a placeholder
        svg.appendChild(placeholder);
    }
    
    generateAnimationSteps() {
        this.animationSteps = [];
        
        if (!this.currentAlgorithm) return;
        
        // Generate steps based on the selected algorithm
        // This is a simplified version - in reality, you would implement
        // the actual algorithms and record each step
        
        const stepCount = 20; // Example step count
        
        for (let i = 0; i < stepCount; i++) {
            this.animationSteps.push({
                step: i,
                message: `Step ${i + 1}: Processing...`,
                visited: Array.from({ length: i + 1 }, (_, idx) => idx),
                current: i
            });
        }
        
        // Update progress
        this.updateProgress();
    }
    
    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        const button = document.getElementById('playPauseTreeGraph');
        
        if (this.isPlaying) {
            button.innerHTML = '<i class="fas fa-pause"></i> Pause';
            this.playAnimation();
        } else {
            button.innerHTML = '<i class="fas fa-play"></i> Play';
        }
    }
    
    async playAnimation() {
        while (this.isPlaying && this.currentStep < this.animationSteps.length) {
            await this.delay(this.animationSpeed);
            this.stepForward();
        }
        
        if (this.currentStep >= this.animationSteps.length) {
            this.isPlaying = false;
            document.getElementById('playPauseTreeGraph').innerHTML = '<i class="fas fa-play"></i> Play';
        }
    }
    
    stepForward() {
        if (this.currentStep < this.animationSteps.length) {
            this.currentStep++;
            this.updateVisualization();
        }
    }
    
    stepBackward() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateVisualization();
        }
    }
    
    updateVisualization() {
        if (this.animationSteps.length === 0) return;
        
        const step = this.animationSteps[this.currentStep - 1] || this.animationSteps[0];
        
        // Update visualization based on step data
        // This would update node colors, edges, etc.
        
        // Update progress
        this.updateProgress();
        
        // Update traversal path
        this.updateTraversalPath(step);
    }
    
    updateProgress() {
        const progress = (this.currentStep / this.animationSteps.length) * 100;
        document.getElementById('treeGraphProgressFill').style.width = `${progress}%`;
        document.getElementById('treeGraphProgressText').textContent = `${Math.round(progress)}% Complete`;
        document.getElementById('treeGraphStepCounter').textContent = `Step: ${this.currentStep}/${this.animationSteps.length}`;
    }
    
    updateTraversalPath(step) {
        const pathElement = document.getElementById('traversalPath');
        
        if (!step || !step.visited) {
            pathElement.innerHTML = '<h4>Traversal Path</h4><p>No traversal data</p>';
            return;
        }
        
        let html = '<h4>Traversal Path</h4><ol>';
        
        step.visited.forEach((nodeId, index) => {
            const isCurrent = index === step.current;
            const className = isCurrent ? 'class="current"' : 'class="visited"';
            html += `<li ${className}>Node ${nodeId}</li>`;
        });
        
        html += '</ol>';
        pathElement.innerHTML = html;
    }
    
    resetVisualization() {
        this.currentStep = 0;
        this.isPlaying = false;
        document.getElementById('playPauseTreeGraph').innerHTML = '<i class="fas fa-play"></i> Play';
        
        // Reset visualization to initial state
        if (this.currentStructure === 'tree') {
            this.renderTree();
        } else {
            this.renderGraph();
        }
        
        this.updateProgress();
        document.getElementById('traversalPath').innerHTML = '<h4>Traversal Path</h4><p>Algorithm not started</p>';
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.treeGraphVisualizer = new TreeGraphVisualizer();
});