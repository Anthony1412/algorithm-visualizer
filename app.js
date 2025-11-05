import { bubbleSort } from '/algorithms/bubbleSort.js';
import { selectionSort } from '/algorithms/selectionSort.js';
import { insertionSort } from '/algorithms/insertionSort.js';
import { mergeSort } from '/algorithms/mergeSort.js';
import { quickSort } from '/algorithms/quickSort.js';
import { renderArray } from '/utils/render.js';

let array = [];
let arraySize = 20;
let speed = 200;
let algorithm = 'bubbleSort';
const container = document.getElementById('array-container');

function generateRandomArray() {
    array = [];
    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * 300) + 20);
    }
    renderArray(array, container);
}

document.getElementById('array-size').addEventListener('input', e => {
    arraySize = e.target.value;
    generateRandomArray();
});

document.getElementById('speed').addEventListener('input', e => {
    speed = e.target.value;
});

document.getElementById('algorithm-select').addEventListener('change', e => {
    algorithm = e.target.value;
});

document.getElementById('new-array').addEventListener('click', generateRandomArray);

document.getElementById('set-array').addEventListener('click', () => {
    const input = document.getElementById('user-array').value;
    array = input.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    if (array.length) renderArray(array, container);
});

document.getElementById('start').addEventListener('click', async () => {
    switch (algorithm) {
        case 'bubbleSort': await bubbleSort(array, container, speed); break;
        case 'selectionSort': await selectionSort(array, container, speed); break;
        case 'insertionSort': await insertionSort(array, container, speed); break;
        case 'mergeSort': await mergeSort(array, container, speed); break;
        case 'quickSort': await quickSort(array, container, speed); break;
    }
});

generateRandomArray();
