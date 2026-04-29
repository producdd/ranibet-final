const PARTIDOS = [
    { id: 1, local: "Universitario", visita: "Alianza Lima", cuotaL: 2.10, cuotaX: 3.20, cuotaV: 3.50, fecha: "Hoy 20:00" },
    { id: 2, local: "Sporting Cristal", visita: "Cusco FC", cuotaL: 1.45, cuotaX: 4.50, cuotaV: 7.00, fecha: "Mañana 15:30" }
];

const CODIGOS_VALIDOS = { "RANA50": 50, "FABIAN20": 20, "VIP100": 100 };
let user = JSON.parse(localStorage.getItem('rani_user')) || null;

document.addEventListener('DOMContentLoaded', () => {
    if (user) {
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('balance-display').classList.remove('hidden');
        actualizarUI();
    }
    cargarFixture();
});

function conectarID() {
    const id = document.getElementById('user-id-input').value.trim();
    if (id.length < 3) return alert("ID muy corto");
    user = { id: id, balance: 50.00, codigosUsados: [] };
    localStorage.setItem('rani_user', JSON.stringify(user));
    location.reload();
}

function cargarFixture() {
    const container = document.getElementById('fixture-container');
    PARTIDOS.forEach(p => {
        container.innerHTML += `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-xl">
                <div class="text-[10px] text-gray-500 mb-3 font-orb uppercase tracking-widest">${p.fecha}</div>
                <div class="flex justify-between items-center mb-5">
                    <span class="font-bold text-lg">${p.local}</span>
                    <span class="text-xs text-gray-600 font-orb">VS</span>
                    <span class="font-bold text-lg">${p.visita}</span>
                </div>
                <div class="grid grid-cols-3 gap-2">
                    <button class="bg-gray-800 py-2 rounded font-orb text-xs hover:bg-green-900/40 transition">1: ${p.cuotaL}</button>
                    <button class="bg-gray-800 py-2 rounded font-orb text-xs hover:bg-green-900/40 transition">X: ${p.cuotaX}</button>
                    <button class="bg-gray-800 py-2 rounded font-orb text-xs hover:bg-green-900/40 transition">2: ${p.cuotaV}</button>
                </div>
            </div>
        `;
    });
}

function canjearCodigo() {
    const code = document.getElementById('code-input').value.toUpperCase().trim();
    if (!user) return alert("Primero conecta tu ID");
    if (user.codigosUsados.includes(code)) return alert("Este código ya fue usado");
    if (CODIGOS_VALIDOS[code]) {
        user.balance += CODIGOS_VALIDOS[code];
        user.codigosUsados.push(code);
        localStorage.setItem('rani_user', JSON.stringify(user));
        actualizarUI();
        alert(`¡GOOOL! +${CODIGOS_VALIDOS[code]} Rani Coins 🐸💰`);
        document.getElementById('code-input').value = '';
    } else {
        alert("Código no válido");
    }
}

function actualizarUI() {
    document.getElementById('balance-val').textContent = user.balance.toFixed(2);
}