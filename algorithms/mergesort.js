import { delay } from '../utils/helpers.js';
import { renderArray } from '../utils/render.js';

export async function mergeSort(arr, container, speed) {
    async function mergeSortRec(start, end) {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);
        await mergeSortRec(start, mid);
        await mergeSortRec(mid + 1, end);
        await merge(start, mid, end);
    }

    async function merge(start, mid, end) {
        let left = arr.slice(start, mid + 1);
        let right = arr.slice(mid + 1, end + 1);
        let i = 0, j = 0, k = start;
        while (i < left.length && j < right.length) {
            renderArray(arr, container, { compare: [k] });
            await delay(speed);
            if (left[i] <= right[j]) {
                arr[k++] = left[i++];
            } else {
                arr[k++] = right[j++];
            }
            renderArray(arr, container, { swap: [k - 1] });
            await delay(speed);
        }
        while (i < left.length) arr[k++] = left[i++];
        while (j < right.length) arr[k++] = right[j++];
        renderArray(arr, container);
    }

    await mergeSortRec(0, arr.length - 1);
}
