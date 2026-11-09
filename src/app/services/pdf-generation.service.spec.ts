import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  calculateInvoiceTotals,
  DocumentFormValue,
  formatDate,
} from '../models/document.model';
import { PdfGenerationService } from './pdf-generation.service';

describe('PdfGenerationService', () => {
  let service: PdfGenerationService;

  const documentValue: DocumentFormValue = {
    customerName: 'Alex Customer',
    projectTitle: 'Onboarding workflow',
    contactEmail: 'contact@northwind.example',
    description: 'Digitize the onboarding request process.',
    issuerCompanyName: 'Issuer GmbH',
    issuerStreet: 'Issuer Street 1',
    issuerPostalCode: '10115',
    issuerCity: 'Berlin',
    customerCompanyName: 'Northwind Ltd.',
    customerStreet: 'Customer Street 2',
    customerPostalCode: '20095',
    customerCity: 'Hamburg',
    date: '2026-11-09',
    items: [
      { description: 'Consulting', price: '1200,32' },
      { description: 'Support', price: '' },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfGenerationService);
  });

  it('should map form values into the PDF document definition', () => {
    const definition = service.createDocumentDefinition(documentValue);
    expect(JSON.stringify(definition)).toContain('Onboarding workflow');
    expect(JSON.stringify(definition)).toContain('Northwind Ltd.');
    expect(JSON.stringify(definition)).toContain('contact@northwind.example');
    expect(JSON.stringify(definition)).toContain('Alex Customer');
    expect(JSON.stringify(definition)).toContain(
      'Digitize the onboarding request process.',
    );
    expect(JSON.stringify(definition)).toContain('1.200,32');
    expect(JSON.stringify(definition)).toContain('Invoice Total (Gross)');
    expect(JSON.stringify(definition)).toContain('09.11.2026');
    expect(definition).toEqual(
      jasmine.objectContaining({
        styles: jasmine.objectContaining({
          title: jasmine.objectContaining({ fontSize: 24 }),
        }),
      }),
    );
  });

  it('should calculate Net, 19% VAT, and Gross from item prices', () => {
    expect(
      calculateInvoiceTotals([
        { description: 'Consulting', price: '1200,32' },
        { description: 'Support', price: '' },
        { description: 'Review', price: '99.68' },
      ]),
    ).toEqual({
      netto: 1300,
      vat: 247,
      brutto: 1547,
    });
  });

  it('should format ISO dates for invoice output', () => {
    expect(formatDate('2026-11-09')).toBe('09.11.2026');
    expect(formatDate('')).toBe('');
  });

  it('should reject non-finite item prices for PDF output', () => {
    expect(() =>
      service.createDocumentDefinition({
        ...documentValue,
        items: [{ description: 'Invalid', price: 'not-a-number' }],
      }),
    ).toThrowError('Unable to map form data to a PDF document.');
  });

  it('should trigger a browser download for a generated Blob', fakeAsync(() => {
    const link = document.createElement('a');
    const clickSpy = spyOn(link, 'click');
    spyOn(document, 'createElement').and.returnValue(link);
    spyOn(URL, 'createObjectURL').and.returnValue('blob:invoice');
    const revokeSpy = spyOn(URL, 'revokeObjectURL');

    service.downloadBlob(new Blob(['pdf']), 'invoice.pdf');

    expect(link.download).toBe('invoice.pdf');
    expect(clickSpy).toHaveBeenCalled();
    tick();
    expect(revokeSpy).toHaveBeenCalledWith('blob:invoice');
  }));

  it('should generate a Blob and pass it to the download flow', async () => {
    const downloadSpy = spyOn(service, 'downloadBlob');

    await service.generate(documentValue);

    expect(downloadSpy).toHaveBeenCalledOnceWith(
      jasmine.any(Blob),
      'invoice.pdf',
    );
  });
});
