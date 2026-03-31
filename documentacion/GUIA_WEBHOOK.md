# 🔗 Guía de Integración Webhook

## 📋 Resumen

Esta aplicación incluye un endpoint webhook (`/api/webhook`) diseñado para integrarse con herramientas de automatización como n8n, Zapier, Make (Integromat) y otras plataformas similares.

## 🎯 Endpoint Webhook

### URL
```
POST https://tu-dominio.vercel.app/api/webhook
```

### Headers Requeridos
```
Content-Type: application/json
X-Webhook-Secret: tu-secreto-configurado
```

### Cuerpo de la Solicitud
```json
{
  "categoria": "doctrina",
  "tono": "expositivo",
  "audiencia": "general",
  "longitud": "medio",
  "tituloPersonalizado": "opcional"
}
```

## 🔧 Configuración en n8n

### Paso 1: Crear Workflow
1. Abrir n8n y crear un nuevo workflow
2. Agregar nodo "Webhook"
3. Configurar método POST y path `/generar`

### Paso 2: Configurar HTTP Request
1. Agregar nodo "HTTP Request"
2. Configurar:
   - URL: `https://tu-dominio.vercel.app/api/webhook`
   - Método: POST
   - Headers:
     ```
     X-Webhook-Secret: tu-secreto-super-seguro
     Content-Type: application/json
     ```

### Paso 3: Procesar Respuesta
1. Agregar nodo "Set" para extraer datos
2. Variables disponibles:
   - `titulo`: Título del artículo generado
   - `slug`: Slug URL-friendly
   - `articulo`: Contenido completo del artículo
   - `categoria`: Categoría seleccionada
   - `metadata`: Información adicional

## 📊 Respuesta del Webhook

### Respuesta Exitosa (200)
```json
{
  "success": true,
  "titulo": "La Soberanía de Dios en la Elección",
  "slug": "soberania-dios-eleccion",
  "articulo": "Contenido completo del artículo...",
  "categoria": "doctrina",
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "longitud": "medio",
    "palabras": 850
  }
}
```

### Respuesta de Error (400/500)
```json
{
  "success": false,
  "error": "Descripción del error",
  "codigo": "ERROR_CODE"
}
```

## 🛡️ Seguridad

### Validación de Secretos
- El webhook requiere un header `X-Webhook-Secret`
- El secreto debe coincidir con la variable de entorno `WEBHOOK_SECRET`
- Sin coincidencia: Error 401 Unauthorized

### Rate Limiting
- Implementado para prevenir abuso
- Límite: 100 requests por IP cada 15 minutos
- Configurable en el código backend

## 🔄 Flujos de Automatización Sugeridos

### 1. Generar y Publicar en WordPress
```
Webhook Trigger → Generar Artículo → Crear Post WordPress → Publicar
```

### 2. Generar y Enviar por Email
```
Formulario Web → Generar Artículo → Enviar Email → Guardar en BD
```

### 3. Generar y Crear Imagen
```
Solicitud → Generar Artículo → Generar Imagen con DALL-E → Combinar Contenido
```

## 🧪 Testing del Webhook

### Usando curl
```bash
curl -X POST https://tu-dominio.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: tu-secreto" \
  -d '{
    "categoria": "doctrina",
    "tono": "expositivo",
    "audiencia": "general",
    "longitud": "medio"
  }'
```

### Usando Postman
1. Método: POST
2. URL: `https://tu-dominio.vercel.app/api/webhook`
3. Headers:
   - Content-Type: application/json
   - X-Webhook-Secret: tu-secreto
4. Body: JSON con los parámetros

## 📋 Parámetros Disponibles

| Parámetro | Tipo | Requerido | Valores |
|-----------|------|-----------|---------|
| categoria | string | ✅ | doctrina, apologetica, devocional, pastoral |
| tono | string | ✅ | expositivo, exhortativo, didactico, polemico |
| audiencia | string | ✅ | general, nuevo-creyente, estudiante, pastor |
| longitud | string | ✅ | corto, medio, largo |
| tituloPersonalizado | string | ❌ | Cualquier string |

## 🚨 Manejo de Errores

### Códigos de Error Comunes
- `400`: Datos inválidos
- `401`: Secreto incorrecto
- `429`: Rate limit excedido
- `500`: Error interno del servidor

### Logging
- Todos los requests se loggean
- Incluye timestamp, IP, y resultado
- Útil para debugging y monitoreo

## 🔗 Integraciones Compatibles

- **n8n**: Recomendado, flujos visuales
- **Zapier**: Automatización no-code
- **Make (Integromat)**: Similar a Zapier
- **IFTTT**: Para casos simples
- **Custom scripts**: Python, Node.js, etc.

## 💡 Ejemplos de Uso

### Automatización Semanal
- Programar generación automática de artículos devocionales
- Enviar por email a suscriptores
- Publicar automáticamente en blog

### Integración con CMS
- Generar contenido para WordPress
- Crear posts automáticamente
- Asignar categorías y tags

### Workflow de Revisión
- Generar borrador
- Enviar para revisión humana
- Publicar después de aprobación

---

## ✝️ Soli Deo Gloria

Esta funcionalidad permite automatizar la creación de contenido teológico de calidad, liberando tiempo para el ministerio y la enseñanza directa.