import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { OrdersProduct } from '../../../FrontendRequests/Requests-Api/Order';

export async function generateOrderConfirmationPDF(order: OrderDetails): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();

  const fontSize = 10;
  const headerFontSize = 12;
  const titleFontSize = 16;
  const margin = 50;

  // Load standard fonts
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Draw company header
  page.drawText(order.companyname, {
    x: margin,
    y: height - 50,
    size: titleFontSize,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(`${order.companyaddress}\n${order.companyemail}\n${order.companyphone}`, {
    x: margin,
    y: height - 80,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    lineHeight: 12,
  });

  // Draw Invoice header
  const invoiceX = width - margin - 200;
  page.drawText('Ordre', {
    x: invoiceX,
    y: height - 50,
    size: titleFontSize,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Ordrenr #: ${order.orderid}\n\nDato: ${order.invoiceDate}`, {
    x: invoiceX,
    y: height - 80,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    lineHeight: 12,
  });

  // Draw billing and shipping sections
  const sectionYStart = height - 120;
  const sectionSpacing = 200;

  page.drawText('Faktureres til:', {
    x: margin,
    y: sectionYStart,
    size: headerFontSize,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(order.billingDetails, {
    x: margin,
    y: sectionYStart - 20,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    lineHeight: 12,
  });

  page.drawText('Sendes til:', {
    x: margin + sectionSpacing,
    y: sectionYStart,
    size: headerFontSize,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(order.shippingDetails, {
    x: margin + sectionSpacing,
    y: sectionYStart - 20,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    lineHeight: 12,
  });

  // Draw comments or special instructions
  const commentsY = sectionYStart - 100;
  page.drawText('KOMMENTAR:', {
    x: margin,
    y: commentsY,
    size: headerFontSize,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(order.comments, {
    x: margin,
    y: commentsY - 20,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    lineHeight: 12,
  });

  // Draw table headers
  const tableYStart = commentsY - 60;
  const tableColumnWidths = [200, 100, 100, 100];
  const tableHeader = ['PRODUKT', 'ANTAL', 'PRIS'];

  let xPosition = margin;

  tableHeader.forEach((header, index) => {
    page.drawText(header, {
      x: xPosition,
      y: tableYStart,
      size: headerFontSize,
      font: helveticaBoldFont,
      color: rgb(1, 1, 1),
    });
    xPosition += tableColumnWidths[index];
  });

  // Draw table rows
  let yPosition = tableYStart - 20;
  order.orderProducts.forEach((product) => {
    xPosition = margin;

    page.drawText(product.productname, {
      x: xPosition,
      y: yPosition,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    xPosition += tableColumnWidths[0];

    page.drawText(product.quantity.toString() || '1', {
      x: xPosition,
      y: yPosition,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    xPosition += tableColumnWidths[1];

    page.drawText(`${((Number(product.salgpris_ex_moms) + Number(product.udgående_moms)))} kr.`, {
      x: xPosition,
      y: yPosition,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    xPosition += tableColumnWidths[2];

    yPosition -= 20;
  });

// Draw totals section
let totalsY = yPosition - 40;

// Separator line
page.drawLine({
  start: { x: margin, y: totalsY + 20 },
  end: { x: width - margin, y: totalsY + 20 },
  thickness: 1,
  color: rgb(0, 0, 0),
});

page.drawText('Pris i alt :', {
  x: margin + 300,
  y: totalsY,
  size: fontSize,
  font: helveticaBoldFont,
  color: rgb(0, 0, 0),
});
page.drawText(`${order.subtotal} kr.`, {
  x: margin + 400,
  y: totalsY,
  size: fontSize,
  font: helveticaFont,
  color: rgb(0, 0, 0),
});

totalsY -= 20;

page.drawText('Fragt :', {
  x: margin + 300,
  y: totalsY,
  size: fontSize,
  font: helveticaBoldFont,
  color: rgb(0, 0, 0),
});
page.drawText(`${order.shippingprice || 0} kr.`, {
  x: margin + 400,
  y: totalsY,
  size: fontSize,
  font: helveticaFont,
  color: rgb(0, 0, 0),
});

totalsY -= 20;

page.drawText('Moms :', {
  x: margin + 300,
  y: totalsY,
  size: fontSize,
  font: helveticaBoldFont,
  color: rgb(0, 0, 0),
});
page.drawText(`${Math.round(order.salesTax)} kr.`, {
  x: margin + 400,
  y: totalsY,
  size: fontSize,
  font: helveticaFont,
  color: rgb(0, 0, 0),
});

totalsY -= 20;

page.drawText('Total :', {
  x: margin + 300,
  y: totalsY,
  size: fontSize,
  font: helveticaBoldFont,
  color: rgb(0, 0, 0),
});
page.drawText(`${Number(order.subtotal) + Number(order.shippingprice)} kr.`, {
  x: margin + 400,
  y: totalsY,
  size: fontSize,
  font: helveticaFont,
  color: rgb(0, 0, 0),
});

// Separator line
page.drawLine({
  start: { x: margin, y: totalsY - 10 },
  end: { x: width - margin, y: totalsY - 10 },
  thickness: 1,
  color: rgb(0, 0, 0),
});


  // Footer
  const footerY = 50;
  page.drawText(`Udfør alle checks for betaling til ${order.companyname}`, {
    x: margin,
    y: footerY,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Hvis du har spørgsmål vedrørende denne faktura, kontakt ${order.companyname}, ${order.companyemail}, ${order.companyphone}.`, {
    x: margin,
    y: footerY - 20,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

// Example OrderDetails type
export interface OrderDetails {
  companyname: string,
  companyaddress: string,
  companyemail: string,
  companyphone: string,
  orderid: string,
  useremail: string;
  invoiceDate: string;
  billingDetails: string;
  shippingDetails: string;
  comments: string;
  orderProducts: OrdersProduct[];
  subtotal: number;
  salesTax: number;
  shippingprice: number;
}