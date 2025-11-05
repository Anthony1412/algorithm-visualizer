import { swap, delay } from '../utils/helpers.js';
import { renderArray } from '../utils/render.js';

export async function quickSort(arr, container, speed) {
    async function partition(low, high) {
        const pivot = arr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            renderArray(arr, container, { compare: [j, high] });
            await delay(speed);
            if (arr[j] < pivot) {
                i++;
                swap(arr, i, j);
                renderArray(arr, container, { swap: [i, j] });
                await delay(speed);
            }
        }
        swap(arr, i + 1, high);
        renderArray(arr, container, { swap: [i + 1, high] });
        await delay(speed);
        return i + 1;
    }

    async function quickSortRec(low, high) {
        if (low < high) {
            const pi = await partition(low, high);
            await quickSortRec(low, pi - 1);
            await quickSortRec(pi + 1, high);
        }
    }

    await quickSortRec(0, arr.length - 1);
    renderArray(arr, container);
}
