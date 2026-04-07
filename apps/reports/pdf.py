import io
import os
from django.conf import settings
from django.utils.translation import gettext as _


def build_report_pdf(report):
    """
    يبني PDF باستخدام reportlab ويحفظه في media/reports/
    تأكد من تثبيت: uv add reportlab
    """
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib import colors
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import cm
        from reportlab.pdfbase import pdfmetrics
        from reportlab.pdfbase.ttfonts import TTFont
    except ImportError:
        return  # reportlab غير مثبت — skip

    output_dir = os.path.join(settings.MEDIA_ROOT, "reports")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"report_{report.id}.pdf")

    doc    = SimpleDocTemplate(output_path, pagesize=A4)
    styles = getSampleStyleSheet()
    story  = []

    # العنوان
    story.append(Paragraph(f"{_('Service Report')} - {report.company.name}", styles["Title"]))
    story.append(Paragraph(f"{_('Date')}: {report.date}", styles["Normal"]))
    story.append(Spacer(1, 0.5 * cm))

    # بنود التقرير
    data = [[_("Service"), _("Description"), _("Notes")]]
    for item in report.items.all():
        data.append([item.service_type.name, item.description, item.notes])

    table = Table(data, colWidths=[5 * cm, 8 * cm, 5 * cm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2d6a4f")),
        ("TEXTCOLOR",  (0, 0), (-1, 0), colors.white),
        ("GRID",       (0, 0), (-1, -1), 0.5, colors.grey),
        ("FONTSIZE",   (0, 0), (-1, -1), 10),
    ]))
    story.append(table)

    doc.build(story)
    return output_path