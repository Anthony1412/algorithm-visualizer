async function binarySearch(array, target, updateCallback) {
    let left = 0;
    let right = array.length - 1;
    let steps = 0;
    
    // First, we need to sort the array for binary search
    const sortedArray = [...array].sort((a, b) => a - b);
    
    await updateCallback({
        array: sortedArray,
        comparisons: 0,
        message: "Array sorted for binary search"
    });
    
    while (left <= right) {
        steps++;
        const mid = Math.floor((left + right) / 2);
        
        // Highlight the current search range and middle element
        await updateCallback({
            array: sortedArray,
            comparisons: 1,
            comparing: [mid],
            pivot: mid,
            searching: Array.from({ length: right - left + 1 }, (_, i) => left + i),
            message: `Searching between indices ${left} and ${right}`
        });
        
        await delay(1000);
        
        if (sortedArray[mid] === target) {
            // Found the target
            await updateCallback({
                array: sortedArray,
                comparisons: 1,
                sorted: [mid],
                message: `Found ${target} at index ${mid} after ${steps} steps!`
            });
            return mid;
        }
        
        if (sortedArray[mid] < target) {
            left = mid + 1;
            await updateCallback({
                array: sortedArray,
                comparisons: 1,
                comparing: [mid],
                searching: Array.from({ length: right - left + 1 }, (_, i) => left + i),
                message: `${target} is greater than ${sortedArray[mid]}, searching right half`
            });
        } else {
            right = mid - 1;
            await updateCallback({
                array: sortedArray,
                comparisons: 1,
                comparing: [mid],
                searching: Array.from({ length: right - left + 1 }, (_, i) => left + i),
                message: `${target} is less than ${sortedArray[mid]}, searching left half`
            });
        }
        
        await delay(800);
    }
    
    // Target not found
    await updateCallback({
        array: sortedArray,
        comparisons: 1,
        message: `${target} not found in the array after ${steps} steps`
    });
    
    return -1;
}