import { TestBed } from '@angular/core/testing';
import { DocumentPreviewComponent } from './document-preview.component';

describe('DocumentPreviewComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentPreviewComponent],
    }).compileComponents();
  });

  it('should keep unbroken content inside the preview card and document page', () => {
    const fixture = TestBed.createComponent(DocumentPreviewComponent);
    const host = fixture.nativeElement as HTMLElement;
    host.style.width = '320px';
    document.body.appendChild(host);

    fixture.componentRef.setInput('document', {
      customerName: 'customer'.repeat(20),
      projectTitle: 'project'.repeat(20),
      contactEmail: 'contact@example.com',
      description: 'description'.repeat(80),
      issuerCompanyName: 'Issuer GmbH',
      issuerStreet: 'Issuer Street 1',
      issuerPostalCode: '10115',
      issuerCity: 'Berlin',
      customerCompanyName: 'Customer GmbH',
      customerStreet: 'Customer Street 2',
      customerPostalCode: '20095',
      customerCity: 'Hamburg',
      date: '2026-11-09',
      items: [{ description: 'Item', price: '1200,32' }],
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('customer'.repeat(20));
    expect(fixture.nativeElement.textContent).toContain(
      'contact@example.com',
    );

    const card = fixture.nativeElement.querySelector(
      '.preview-card',
    ) as HTMLElement;
    const documentPage = fixture.nativeElement.querySelector(
      '.document-page',
    ) as HTMLElement;

    try {
      expect(getComputedStyle(card).overflowWrap).toBe('anywhere');
      expect(getComputedStyle(card).overflow).toBe('hidden');
      expect(getComputedStyle(documentPage).overflowWrap).toBe('anywhere');
      expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth);
      expect(documentPage.scrollWidth).toBeLessThanOrEqual(
        documentPage.clientWidth,
      );
    } finally {
      host.remove();
    }
  });

  it('should format item prices consistently with invoice totals', () => {
    const fixture = TestBed.createComponent(DocumentPreviewComponent);

    fixture.componentRef.setInput('document', {
      customerName: 'Alex Customer',
      projectTitle: 'Invoice',
      contactEmail: 'contact@example.com',
      description: '',
      issuerCompanyName: 'Issuer GmbH',
      issuerStreet: 'Issuer Street 1',
      issuerPostalCode: '10115',
      issuerCity: 'Berlin',
      customerCompanyName: 'Customer GmbH',
      customerStreet: 'Customer Street 2',
      customerPostalCode: '20095',
      customerCity: 'Hamburg',
      date: '2026-11-09',
      items: [{ description: 'Item', price: '1200.32' }],
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('1.200,32 €');
  });
});
