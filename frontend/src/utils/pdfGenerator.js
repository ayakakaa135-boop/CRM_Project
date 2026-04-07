import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Note: In a real production app, we would load the Arabic font from a .ttf file and convert to base64.
// For this implementation, I will use a placeholder for the font registration logic 
// that is known to work with jsPDF for Arabic (RTL).
// We'll use the 'Amiri' font which is excellent for Arabic documents.

const AMIRI_FONT_BASE64 = "AAEAAAAPAIAAAwB...[BASE64_DATA_PLACEHOLDER]...AA=="; // Simplified for this demo

export const generateCompanyReport = (company, services) => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true
  });

  // 1. Setup Arabic Font (Simulated - in real app, we'd add the actual base64)
  // doc.addFileToVFS('Amiri-Regular.ttf', AMIRI_FONT_BASE64);
  // doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
  // doc.setFont('Amiri');

  // 2. Header (Mocking Arabic support via standard PDF for structure first)
  doc.setTextColor(40);
  doc.setFontSize(22);
  doc.text('CRM Report - تقرير النظام', 105, 20, { align: 'center' });

  doc.setFontSize(14);
  doc.text(`Company: ${company.name}`, 190, 40, { align: 'right' });
  doc.text(`Date: ${new Date().toLocaleDateString('ar-SA')}`, 190, 50, { align: 'right' });

  // 3. Table of Services
  const tableColumn = ["ID", "Service Type", "Status", "Progress", "Request Date"];
  const tableRows = services.map(s => [
    s.id,
    s.serviceType,
    s.status,
    `${s.progress}%`,
    s.requestDate
  ]);

  doc.autoTable({
    startY: 60,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    styles: { halign: 'right', font: 'helvetica' }, // In real Arabic support, we'd set font: 'Amiri'
    headStyles: { fillStyle: 'df', fillColor: [41, 128, 185], textColor: 255 },
  });

  // 4. Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
  }

  // 5. Save the PDF
  doc.save(`Report_${company.name}_${Date.now()}.pdf`);
};

export const copyShareLink = (reportId) => {
  const baseUrl = window.location.origin;
  const shareLink = `${baseUrl}/reports/share/${reportId}_token_${Math.random().toString(36).substr(2, 9)}`;
  navigator.clipboard.writeText(shareLink);
  return shareLink;
};
