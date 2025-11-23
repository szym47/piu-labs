import { generateId } from './helpers.js';
import { randomHsl } from './helpers.js';

class Store {
    constructor() {
        const data = JSON.parse(localStorage.getItem('shapesData')) || {
            shapes: [],
            colors: {},
        };
        this.shapes = data.shapes;
        this.colors = data.colors;
        this.subscribers = [];
    }

    persist() {
        localStorage.setItem(
            'shapesData',
            JSON.stringify({ shapes: this.shapes, colors: this.colors })
        );
    }

    subscribe(fn) {
        this.subscribers.push(fn);
        fn({
            type: 'init',
            shapes: this.shapes.map((s) => ({
                ...s,
                color: this.colors[s.id],
            })),
        });
    }

    notify(event) {
        this.subscribers.forEach((fn) => fn(event));
    }

    addShape(type, color) {
        const id = generateId();
        this.shapes.push({ id, type });
        this.colors[id] = color;
        this.persist();
        this.notify({ type: 'add', shape: { id, type }, color });
    }

    removeShape(id) {
        this.shapes = this.shapes.filter((s) => s.id !== id);
        delete this.colors[id];
        this.persist();
        this.notify({ type: 'remove', id });
    }

    recolorShapes(type) {
        const updated = [];
        for (const s of this.shapes) {
            if (s.type === type) {
                const c = randomHsl();
                this.colors[s.id] = c;
                updated.push({ id: s.id, color: c });
            }
        }
        if (updated.length) {
            this.persist();
            this.notify({ type: 'recolorMany', items: updated });
        }
    }

    countByType(type) {
        let cnt = 0;
        for (const s of this.shapes) if (s.type === type) cnt++;
        return cnt;
    }
}

export const store = new Store();
