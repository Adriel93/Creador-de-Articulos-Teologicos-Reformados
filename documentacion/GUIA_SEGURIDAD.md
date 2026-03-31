# 🔒 Guía de Seguridad

## 📋 Principios de Seguridad

Esta aplicación implementa múltiples capas de seguridad para proteger tanto la API de OpenAI como los datos de los usuarios.

## 🛡️ Variables de Entorno

### Variables Sensibles
- `OPENAI_API_KEY`: Nunca se expone al frontend
- `WEBHOOK_SECRET`: Secreto para validación de webhooks
- `NODE_ENV`: Controla comportamiento en desarrollo/producción

### Archivo `.env`
```bash
# ✅ CORRECTO: Variables en .env
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXX
WEBHOOK_SECRET=mi-secreto-super-seguro-123

# ❌ INCORRECTO: Nunca en código
// const apiKey = "sk-proj-XXXXXXXXXXXXXXXXXXXX"; // ¡PELIGRO!
```

## 🔐 Validación de API Keys

### Backend Validation
```javascript
// api/index.js - Validación obligatoria
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY no configurada");
  process.exit(1);
}
```

### Frontend Security
- ❌ No API keys en JavaScript del navegador
- ❌ No llamadas directas a OpenAI desde el cliente
- ✅ Todas las llamadas pasan por el backend

## 🌐 CORS y Control de Acceso

### Configuración CORS
```javascript
// Solo permite orígenes específicos
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://tu-dominio.com']
    : ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'X-Webhook-Secret']
};
```

## 🔑 Webhook Security

### Validación de Secretos
```javascript
// Solo acepta requests con header correcto
const webhookSecret = req.headers['x-webhook-secret'];
if (webhookSecret !== process.env.WEBHOOK_SECRET) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

### Rate Limiting
```javascript
// Previene abuso del webhook
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});
```

## 📊 Logging Seguro

### Qué Loggear
```javascript
// ✅ Información útil para debugging
console.log(`[${timestamp}] Artículo generado: ${categoria}`);

// ❌ NUNCA loggear datos sensibles
// console.log(`API Key: ${process.env.OPENAI_API_KEY}`); // ¡PELIGRO!
```

### Logs en Producción
- Usar servicios como Vercel Logs o Winston
- No incluir API keys o datos personales
- Monitorear errores y uso anormal

## 🚨 Manejo de Errores

### Errores Seguros
```javascript
// ✅ Error genérico para el usuario
catch (error) {
  console.error('Error interno:', error); // Log detallado
  res.status(500).json({
    error: 'Error interno del servidor'
  }); // Respuesta genérica
}
```

### Evitar Data Leaks
- No devolver stack traces al cliente
- No incluir información sensible en errores
- Usar códigos de error genéricos

## 🔒 HTTPS y Certificados

### Vercel Automatic HTTPS
- ✅ SSL automático en todos los dominios
- ✅ Certificados renovados automáticamente
- ✅ HTTP/2 support

### Headers de Seguridad
```javascript
// Headers recomendados
res.setHeader('X-Content-Type-Options', 'nosniff');
res.setHeader('X-Frame-Options', 'DENY');
res.setHeader('X-XSS-Protection', '1; mode=block');
```

## 💰 Control de Costos

### Límites de API
```javascript
// Monitorear uso de OpenAI
const usage = await openai.usage.retrieve();
if (usage.total_tokens > MAX_TOKENS) {
  // Alertar o bloquear
}
```

### Rate Limiting por Usuario
```javascript
// Limitar generación por sesión/IP
const userLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 50, // máximo 50 artículos por hora
  keyGenerator: (req) => req.ip
});
```

## 🛠️ Checklist de Seguridad

### Antes de Deploy
- [ ] `.env` no está en git
- [ ] API keys válidas y con fondos
- [ ] CORS configurado correctamente
- [ ] Webhook secret fuerte y único
- [ ] Rate limiting implementado
- [ ] HTTPS habilitado
- [ ] Logs no contienen datos sensibles

### Monitoreo Continuo
- [ ] Revisar logs regularmente
- [ ] Monitorear uso de API
- [ ] Alertas de errores
- [ ] Actualizaciones de dependencias

## 🚨 Incidentes de Seguridad

### Si se compromete una API key:
1. **Inmediatamente**: Revocar la API key en OpenAI
2. **Generar nueva**: Crear API key nueva
3. **Actualizar**: Cambiar en `.env` y redeploy
4. **Investigar**: Revisar logs para ver uso no autorizado

### Si se filtra el webhook secret:
1. **Cambiar secreto**: Generar nuevo valor aleatorio
2. **Actualizar n8n**: Cambiar en todos los workflows
3. **Redeploy**: Actualizar variable de entorno

## 🔧 Mejores Prácticas

### Gestión de Secrets
- Usar gestores como Vercel Secrets
- Rotar API keys regularmente
- Nunca compartir keys en código o emails

### Actualizaciones
```bash
# Mantener dependencias actualizadas
npm audit
npm update

# Verificar vulnerabilidades
npm audit fix
```

### Backup y Recovery
- Código versionado en Git
- Configuración documentada
- Procedimientos de recuperación claros

---

## ✝️ Seguridad en el Ministerio

Esta aplicación maneja contenido teológico sensible. La seguridad no es solo técnica, sino también una responsabilidad ministerial para proteger la integridad del mensaje reformado.

**"El que es fiel en lo poco, también es fiel en lo mucho"** - Lucas 16:10

---

## 📞 Contacto de Seguridad

Si encuentras vulnerabilidades:
1. No publiques el issue públicamente
2. Contacta directamente al maintainer
3. Espera confirmación antes de disclosure