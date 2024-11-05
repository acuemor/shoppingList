// script.js

const itemsPerPage = 10;
let currentPage = 1;
let items = JSON.parse(localStorage.getItem('items')) || [];

// Detecta el evento "Enter" en el input para agregar el elemento
document.getElementById('itemInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addItem();
    }
});

// Función para capitalizar la primera letra
function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function addItem() {
    const itemInput = document.getElementById('itemInput');
    
    if (itemInput.value.trim() === "") return;

    // Capitaliza la primera letra del texto
    const capitalizedText = capitalizeFirstLetter(itemInput.value.trim());
    
    // Agrega el nuevo elemento al array de items con estado inicial 'Nada'
    const newItem = {
        text: capitalizedText,
        priority: 'Nada' // Estado inicial
    };
    items.push(newItem);

    // Guarda la lista en localStorage
    localStorage.setItem('items', JSON.stringify(items));

    // Muestra la lista actualizada en la página correcta
    renderList();
    itemInput.value = '';
}

function renderList() {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = ''; // Limpiar la lista actual

    // Calcular el índice de inicio y fin de la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = items.slice(startIndex, endIndex);

    // Crear y mostrar solo los elementos en la página actual
    itemsToDisplay.forEach(({ text, priority }) => {
        const li = document.createElement('li');
        li.classList.add('item');
        li.innerHTML = `
            <span>${text}</span>
            <div>
                <button onclick="setPriority(this, 'Nada')" class="${priority === 'Nada' ? 'priority-red' : ''}">Nada</button>
                <button onclick="setPriority(this, 'Poco')" class="${priority === 'Poco' ? 'priority-yellow' : ''}">Poco</button>
                <button onclick="setPriority(this, 'Mucho')" class="${priority === 'Mucho' ? 'priority-green' : ''}">Mucho</button>
                <button onclick="removeItem(this)" class="remove-btn"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        itemList.appendChild(li);
    });

    // Actualizar los botones de paginación
    updatePaginationControls();
}

function setPriority(button, priority) {
    const buttons = button.parentElement.querySelectorAll('button');

    // Actualiza el estado de prioridad en el array de items
    const itemText = button.parentElement.parentElement.querySelector('span').textContent;
    items.forEach(item => {
        if (item.text === itemText) {
            item.priority = priority; // Cambia la prioridad del item
        }
    });

    // Guarda la lista actualizada en localStorage
    localStorage.setItem('items', JSON.stringify(items));

    // Remueve las clases de color de todos los botones de prioridad
    buttons.forEach(btn => {
        btn.classList.remove('priority-red', 'priority-yellow', 'priority-green');
    });

    // Aplica la clase de color al botón clicado
    if (priority === 'Nada') {
        button.classList.add('priority-red');
    } else if (priority === 'Poco') {
        button.classList.add('priority-yellow');
    } else if (priority === 'Mucho') {
        button.classList.add('priority-green');
    }
}

function removeItem(button) {
    const li = button.closest('li');
    const itemText = li.querySelector('span').textContent;

    // Elimina el elemento del array de items
    items = items.filter(item => item.text !== itemText);

    // Guarda la lista actualizada en localStorage
    localStorage.setItem('items', JSON.stringify(items));

    // Volver a renderizar la lista para reflejar el cambio
    renderList();
}

function updatePaginationControls() {
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = '';

    const totalPages = Math.ceil(items.length / itemsPerPage);

    // Botón de página anterior
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.onclick = () => {
            currentPage--;
            renderList();
        };
        paginationControls.appendChild(prevButton);
    }

    // Botón de página siguiente
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.onclick = () => {
            currentPage++;
            renderList();
        };
        paginationControls.appendChild(nextButton);
    }
}

// Inicializar y renderizar la lista desde localStorage al cargar la página
renderList();
