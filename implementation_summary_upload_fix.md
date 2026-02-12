# Enhanced File Upload Implementation

## Overview
This update refines the file upload process to be more robust, dynamic, and informative. It specifically addresses the user's request to apply the same upload logic used for the PDF to all other attached documents (Driver's License, Passport, Green Card).

## Changes Implemented

### 1. Dynamic Mime Type Detection
-   The `uploadFile` helper in `app/api/submit/route.ts` now intelligently detects the MIME type from the Data URI prefix (e.g., `data:image/jpeg;base64,...`).
-   This ensures that if a user uploads a JPEG, it is uploaded to GHL as a JPEG, not forced to PNG.
-   Falls back to a default MIME type if no prefix is found.

### 2. Descriptive File Naming
-   Files uploaded to GHL now have human-readable names derived from the applicant's name.
-   Example: `John Doe - Driver's License` instead of just `drivers_license.png`.
-   This makes it much easier to identify files in the GHL media library.

### 3. Comprehensive Logging
-   Added logging of received payload keys to verify what data is arriving at the server.
-   Added detailed logs for each step of the upload process: token retrieval, individual file upload start/success/failure.

### 4. Unified Upload Logic
-   The `filesToUpload` array now centrally defines all files to be processed (`pdf_base64`, `drivers_license_upload`, `passport_upload`, `green_card_upload`).
-   The same robust `uploadFile` function is used for all of them, ensuring consistent handling of authentication, headers, and response parsing.

## Verification
-   **Build:** The project builds successfully (`npm run build`).
-   **Logic:** The code iterates through all defined file keys. If a key exists and has content, it attempts to upload it using the GHL token and replaces the base64 content with the returned URL in the final payload.

## Next Steps
-   Test the submission again. The logs (server-side) will now clearly show which files are being detected and uploaded.
-   The webhook should receive `drivers_license_url`, `passport_url`, etc., pointing to the hosted files.
