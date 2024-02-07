let URLTope = "https://www.googleapis.com/books/v1/volumes?q=inteligencia+artificial&maxResults=35";
let URLlibros = "https://www.googleapis.com/books/v1/volumes?q=";
let URLPagos = "https://api.mocki.io/v1/b0435d6e";
let cantidadPorPagina = 15;

async function iniciarBusqueda() {
    try {
        // Obtener la palabra aleatoria
        const busqueda = await palabraAleatoria();
        // Utilizar la palabra aleatoria en la búsqueda de libros
        const libros = await obtenerLibros(busqueda);
        // Mostrar los libros
        mostrarLibros(libros, document.getElementById("libros"));
    } catch (error) {
        console.error("Error al iniciar la búsqueda:", error);
    }
}

// Función para obtener una palabra aleatoria
async function palabraAleatoria() {
    try {
        const response = await fetch("https://clientes.api.greenborn.com.ar/public-random-word");
        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error("Error al obtener la palabra aleatoria:", error);
        throw error; // Reenviar el error para que sea manejado por la función que llama a palabraAleatoria
    }
}

// Función para obtener los libros
async function obtenerLibros(busqueda) {
    try {
        const response = await fetch(`${URLlibros}${busqueda}&maxResults=${cantidadPorPagina}&langRestrict=es`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener los libros:", error);
        throw error; // Reenviar el error para que sea manejado por la función que llama a obtenerLibros
    }
}

// Función para mostrar los libros
function mostrarLibros(data, contenedorLibros) {
    data.items.forEach(libro => {
        const libroDiv = document.createElement("div");
        libroDiv.classList.add("libroDiv");

        const titulo = document.createElement("h3");
        const autor = document.createElement("p");
        const precio = document.createElement("h5");
        const imagen = document.createElement("img");

        titulo.textContent = libro.volumeInfo.title;
        autor.textContent = libro.volumeInfo.authors;

        if (libro.saleInfo.saleability == "NOT_FOR_SALE" || !libro.saleInfo.listPrice) {
            precio.textContent = "NO DISPONIBLE";
        } else {
            precio.textContent = libro.saleInfo.listPrice.amount + " " + libro.saleInfo.listPrice.currencyCode;
        }
        

        imagen.src = libro.volumeInfo.imageLinks.thumbnail;

        libroDiv.appendChild(imagen);
        libroDiv.appendChild(titulo);
        libroDiv.appendChild(autor);
        libroDiv.appendChild(precio);
        contenedorLibros.appendChild(libroDiv);
    });
}

// Iniciar la búsqueda al cargar la página
iniciarBusqueda();
