#!/usr/bin/env node

/**
 * Ejemplos de cómo llamar a la API
 * Ejecutar con: node examples.js
 */

const API_URL = 'http://localhost:3000/api';

/**
 * Ejemplo 1: Generar artículo sobre doctrina
 */
async function ejemplo1_generarArticuloDoctrinal() {
  console.log('\n📖 Ejemplo 1: Artículo doctrinal expositivo\n');

  const datos = {
    categoria: 'doctrina',
    tema: 'Las doctrinas de la gracia en la teología reformada',
    tono: 'expositivo',
    audiencia: 'estudiante-teologia',
    longitud: 'largo',
    referencias: 'Confesión de Westminster, Cánones de Dort',
    instrucciones: 'Incluir análisis de Romanos 9 y Efesios 1'
  };

  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    
    const resultado = await response.json();
    console.log('✓ Artículo generado exitosamente');
    console.log(`📄 Título: ${resultado.titulo}`);
    console.log(`🔗 Slug: ${resultado.slug}`);
    console.log(`⏱️ Tiempo: ${new Date(resultado.metadatos.timestamp).toLocaleString()}`);
    console.log(`🖼️ Imagen: ${resultado.imagen_url ? '✓ Generada con DALL-E 3' : '✗ No disponible'}`);
    if (resultado.imagen_url) {
      console.log(`   URL: ${resultado.imagen_url.substring(0, 50)}...`);
    }
    console.log('\n📝 Primeros 200 caracteres:\n', resultado.articulo.substring(0, 200) + '...\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * Ejemplo 2: Artículo devocional para nuevo creyente
 */
async function ejemplo2_generarArticuloDevocional() {
  console.log('\n🙏 Ejemplo 2: Artículo devocional para nuevo creyente\n');

  const datos = {
    categoria: 'devocionales',
    tema: 'Cómo conocer la voluntad de Dios en mi vida',
    tono: 'devocional',
    audiencia: 'nuevo-creyente',
    longitud: 'medio',
    instrucciones: 'Lenguaje accesible, aplicación práctica inmediata'
  };

  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    
    const resultado = await response.json();
    console.log('✓ Artículo generado exitosamente');
    console.log(`📄 Título: ${resultado.titulo}`);
    console.log(`📋 Extracto: ${resultado.extracto}`);
    console.log(`🖼️ Imagen: ${resultado.imagen_url ? '✓ Generada con DALL-E 3' : '✗ No disponible'}`);
    if (resultado.imagen_url) {
      console.log(`   Prompt usado: ${resultado.prompt_imagen ? resultado.prompt_imagen.substring(0, 80) + '...' : 'No disponible'}`);
    }
    console.log();

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * Ejemplo 3: Artículo apologético breve
 */
async function ejemplo3_generarArticuloApologetico() {
  console.log('\n🛡️ Ejemplo 3: Artículo apologético para buscadores\n');

  const datos = {
    categoria: 'apologetica',
    tema: 'Por qué el calvinismo es bíblico',
    tono: 'apologético',
    audiencia: 'buscador',
    longitud: 'corto',
    referencias: 'Institución de la Religión de Calvino, Cartas de Agustín'
  };

  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    
    const resultado = await response.json();
    console.log('✓ Artículo generado exitosamente');
    console.log(`📄 Título: ${resultado.titulo}`);
    console.log(`👥 Audiencia: ${resultado.metadatos.audiencia}`);
    console.log(`⏱️ Longitud: ${resultado.metadatos.longitud}`);
    console.log(`🖼️ Imagen: ${resultado.imagen_url ? '✓ Generada con DALL-E 3' : '✗ No disponible'}`);
    console.log(`🤖 Proveedor: ${resultado.metadatos.proveedor || 'OpenAI'}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * Ejemplo 4: Obtener configuración disponible
 */
async function ejemplo4_obtenerConfig() {
  console.log('\n⚙️ Ejemplo 4: Obtener configuración\n');

  try {
    const [configRes, catRes] = await Promise.all([
      fetch(`${API_URL}/config`),
      fetch(`${API_URL}/categories`)
    ]);

    if (!configRes.ok || !catRes.ok) throw new Error('Error al obtener config');

    const config = await configRes.json();
    const categorias = await catRes.json();

    console.log('✓ Configuración obtenida\n');
    console.log('🎵 Tonos disponibles:', config.tonos.join(', '));
    console.log('👥 Audiencias:', config.audiencias.join(', '));
    console.log('📏 Longitudes:', config.longitudes.join(', '));
    console.log(`📚 Categorías: ${categorias.categories.length} disponibles`);
    console.log('\nPrimeras 5 categorías:');
    categorias.categories.slice(0, 5).forEach(c => {
      console.log(`  • ${c.label} (${c.slug})`);
    });
    console.log();

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * Ejemplo 5: Llamar al webhook (simular n8n)
 */
async function ejemplo5_llamarWebhook() {
  console.log('\n🔗 Ejemplo 5: Llamar webhook (como lo haría n8n)\n');

  const datos = {
    categoria: 'reforma',
    tema: '',
    tono: 'histórico-pastoral',
    audiencia: 'lider',
    longitud: 'extenso',
    referencias: 'Martín Lutero, Juan Calvino',
    instrucciones: 'Énfasis en las cinco solas de la Reforma'
  };

  try {
    const response = await fetch(`${API_URL}/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': process.env.WEBHOOK_SECRET || ''
      },
      body: JSON.stringify(datos)
    });

    const resultado = await response.json();

    if (!response.ok) {
      console.error('❌ Error:', resultado.error);
      return;
    }

    console.log('✓ Webhook procesado exitosamente');
    console.log(`📄 Artículo generado: ${resultado.titulo}`);
    console.log(`✅ Timestamp: ${resultado.metadatos.timestamp}`);
    console.log(`🔐 Webhook: ${resultado.metadatos.webhook ? 'SÍ' : 'NO'}`);
    console.log(`🖼️ Imagen: ${resultado.imagen_url ? '✓ Generada con DALL-E 3' : '✗ No disponible'}`);
    console.log(`🤖 Proveedor: ${resultado.metadatos.proveedor || 'OpenAI'}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * Ejecutar todos los ejemplos
 */
async function ejecutarTodos() {
  console.log('=========================================');
  console.log('  EJEMPLOS DE USO - Creador de Artículos');
  console.log('=========================================');
  console.log('\n⚠️  Asegúrate de que el servidor esté ejecutándose en puerto 3000');
  console.log('   npm start\n');

  await ejemplo4_obtenerConfig();
  await ejemplo1_generarArticuloDoctrinal();
  await ejemplo2_generarArticuloDevocional();
  await ejemplo3_generarArticuloApologetico();
  await ejemplo5_llamarWebhook();

  console.log('=========================================');
  console.log('  ✝️  Soli Deo Gloria');
  console.log('=========================================\n');
}

// Ejecutar
ejecutarTodos().catch(console.error);
