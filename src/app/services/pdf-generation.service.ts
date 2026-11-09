import { Injectable } from '@angular/core';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import {
  calculateInvoiceTotals,
  DocumentFormValue,
  formatDate,
  formatCurrency,
  parseAmount,
} from '../models/document.model';

@Injectable({ providedIn: 'root' })
export class PdfGenerationService {
  /** Maps invoice data into a typed pdfmake document definition. */
  createDocumentDefinition(data: DocumentFormValue): TDocumentDefinitions {
    try {
      return {
        content: [
          { text: 'Invoice', style: 'header' },
          { text: data.projectTitle, style: 'title' },
          {
            table: {
              widths: ['auto', '*'],
              body: [
                [
                  'Issuer',
                  `${data.issuerCompanyName}\n${data.issuerStreet}\n${data.issuerPostalCode} ${data.issuerCity}`,
                ],
                [
                  'Customer',
                  `${data.customerCompanyName}\n${data.customerStreet}\n${data.customerPostalCode} ${data.customerCity}`,
                ],
                ['Date', formatDate(data.date)],
                [
                  'Contact',
                  `${data.customerName}\n${data.contactEmail}`,
                ],
              ],
            },
            layout: 'lightHorizontalLines',
            margin: [0, 0, 0, 16],
          },
          { text: 'Items', style: 'section' },
          {
            table: {
              widths: ['auto', '*', 'auto'],
              body: [
                ['Pos.', 'Item', 'Netto'],
                ...data.items.map((item, index) => [
                  String(index + 1),
                  item.description || 'Item',
                  formatCurrency(this.parseItemPrice(item.price)),
                ]),
              ],
            },
            layout: 'lightHorizontalLines',
          },
          {
            table: {
              widths: ['*', 'auto'],
              body: [
                ['Net', formatCurrency(calculateInvoiceTotals(data.items).netto)],
                ['19% VAT', formatCurrency(calculateInvoiceTotals(data.items).vat)],
                [
                  'Invoice Total (Gross)',
                  formatCurrency(calculateInvoiceTotals(data.items).brutto),
                ],
              ],
            },
            layout: 'lightHorizontalLines',
            margin: [0, 16, 0, 16],
          },
          { text: 'Notes', style: 'section' },
          { text: data.description || 'No notes added.' },
        ],
        styles: {
          header: { fontSize: 10, color: '#52606d', bold: true },
          title: { fontSize: 24, bold: true, margin: [0, 4, 0, 24] },
          section: { fontSize: 12, bold: true, margin: [0, 8, 0, 6] },
        },
        defaultStyle: {
          fontSize: 10,
        },
      };
    } catch (error) {
      throw new Error('Unable to map form data to a PDF document.', {
        cause: error,
      });
    }
  }

  /** Parses and validates an invoice item price for PDF rendering. */
  private parseItemPrice(value: string): number {
    const convertedValue =
      value.trim() === '' ? 0 : Number(value.trim().replace(',', '.'));

    if (!Number.isFinite(convertedValue)) {
      throw new Error('Invoice item price must be a finite number.');
    }

    return parseAmount(value);
  }

  /** Generates a PDF blob and downloads it as an invoice file. */
  async generate(data: DocumentFormValue): Promise<void> {
    try {
      const definition = this.createDocumentDefinition(data);
      const [pdfMakeModule, pdfFontsModule] = await Promise.all([
        import('pdfmake/build/pdfmake'),
        import('pdfmake/build/vfs_fonts'),
      ]);
      const pdfMake = pdfMakeModule.default;
      const pdfFonts = pdfFontsModule.default ?? pdfFontsModule;
      pdfMake.vfs =
        'vfs' in pdfFonts ? pdfFonts.vfs : pdfFonts;
      const blob = await new Promise<Blob>((resolve) => {
        pdfMake.createPdf(definition).getBlob(resolve);
      });
      this.downloadBlob(blob, 'invoice.pdf');
    } catch (error) {
      throw new Error('Unable to generate the PDF.', { cause: error });
    }
  }

  /** Downloads a Blob through a temporary browser link. */
  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    try {
      link.href = url;
      link.download = filename;
      link.click();
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 0);
    }
  }
}
