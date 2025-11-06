async function selectionSort(array, updateCallback) {
    const n = array.length;
    let comparisons = 0;
    let swaps = 0;
    
    await updateCallback({
        array: [...array],
        message: "Starting Selection Sort - Find minimum element and place it at beginning",
        comparisons: comparisons,
        swaps: swaps
    });
    
    await delay(800);

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        
        await updateCallback({
            array: [...array],
            comparing: [i],
            pivot: i,
            message: `Starting from position ${i}, looking for minimum element`
        });
        
        await delay(400);

        // Find the minimum element in remaining unsorted array
        for (let j = i + 1; j < n; j++) {
            comparisons++;
            await updateCallback({
                array: [...array],
                comparisons: 1,
                comparing: [minIndex, j],
                pivot: i,
                message: `Comparing ${array[minIndex]} at ${minIndex} with ${array[j]} at ${j}`
            });
            
            await delay(300);

            if (array[j] < array[minIndex]) {
                minIndex = j;
                await updateCallback({
                    array: [...array],
                    comparing: [minIndex],
                    pivot: i,
                    message: `New minimum found: ${array[minIndex]} at position ${minIndex}`
                });
                
                await delay(300);
            }
        }

        // Swap the found minimum element with the first element
        if (minIndex !== i) {
            await updateCallback({
                array: [...array],
                comparing: [i, minIndex],
                message: `Swapping ${array[i]} at ${i} with minimum ${array[minIndex]} at ${minIndex}`
            });
            
            await delay(400);

            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            swaps++;
            
            await updateCallback({
                array: [...array],
                swaps: 1,
                swapping: [i, minIndex],
                message: `Swapped! ${array[minIndex]} moved to position ${i}`
            });
            
            await delay(500);
        }

        // Mark the sorted position
        await updateCallback({
            array: [...array],
            sorted: [i],
            message: `Position ${i} is now sorted with value ${array[i]}`
        });
        
        await delay(400);
    }

    // Mark last element as sorted
    await updateCallback({
        array: [...array],
        sorted: [n - 1],
        message: "Final element is automatically sorted"
    });
    
    await delay(300);

    // Final sorted state
    await updateCallback({
        array: [...array],
        sorted: Array.from({ length: n }, (_, i) => i),
        comparisons: 0,
        swaps: 0,
        message: "🎉 Selection Sort Complete! Array is fully sorted."
    });
    
    return array;
}