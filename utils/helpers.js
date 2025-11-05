function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function highlightBars(index1, index2) {
  const bars = document.querySelectorAll('.bar');
  bars[index1].classList.add('active');
  bars[index2].classList.add('active');
  setTimeout(() => {
    bars[index1].classList.remove('active');
    bars[index2].classList.remove('active');
  }, 150);
}
