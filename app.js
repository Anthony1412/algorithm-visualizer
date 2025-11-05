let array = [];
let speed = 50;

document.getElementById('generate').addEventListener('click', generateArray);
document.getElementById('start').addEventListener('click', startSorting);
document.getElementById('speed').addEventListener('input', e => speed = e.target.value);

function generateArray(size = 30) {
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 5);
  renderArray(array);
}

async function startSorting() {
  const algorithm = document.getElementById('algorithm').value;
  if (algorithm === 'bubbleSort') await bubbleSort(array);
  renderArray(array);
}

generateArray();
