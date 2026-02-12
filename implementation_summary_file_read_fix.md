# File Reading Fix for Uploads

## Overview
This update addresses a critical bug where uploaded files were being stored as filenames (strings) instead of their actual content (base64 Data URLs). This caused the backend to receive invalid data, likely leading to the reported issue of files being uploaded incorrectly (or corrupted/defaulting to PDF logic due to missing mime types).

## Changes Implemented

### 1. File Reading Logic (`components/steps/documents.tsx`)
-   Updated the `onChange` handlers for `drivers_license_upload`, `passport_upload`, and `green_card_upload`.
-   Implemented `FileReader` to read the selected file as a Data URL (`reader.readAsDataURL(file)`).
-   The `formData` is now updated with the full base64 string (e.g., `data:image/jpeg;base64,...`) instead of just the filename.

## Impact
-   **Frontend:** When a user selects a file, the application now correctly stores the file's binary data in memory.
-   **Backend:** The `app/api/submit/route.ts` (updated in the previous step) will now receive valid Data URIs.
    -   It can correctly extract the MIME type (e.g., `image/jpeg`, `application/pdf`).
    -   It can correctly decode the base64 content.
    -   It will upload the file to GHL with the correct Content-Type and extension.

## Verification
-   **Build:** The project builds successfully (`npm run build`).
-   **Logic:** The `FileReader` implementation is standard and ensures that `formData` contains the necessary data for the backend to process.

## Next Steps
-   Test the file upload again with real files.
-   The backend logs should now show correct MIME types (e.g., `Uploading drivers_license.png (image/jpeg)...` if a JPEG was uploaded but named .png, or ideally we'd fix the extension too, but GHL handles content-type well).
