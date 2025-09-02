/* script.js – Musicalitos
   - Carga canciones desde canciones.json
   - Renderiza botones, secciones, visual de bolitas y audios
   - Agrega imágenes de decoración por canción (sin tapar bolitas)
   - Controla tabs y menú de ayuda de Musi
*/

document.addEventListener('DOMContentLoaded', () => {
  const botonesContenedor   = document.getElementById('botones-canciones');
  const seccionesContenedor = document.getElementById('secciones-canciones');

  fetch('canciones.json')
    .then(res => res.json())
    .then(canciones => {
      canciones.forEach((cancion, index) => {
        // ===== Botón de la canción =====
        const boton = document.createElement('button');
        boton.className = 'cancion-card tab-button';
        boton.textContent = `🎵 ${cancion.titulo}`;
        boton.dataset.target = `cancion-${index}`;
        botonesContenedor.appendChild(boton);

        // ===== Sección de la canción =====
        const seccion = document.createElement('section');
        seccion.className = 'tab-content';
        seccion.id = `cancion-${index}`;

        seccion.innerHTML = `
          <h2>🎵 ${cancion.titulo}</h2>
          <p><strong>Artista:</strong> ${cancion.artista}</p>

          <section class="cancion-colores">
            ${renderDecoraciones(cancion.decoracion)}
            <h2>${cancion.titulo}</h2>
            ${generarVisual(cancion.visual)}
          </section>

          <ul>
            <li><a href="${cancion.guia}" target="_blank">📘 Ver guía</a></li>
          </ul>

          <div class="audios-instrumentos">
            <h3>🎧 Escucha por instrumento:</h3>
            ${generarAudios(cancion.audio)}
          </div>
        `;

        seccionesContenedor.appendChild(seccion);
      });

      activarTabs();
    })
    .catch(err => console.error('Error cargando canciones:', err));

  /* =============== Helpers =============== */

  // Render de las bolitas + texto debajo
  function generarVisual(visualArray = []) {
    return visualArray.map(linea => {
      const bolitas = (linea.colores || [])
        .map(color => `<span class="color ${color}"></span>`)
        .join('');

      // Evita saltos por espacios múltiples usando &nbsp;
      const texto = `<p>${(linea.texto || '').split(' ').join('&nbsp;')}</p>`;

      return `<div class="linea">${bolitas}</div>${texto}`;
    }).join('');
  }

  // Render de audios por instrumento
  function generarAudios(audio = {}) {
    if (!audio || typeof audio !== 'object') {
      return '<p>No hay audios disponibles</p>';
    }

    const instrumentos = {
      xilofono: 'Xilófono',
      piano: 'Piano',
      flauta: 'Flauta',
      ukelele: 'Ukelele'
    };

    return Object.entries(audio).map(([key, src]) => `
      <div class="audio-item">
        <strong>${instrumentos[key] || key}:</strong><br>
        <audio controls preload="none">
          <source src="${src}" type="audio/mpeg">
          Tu navegador no soporta el elemento de audio.
        </audio>
      </div>
    `).join('');
  }

  // Render de decoraciones (esquinas) sin tapar bolitas
  function renderDecoraciones(deco) {
    if (!deco || !deco.img) return '';
    const posiciones = Array.isArray(deco.posiciones) && deco.posiciones.length
      ? deco.posiciones
      : ['top-right']; // por defecto

    const clasePos = {
      'top-left'    : 'decoracion-top-left',
      'top-right'   : 'decoracion-top-right',
      'bottom-left' : 'decoracion-bottom-left',
      'bottom-right': 'decoracion-bottom-right'
    };

    return posiciones.map(pos => `
      <img aria-hidden="true" alt=""
           src="${deco.img}"
           class="decoracion-img ${clasePos[pos] || 'decoracion-top-right'}">
    `).join('');
  }

  // Tabs (mostrar/ocultar cada canción)
  function activarTabs() {
    const botones   = document.querySelectorAll('.tab-button');
    const secciones = document.querySelectorAll('.tab-content');

    botones.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const seccion = document.getElementById(targetId);

        botones.forEach(b => b.classList.remove('clicked'));
        secciones.forEach(s => s.classList.remove('active'));

        btn.classList.add('clicked');
        seccion.classList.add('active');

        seccion.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // ===== Menú de ayuda de Musi =====
  const musi  = document.getElementById('musi');
  const menu  = document.getElementById('menu-musi');
  const ayuda = document.getElementById('musi-ayuda');

  if (musi) {
    musi.addEventListener('click', () => {
      if (menu.style.display === 'block') {
        menu.style.display = 'none';
        ayuda.style.display = 'none';
      } else {
        menu.style.display = 'block';
      }
    });
  }
});

/* ===== Función global para textos de ayuda ===== */
function mostrarExplicacion(tipo) {
  const ayuda = document.getElementById('musi-ayuda');
  if (!ayuda) return;
  ayuda.style.display = 'block';

  if (tipo === 'uso') {
    ayuda.innerHTML = `
      📖 <strong>¿Cómo usar esta página?</strong><br>
      Elige una canción con los botones. Verás su guía, los audios por instrumento y la lectura con bolitas de colores.
    `;
  } else if (tipo === 'practica') {
    ayuda.innerHTML = `
      🎶 <strong>¿Cómo practicar?</strong><br>
      1) Escucha el instrumento que prefieras.<br>
      2) Sigue las bolitas con la voz o palmas.<br>
      3) Repite por partes y arma tu mini coreo o juego.
    `;
  }
}
