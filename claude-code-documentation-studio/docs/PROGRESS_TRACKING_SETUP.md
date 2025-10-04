# 📊 Progress Tracking Setup Guide

## Overview

El sistema de tracking de progreso registra automáticamente:
- ✅ Visitas a páginas de documentación
- ✅ Progreso por sección (subagents, hooks, workflows)
- ✅ Tiempo invertido en cada página
- ✅ Porcentaje de completitud
- ✅ Dashboard visual en el perfil del usuario

## 🗄️ Configurar Base de Datos en Supabase

### Paso 1: Acceder al SQL Editor

1. Ve a tu proyecto de Supabase
2. Navega a **SQL Editor** en el menú lateral
3. Crea una nueva query

### Paso 2: Ejecutar el Schema

Copia y pega el contenido del archivo `supabase/schema.sql` en el editor SQL y ejecútalo.

O manualmente:

```sql
-- User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_pages INTEGER NOT NULL DEFAULT 0,
  completed_pages INTEGER NOT NULL DEFAULT 0,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, section_id)
);

-- Page Visits Table
CREATE TABLE IF NOT EXISTS page_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL,
  page_id TEXT NOT NULL,
  page_title TEXT,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_spent_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  section_id TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Paso 3: Crear Índices

```sql
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_section_id ON user_progress(section_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_user_id ON page_visits(user_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_page_id ON page_visits(page_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_section_id ON page_visits(section_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
```

### Paso 4: Habilitar RLS (Row Level Security)

```sql
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own page visits"
  ON page_visits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own page visits"
  ON page_visits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Paso 5: Verificar las Tablas

En Supabase, ve a **Table Editor** y verifica que se crearon:
- ✅ `user_progress`
- ✅ `page_visits`
- ✅ `user_achievements`

## 🎯 Cómo Funciona

### Tracking Automático

El sistema rastrea automáticamente cuando un usuario:

1. **Visita una página de docs** → Se registra en `page_visits`
2. **Cambia de página** → Se calcula el tiempo invertido
3. **Completa una sección** → Se actualiza `user_progress`

### Estructura de Secciones

El sistema reconoce estas secciones:

```typescript
{
  subagents: { total_pages: 2 },  // overview + docusaurus-expert
  hooks: { total_pages: 2 },      // overview + discord-notification
  workflows: { total_pages: 1 }   // cicd-workflow
}
```

### Cálculo de Progreso

```
progress_percentage = (completed_pages / total_pages) * 100
```

Ejemplo:
- Usuario visita `/docs/subagents/overview` → 1/2 páginas = 50%
- Usuario visita `/docs/subagents/docusaurus-expert` → 2/2 páginas = 100%

## 📊 Visualización

### Dashboard de Progreso

El usuario ve su progreso en `/profile`:

- **Overall Progress**: Promedio de todas las secciones
- **Sections Completed**: Cuántas secciones al 100%
- **Section Cards**: Progreso individual por sección
- **Last Visited**: Última vez que visitó cada sección

### Componentes

- `ProgressBar` - Barra de progreso visual
- `UserProgressDashboard` - Dashboard completo
- `ProgressContext` - Estado global de progreso

## 🔧 Personalización

### Agregar Nueva Sección

1. Actualiza la configuración en `ProgressContext.tsx`:

```typescript
const SECTIONS = {
  subagents: { total_pages: 2, name: 'Subagents' },
  hooks: { total_pages: 2, name: 'Hooks' },
  workflows: { total_pages: 1, name: 'Workflows' },
  // Nueva sección
  advanced: { total_pages: 3, name: 'Advanced Topics' },
};
```

2. Agrega el color y el icono en `UserProgressDashboard.tsx`:

```typescript
const SECTION_COLORS = {
  // ...existing
  advanced: '#8b5cf6',
};

const SECTION_ICONS = {
  // ...existing
  advanced: '🚀',
};
```

### Modificar Tracking

Para cambiar qué se rastrea, edita `ProgressContext.tsx`:

```typescript
const trackPageVisit = useCallback(async (
  pageId: string,
  sectionId: string,
  pageTitle?: string
) => {
  // Agrega lógica personalizada aquí
}, [user, loadUserProgress]);
```

## 🎮 Gamificación (Opcional)

### Logros Disponibles

Puedes implementar logros en `user_achievements`:

```sql
-- Ejemplo: Completar primera sección
INSERT INTO user_achievements (
  user_id,
  achievement_type,
  section_id,
  metadata
) VALUES (
  'user-uuid',
  'section_completed',
  'subagents',
  '{"badge": "🏆", "title": "Subagent Master"}'::jsonb
);
```

### Tipos de Logros Sugeridos

- `first_visit` - Primera visita al sitio
- `section_completed` - Completar una sección
- `speed_reader` - Completar sección en < 1 hora
- `perfectionist` - 100% en todas las secciones
- `night_owl` - Estudiar después de las 10pm
- `early_bird` - Estudiar antes de las 7am

## 📈 Analytics

### Consultas Útiles

**Usuarios más activos:**
```sql
SELECT
  user_id,
  COUNT(DISTINCT page_id) as pages_visited,
  SUM(time_spent_seconds) as total_time
FROM page_visits
GROUP BY user_id
ORDER BY total_time DESC;
```

**Páginas más visitadas:**
```sql
SELECT
  page_id,
  COUNT(*) as visits
FROM page_visits
GROUP BY page_id
ORDER BY visits DESC;
```

**Progreso promedio por sección:**
```sql
SELECT
  section_id,
  AVG(progress_percentage) as avg_progress,
  COUNT(DISTINCT user_id) as users
FROM user_progress
GROUP BY section_id;
```

## 🐛 Troubleshooting

### El progreso no se guarda

1. Verifica que estés autenticado
2. Chequea la consola del navegador por errores
3. Verifica las políticas RLS en Supabase
4. Asegúrate de que las tablas existen

### El porcentaje no se calcula

El trigger `calculate_progress_percentage` debe estar activo:

```sql
CREATE TRIGGER calculate_progress_percentage
  BEFORE INSERT OR UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_progress_percentage();
```

### No aparece el dashboard

1. Verifica que `ProgressProvider` esté en `Root.tsx`
2. Chequea que el componente esté importado en `profile.tsx`
3. Revisa errores en la consola

## 🚀 Próximos Pasos

- [ ] Agregar gráficos de progreso en el tiempo
- [ ] Implementar sistema de logros completo
- [ ] Exportar progreso a PDF
- [ ] Comparar progreso con otros usuarios (leaderboard)
- [ ] Notificaciones de progreso
- [ ] Recomendaciones de contenido basadas en progreso

---

¡Tu sistema de tracking está listo! Los usuarios ahora pueden ver su progreso mientras aprenden. 🎉
