// Force Node.js runtime (not Edge) for full API compatibility
export const runtime = 'nodejs'
// Extend function timeout (max 60s on Pro, 10s on Hobby)
export const maxDuration = 60

const TOKEN_WEBHOOK_URL = process.env.TOKEN_WEBHOOK_URL || ""
const UPLOAD_ENDPOINT = process.env.UPLOAD_ENDPOINT || ""
const LOCATION_ID = process.env.LOCATION_ID || ""

export async function POST(req: Request) {
    console.log("[upload-files] API route called")

    try {
        const body = await req.json()
        const { first_name, last_name, drivers_license_upload, passport_upload, green_card_upload } = body

        const fullName = `${first_name || ""} ${last_name || ""}`.trim() || "Applicant"

        // Helper to get access token
        const getAccessToken = async () => {
            const tokenResp = await fetch(TOKEN_WEBHOOK_URL, { method: "POST" })
            const tokenJson = await tokenResp.json()

            const extractToken = (val: any): string | null => {
                if (!val) return null
                if (typeof val === "string") return null
                if (val.access_token && typeof val.access_token === "string") return val.access_token
                if (Array.isArray(val)) {
                    for (const item of val) {
                        const t = extractToken(item)
                        if (t) return t
                    }
                }
                if (val.data) {
                    const t = extractToken(val.data)
                    if (t) return t
                }
                return null
            }

            const token = extractToken(tokenJson)
            if (!token) {
                console.error("[upload-files] token webhook response missing access_token:", tokenJson)
                throw new Error("No access_token returned from token webhook")
            }
            return token
        }

        // Helper to upload file
        const uploadFile = async (base64Data: string, filename: string, defaultMime: string, name: string, accessToken: string) => {
            // Handle data URI scheme if present and extract mime
            let mimeType = defaultMime
            let base64Content = base64Data

            if (base64Data.includes("base64,")) {
                const parts = base64Data.split("base64,")
                base64Content = parts[1]
                const mimeMatch = parts[0].match(/:(.*?);/)
                if (mimeMatch) {
                    mimeType = mimeMatch[1]
                }
            }

            const buffer = Buffer.from(base64Content, "base64")

            const uploadForm = new FormData()
            uploadForm.append("file", new Blob([buffer], { type: mimeType }), filename)
            uploadForm.append("hosted", "false")
            uploadForm.append("name", name)
            if (LOCATION_ID) uploadForm.append("locationId", LOCATION_ID)

            console.log(`[upload-files] Uploading ${filename} (${mimeType}) as "${name}"...`)

            const uploadResp = await fetch(UPLOAD_ENDPOINT, {
                method: "POST",
                headers: {
                    Version: "2021-07-28",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: uploadForm,
            })

            const uploadText = await uploadResp.text()
            let uploadJson: any = {}
            try {
                uploadJson = JSON.parse(uploadText)
            } catch {
                uploadJson = {}
            }

            if (!uploadResp.ok) {
                throw new Error(`Upload failed ${uploadResp.status}: ${uploadText}`)
            }

            return uploadJson.url ||
                uploadJson.location ||
                uploadJson?.data?.url ||
                uploadJson?.data?.location ||
                uploadJson?.result?.url || ""
        }

        // Get access token
        const accessToken = await getAccessToken()
        console.log("[upload-files] received access token (length):", accessToken.length)

        // Upload each file and collect URLs
        const result: {
            drivers_license_url?: string
            passport_url?: string
            green_card_url?: string
        } = {}

        const filesToUpload = [
            {
                data: drivers_license_upload,
                filename: 'drivers_license.png',
                mime: 'image/png',
                urlKey: 'drivers_license_url' as const,
                name: `${fullName} - Driver's License`
            },
            {
                data: passport_upload,
                filename: 'passport.png',
                mime: 'image/png',
                urlKey: 'passport_url' as const,
                name: `${fullName} - Passport`
            },
            {
                data: green_card_upload,
                filename: 'green_card.png',
                mime: 'image/png',
                urlKey: 'green_card_url' as const,
                name: `${fullName} - Green Card`
            }
        ]

        for (const file of filesToUpload) {
            if (file.data && typeof file.data === 'string' && file.data.length > 0 && file.data.startsWith('data:')) {
                try {
                    const url = await uploadFile(file.data, file.filename, file.mime, file.name, accessToken)
                    result[file.urlKey] = url
                    console.log(`[upload-files] ${file.urlKey} uploaded successfully:`, url)
                } catch (err) {
                    console.error(`[upload-files] Error uploading ${file.urlKey}:`, err)
                }
            }
        }

        console.log("[upload-files] Upload complete, URLs:", result)
        return Response.json(result, { status: 200 })
    } catch (err: any) {
        console.error("[upload-files] Error:", err)
        return Response.json({ error: err.message || "Upload failed" }, { status: 500 })
    }
}
