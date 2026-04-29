const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTrSV31J-OEkp58qUQJUYGpu0mjISCNF4-Zelw1705EcISzAlccksrhi_nKu2FagnruaZqrd-dzAbGk/pub?output=csv";
const PARTIDOS = [
    { id: 101, liga: "LIGA 1 PERÚ", local: "ADT", visita: "Sport Huancayo", cL: 1.80, cX: 3.10, cV: 4.50, marcador: "2 - 1", tiempo: "65'", enVivo: true },
    { id: 1, liga: "LIGA 1 PERÚ", local: "Universitario", visita: "Alianza Lima", cL: 2.15, cX: 3.25, cV: 3.40, hora: "Hoy 20:00", enVivo: false },
    { id: 2, liga: "COPA LIBERTADORES", local: "Sporting Cristal", visita: "Cusco FC", cL: 1.40, cX: 4.80, cV: 7.50, hora: "Mañana 15:30", enVivo: false }
];

let user = JSON.parse(localStorage.getItem('rani_user')) || null;
let seleccionActual = null;

async function cargarDesdeExcel() { 
    try { 
        const res = await fetch(urlCSV); 
        const csv = await res.text(); 
        const filas = csv.split("\n").slice(2); 
        PARTIDOS = filas.map((f, i) => { 
            const c = f.split(","); 
            if (c.length < 7) return null; 
            return { id: i, local: c[0].split(" vs ")[0], visita: c[0].split(" vs ")[1], cL: c[1], cX: c[2], cV: c[3], liga: c[4], hora: c[5], estado: c[6] }; 
        }).filter(p => p !== null); 
        cargarDesdeExcel(); 
    } catch (e) { console.error(e); } 
}
document.addEventListener('DOMContentLoaded', () => {
    if (user) mostrarApp();
    cargarDesdeExcel();

    // Escuchar cambios en el monto para calcular ganancia
    document.getElementById('bet-amount')?.addEventListener('input', calcularGanancia);
});

function handleCredentialResponse(response) {
    const data = parseJwt(response.credential);
    user = { id: data.sub, name: data.given_name || data.name.split(' ')[0], photo: data.picture, balance: 50.00, codigosUsados: [] };
    localStorage.setItem('rani_user', JSON.stringify(user));
    mostrarApp();
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
}

function mostrarApp() {
    document.getElementById('google-login-btn').classList.add('hidden');
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('user-name').textContent = `Hola, ${user.name}`;
    document.getElementById('user-photo').src = user.photo;
    actualizarUI();
}

function renderizarTodo() {
    const liveContainer = document.getElementById('live-container');
    const fixtureContainer = document.getElementById('fixture-container');
    let hayEnVivo = false;
    liveContainer.innerHTML = ""; fixtureContainer.innerHTML = "";

    PARTIDOS.forEach(p => {
        const card = crearCardHTML(p);
        if (p.enVivo) { hayEnVivo = true; liveContainer.innerHTML += card; }
        else { fixtureContainer.innerHTML += card; }
    });
    if (hayEnVivo) document.getElementById('live-section').classList.remove('hidden');
}

function crearCardHTML(p) {
    const status = p.enVivo ? `<span class="text-red-600 font-bold animate-pulse">● ${p.tiempo}</span> <span class="bg-gray-100 px-2 rounded font-bold">${p.marcador}</span>` : `<span class="text-gray-400 font-bold text-[10px]">${p.hora}</span>`;
    return `
        <div class="bet-card p-4 flex flex-col md:flex-row items-center gap-4 border border-gray-100 hover:shadow-md transition bg-white">
            <div class="flex-1 w-full border-r border-gray-50">
                <p class="text-[9px] font-bold text-green-700 uppercase mb-1">${p.liga}</p>
                <div class="mb-2 text-xs font-bold">${status}</div>
                <div class="font-black text-gray-900 text-lg tracking-tighter">${p.local} vs ${p.visita}</div>
            </div>
            <div class="grid grid-cols-3 gap-2 w-full md:w-auto">
                <button onclick="seleccionarApuesta('${p.local} vs ${p.visita}', 'Local', ${p.cL})" class="odds-button p-2 min-w-[70px] flex flex-col items-center">
                    <span class="text-[9px] text-gray-400 uppercase">1</span>
                    <span class="font-bold text-green-600">${p.cL.toFixed(2)}</span>
                </button>
                <button onclick="seleccionarApuesta('${p.local} vs ${p.visita}', 'Empate', ${p.cX})" class="odds-button p-2 min-w-[70px] flex flex-col items-center">
                    <span class="text-[9px] text-gray-400 uppercase">X</span>
                    <span class="font-bold text-green-600">${p.cX.toFixed(2)}</span>
                </button>
                <button onclick="seleccionarApuesta('${p.local} vs ${p.visita}', 'Visita', ${p.cV})" class="odds-button p-2 min-w-[70px] flex flex-col items-center">
                    <span class="text-[9px] text-gray-400 uppercase">2</span>
                    <span class="font-bold text-green-600">${p.cV.toFixed(2)}</span>
                </button>
            </div>
        </div>
    `;
}

function seleccionarApuesta(partido, eleccion, cuota) {
    if (!user) return alert("Inicia sesión primero con Google");
    seleccionActual = { partido, eleccion, cuota };

    document.getElementById('empty-msg').classList.add('hidden');
    document.getElementById('bet-details').classList.remove('hidden');
    document.getElementById('bet-slip').classList.remove('border-dashed');
    document.getElementById('bet-match').textContent = partido;
    document.getElementById('bet-pick').textContent = `${eleccion} @ ${cuota.toFixed(2)}`;
    document.getElementById('bet-count').textContent = "1";
    calcularGanancia();
}

function calcularGanancia() {
    if (!seleccionActual) return;
    const monto = parseFloat(document.getElementById('bet-amount').value) || 0;
    const ganancia = monto * seleccionActual.cuota;
    document.getElementById('pot-win').textContent = ganancia.toFixed(2);
}

function realizarApuesta() {
    const monto = parseFloat(document.getElementById('bet-amount').value);
    if (monto > user.balance) return alert("Saldo insuficiente. ¡Usa un código de bono!");
    if (monto <= 0) return alert("Ingresa un monto válido");

    user.balance -= monto;
    localStorage.setItem('rani_user', JSON.stringify(user));
    actualizarUI();
    alert(`¡Apuesta realizada! Suerte con: ${seleccionActual.partido}. Tus coins restantes: ${user.balance.toFixed(2)}`);

    // Resetear boleto
    document.getElementById('bet-details').classList.add('hidden');
    document.getElementById('empty-msg').classList.remove('hidden');
    document.getElementById('bet-count').textContent = "0";
    seleccionActual = null;
}

function actualizarUI() {
    const el = document.getElementById('balance-val');
    if (el) el.textContent = user.balance.toFixed(2);
}

function canjearCodigo() {
    const code = document.getElementById('code-input').value.toUpperCase().trim();
    if (!user) return alert("Loguéate primero");
    if (user.codigosUsados.includes(code)) return alert("Ya lo usaste");
    if (CODIGOS_VALIDOS[code]) {
        user.balance += CODIGOS_VALIDOS[code];
        user.codigosUsados.push(code);
        localStorage.setItem('rani_user', JSON.stringify(user));
        actualizarUI();
        alert("¡Rani Coins cargadas! 💰");
        document.getElementById('code-input').value = '';
    }
}