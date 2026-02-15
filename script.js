let world;

const BOLIVIA_LAT = -16.2902;
const BOLIVIA_LNG = -63.5887;
const HIGHLIGHT_COLOR = '#C3D9E3'; // Tu color unificado
const STROKE_COLOR = '#222222';

// === CONFIGURACIÓN DEL CARRUSEL DE FOTOS ===
// Pon aquí los nombres o rutas de tus fotos. 
// Ejemplo: Si tienes tus fotos en la misma carpeta, pon 'foto1.jpg', 'foto2.png', etc.
const fotos = [
    'foto1.webp',
    'foto2.webp',
    'foto3.webp',
    'foto4.webp',
    'foto5.webp',
    'foto6.webp',
    'foto7.webp',
    'foto8.webp',
    'foto9.webp',
    'foto10.webp',
    'foto11.webp',
    'foto12.webp',
    'foto13.webp',
    'foto14.webp',
    'foto15.webp',
    'foto16.webp',
    'foto17.webp',
    'foto18.webp',
    'foto19.webp',
    'foto20.webp',
    'foto21.webp',
    'foto22.webp',
    'foto23.webp',
    'foto24.webp',
    'foto25.webp',
    'foto26.webp',
    'foto27.webp',
    'foto28.webp',
    'foto29.webp',
    'foto30.webp',
    'foto31.webp',
    'foto32.webp',
    'foto33.webp',
    'foto34.webp',
    'foto35.webp',
    'foto36.webp',
    'foto37.webp',
    'foto38.webp',
    'foto39.webp',
    'foto40.webp',
    'foto41.webp',
    'foto42.webp',
    'foto43.webp',
    'foto44.webp',
    'foto45.webp',
    'foto46.webp',
    'foto47.webp',
    'foto48.webp',
    'foto49.webp',
    'foto50.webp',
    'foto51.webp',
    'foto52.webp',
    'foto53.webp',
    'foto54.webp',
    'foto55.webp',
    'foto56.webp',
    'foto57.webp',
    'foto58.webp',
    'foto59.webp',
    'foto60.webp',
    'foto61.webp',
    'foto62.webp',
    'foto63.webp',
    'foto64.webp',
    'foto65.webp',
    'foto66.webp',
    'foto67.webp',
    'foto68.webp',
    'foto69.webp',
    'foto70.webp',
    'foto71.webp',
    'foto72.webp',
    'foto73.webp',
    'foto74.webp',
    'foto75.webp',
    'foto76.webp',
    'foto77.webp',
    'foto78.webp',
    'foto79.webp',
    'foto80.webp',
    'foto81.webp',
    'foto82.webp',
    'foto83.webp',
    'foto84.webp',
    'foto85.webp',
    'foto86.webp',
    'foto87.webp',
    'foto88.webp'
];

let currentIndex = 0;

// NUEVO: Variable para controlar el temporizador automático
let autoSlideInterval;

// NUEVO: Función para iniciar el pase automático
function startAutoSlide() {
    // Detenemos cualquier intervalo previo para evitar duplicados
    stopAutoSlide(); 
    // Cambia de imagen cada 3.5 segundos (3500 milisegundos)
    // Puedes ajustar este número si lo quieres más rápido o lento
    autoSlideInterval = setInterval(nextImage, 3500);
}

// NUEVO: Función para detener el pase automático
function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}
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
        // Reiniciamos el automático para dar tiempo a ver la foto
        stopAutoSlide(); 
        currentIndex = (currentIndex + 1) % fotos.length;
        updateCarousel();
        startAutoSlide();
    }
}

function prevImage() {
    if (fotos.length > 0) {
        stopAutoSlide();
        currentIndex = (currentIndex - 1 + fotos.length) % fotos.length;
        updateCarousel();
        startAutoSlide();
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
                    //world.controls().autoRotate = false;
                    
                    const zoomAltitude = window.innerWidth < 768 ? 2.2 : 1.8;
                    world.pointOfView({ lat: BOLIVIA_LAT, lng: BOLIVIA_LNG, altitude: zoomAltitude }, 1200);
                    
                    // CAMBIO AQUÍ: Usamos classList.add en lugar de display = 'block'
                    setTimeout(() => {
                        document.getElementById('galleryModal').classList.add('show');
                        updateCarousel(); 
                        startAutoSlide();
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
    stopAutoSlide();
    
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