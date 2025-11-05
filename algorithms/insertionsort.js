import { swap, delay } from '../utils/helpers.js';
import { renderArray } from '../utils/render.js';

export async function insertionSort(arr, container, speed) {
    const n = arr.length;
    for (let i = 1; i < n; i++) {
        let j = i;
        while (j > 0 && arr[j - 1] > arr[j]) {
            renderArray(arr, container, { compare: [j - 1, j] });
            await delay(speed);
            swap(arr, j, j - 1);
            renderArray(arr, container, { swap: [j, j - 1] });
            await delay(speed);
            j--;
        }
    }
    renderArray(arr, container);
}
