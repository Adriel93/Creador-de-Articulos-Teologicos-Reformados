let datosGenerados = {};
const API_BASE = window.location.origin;

// CONFIGURACIÓN DE WEBHOOK
let webhookConfig = {
  enabled: false,
  url: ''
};

// Categorías disponibles
const CATEGORIAS = {
  'adoracion': 'Adoración',
  'devocionales': 'Devocionales',
  'reflexiones': 'Reflexiones',
  'familia': 'Familia',
  'etica': 'Ética',
  'perseverancia-de-los-santos': 'Perseverancia de los Santos',
  'doctrina': 'Doctrina',
  'doctrinas-de-la-gracia': 'Doctrinas de la Gracia',
  'predestinacion': 'Predestinación',
  'providencia-de-dios': 'Providencia de Dios',
  'teologia': 'Teología',
  'teologia-reformada': 'Teología Reformada',
  'bibliologia': 'Bibliología',
  'teologia-propia': 'Teología Propia (Dios)',
  'angelologia': 'Angelología',
  'antropologia': 'Antropología',
  'hamartiologia': 'Hamartiología (Pecado)',
  'cristologia': 'Cristología',
  'soteriologia': 'Soteriología',
  'pneumatologia': 'Pneumatología',
  'eclesiologia': 'Eclesiología',
  'escatologia': 'Escatología',
  'historia-de-la-iglesia': 'Historia de la Iglesia',
  'la-reforma': 'La Reforma',
  'misiones': 'Misiones',
  'hermeneutica': 'Hermenéutica',
  'catequesis': 'Catequesis',
  'apologetica': 'Apologética',
  'evangelio': 'Evangelio'
};

const TONOS = [
  { valor: 'expositivo', emoji: '📖', nombre: 'Expositivo' },
  { valor: 'apologético', emoji: '🛡️', nombre: 'Apologético' },
  { valor: 'devocional', emoji: '🙏', nombre: 'Devocional' },
  { valor: 'pastoral', emoji: '⛪', nombre: 'Pastoral' },
  { valor: 'académico', emoji: '🎓', nombre: 'Académico' },
  { valor: 'evangelístico', emoji: '✝️', nombre: 'Evangelístico' }
];

const AUDIENCIAS = [
  { valor: 'general', nombre: 'Cristiano en general' },
  { valor: 'nuevo-creyente', nombre: 'Nuevo creyente' },
  { valor: 'buscador', nombre: 'Buscador / No creyente' },
  { valor: 'estudiante-teologia', nombre: 'Estudiante de teología' },
  { valor: 'lider', nombre: 'Líder / Pastor' }
];

/**
 * Inicializa los elementos del formulario al cargar la página
 */
document.addEventListener('DOMContentLoaded', () => {
  inicializarCategorias();
  inicializarTonos();
  inicializarAudiencia();
  cargarConfigWebhook();
});

/**
 * Llena el select de categorías
 */
function inicializarCategorias() {
  const select = document.getElementById('categoria');
  
  const grupos = {
    'Adoración y Vida Cristiana': ['adoracion', 'devocionales', 'reflexiones', 'familia', 'etica', 'perseverancia-de-los-santos'],
    'Doctrina y Teología': ['doctrina', 'doctrinas-de-la-gracia', 'predestinacion', 'providencia-de-dios', 'teologia', 'teologia-reformada'],
    'Teología Sistemática': ['bibliologia', 'teologia-propia', 'angelologia', 'antropologia', 'hamartiologia', 'cristologia', 'soteriologia', 'pneumatologia', 'eclesiologia', 'escatologia'],
    'Historia e Iglesia': ['historia-de-la-iglesia', 'la-reforma', 'misiones'],
    'Estudio Bíblico': ['hermeneutica', 'catequesis', 'apologetica', 'evangelio']
  };

  Object.entries(grupos).forEach(([grupo, slugs]) => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = grupo;
    
    slugs.forEach(slug => {
      const option = document.createElement('option');
      option.value = slug;
      option.textContent = CATEGORIAS[slug];
      optgroup.appendChild(option);
    });
    
    select.appendChild(optgroup);
  });
}

/**
 * Crea el grid de tonos
 */
function inicializarTonos() {
  const grid = document.getElementById('toneGrid');
  
  TONOS.forEach((tono, index) => {
    const div = document.createElement('div');
    div.className = 'tone-option';
    
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'tono';
    input.id = `tono-${tono.valor}`;
    input.value = tono.valor;
    if (index === 0) input.checked = true;
    
    const label = document.createElement('label');
    label.htmlFor = `tono-${tono.valor}`;
    label.textContent = `${tono.emoji} ${tono.nombre}`;
    
    div.appendChild(input);
    div.appendChild(label);
    grid.appendChild(div);
  });
}

/**
 * Llena el select de audiencia
 */
function inicializarAudiencia() {
  const select = document.getElementById('audiencia');
  
  AUDIENCIAS.forEach((aud, index) => {
    const option = document.createElement('option');
    option.value = aud.valor;
    option.textContent = aud.nombre;
    select.appendChild(option);
  });
}

/**
 * Obtiene el tono seleccionado
 */
function getTono() {
  return document.querySelector('input[name="tono"]:checked').value;
}

/**
 * Obtiene todos los datos del formulario
 */
function obtenerDatosFormulario() {
  return {
    categoria: document.getElementById('categoria').value,
    tema: document.getElementById('tema').value.trim(),
    tono: getTono(),
    audiencia: document.getElementById('audiencia').value,
    longitud: document.getElementById('longitud').value,
    referencias: document.getElementById('referencias').value.trim(),
    instrucciones: document.getElementById('instrucciones').value.trim()
  };
}

/**
 * Envía la solicitud al backend para generar el artículo
 */
async function generarArticulo() {
  const btn = document.querySelector('.btn-generate');
  const spinner = document.getElementById('loadingSpinner');
  const outputCard = document.getElementById('outputCard');
  const errorMsg = document.getElementById('errorMsg');

  btn.disabled = true;
  spinner.classList.add('visible');
  outputCard.classList.remove('visible');
  errorMsg.classList.remove('visible');

  try {
    const datos = obtenerDatosFormulario();

    const response = await fetch(`${API_BASE}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Error HTTP ${response.status}`);
    }

    const resultado = await response.json();
    mostrarResultado(resultado);

  } catch (err) {
    console.error('Error:', err);
    errorMsg.textContent = '⚠️ ' + err.message;
    errorMsg.classList.add('visible');
  } finally {
    btn.disabled = false;
    spinner.classList.remove('visible');
  }
}

/**
 * Muestra el resultado en la tarjeta de salida
 */
function mostrarResultado(datos) {
  datosGenerados = datos;
  
  // Enviar al webhook si está configurado
  if (webhookConfig.enabled && webhookConfig.url) {
    enviarAlWebhook(datos);
  }

  // Artículo
  document.getElementById('articuloTitulo').textContent = datos.titulo;
  const categoriaText = CATEGORIAS[datos.metadatos.categoria];
  const tono = datos.metadatos.tono;
  document.getElementById('articuloMeta').textContent = 
    `${categoriaText.toUpperCase()} · Tono: ${tono} · Reformado · Calvinista · Posmilenialista`;

  // Formatear cuerpo del artículo
  let cuerpoHTML = '';
  const partes = datos.articulo.split('##SECCION##');
  partes.forEach((parte, i) => {
    if (i === 0) {
      cuerpoHTML += parte.replace(/\n/g, '<br>');
    } else {
      const lineas = parte.split('\n');
      const titulo = lineas.shift();
      cuerpoHTML += `<h2>${titulo}</h2>` + lineas.join('\n').replace(/\n/g, '<br>');
    }
  });
  document.getElementById('articuloCuerpo').innerHTML = cuerpoHTML;

  // Prompt imagen y URL
  document.getElementById('promptImagen').textContent = datos.prompt_imagen || 'Sin prompt de imagen';
  
  // Si hay imagen generada, mostrarla
  if (datos.imagen_url) {
    const imagenContainer = document.getElementById('imagenGenerada');
    if (imagenContainer) {
      imagenContainer.innerHTML = `
        <div style="text-align: center; margin: 20px 0;">
          <img src="${datos.imagen_url}" 
               alt="${datos.titulo}" 
               style="max-width: 100%; height: auto; border-radius: 3px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
          <p style="font-size: 0.85rem; color: #8a6a30; margin-top: 10px;">
            Generada con DALL-E 3 por OpenAI
          </p>
        </div>
      `;
    }
  }

  // JSON completo
  document.getElementById('jsonCompleto').textContent = JSON.stringify(datos, null, 2);

  // Mostrar tarjeta de salida
  document.getElementById('outputCard').classList.add('visible');
  document.getElementById('outputCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  switchTab('articulo', document.querySelector('.output-tab'));
}

/**
 * Cambia la pestaña visible
 */
function switchTab(tab, el) {
  document.querySelectorAll('.output-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.output-pane').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('pane-' + tab).classList.add('active');
}

/**
 * Copia texto al portapapeles
 */
function copiarTexto(id) {
  let texto = '';
  
  if (id === 'articuloCompleto') {
    texto = `# ${datosGenerados.titulo}\n\n${datosGenerados.articulo.replace(/##SECCION##/g, '\n## ').replace(/\\n/g, '\n')}`;
  } else if (id === 'promptImagen') {
    texto = datosGenerados.prompt_imagen;
  }
  
  navigator.clipboard.writeText(texto).then(() => {
    const btn = event.target;
    const original = btn.textContent;
    btn.textContent = '✓ Copiado';
    setTimeout(() => btn.textContent = original, 2000);
  }).catch(err => {
    console.error('Error al copiar:', err);
    alert('No se pudo copiar al portapapeles');
  });
}

/**
 * Copia el contenido de un elemento al portapapeles
 */
function copiarElemento(id) {
  const texto = document.getElementById(id).textContent;
  
  navigator.clipboard.writeText(texto).then(() => {
    const btn = event.target;
    const original = btn.textContent;
    btn.textContent = '✓ Copiado';
    setTimeout(() => btn.textContent = original, 2000);
  }).catch(err => {
    console.error('Error al copiar:', err);
    alert('No se pudo copiar al portapapeles');
  });
}

/**
 * WEBHOOK FUNCTIONS
 */

/**
 * Carga la configuración del webhook desde localStorage
 */
function cargarConfigWebhook() {
  const stored = localStorage.getItem('webhookConfig');
  if (stored) {
    webhookConfig = JSON.parse(stored);
    document.getElementById('webhookToggle').checked = webhookConfig.enabled;
    document.getElementById('webhookUrl').value = webhookConfig.url || '';
    
    if (webhookConfig.enabled) {
      document.getElementById('webhookInputs').style.display = 'block';
    }
  }
}

/**
 * Guarda la configuración del webhook en localStorage
 */
function guardarConfigWebhook() {
  const url = document.getElementById('webhookUrl').value.trim();
  
  if (url && !validarURL(url)) {
    mostrarEstadoWebhook('URL inválida. Verifica el formato.', 'error');
    return;
  }
  
  webhookConfig.url = url;
  localStorage.setItem('webhookConfig', JSON.stringify(webhookConfig));
  
  if (url) {
    mostrarEstadoWebhook('✓ Configuración guardada correctamente', 'success');
  }
}

/**
 * Toggle para activar/desactivar webhook
 */
function toggleWebhook() {
  const toggle = document.getElementById('webhookToggle');
  const inputs = document.getElementById('webhookInputs');
  
  webhookConfig.enabled = toggle.checked;
  
  if (webhookConfig.enabled) {
    inputs.style.display = 'block';
    if (!webhookConfig.url) {
      document.getElementById('webhookUrl').focus();
    }
  } else {
    inputs.style.display = 'none';
  }
  
  localStorage.setItem('webhookConfig', JSON.stringify(webhookConfig));
}

/**
 * Valida que una URL sea válida
 */
function validarURL(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Muestra el estado del webhook
 */
function mostrarEstadoWebhook(mensaje, tipo) {
  const statusDiv = document.getElementById('webhookStatus');
  statusDiv.textContent = mensaje;
  statusDiv.className = 'webhook-status ' + tipo;
  statusDiv.style.display = 'block';
  
  if (tipo === 'success') {
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
}

/**
 * Envía los datos del artículo al webhook
 */
async function enviarAlWebhook(datos) {
  if (!webhookConfig.enabled || !webhookConfig.url) {
    return;
  }
  
  try {
    const payload = {
      tipo: 'articulo_generado',
      timestamp: new Date().toISOString(),
      titulo: datos.titulo,
      slug: datos.slug,
      categoria: datos.metadatos.categoria,
      tono: datos.metadatos.tono,
      audiencia: datos.metadatos.audiencia,
      longitud: datos.metadatos.longitud,
      extracto: datos.extracto,
      articulo_preview: datos.articulo.substring(0, 500) + '...',
      imagen_url: datos.imagen_url,
      prompt_imagen: datos.prompt_imagen,
      metadatos_completos: datos.metadatos
    };
    
    const response = await fetch(webhookConfig.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      console.log('✓ Datos enviados al webhook de n8n');
      mostrarEstadoWebhook('✓ Datos enviados a n8n', 'success');
    } else {
      console.error('Error al enviar al webhook:', response.status);
      mostrarEstadoWebhook('⚠ Error al enviar a n8n: ' + response.status, 'error');
    }
  } catch (error) {
    console.error('Error enviando al webhook:', error);
    mostrarEstadoWebhook('⚠ Error de conexión con webhook', 'error');
  }
}

/* ========== FUNCIONES DE DONACIONES ========== */

/**
 * Abre/cierra el modal de donaciones
 */
function toggleDonations() {
  const modal = document.getElementById('donationsModal');
  modal.classList.toggle('active');
}

/**
 * Cierra el modal de donaciones
 */
function closeDonations() {
  const modal = document.getElementById('donationsModal');
  modal.classList.remove('active');
}

/**
 * Alterna entre métodos de donación (Bitcoin/PayPal)
 */
function toggleMethod(method, headerElement) {
  const content = document.getElementById(method + '-content');
  const arrow = headerElement.querySelector('.method-arrow');
  
  // Cierra otros métodos
  const allMethods = document.querySelectorAll('.donation-method');
  allMethods.forEach(m => {
    const otherContent = m.querySelector('.method-content');
    const otherArrow = m.querySelector('.method-arrow');
    
    if (otherContent !== content) {
      otherContent.style.display = 'none';
      otherArrow.classList.remove('active');
    }
  });
  
  // Alterna el método actual
  if (content.style.display === 'none') {
    content.style.display = 'block';
    arrow.classList.add('active');
  } else {
    content.style.display = 'none';
    arrow.classList.remove('active');
  }
}

/**
 * Cierra el modal al hacer click fuera
 */
document.addEventListener('click', (event) => {
  const modal = document.getElementById('donationsModal');
  if (modal && event.target === modal) {
    closeDonations();
  }
});

/**
 * Cierra el modal con tecla ESC
 */
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeDonations();
  }
});
