import { PDFDocument, rgb } from 'pdf-lib';
import type { Order } from '../../../FrontendRequests/Requests-Api/Order';

export interface CompanyOrderStatement {
  companyName: string;
  date: string;
  Orders: Order[];
  totalorders: number;
}

export async function generateOrderStatementPDF(statement: CompanyOrderStatement): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([800, 800]);
  const { width, height } = page.getSize();
  const fontSize = 12;
  const largeFontSize = 20;
  const headerFontSize = 14;
  const margin = 50;

  // Draw title with modern styling
  page.drawText(statement.companyName, {
    x: width / 2 - 100,
    y: height - 50,
    size: largeFontSize,
    color: rgb(0.1, 0.2, 0.5),
  });
  page.drawText(`Erklæring - ${statement.date}`, {
    x: width / 2 - 70,
    y: height - 80,
    size: fontSize
  });

  // Draw separator line
  page.drawLine({
    start: { x: margin, y: height - 100 },
    end: { x: width - margin, y: height - 100 },
    color: rgb(0.7, 0.7, 0.7),
    thickness: 1,
  });

  const yStart = height - 130;

  // Table header with clean, readable fonts
  page.drawText('Ordre', { x: 50, y: yStart, size: headerFontSize, color: rgb(0.1, 0.1, 0.1) });
  page.drawText('Navn', { x: 150, y: yStart, size: headerFontSize, color: rgb(0.1, 0.1, 0.1) });
  page.drawText('Email', { x: 250, y: yStart, size: headerFontSize, color: rgb(0.1, 0.1, 0.1) });
  page.drawText('Status', { x: 450, y: yStart, size: headerFontSize, color: rgb(0.1, 0.1, 0.1) });
  page.drawText('Dato', { x: 550, y: yStart, size: headerFontSize, color: rgb(0.1, 0.1, 0.1) });
  page.drawText('Samlet Pris', { x: 650, y: yStart, size: headerFontSize, color: rgb(0.1, 0.1, 0.1) });

  // Table rows
  let yPosition = yStart - 40;
  statement.Orders.forEach((order) => {
    page.drawText(`#${order.orderid}`, { x: 50, y: yPosition, size: fontSize, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(`${order.firstname} ${order.lastname}`, { x: 150, y: yPosition, size: fontSize, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(order.email, { x: 250, y: yPosition, size: fontSize, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(order.statusname as string, { x: 450, y: yPosition, size: fontSize, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(new Date(order.order_date).toLocaleDateString('en-GB'), { x: 550, y: yPosition, size: fontSize, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(`${order.totalprice} .kr`, { x: 650, y: yPosition, size: fontSize, color: rgb(0.2, 0.2, 0.2) });
    yPosition -= 30;
  });

  // Draw summary section with clean spacing
  page.drawText(`Ordre i alt: ${statement.totalorders}`, { x: 50, y: yPosition, size: fontSize, color: rgb(0.1, 0.1, 0.1) });

  // Draw separator line for summary
  page.drawLine({
    start: { x: margin, y: yPosition - 40 },
    end: { x: width - margin, y: yPosition - 40 },
    color: rgb(0.7, 0.7, 0.7),
    thickness: 1,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}