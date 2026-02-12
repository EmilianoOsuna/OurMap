// ==========================================
//  Paso 1: PEGA TUS COORDENADAS AQUÍ ABAJO
// ==========================================
// Busca en Google Maps, click derecho, copia los números.
// Ejemplo La Paz: [-16.4897, -68.1193]

const COORDENADAS_BOLIVIA = [-16.2902, -63.5887]; 

// ==========================================

// 1. Configuración del mapa (Límites para que no se repita)
const bounds = [[-85, -180], [85, 180]];
var map = L.map('map', {
    center: [-16.2902, -63.5887], // Centrado en Sudamérica para ver bien Bolivia
    zoom: 3.5,
    minZoom: 3,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
    zoomControl: false
});

// 2. Capa base (CON ETIQUETAS/NOMBRES)
// Usamos 'dark_all' que incluye nombres de países y ciudades
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '©CARTO',
    subdomains: 'abcd',
    maxZoom: 19,
    noWrap: true
}).addTo(map);

// 3. Pintar Bolivia de Rojo
function estiloPaises(feature) {
    if (feature.id === 'BOL') {
        return { fillColor: '#ff0055', weight: 2, color: '#ff4081', fillOpacity: 0.6 };
    } else {
        return { fillColor: '#050505', weight: 1, color: '#222', fillOpacity: 0.8 };
    }
}

// Cargar siluetas
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
.then(res => res.json())
.then(data => {
    L.geoJSON(data, {
        style: estiloPaises,
        onEachFeature: function(feature, layer) {
            // Acción solo para Bolivia
            if (feature.id === 'BOL') {
                layer.on('click', abrirModal);
                layer.on('mouseover', function() { this.setStyle({fillOpacity: 0.8, cursor: 'pointer'}); });
                layer.on('mouseout', function() { this.setStyle({fillOpacity: 0.6}); });
            }
        }
    }).addTo(map);
});

// 4. EL ÚNICO PIN (Corazón)
var iconoCorazon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/210/210545.png',
    iconSize: [45, 45], // Tamaño
    iconAnchor: [22, 45], // El punto del pin está abajo al centro
    className: 'custom-pin'
});

var marcador = L.marker(COORDENADAS_BOLIVIA, {icon: iconoCorazon}).addTo(map);
marcador.on('click', abrirModal);

// Función auxiliar para abrir el modal
function abrirModal() {
    document.getElementById('modalBolivia').style.display = 'block';
}
