const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTrSV31J-OEkp58qUQJUYGpu0mjISCNF4-Zelw1705EcISzAlccksrhi_nKu2FagnruaZqrd-dzAbGk/pub?output=csv";
let PARTIDOS = [];

async function cargarDesdeExcel() {
    try {
        const res = await fetch(urlCSV);
        const csv = await res.text();
        const filas = csv.split("\n").slice(2); 

        PARTIDOS = filas.map((f, i) => {
            const c = f.split(",");
            if (c.length < 7) return null;
            const nombres = c[0].split(" vs ");
            return {
                id: 500 + i,
                liga: c[4].trim(),
                local: nombres[0]?.trim() || "Local",
                visita: nombres[1]?.trim() || "Visita",
                cL: parseFloat(c[1]) || 1.00,
                cX: parseFloat(c[2]) || 1.00,
                cV: parseFloat(c[3]) || 1.00,
                hora: c[5].trim(),
                estado: c[6].trim(),
                enVivo: c[6].toUpperCase().includes("VIVO")
            };
        }).filter(p => p !== null);

        renderizarTodo(); 
    } catch (e) {
        console.error("Error en Excel:", e);
    }
}

function renderizarTodo() {
    // Intentamos encontrar cualquier contenedor común de partidos
    const container = document.getElementById('matches-container') || 
                      document.getElementById('partidos-grid') || 
                      document.querySelector('.grid-partidos');
    
    if (!container) return;

    container.innerHTML = PARTIDOS.map(p => `
        <div class="card-partido">
            <div class="liga">${p.liga}</div>
            <div class="equipos">${p.local} vs ${p.visita}</div>
            <div class="cuotas">
                <button>L ${p.cL}</button>
                <button>E ${p.cX}</button>
                <button>V ${p.cV}</button>
            </div>
            <div class="estado">${p.enVivo ? '🔴 EN VIVO' : p.hora}</div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', cargarDesdeExcel);
