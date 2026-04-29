const PARTIDOS = [
    // PARTIDOS EN VIVO
    { id: 101, local: "ADT", visita: "Sport Huancayo", cL: 1.80, cX: 3.10, cV: 4.50, marcador: "2 - 1", tiempo: "65'", enVivo: true },
    { id: 102, local: "Comerciantes U.", visita: "Grau", cL: 2.40, cX: 2.90, cV: 3.20, marcador: "0 - 0", tiempo: "12'", enVivo: true },

    // PRÓXIMOS PARTIDOS
    { id: 1, local: "Universitario", visita: "Alianza Lima", cL: 2.15, cX: 3.25, cV: 3.40, hora: "Hoy 20:00", enVivo: false },
    { id: 2, local: "Sporting Cristal", visita: "Cusco FC", cL: 1.40, cX: 4.80, cV: 7.50, hora: "Mañana 15:30", enVivo: false },
    { id: 3, local: "Melgar", visita: "Cienciano", cL: 1.85, cX: 3.40, cV: 4.10, hora: "Viernes 19:00", enVivo: false }
];

const CODIGOS_VALIDOS = { "RANA50": 50, "FABIAN20": 20 };
let user = JSON.parse(localStorage.getItem('rani_user')) || null;

document.addEventListener('DOMContentLoaded', () => {
    if (user) mostrarApp();
    renderizarTodo();
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
    const loginBtn = document.getElementById('google-login-btn');
    const userInfo = document.getElementById('user-info');
    if (loginBtn) loginBtn.classList.add('hidden');
    if (userInfo) userInfo.classList.remove('hidden');
    document.getElementById('user-name').textContent = `Hola, ${user.name}`;
    document.getElementById('user-photo').src = user.photo;
    actualizarUI();
}

function renderizarTodo() {
    const liveContainer = document.getElementById('live-container');
    const fixtureContainer = document.getElementById('fixture-container');
    const liveSection = document.getElementById('live-section');

    let hayEnVivo = false;
    liveContainer.innerHTML = "";
    fixtureContainer.innerHTML = "";

    PARTIDOS.forEach(p => {
        if (p.enVivo) {
            hayEnVivo = true;
            liveContainer.innerHTML += crearCardPartido(p);
        } else {
            fixtureContainer.innerHTML += crearCardPartido(p);
        }
    });

    if (hayEnVivo) liveSection.classList.remove('hidden');
}

function crearCardPartido(p) {
    // Si está en vivo, mostramos marcador y tiempo, si no, la hora.
    const statusInfo = p.enVivo
        ? `<span class="text-red-600 font-bold animate-pulse">${p.tiempo}</span> <span class="bg-gray-100 px-2 rounded font-mono font-bold ml-2">${p.marcador}</span>`
        : `<span class="text-gray-400 uppercase tracking-widest">${p.hora}</span>`;

    return `
        <div class="bet-card p-5 flex flex-col md:flex-row items-center gap-6 border border-gray-100 hover:shadow-lg transition">
            <div class="flex-1 w-full border-r border-gray-100">
                <div class="text-[10px] font-bold flex items-center gap-2 mb-2">
                    ${statusInfo}
                </div>
                <div class="mt-2 space-y-1">
                    <div class="font-bold text-gray-800 text-lg">${p.local}</div>
                    <div class="font-bold text-gray-800 text-lg">${p.visita}</div>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-3 w-full md:w-auto">
                <button class="odds-button p-3 min-w-[85px] flex flex-col items-center">
                    <span class="text-[10px] text-gray-400 font-bold">1</span>
                    <span class="text-md font-extrabold text-green-600">${p.cL.toFixed(2)}</span>
                </button>
                <button class="odds-button p-3 min-w-[85px] flex flex-col items-center">
                    <span class="text-[10px] text-gray-400 font-bold">X</span>
                    <span class="text-md font-extrabold text-green-600">${p.cX.toFixed(2)}</span>
                </button>
                <button class="odds-button p-3 min-w-[85px] flex flex-col items-center">
                    <span class="text-[10px] text-gray-400 font-bold">2</span>
                    <span class="text-md font-extrabold text-green-600">${p.cV.toFixed(2)}</span>
                </button>
            </div>
        </div>
    `;
}

function canjearCodigo() {
    const codeInput = document.getElementById('code-input');
    const code = codeInput.value.toUpperCase().trim();
    if (!user) return alert("Inicia sesión primero con Google.");
    if (user.codigosUsados.includes(code)) return alert("Código ya usado.");
    if (CODIGOS_VALIDOS[code]) {
        user.balance += CODIGOS_VALIDOS[code];
        user.codigosUsados.push(code);
        localStorage.setItem('rani_user', JSON.stringify(user));
        actualizarUI();
        alert("¡BONO CARGADO! 🐸💰");
        codeInput.value = '';
    } else {
        alert("Código inválido.");
    }
}

function actualizarUI() {
    const val = document.getElementById('balance-val');
    if (val) val.textContent = user.balance.toFixed(2);
}