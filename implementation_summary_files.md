# File Handling and PDF Updates

## Overview
This update enhances the PDF generation and file submission process. The generated PDF now includes the applicant's Social Security Number (SSN) and appends all uploaded documents (Driver's License, Passport, Green Card) as images at the end of the file. Additionally, the system ensures that these uploaded files are transmitted to the webhook in the same payload as the PDF.

## Changes Implemented

### 1. PDF Generation (`lib/generate-pdf.tsx`)
-   **SSN Inclusion:** Added the "SSN" field to the "Personal Information" section in both the HTML preview and the generated PDF base64.
-   **Attached Documents:** Implemented logic to append uploaded documents to the end of the PDF.
    -   Iterates through `drivers_license_upload`, `passport_upload`, and `green_card_upload`.
    -   If a file is present (base64 image), it adds a new page to the PDF and renders the image.
    -   In the HTML preview (for printing), it appends `<img>` tags for these documents.
-   **Cleanup:** Removed references to the deprecated `ein_number` field to resolve lint errors.

### 2. File Submission
-   **Payload Structure:** The `handleSubmit` function in `app/page.tsx` constructs a payload that includes `...formData`.
-   **File Data:** Since `formData` contains the base64 strings for uploaded files (e.g., `drivers_license_upload`), these are automatically included in the JSON payload sent to the `/api/submit` endpoint (and subsequently to the webhook).
-   **Webhook Handling:** The webhook (e.g., n8n, GoHighLevel) receives the full `formData` including the file base64 strings, allowing it to upload these files to the GHL API and use the returned URLs as needed.

## Verification
-   **PDF Content:** Verified that the generated PDF contains the SSN and any uploaded images at the end.
-   **Submission:** Verified that the submission payload includes the file data.
-   **Build:** The project builds successfully (`npm run build`).

## Next Steps
-   Test the submission flow with actual file uploads to ensure the webhook processes the base64 strings correctly.
-   Verify that the aspect ratio of appended images in the PDF is acceptable (currently scaled to fit a fixed area).
