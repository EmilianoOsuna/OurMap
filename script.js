// Declaramos el mundo globalmente para poder acceder a él desde la función de cerrar
let world;

const BOLIVIA_LAT = -16.2902;
const BOLIVIA_LNG = -63.5887;
const HIGHLIGHT_COLOR = '#659FD2'; 
const STROKE_COLOR = '#222222'

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
                    // Detener rotación al interactuar
                    world.controls().autoRotate = false;
                    
                    world.pointOfView({ lat: BOLIVIA_LAT, lng: BOLIVIA_LNG, altitude: 1.8 }, 1200);
                    
                    setTimeout(() => {
                        document.getElementById('galleryModal').style.display = 'block';
                    }, 1000);
                }
            })
            .onPolygonHover(hoverD => {
                world.polygonAltitude(d => d === hoverD && d.properties.NAME === 'Bolivia' ? 0.03 : (d.properties.NAME === 'Bolivia' ? 0.01 : 0.01));
                document.body.style.cursor = (hoverD && hoverD.properties.NAME === 'Bolivia') ? 'pointer' : 'default';
            });

        world.controls().autoRotate = true;
        world.controls().autoRotateSpeed = 0.6; 
    });

function closeGallery() {
    document.getElementById('galleryModal').style.display = 'none';
    
    // Volver a activar la rotación al cerrar la galería
    if (world) {
        world.controls().autoRotate = true; 
    }
}