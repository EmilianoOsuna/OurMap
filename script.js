let world;

const BOLIVIA_LAT = -16.2902;
const BOLIVIA_LNG = -63.5887;
const HIGHLIGHT_COLOR = '#C3D9E3'; // Tu color unificado
const STROKE_COLOR = '#222222';

// === CONFIGURACIÓN DEL CARRUSEL DE FOTOS ===
// Pon aquí los nombres o rutas de tus fotos. 
// Ejemplo: Si tienes tus fotos en la misma carpeta, pon 'foto1.jpg', 'foto2.png', etc.
const fotos = [
    // '', // Descomenta y pon tus imágenes entre las comillas
    // '', 
    // ''
];

let currentIndex = 0;

function updateCarousel() {
    const imgElement = document.getElementById('carouselImage');
    const placeholder = document.getElementById('placeholderText');
    
    if (fotos.length > 0) {
        imgElement.src = fotos[currentIndex];
        imgElement.style.display = 'block';
        placeholder.style.display = 'none';
    } else {
        imgElement.style.display = 'none';
        placeholder.style.display = 'block';
    }
}

function nextImage() {
    if (fotos.length > 0) {
        currentIndex = (currentIndex + 1) % fotos.length;
        updateCarousel();
    }
}

function prevImage() {
    if (fotos.length > 0) {
        currentIndex = (currentIndex - 1 + fotos.length) % fotos.length;
        updateCarousel();
    }
}
// ============================================


fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
    .then(res => res.json())
    .then(countries => {
        
        world = Globe()
            (document.getElementById('globeViz'))
            .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
            .showGlobe(true)
            .showAtmosphere(true)
            .atmosphereColor(HIGHLIGHT_COLOR)
            .atmosphereAltitude(0.15)
            .polygonsData(countries.features)
            .polygonAltitude(d => d.properties.NAME === 'Bolivia' ? 0.01 : 0.01)
            .polygonCapColor(d => d.properties.NAME === 'Bolivia' ? HIGHLIGHT_COLOR : '#0a0a0a') 
            .polygonSideColor(() => '#000000')
            .polygonStrokeColor(() => STROKE_COLOR) 
            .onPolygonClick((d, event, { lat, lng, altitude }) => {
                if (d.properties.NAME === 'Bolivia') {
                    world.controls().autoRotate = false;
                    
                    const zoomAltitude = window.innerWidth < 768 ? 2.2 : 1.8;
                    world.pointOfView({ lat: BOLIVIA_LAT, lng: BOLIVIA_LNG, altitude: zoomAltitude }, 1200);
                    
                    // CAMBIO AQUÍ: Usamos classList.add en lugar de display = 'block'
                    setTimeout(() => {
                        document.getElementById('galleryModal').classList.add('show');
                        updateCarousel(); 
                    }, 800); // Reduje un poco el tiempo para que se sienta más responsivo
                }
            })
            .onPolygonHover(hoverD => {
                world.polygonAltitude(d => d === hoverD && d.properties.NAME === 'Bolivia' ? 0.03 : (d.properties.NAME === 'Bolivia' ? 0.01 : 0.01));
                document.body.style.cursor = (hoverD && hoverD.properties.NAME === 'Bolivia') ? 'pointer' : 'default';
            });

        world.controls().autoRotate = true;
        world.controls().autoRotateSpeed = 0.6; 
        
        if (window.innerWidth < 768) {
            world.pointOfView({ altitude: 2.8 });
        }
    });

window.addEventListener('resize', () => {
    if (world) {
        world.width([window.innerWidth]);
        world.height([window.innerHeight]);
    }
});

function closeGallery() {
    // CAMBIO AQUÍ: Usamos classList.remove
    document.getElementById('galleryModal').classList.remove('show');
    
    if (world) {
        world.controls().autoRotate = true; 
    }
}

function toggleCounter() {
    const card = document.getElementById('anniversaryCard');
    const btn = document.getElementById('toggleCounterBtn');
    
    // El método toggle añade la clase si no la tiene, o la quita si ya la tiene
    card.classList.toggle('hidden');
    
    if (card.classList.contains('hidden')) {
        btn.innerText = 'Mostrar Contador';
    } else {
        btn.innerText = 'Ocultar Contador';
    }
}

// === LÓGICA DEL CONTADOR EN VIVO ===
function startCounter() {
    // Fecha de inicio: 16 de Octubre de 2024 a la medianoche
    // (Puedes cambiar el T00:00:00 por la hora exacta si la sabes, ej: T15:30:00)
    const startDate = new Date('2024-10-16T00:00:00'); 

    setInterval(() => {
        const now = new Date();
        
        // Cálculo preciso de años, meses y días
        let years = now.getFullYear() - startDate.getFullYear();
        let months = now.getMonth() - startDate.getMonth();
        let days = now.getDate() - startDate.getDate();
        
        if (days < 0) {
            months -= 1;
            // Obtener los días del mes anterior para un cálculo exacto
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            days += prevMonth;
        }
        if (months < 0) {
            years -= 1;
            months += 12;
        }
        
        const totalMonths = (years * 12) + months;
        
        // Cálculo de horas, minutos y segundos restantes
        const diff = now - startDate;
        const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const segs = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Inyectar los valores en el HTML
        document.getElementById('meses').innerText = totalMonths;
        document.getElementById('dias').innerText = days;
        document.getElementById('horas').innerText = horas.toString().padStart(2, '0');
        document.getElementById('mins').innerText = mins.toString().padStart(2, '0');
        document.getElementById('segs').innerText = segs.toString().padStart(2, '0');
        
    }, 1000); // Se actualiza cada 1000 milisegundos (1 segundo)
}

// Iniciar el contador en cuanto cargue el script
startCounter();