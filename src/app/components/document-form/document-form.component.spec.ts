import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DocumentFormComponent } from './document-form.component';

describe('DocumentFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentFormComponent],
    }).compileComponents();
  });

  it('should create an invalid form until required values are supplied', () => {
    const fixture = TestBed.createComponent(DocumentFormComponent);
    const component = fixture.componentInstance;

    expect(component.form.invalid).toBeTrue();

    component.form.setValue({
      customerName: 'Northwind Ltd.',
      projectTitle: 'Onboarding workflow',
      contactEmail: 'contact@northwind.example',
      description: 'Digitize the onboarding request process.',
    });

    expect(component.form.valid).toBeTrue();
  });

  it('should update the preview after a 300 ms debounce', fakeAsync(() => {
    const fixture = TestBed.createComponent(DocumentFormComponent);
    const component = fixture.componentInstance;

    component.form.controls.projectTitle.setValue('Updated project');
    tick(299);
    expect(component.previewDocument().projectTitle).toBe('');

    tick(1);
    expect(component.previewDocument().projectTitle).toBe('Updated project');
  }));
});
