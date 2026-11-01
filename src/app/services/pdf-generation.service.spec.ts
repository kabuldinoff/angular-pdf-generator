import { TestBed } from '@angular/core/testing';
import { DocumentFormValue } from '../models/document.model';
import { PdfGenerationService } from './pdf-generation.service';

describe('PdfGenerationService', () => {
  let service: PdfGenerationService;

  const documentValue: DocumentFormValue = {
    customerName: 'Northwind Ltd.',
    projectTitle: 'Onboarding workflow',
    contactEmail: 'contact@northwind.example',
    description: 'Digitize the onboarding request process.',
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
    expect(JSON.stringify(definition)).toContain(
      'Digitize the onboarding request process.',
    );
    expect(definition).toEqual(
      jasmine.objectContaining({
        styles: jasmine.objectContaining({
          title: jasmine.objectContaining({ fontSize: 24 }),
        }),
      }),
    );
  });
});
