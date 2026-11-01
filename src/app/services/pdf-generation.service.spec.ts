import { fakeAsync, TestBed, tick } from '@angular/core/testing';
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

  it('should trigger a browser download for a generated Blob', fakeAsync(() => {
    const link = document.createElement('a');
    const clickSpy = spyOn(link, 'click');
    spyOn(document, 'createElement').and.returnValue(link);
    spyOn(URL, 'createObjectURL').and.returnValue('blob:business-request');
    const revokeSpy = spyOn(URL, 'revokeObjectURL');

    service.downloadBlob(new Blob(['pdf']), 'business-request.pdf');

    expect(link.download).toBe('business-request.pdf');
    expect(clickSpy).toHaveBeenCalled();
    tick();
    expect(revokeSpy).toHaveBeenCalledWith('blob:business-request');
  }));

  it('should generate a Blob and pass it to the download flow', async () => {
    const downloadSpy = spyOn(service, 'downloadBlob');

    await service.generate(documentValue);

    expect(downloadSpy).toHaveBeenCalledOnceWith(
      jasmine.any(Blob),
      'business-request.pdf',
    );
  });
});
