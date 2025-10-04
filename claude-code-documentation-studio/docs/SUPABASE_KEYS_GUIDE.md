# 🔑 Cómo Obtener las API Keys de Supabase

## Paso 1: Ve a la configuración de API

Navega a:
```
https://supabase.com/dashboard/project/yzwyvangxygkibktnmpq/settings/api
```

## Paso 2: Busca la sección "Project API keys"

En esa página, **baja un poco** hasta encontrar una sección llamada:

```
📦 Project API keys
```

Verás algo como esto:

```
┌─────────────────────────────────────────────────────────────┐
│ Project API keys                                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ anon public                                                  │
│ This key is safe to use in a browser if you have            │
│ enabled Row Level Security for your tables and configured   │
│ policies.                                                    │
│                                                              │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...  │
│ [Reveal] [Copy]                                              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ service_role secret                                          │
│ This key has the ability to bypass Row Level Security.      │
│ Never share it publicly.                                     │
│                                                              │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...  │
│ [Reveal] [Copy]                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Paso 3: Copia la clave "anon public"

1. Haz clic en **"Reveal"** o **"Copy"** en la clave **anon public**
2. ⚠️ **NO copies la clave "service_role"** (es secreta y peligrosa para el frontend)

## Paso 4: Pega la clave en el archivo .env

Edita el archivo `.env` y reemplaza `PEGA_AQUI_TU_ANON_KEY` con la clave que copiaste:

```env
REACT_APP_SUPABASE_URL=https://yzwyvangxygkibktnmpq.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (tu clave completa aquí)
```

## ❓ Si no encuentras la sección "Project API keys"

Puede estar en otras ubicaciones según la versión del dashboard:

### Opción A: Settings > API
```
Dashboard > Settings > API > Project API keys
```

### Opción B: Settings > Configuration
```
Dashboard > Settings > Configuration > API keys
```

### Opción C: Project Settings
```
Dashboard > Project Settings > API
```

## 🎯 Cómo saber si es la clave correcta

La clave **anon public** debe:
- ✅ Empezar con `eyJ`
- ✅ Ser muy larga (cientos de caracteres)
- ✅ Tener puntos (.) separando secciones
- ✅ Decir que es "safe to use in a browser"

## 🚨 Seguridad

- ✅ **SÍ usar**: anon public key → Es segura para el navegador
- ❌ **NO usar**: service_role key → Es privada, solo para backend

## 📞 ¿Necesitas ayuda?

Si no encuentras las claves, también puedes:

1. Ir al **Home** del proyecto
2. Buscar un botón de **"Connect"** o **"API Keys"**
3. O contactar soporte de Supabase

---

Una vez tengas la clave, corre:
```bash
npm start
```
