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
    });
    fixture.detectChanges();

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
});
