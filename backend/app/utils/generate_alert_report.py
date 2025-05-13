import sqlite3
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from PIL import Image
import os
import re

COLORS = {
    'primary': '#062d52',
    'secondary': '#062d52',
    'accent': '#dae8f5',
    'background': '#F8F9FA',
    'text': '#2D3436',
    'headers': '#2F3699'
}

styles = {
    "title": ParagraphStyle(name="Title", fontName="Helvetica-Bold", fontSize=18, textColor=colors.HexColor(COLORS['primary']), spaceAfter=12),
    "subtitle": ParagraphStyle(name="Subtitle", fontName="Helvetica-Bold", fontSize=12, textColor=colors.HexColor(COLORS['headers']), spaceAfter=6),
    "normal": ParagraphStyle(name="NormalText", fontName="Helvetica", fontSize=10, textColor=colors.HexColor(COLORS['text']), leading=12),
    "footer": ParagraphStyle(name="Footer", fontName="Helvetica-Oblique", fontSize=8, textColor=colors.grey, alignment=1),
}

def extract_coordinates(location):
    match = re.search(r'([-+]?\d{1,2}\.\d+),\s*([-+]?\d{1,3}\.\d+)', location)
    return match.groups() if match else (None, None)

def draw_separator(c, y_pos, width, color="#a3a0a0"):
    c.setStrokeColor(colors.HexColor(color))
    c.setLineWidth(0.5)
    c.line(2*cm, y_pos, width - 2*cm, y_pos)
    return y_pos - 0.5*cm

def draw_header(c, width, height):
    c.setFillColor(colors.HexColor(COLORS['primary']))
    c.rect(0, height - 2.5*cm, width, 2.5*cm, fill=True, stroke=0)
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(colors.white)
    c.drawCentredString(width/2, height - 1.8*cm, "Rapport d'Incident Sécurité")

def draw_info_table(c, alert_data, y_pos):
    data = [
        ["ID Alerte", alert_data['alert_id']],
        ["Type de détection", alert_data['detection_type']],
        ["Date/Heure", alert_data['timestamp']],
        ["Statut", alert_data['status']]
    ]
    table = Table(data, colWidths=[4*cm, 13*cm])
    table.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (-1,-1), 10),
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor(COLORS['secondary'])),
        ('TEXTCOLOR', (0,0), (0,-1), colors.white),
        ('BACKGROUND', (1,0), (1,-1), colors.HexColor(COLORS['background'])),
        ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#DEE2E6')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    table.wrapOn(c, 15*cm, 5*cm)
    table.drawOn(c, 2*cm, y_pos - table._height - 0.5*cm)
    return y_pos - table._height - 1.5*cm

def draw_status_badge(c, status, width, y_pos):
    status_text = "RÉSOLU" if status.lower() == "traite" else "EN ATTENTE"
    color = colors.HexColor('#28A745' if status.lower() == "traite" else '#DC3545')
    badge_width = 3.5*cm
    c.setFillColor(color)
    c.roundRect(width - badge_width - 2*cm, y_pos, badge_width, 0.8*cm, 0.4*cm, fill=1)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(width - badge_width/2 - 2*cm, y_pos + 0.25*cm, status_text)

def draw_location_section(c, location, margin, y_pos):
    lat, lon = extract_coordinates(location)
    location_text = location.split(", MA")[0]
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(colors.HexColor(COLORS['headers']))
    c.drawString(margin, y_pos, " Localisation de l'Incident")

    y_pos -= 0.5*cm

    
    if lat and lon:
        map_text = f"<link href='https://www.google.com/maps?q={lat},{lon}' color='blue'><u>Voir sur la carte interactive</u></link>"
        p = Paragraph(map_text, styles["normal"])
        p.wrapOn(c, 10*cm, 0.5*cm)
        p.drawOn(c, margin, y_pos - 0.5*cm)
        y_pos -= 1*cm

    address = Paragraph(f"""
        <b>Lieu exact :</b> {location_text}<br/>
        <b>Coordonnées GPS :</b> {lat}, {lon if lon else 'Non disponible'}
    """, styles["normal"])
    address.wrapOn(c, 15*cm, 2*cm)
    address.drawOn(c, margin, y_pos - 1*cm)
    
    return y_pos - 2*cm

def draw_image_section(c, image_path, margin, y_pos, page_width):
    if image_path and os.path.isfile(image_path):
        try:
            img = Image.open(image_path)
            img_width, img_height = img.size
            aspect = img_height / img_width
            max_width = 12*cm
            display_height = max_width * aspect

            # Centrage de l'image
            x_pos = (page_width - max_width) / 2
            c.drawImage(image_path, x_pos, y_pos - display_height, 
                        width=max_width, height=display_height, mask='auto')

            # Légende centrée
            c.setFont("Helvetica-Oblique", 9)
            c.setFillColor(colors.HexColor(COLORS['text']))
            text_width = c.stringWidth("Image capturée automatiquement lors de l'incident.", "Helvetica-Oblique", 9)
            c.drawString((page_width - text_width)/2, y_pos - display_height - 0.5*cm, "Image capturée automatiquement lors de l'incident")
            return y_pos - display_height - 1.5*cm
        except Exception as e:
            error_text = f"Erreur de chargement de l'image: {str(e)}"
            c.setFont("Helvetica", 10)
            c.setFillColor(colors.red)
            c.drawString(margin, y_pos - 1*cm, error_text)
            return y_pos - 1.5*cm
    else:
        c.setFont("Helvetica-Oblique", 10)
        c.setFillColor(colors.gray)
        c.drawString(margin, y_pos - 1*cm, "Aucune image disponible pour cet incident")
        return y_pos - 1.5*cm

def generate_report_by_id(alert_id, output_dir="reports"):
    conn = sqlite3.connect("alerts.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts WHERE alert_id = ?", (alert_id,))
    alert = cursor.fetchone()
    conn.close()

    if not alert:
        print(f"Aucune alerte trouvée avec l'ID {alert_id}")
        return

    os.makedirs(output_dir, exist_ok=True)
    pdf_path = os.path.join(output_dir, f"alert_report_{alert_id}.pdf")

    c = canvas.Canvas(pdf_path, pagesize=A4)
    width, height = A4
    margin = 2*cm
    y_pos = height - 4*cm

    draw_header(c, width, height)
    draw_status_badge(c, alert[5], width, height - 3.5*cm)

    # Description
    desc_text = """
        <para align="justify">
        <font name="Helvetica-Bold" size="12" color="{0}">Description de l'Incident :</font><br/><br/>
        <font name="Helvetica" size="10" color="#000000">
        Cet incident a été détecté automatiquement par le système intelligent de surveillance. 
        L'analyse a permis d'établir le niveau de gravité et de déclencher les actions appropriées.
        </font>
        </para>
    """.format(COLORS['headers'], COLORS['text'])
    desc = Paragraph(desc_text, styles["normal"])
    desc.wrapOn(c, width - 2*margin, 2*cm)
    desc.drawOn(c, margin, y_pos - 2*cm)
    y_pos -= desc.height + 1.5*cm

    # Tableau d'informations
    y_pos = draw_info_table(c, {
        'alert_id': alert[0],
        'detection_type': alert[1],
        'timestamp': alert[3],
        'status': "Traité" if alert[5].lower() == "traite" else "En attente"
    }, y_pos)

    y_pos = draw_separator(c, y_pos, width)
    y_pos = draw_location_section(c, alert[2], margin, y_pos)
    y_pos = draw_separator(c, y_pos, width)
    y_pos = draw_image_section(c, alert[4], margin, y_pos, width)

    # Footer
    footer = Paragraph("© 2024 Système de Surveillance IA - Rapport confidentiel", styles["footer"])
    footer.wrapOn(c, width, 1*cm)
    footer.drawOn(c, 0, 0.8*cm)

    c.save()
    print(f" Rapport esthétique généré : {pdf_path}")
    #
    return pdf_path
generate_report_by_id('X4g3o2VXzoregAEi63NX4q')
