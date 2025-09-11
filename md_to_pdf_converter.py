#!/usr/bin/env python3
"""
Conversor de archivos Markdown a PDF
Convierte todos los archivos .md de una carpeta en un único PDF ordenado
"""

import os
import sys
import argparse
from pathlib import Path
from typing import List, Tuple
import re
import markdown2
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.platypus import Preformatted, KeepTogether, Image
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.lib.styles import getSampleStyleSheet
from bs4 import BeautifulSoup
import html2text

class NumberedCanvas(canvas.Canvas):
    """Canvas personalizado para agregar números de página"""
    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        """Agregar números de página a cada página"""
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        """Dibujar el número de página"""
        self.setFont("Helvetica", 9)
        self.drawRightString(
            letter[0] - 0.75 * inch,
            0.75 * inch,
            f"Página {self._pageNumber} de {page_count}"
        )

class MarkdownToPDFConverter:
    def __init__(self, folder_path: str, output_file: str = None):
        """
        Inicializa el conversor
        
        Args:
            folder_path: Ruta de la carpeta con archivos .md
            output_file: Nombre del archivo PDF de salida (opcional)
        """
        self.folder_path = Path(folder_path)
        if not self.folder_path.exists():
            raise ValueError(f"La carpeta {folder_path} no existe")
        
        self.output_file = output_file or "documentation.pdf"
        if not self.output_file.endswith('.pdf'):
            self.output_file += '.pdf'
        
        self.styles = self._create_styles()
        self.story = []
        self.toc = TableOfContents()
        
    def _create_styles(self):
        """Crear estilos personalizados para el PDF"""
        styles = getSampleStyleSheet()
        
        # Estilo para título principal
        styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=30,
            alignment=TA_CENTER
        ))
        
        # Estilo para subtítulos
        styles.add(ParagraphStyle(
            name='CustomHeading2',
            parent=styles['Heading2'],
            fontSize=18,
            textColor=colors.HexColor('#2563eb'),
            spaceAfter=12,
            spaceBefore=12
        ))
        
        # Estilo para subtítulos nivel 3
        styles.add(ParagraphStyle(
            name='CustomHeading3',
            parent=styles['Heading3'],
            fontSize=14,
            textColor=colors.HexColor('#3b82f6'),
            spaceAfter=10,
            spaceBefore=10
        ))
        
        # Estilo para código
        styles.add(ParagraphStyle(
            name='Code',
            parent=styles['Code'],
            fontSize=9,
            fontName='Courier',
            backgroundColor=colors.HexColor('#f3f4f6'),
            leftIndent=20,
            rightIndent=20,
            spaceAfter=10,
            spaceBefore=10
        ))
        
        # Estilo para párrafos normales
        styles.add(ParagraphStyle(
            name='CustomBodyText',
            parent=styles['BodyText'],
            fontSize=11,
            alignment=TA_JUSTIFY,
            spaceAfter=12
        ))
        
        return styles
    
    def _extract_sort_key(self, file_path: Path) -> Tuple[int, int, str]:
        """
        Extrae la clave de ordenamiento del nombre del archivo
        
        Args:
            file_path: Path del archivo
            
        Returns:
            Tupla (nivel1, nivel2, nombre) para ordenamiento
        """
        name = file_path.name
        
        # Buscar patrones numéricos al inicio del nombre
        match = re.match(r'^(\d+)[-_.]?(\d*)', name)
        if match:
            level1 = int(match.group(1))
            level2 = int(match.group(2)) if match.group(2) else 0
            return (level1, level2, name)
        
        # Si no hay números, usar el nombre como está
        return (999, 0, name)
    
    def _find_markdown_files(self) -> List[Path]:
        """
        Encuentra todos los archivos .md en la carpeta y subcarpetas
        
        Returns:
            Lista de archivos .md ordenados
        """
        md_files = []
        
        # Recorrer recursivamente la carpeta
        for root, dirs, files in os.walk(self.folder_path):
            # Ordenar directorios para procesamiento consistente
            dirs.sort()
            
            for file in files:
                if file.endswith('.md'):
                    file_path = Path(root) / file
                    relative_path = file_path.relative_to(self.folder_path)
                    md_files.append(file_path)
        
        # Ordenar archivos de forma inteligente
        md_files.sort(key=lambda x: (
            # Primero por profundidad de directorio
            len(x.relative_to(self.folder_path).parts),
            # Luego por clave de ordenamiento personalizada
            self._extract_sort_key(x)
        ))
        
        return md_files
    
    def _convert_markdown_to_html(self, markdown_text: str) -> str:
        """
        Convierte Markdown a HTML
        
        Args:
            markdown_text: Texto en formato Markdown
            
        Returns:
            HTML generado
        """
        # Configurar markdown2 con extensiones útiles
        extras = [
            'fenced-code-blocks',
            'tables',
            'break-on-newline',
            'code-friendly',
            'cuddled-lists',
            'footnotes',
            'header-ids',
            'metadata',
            'strike',
            'task_list',
            'wiki-tables'
        ]
        
        html = markdown2.markdown(markdown_text, extras=extras)
        return html
    
    def _html_to_story(self, html_content: str, file_path: Path):
        """
        Convierte HTML a elementos de ReportLab
        
        Args:
            html_content: Contenido HTML
            file_path: Path del archivo para contexto
        """
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Agregar separador y título del archivo
        self.story.append(Spacer(1, 0.2 * inch))
        relative_path = file_path.relative_to(self.folder_path)
        file_title = Paragraph(
            f"<b>{relative_path}</b>",
            self.styles['CustomHeading2']
        )
        self.story.append(file_title)
        self.story.append(Spacer(1, 0.1 * inch))
        
        # Procesar elementos HTML
        for element in soup.children:
            if element.name == 'h1':
                para = Paragraph(element.get_text(), self.styles['CustomTitle'])
                self.story.append(para)
                
            elif element.name == 'h2':
                para = Paragraph(element.get_text(), self.styles['CustomHeading2'])
                self.story.append(para)
                
            elif element.name == 'h3':
                para = Paragraph(element.get_text(), self.styles['CustomHeading3'])
                self.story.append(para)
                
            elif element.name in ['h4', 'h5', 'h6']:
                para = Paragraph(f"<b>{element.get_text()}</b>", self.styles['CustomBodyText'])
                self.story.append(para)
                
            elif element.name == 'p':
                # Manejar código inline
                text = str(element)
                text = text.replace('<code>', '<font name="Courier">')
                text = text.replace('</code>', '</font>')
                para = Paragraph(text, self.styles['CustomBodyText'])
                self.story.append(para)
                
            elif element.name == 'pre':
                # Bloque de código
                code_text = element.get_text()
                # Limitar ancho de línea para evitar desbordamiento
                lines = code_text.split('\n')
                formatted_lines = []
                for line in lines:
                    if len(line) > 80:
                        # Dividir líneas muy largas
                        while len(line) > 80:
                            formatted_lines.append(line[:80])
                            line = '    ' + line[80:]
                        formatted_lines.append(line)
                    else:
                        formatted_lines.append(line)
                
                code_text = '\n'.join(formatted_lines)
                pre = Preformatted(code_text, self.styles['Code'])
                self.story.append(pre)
                
            elif element.name == 'ul':
                # Lista no ordenada
                for li in element.find_all('li', recursive=False):
                    bullet_text = f"• {li.get_text()}"
                    para = Paragraph(bullet_text, self.styles['CustomBodyText'])
                    self.story.append(para)
                    
            elif element.name == 'ol':
                # Lista ordenada
                for i, li in enumerate(element.find_all('li', recursive=False), 1):
                    numbered_text = f"{i}. {li.get_text()}"
                    para = Paragraph(numbered_text, self.styles['CustomBodyText'])
                    self.story.append(para)
                    
            elif element.name == 'blockquote':
                # Cita
                quote_text = f"<i>{element.get_text()}</i>"
                para = Paragraph(quote_text, self.styles['CustomBodyText'])
                self.story.append(para)
                
            elif element.name == 'table':
                # Tabla
                self._process_table(element)
            
            elif element.name == 'hr':
                # Línea horizontal
                self.story.append(Spacer(1, 0.1 * inch))
                self.story.append(Paragraph('_' * 80, self.styles['Normal']))
                self.story.append(Spacer(1, 0.1 * inch))
    
    def _process_table(self, table_element):
        """Procesa una tabla HTML y la convierte a ReportLab"""
        data = []
        
        # Procesar encabezados
        thead = table_element.find('thead')
        if thead:
            headers = []
            for th in thead.find_all('th'):
                headers.append(th.get_text().strip())
            if headers:
                data.append(headers)
        
        # Procesar filas
        tbody = table_element.find('tbody')
        if tbody:
            rows_to_process = tbody.find_all('tr')
        else:
            rows_to_process = table_element.find_all('tr')
        
        for tr in rows_to_process:
            row = []
            for td in tr.find_all(['td', 'th']):
                row.append(td.get_text().strip())
            if row:
                data.append(row)
        
        if data:
            # Crear tabla
            t = Table(data)
            
            # Estilo de tabla
            style = TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ])
            
            t.setStyle(style)
            self.story.append(t)
            self.story.append(Spacer(1, 0.2 * inch))
    
    def _add_title_page(self):
        """Agrega una página de título al PDF"""
        # Título principal
        title = Paragraph(
            "Documentación del Proyecto",
            self.styles['CustomTitle']
        )
        self.story.append(Spacer(1, 2 * inch))
        self.story.append(title)
        
        # Subtítulo con la ruta
        subtitle = Paragraph(
            f"Generado desde: {self.folder_path}",
            self.styles['CustomHeading3']
        )
        self.story.append(Spacer(1, 0.5 * inch))
        self.story.append(subtitle)
        
        # Fecha de generación
        from datetime import datetime
        date_text = Paragraph(
            f"Fecha: {datetime.now().strftime('%d/%m/%Y %H:%M')}",
            self.styles['Normal']
        )
        self.story.append(Spacer(1, 0.3 * inch))
        self.story.append(date_text)
        
        # Salto de página
        self.story.append(PageBreak())
    
    def _add_table_of_contents(self, md_files: List[Path]):
        """Agrega una tabla de contenidos"""
        toc_title = Paragraph("Tabla de Contenidos", self.styles['CustomTitle'])
        self.story.append(toc_title)
        self.story.append(Spacer(1, 0.5 * inch))
        
        for i, file_path in enumerate(md_files, 1):
            relative_path = file_path.relative_to(self.folder_path)
            toc_entry = Paragraph(
                f"{i}. {relative_path}",
                self.styles['Normal']
            )
            self.story.append(toc_entry)
        
        self.story.append(PageBreak())
    
    def convert(self):
        """
        Ejecuta la conversión de todos los archivos .md a PDF
        """
        print(f"🔍 Buscando archivos .md en {self.folder_path}...")
        md_files = self._find_markdown_files()
        
        if not md_files:
            print("❌ No se encontraron archivos .md en la carpeta especificada")
            return False
        
        print(f"📄 Se encontraron {len(md_files)} archivos .md")
        
        # Agregar página de título
        self._add_title_page()
        
        # Agregar tabla de contenidos
        self._add_table_of_contents(md_files)
        
        # Procesar cada archivo
        for i, file_path in enumerate(md_files, 1):
            print(f"  [{i}/{len(md_files)}] Procesando: {file_path.relative_to(self.folder_path)}")
            
            try:
                # Leer archivo
                with open(file_path, 'r', encoding='utf-8') as f:
                    markdown_content = f.read()
                
                # Convertir a HTML
                html_content = self._convert_markdown_to_html(markdown_content)
                
                # Convertir a elementos de ReportLab
                self._html_to_story(html_content, file_path)
                
                # Agregar salto de página entre archivos
                if i < len(md_files):
                    self.story.append(PageBreak())
                    
            except Exception as e:
                print(f"    ⚠️  Error procesando {file_path}: {e}")
                continue
        
        # Generar PDF
        print(f"\n📝 Generando PDF: {self.output_file}")
        try:
            doc = SimpleDocTemplate(
                self.output_file,
                pagesize=letter,
                rightMargin=72,
                leftMargin=72,
                topMargin=72,
                bottomMargin=72
            )
            
            # Construir PDF con canvas personalizado para números de página
            doc.build(self.story, canvasmaker=NumberedCanvas)
            
            print(f"✅ PDF generado exitosamente: {self.output_file}")
            print(f"📊 Tamaño del archivo: {os.path.getsize(self.output_file) / 1024:.2f} KB")
            return True
            
        except Exception as e:
            print(f"❌ Error generando PDF: {e}")
            return False

def main():
    """Función principal"""
    parser = argparse.ArgumentParser(
        description='Convierte archivos Markdown a PDF',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos de uso:
  %(prog)s /ruta/a/carpeta
  %(prog)s /ruta/a/carpeta -o mi_documentacion.pdf
  %(prog)s . -o proyecto.pdf
        """
    )
    
    parser.add_argument(
        'folder',
        help='Ruta de la carpeta con archivos .md'
    )
    
    parser.add_argument(
        '-o', '--output',
        default='documentation.pdf',
        help='Nombre del archivo PDF de salida (default: documentation.pdf)'
    )
    
    args = parser.parse_args()
    
    try:
        converter = MarkdownToPDFConverter(args.folder, args.output)
        success = converter.convert()
        
        if success:
            sys.exit(0)
        else:
            sys.exit(1)
            
    except ValueError as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n⚠️  Conversión cancelada por el usuario")
        sys.exit(130)
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()