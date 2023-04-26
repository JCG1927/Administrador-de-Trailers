const usuarioJSONPeliculas = localStorage.getItem('usuario');
const usuarioObjPeliculas = JSON.parse(usuarioJSONPeliculas);
const usuarioIdPeliculas = usuarioObjPeliculas.usuarioId;
const apiUrl2 = `https://localhost:7093/api/Peliculas/${usuarioIdPeliculas}`;
// const apiUrl3 = "https://localhost:7093/api/";
// const usuario = JSON.parse(localStorage.getItem('usuario'));
let generoSeleccionado = null;
// Obtener los géneros desde la API
async function obtenerGeneros() {
    try {
        const response = await fetch(`https://localhost:7093/api/Generos/${usuarioIdPeliculas}`);
        const generos = await response.json();
        return generos;
    } catch (error) {
        console.error("Error al obtener los géneros:", error);
        return [];
    }
}
async function mostrarGeneros() {
    const generos = await obtenerGeneros();
    console.log("Géneros obtenidos:", generos); // Verificar los géneros obtenidos

    const selectGenero = document.getElementById('genero');

    // Agregar una opción vacía al inicio del select
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = 'Selecciona un género';
    selectGenero.appendChild(emptyOption);

    generos.forEach(genero => {
        const option = document.createElement('option');
        option.value = genero.id;
        option.textContent = genero.nombreGenero;
        selectGenero.appendChild(option);
        console.log("Género agregado:", genero.nombreGenero); // Verificar que se agregue el género al select
    });
    selectGenero.addEventListener('change', (event) => {
        generoSeleccionado = event.target.value;
        console.log('Género seleccionado:', generoSeleccionado);
    });
}

// Obtener las películas desde la API
async function obtenerPeliculas() {
    try {
        const response = await fetch(`${apiUrl2}`);
        const peliculas = await response.json();
        return peliculas;
    } catch (error) {
        console.error("Error al obtener las películas:", error);
        return [];
    }
}

async function buscarPeliculas() {
    const busqueda = document.getElementById('busqueda').value;
    if (busqueda.trim() === '') {
        await mostrarPeliculas();
        return;
    }

    const peliculas = await obtenerPeliculas();

    const peliculasFiltradas = peliculas.filter(pelicula =>
        pelicula.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        pelicula.director.toLowerCase().includes(busqueda.toLowerCase()) ||
        pelicula.genero.nombre_genero.toLowerCase().includes(busqueda.toLowerCase()) ||
        pelicula.año.toString().includes(busqueda)
    );

    mostrarPeliculas(peliculasFiltradas);
}

document.getElementById('filtro').addEventListener('input', buscarPeliculas);


// Función para agregar una película
async function agregarPelicula(pelicula) {
    try {
        const response = await fetch(`https://localhost:7093/api/Peliculas/${usuarioIdPeliculas}/${generoSeleccionado}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pelicula)
        });

        if (response.ok) { 
            const nuevaPelicula = await response.json();
            return nuevaPelicula;
        } else {
            console.error("Error al agregar la película");
            return null;
        }
    } catch (error) {
        console.error("Error al agregar la película:", error);
        return null;
    }
}


// Función para editar una película
async function editarPelicula(peliculaId, pelicula) {
    try {
        const response = await fetch(`${apiUrl2}/${peliculaId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pelicula)
        });

        if (response.ok) {
            console.log("Película actualizada correctamente");
        } else {
            console.error("Error al actualizar la película");
        }
    } catch (error) {
        console.error("Error al actualizar la película:", error);
    }
}

 


// Función para aplicar filtros de búsqueda
function aplicarFiltro(peliculas, filtro) {
    return peliculas.filter(pelicula => {
        const { titulo, año, director, genero } = pelicula;
        const terminosFiltro = filtro.toLowerCase().split(" ");
        const textoPelicula = `${titulo} ${año} ${director} ${genero}`.toLowerCase();

        return terminosFiltro.every(termino => textoPelicula.includes(termino));
    });
}

// Aquí se deben implementar los eventos y llamadas a las funciones para interactuar con la vista
// Función para mostrar géneros en el select



// Función para mostrar las películas
async function mostrarPeliculas(filtro = "") {
    const peliculas = await obtenerPeliculas();
    const listaPeliculas = document.getElementById('lista-peliculas');
    listaPeliculas.innerHTML = '';

    const peliculasFiltradas = filtro ? aplicarFiltro(peliculas, filtro) : peliculas;

    peliculasFiltradas.forEach(pelicula => {
        const { id, titulo, año, director, genero, poster } = pelicula;

        const peliculaCard = document.createElement('div');
        peliculaCard.classList.add('card', 'col-12', 'col-md-4', 'mt-3');

        peliculaCard.innerHTML = `
            <img src="${poster}" class="card-img-top" alt="${titulo}">
            <div class="card-body">
                <h5 class="card-title">${titulo}</h5>
                <p class="card-text">
                    Año: ${año}<br>
                    Director: ${director}<br>
                    Género: ${genero}
                </p>
                <button class="btn btn-primary editar" data-id="${id}">Editar</button>
                <button class="btn btn-danger eliminar" data-id="${id}">Eliminar</button>
            </div>
        `;

        listaPeliculas.appendChild(peliculaCard);
    });

    // Agrega eventos a los botones de editar y eliminar
    agregarEventosEditarEliminar();
}

// Función para eliminar una película
async function eliminarPelicula(peliculaId) {
    try {
        const response = await fetch(`${apiUrl2}/${peliculaId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            console.log("Película eliminada correctamente");
        } else {
            console.error("Error al eliminar la película");
        }
    } catch (error) {
        console.error("Error al eliminar la película:", error);
    }
}
function mostrarFormularioEdicion(pelicula) {
    const form = document.createElement('div');
    form.id = 'formulario-edicion';
    form.classList.add('editar-form');
    form.innerHTML = `
        <div class="container mt-5">

            <h2>Editar película</h2>
            <form id="editar-pelicula-form" class="row">
                <label for="editar-titulo">Título:</label>
                <input type="text" class="form-control" id="editar-titulo" value="${pelicula.titulo}">
                
                <label for="editar-año">Año:</label>
                <input type="number" class="form-control" id="editar-año" value="${pelicula.año}">
                
                <label for="editar-director">Director:</label>
                <input type="text" class="form-control" id="editar-director" value="${pelicula.director}">
                
                <label for="editar-genero">Género:</label>
                <select  id="editar-genero" class="form-select"></select>
                
                <label for="editar-poster">Poster URL:</label>
                <input type="text" id="editar-poster" class="form-control" value="${pelicula.poster}">
                <div class="col-12 mt-3">
                    <button type="submit" id="guardar-cambios" class="btn btn-primary">Guardar cambios</button>
                    <button type="button" id="cancelar-edicion" class="btn btn-danger">Cancelar</button>
                </div>
            </form>
        </div>
        <br>
    `;

    document.body.appendChild(form); // Mover esta línea antes de acceder al elemento del formulario

    const selectGenero = form.querySelector('#editar-genero');

    obtenerGeneros().then(generos => {
        generos.forEach(genero => {
            const option = document.createElement('option');
            option.value = genero.id;
            option.textContent = genero.nombreGenero;
            if (genero.id == pelicula.generoId) {
                option.selected = true;
            }
            selectGenero.appendChild(option);
        });
    });

    form.querySelector('#cancelar-edicion').addEventListener('click', cerrarFormularioEdicion);
    form.querySelector('#editar-pelicula-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const peliculaId = pelicula.id;
        const titulo = document.getElementById('editar-titulo').value;
        const año = document.getElementById('editar-año').value;
        const director = document.getElementById('editar-director').value;
        const generoId = document.getElementById('editar-genero').value;
        const poster = document.getElementById('editar-poster').value;
        const peliculaActualizada = {
            id: parseInt(peliculaId),
            titulo,
            año: parseInt(año),
            director,
            generoId: parseInt(generoId),
            poster
        };
    
        await editarPelicula(peliculaId, peliculaActualizada);
        await mostrarPeliculas();
        cerrarFormularioEdicion();
    });
}
function cerrarFormularioEdicion() {
    const form = document.getElementById('formulario-edicion');
    if (form) {
        form.remove();
    }
}
// Evento para agregar una película
document.getElementById('pelicula-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const año = document.getElementById('año').value;
    const director = document.getElementById('director').value;
    const genero = document.querySelector('#genero option:checked').textContent;
    const poster = document.getElementById('poster').value;

    const pelicula = {
        titulo,
        año,
        director,
        genero,
        poster
    };

    const nuevaPelicula = await agregarPelicula(pelicula);

    if (nuevaPelicula) {
        mostrarPeliculas();
        document.getElementById('pelicula-form').reset();
    }
});

// Evento para aplicar filtro de búsqueda
document.getElementById('filtro').addEventListener('input', (event) => {
    const filtro = event.target.value;
    mostrarPeliculas(filtro);
});

// Función para agregar eventos a botones de editar y eliminar
function agregarEventosEditarEliminar() {
    const botonesEditar = document.querySelectorAll('.editar');
    const botonesEliminar = document.querySelectorAll('.eliminar');

    botonesEditar.forEach(boton => {
        boton.addEventListener('click', async () => {
            const peliculaId = boton.dataset.id;
            // Obtener la película por ID
            const peliculas = await obtenerPeliculas();
            const pelicula = peliculas.find(p => p.id == peliculaId);
            mostrarFormularioEdicion(pelicula);
        });
    });

    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', () => {
            const peliculaId = boton.dataset.id;
            eliminarPelicula(peliculaId);
            mostrarPeliculas();
        });
    });
}
document.addEventListener('submit', async (event) => {
    if (event.target.matches('#editar-form')) {
        event.preventDefault();

        const peliculaId = document.querySelector('.editar[data-id]').dataset.id;
        const titulo = document.getElementById('editar-titulo').value;
        const año = document.getElementById('editar-año').value;
        const director = document.getElementById('editar-director').value;
        const generoId = document.getElementById('editar-genero').value;
        const poster = document.getElementById('editar-poster').value;

        const peliculaActualizada = {
            id: parseInt(peliculaId),
            titulo,
            año: parseInt(año),
            director,
            generoId: parseInt(generoId),
            poster
        };

        await editarPelicula(peliculaId, peliculaActualizada);
        await mostrarPeliculas();
        cerrarFormularioEdicion();
    }
});

// Inicializar la
async function init() {
    await mostrarGeneros();
    await mostrarPeliculas();
    const observer = new MutationObserver(agregarEventosEditarEliminar);
    const listaPeliculas = document.getElementById('lista-peliculas');
    observer.observe(listaPeliculas, { childList: true });
}

init();