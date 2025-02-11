import { PDFDocument, rgb } from 'pdf-lib';
import type { User } from '../../../FrontendRequests/Requests-Api/User';

export interface CompanyUserStatement {
  companyName: string;
  date: string;
  Users: User[];
  totalusers: number;
}

export async function generateUserStatementPDF(statement: CompanyUserStatement): Promise<Uint8Array> {
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
  page.drawText('BrugerId', { x: 50, y: yStart, size: headerFontSize, color: rgb(0.1, 0.1, 0.1) });
  page.drawText('Navn', { x: 150, y: yStart, size: headerFontSize, color: rgb(0.1, 0.1, 0.1) });
  page.drawText('Email', { x: 250, y: yStart, size: headerFontSize, color: rgb(0.1, 0.1, 0.1) });
  page.drawText('Telefon Nummer', { x: 450, y: yStart, size: headerFontSize, color: rgb(0.1, 0.1, 0.1) });
  page.drawText('Rolle', { x: 600, y: yStart, size: headerFontSize, color: rgb(0.1, 0.1, 0.1) });
  page.drawText('Land', { x: 700, y: yStart, size: headerFontSize, color: rgb(0.1, 0.1, 0.1) });

  // Table rows
  let yPosition = yStart - 40;
  statement.Users.forEach((user) => {
    page.drawText(`#${user.userid}`, { x: 50, y: yPosition, size: fontSize, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(`${user.firstname} ${user.lastname}`, { x: 150, y: yPosition, size: fontSize, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(user.email, { x: 250, y: yPosition, size: fontSize, color: rgb(0.2, 0.2, 0.2) });
    page.drawText((user.phonenumber as number).toString(), { x: 450, y: yPosition, size: fontSize, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(user.member_type as string, { x: 600, y: yPosition, size: fontSize, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(user.country_name as string, { x: 700, y: yPosition, size: fontSize, color: rgb(0.2, 0.2, 0.2) });
    yPosition -= 30;
  });

  // Draw summary section with clean spacing
  page.drawText(`Brugere i alt: ${statement.totalusers}`, { x: 50, y: yPosition, size: fontSize, color: rgb(0.1, 0.1, 0.1) });

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