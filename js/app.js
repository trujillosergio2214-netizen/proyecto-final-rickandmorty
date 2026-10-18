// ========================================== 
// 1. FIRMA DEL DESARROLLADOR Y VARIABLES GLOBALES 
// ========================================== 

// Escribe tu nombre y documento exactos. Esto personalizará la aplicación. 

const developerName = "TU_NOMBRE_COMPLETO";
const developerId = "TU_CODIGO_ESTUDIANTIL";
const baseUrl = "https://rickandmortyapi.com/api";

// Arreglo para guardar los favoritos (lo usaremos más adelante) 
let favoritesArray = [];

// ========================================== 
// 2. SELECCIÓN DE ELEMENTOS DEL DOM 
// ========================================== 

const dataContainer = document.getElementById('dataContainer');
const btnCharacters = document.getElementById('btnCharacters');
const btnLocations = document.getElementById('btnLocations');
const btnEpisodes = document.getElementById('btnEpisodes');
const btnFavorites = document.getElementById('btnFavorites');
const mainFooter = document.getElementById('mainFooter');

// ========================================== 
// 3. INYECCIÓN DINÁMICA DE LA FIRMA (FOOTER) 
// ========================================== 
// Modificamos el contenido del footer en tiempo real 
// ========================================== 

mainFooter.innerHTML = `<p>Developed with  by 
<strong>${developerName}</strong> (ID: ${developerId})</p>`;


// ========================================== 
// 4. FUNCIÓN PARA OBTENER DATOS (ASINCRONÍA)[cite: 7, 9] 
// ========================================== 
// Recibe el 'endpoint' para saber qué datos buscar (/character, 
// location, etc.) 
async function fetchData(endpoint) {
    try {
        // Mostramos un mensaje de carga mientras llegan los datos 
        dataContainer.innerHTML = '<p class="loading-text">Loading  multiverse data...</p>';

        // Hacemos la petición a la API 
        const response = await fetch(`${baseUrl}${endpoint}`);
        const data = await response.json();

        // La API de Rick and Morty guarda los items dentro de una 
        // propiedad llamada 'results' 
        return data.results;

    } catch (error) {
        console.error("Error:", error);
        dataContainer.innerHTML = '<p class="loading-text" style="color: red;">Connection error.</p>';
    }
}

// ========================================== 
// 5. FUNCIONES DE RENDERIZADO (DOM)[cite: 8, 9] 
// ========================================== 
// 
// Función para pintar personajes (Incluye botón de favoritos) 
function renderCharacters(charactersData) {
    dataContainer.innerHTML = ''; // Limpiamos la pantalla 

    charactersData.forEach(character => {
        // Determinamos el color del estado (Alive = verde, Dead = rojo) 
        const statusColor = character.status === 'Alive' ? 'lime' : (character.status === 'Dead' ? 'red' : 'gray');

        // Creamos la tarjeta (Card) 
        const cardHTML = ` <article class="data-card"> 
 <img src="${character.image}" alt="${character.name}"> 17 <div class="card-info"> 
 <h2>${character.name}</h2> 
 <p class="info-label">Status: <span style="color: ${statusColor}">${character.status}</span></p> 
 <p class="info-label">Species: ${character.species}</p> 
 
 <!-- Botón para guardar favorito. Le pasamos el nombre del personaje en una función onclick --> 
 <button class="btn-add-fav" onclick="addToFavorites('${character.name}', '${character.image}')"> 24 ⭐ Add to Favorites 
 </button> 
 </div> 
 </article>`;
        dataContainer.innerHTML += cardHTML;
    });
}

// Función para pintar ubicaciones (Locations) 
function renderLocations(locationsData) {
    dataContainer.innerHTML = '';
    locationsData.forEach(location => {
        dataContainer.innerHTML += `<article class="data-card"> 
 <div class="card-info"> 
 <h2>�� ${location.name}</h2> 
 <p class="info-label">Type: <span style="color: white;">${location.type}</span></p> 
 <p class="info-label">Dimension: 
${location.dimension}</p> 
 </div> 
 </article>`;
    });
}

// Función para pintar episodios 
function renderEpisodes(episodesData) {
    dataContainer.innerHTML = '';
    episodesData.forEach(episode => {
        dataContainer.innerHTML += ` 
 <article class="data-card"> 
 <div class="card-info"> 
 <h2> ${episode.name}</h2> 
 <p class="info-label">Code: <span style="color: lime;">${episode.episode}</span></p> 
 <p class="info-label">Air Date: 
${episode.air_date}</p> 
 </div> 
 </article> 
 `;
    });
}

// ========================================== 
// 6. LÓGICA DE FAVORITOS (LOCALSTORAGE) 
// ========================================== 

// Esta función se ejecuta cuando damos clic en el botón "Add to Favorites" de una tarjeta 
function addToFavorites(name, image) {
    // Creamos un objeto con los datos del personaje
    const newFavorite = { name: name, image: image };

    // Agregamos el objeto a nuestro arreglo de favoritos 
    favoritesArray.push(newFavorite);

    // Serializamos el arreglo a texto (JSON) y lo guardamos en la memoria del navegador 
    localStorage.setItem('myFavCharacters', JSON.stringify(favoritesArray));

    alert(`¡${name} agregado a favoritos!`);
}

// Función para leer la memoria y pintar los favoritos 
function renderFavorites() {
    dataContainer.innerHTML = '';

    // Leemos la memoria y la convertimos de texto a arreglo 
    const savedData = localStorage.getItem('myFavCharacters');

    if (savedData) {
        // Si hay datos, los deserializamos 
        favoritesArray = JSON.parse(savedData);

        if (favoritesArray.length === 0) {
            dataContainer.innerHTML = '<p class="loading-text">No favorites added yet.</p>';
            return;
        }

        // Pintamos cada favorito guardado 
        favoritesArray.forEach(fav => {
            dataContainer.innerHTML += `<article class="data-card"> 
 <img src="${fav.image}" alt="${fav.name}"> 
 <div class="card-info"> 
 <h2>⭐ ${fav.name}</h2> 
 </div> 
 </article>`;
        });
    } else {
        // Si la memoria está vacía 
        dataContainer.innerHTML = '<p class="loading-text">No favorites added yet.</p>';
    }
}

// ========================================== 
// 7. MANEJO DE EVENTOS DEL MENÚ 
// ========================================== 
// Función auxiliar para resaltar visualmente el botón seleccionado 
function setActiveButton(activeBtn) {
    btnCharacters.classList.remove('active');
    btnLocations.classList.remove('active');
    btnEpisodes.classList.remove('active');
    btnFavorites.classList.remove('active');

    activeBtn.classList.add('active');
}

// Evento: Clic en Personajes
btnCharacters.addEventListener('click', async () => {
    setActiveButton(btnCharacters);
    const data = await fetchData('/character');
    renderCharacters(data);
});

// Evento: Clic en Ubicaciones 
btnLocations.addEventListener('click', async () => {
    setActiveButton(btnLocations);
    const data = await fetchData('/location');
    renderLocations(data);
});
// Evento: Clic en Episodios 
btnEpisodes.addEventListener('click', async () => {
    setActiveButton(btnEpisodes);
    const data = await fetchData('/episode');
    renderEpisodes(data);
});
// Evento: Clic en Favoritos 
btnFavorites.addEventListener('click', () => {
    setActiveButton(btnFavorites);
    renderFavorites();
    // Esta no llama a fetchData, solo lee el LocalStorage 
});

// ========================================== 
// 8. INICIO AUTOMÁTICO 
// ========================================== 
// Recuperamos los favoritos al arrancar la página por si había algo guardado de antes 
const previousFavs = localStorage.getItem('myFavCharacters');
if (previousFavs) {
    favoritesArray = JSON.parse(previousFavs);
}

// Simulamos un clic en el botón de personajes para que la pantalla no inicie en blanco 
btnCharacters.click();

