import { Component } from '@angular/core';
import { DocumentFormComponent } from './components/document-form/document-form.component';

@Component({
  selector: 'app-root',
  imports: [DocumentFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
