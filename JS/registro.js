document.getElementById('registro-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombreUsuario = document.getElementById('nombreUsuario').value;
    const email = document.getElementById('email').value;
    const contraseña = document.getElementById('contraseña').value;

    const response = await fetch('https://localhost:7093/api/Usuarios/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombreUsuario, email, contraseña }),
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('usuario', JSON.stringify(data));
        localStorage.setItem('usuarioId', data.UsuarioId); // Guardar el usuarioId en el localStorage
        alert('Usuario registrado exitosamente');
        window.location.href = 'login.html'; // Redirigir a la página de inicio de sesión después de un registro exitoso
    } else {
        alert('Error al registrar el usuario');
    }
});
