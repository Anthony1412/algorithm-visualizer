async function bubbleSort(array, recordStep) {
    const n = array.length;
    
    // Record initial state
    await recordStep({
        array: [...array],
        message: "Starting Bubble Sort - Compare adjacent elements and swap if needed"
    });
    
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        
        await recordStep({
            array: [...array],
            message: `Pass ${i + 1}: Comparing elements from start to ${n - i - 1}`
        });
        
        for (let j = 0; j < n - i - 1; j++) {
            // Compare step
            await recordStep({
                array: [...array],
                comparisons: 1,
                comparing: [j, j + 1],
                message: `Comparing ${array[j]} and ${array[j + 1]}`
            });
            
            if (array[j] > array[j + 1]) {
                // Swap step
                await recordStep({
                    array: [...array],
                    message: `${array[j]} > ${array[j + 1]} - Swapping elements`
                });
                
                swap(array, j, j + 1);
                swapped = true;
                
                await recordStep({
                    array: [...array],
                    swaps: 1,
                    swapping: [j, j + 1],
                    message: `Swapped ${array[j + 1]} and ${array[j]}`
                });
                
                await delay(50);
            }
        }
        
        // Mark sorted element
        await recordStep({
            array: [...array],
            sorted: [n - i - 1],
            message: `Element at position ${n - i - 1} is now in its final position`
        });
        
        if (!swapped) {
            await recordStep({
                array: [...array],
                message: "No swaps needed - Array is sorted!"
            });
            break;
        }
    }
    
    // Final sorted state
    await recordStep({
        array: [...array],
        sorted: Array.from({ length: n }, (_, i) => i),
        message: "Bubble Sort Complete!"
    });
    
    return array;
}