import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  calculateInvoiceTotals,
  DocumentFormValue,
  formatDate,
  formatCurrency,
} from '../../models/document.model';

@Component({
  selector: 'app-document-preview',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './document-preview.component.html',
  styleUrl: './document-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentPreviewComponent {
  readonly document = input.required<DocumentFormValue>();

  get netto(): string {
    return formatCurrency(calculateInvoiceTotals(this.document().items).netto);
  }

  get vat(): string {
    return formatCurrency(calculateInvoiceTotals(this.document().items).vat);
  }

  get brutto(): string {
    return formatCurrency(calculateInvoiceTotals(this.document().items).brutto);
  }

  get formattedDate(): string {
    return formatDate(this.document().date);
  }
}
