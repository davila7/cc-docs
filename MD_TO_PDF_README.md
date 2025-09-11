# Conversor de Markdown a PDF

Script en Python para convertir todos los archivos Markdown (.md) de una carpeta en un único PDF ordenado y con formato profesional.

## Instalación

1. Instalar las dependencias:
```bash
pip install -r requirements.txt
```

## Uso

### Uso básico
```bash
python md_to_pdf_converter.py /ruta/a/tu/carpeta
```

### Especificar archivo de salida
```bash
python md_to_pdf_converter.py /ruta/a/tu/carpeta -o mi_documentacion.pdf
```

### Convertir carpeta actual
```bash
python md_to_pdf_converter.py . -o proyecto.pdf
```

## Características

✨ **Procesamiento inteligente**
- Busca recursivamente todos los archivos .md en la carpeta y subcarpetas
- Ordena archivos automáticamente por números en el nombre (ej: 1-intro.md, 2-setup.md)
- Mantiene la jerarquía de carpetas

📄 **Formato profesional**
- Página de título con información del proyecto
- Tabla de contenidos con todos los archivos
- Números de página
- Estilos personalizados para títulos, código y texto

🎨 **Soporte completo de Markdown**
- Títulos y subtítulos (H1-H6)
- Listas ordenadas y no ordenadas
- Bloques de código con formato
- Tablas
- Citas (blockquotes)
- Enlaces y énfasis

## Ejemplo de uso

```bash
# Convertir la documentación de Claude Code
python md_to_pdf_converter.py ./claude-code-docs -o claude-code-manual.pdf

# Salida esperada:
🔍 Buscando archivos .md en ./claude-code-docs...
📄 Se encontraron 37 archivos .md
  [1/37] Procesando: 1-getting-started/1-overview.md
  [2/37] Procesando: 1-getting-started/2-quickstart.md
  ...
📝 Generando PDF: claude-code-manual.pdf
✅ PDF generado exitosamente: claude-code-manual.pdf
📊 Tamaño del archivo: 245.67 KB
```

## Estructura del PDF generado

1. **Página de título**: Nombre del proyecto, ruta de origen y fecha
2. **Tabla de contenidos**: Lista de todos los archivos procesados
3. **Contenido**: Cada archivo .md convertido con:
   - Título del archivo y ruta relativa
   - Contenido formateado
   - Salto de página entre archivos
4. **Pie de página**: Números de página (Página X de Y)

## Ordenamiento de archivos

El script ordena los archivos de forma inteligente:
- Primero por profundidad de directorio
- Luego por números al inicio del nombre (1-archivo.md antes que 2-archivo.md)
- Finalmente alfabéticamente

## Solución de problemas

Si encuentras errores de codificación, asegúrate de que tus archivos .md estén en UTF-8.

Para archivos muy grandes, el proceso puede tomar algunos minutos.