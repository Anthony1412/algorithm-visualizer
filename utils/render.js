export function renderArray(arr, container, highlights = {}) {
    container.innerHTML = '';
    const width = container.clientWidth / arr.length - 2;
    arr.forEach((value, idx) => {
        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        if (highlights.compare?.includes(idx)) bar.classList.add('compare');
        if (highlights.swap?.includes(idx)) bar.classList.add('swap');
        bar.style.height = `${value}px`;
        bar.style.width = `${width}px`;
        container.appendChild(bar);
    });
}
