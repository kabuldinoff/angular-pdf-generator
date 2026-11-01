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
      Validators.required,
      Validators.maxLength(1000),
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
    value: Partial<DocumentFormValue>,
  ): DocumentFormValue {
    return {
      customerName: value.customerName ?? '',
      projectTitle: value.projectTitle ?? '',
      contactEmail: value.contactEmail ?? '',
      description: value.description ?? '',
    };
  }
}
