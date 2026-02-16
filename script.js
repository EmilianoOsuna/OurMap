// === CONFIGURACIÓN DEL CARRUSEL Y CARTA ===
const miCarta = `Hola mi amor,\n\nNo puedo creer que ya han pasado 16 meses desde que empezamos este viaje.\n\nTodas estas fotos son un pedacito de nuestra historia, desde que nos vimos la primera vez hasta la última que estuvimos juntos. Planeo ir actualizando esta galería y conforme vayamos estando juntos en distintos países, irlos desbloqueando. Definitivamente no hay manera de describir lo mucho que valoro el tiempo contigo, incluso antes de ser novios oficialmente, haces mi vida mucho más valiosa y especial. \n\nGracias por ser mi compañera todos los días, mi inspiración, mi apoyo, mi más grande motivación y mi más grande deseo.\n\nTe amo inefablemente.\n\n- Tu futuro ingeniero favorito. \n`;

// TU LISTA GIGANTE DE 88 FOTOS
const fotos = [
    'CARTA_INICIAL',
    'foto1.webp', 'foto2.webp', 'foto3.webp', 'foto4.webp', 'foto5.webp', 'foto6.webp', 'foto7.webp', 'foto8.webp', 'foto9.webp', 'foto10.webp',
    'foto11.webp', 'foto12.webp', 'foto13.webp', 'foto14.webp', 'foto15.webp', 'foto16.webp', 'foto17.webp', 'foto18.webp', 'foto19.webp', 'foto20.webp',
    'foto21.webp', 'foto22.webp', 'foto23.webp', 'foto24.webp', 'foto25.webp', 'foto26.webp', 'foto27.webp', 'foto28.webp', 'foto29.webp', 'foto30.webp',
    'foto31.webp', 'foto32.webp', 'foto33.webp', 'foto34.webp', 'foto35.webp', 'foto36.webp', 'foto37.webp', 'foto38.webp', 'foto39.webp', 'foto40.webp',
    'foto41.webp', 'foto42.webp', 'foto43.webp', 'foto44.webp', 'foto45.webp', 'foto46.webp', 'foto47.webp', 'foto48.webp', 'foto49.webp', 'foto50.webp',
    'foto51.webp', 'foto52.webp', 'foto53.webp', 'foto54.webp', 'foto55.webp', 'foto56.webp', 'foto57.webp', 'foto58.webp', 'foto59.webp', 'foto60.webp',
    'foto61.webp', 'foto62.webp', 'foto63.webp', 'foto64.webp', 'foto65.webp', 'foto66.webp', 'foto67.webp', 'foto68.webp', 'foto69.webp', 'foto70.webp',
    'foto71.webp', 'foto72.webp', 'foto73.webp', 'foto74.webp', 'foto75.webp', 'foto76.webp', 'foto77.webp', 'foto78.webp', 'foto79.webp', 'foto80.webp',
    'foto81.webp', 'foto82.webp', 'foto83.webp', 'foto84.webp', 'foto85.webp', 'foto86.webp', 'foto87.webp', 'foto88.webp'
];

let currentIndex = 0;
let autoSlideInterval;
// NUEVO: Variable para bloquear clicks mientras se anima
let isTransitioning = false;

function startAutoSlide() {
    stopAutoSlide(); 
    // Si es la carta, no iniciamos el automático
    if (fotos[currentIndex] === 'CARTA_INICIAL') return;
    // Aumentamos un poco el tiempo (a 4s) para compensar lo que dura la transición
    autoSlideInterval = setInterval(nextImage, 4000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// --- FUNCIÓN PRINCIPAL CON TRANSICIÓN ---
// --- FUNCIÓN PRINCIPAL CON TRANSICIÓN Y PRECARGA ---
function updateCarousel() {
    if (isTransitioning) return;
    
    const imgElement = document.getElementById('carouselImage');
    const letterContainer = document.getElementById('letterContainer');
    const placeholder = document.getElementById('placeholderText');
    
    // 1. Bloqueamos y empezamos a desvanecer (Fade Out)
    isTransitioning = true;
    imgElement.classList.add('transparent-state');
    if(letterContainer) letterContainer.classList.add('transparent-state');

    // 2. Esperamos 400ms a que termine de hacerse invisible
    setTimeout(() => {
        const currentItem = fotos[currentIndex];

        // Ocultamos los contenedores temporalmente
        imgElement.style.display = 'none';
        if(letterContainer) letterContainer.style.display = 'none';
        placeholder.style.display = 'none';
        
        if (fotos.length === 0) {
            placeholder.style.display = 'block';
            isTransitioning = false; 
            return;
        }

        if (currentItem === 'CARTA_INICIAL' && letterContainer) {
            // LÓGICA PARA LA CARTA (No necesita descargar nada de internet)
            letterContainer.style.display = 'flex';
            letterContainer.querySelector('.letter-content').textContent = miCarta;
            
            // Pausa técnica minúscula para que el navegador registre el bloque antes de animar
            setTimeout(() => {
                letterContainer.classList.remove('transparent-state');
                setTimeout(() => isTransitioning = false, 400); // Desbloqueamos al terminar de aparecer
            }, 50);

        } else {
            // LÓGICA PARA LAS FOTOS (Depende de la velocidad de internet)
            imgElement.style.display = 'block';

            // Truco maestro: Le decimos qué hacer CUANDO la foto termine de cargar
            imgElement.onload = () => {
                // Solo hasta que la foto esté 100% descargada, le quitamos lo invisible
                imgElement.classList.remove('transparent-state');
                
                // Esperamos los 400ms de la animación para desbloquear las flechas
                setTimeout(() => {
                    isTransitioning = false;
                }, 400);
                
                // Limpiamos el evento para que no se duplique después
                imgElement.onload = null;
            };

            // Por si alguna foto falla o no se encuentra, desbloqueamos para no trabar la galería
            imgElement.onerror = () => {
                isTransitioning = false;
                imgElement.onload = null;
            };

            // Al asignarle el src AQUÍ, disparamos la descarga y el proceso de arriba
            imgElement.src = currentItem;
        }

    }, 400); 
}

function nextImage() {
    // Si está animando, ignoramos el clic
    if (isTransitioning || fotos.length === 0) return;

    stopAutoSlide(); 
    currentIndex = (currentIndex + 1) % fotos.length;
    updateCarousel();
    startAutoSlide();
}

function prevImage() {
    // Si está animando, ignoramos el clic
    if (isTransitioning || fotos.length === 0) return;

    stopAutoSlide();
    currentIndex = (currentIndex - 1 + fotos.length) % fotos.length;
    updateCarousel();
    startAutoSlide();
}

// === LÓGICA DEL GLOBO 3D Y CÁMARA INTELIGENTE ===
let world;
const BOLIVIA_LAT = -16.2902;
const BOLIVIA_LNG = -63.5887;
const HIGHLIGHT_COLOR = '#C3D9E3'; 
const STROKE_COLOR = '#222222';

fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
    .then(res => res.json())
    .then(countries => {
        world = Globe()
            (document.getElementById('globeViz'))
            .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
            // Quitamos la textura de agua para dejarlo liso
            .showGlobe(true)
            .showAtmosphere(true)
            .atmosphereColor(HIGHLIGHT_COLOR)
            .atmosphereAltitude(0.15)
            .polygonsData(countries.features)
            .polygonAltitude(d => d.properties.NAME === 'Bolivia' ? 0.01 : 0.01)
            // Aclaramos un 1% los países y ponemos bordes sutiles para que se vean sobre el negro
            .polygonCapColor(d => d.properties.NAME === 'Bolivia' ? HIGHLIGHT_COLOR : '#111111') 
            .polygonSideColor(() => '#000000')
            .polygonStrokeColor(() => '#333333') 
            .onPolygonClick((d, event, { lat, lng, altitude }) => {
                if (d.properties.NAME === 'Bolivia') {
                    
                    let zoomLat, zoomAlt;
                    if (window.innerWidth < 768) {
                        zoomLat = BOLIVIA_LAT + 12; 
                        zoomAlt = 3.0; 
                    } else {
                        zoomLat = BOLIVIA_LAT;
                        zoomAlt = 1.8; 
                    }

                    world.pointOfView({ lat: zoomLat, lng: BOLIVIA_LNG, altitude: zoomAlt }, 1200);
                    
                    setTimeout(() => {
                        document.getElementById('galleryModal').classList.add('show');
                        updateCarousel(); 
                        startAutoSlide();
                    }, 800);
                }
            })
            .onPolygonHover(hoverD => {
                world.polygonAltitude(d => d === hoverD && d.properties.NAME === 'Bolivia' ? 0.03 : (d.properties.NAME === 'Bolivia' ? 0.01 : 0.01));
                document.body.style.cursor = (hoverD && hoverD.properties.NAME === 'Bolivia') ? 'pointer' : 'default';
            });

        // Aplicamos el color negro sólido al material de la esfera (El océano)
        world.globeMaterial().color.set('#000000');

        world.controls().autoRotate = true;
        world.controls().autoRotateSpeed = 0.6; 
        
        let targetLat, targetAlt;
        if (window.innerWidth < 768) {
            targetLat = BOLIVIA_LAT + 25; 
            targetAlt = 4.0; 
        } else {
            targetLat = BOLIVIA_LAT;
            targetAlt = 2.2;
        }

        world.pointOfView({ lat: targetLat, lng: BOLIVIA_LNG, altitude: targetAlt });
    });

window.addEventListener('resize', () => {
    if (world) {
        world.width([window.innerWidth]);
        world.height([window.innerHeight]);
    }
});

// === INTERACCIONES DE INTERFAZ ===
function closeGallery() {
    document.getElementById('galleryModal').classList.remove('show');
    stopAutoSlide();
    if (world) {
        // Regresa el zoom al estado original al cerrar
        let targetLat, targetAlt;
        if (window.innerWidth < 768) {
            targetLat = BOLIVIA_LAT + 25;
            targetAlt = 4.0;
        } else {
            targetLat = BOLIVIA_LAT;
            targetAlt = 2.2;
        }
        world.pointOfView({ lat: targetLat, lng: BOLIVIA_LNG, altitude: targetAlt }, 1000);
        
        world.controls().autoRotate = true; 
    }
}

// === CERRAR MODAL AL HACER CLIC AFUERA (VERSIÓN CORREGIDA) ===
document.addEventListener('pointerdown', (event) => {
    const modal = document.getElementById('galleryModal');
    
    // Verificamos que la galería esté abierta, que el clic sea afuera, 
    // Y QUE NO estemos viendo una foto en pantalla completa
    if (modal.classList.contains('show') && 
        !modal.contains(event.target) && 
        !fullscreenModal.classList.contains('show-fullscreen')) {
        closeGallery();
    }
});

function toggleCounter() {
    const card = document.getElementById('anniversaryCard');
    const btn = document.getElementById('toggleCounterBtn');
    card.classList.toggle('hidden');
    btn.innerText = card.classList.contains('hidden') ? 'Mostrar Contador' : 'Ocultar Contador';
}

// === TOGGLE DE SPOTIFY ===
function toggleSpotify() {
    const widget = document.getElementById('spotifyWidget');
    const btn = document.getElementById('musicBtn');
    
    // Agrega o quita la clase hidden
    widget.classList.toggle('hidden');
    
    // Cambia el texto del botón según el estado
    if (widget.classList.contains('hidden')) {
        btn.innerHTML = '🎵 Mostrar Música';
    } else {
        btn.innerHTML = '🎵 Ocultar Música';
    }
}

// === CONTADOR EN VIVO ===
function startCounter() {
    const startDate = new Date('2024-10-15T00:00:00'); 

    setInterval(() => {
        const now = new Date();
        let years = now.getFullYear() - startDate.getFullYear();
        let months = now.getMonth() - startDate.getMonth();
        let days = now.getDate() - startDate.getDate();
        
        if (days < 0) {
            months -= 1;
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            days += prevMonth;
        }
        if (months < 0) {
            years -= 1;
            months += 12;
        }
        
        const totalMonths = (years * 12) + months;
        const diff = now - startDate;
        const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const segs = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('meses').innerText = totalMonths;
        document.getElementById('dias').innerText = days;
        document.getElementById('horas').innerText = horas.toString().padStart(2, '0');
        document.getElementById('mins').innerText = mins.toString().padStart(2, '0');
        document.getElementById('segs').innerText = segs.toString().padStart(2, '0');
    }, 1000);
}

// === LÓGICA DE PANTALLA COMPLETA (LIGHTBOX) ===
const fullscreenModal = document.getElementById('fullscreenModal');
const fullscreenImage = document.getElementById('fullscreenImage');
const carouselImage = document.getElementById('carouselImage');

// Abrir imagen en grande
carouselImage.addEventListener('click', () => {
    stopAutoSlide(); // Pausamos el carrusel para que no le cambie la foto mientras la ve
    fullscreenImage.src = carouselImage.src;
    fullscreenModal.classList.add('show-fullscreen');
});

// Cerrar imagen en grande (dando clic en cualquier parte)
fullscreenModal.addEventListener('click', () => {
    fullscreenModal.classList.remove('show-fullscreen');
    startAutoSlide(); // Reanudamos el show
});


startCounter();