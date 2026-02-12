// Force Node.js runtime (not Edge) for full API compatibility
export const runtime = 'nodejs'
// Extend function timeout (max 60s on Pro, 10s on Hobby)
export const maxDuration = 60

const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || ""
const LOGO_URL = process.env.LOGO_URL || ""
const TOKEN_WEBHOOK_URL = process.env.TOKEN_WEBHOOK_URL || ""
const UPLOAD_ENDPOINT = process.env.UPLOAD_ENDPOINT || ""
const LOCATION_ID = process.env.LOCATION_ID || ""

export async function POST(req: Request) {
  console.log("[submit] API route called")
  console.log("[submit] WEBHOOK_URL:", WEBHOOK_URL ? `${WEBHOOK_URL.slice(0, 50)}...` : "NOT SET")
  console.log("[submit] TOKEN_WEBHOOK_URL:", TOKEN_WEBHOOK_URL ? "SET" : "NOT SET")
  console.log("[submit] UPLOAD_ENDPOINT:", UPLOAD_ENDPOINT ? "SET" : "NOT SET")

  try {
    const body = await req.json()
    console.log("[submit] Received payload keys:", Object.keys(body))

    // Fetch logo and embed as binary data (base64) under payload.binary.logo
    let logoBase64: string | null = null
    let logoMime = "image/png"
    let logoFilename = "logo.png"
    try {
      const logoResp = await fetch(LOGO_URL)
      if (logoResp.ok) {
        const buffer = Buffer.from(await logoResp.arrayBuffer())
        logoBase64 = buffer.toString("base64")
        const contentType = logoResp.headers.get("content-type")
        if (contentType) logoMime = contentType
        const disposition = logoResp.headers.get("content-disposition")
        if (disposition) {
          const match = disposition.match(/filename\s*=\s*"?([^";]+)/i)
          if (match?.[1]) logoFilename = match[1]
        }
      } else {
        console.warn("[submit] Failed to fetch logo:", logoResp.status)
      }
    } catch (e) {
      console.warn("[submit] Error fetching logo:", e)
    }

    const payload = { ...body } as any
    if (logoBase64) {
      payload.binary = {
        logo: {
          filename: logoFilename,
          mime_type: logoMime,
          data: logoBase64,
        },
      }
    }

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
        console.error("[submit] token webhook response missing access_token:", tokenJson)
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

      console.log(`[submit] Uploading ${filename} (${mimeType}) as "${name}"...`)

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

    // Upload files if present
    try {
      const fullName = `${payload.first_name || ""} ${payload.last_name || ""}`.trim() || "Applicant"

      // Check if we have any files to upload
      const filesToUpload = [
        {
          key: 'pdf_base64',
          filename: payload.pdf_filename || 'application.pdf',
          mime: payload.pdf_mime || 'application/pdf',
          urlKey: 'pdf_url',
          name: `Application ${fullName}`
        },
        {
          key: 'drivers_license_upload',
          filename: 'drivers_license.png',
          mime: 'image/png',
          urlKey: 'drivers_license_url',
          name: `${fullName} - Driver's License`
        },
        {
          key: 'passport_upload',
          filename: 'passport.png',
          mime: 'image/png',
          urlKey: 'passport_url',
          name: `${fullName} - Passport`
        },
        {
          key: 'green_card_upload',
          filename: 'green_card.png',
          mime: 'image/png',
          urlKey: 'green_card_url',
          name: `${fullName} - Green Card`
        }
      ]

      const hasFiles = filesToUpload.some(f => payload[f.key] && typeof payload[f.key] === 'string' && payload[f.key].length > 0)

      if (hasFiles) {
        const accessToken = await getAccessToken()
        console.log("[submit] received access token (length):", accessToken.length)

        for (const file of filesToUpload) {
          // Skip if URL already exists (pre-uploaded via /api/upload-files)
          if (payload[file.urlKey] && typeof payload[file.urlKey] === 'string' && payload[file.urlKey].startsWith('http')) {
            console.log(`[submit] ${file.key} already has URL, skipping upload:`, payload[file.urlKey])
            continue
          }

          if (payload[file.key] && typeof payload[file.key] === 'string' && payload[file.key].length > 0) {
            try {
              const url = await uploadFile(payload[file.key], file.filename, file.mime, file.name, accessToken)
              payload[file.urlKey] = url
              console.log(`[submit] ${file.key} uploaded successfully:`, url)
            } catch (err) {
              console.error(`[submit] Error uploading ${file.key}:`, err)
              payload[`${file.urlKey}_error`] = String(err)
            }
          }
        }
      }
    } catch (err) {
      console.error("[submit] Error during file uploads:", err)
    }

    // Strip raw base64 data before sending to n8n to reduce size
    delete (payload as any).pdf_base64
    delete (payload as any).drivers_license_upload
    delete (payload as any).passport_upload
    delete (payload as any).green_card_upload
    // Also remove signature base64 if desired, or keep it. Usually signature is small.
    // delete (payload as any).signature 

    // Send JSON only (form responses + signature + urls + binary.logo if available)
    let respText = ""
    let status = 500
    try {
      const forwarded = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      status = forwarded.status
      try {
        respText = await forwarded.text()
      } catch (e) {
        console.error("[submit] Error reading n8n response text:", e)
      }
    } catch (err) {
      console.error("[submit] Error calling webhook:", err)
      respText = "Failed to reach webhook"
    }

    console.log("[submit] webhook response", status, respText?.slice(0, 500))
    return new Response(respText, { status })
  } catch (err: any) {
    console.error("Error forwarding to webhook:", err)
    return new Response("Failed to forward payload", { status: 500 })
  }
}
