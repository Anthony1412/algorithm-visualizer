async function quickSort(array, updateCallback) {
    let comparisons = 0;
    let swaps = 0;
    
    await updateCallback({
        array: [...array],
        message: "Starting Quick Sort - Divide and conquer using pivot elements",
        comparisons: comparisons,
        swaps: swaps
    });
    
    await delay(800);

    await quickSortHelper(array, 0, array.length - 1, updateCallback, comparisons, swaps);
    
    // Final sorted state
    await updateCallback({
        array: [...array],
        sorted: Array.from({ length: array.length }, (_, i) => i),
        comparisons: 0,
        swaps: 0,
        message: "🎉 Quick Sort Complete! Array is fully sorted."
    });
    
    return array;
}

async function quickSortHelper(array, low, high, updateCallback, comparisons, swaps) {
    if (low < high) {
        // Partition the array and get the pivot index
        const result = await partition(array, low, high, updateCallback, comparisons, swaps);
        const pivotIndex = result.pivotIndex;
        comparisons = result.comparisons;
        swaps = result.swaps;
        
        // Recursively sort elements before and after partition
        await quickSortHelper(array, low, pivotIndex - 1, updateCallback, comparisons, swaps);
        await quickSortHelper(array, pivotIndex + 1, high, updateCallback, comparisons, swaps);
    } else if (low === high) {
        // Single element is always sorted
        await updateCallback({
            array: [...array],
            sorted: [low],
            message: `Single element at position ${low} is sorted`
        });
        
        await delay(300);
    }
}

async function partition(array, low, high, updateCallback, comparisons, swaps) {
    // Choose the rightmost element as pivot
    const pivot = array[high];
    let i = low - 1;
    
    // Highlight the pivot
    await updateCallback({
        array: [...array],
        pivot: high,
        comparing: [high],
        message: `Selected pivot: ${pivot} at position ${high}`
    });
    
    await delay(600);

    for (let j = low; j < high; j++) {
        comparisons++;
        // Compare current element with pivot
        await updateCallback({
            array: [...array],
            comparisons: 1,
            comparing: [j, high],
            pivot: high,
            message: `Comparing ${array[j]} with pivot ${pivot}`
        });
        
        await delay(400);

        if (array[j] < pivot) {
            i++;
            
            await updateCallback({
                array: [...array],
                comparing: [i, j],
                pivot: high,
                message: `${array[j]} < ${pivot} - Will swap with position ${i}`
            });
            
            await delay(400);

            if (i !== j) {
                // Swap elements
                [array[i], array[j]] = [array[j], array[i]];
                swaps++;
                
                await updateCallback({
                    array: [...array],
                    swaps: 1,
                    swapping: [i, j],
                    pivot: high,
                    message: `Swapped ${array[i]} and ${array[j]}`
                });
                
                await delay(500);
            }
        } else {
            await updateCallback({
                array: [...array],
                comparing: [j],
                pivot: high,
                message: `${array[j]} >= ${pivot} - Keeping in place`
            });
            
            await delay(300);
        }
    }

    // Swap pivot with element at i+1
    await updateCallback({
        array: [...array],
        comparing: [i + 1, high],
        message: `Moving pivot ${pivot} to its final position ${i + 1}`
    });
    
    await delay(500);

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    swaps++;
    
    await updateCallback({
        array: [...array],
        swaps: 1,
        swapping: [i + 1, high],
        pivot: i + 1,
        sorted: [i + 1],
        message: `Pivot ${pivot} placed at final position ${i + 1}`
    });
    
    await delay(600);

    return { pivotIndex: i + 1, comparisons, swaps };
}