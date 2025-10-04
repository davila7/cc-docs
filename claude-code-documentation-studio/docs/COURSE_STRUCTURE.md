# 📚 Estructura de Cursos - Claude Code Academy

## ✅ Implementación Completada

### 🏗️ Estructura Jerárquica

```
Claude Code Academy
│
└── 📚 Claude Code Course (Curso Principal)
    │
    ├── 🤖 Subagents (Módulo 1)
    │   ├── Overview
    │   └── Docusaurus Expert
    │
    ├── 🪝 Hooks (Módulo 2)
    │   ├── Overview
    │   └── Discord Notification Hook
    │
    └── ⚡ Workflows (Módulo 3)
        └── CI/CD Workflow
```

### 📊 Sistema de Tracking

**Niveles de Progreso:**

1. **Curso** (`claude-code`)
   - Total de módulos: 3
   - Módulos completados: X/3
   - Progreso general: Promedio de todos los módulos

2. **Módulo/Sección** (`subagents`, `hooks`, `workflows`)
   - Total de páginas por módulo
   - Páginas completadas
   - Porcentaje de completitud

3. **Página Individual**
   - Visitas registradas
   - Tiempo invertido
   - Estado de completitud

### 🗄️ Base de Datos

**Cambios en el Schema:**

```sql
-- user_progress ahora incluye course_id
CREATE TABLE user_progress (
  user_id UUID,
  course_id TEXT DEFAULT 'claude-code',
  section_id TEXT,
  -- ...
  UNIQUE(user_id, course_id, section_id)
);

-- page_visits también incluye course_id
CREATE TABLE page_visits (
  user_id UUID,
  course_id TEXT DEFAULT 'claude-code',
  section_id TEXT,
  page_id TEXT,
  -- ...
);
```

### 📱 Dashboard de Progreso

**Visualización Mejorada:**

```
┌─────────────────────────────────────┐
│ 📚 Claude Code Course               │
├─────────────────────────────────────┤
│                                     │
│ Modules Completed: 1/3              │
│ Course Progress: 66%                │
│                                     │
│ [████████████░░░░░░░] 66%          │
│                                     │
│ Course Modules:                     │
│ ┌─────────────────────┐             │
│ │ 🤖 Subagents  ✓     │             │
│ │ [████████████] 100% │             │
│ └─────────────────────┘             │
│ ┌─────────────────────┐             │
│ │ 🪝 Hooks            │             │
│ │ [████████░░░] 50%   │             │
│ └─────────────────────┘             │
│ ┌─────────────────────┐             │
│ │ ⚡ Workflows        │             │
│ │ [████████████] 100% │             │
│ └─────────────────────┘             │
└─────────────────────────────────────┘
```

## 🚀 Cómo Agregar Nuevos Cursos

### Paso 1: Agregar Curso en ProgressContext

```typescript
// src/contexts/ProgressContext.tsx

const COURSES = {
  'claude-code': {
    name: 'Claude Code Course',
    total_sections: 3,
    sections: {
      subagents: { total_pages: 2, name: 'Subagents' },
      hooks: { total_pages: 2, name: 'Hooks' },
      workflows: { total_pages: 1, name: 'Workflows' },
    }
  },
  // Nuevo curso
  'advanced-course': {
    name: 'Advanced Course',
    total_sections: 2,
    sections: {
      testing: { total_pages: 3, name: 'Testing' },
      deployment: { total_pages: 4, name: 'Deployment' },
    }
  }
};
```

### Paso 2: Actualizar Sidebar

```typescript
// sidebars.ts

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '📚 Claude Code Course',
      collapsed: false,
      items: [/* ... */],
    },
    {
      type: 'category',
      label: '🎓 Advanced Course',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: '🧪 Testing',
          items: [/* páginas */],
        },
        {
          type: 'category',
          label: '🚀 Deployment',
          items: [/* páginas */],
        }
      ],
    }
  ],
};
```

### Paso 3: Crear Estructura de Carpetas

```bash
docs/
├── intro.md
├── advanced-course/
│   ├── testing/
│   │   ├── overview.md
│   │   ├── unit-tests.md
│   │   └── integration-tests.md
│   └── deployment/
│       ├── overview.md
│       ├── vercel.md
│       ├── netlify.md
│       └── aws.md
```

### Paso 4: Ejecutar Schema Update

```sql
-- Los datos ya están preparados para múltiples cursos
-- Solo necesitas insertar nuevos registros
INSERT INTO section_config (section_id, display_name, total_pages, icon, color) VALUES
  ('testing', 'Testing', 3, '🧪', '#8b5cf6'),
  ('deployment', 'Deployment', 4, '🚀', '#ec4899');
```

## 🎯 Ventajas del Sistema de Cursos

### ✅ Escalabilidad
- Agregar cursos sin modificar la estructura base
- Cada curso es independiente
- Progreso separado por curso

### ✅ Flexibilidad
- Cursos con diferentes números de módulos
- Módulos con diferentes números de páginas
- Personalización de colores e iconos

### ✅ Analytics Mejorado
- Tracking por curso
- Comparación entre cursos
- Identificar cursos más populares

### ✅ Experiencia de Usuario
- Navegación clara y organizada
- Progreso visual por curso
- Badges de completitud

## 📈 Métricas por Curso

### SQL Queries Útiles

**Progreso promedio por curso:**
```sql
SELECT
  course_id,
  COUNT(DISTINCT user_id) as total_users,
  AVG(progress_percentage) as avg_progress
FROM user_progress
GROUP BY course_id;
```

**Usuarios que completaron un curso:**
```sql
SELECT
  user_id,
  course_id,
  COUNT(*) FILTER (WHERE progress_percentage = 100) as completed_sections,
  COUNT(*) as total_sections
FROM user_progress
WHERE course_id = 'claude-code'
GROUP BY user_id, course_id
HAVING COUNT(*) FILTER (WHERE progress_percentage = 100) = COUNT(*);
```

**Curso más popular:**
```sql
SELECT
  course_id,
  COUNT(DISTINCT user_id) as users_started,
  COUNT(DISTINCT page_id) as total_page_views
FROM page_visits
GROUP BY course_id
ORDER BY users_started DESC;
```

## 🎨 Personalización por Curso

### Colores y Estilos

Puedes personalizar cada curso con:

```typescript
const COURSE_STYLES = {
  'claude-code': {
    primaryColor: '#f97316',
    icon: '📚',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  },
  'advanced-course': {
    primaryColor: '#8b5cf6',
    icon: '🎓',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  }
};
```

## 🔄 Migración de Datos

Si ya tienes datos sin `course_id`:

```sql
-- Agregar course_id a registros existentes
UPDATE user_progress
SET course_id = 'claude-code'
WHERE course_id IS NULL;

UPDATE page_visits
SET course_id = 'claude-code'
WHERE course_id IS NULL;
```

## 📝 Resumen

**Archivos Modificados:**
- ✅ `sidebars.ts` - Estructura jerárquica con curso principal
- ✅ `ProgressContext.tsx` - Soporte para múltiples cursos
- ✅ `UserProgressDashboard.tsx` - Visualización por curso
- ✅ `supabase/schema.sql` - Campo course_id agregado

**Nuevas Capacidades:**
- ✅ Organización por cursos
- ✅ Tracking independiente por curso
- ✅ Progreso visual mejorado
- ✅ Preparado para escalabilidad

---

**🎉 El sistema está listo para múltiples cursos!** Solo agrega nuevos cursos siguiendo la estructura definida.
