/***Obtener Chiste de Chuck Norris:** Al hacer clic en el botón "Obtener Chiste", 
 se realiza una solicitud a la API de Chuck Norris para obtener un chiste aleatorio. 
 El chiste se agrega a la lista y se guarda en el almacenamiento local `localStorage`.*/
 /***Cargar Chistes Almacenados:** Al cargar la página, se recuperan los chistes almacenados en el almacenamiento local y se muestran en la lista.*/

const fetchJoke = document.getElementById('fetchJoke');
const jokeList = document.getElementById('jokeList');
const loadingSpinner = document.getElementById('loadingSpinner');
const emptyState = document.getElementById('emptyState');

// Función para mostrar/ocultar el estado vacío
function toggleEmptyState() {
    const jokes = obtenerChiste();
    if (jokes.length === 0) {
        emptyState.style.display = 'flex';
        jokeList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        jokeList.style.display = 'flex';
    }
}

// Función para mostrar/ocultar el loading
function toggleLoading(show) {
    if (show) {
        loadingSpinner.classList.add('show');
        fetchJoke.disabled = true;
        fetchJoke.style.opacity = '0.6';
    } else {
        loadingSpinner.classList.remove('show');
        fetchJoke.disabled = false;
        fetchJoke.style.opacity = '1';
    }
}

// Función para mostrar notificación
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        background: ${type === 'success' ? 'linear-gradient(135deg, #28a745, #20c997)' : 'linear-gradient(135deg, #dc3545, #c82333)'};
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Agregar estilos de animación para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

fetchJoke.addEventListener('click', async () => {  
    toggleLoading(true);
    
    try {
        const response = await fetch('https://api.chucknorris.io/jokes/random');
        
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        
        const data = await response.json();
        const result = data.value;
        
        renderJoke(result);
        showNotification('¡Chiste obtenido con éxito! 😄', 'success');
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al obtener el chiste. Inténtalo de nuevo.', 'error');
    } finally {
        toggleLoading(false);
    }
}); 

function template(value) {
    return `<li><p>${value}</p><button><i class="fas fa-trash"></i> Eliminar</button></li>`;
}

function obtenerChiste() {
    return JSON.parse(localStorage.getItem('chistes')) || [];
}

function guardarChiste(chistes) {
    localStorage.setItem('chistes', JSON.stringify(chistes));
}

function renderJoke(chiste) {
    jokeList.innerHTML += template(chiste);
    let chistes = obtenerChiste();
    chistes.push(chiste);
    guardarChiste(chistes);
    toggleEmptyState();
}

jokeList.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
        const li = button.parentElement;
        const texto = li.querySelector('p').textContent;

        // Animación de eliminación
        li.style.animation = 'slideOutLeft 0.3s ease-in';
        
        setTimeout(() => {
            // Eliminar el chiste del localStorage
            let chistes = obtenerChiste();
            chistes = chistes.filter(chiste => chiste !== texto);
            guardarChiste(chistes);

            // Eliminar del DOM
            li.remove();
            toggleEmptyState();
            showNotification('Chiste eliminado', 'success');
        }, 300);
    }
});

// Agregar animación de eliminación
const deleteStyle = document.createElement('style');
deleteStyle.textContent = `
    @keyframes slideOutLeft {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(-100%); opacity: 0; }
    }
`;
document.head.appendChild(deleteStyle);

window.addEventListener('DOMContentLoaded', () => {
    const chistesGuardados = obtenerChiste();
    
    if (chistesGuardados.length > 0) {
        chistesGuardados.forEach((chiste, index) => {
            // Agregar delay para animación escalonada
            setTimeout(() => {
                jokeList.innerHTML += template(chiste);
            }, index * 100);
        });
    }
    
    toggleEmptyState();
});



