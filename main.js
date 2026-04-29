const PARTIDOS = [
    { id: 1, local: "Universitario", visita: "Alianza Lima", cL: 2.15, cX: 3.25, cV: 3.40, hora: "Hoy 20:00" },
    { id: 2, local: "Sporting Cristal", visita: "Cusco FC", cL: 1.40, cX: 4.80, cV: 7.50, hora: "Mañana 15:30" },
    { id: 3, local: "Melgar", visita: "Cienciano", cL: 1.85, cX: 3.40, cV: 4.10, hora: "Viernes 19:00" }
];

const CODIGOS_VALIDOS = { "RANA50": 50, "FABIAN20": 20 };
let user = JSON.parse(localStorage.getItem('rani_user')) || null;

document.addEventListener('DOMContentLoaded', () => {
    if (user) mostrarApp();
    cargarFixture();
});

function handleCredentialResponse(response) {
    const data = parseJwt(response.credential);
    user = {
        id: data.sub,
        name: data.given_name || data.name.split(' ')[0],
        photo: data.picture,
        balance: 50.00,
        codigosUsados: []
    };
    localStorage.setItem('rani_user', JSON.stringify(user));
    mostrarApp();
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
}

function mostrarApp() {
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('user-name').textContent = `Hola, ${user.name}`;
    document.getElementById('user-photo').src = user.photo;
    actualizarUI();
}

function cargarFixture() {
    const container = document.getElementById('fixture-container');
    container.innerHTML = "";
    PARTIDOS.forEach(p => {
        container.innerHTML += `
            <div class="bet-card p-5 flex flex-col md:flex-row items-center gap-6 border border-gray-100 hover:shadow-lg transition">
                <div class="flex-1 w-full border-r border-gray-100">
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${p.hora}</span>
                    <div class="mt-2 space-y-1">
                        <div class="flex justify-between md:justify-start gap-4">
                            <span class="font-bold text-gray-800 text-lg">${p.local}</span>
                        </div>
                        <div class="flex justify-between md:justify-start gap-4">
                            <span class="font-bold text-gray-800 text-lg">${p.visita}</span>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-3 w-full md:w-auto">
                    <button class="odds-button p-3 min-w-[85px] flex flex-col items-center">
                        <span class="text-[10px] text-gray-400 font-bold uppercase">Local</span>
                        <span class="text-md font-extrabold text-green-600">${p.cL.toFixed(2)}</span>
                    </button>
                    <button class="odds-button p-3 min-w-[85px] flex flex-col items-center">
                        <span class="text-[10px] text-gray-400 font-bold uppercase">Empate</span>
                        <span class="text-md font-extrabold text-green-600">${p.cX.toFixed(2)}</span>
                    </button>
                    <button class="odds-button p-3 min-w-[85px] flex flex-col items-center">
                        <span class="text-[10px] text-gray-400 font-bold uppercase">Visita</span>
                        <span class="text-md font-extrabold text-green-600">${p.cV.toFixed(2)}</span>
                    </button>
                </div>
            </div>
        `;
    });
}

function canjearCodigo() {
    const codeInput = document.getElementById('code-input');
    const code = codeInput.value.toUpperCase().trim();
    if (!user) return alert("Inicia sesión primero");
    if (user.codigosUsados.includes(code)) return alert("Este código ya lo utilizaste");
    if (CODIGOS_VALIDOS[code]) {
        user.balance += CODIGOS_VALIDOS[code];
        user.codigosUsados.push(code);
        localStorage.setItem('rani_user', JSON.stringify(user));
        actualizarUI();
        alert("¡BONO ACTIVADO! Tus Rani Coins han sido cargadas. 🐸💰");
        codeInput.value = '';
    } else {
        alert("Código no válido");
    }
}

function actualizarUI() {
    document.getElementById('balance-val').textContent = user.balance.toFixed(2);
}