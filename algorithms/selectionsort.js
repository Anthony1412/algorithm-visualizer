import { swap, delay } from '../utils/helpers.js';
import { renderArray } from '../utils/render.js';

export async function selectionSort(arr, container, speed) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            renderArray(arr, container, { compare: [minIdx, j] });
            await delay(speed);
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx !== i) {
            swap(arr, i, minIdx);
            renderArray(arr, container, { swap: [i, minIdx] });
            await delay(speed);
        }
    }
    renderArray(arr, container);
}
