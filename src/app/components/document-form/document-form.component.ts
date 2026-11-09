import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, map } from 'rxjs';
import {
  DocumentFormControls,
  DocumentFormValue,
  InvoiceItem,
  InvoiceItemControls,
} from '../../models/document.model';
import { PdfGenerationService } from '../../services/pdf-generation.service';
import { DocumentPreviewComponent } from '../document-preview/document-preview.component';

@Component({
  selector: 'app-document-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    DocumentPreviewComponent,
  ],
  templateUrl: './document-form.component.html',
  styleUrl: './document-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly pdfGenerationService = inject(PdfGenerationService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly form = this.formBuilder.group<DocumentFormControls>({
    customerName: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(80),
    ]),
    projectTitle: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(120),
    ]),
    contactEmail: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.email,
    ]),
    description: this.formBuilder.nonNullable.control('', [
      Validators.maxLength(1000),
    ]),
    issuerCompanyName: this.requiredTextControl(120),
    issuerStreet: this.requiredTextControl(120),
    issuerPostalCode: this.requiredTextControl(20),
    issuerCity: this.requiredTextControl(80),
    customerCompanyName: this.requiredTextControl(120),
    customerStreet: this.requiredTextControl(120),
    customerPostalCode: this.requiredTextControl(20),
    customerCity: this.requiredTextControl(80),
    date: this.formBuilder.nonNullable.control(
      new Date().toISOString().slice(0, 10),
      Validators.required,
    ),
    items: this.formBuilder.array<FormGroup<InvoiceItemControls>>([
      this.createItem(),
    ]),
  });

  readonly previewDocument = signal<DocumentFormValue>(this.toDocumentValue(this.form.getRawValue()));

  constructor() {
    this.form.valueChanges
      .pipe(
        debounceTime(300),
        map((value) => this.toDocumentValue(value)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => this.previewDocument.set(value));
  }

  get items(): FormArray<FormGroup<InvoiceItemControls>> {
    return this.form.controls.items;
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  async downloadPdf(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Please complete the required fields.', 'Dismiss', {
        duration: 4000,
      });
      return;
    }

    try {
      await this.pdfGenerationService.generate(this.form.getRawValue());
      this.snackBar.open('PDF downloaded successfully.', 'Dismiss', {
        duration: 4000,
      });
    } catch {
      this.snackBar.open('Error generating PDF.', 'Dismiss', {
        duration: 5000,
      });
    }
  }

  private toDocumentValue(
    value: Partial<Omit<DocumentFormValue, 'items'>> & {
      items?: Array<Partial<InvoiceItem>>;
    },
  ): DocumentFormValue {
    return {
      customerName: value.customerName ?? '',
      projectTitle: value.projectTitle ?? '',
      contactEmail: value.contactEmail ?? '',
      description: value.description ?? '',
      issuerCompanyName: value.issuerCompanyName ?? '',
      issuerStreet: value.issuerStreet ?? '',
      issuerPostalCode: value.issuerPostalCode ?? '',
      issuerCity: value.issuerCity ?? '',
      customerCompanyName: value.customerCompanyName ?? '',
      customerStreet: value.customerStreet ?? '',
      customerPostalCode: value.customerPostalCode ?? '',
      customerCity: value.customerCity ?? '',
      date: value.date ?? '',
      items: (value.items ?? []).map((item) => ({
        description: item.description ?? '',
        price: item.price ?? '',
      })),
    };
  }

  private createItem(): FormGroup<InvoiceItemControls> {
    return this.formBuilder.group<InvoiceItemControls>({
      description: this.formBuilder.nonNullable.control('', [
        Validators.required,
        Validators.maxLength(200),
      ]),
      price: this.formBuilder.nonNullable.control('', [
        Validators.pattern(/^\s*$|^\s*\d+(?:[.,]\d{1,2})?\s*$/),
      ]),
    });
  }

  private requiredTextControl(maxLength: number) {
    return this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(maxLength),
    ]);
  }
}
