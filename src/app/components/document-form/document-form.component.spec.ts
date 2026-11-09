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

    component.form.patchValue({
      customerName: 'Northwind Ltd.',
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
    });
    component.items.at(0).setValue({
      description: 'Consulting',
      price: '1200,32',
    });

    expect(component.form.valid).toBeTrue();
  });

  it('should expose length validation errors for oversized values', () => {
    const fixture = TestBed.createComponent(DocumentFormComponent);
    const component = fixture.componentInstance;

    component.form.controls.customerName.setValue('a'.repeat(81));
    component.form.controls.projectTitle.setValue('a'.repeat(121));
    component.form.controls.description.setValue('a'.repeat(1001));

    expect(component.form.controls.customerName.hasError('maxlength')).toBeTrue();
    expect(component.form.controls.projectTitle.hasError('maxlength')).toBeTrue();
    expect(component.form.controls.description.hasError('maxlength')).toBeTrue();
  });

  it('should allow notes to remain empty', () => {
    const fixture = TestBed.createComponent(DocumentFormComponent);
    const component = fixture.componentInstance;

    expect(component.form.controls.description.hasError('required')).toBeFalse();
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

  it('should add and remove invoice items while keeping one row', () => {
    const fixture = TestBed.createComponent(DocumentFormComponent);
    const component = fixture.componentInstance;

    component.addItem();
    expect(component.items.length).toBe(2);

    component.removeItem(1);
    component.removeItem(0);
    expect(component.items.length).toBe(1);
  });
});
