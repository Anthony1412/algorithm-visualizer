async function bubbleSort(array, updateCallback) {
    const n = array.length;
    let comparisons = 0;
    let swaps = 0;
    
    await updateCallback({
        array: [...array],
        message: "Starting Bubble Sort - Compare adjacent elements and swap if needed",
        comparisons: comparisons,
        swaps: swaps
    });
    
    await delay(800);

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        
        await updateCallback({
            array: [...array],
            message: `Pass ${i + 1}: Comparing adjacent elements from start to position ${n - i - 1}`,
            comparisons: comparisons,
            swaps: swaps
        });
        
        await delay(400);

        for (let j = 0; j < n - i - 1; j++) {
            // Highlight comparing indices
            comparisons++;
            await updateCallback({
                array: [...array],
                comparisons: 1,
                comparing: [j, j + 1],
                message: `Comparing ${array[j]} and ${array[j + 1]} at positions ${j} and ${j + 1}`
            });
            
            await delay(300);

            if (array[j] > array[j + 1]) {
                // Show swap decision
                await updateCallback({
                    array: [...array],
                    comparing: [j, j + 1],
                    message: `${array[j]} > ${array[j + 1]} - Elements need to be swapped`
                });
                
                await delay(300);

                // Perform swap
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                swapped = true;
                swaps++;
                
                await updateCallback({
                    array: [...array],
                    swaps: 1,
                    swapping: [j, j + 1],
                    message: `Swapped! ${array[j]} and ${array[j + 1]} changed positions`
                });
                
                await delay(400);
            }
        }
        
        // Mark the sorted element at the end
        await updateCallback({
            array: [...array],
            sorted: [n - i - 1],
            message: `Element at position ${n - i - 1} is now in its final sorted position`
        });
        
        await delay(500);

        if (!swapped) {
            await updateCallback({
                array: [...array],
                sorted: Array.from({ length: n }, (_, idx) => idx),
                message: "No swaps needed in this pass - Array is completely sorted!"
            });
            break;
        }
    }
    
    // Final sorted state
    await updateCallback({
        array: [...array],
        sorted: Array.from({ length: n }, (_, i) => i),
        comparisons: 0,
        swaps: 0,
        message: "🎉 Bubble Sort Complete! Array is fully sorted."
    });
    
    return array;
}