export interface DocumentFormValue {
  customerName: string;
  projectTitle: string;
  contactEmail: string;
  description: string;
}

export type DocumentFormControls = {
  [Key in keyof DocumentFormValue]: import('@angular/forms').FormControl<string>;
};
