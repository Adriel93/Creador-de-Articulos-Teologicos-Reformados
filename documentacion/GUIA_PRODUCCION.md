# 🚀 Guía Completa: Desde Desarrollo a Producción

## 📋 Checklist de Inicio

- [ ] Node.js 20+ instalado
- [ ] Cuenta en OpenAI con API key
- [ ] Cuenta en GitHub (usuario: Adriel93)
- [ ] Cuenta en Vercel (gratis)

## 1️⃣ Desarrollo Local

### Paso 1: Clonar y configurar

```bash
cd proyecto-blog
npm install
cp .env.example .env.local
```

### Paso 2: Configurar `.env.local`

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
PORT=3000
WEBHOOK_SECRET=mi-secreto-super-seguro-123
NODE_ENV=development
```

### Paso 3: Ejecutar en desarrollo

```bash
npm start
```

Abre: `http://localhost:3000`

### Paso 4: Probar API

```bash
node examples.js
```

## 2️⃣ GitHub

### Paso 1: Crear repositorio

```bash
git config --global user.name "Adriel Fernandez"
git config --global user.email "tu-email@ejemplo.com"

git init
git add .
git commit -m "Inicial commit: Generador de artículos reformados con OpenAI"
git branch -M main
git remote add origin https://github.com/Adriel93/Creador-de-Articulos-Teologicos-Reformados.git
git push -u origin main
```

### Paso 2: Agregar archivos importantes

```bash
# Asegúrate de tener estos archivos
ls -la README.md package.json .gitignore .env.example vercel.json
```

### Archivos que NO deben estar en git:
- `.env.local` (solo `.env.example`)
- `node_modules/`
- `.vercel/`

## 3️⃣ Vercel

### Opción A: Deploy desde CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Opción B: Deploy desde UI de Vercel

1. Ir a https://vercel.com/dashboard
2. Clickear "Add New..." → "Project"
3. Seleccionar repositorio de GitHub: `Adriel93/Creador-de-Articulos-Teologicos-Reformados`
4. Vercel autodetecta que es Node.js
5. Configurar variables de entorno:
   - `OPENAI_API_KEY`
   - `WEBHOOK_SECRET`
6. Clickear "Deploy"

### Paso 4: Verificar deployment

```bash
# Ver logs
vercel logs

# Abrir el sitio
vercel --inspect
```

## 4️⃣ Configurar Dominio Personalizado (Opcional)

1. En Vercel → Project Settings → Domains
2. Agregar tu dominio (ej: articulos-reformados.com)
3. Seguir instrucciones de DNS del proveedor

## 5️⃣ Integración con n8n

### Paso 1: Crear webhook en n8n

```
N8N → Workflows → New
  ↓
Add node: Webhook
  • Method: POST
  • Path: /generar
```

### Paso 2: HTTP Request a nuestro API

```
Add node: HTTP Request
  • URL: https://tu-proyecto.vercel.app/api/webhook
  • Method: POST
  • Headers:
    - X-Webhook-Secret: (tu secreto)
  • Body JSON
```

### Paso 3: Procesar respuesta

```
Add node: Set (variables)
  • titulo: {{ $json.titulo }}
  • articulo: {{ $json.articulo }}
  • imagen_url: {{ $json.imagen_url }}
```

## 6️⃣ Monitoreo y Analytics

### Variables a rastrear

```javascript
// Cada vez que se genera un artículo:
{
  timestamp: new Date(),
  categoria: "doctrina",
  tono: "expositivo",
  longitud: "medio",
  error: false,
  responseTime: 23000, // ms
  costoEstimado: 0.09 // USD
}
```

### Logging sugerido

Agregar a `api/index.js`:

```javascript
// Simple logging a archivo
fs.appendFileSync('articulos.log', JSON.stringify({
  timestamp: new Date().toISOString(),
  slug: resultado.slug,
  categoria: datos.categoria,
  costoEstimado: 0.09,
  generatedAt: Date.now()
}) + '\n');
```

## 7️⃣ Correcciones y Mejoras

### Problemas comunes

**Error: "OPENAI_API_KEY no configurada"**
```
Solución: Ir a Vercel → Settings → Environment Variables
Agregar OPENAI_API_KEY con tu clave de OpenAI
```

**Error: "Cannot GET /"**
```
Solución: Revisar que public/index.html existe
Vercel sirve archivos estáticos automáticamente
```

**Timeout de 30 segundos**
```
Solución: La generación de IA es lenta
En Vercel aumenta timeout de función:
vercel.json → functions.api/index.js.maxDuration: 60
```

## 8️⃣ Seguridad en Producción

### Checklist de seguridad

- [ ] `.env.local` no está en git
- [ ] `WEBHOOK_SECRET` es una cadena aleatoria fuerte
- [ ] HTTPS habilitado en Vercel (automático)
- [ ] CORS restringido si es necesario
- [ ] Rate limiting implementado (futuro)
- [ ] Logs encriptados si contienen datos sensibles

### Agregar rate limiting

```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});

app.use('/api/', limiter);
```

## 9️⃣ Actualizaciones Futuras

### Próximas mejoras sugeridas

```bash
# Agregar base de datos
npm install mongoose

# Agregar autenticación
npm install jsonwebtoken bcryptjs

# Agregar compresión
npm install compression

# Agregar logging avanzado
npm install winston

# Agregar validación
npm install joi

# Testing
npm install --save-dev jest supertest
```

## 🔟 Scripts Útiles

```bash
# Desarrollo
npm start

# Testing local
node examples.js

# Cleanup
rm -rf node_modules
npm install --production

# Ver logs en Vercel
vercel logs

# Desplegar a staging
vercel --prod --no-wait

# Desplegar a producción
vercel --prod
```

## 📞 Soporte y Troubleshooting

### Si algo no funciona

1. **Revisar logs en Vercel**
   ```bash
   vercel logs --follow
   ```

2. **Verificar variables de entorno**
   ```bash
   vercel env list
   ```

3. **Rebuild deployment**
   ```bash
   vercel --prod --force
   ```

4. **Check API localmente**
   ```bash
   curl -X POST http://localhost:3000/api/generate \
     -H "Content-Type: application/json" \
     -d '{"categoria":"doctrina","tono":"expositivo","audiencia":"general","longitud":"medio"}'
   ```

## 🎓 Recursos

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Express](https://expressjs.com/)
- [API de OpenAI](https://platform.openai.com/docs)
- [Documentación de n8n](https://docs.n8n.io/)
- [GitHub Docs](https://docs.github.com/)

---

## ✝️ Soli Deo Gloria

Tu sitio está listo para difundir la teología reformada bíblica.

**¡Que Dios bendiga tu trabajo!**

Para preguntas: Consulta el README.md o abre un issue en GitHub.