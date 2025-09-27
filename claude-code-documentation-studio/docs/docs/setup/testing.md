---
sidebar_position: 5
---

# Testing del Sistema

> Prueba completa del sistema de documentación automática desde cambios de código hasta notificaciones en Discord.

## ¿Qué vamos a probar?

El flujo completo:
1. **Cambio de código** → 2. **PR creado** → 3. **Workflow ejecuta** → 4. **Agente actualiza docs** → 5. **PR docs creado** → 6. **Discord notifica**

## Pre-requisitos

Antes de probar, verifica que tienes configurado:

- ✅ **Agente Docusaurus Expert** instalado
- ✅ **Workflow de GitHub Actions** creado
- ✅ **Secretos configurados** (ANTHROPIC_API_KEY, DISCORD_WEBHOOK_URL)
- ✅ **Permisos de GitHub Actions** habilitados

## Prueba 1: Test completo

### 1. Crear función de ejemplo

Crea un archivo nuevo con una función documentada:

```javascript title="src/userApi.js"
/**
 * Obtiene información del perfil de usuario
 * @param {string} userId - ID del usuario
 * @param {Object} options - Opciones adicionales
 * @param {boolean} options.includeAvatar - Incluir URL del avatar
 * @returns {Promise<Object>} Datos del perfil del usuario
 */
export async function getUserProfile(userId, options = {}) {
  const { includeAvatar = false } = options;

  try {
    const response = await fetch(`/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const userData = await response.json();

    return {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      ...(includeAvatar && { avatar: userData.avatar_url })
    };
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    throw error;
  }
}

function getToken() {
  return localStorage.getItem('authToken');
}
```

### 2. Crear PR para activar workflow

```bash
# Crear rama nueva
git checkout -b feature/user-profile-api

# Agregar archivo
git add src/userApi.js

# Commit con mensaje descriptivo
git commit -m "feat: add getUserProfile API function

- Obtiene información del perfil de usuario
- Soporte para incluir avatar opcional
- Manejo de errores robusto
- Autenticación con Bearer token"

# Push a GitHub
git push origin feature/user-profile-api

# Crear PR (usando GitHub CLI o web interface)
gh pr create \
  --title "✨ Add User Profile API" \
  --body "Nueva API para obtener perfiles de usuario con soporte para avatar opcional"
```

### 3. Monitorear ejecución

1. **Ve a GitHub Actions** en tu repositorio
2. **Busca** el workflow "Documentación Automática"
3. **Haz click** en la ejecución en progreso
4. **Observa cada paso**:
   - ✅ Checkout repository
   - ✅ Instalar agente
   - ✅ Crear hook Discord
   - ✅ Detectar cambios
   - ✅ Ejecutar agente
   - ✅ Crear PR
   - ✅ Notificar Discord

### 4. Verificar resultados

**Documentación creada:**
- Nuevo PR con título "📚 Docs actualizadas automáticamente"
- Archivo de documentación para la API (ej: `docs/api/user-profile.md`)
- Ejemplos de código y descripción de parámetros

**Notificación Discord:**
- Mensaje con embed rico en tu canal
- Lista de archivos cambiados
- Link al PR de documentación

## Prueba 2: Actualización de función existente

### 1. Modificar función existente

```javascript title="src/userApi.js"
// Agregar al final del archivo
/**
 * Actualiza el perfil de usuario
 * @param {string} userId - ID del usuario
 * @param {Object} profileData - Datos a actualizar
 * @param {string} profileData.username - Nuevo nombre de usuario
 * @param {string} profileData.email - Nuevo email
 * @param {File} profileData.avatar - Nueva imagen de avatar
 * @returns {Promise<Object>} Perfil actualizado
 */
export async function updateUserProfile(userId, profileData) {
  const formData = new FormData();

  // Agregar datos al FormData
  Object.keys(profileData).forEach(key => {
    if (profileData[key] !== undefined) {
      formData.append(key, profileData[key]);
    }
  });

  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    throw error;
  }
}
```

### 2. Commitear cambio

```bash
# Agregar cambios
git add src/userApi.js

# Commit
git commit -m "feat: add updateUserProfile function

- Permite actualizar datos del perfil
- Soporte para subir avatar
- Usa FormData para multipart upload"

# Push
git push origin feature/user-profile-api
```

### 3. Verificar actualización

El workflow debería:
- Detectar el cambio en `src/userApi.js`
- Actualizar la documentación existente
- Agregar la nueva función a la documentación
- Mantener formato consistente

## Prueba 3: Verificar exclusiones

### 1. Cambio que NO debe activar workflow

```bash
# Cambiar solo documentación (debe ser ignorado)
echo "# Cambio en docs" >> docs/readme.md
git add docs/readme.md
git commit -m "docs: update readme"
git push

# Cambiar configuración (debe ser ignorado si está en exclusiones)
echo "// comentario" >> package.json
git add package.json
git commit -m "chore: update package.json"
git push
```

### 2. Verificar que NO se ejecuta

- No debe aparecer nuevo workflow en GitHub Actions
- No debe crearse PR de documentación
- No debe enviarse notificación a Discord

## Validación de calidad

### ✅ Checklist de éxito

**Agente funcionando:**
- [ ] Detecta nuevas funciones automáticamente
- [ ] Crea documentación con formato correcto
- [ ] Incluye ejemplos de código funcionales
- [ ] Mantiene estructura de navegación actualizada

**Workflow robusto:**
- [ ] Se ejecuta solo con tipos de archivo correctos
- [ ] Maneja errores sin fallar completamente
- [ ] Crea PRs con información descriptiva
- [ ] Excluye cambios en documentación para evitar loops

**Discord notificaciones:**
- [ ] Llegan mensajes a canal correcto
- [ ] Formato de embed es claro y útil
- [ ] Incluye links funcionales al PR
- [ ] No spam excesivo de notificaciones

**Documentación generada:**
- [ ] APIs documentadas completamente
- [ ] Ejemplos de código correctos
- [ ] Parámetros y tipos especificados
- [ ] Estilo consistente con docs existentes

## Troubleshooting rápido

### Workflow no se ejecuta

```bash
# Verificar triggers del workflow
cat .github/workflows/docusaurus-auto-docs.yml | grep -A 10 "on:"

# Verificar archivos cambiados
git diff --name-only HEAD~1
```

### Agente no genera docs

```bash
# Verificar logs del workflow
# GitHub → Actions → Workflow → "Ejecutar agente"

# Verificar que ANTHROPIC_API_KEY está configurado
# GitHub → Settings → Secrets
```

### Discord no notifica

```bash
# Probar webhook manualmente
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test"}'

# Verificar DISCORD_WEBHOOK_URL en secretos
```

### Documentación de mala calidad

```bash
# Revisar prompt del agente en workflow
# Agregar más contexto específico del proyecto
# Mejorar ejemplos en el prompt
```

## Métricas de éxito

Después de 1 semana de uso:

- **Cobertura**: 90%+ de nuevas funciones documentadas automáticamente
- **Precisión**: 80%+ de documentación generada requiere mínimas ediciones
- **Velocidad**: Documentación lista en menos de 5 minutos después del PR
- **Adopción**: Equipo revisa y aprueba docs automáticas regularmente

## Optimización continua

### Mejorar prompts del agente

```yaml
# En el workflow, agregar más contexto
prompt: |
  Contexto del proyecto: [Tu descripción específica]

  Estilo preferido: [Tu guía de estilo]

  Ejemplos de buena documentación: [Links a ejemplos]
```

### Ajustar exclusiones

```yaml
# Excluir más tipos de archivos si es necesario
paths:
  - '!tests/**'
  - '!*.config.js'
  - '!*.json'
```

### Personalizar notificaciones

```python
# Diferentes formatos según el día/hora
# Menciones específicas por tipo de cambio
# Resúmenes semanales de actividad
```

## ¡Sistema listo!

Si todas las pruebas pasan, tu sistema de documentación automática está funcionando correctamente. Tu equipo ahora puede:

- **Codificar** sin preocuparse por documentación manual
- **Recibir notificaciones** automáticas de cambios
- **Revisar** documentación generada antes de aprobar
- **Mantener** docs siempre actualizadas con el código

---

*¡Felicidades! Has implementado exitosamente un sistema completo de documentación automática con Claude Code.*