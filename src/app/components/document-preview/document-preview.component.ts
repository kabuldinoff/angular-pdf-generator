import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DocumentFormValue } from '../../models/document.model';

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
}
