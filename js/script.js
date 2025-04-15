/***Obtener Chiste de Chuck Norris:** Al hacer clic en el botón "Obtener Chiste", 
 se realiza una solicitud a la API de Chuck Norris para obtener un chiste aleatorio. 
 El chiste se agrega a la lista y se guarda en el almacenamiento local `localStorage`.*/
 /***Cargar Chistes Almacenados:** Al cargar la página, se recuperan los chistes almacenados en el almacenamiento local y se muestran en la lista.*/

const fetchJoke = document.getElementById('fetchJoke');
const jokeList = document.getElementById('jokeList');


  
fetchJoke.addEventListener('click', () => {  
   

fetch ('https://api.chucknorris.io/jokes/random')


.then((response) => {
    if(!response.ok) {
        throw new Error('La solicitud es invalida');
    }
    return response.json();
})

.then((data) => {
    const result = data.value;
    renderJoke(result);
    //console.log(obtenerChiste);
})
.catch((error) => {
  console.error('Error', error);
})


}); 

function template(value) {
    return `<li><p>${value}</p><button>Eliminar</button></li>`;

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
}

jokeList.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') {
        const li = e.target.parentElement;
        const texto = li.querySelector('p').textContent;

        // Eliminar el chiste del localStorage
        let chistes = obtenerChiste();
        chistes = chistes.filter(chiste => chiste !== texto);
        guardarChiste(chistes);

        // Eliminar del DOM
        li.remove();
    }
});
window.addEventListener('DOMContentLoaded', () => {
    const chistesGuardados = obtenerChiste();
    chistesGuardados.forEach(chiste => {
        jokeList.innerHTML += template(chiste);
    });
});



