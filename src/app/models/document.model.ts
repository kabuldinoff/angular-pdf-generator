export interface DocumentFormValue {
  customerName: string;
  projectTitle: string;
  contactEmail: string;
  description: string;
  issuerCompanyName: string;
  issuerStreet: string;
  issuerPostalCode: string;
  issuerCity: string;
  customerCompanyName: string;
  customerStreet: string;
  customerPostalCode: string;
  customerCity: string;
  date: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  price: string;
}

export type InvoiceItemControls = {
  [Key in keyof InvoiceItem]: import('@angular/forms').FormControl<string>;
};

export type DocumentFormControls = {
  customerName: import('@angular/forms').FormControl<string>;
  projectTitle: import('@angular/forms').FormControl<string>;
  contactEmail: import('@angular/forms').FormControl<string>;
  description: import('@angular/forms').FormControl<string>;
  issuerCompanyName: import('@angular/forms').FormControl<string>;
  issuerStreet: import('@angular/forms').FormControl<string>;
  issuerPostalCode: import('@angular/forms').FormControl<string>;
  issuerCity: import('@angular/forms').FormControl<string>;
  customerCompanyName: import('@angular/forms').FormControl<string>;
  customerStreet: import('@angular/forms').FormControl<string>;
  customerPostalCode: import('@angular/forms').FormControl<string>;
  customerCity: import('@angular/forms').FormControl<string>;
  date: import('@angular/forms').FormControl<string>;
  items: import('@angular/forms').FormArray<
    import('@angular/forms').FormGroup<InvoiceItemControls>
  >;
};

export interface InvoiceTotals {
  netto: number;
  vat: number;
  brutto: number;
}

export function parseAmount(value: string): number {
  const normalized = value.trim().replace(',', '.');
  const amount = Number(normalized);
  return Number.isFinite(amount) && amount >= 0 ? amount : 0;
}

export function calculateInvoiceTotals(items: InvoiceItem[]): InvoiceTotals {
  const netto = items.reduce((sum, item) => sum + parseAmount(item.price), 0);
  const vat = netto * 0.19;

  return {
    netto,
    vat,
    brutto: netto + vat,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

export function formatDate(value: string): string {
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day}.${month}.${year}` : value;
}
