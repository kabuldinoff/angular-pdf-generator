import { Injectable } from '@angular/core';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DocumentFormValue } from '../models/document.model';

pdfMake.vfs = pdfFonts.vfs;

@Injectable({ providedIn: 'root' })
export class PdfGenerationService {
  createDocumentDefinition(data: DocumentFormValue): TDocumentDefinitions {
    try {
      return {
        content: [
          { text: 'Business Request', style: 'header' },
          { text: data.projectTitle, style: 'title' },
          {
            table: {
              widths: ['auto', '*'],
              body: [
                ['Customer', data.customerName],
                ['Contact email', data.contactEmail],
              ],
            },
            layout: 'lightHorizontalLines',
            margin: [0, 0, 0, 16],
          },
          { text: 'Description', style: 'section' },
          { text: data.description || 'No description provided.' },
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

  generate(data: DocumentFormValue): void {
    try {
      const definition = this.createDocumentDefinition(data);
      pdfMake.createPdf(definition).download('business-request.pdf');
    } catch (error) {
      throw new Error('Unable to generate the PDF.', { cause: error });
    }
  }
}
