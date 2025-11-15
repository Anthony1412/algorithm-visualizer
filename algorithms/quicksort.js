async function quickSort(array, updateCallback, speed) {
    let comparisons = 0;
    let swaps = 0;
    
    await quickSortHelper(array, 0, array.length - 1, updateCallback, speed, { comparisons, swaps });
    
    // Final update - mark all as sorted
    await updateCallback({
        array: [...array],
        sorted: Array.from({ length: array.length }, (_, i) => i),
        comparisons: comparisons,
        swaps: swaps,
        message: "Sorting Complete!"
    });
    
    return array;
}

async function quickSortHelper(array, low, high, updateCallback, speed, stats) {
    if (low < high) {
        // Partition the array and get the pivot index
        const pivotIndex = await partition(array, low, high, updateCallback, speed, stats);
        
        // Mark pivot as sorted
        await updateCallback({
            array: [...array],
            pivot: pivotIndex,
            sorted: [pivotIndex],
            comparisons: stats.comparisons,
            swaps: stats.swaps,
            message: `Pivot ${array[pivotIndex]} is now in correct position`
        });
        
        await delay(speed);
        
        // Recursively sort elements before and after partition
        await quickSortHelper(array, low, pivotIndex - 1, updateCallback, speed, stats);
        await quickSortHelper(array, pivotIndex + 1, high, updateCallback, speed, stats);
    } else if (low === high) {
        // Single element is always sorted
        await updateCallback({
            array: [...array],
            sorted: [low],
            comparisons: stats.comparisons,
            swaps: stats.swaps,
            message: `Element ${array[low]} is sorted`
        });
        await delay(speed);
    }
}

async function partition(array, low, high, updateCallback, speed, stats) {
    // Choose the rightmost element as pivot
    const pivot = array[high];
    let i = low - 1;
    
    // Highlight the pivot
    await updateCallback({
        array: [...array],
        pivot: high,
        comparing: [],
        comparisons: stats.comparisons,
        swaps: stats.swaps,
        message: `Selected pivot: ${pivot}`
    });
    await delay(speed);
    
    for (let j = low; j < high; j++) {
        // Highlight current element being compared
        await updateCallback({
            array: [...array],
            pivot: high,
            comparing: [j],
            comparisons: stats.comparisons,
            swaps: stats.swaps,
            message: `Comparing ${array[j]} with pivot ${pivot}`
        });
        await delay(speed);
        
        stats.comparisons++;
        
        if (array[j] < pivot) {
            i++;
            
            // Highlight elements to be swapped
            await updateCallback({
                array: [...array],
                pivot: high,
                comparing: [j],
                swapping: [i, j],
                comparisons: stats.comparisons,
                swaps: stats.swaps,
                message: `Moving ${array[j]} to position ${i}`
            });
            await delay(speed);
            
            if (i !== j) {
                // Swap elements
                [array[i], array[j]] = [array[j], array[i]];
                stats.swaps++;
                
                // Update after swap
                await updateCallback({
                    array: [...array],
                    pivot: high,
                    swapping: [i, j],
                    comparisons: stats.comparisons,
                    swaps: stats.swaps,
                    message: `Swapped ${array[i]} and ${array[j]}`
                });
                await delay(speed);
            }
        }
    }
    
    // Swap pivot with element at i+1
    await updateCallback({
        array: [...array],
        pivot: high,
        swapping: [i + 1, high],
        comparisons: stats.comparisons,
        swaps: stats.swaps,
        message: `Placing pivot ${pivot} in final position ${i + 1}`
    });
    await delay(speed);
    
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    stats.swaps++;
    
    // Update after final pivot placement
    await updateCallback({
        array: [...array],
        pivot: i + 1,
        comparisons: stats.comparisons,
        swaps: stats.swaps,
        message: `Pivot ${pivot} placed at position ${i + 1}`
    });
    await delay(speed);
    
    return i + 1;
}

// Utility function for delays
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Alternative implementation with different pivot selection (middle element)
async function quickSortMiddlePivot(array, updateCallback, speed) {
    let comparisons = 0;
    let swaps = 0;
    
    await quickSortHelperMiddle(array, 0, array.length - 1, updateCallback, speed, { comparisons, swaps });
    
    // Final update
    await updateCallback({
        array: [...array],
        sorted: Array.from({ length: array.length }, (_, i) => i),
        comparisons: comparisons,
        swaps: swaps,
        message: "Sorting Complete!"
    });
    
    return array;
}

async function quickSortHelperMiddle(array, low, high, updateCallback, speed, stats) {
    if (low < high) {
        const pivotIndex = await partitionMiddle(array, low, high, updateCallback, speed, stats);
        
        await updateCallback({
            array: [...array],
            pivot: pivotIndex,
            sorted: [pivotIndex],
            comparisons: stats.comparisons,
            swaps: stats.swaps,
            message: `Pivot ${array[pivotIndex]} sorted`
        });
        await delay(speed);
        
        await quickSortHelperMiddle(array, low, pivotIndex - 1, updateCallback, speed, stats);
        await quickSortHelperMiddle(array, pivotIndex + 1, high, updateCallback, speed, stats);
    } else if (low === high) {
        await updateCallback({
            array: [...array],
            sorted: [low],
            comparisons: stats.comparisons,
            swaps: stats.swaps,
            message: `Element ${array[low]} sorted`
        });
        await delay(speed);
    }
}

async function partitionMiddle(array, low, high, updateCallback, speed, stats) {
    // Choose middle element as pivot
    const mid = Math.floor((low + high) / 2);
    const pivot = array[mid];
    
    // Move pivot to the end temporarily
    [array[mid], array[high]] = [array[high], array[mid]];
    stats.swaps++;
    
    await updateCallback({
        array: [...array],
        pivot: high,
        comparisons: stats.comparisons,
        swaps: stats.swaps,
        message: `Selected middle pivot: ${pivot}`
    });
    await delay(speed);
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        await updateCallback({
            array: [...array],
            pivot: high,
            comparing: [j],
            comparisons: stats.comparisons,
            swaps: stats.swaps,
            message: `Comparing ${array[j]} with pivot ${pivot}`
        });
        await delay(speed);
        
        stats.comparisons++;
        
        if (array[j] < pivot) {
            i++;
            
            await updateCallback({
                array: [...array],
                pivot: high,
                comparing: [j],
                swapping: [i, j],
                comparisons: stats.comparisons,
                swaps: stats.swaps,
                message: `Moving ${array[j]} to position ${i}`
            });
            await delay(speed);
            
            if (i !== j) {
                [array[i], array[j]] = [array[j], array[i]];
                stats.swaps++;
                
                await updateCallback({
                    array: [...array],
                    pivot: high,
                    swapping: [i, j],
                    comparisons: stats.comparisons,
                    swaps: stats.swaps,
                    message: `Swapped ${array[i]} and ${array[j]}`
                });
                await delay(speed);
            }
        }
    }
    
    // Move pivot back to correct position
    await updateCallback({
        array: [...array],
        pivot: high,
        swapping: [i + 1, high],
        comparisons: stats.comparisons,
        swaps: stats.swaps,
        message: `Placing pivot ${pivot} at position ${i + 1}`
    });
    await delay(speed);
    
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    stats.swaps++;
    
    await updateCallback({
        array: [...array],
        pivot: i + 1,
        comparisons: stats.comparisons,
        swaps: stats.swaps,
        message: `Pivot ${pivot} placed at position ${i + 1}`
    });
    await delay(speed);
    
    return i + 1;
}

// Simple swap function
function swap(array, i, j) {
    [array[i], array[j]] = [array[j], array[i]];
}