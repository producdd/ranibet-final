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
            const equipos = c[0].split(" vs ");
            return { 
                id: i, 
                local: equipos[0] || "Local", 
                visita: equipos[1] || "Visita", 
                cL: c[1], cX: c[2], cV: c[3], 
                liga: c[4], 
                hora: c[5], 
                estado: c[6] 
            };
        }).filter(p => p !== null);
        renderizarTodo();
    } catch (e) { console.error("Error cargando Excel:", e); }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarDesdeExcel();
    // Aquí puedes mantener tu lógica de usuario si la tenías
});

async function cargarDesdeExcel() {
    try {
        const res = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTrSV31J-OEkp58qUQJUYGpu0mjISCNF4-Zelw1705EcISzAlccksrhi_nKu2FagnruaZqrd-dzAbGk/pub?output=csv");
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
                enVivo: c[6].includes("VIVO")
            };
        }).filter(p => p !== null);

        if (typeof renderizarTodo === "function") renderizarTodo();
        if (typeof renderizarPartidos === "function") renderizarPartidos();
    } catch (e) {
        console.error("Error en Excel:", e);
    }
}
// Ejecutar carga automática
setTimeout(cargarDesdeExcel, 1000);
