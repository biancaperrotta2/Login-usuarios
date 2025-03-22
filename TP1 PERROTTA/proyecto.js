document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("formularioLogin")) {
        document.getElementById("formularioLogin").addEventListener("submit", function(event) {
            event.preventDefault();
            iniciarLogin();
        });
    } else if (document.querySelector(".grilla")) {
        configurarBotonLista();
        configurarBuscador();
    }
});

function iniciarLogin() {
    let usuario = document.getElementById("usuario").value;
    let contraseña = document.getElementById("clave").value;

    let url = `http://181.111.166.250:8081/tp/login.php?user=${usuario}&pass=${contraseña}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.respuesta === "ERROR") {
                alert(data.mje);
            } else if (data.respuesta === "OK") {
                window.location.href = "lista.html";
            }
        })
        .catch(error => console.error("ERROR:", error));
}

function configurarBotonLista() {
    let listaTabla = document.querySelector(".grilla");
    let botonMostrar = document.getElementById("botonLista");

    listaTabla.style.display = "none"; // Ocultar la tabla al inicio

    botonMostrar.addEventListener("click", function() {
        listaTabla.style.display = listaTabla.style.display === "none" ? "block" : "none";
        botonMostrar.textContent = listaTabla.style.display === "none" ? "Mostrar lista de usuarios" : "Ocultar lista de usuarios";
        cargarListaUsuarios();  // Cargar la lista cada vez que se muestre
    });
}

function configurarBuscador() {
    let formBuscar = document.getElementById("formBuscarUsuario");
    formBuscar.addEventListener("submit", function(event) {
        event.preventDefault();
        cargarListaUsuarios(true);  // Filtrar los usuarios cuando se realiza la búsqueda
    });
}

function cargarListaUsuarios(filtrar = false) {
    let usuarioBuscado = document.getElementById("usuario-buscado").value;
    let urlLista = `http://181.111.166.250:8081/tp/lista.php?action=BUSCAR${filtrar && usuarioBuscado ? `&usuario=${usuarioBuscado}` : ''}`;

    fetch(urlLista)
        .then(response => response.json())
        .then(data => {
            console.log("Usuarios obtenidos:", data);

            let tabla = document.querySelector(".grilla table");
            tabla.innerHTML = `
                <tr>
                    <th>Id</th>
                    <th>Usuario</th>
                    <th>Bloqueado</th>
                    <th>Apellido</th>
                    <th>Nombre</th>
                    <th>Bloquear</th>
                    <th>Desbloquear</th>
                </tr>`;

            if (data.length === 0) {
                alert("No se encontraron usuarios.");
                return;
            }

            data.forEach(usuario => {
                let fila = document.createElement("tr");
                fila.style.backgroundColor = usuario.bloqueado === "Y" ? "#fd9f8b" : "#cef8c6";
                fila.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.usuario}</td>
                    <td>${usuario.bloqueado}</td>
                    <td>${usuario.apellido}</td>
                    <td>${usuario.nombre}</td>
                    <td><button onclick="modificarEstado(${usuario.id}, 'Y')">Bloquear</button></td>
                    <td><button onclick="modificarEstado(${usuario.id}, 'N')">Desbloquear</button></td>
                `;
                tabla.appendChild(fila);
            });
        })
        .catch(error => console.error("ERROR:", error));
}

function modificarEstado(id, estado) {
    let url = `http://181.111.166.250:8081/tp/lista.php?action=BLOQUEAR&idUser=${id}&estado=${estado}`;

    fetch(url)
        .then(response => response.json())
        .then(() => {
            cargarListaUsuarios();  // Recargar la lista después de bloquear/desbloquear
        })
        .catch(error => console.error("ERROR:", error));
}


