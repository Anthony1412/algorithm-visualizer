async function insertionSort(array, updateCallback) {
    const n = array.length;
    let comparisons = 0;
    let swaps = 0;
    
    await updateCallback({
        array: [...array],
        message: "Starting Insertion Sort - Build sorted array one element at a time",
        comparisons: comparisons,
        swaps: swaps
    });
    
    await delay(800);

    // Start from second element (index 1)
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        
        await updateCallback({
            array: [...array],
            comparing: [i],
            pivot: i,
            message: `Taking element ${key} at position ${i} to insert into sorted portion`
        });
        
        await delay(500);

        // Move elements of array[0..i-1] that are greater than key
        while (j >= 0 && array[j] > key) {
            comparisons++;
            await updateCallback({
                array: [...array],
                comparisons: 1,
                comparing: [j, j + 1],
                message: `Comparing ${array[j]} with ${key} - Need to shift ${array[j]} right`
            });
            
            await delay(400);

            // Shift element to the right
            array[j + 1] = array[j];
            swaps++;
            
            await updateCallback({
                array: [...array],
                swaps: 1,
                swapping: [j + 1],
                message: `Shifted ${array[j + 1]} from position ${j} to ${j + 1}`
            });
            
            await delay(400);

            j = j - 1;
        }

        // Place key at its correct position
        array[j + 1] = key;
        
        await updateCallback({
            array: [...array],
            swapping: [j + 1],
            sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
            message: `Inserted ${key} at correct position ${j + 1}`
        });
        
        await delay(500);
    }

    // Final sorted state
    await updateCallback({
        array: [...array],
        sorted: Array.from({ length: n }, (_, i) => i),
        comparisons: 0,
        swaps: 0,
        message: "🎉 Insertion Sort Complete! Array is fully sorted."
    });
    
    return array;
}