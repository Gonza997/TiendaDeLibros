let URLTope = "https://www.googleapis.com/books/v1/volumes?q=inteligencia+artificial&maxResults=35";
let URLlibros = "https://www.googleapis.com/books/v1/volumes?q=";
let URLPagos = "https://api.mocki.io/v1/b0435d6e";
let cantidadPorPagina = 15;

async function busquedaAvanzada(event) {
    event.preventDefault(); // Evitar que el formulario se envíe y la página se recargue

    const resultados = document.getElementById("resultadosDeBusqueda"); // Seleccionar el elemento para mostrar los resultados
    const busquedaDeNavbar = document.getElementById("busqueda").value; // Obtener el valor del campo de búsqueda
    const busqueda = busquedaDeNavbar.replace(/ /g, "+"); // Reemplazar los espacios en blanco por "+"
    const BusquedaImput = document.getElementById("BusquedaImput");
    console.log(busqueda); // Imprimir el término de búsqueda en la consola

    try {
        resultados.innerHTML = ""; // Limpiar el contenido anterior de resultados
        const tituloInput = document.createElement("h1"); // Crear un elemento <h1> para mostrar el título de la búsqueda
        const busquedaFinal = await obtenerLibros(busqueda); // Obtener los libros correspondientes al término de búsqueda
        BusquedaImput.textContent = busquedaDeNavbar; // Establecer el texto del título como el término de búsqueda
        mostrarLibros(busquedaFinal, resultados); // Mostrar los libros encontrados en la página
    } catch (error) {
        console.error("Error en la búsqueda avanzada: ", error); // Manejar cualquier error que ocurra durante la búsqueda
    }
}

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
        console.log(data);
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
        generos(data);
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
        const imgDiv = document.createElement("div");
        libroDiv.classList.add("libroDiv");
        imgDiv.classList.add("imgLibro");

        const titulo = document.createElement("h3");
        const autor = document.createElement("p");
        const precio = document.createElement("h5");
        const imagen = document.createElement("img");

        // Limitamos el título a 12 palabras
        const palabrasTitulo = libro.volumeInfo.title.split(" ");
        let tituloLimitado = palabrasTitulo.slice(0, 12).join(" ");
        if (palabrasTitulo.length > 12) {
            tituloLimitado += "...";
        }
        titulo.textContent = tituloLimitado;

        const autores = libro.volumeInfo.authors; // Obtener la información de autores
        let limiteAutores = ""; // Inicializar una cadena para los autores limitados

        // Verificar si la información de autores está definida y es un array con al menos un autor
        if (Array.isArray(autores) && autores.length > 0) {
            limiteAutores = autores.slice(0, 2).join(", "); // Obtener los primeros dos autores y unirlos en una cadena
        } else {
            limiteAutores = "Autor desconocido"; // Si no hay información de autores, establecer un valor predeterminado
        }

        autor.textContent = limiteAutores; // Asignar la cadena de autores al elemento autor

        // Agregamos un botón para comprar
        const botonCompra = document.createElement("button");
        botonCompra.textContent = "AGREGAR";
        botonCompra.classList.add("claseDeCompra","btn", "btn-outline-danger");
        botonCompra.classList.add("botonCompra"); // Agregar una clase para identificar los botones de compra
        // Agregar el atributo data-titulo con el título del libro
        botonCompra.dataset.titulo = libro.volumeInfo.title;
        // Agregar el atributo data-precio con el precio del libro
        botonCompra.dataset.precio = libro.saleInfo?.listPrice?.amount || "Precio no disponible";

        // Agregamos el icono del carrito al botón
        const iconoCarrito = document.createElement("img");
        iconoCarrito.src = "/img/carrito.png";
        iconoCarrito.alt = "Icono de carrito";
        iconoCarrito.classList.add("claseDeIcono");
        botonCompra.appendChild(iconoCarrito);

        if (libro.volumeInfo.imageLinks && libro.volumeInfo.imageLinks.thumbnail) {
            // verificar si el libro tiene imágenes
            imagen.src = libro.volumeInfo.imageLinks.thumbnail;
        } else {
            // El libro no tiene imágenes,
            imagen.src = "./img/vector.jpg";
        }

        if (libro.saleInfo?.saleability == "NOT_FOR_SALE" || !libro.saleInfo?.listPrice) {
            precio.textContent = "NO DISPONIBLE";
        } else {
            precio.textContent = libro.saleInfo.listPrice.amount + " " + libro.saleInfo.listPrice.currencyCode;
        }

        imgDiv.appendChild(imagen);
        libroDiv.appendChild(imgDiv);
        libroDiv.appendChild(titulo);
        libroDiv.appendChild(autor);
        libroDiv.appendChild(precio);
        libroDiv.appendChild(botonCompra);
        contenedorLibros.appendChild(libroDiv);

        // Agregar evento de clic al título del libro para abrir el modal
        titulo.addEventListener("click", () => {
            mostrarModal(libro);
        });

        // Agregar evento de clic al botón de compra
        botonCompra.addEventListener("click", event => {
            console.log("Click en el botón de carrito");
            const titulo = event.target.dataset.titulo;
            const precio = event.target.dataset.precio;

            const libroAgregado = {
                tituloLibro: titulo,
                precioLibro: precio
            };

            listaLibrosCarrito.push(libroAgregado);

            // Actualizar el modal del carrito
            actualizarModalCarrito();
        });
    });
}

function generos(data) {
    const dropdownMenu = document.getElementById("dropdown-menu");
    dropdownMenu.innerHTML = ""; // Limpiar el contenido anterior del menú desplegable

    const categoriasUnicas = {}; // Objeto para almacenar las categorías únicas

    for (let i = 0; i < data.items.length; i++) {
        const libro = data.items[i];
        const categoria = libro.volumeInfo.categories;

        // Verificar si la categoría no es undefined y no existe en el objeto categoriasUnicas
        if (categoria && !categoriasUnicas[categoria]) {
            categoriasUnicas[categoria] = true; // Agregar la categoría al objeto

            const newElementLi = document.createElement("li");
            newElementLi.classList.add("li-categorias");
            newElementLi.textContent = categoria;
            dropdownMenu.appendChild(newElementLi);
        }
    }
}

// Mostrar el modal con la información del libro
function mostrarModal(libro) {
    const modalContenido = {
        title: libro.volumeInfo.title, // Título del libro
        body: `            
            <p>Autor: ${libro.volumeInfo.authors ? libro.volumeInfo.authors.join(", ") : "Autor Desconocido"}</p>
            <p>Resumen: ${
                libro.volumeInfo.description ? libro.volumeInfo.description : "Sin Resumen Disponible"
            }</p>
            `
    };

    // Mostrar el modal
    abrirModal(modalContenido);
}

// Función para abrir el modal con contenido dinámico
function abrirModal(contenido) {
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");

    modalTitle.textContent = contenido.title; // Asignar el título del contenido al título del modal
    modalBody.innerHTML = contenido.body; // Asignar el cuerpo del contenido al cuerpo del modal

    const modal = new bootstrap.Modal(document.getElementById("myModal")); // Obtener el modal
    modal.show(); // Mostrar el modal
}

function actualizarModalCarrito() {
    const contenedorModalCarrito = document.getElementById("modalBodyCarrito");

    // Limpiar el contenido anterior del modal del carrito
    contenedorModalCarrito.innerHTML = "";

    listaLibrosCarrito.forEach(libro => {
        // Crear elementos para mostrar la información del libro en el modal
        const tituloLibroElemento = document.createElement("h4");
        tituloLibroElemento.textContent = libro.tituloLibro;

        const precioLibroElemento = document.createElement("p");
        precioLibroElemento.textContent = `Precio: ${libro.precioLibro}`;

        // Agregar los elementos al contenedor del modal del carrito
        contenedorModalCarrito.appendChild(tituloLibroElemento);
        contenedorModalCarrito.appendChild(precioLibroElemento);
    });
}
const carrito = document.querySelector(".carrito");
const botonCarrito = document.getElementById("botonCompra");
const listaLibrosCarrito = [];

carrito.addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('modalCarrito')); // Obtener el modal
    if (window.usuarioEncontrado) {
        const tituloModalCarrito = document.getElementById('modalTitleCarrito');
        tituloModalCarrito.textContent = `${window.nombreUsuario}`;
        console.log(window.nombreUsuario);
        console.log("1");
    }
    modal.show(); // Mostrar el modal
   
});
carrito.addEventListener('click', async () => {
      if (window.usuarioEncontrado) {
        const tituloModalCarrito = document.getElementById('modalTitleCarrito');
        tituloModalCarrito.textContent = `${window.nombreUsuario}`;
        console.log(window.nombreUsuario);
        console.log("1");

        // Simular el pago utilizando la API mock
        try {
            const response = await fetch(URLPagos, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(listaLibrosCarrito) // Enviar los libros agregados al carrito como datos de pago
            });
            const data = await response.json();
            console.log(data); // Aquí puedes manejar la respuesta de la API de pagos
            // Mostrar algún mensaje de confirmación al usuario
        } catch (error) {
            console.error("Error al procesar el pago:", error);
            // Mostrar algún mensaje de error al usuario
        }
    }
    modal.show(); // Mostrar el modal
});

// Iniciar la búsqueda al cargar la página
iniciarBusqueda();
