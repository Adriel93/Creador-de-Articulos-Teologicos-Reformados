# 📁 Estructura del Proyecto

## Árbol de Directorios

```
proyecto-blog/
│
├── 📂 api/
│   └── index.js                    # Servidor Express y API endpoints
│       ├── POST /api/generate      # Genera artículo desde formulario
│       ├── POST /api/webhook       # Webhook para n8n/Zapier
│       ├── GET /api/categories     # Lista categorías
│       └── GET /api/config         # Configuración disponible
│
├── 📂 public/                       # Archivos estáticos servidos por Vercel
│   ├── index.html                  # Interfaz HTML principal
│   ├── 📂 css/
│   │   └── styles.css              # Estilos CSS (separado)
│   └── 📂 js/
│       └── app.js                  # Lógica JavaScript frontend
│
├── 📂 .github/
│   └── 📂 workflows/
│       └── deploy.yml              # CI/CD para GitHub Actions
│
├── 📄 package.json                 # Dependencias Node.js
├── 📄 .env.example                 # Plantilla variables de entorno
├── 📄 .env                         # Variables de entorno (NO en git)
├── 📄 .gitignore                   # Archivos a ignorar en git
├── 📄 vercel.json                  # Configuración para Vercel
├── 📄 README.md                    # Documentación principal
├── 📄 WEBHOOK.md                   # Guía de integración webhook
├── 📄 GUIA_PRODUCCION.md           # Guía paso a paso deployment
├── 📄 ARQUITECTURA.md              # Este archivo
├── 📄 examples.js                  # Ejemplos de uso de API
├── 📄 init.sh                      # Script de inicialización rápida
└── 📄 SEGURIDAD.md                 # Buenas prácticas de seguridad
```

## Descripción Detallada

### 1. `/api/index.js`
**Servidor backend principal**

Responsabilidades:
- Servir contenido estático (`public/`)
- Procesar POST a `/api/generate` (llamadas del frontend)
- Procesar POST a `/api/webhook` (llamadas de n8n/externos)
- Validar datos de entrada
- Llamar a OpenAI GPT-4 Turbo API para generar texto
- Llamar a OpenAI DALL-E 3 API para generar imágenes
- Procesar y formatear respuesta
- Devolver JSON estructurado al frontend
- Parsear y retornar JSON

Flujo de datos:
```
Request HTML/JS → Express → Validación → OpenAI API → JSON → Response
```

### 2. `/public/index.html`
**Interfaz de usuario**

Características:
- Formulario con categorías, tonos, audiencias
- Interfaz responsiva (móvil y desktop)
- Diseño estético reformado clásico
- Tabs para mostrar artículo/imagen/JSON

NO contiene:
- ❌ Llamadas directas a OpenAI
- ❌ Lógica de validación compleja
- ❌ Manejo de API keys

### 3. `/public/css/styles.css`
**Estilos CSS separados**

Ventajas:
- Caché de navegador
- Reutilizable en otros proyectos
- Fácil de mantener
- CDN-friendly

Variables CSS usadas:
- `--ink`, `--parchment`, `--gold`, `--crimson`
- Gradientes y sombras personalizadas

### 4. `/public/js/app.js`
**Lógica JavaScript frontend**

Responsabilidades:
- Inicializar formulario con datos del servidor
- Validación básica en cliente
- Llamadas a `/api/generate`
- Mostrar/ocultar elementos dinámicamente
- Copiar texto al portapapeles

NO contiene:
- ❌ Claves de API
- ❌ Lógica de negocio pesada
- ❌ Acceso directo a terceros

### 5. `package.json`
**Definición del proyecto Node.js**

Dependencias principales:
- `express` - Servidor web
- `cors` - Control de acceso cross-origin
- `dotenv` - Cargar variables de entorno
- `openai` - SDK oficial de OpenAI

Scripts:
- `npm start` - Inicia servidor en puerto 3000
- `npm run dev` - Alias para start

### 6. `.env` / `.env.example`
**Variables de entorno**

`.env.example` (versionado):
```
OPENAI_API_KEY=your_api_key_here
PORT=3000
WEBHOOK_SECRET=your_webhook_secret_here
```

`.env` (NO versionado, personal):
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
PORT=3000
WEBHOOK_SECRET=mi-secreto-123
```

### 7. `.gitignore`
**Archivos a no versionear**

Excluye:
- `node_modules/` - Pesado, se regenera con npm install
- `.env` - Contiene secretos
- `.vercel/` - Configuración local de Vercel
- Logs y compilados

### 8. `vercel.json`
**Configuración de Vercel**

Define:
- Funciones serverless
- Rutas públicas
- Timeouts
- Variables de producción

```json
{
  "functions": {
    "api/index.js": {
      "maxDuration": 60,
      "memory": 1024
    }
  }
}
```

### 9. `README.md`
**Documentación principal**

Cubre:
- Descripción del proyecto
- Inicio rápido
- API endpoints
- Deployment en Vercel
- Categorías/tonos/audiencias

### 10. `WEBHOOK.md`
**Guía de integración**

Incluye:
- Configuración en n8n
- Ejemplos de payloads
- Troubleshooting
- Flujos recomendados
- Curl examples

### 11. `GUIA_PRODUCCION.md`
**Paso a paso para deploy**

Cubre:
- Setup local
- GitHub init
- Vercel deployment
- Variables de entorno
- Monitoreo
- Seguridad
- Troubleshooting

### 12. `examples.js`
**Scripts de ejemplo**

Proporciona:
- 5 ejemplos de uso de la API
- Funciones listas para ejecutar
- Manejo de errores
- Output formateado

Ejecutar:
```bash
npm start  # en otra terminal
node examples.js
```

### 13. `.github/workflows/deploy.yml`
**Automatización CI/CD**

Acciones:
- Ejecutar en cada push a `main`
- Instalar dependencias
- Verificar sintaxis
- Deploy automático a Vercel

### 14. `init.sh`
**Script de configuración rápida**

Realiza:
- Verifica Node.js/npm
- Instala dependencias
- Crea `.env` desde ejemplo
- Da instrucciones siguientes

Uso:
```bash
chmod +x init.sh
./init.sh
```

## Flujo de Datos

### 1. Usuario carga página
```
Usuario abre https://mi-blog.vercel.app
    ↓
Vercel sirve public/index.html
    ↓
Carga public/css/styles.css
    ↓
Carga public/js/app.js
    ↓
app.js hace GET /api/config
    ↓
Backend retorna tonos, audiencias, categorías
    ↓
Formulario se rellena dinámicamente
```

### 2. Usuario genera artículo
```
Usuario rellena formulario y clickea "Generar"
    ↓
app.js valida datos
    ↓
POST a /api/generate con JSON
    ↓
Backend en api/index.js valida
    ↓
Llama a OpenAI GPT-4 Turbo y DALL-E 3 APIs
    ↓
Parsea respuesta JSON
    ↓
Retorna resultado a frontend
    ↓
app.js muestra artículo en output-card
    ↓
Usuario puede copiar, ver imagen, JSON
```

### 3. Webhook externo (n8n)
```
Usuario rellena formulario en n8n
    ↓
n8n hace POST a /api/webhook
    ↓
Incluye X-Webhook-Secret header
    ↓
Backend valida secreto
    ↓
Genera artículo (mismo proceso)
    ↓
n8n recibe JSON
    ↓
n8n puede:
   - Generar imagen
   - Crear post WordPress
   - Enviar email
   - Guardar en BD
```

## Decisiones Arquitectónicas

### ✅ Por qué esta estructura

| Decisión | Razón |
|----------|-------|
| Express.js | Ligero, rápido, perfecto para Vercel |
| Vercel serverless | Escalable, bajo costo, CI/CD integrado |
| API separada | Seguridad (API key no en cliente) |
| CSS separado | Caché, rendimiento, mantenibilidad |
| JS vanilla | Sin dependencias frontend innecesarias |
| .env | Secretos seguros, no en versionado |
| Webhook | Integración con sistemas externos |

### ❌ Lo que evitamos

| Lo que NO | Por qué |
|-----------|---------|
| Next.js/nuxt | Overkill para este caso |
| MongoDB | Complicación innecesaria al inicio |
| Autenticación | Pensada para después |
| Base de datos | MVP sin requisito |
| TypeScript | Complejidad sin necesidad ahora |
| Docker | Vercel no lo requiere |

## Escalabilidad Futura

### Cuando crezcas, agrega:

```
1. Base de datos (MongoDB/PostgreSQL)
   ├── Tabla: usuarios
   ├── Tabla: artículos generados
   └── Tabla: logs de API

2. Autenticación
   ├── JWT tokens
   ├── Refresh tokens
   └── Session management

3. Caché
   ├── Redis para respuestas frecuentes
   └── Cache headers HTTP

4. Rate limiting
   ├── Por IP
   ├── Por usuario
   └── Por webhook

5. Monitoreo
   ├── Sentry para errores
   ├── LogRocket para analítica
   └── Prometheus para métricas

6. Testing
   ├── Jest para unitarios
   ├── Supertest para API
   └── Puppeteer para E2E
```

---

## 📝 Resumen

Esta arquitectura es:
- **Simple** ✓ Fácil de entender
- **Segura** ✓ API key en backend
- **Escalable** ✓ Vercel maneja crecimiento
- **Mantenible** ✓ Código bien organizado
- **Desplegable** ✓ Listo para producción

¡Perfecta para un MVP que luego crece!

✝️ **Soli Deo Gloria**