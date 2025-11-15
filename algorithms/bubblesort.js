async function bubbleSort(array, updateCallback, speed = 300) {
    let comparisons = 0;
    let swaps = 0;
    const n = array.length;
    
    // Record initial state
    await updateCallback({
        array: [...array],
        comparisons: comparisons,
        swaps: swaps,
        message: "🏁 Starting Bubble Sort Algorithm",
        status: "started"
    });
    await delay(speed * 2);

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        
        await updateCallback({
            array: [...array],
            comparisons: comparisons,
            swaps: swaps,
            message: `📊 Pass ${i + 1}/${n - 1}: Scanning array from beginning to position ${n - i - 1}`,
            currentPass: i + 1,
            totalPasses: n - 1
        });
        await delay(speed);

        for (let j = 0; j < n - i - 1; j++) {
            // Highlight the two elements being compared
            await updateCallback({
                array: [...array],
                comparisons: comparisons,
                swaps: swaps,
                comparing: [j, j + 1],
                message: `🔍 Comparing: ${array[j]} and ${array[j + 1]} at positions ${j} and ${j + 1}`
            });
            await delay(speed);
            
            comparisons++;
            
            if (array[j] > array[j + 1]) {
                // Show decision to swap
                await updateCallback({
                    array: [...array],
                    comparisons: comparisons,
                    swaps: swaps,
                    comparing: [j, j + 1],
                    message: `❌ ${array[j]} > ${array[j + 1]} - These elements are in wrong order, will swap them`
                });
                await delay(speed * 1.5);

                // Show swapping animation
                await updateCallback({
                    array: [...array],
                    comparisons: comparisons,
                    swaps: swaps,
                    swapping: [j, j + 1],
                    message: `🔄 Swapping: ${array[j]} and ${array[j + 1]}`
                });
                await delay(speed);

                // Perform the swap
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                swaps++;
                swapped = true;

                // Show after swap state
                await updateCallback({
                    array: [...array],
                    comparisons: comparisons,
                    swaps: swaps,
                    swapping: [j, j + 1],
                    message: `✅ Swapped: Now ${array[j]} at position ${j} and ${array[j + 1]} at position ${j + 1}`
                });
                await delay(speed * 1.5);
            } else {
                await updateCallback({
                    array: [...array],
                    comparisons: comparisons,
                    swaps: swaps,
                    comparing: [j, j + 1],
                    message: `✅ ${array[j]} ≤ ${array[j + 1]} - Elements are in correct order, no swap needed`
                });
                await delay(speed);
            }

            // Clear comparison highlights
            await updateCallback({
                array: [...array],
                comparisons: comparisons,
                swaps: swaps,
                message: `➡️ Moving to next pair of elements...`
            });
            await delay(speed / 2);
        }

        // Mark the last element of this pass as sorted
        const sortedPosition = n - i - 1;
        await updateCallback({
            array: [...array],
            comparisons: comparisons,
            swaps: swaps,
            sorted: Array.from({ length: i + 1 }, (_, idx) => n - 1 - idx),
            message: `🎯 Element at position ${sortedPosition} (${array[sortedPosition]}) is now in its final sorted position`
        });
        await delay(speed * 2);

        // Check for early termination
        if (!swapped) {
            await updateCallback({
                array: [...array],
                comparisons: comparisons,
                swaps: swaps,
                sorted: Array.from({ length: n }, (_, idx) => idx),
                message: `💡 Early Termination: No swaps were needed in pass ${i + 1}, array is already sorted!`
            });
            await delay(speed * 3);
            break;
        }

        // Show progress after each pass
        const progress = Math.round(((i + 1) / (n - 1)) * 100);
        await updateCallback({
            array: [...array],
            comparisons: comparisons,
            swaps: swaps,
            sorted: Array.from({ length: i + 1 }, (_, idx) => n - 1 - idx),
            message: `📈 Progress: ${progress}% complete - ${i + 1} of ${n - 1} passes completed`
        });
        await delay(speed * 2);
    }

    // Final sorted state with celebration
    await updateCallback({
        array: [...array],
        comparisons: comparisons,
        swaps: swaps,
        sorted: Array.from({ length: n }, (_, i) => i),
        message: `🎉 Bubble Sort Complete! Sorted ${n} elements with ${comparisons} comparisons and ${swaps} swaps`
    });
    
    // Final celebration delay
    await delay(speed * 4);

    return array;
}

// Enhanced version with more detailed educational messages
async function bubbleSortEducational(array, updateCallback, speed = 400) {
    let comparisons = 0;
    let swaps = 0;
    const n = array.length;
    
    await updateCallback({
        array: [...array],
        comparisons: 0,
        swaps: 0,
        message: "🧠 BUBBLE SORT: Starting visualization...\nThis algorithm repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        status: "educational"
    });
    await delay(speed * 3);

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        let passSwaps = 0;
        let passComparisons = 0;

        await updateCallback({
            array: [...array],
            comparisons: comparisons,
            swaps: swaps,
            message: `\n📖 PASS ${i + 1}:\nThe algorithm will now compare each pair of adjacent elements from the start to position ${n - i - 1}.`,
            currentPass: i + 1,
            totalPasses: n - 1
        });
        await delay(speed * 2);

        for (let j = 0; j < n - i - 1; j++) {
            // Educational comparison step
            await updateCallback({
                array: [...array],
                comparisons: comparisons,
                swaps: swaps,
                comparing: [j, j + 1],
                message: `🔍 COMPARISON:\nLooking at elements at positions ${j} and ${j + 1}:\n${array[j]} vs ${array[j + 1]}`
            });
            await delay(speed * 1.5);

            comparisons++;
            passComparisons++;

            if (array[j] > array[j + 1]) {
                // Educational swap explanation
                await updateCallback({
                    array: [...array],
                    comparisons: comparisons,
                    swaps: swaps,
                    comparing: [j, j + 1],
                    message: `🔄 SWAP NEEDED:\n${array[j]} > ${array[j + 1]}\nThe larger element should move right, so we'll swap them.`
                });
                await delay(speed * 2);

                // Show swap in progress
                await updateCallback({
                    array: [...array],
                    comparisons: comparisons,
                    swaps: swaps,
                    swapping: [j, j + 1],
                    message: `⚡ SWAPPING:\nMoving ${array[j]} to position ${j + 1}\nand ${array[j + 1]} to position ${j}`
                });
                await delay(speed * 1.5);

                // Perform swap
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                swaps++;
                passSwaps++;
                swapped = true;

                // After swap explanation
                await updateCallback({
                    array: [...array],
                    comparisons: comparisons,
                    swaps: swaps,
                    swapping: [j, j + 1],
                    message: `✅ SWAP COMPLETE:\nNow ${array[j]} is at position ${j}\nand ${array[j + 1]} is at position ${j + 1}`
                });
                await delay(speed * 2);
            } else {
                await updateCallback({
                    array: [...array],
                    comparisons: comparisons,
                    swaps: swaps,
                    comparing: [j, j + 1],
                    message: `✓ NO SWAP:\n${array[j]} ≤ ${array[j + 1]}\nElements are already in correct order.`
                });
                await delay(speed * 1.5);
            }
        }

        // End of pass summary
        const sortedCount = i + 1;
        await updateCallback({
            array: [...array],
            comparisons: comparisons,
            swaps: swaps,
            sorted: Array.from({ length: sortedCount }, (_, idx) => n - 1 - idx),
            message: `📊 PASS ${i + 1} SUMMARY:\n- ${passComparisons} comparisons made\n- ${passSwaps} swaps performed\n- ${sortedCount} elements now in final positions\n- ${n - sortedCount} elements remaining to sort`
        });
        await delay(speed * 3);

        if (!swapped) {
            await updateCallback({
                array: [...array],
                comparisons: comparisons,
                swaps: swaps,
                sorted: Array.from({ length: n }, (_, idx) => idx),
                message: `🎯 EARLY COMPLETION!\nNo swaps were made in this pass.\nThe algorithm detected the array is already sorted.`
            });
            await delay(speed * 4);
            break;
        }
    }

    // Final comprehensive summary
    await updateCallback({
        array: [...array],
        comparisons: comparisons,
        swaps: swaps,
        sorted: Array.from({ length: n }, (_, i) => i),
        message: `🏆 BUBBLE SORT COMPLETE!\n\n📈 FINAL STATISTICS:\n- Total elements: ${n}\n- Total comparisons: ${comparisons}\n- Total swaps: ${swaps}\n- Time complexity: O(n²)\n- Space complexity: O(1)\n\n💡 Bubble Sort is simple but inefficient for large datasets.`
    });

    return array;
}

// Optimized version with flag for educational mode
async function bubbleSortWithOptions(array, updateCallback, speed = 300, educational = false) {
    if (educational) {
        return await bubbleSortEducational(array, updateCallback, speed);
    } else {
        return await bubbleSort(array, updateCallback, speed);
    }
}

// Utility function for delays
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Simple swap function
function swap(array, i, j) {
    [array[i], array[j]] = [array[j], array[i]];
}