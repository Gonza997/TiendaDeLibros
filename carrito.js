const carrito = document.querySelector(".carrito");
const botonCarrito = document.querySelector(".claseDeCompra");
const listaLibrosCarrito = [];

carrito.addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.querySelector('modal-dialog modal-dialog-centered modal-dialog-scrollable')); // Obtener el modal
    modal.show(); // Mostrar el modal
}); 

botonCarrito.addEventListener('click', (event) => {
    const titulo = event.target.dataset.titulo;
    const precio = event.target.dataset.precio;

    const libroAgregado = {
        tituloLibro: titulo,
        precioLibro: precio
    };

    listaLibrosCarrito.push(libroAgregado);
    
    actualizarModalCarrito(); // Llamar a la función para actualizar el modal del carrito
}); 

function actualizarModalCarrito(){
    const contenedorModalCarrito = document.getElementById("modalCarrito"); 

    // Limpiar el contenido anterior del modal del carrito
    contenedorModalCarrito.innerHTML = "";

    listaLibrosCarrito.forEach(libro => {
        // Crear elementos para mostrar la información del libro en el modal
        const tituloLibroElemento = document.createElement('h4');
        tituloLibroElemento.textContent = libro.tituloLibro;

        const precioLibroElemento = document.createElement('p');
        precioLibroElemento.textContent = `Precio: ${libro.precioLibro}`;

        // Agregar los elementos al contenedor del modal del carrito
        contenedorModalCarrito.appendChild(tituloLibroElemento);
        contenedorModalCarrito.appendChild(precioLibroElemento);
    });
}
