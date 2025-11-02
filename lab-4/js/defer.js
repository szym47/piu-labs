const mainBoard = document.getElementById('mainBoard');
const addToDoBtn = document.getElementById('addToDo');
const addInProgressBtn = document.getElementById('addInProgress');
const addDoneBtn = document.getElementById('addDone');
const recolorToDoBtn = document.getElementById('recolorToDo');
const recolorInProgressBtn = document.getElementById('recolorInProgress');
const recolorDoneBtn = document.getElementById('recolorDone');
const sortToDoBtn = document.getElementById('sortToDo');
const sortInProgressBtn = document.getElementById('sortInProgress');
const sortDoneBtn = document.getElementById('sortDone');
const cntToDoEl = document.getElementById('cntToDo');
const cntInProgressEl = document.getElementById('cntInProgress');
const cntDoneEl = document.getElementById('cntDone');

const columns = document.querySelectorAll('.column');
const boardToDo = columns[0];
const boardInProgress = columns[1];
const boardDone = columns[2];

function randomHsl() {
    return 'hsl(' + Math.floor(Math.random() * 360) + ', 70%, 75%)';
}

let toDoCount = 0;
let inProgressCount = 0;
let doneCount = 0;
let cardIdCounter = 0;

function updateCounters() {
    cntToDoEl.textContent = toDoCount;
    cntInProgressEl.textContent = inProgressCount;
    cntDoneEl.textContent = doneCount;
}

function createCard(type, text, color, id) {
    const card = document.createElement('div');
    card.className = 'card ' + type;

    if (id !== undefined) {
        card.id = 'card-' + id;
        if (id >= cardIdCounter) {
            cardIdCounter = id + 1;
        }
    } else {
        card.id = 'card-' + cardIdCounter;
        cardIdCounter = cardIdCounter + 1;
    }

    card.style.backgroundColor = color || randomHsl();

    const content = document.createElement('div');
    content.contentEditable = true;
    content.textContent = text || 'Nowa karta';
    content.style.marginBottom = '0.5rem';
    content.style.outline = 'none';
    content.className = 'card-content';

    const btnContainer = document.createElement('div');
    btnContainer.className = 'btn-container';
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '0.5rem';
    btnContainer.style.marginTop = '0.5rem';
    btnContainer.style.width = '100%';
    btnContainer.style.justifyContent = 'space-between';

    const arrowContainer = document.createElement('div');
    arrowContainer.style.display = 'flex';
    arrowContainer.style.gap = '0.5rem';

    if (type !== 'ToDo') {
        const leftBtn = document.createElement('button');
        leftBtn.textContent = '←';
        leftBtn.className = 'move-left';
        leftBtn.style.cursor = 'pointer';
        arrowContainer.appendChild(leftBtn);
    }

    if (type !== 'Done') {
        const rightBtn = document.createElement('button');
        rightBtn.textContent = '→';
        rightBtn.className = 'move-right';
        rightBtn.style.cursor = 'pointer';
        arrowContainer.appendChild(rightBtn);
    }

    btnContainer.appendChild(arrowContainer);

    const actionContainer = document.createElement('div');
    actionContainer.style.display = 'flex';
    actionContainer.style.gap = '0.5rem';

    const colorBtn = document.createElement('button');
    colorBtn.textContent = '🎨';
    colorBtn.className = 'color-btn';
    colorBtn.style.cursor = 'pointer';
    actionContainer.appendChild(colorBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';
    deleteBtn.className = 'delete-btn';
    deleteBtn.style.cursor = 'pointer';
    actionContainer.appendChild(deleteBtn);

    btnContainer.appendChild(actionContainer);
    card.appendChild(content);
    card.appendChild(btnContainer);

    return card;
}

function updateCardButtons(card) {
    let type = '';
    if (card.classList.contains('ToDo')) {
        type = 'ToDo';
    } else if (card.classList.contains('InProgress')) {
        type = 'InProgress';
    } else if (card.classList.contains('Done')) {
        type = 'Done';
    }

    const oldButtons = card.querySelector('.btn-container');
    if (oldButtons) {
        oldButtons.remove();
    }

    const btnContainer = document.createElement('div');
    btnContainer.className = 'btn-container';
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '0.5rem';
    btnContainer.style.marginTop = '0.5rem';
    btnContainer.style.width = '100%';
    btnContainer.style.justifyContent = 'space-between';

    const arrowContainer = document.createElement('div');
    arrowContainer.style.display = 'flex';
    arrowContainer.style.gap = '0.5rem';

    if (type !== 'ToDo') {
        const leftBtn = document.createElement('button');
        leftBtn.textContent = '←';
        leftBtn.className = 'move-left';
        leftBtn.style.cursor = 'pointer';
        arrowContainer.appendChild(leftBtn);
    }

    if (type !== 'Done') {
        const rightBtn = document.createElement('button');
        rightBtn.textContent = '→';
        rightBtn.className = 'move-right';
        rightBtn.style.cursor = 'pointer';
        arrowContainer.appendChild(rightBtn);
    }

    btnContainer.appendChild(arrowContainer);

    const actionContainer = document.createElement('div');
    actionContainer.style.display = 'flex';
    actionContainer.style.gap = '0.5rem';

    const colorBtn = document.createElement('button');
    colorBtn.textContent = '🎨';
    colorBtn.className = 'color-btn';
    colorBtn.style.cursor = 'pointer';
    actionContainer.appendChild(colorBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';
    deleteBtn.className = 'delete-btn';
    deleteBtn.style.cursor = 'pointer';
    actionContainer.appendChild(deleteBtn);

    btnContainer.appendChild(actionContainer);
    card.appendChild(btnContainer);
}

// localStorage - zapis
function saveToLocalStorage() {
    const data = {
        toDo: [],
        inProgress: [],
        done: [],
        cardIdCounter: cardIdCounter,
    };

    const toDoCards = mainBoard.getElementsByClassName('ToDo');
    for (let i = 0; i < toDoCards.length; i++) {
        const content = toDoCards[i].querySelector('.card-content');
        data.toDo.push({
            id: toDoCards[i].id.replace('card-', ''),
            text: content.textContent,
            color: toDoCards[i].style.backgroundColor,
        });
    }

    const inProgressCards = mainBoard.getElementsByClassName('InProgress');
    for (let i = 0; i < inProgressCards.length; i++) {
        const content = inProgressCards[i].querySelector('.card-content');
        data.inProgress.push({
            id: inProgressCards[i].id.replace('card-', ''),
            text: content.textContent,
            color: inProgressCards[i].style.backgroundColor,
        });
    }

    const doneCards = mainBoard.getElementsByClassName('Done');
    for (let i = 0; i < doneCards.length; i++) {
        const content = doneCards[i].querySelector('.card-content');
        data.done.push({
            id: doneCards[i].id.replace('card-', ''),
            text: content.textContent,
            color: doneCards[i].style.backgroundColor,
        });
    }

    localStorage.setItem('kanbanData', JSON.stringify(data));
}

// localStorage - odczyt
function loadFromLocalStorage() {
    const saved = localStorage.getItem('kanbanData');
    if (!saved) return;

    const data = JSON.parse(saved);
    cardIdCounter = data.cardIdCounter || 0;

    for (let i = 0; i < data.toDo.length; i++) {
        const cardData = data.toDo[i];
        const card = createCard(
            'ToDo',
            cardData.text,
            cardData.color,
            parseInt(cardData.id)
        );
        boardToDo.appendChild(card);
        toDoCount = toDoCount + 1;
    }

    for (let i = 0; i < data.inProgress.length; i++) {
        const cardData = data.inProgress[i];
        const card = createCard(
            'InProgress',
            cardData.text,
            cardData.color,
            parseInt(cardData.id)
        );
        boardInProgress.appendChild(card);
        inProgressCount = inProgressCount + 1;
    }

    for (let i = 0; i < data.done.length; i++) {
        const cardData = data.done[i];
        const card = createCard(
            'Done',
            cardData.text,
            cardData.color,
            parseInt(cardData.id)
        );
        boardDone.appendChild(card);
        doneCount = doneCount + 1;
    }

    updateCounters();
}

// Sortowanie kart alfabetycznie
function sortColumn(columnElement) {
    const cards = Array.from(columnElement.querySelectorAll('.card'));

    cards.sort(function (a, b) {
        const textA = a
            .querySelector('.card-content')
            .textContent.toLowerCase();
        const textB = b
            .querySelector('.card-content')
            .textContent.toLowerCase();
        if (textA < textB) return -1;
        if (textA > textB) return 1;
        return 0;
    });

    for (let i = 0; i < cards.length; i++) {
        columnElement.appendChild(cards[i]);
    }

    saveToLocalStorage();
}

const toDoLive = mainBoard.getElementsByClassName('ToDo');
const inProgressLive = mainBoard.getElementsByClassName('InProgress');
const doneLive = mainBoard.getElementsByClassName('Done');

addToDoBtn.addEventListener('click', function () {
    const card = createCard('ToDo');
    boardToDo.appendChild(card);
    toDoCount = toDoCount + 1;
    updateCounters();
    saveToLocalStorage();
});

addInProgressBtn.addEventListener('click', function () {
    const card = createCard('InProgress');
    boardInProgress.appendChild(card);
    inProgressCount = inProgressCount + 1;
    updateCounters();
    saveToLocalStorage();
});

addDoneBtn.addEventListener('click', function () {
    const card = createCard('Done');
    boardDone.appendChild(card);
    doneCount = doneCount + 1;
    updateCounters();
    saveToLocalStorage();
});

// Sortowanie kolumn
sortToDoBtn.addEventListener('click', function () {
    sortColumn(boardToDo);
});

sortInProgressBtn.addEventListener('click', function () {
    sortColumn(boardInProgress);
});

sortDoneBtn.addEventListener('click', function () {
    sortColumn(boardDone);
});

mainBoard.addEventListener('click', function (e) {
    const card = e.target.closest('.card');
    if (!card) return;

    if (e.target.classList.contains('delete-btn')) {
        if (card.classList.contains('ToDo')) {
            toDoCount = toDoCount - 1;
        }
        if (card.classList.contains('InProgress')) {
            inProgressCount = inProgressCount - 1;
        }
        if (card.classList.contains('Done')) {
            doneCount = doneCount - 1;
        }
        card.remove();
        updateCounters();
        saveToLocalStorage();
    }

    if (e.target.classList.contains('color-btn')) {
        card.style.backgroundColor = randomHsl();
        saveToLocalStorage();
    }

    if (e.target.classList.contains('move-left')) {
        if (card.classList.contains('InProgress')) {
            card.classList.remove('InProgress');
            card.classList.add('ToDo');
            boardToDo.appendChild(card);
            inProgressCount = inProgressCount - 1;
            toDoCount = toDoCount + 1;
            updateCardButtons(card);
        } else if (card.classList.contains('Done')) {
            card.classList.remove('Done');
            card.classList.add('InProgress');
            boardInProgress.appendChild(card);
            doneCount = doneCount - 1;
            inProgressCount = inProgressCount + 1;
            updateCardButtons(card);
        }
        updateCounters();
        saveToLocalStorage();
    }

    if (e.target.classList.contains('move-right')) {
        if (card.classList.contains('ToDo')) {
            card.classList.remove('ToDo');
            card.classList.add('InProgress');
            boardInProgress.appendChild(card);
            toDoCount = toDoCount - 1;
            inProgressCount = inProgressCount + 1;
            updateCardButtons(card);
        } else if (card.classList.contains('InProgress')) {
            card.classList.remove('InProgress');
            card.classList.add('Done');
            boardDone.appendChild(card);
            inProgressCount = inProgressCount - 1;
            doneCount = doneCount + 1;
            updateCardButtons(card);
        }
        updateCounters();
        saveToLocalStorage();
    }
});

// Zapis przy edycji treści karty
mainBoard.addEventListener('input', function (e) {
    if (e.target.classList.contains('card-content')) {
        saveToLocalStorage();
    }
});

recolorToDoBtn.addEventListener('click', function () {
    for (let i = 0; i < toDoLive.length; i++) {
        toDoLive[i].style.backgroundColor = randomHsl();
    }
    saveToLocalStorage();
});

recolorInProgressBtn.addEventListener('click', function () {
    for (let i = 0; i < inProgressLive.length; i++) {
        inProgressLive[i].style.backgroundColor = randomHsl();
    }
    saveToLocalStorage();
});

recolorDoneBtn.addEventListener('click', function () {
    for (let i = 0; i < doneLive.length; i++) {
        doneLive[i].style.backgroundColor = randomHsl();
    }
    saveToLocalStorage();
});

// Załaduj dane przy starcie
loadFromLocalStorage();
updateCounters();
