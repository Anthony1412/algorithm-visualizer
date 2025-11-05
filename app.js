import { bubbleSort } from '/algorithms/bubbleSort.js';
import { selectionSort } from '/algorithms/selectionSort.js';
import { insertionSort } from '/algorithms/insertionSort.js';
import { mergeSort } from '/algorithms/mergeSort.js';
import { quickSort } from '/algorithms/quickSort.js';
import { renderArray, swap, delay } from './utils/helpers.js';

let array = [];
let arraySize = 50;
let speed = 250;
let algorithm = 'bubbleSort';
const arrayContainer = document.getElementById('array-container');

function generateArray() {
    array = [];
    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * 400) + 10);
    }
    renderArray(array, arrayContainer);
}

document.getElementById('array-size').addEventListener('input', (e) => {
    arraySize = e.target.value;
    generateArray();
});

document.getElementById('speed').addEventListener('input', (e) => {
    speed = e.target.value;
});

document.getElementById('algorithm-select').addEventListener('change', (e) => {
    algorithm = e.target.value;
});

document.getElementById('new-array').addEventListener('click', generateArray);

document.getElementById('start').addEventListener('click', async () => {
    switch(algorithm) {
        case 'bubbleSort':
            await bubbleSort(array, arrayContainer, speed);
            break;
        case 'selectionSort':
            await selectionSort(array, arrayContainer, speed);
            break;
        case 'insertionSort':
            await insertionSort(array, arrayContainer, speed);
            break;
        case 'mergeSort':
            await mergeSort(array, arrayContainer, speed);
            break;
        case 'quickSort':
            await quickSort(array, arrayContainer, speed);
            break;
    }
});

generateArray();
