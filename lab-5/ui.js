import { store } from './store.js';
import { randomHsl } from './helpers.js';

export function initUI() {
    const board = document.getElementById('board');
    const cntSquares = document.getElementById('cntSquares');
    const cntCircles = document.getElementById('cntCircles');

    const addSquareBtn = document.getElementById('addSquare');
    const addCircleBtn = document.getElementById('addCircle');
    const recolorSquaresBtn = document.getElementById('recolorSquares');
    const recolorCirclesBtn = document.getElementById('recolorCircles');

    function updateCounters() {
        cntSquares.textContent = store.countByType('square');
        cntCircles.textContent = store.countByType('circle');
    }

    function createShapeEl(shape) {
        const el = document.createElement('div');
        el.className = `shape ${shape.type}`;
        el.style.backgroundColor = shape.color;
        el.dataset.id = shape.id;
        board.appendChild(el);
        return el;
    }

    function handleEvent(evt) {
        switch (evt.type) {
            case 'init':
                board.innerHTML = '';
                evt.shapes.forEach(createShapeEl);
                updateCounters();
                break;
            case 'add':
                createShapeEl({ ...evt.shape, color: evt.color });
                updateCounters();
                break;
            case 'remove': {
                const el = board.querySelector(`[data-id="${evt.id}"]`);
                if (el) el.remove();
                updateCounters();
                break;
            }
            case 'recolorMany':
                evt.items.forEach(({ id, color }) => {
                    const el = board.querySelector(`[data-id="${id}"]`);
                    if (el) el.style.backgroundColor = color;
                });
                break;
        }
    }

    board.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (!id) return;
        const shape = store.shapes.find((s) => s.id === id);
        if (!shape) return;
        store.removeShape(id);
    });

    addSquareBtn.addEventListener('click', () =>
        store.addShape('square', randomHsl())
    );
    addCircleBtn.addEventListener('click', () =>
        store.addShape('circle', randomHsl())
    );
    recolorSquaresBtn.addEventListener('click', () =>
        store.recolorShapes('square')
    );
    recolorCirclesBtn.addEventListener('click', () =>
        store.recolorShapes('circle')
    );

    store.subscribe(handleEvent);
}
