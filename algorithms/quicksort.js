async function quickSort(array, updateCallback) {
    await quickSortHelper(array, 0, array.length - 1, updateCallback);
    
    // Final sorted state
    await updateCallback({
        array: [...array],
        sorted: Array.from({ length: array.length }, (_, i) => i)
    });
    
    return array;
}

async function quickSortHelper(array, low, high, updateCallback) {
    if (low < high) {
        // Partition the array and get the pivot index
        const pivotIndex = await partition(array, low, high, updateCallback);
        
        // Recursively sort elements before and after partition
        await quickSortHelper(array, low, pivotIndex - 1, updateCallback);
        await quickSortHelper(array, pivotIndex + 1, high, updateCallback);
    } else if (low === high) {
        // Single element is always sorted
        await updateCallback({
            array: [...array],
            sorted: [low]
        });
    }
}

async function partition(array, low, high, updateCallback) {
    // Choose the rightmost element as pivot
    const pivot = array[high];
    let i = low - 1;
    
    // Highlight the pivot
    await updateCallback({
        array: [...array],
        pivot: high,
        comparing: [high],
        message: `Pivot: ${pivot}`
    });
    
    for (let j = low; j < high; j++) {
        // Compare current element with pivot
        await updateCallback({
            array: [...array],
            comparisons: 1,
            comparing: [j, high],
            pivot: high
        });
        
        if (array[j] < pivot) {
            i++;
            
            // Swap elements
            if (i !== j) {
                swap(array, i, j);
                
                await updateCallback({
                    array: [...array],
                    swaps: 1,
                    swapping: [i, j],
                    pivot: high,
                    comparing: [i, j]
                });
            }
        }
    }
    
    // Swap pivot with element at i+1
    swap(array, i + 1, high);
    
    await updateCallback({
        array: [...array],
        swaps: 1,
        swapping: [i + 1, high],
        pivot: i + 1,
        sorted: [i + 1]
    });
    
    return i + 1;
}