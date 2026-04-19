import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

interface CertificateData {
  studentName: string;
  testName: string;
  score: number;
  total: number;
  date: Date;
  certificateId: string;
  platformName: string;
}

/**
 * High-Precision Certificate Generation Protocol
 * Optimized for professional layout, spatial balance, and brand alignment.
 */
export async function generateCertificatePDF(data: CertificateData) {
  // Protocol: Using 'pt' (points) for high-precision typographic layout
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();   // ~842 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // ~595 pt

  // Color Registry
  const colorNavy = [26, 35, 64];    // #1a2340
  const colorBlue = [59, 91, 219];   // #3B5BDB
  const colorGray = [148, 163, 184];  // #94a3b8

  // Base Layer
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 8. Border Protocol
  // Outer border: navy 2px (20px margin)
  doc.setDrawColor(colorNavy[0], colorNavy[1], colorNavy[2]);
  doc.setLineWidth(2);
  doc.rect(20, 20, pageWidth - 40, pageHeight - 40, 'S');

  // Inner border: blue 1px (30px margin)
  doc.setDrawColor(colorBlue[0], colorBlue[1], colorBlue[2]);
  doc.setLineWidth(1);
  doc.rect(30, 30, pageWidth - 60, pageHeight - 60, 'S');

  // 1. Top Section (y: 40-120): Identity Mark
  doc.setTextColor(colorNavy[0], colorNavy[1], colorNavy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text(data.platformName.toUpperCase(), pageWidth / 2, 80, { align: 'center' });
  
  // Horizontal line (y: 100)
  doc.setDrawColor(colorNavy[0], colorNavy[1], colorNavy[2]);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 40, 100, pageWidth / 2 + 40, 100);

  // 2. Certificate Title (y: 130-180)
  doc.setTextColor(colorGray[0], colorGray[1], colorGray[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  // Wide letter spacing implemented via charSpace
  doc.text('CERTIFICATE OF COMPLETION', pageWidth / 2, 150, { align: 'center', charSpace: 2 });

  // 3. Body Text (y: 200-320)
  doc.setTextColor(colorNavy[0], colorNavy[1], colorNavy[2]);
  doc.setFontSize(14);
  doc.text('THIS IS TO CERTIFY THAT', pageWidth / 2, 210, { align: 'center' });

  doc.setTextColor(colorBlue[0], colorBlue[1], colorBlue[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.text(data.studentName.toUpperCase(), pageWidth / 2, 270, { align: 'center' });

  doc.setTextColor(colorNavy[0], colorNavy[1], colorNavy[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.text('HAS SUCCESSFULLY COMPLETED THE ASSESSMENT MODULE', pageWidth / 2, 320, { align: 'center' });

  // 4. Test Info (y: 340-380)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(data.testName.toUpperCase(), pageWidth / 2, 360, { align: 'center' });

  // 5. Bottom Info Row (y: 400)
  const percentage = Math.round((data.score / data.total) * 100);
  doc.setTextColor(colorGray[0], colorGray[1], colorGray[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  // Same horizontal line, left and right alignment
  doc.text(`DATE COMPLETED: ${format(data.date, 'MMMM dd, yyyy').toUpperCase()}`, 60, 410);
  doc.text(`ACHIEVED PRECISION: ${percentage}% (${data.score}/${data.total})`, pageWidth - 60, 410, { align: 'right' });

  // 6. Seal (y: 430-510)
  // Background: White circle to prevent transparency artifacts
  doc.setFillColor(255, 255, 255);
  doc.circle(pageWidth / 2, 470, 42, 'F');

  try {
    // Seal image centered below the info row
    doc.addImage('/brand/certificate-seal.png', 'PNG', pageWidth / 2 - 40, 430, 80, 80);
  } catch (e) {
    // Forensic fallback if asset missing from registry
  }

  // 7. Verification ID (y: 520)
  doc.setFontSize(8);
  doc.setTextColor(colorGray[0], colorGray[1], colorGray[2]);
  doc.text(`VERIFICATION ID: ${data.certificateId}`, pageWidth / 2, 530, { align: 'center' });

  // Extraction Protocol
  doc.save(`Certificate_${data.studentName.replace(/\s+/g, '_')}_${data.testName.replace(/\s+/g, '_')}.pdf`);
}
