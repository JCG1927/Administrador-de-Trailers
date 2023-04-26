
function cerrarSesion() {
    // Limpia la información de sesión almacenada en localStorage o sessionStorage
    localStorage.removeItem('usuario');
    sessionStorage.removeItem('usuario');

    // Redirige al usuario a la página de inicio de sesión
    window.location.href = 'login.html';
}
document.getElementById('btn-cerrar-sesion').addEventListener('click', cerrarSesion);