export function swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
}

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function renderArray(arr, container, highlight = []) {
    container.innerHTML = '';
    const width = container.clientWidth / arr.length - 2;
    arr.forEach((value, idx) => {
        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        bar.style.height = `${value}px`;
        bar.style.width = `${width}px`;
        bar.style.backgroundColor = highlight.includes(idx) ? 'red' : '#4CAF50';
        container.appendChild(bar);
    });
}
