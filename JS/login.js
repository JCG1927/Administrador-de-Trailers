document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombreUsuario = document.getElementById('nombreUsuario').value;
    const contraseña = document.getElementById('contraseña').value;

    const response = await fetch('https://localhost:7093/api/Usuarios/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombreUsuario, contraseña }),
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('usuario', JSON.stringify(data));
        localStorage.setItem('usuarioId', data.UsuarioId); // Guardar el usuarioId en el localStorage
        window.location.href = 'index.html';
    } else {
        alert('Error al iniciar sesión');
    }
});




