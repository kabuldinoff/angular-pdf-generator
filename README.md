# Invoice Form-to-PDF Web Client

A professional Angular web client that captures invoice details and generates a
downloadable PDF directly in the browser.

The application uses Angular Standalone Components, strict TypeScript,
Reactive Forms, Angular Material, and client-side PDF generation with
`pdfmake`. A live HTML preview helps users review the document before
downloading it.

## Local setup

```bash
npm install
ng serve
```

Open `http://localhost:4200/` in a browser.

## Architecture Overview

Angular standalone components use typed Reactive Forms. Debounced form changes
update a signal consumed by the live preview. Valid data is mapped by
`PdfGenerationService` into a typed `pdfmake` definition, loaded lazily in the
browser, and downloaded as a PDF Blob. Invoice items can be added dynamically;
their prices are summed as Net, 19% VAT is calculated, and the gross total is
shown as `Invoice Total (Gross)`.

The interface uses a split-screen layout with the Material form on the left
and an HTML document preview on the right. Form `valueChanges` are normalized
into the preview model and debounced by 300 ms before the standalone preview
component receives the latest state.

## Invoice fields

- Issuer and customer company names
- Street, postal code, and city for both parties
- Editable invoice date, defaulting to today
- Contact name, email, invoice title, and notes
- Any number of numbered invoice items

Item prices accept decimal values with either a dot or comma separator. Empty
prices are treated as `0`. Item prices are summed as Net, 19% VAT is added, and the final Gross value is
labeled `Invoice Total (Gross)`. Amounts are displayed in EUR with cent
precision. Invoice dates are displayed as `DD.MM.YYYY` in the preview and PDF,
while notes remain optional.

## Development

Run the unit tests with:

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

Build the application for production with:

```bash
npm run build
```

Run lint and the Lighthouse CI quality gate with:

```bash
npm run lint
npm run lighthouse
```

## Engineering Standards

- Target Lighthouse scores above 90 for Performance, Accessibility, Best
  Practices, and SEO.
- Mobile-first responsive design stacks the form and preview vertically on
  small screens.
- Standalone Angular components, strict TypeScript, debounced preview updates,
  and focused unit tests keep the core business logic maintainable.
- AI-assisted development and pull-request review tools such as GitHub Copilot
  and CodeRabbit may be used, with human review remaining responsible for the
  final changes.

The Lighthouse gate requires a production build and checks Performance,
Accessibility, Best Practices, and SEO at a minimum score of 90 each:

```bash
npm run build
npm run lighthouse
```

## Showcase

![Web Client Interface](docs/ui-screenshot.png)

[View the generated PDF example](docs/showcase-invoice.pdf)

## GitHub Pages

GitHub Actions runs lint, tests, builds the Angular app with the repository
base path, and deploys the static output to GitHub Pages when changes are
pushed to `main`. The workflow is defined in
`.github/workflows/deploy-pages.yml`.

## License

This project is released under the MIT License.
