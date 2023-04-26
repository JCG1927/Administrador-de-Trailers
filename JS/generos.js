const usuarioJSON = localStorage.getItem('usuario');
const usuarioObj = JSON.parse(usuarioJSON);
const usuarioId = usuarioObj.usuarioId;
const apiUrl = `https://localhost:7093/api/Generos/${usuarioId}`;

async function fetchGeneros() {
  const response = await fetch(apiUrl);
  const generos = await response.json();
  displayGeneros(generos);
}

function promptEditGenero(currentName) {
  return new Promise((resolve) => {
    const newName = prompt('Ingrese el nuevo nombre del género:', currentName);
    resolve(newName);
  });
}

async function editGenero(id, currentName) {
  const newName = await promptEditGenero(currentName);
  if (newName && newName !== currentName) {
    await updateGenero(id, newName);
    fetchGeneros();
 // Actualiza la lista de géneros después de editar uno
  }
}

function displayGeneros(generos) {
  const generosList = document.getElementById('generos-list');
  generosList.innerHTML = '';

  generos.forEach((genero) => {
    const generoElement = document.createElement('div');
    generoElement.innerHTML = `
    <div class="list-group">
        <div class="list-group-item d-flex justify-content-between align-items-center">
            <span >${genero.nombreGenero}</span>
            <div>
                <button data-id="${genero.id}" class="btn btn-sm btn-primary btn-edit">Editar</button>
                <button data-id="${genero.id}" class="btn btn-sm btn-danger btn-delete">Eliminar</button>
            </div>
        </div>
    </div>
    `;

    generoElement.querySelector('.btn-edit').addEventListener('click', () => {
      editGenero(genero.id, genero.nombreGenero);
    });

    generoElement.querySelector('.btn-delete').addEventListener('click', async () => {
      await deleteGenero(genero.id);
      fetchGeneros(); // Actualiza la lista de géneros después de eliminar uno
    });

    generosList.appendChild(generoElement);
  });
}

async function addGenero(nombreGenero) {
  const newGenero = { NombreGenero: nombreGenero };
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newGenero)
  });

  return await response.json();
}

async function updateGenero(id, nombreGenero) {
    const updatedGenero = { NombreGenero: nombreGenero };
    await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedGenero)
    });
  
    // Actualiza el género en localStorage
    const usuarioJSON = localStorage.getItem('usuario');
    const usuarioObj = JSON.parse(usuarioJSON);
    const genero = usuarioObj.generos.find(g => g.id === id);
    genero.nombreGenero = nombreGenero;
    localStorage.setItem('usuario', JSON.stringify(usuarioObj));
}

async function deleteGenero(id) {
  await fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  });
  
}

window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('genero-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const nombreGenero = document.getElementById('nombreGenero').value;
      await addGenero(nombreGenero);
      fetchGeneros(); // Actualiza la lista de géneros después de agregar uno nuevo
    });
  
    fetchGeneros(); // Carga la lista de géneros al cargar la página
});// Carga la lista de géneros al cargar la página
