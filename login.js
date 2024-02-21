document.addEventListener("DOMContentLoaded", function () {
  const inicioSesion = document.getElementById("sesion");
  inicioSesion.addEventListener("click", ventanaLogin);
});

function ventanaLogin() {
  // Creamos la tarjeta flotante con sus elementos
  const tarjetaContainer = document.createElement("div");
  tarjetaContainer.classList.add("tarjeta-container");

  const tarjetaSubConteiner = document.createElement("div");
  tarjetaSubConteiner.classList.add("tarjeta-sub-container");

  // Elementos internos de la tarjeta
  const nombreLabel = document.createElement("label");
  nombreLabel.textContent = "Nombre de usuario: ";
  const nombreInput = document.createElement("input");
  nombreInput.setAttribute("type", "text");

  const contrasenaLebel = document.createElement("label");
  contrasenaLebel.textContent = "Contrasena: ";
  const contrasenaInput = document.createElement("input");
  contrasenaInput.setAttribute("type", "password");

  const botonSeguir = document.createElement("button");
  botonSeguir.textContent = "Aceptar";

  // Evento al hacer clic en el botón "Aceptar"
  botonSeguir.addEventListener("click", function () {
    const nombreUsuario = nombreInput.value;
    const contrasena = contrasenaInput.value;

    // Buscar el usuario en la lista de usuarios
    const usuarioEncontrado = usuarios.find(indice => indice.usuario === nombreUsuario && indice.contrasenia === contrasena);


    if (usuarioEncontrado) {
      // Si se encuentra el usuario, mostrar un mensaje de éxito y seguir con la aplicación
      alert("¡Bienvenido!");
      cerrarVentanaLogin();
      saludoUsuario(nombreUsuario);


    } else {
      // Si no se encuentra el usuario, mostrar un mensaje de error
      alert("Error: Nombre de usuario o contraseña incorrectos");
      cerrarVentanaLogin();
    }

    
  });
  // Agregamos elementos en la tarjeta
  tarjetaSubConteiner.appendChild(nombreLabel);
  tarjetaSubConteiner.appendChild(nombreInput);
  tarjetaSubConteiner.appendChild(contrasenaLebel);
  tarjetaSubConteiner.appendChild(contrasenaInput);
  tarjetaSubConteiner.appendChild(botonSeguir);

  tarjetaContainer.appendChild(tarjetaSubConteiner);

  // Agregamos la tarjeta al html
  document.body.appendChild(tarjetaContainer);
}

function cerrarVentanaLogin() {
  const tarjetaContainer = document.querySelector(".tarjeta-container");
  tarjetaContainer.remove();
}

const usuarios = [
  {
    usuario: "Gonzalo",
    contrasenia: "contraseña1",
    productosComprados: ["producto1", "producto2"],
  },
  {
    usuario: "Nelson",
    contrasenia: "contraseña1",
    productosComprados: ["producto1", "producto2"],
  },
  {
    usuario: "Franco",
    contrasenia: "contraseña1",
    productosComprados: ["producto1", "producto2"],
  },
  {
    usuario: "asd",
    contrasenia: "asd",
    productosComprados: ["producto1", "producto2"],
  }
];

function saludoUsuario(nombre) {
  let saludo = document.getElementById("ingreso");
  saludo.innerHTML = " ";
  saludo.textContent = `Hola ${nombre}`; 
}
