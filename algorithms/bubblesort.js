async function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      highlightBars(j, j + 1);
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
        renderArray(arr);
      }
      await sleep(speed);
    }
  }
}
