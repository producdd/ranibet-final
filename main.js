// Esta función es la que Google llama automáticamente al loguearse
function handleCredentialResponse(response) {
    // Decodificamos el "Token" que nos manda Google
    const data = parseJwt(response.credential);

    // Creamos el perfil del usuario con su foto y nombre real de Google
    user = {
        id: data.sub,
        name: data.given_name || data.name.split(' ')[0],
        photo: data.picture,
        balance: 50.00, // Bono inicial
        codigosUsados: []
    };

    // Guardamos en la memoria del navegador para que no se borre al refrescar
    localStorage.setItem('rani_user', JSON.stringify(user));

    // Cambiamos la interfaz
    mostrarApp();
}

function mostrarApp() {
    document.getElementById('google-login-btn').classList.add('hidden');
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('user-name').textContent = `Hola, ${user.name}`;
    document.getElementById('user-photo').src = user.photo;
    actualizarUI();
}

// Función mágica para leer los datos de Google
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
}