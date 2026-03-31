# 🚀 Instalación Final - Creador de Artículos con OpenAI

## Estado Actual del Proyecto

Tu proyecto ha sido **completamente migrado de Anthropic a OpenAI** con las siguientes características:

✅ **Text Generation**: GPT-4 Turbo (más rápido que Claude)
✅ **Image Generation**: DALL-E 3 (generación automática de imágenes)
✅ **Backend**: Express.js con Node.js
✅ **Frontend**: HTML5 moderno + JavaScript vanilla
✅ **Deployment**: Listo para Vercel

---

## 📋 Pasos de Instalación

### 1. Preparar la API Key de OpenAI

```bash
# Ir a https://platform.openai.com/account/api-keys
# Crear una nueva API Key
# Copiar: sk-proj-XXXXXXXXXXXXXXXXXXXX
```

### 2. Configurar `.env.local` para Testing Local

Abre el archivo `.env.local` en la raíz del proyecto:

```bash
# Pega tu API Key aquí:
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXX

# El resto de configuración ya tiene valores por defecto:
OPENAI_MODEL=gpt-4-turbo
OPENAI_IMAGE_MODEL=dall-e-3
IMAGE_QUALITY=hd
IMAGE_SIZE=1024x1024
IMAGE_STYLE=natural
```

### 3. Instalar Dependencias

```bash
cd proyecto-blog
npm install
```

### 4. Iniciar el Servidor

```bash
npm start
```

Deberías ver:
```
✓ Servidor ejecutándose en http://localhost:3000
✓ OpenAI API configurada
✓ Generador de artículos listo
```

### 5. Probar en Navegador

- Abre: `http://localhost:3000`
- Selecciona: Categoría, Tema, Tono, Audiencia
- Click: **"Generar Artículo"**
- Espera: ~30-45 segundos (GPT-4 + DALL-E 3)
- Resultado: Artículo + Imagen automática

---

## 🧪 Probar con Node (ejemplos.js)

Para probar la API desde terminal:

```bash
npm run examples
```

Esto ejecutará 5 ejemplos diferentes mostrando:
- Generación de artículos doctrinales
- Artículos devocionales
- Artículos apologéticos
- Obtención de configuración
- Llamadas webhook (como lo haría n8n)

---

## 📊 Costos Estimados

**Por artículo (texto + imagen):**
- Texto (GPT-4 Turbo): ~$0.03-0.05
- Imagen (DALL-E 3): ~$0.04
- **Total: ~$0.09 por artículo**

**Ejemplo:**
- 100 artículos/mes = ~$9
- 1000 artículos/mes = ~$90

---

## 🔧 Customizar Configuración

### Cambiar Modelo de Texto

En `.env.local`, cambia `OPENAI_MODEL`:

```env
# Más rápido y barato:
OPENAI_MODEL=gpt-3.5-turbo

# Más potente:
OPENAI_MODEL=gpt-4

# Recomendado (balance):
OPENAI_MODEL=gpt-4-turbo
```

### Cambiar Calidad de Imagen

```env
# Baja calidad (más rápido):
IMAGE_QUALITY=standard

# Alta calidad (recomendado):
IMAGE_QUALITY=hd
```

### Cambiar Tamaño de Imagen

```env
# Cuadrado (por defecto):
IMAGE_SIZE=1024x1024

# Horizontal (mejor para posts):
IMAGE_SIZE=1792x1024

# Vertical:
IMAGE_SIZE=1024x1792
```

---

## 📁 Estructura de Archivos Importantes

```
proyecto-blog/
├── api/
│   └── index.js              ← Backend con OpenAI
├── public/
│   ├── index.html            ← Frontend UI
│   ├── css/styles.css        ← Estilos
│   └── js/app.js             ← Lógica del navegador
├── .env.local                ← TU API KEY (no compartir)
├── .env.example              ← Plantilla compartible
├── examples.js               ← Ejemplos de uso
├── package.json              ← Dependencias
└── README.md                 ← Documentación completa
```

---

## 🚀 Desplegar a Vercel

### 1. Crear repositorio en GitHub

```bash
git init
git add .
git commit -m "Migración a OpenAI completada"
git branch -M main
git remote add origin https://github.com/Adriel93/Creador-de-Articulos-Teologicos-Reformados.git
git push -u origin main
```

### 2. Conectar Vercel

1. Ir a: https://vercel.com
2. Importar repositorio
3. Agregar variable de entorno: `OPENAI_API_KEY`
4. Deploy

### 3. Webhook para n8n

Tu webhook en Vercel estará en:
```
https://tu-proyecto.vercel.app/api/webhook
```

---

## 🐛 Troubleshooting

### Error: "OPENAI_API_KEY no definido"

**Solución:**
```bash
# Verifica que .env.local existe
ls -la .env.local

# Verifica que tiene tu API key
cat .env.local
```

### Error: "API request failed"

**Posibles causas:**
1. API Key inválida o expirada
2. Cuota de OpenAI excedida
3. Problema de conexión a internet

**Solución:**
- Verifica tu API Key en: https://platform.openai.com/account/api-keys
- Comprueba uso en: https://platform.openai.com/account/billing/usage

### Imagen no se genera

**Posible causa:** DALL-E 3 está ocupado o error de red

**Solución:**
- Intenta de nuevo (esperar 2-3 segundos)
- Verifica logs del servidor: `npm start`

---

## 📚 Documentación Adicional

- **MIGRACION_OPENAI.md** - Detalles técnicos de la migración
- **OPENAI_LOCAL.txt** - Guía rápida para configuración local
- **WEBHOOK.md** - Documentación del webhook para n8n
- **README.md** - Documentación completa del proyecto
- **ARQUITECTURA.md** - Explicación de la arquitectura

---

## ✝️ Próximos Pasos

1. **Configurar `.env.local`** con tu API Key
2. **Ejecutar `npm install`** para descargar dependencias
3. **Ejecutar `npm start`** para iniciar servidor
4. **Abrir `http://localhost:3000`** y probar
5. **Desplegar a Vercel** cuando esté listo
6. **Integrar con n8n** si necesitas automatización

---

## 📞 Soporte

Si encontras errores:

1. Revisa los logs del servidor (`npm start`)
2. Verifica tu API Key de OpenAI
3. Consulta la documentación en los archivos .md
4. Comprueba que tienes fondos en tu cuenta de OpenAI

---

**Hecho con ❤️ para la iglesia reformada. Soli Deo Gloria.**