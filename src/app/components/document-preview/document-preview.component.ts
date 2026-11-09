import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  calculateInvoiceTotals,
  DocumentFormValue,
  formatDate,
  formatCurrency,
  parseAmount,
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

  /** Formats the invoice Net total for display. */
  get netto(): string {
    return formatCurrency(calculateInvoiceTotals(this.document().items).netto);
  }

  /** Formats the invoice VAT total for display. */
  get vat(): string {
    return formatCurrency(calculateInvoiceTotals(this.document().items).vat);
  }

  /** Formats the invoice Gross total for display. */
  get brutto(): string {
    return formatCurrency(calculateInvoiceTotals(this.document().items).brutto);
  }

  /** Formats the invoice date for display. */
  get formattedDate(): string {
    return formatDate(this.document().date);
  }

  /** Formats an item price using the shared invoice currency formatter. */
  formatItemPrice(price: string): string {
    return formatCurrency(parseAmount(price));
  }

}
