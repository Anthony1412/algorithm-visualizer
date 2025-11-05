import { renderArray, swap, delay } from '../utils/helpers.js';

export async function bubbleSort(arr, container, speed) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr, j, j + 1);
                renderArray(arr, container, [j, j + 1]);
                await delay(speed);
            }
        }
    }
    renderArray(arr, container);
}
