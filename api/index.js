import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

// Soportar .env.local para testing
dotenv.config({ path: '.env.local' });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// Constantes
const SYSTEM_PROMPT_BASE = `Eres un teólogo y escritor cristiano reformado, calvinista y posmilenialista. 
Escribes artículos para un blog de teología reformada en español latinoamericano.

PRINCIPIOS DOCTRINALES INAMOVIBLES:
- Soberanía absoluta de Dios en todos los aspectos de la existencia
- Las cinco solas de la Reforma: Sola Scriptura, Sola Gratia, Sola Fide, Solus Christus, Soli Deo Gloria
- Los cinco puntos del Calvinismo (TULIP): Depravación total, Elección incondicional, Expiación particular (limitada), Gracia irresistible, Perseverancia de los santos
- Teología del Pacto: pacto de obras y pacto de gracia
- Posmilenialismo: Cristo reina ahora desde el cielo; el evangelio triunfará y transformará las naciones antes de su segunda venida
- Autoridad de las confesiones históricas reformadas (Westminster, Heidelberg, Belga, Cánones de Dort)
- Rechazo del arminianismo, semipelagianismo, dispensacionalismo y el premilenarismo futurista
- Hermenéutica histórico-gramatical y tipológica
- Énfasis en la santificación, la ley de Dios y la ética reformada (teonomía moderada)

ESTILO DE ESCRITURA:
- Claro, accesible pero con profundidad teológica
- Fundamentado siempre en las Escrituras (citar versículos específicos con libro, capítulo y versículo)
- Referencias a teólogos reformados históricos y contemporáneos cuando sea apropiado
- Evitar jerga teológica sin explicarla
- Estructurado con introducción, desarrollo y conclusión
- Terminar siempre con aplicación práctica a la vida cristiana

FORMATO DE RESPUESTA:
Responde ÚNICAMENTE con JSON válido, sin markdown, sin bloques de código, sin texto adicional.
El JSON debe tener esta estructura exacta:
{
  "titulo": "El título del artículo",
  "slug": "el-slug-del-titulo",
  "extracto": "Resumen de 2-3 oraciones del artículo",
  "articulo": "El cuerpo completo del artículo con saltos de línea representados como \\n y secciones separadas con ##SECCION## seguido del título de la sección"
}`;

/**
 * Genera un prompt para DALL-E basado en el contenido del artículo
 */
async function generarPromptYImagenDalle(titulo, extracto, categoria) {
  const promptGenerador = `Crea un prompt en inglés para generar una imagen evocadora y teológicamente apropiada para un artículo reformado cristiano.

Título del artículo: "${titulo}"
Resumen: "${extracto}"
Categoría: ${CATEGORIAS[categoria]}

El prompt debe:
- Ser en inglés, conciso pero descriptivo (1-2 oraciones)
- Evocar reverencia, meditación y profundidad teológica
- Referenciar estética de la Reforma (arquitectura gótica, símbolos históricos)
- Evitar imágenes de Jesús o la Trinidad (sensibilidad reformada)
- Incluir detalles específicos: iluminación, composición, estilo artístico
- Ser apropiado para el blog de teología reformada

Responde SOLO con el prompt en inglés, sin explicaciones adicionales.`;

  try {
    const promptResponse = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
      messages: [{ role: 'user', content: promptGenerador }],
      max_tokens: 300,
      temperature: 0.7
    });

    const promptImagen = promptResponse.choices[0].message.content.trim();

    // Generar imagen con DALL-E 3
    console.log(`Generando imagen con DALL-E 3 para: ${titulo}`);
    
    const imageResponse = await openai.images.generate({
      model: process.env.OPENAI_IMAGE_MODEL || 'dall-e-3',
      prompt: promptImagen,
      n: 1,
      size: process.env.IMAGE_SIZE || '1024x1024',
      quality: process.env.IMAGE_QUALITY || 'standard',
      style: process.env.IMAGE_STYLE || 'vivid'
    });

    return {
      prompt_imagen: promptImagen,
      imagen_url: imageResponse.data[0].url
    };
  } catch (error) {
    console.error('Error generando imagen:', error);
    return {
      prompt_imagen: `Imagen teológica reformada para: ${titulo}`,
      imagen_url: null,
      error: error.message
    };
  }
}

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

const TONOS = ['expositivo', 'apologético', 'devocional', 'pastoral', 'académico', 'evangelístico'];
const AUDIENCIAS = ['general', 'nuevo-creyente', 'buscador', 'estudiante-teologia', 'lider'];
const LONGITUDES = {
  'corto': '600 palabras aproximadamente',
  'medio': '1200 palabras aproximadamente',
  'largo': '2000 palabras aproximadamente',
  'extenso': '3000 palabras aproximadamente'
};

// Funciones auxiliares
function validarDatos(req) {
  const { categoria, tono, audiencia, longitud } = req.body;
  
  if (!categoria || !CATEGORIAS[categoria]) {
    throw new Error('Categoría inválida');
  }
  if (!tono || !TONOS.includes(tono)) {
    throw new Error('Tono inválido');
  }
  if (!audiencia || !AUDIENCIAS.includes(audiencia)) {
    throw new Error('Audiencia inválida');
  }
  if (!longitud || !LONGITUDES[longitud]) {
    throw new Error('Longitud inválida');
  }
}

function construirUserPrompt(datos) {
  const { categoria, tema, tono, audiencia, referencias, instrucciones, longitud } = datos;
  
  let prompt = `Escribe un artículo para el blog reformado con las siguientes especificaciones:

CATEGORÍA: ${CATEGORIAS[categoria]} (slug: ${categoria})
LONGITUD: ${LONGITUDES[longitud]}
TONO: ${tono}
AUDIENCIA: ${audiencia}`;

  if (tema && tema.trim()) {
    prompt += `\nTEMA ESPECÍFICO: ${tema}`;
  } else {
    prompt += `\nTEMA: Elige un tema relevante, actual y edificante dentro de la categoría "${CATEGORIAS[categoria]}" desde la perspectiva reformada calvinista posmilenialista.`;
  }

  if (referencias && referencias.trim()) {
    prompt += `\nCONFESIONES/REFERENCIAS A INCLUIR: ${referencias}`;
  }
  if (instrucciones && instrucciones.trim()) {
    prompt += `\nINSTRUCCIONES ADICIONALES: ${instrucciones}`;
  }

  prompt += `\n\nRECUERDA: El artículo debe reflejar fielmente la teología reformada, calvinista y posmilenialista. Incluye al menos 5 citas bíblicas específicas. El prompt de imagen debe ser en inglés y describir una imagen evocadora y teológicamente apropiada para el artículo.`;

  return prompt;
}

// Rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

/**
 * POST /api/generate
 * Genera un artículo completo con título, contenido, imagen e instrucciones
 */
app.post('/api/generate', async (req, res) => {
  try {
    validarDatos(req);

    const userPrompt = construirUserPrompt(req.body);

    console.log(`Generando artículo: ${req.body.categoria} - ${req.body.tono}`);

    // Generar artículo con GPT
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_BASE },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 4000,
      temperature: 0.8
    });

    const textoRespuesta = response.choices[0].message.content.trim();

    let parsed;
    try {
      const clean = textoRespuesta.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(clean);
    } catch (e) {
      console.error('Error parseando JSON:', e);
      throw new Error('La IA no devolvió JSON válido');
    }

    // Generar imagen y prompt DALL-E en paralelo
    const { prompt_imagen, imagen_url, error: imagenError } = 
      await generarPromptYImagenDalle(parsed.titulo, parsed.extracto, req.body.categoria);

    // Crear respuesta completa
    const resultado = {
      ...parsed,
      prompt_imagen,
      imagen_url,
      metadatos: {
        categoria: req.body.categoria,
        tono: req.body.tono,
        audiencia: req.body.audiencia,
        longitud: req.body.longitud,
        timestamp: new Date().toISOString(),
        proveedor: 'openai'
      }
    };

    console.log(`✓ Artículo generado: ${parsed.slug}`);

    res.json(resultado);
  } catch (error) {
    console.error('Error en /api/generate:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/webhook
 * Webhook para recibir solicitudes externas y generar artículos
 * Puede ser llamado desde n8n, Zapier, etc.
 */
app.post('/api/webhook', async (req, res) => {
  try {
    // Validar secreto si está configurado
    if (process.env.WEBHOOK_SECRET) {
      const secret = req.headers['x-webhook-secret'];
      if (secret !== process.env.WEBHOOK_SECRET) {
        return res.status(401).json({ error: 'Webhook secret inválido' });
      }
    }

    validarDatos(req);

    const userPrompt = construirUserPrompt(req.body);

    console.log(`[WEBHOOK] Generando artículo: ${req.body.categoria} - ${req.body.tono}`);

    // Generar artículo con GPT
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_BASE },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 4000,
      temperature: 0.8
    });

    const textoRespuesta = response.choices[0].message.content.trim();

    let parsed;
    try {
      const clean = textoRespuesta.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(clean);
    } catch (e) {
      throw new Error('La IA no devolvió JSON válido');
    }

    // Generar imagen con DALL-E
    const { prompt_imagen, imagen_url } = 
      await generarPromptYImagenDalle(parsed.titulo, parsed.extracto, req.body.categoria);

    const resultado = {
      ...parsed,
      prompt_imagen,
      imagen_url,
      metadatos: {
        categoria: req.body.categoria,
        tono: req.body.tono,
        audiencia: req.body.audiencia,
        longitud: req.body.longitud,
        timestamp: new Date().toISOString(),
        webhook: true,
        proveedor: 'openai'
      }
    };

    console.log(`[WEBHOOK] ✓ Artículo procesado: ${parsed.slug}`);

    res.json(resultado);
  } catch (error) {
    console.error('Error en /api/webhook:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/categories
 * Devuelve lista de categorías disponibles
 */
app.get('/api/categories', (req, res) => {
  const categories = Object.entries(CATEGORIAS).map(([slug, label]) => ({
    slug,
    label
  }));
  res.json({ categories });
});

/**
 * GET /api/config
 * Devuelve configuración de opciones disponibles
 */
app.get('/api/config', (req, res) => {
  res.json({
    tonos: TONOS,
    audiencias: AUDIENCIAS,
    longitudes: Object.keys(LONGITUDES)
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🙏 Servidor iniciado en puerto ${PORT}`);
  console.log(`📖 URL: http://localhost:${PORT}`);
  console.log(`🤖 Proveedor: OpenAI (GPT-4 Turbo + DALL-E 3)`);
  console.log(`🔑 API Key configurada: ${process.env.OPENAI_API_KEY ? '✓' : '✗'}`);
  console.log(`\n✝️  Soli Deo Gloria\n`);
});
