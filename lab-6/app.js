import { Ajax } from './ajax.js';

const api = new Ajax({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 5000,
});

const btnLoad = document.getElementById('btn-load');
const btnError = document.getElementById('btn-error');
const btnReset = document.getElementById('btn-reset');
const list = document.getElementById('list');
const loader = document.getElementById('loader');
const errorBox = document.getElementById('error');

function showLoader(show) {
    loader.style.display = show ? 'block' : 'none';
}

function showError(msg) {
    errorBox.textContent = msg;
}

function clearEverything() {
    list.innerHTML = '';
    showError('');
    showLoader(false);
}

btnReset.addEventListener('click', clearEverything);

btnLoad.addEventListener('click', async () => {
    clearEverything();
    showLoader(true);

    try {
        const posts = await api.get('/posts?_limit=5');

        posts.forEach((p) => {
            const li = document.createElement('li');
            li.classList.add('list-item');
            li.textContent = `${p.id}: ${p.title}`;
            list.appendChild(li);
        });
    } catch (err) {
        showError(err.message);
    } finally {
        showLoader(false);
    }
});

btnError.addEventListener('click', async () => {
    clearEverything();
    showLoader(true);

    try {
        await api.get('/blad');
    } catch (err) {
        showError('Błąd: ' + err.message);
    } finally {
        showLoader(false);
    }
});
