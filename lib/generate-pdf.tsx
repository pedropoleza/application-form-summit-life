import type { FormData } from "@/app/page"
import { translations, type Language } from "@/lib/translations"
import jsPDF from "jspdf"

export async function generatePDF(
  formData: FormData,
  language: Language,
  options?: {
    sendToWebhook?: boolean
    webhookUrl?: string
    returnBase64?: boolean
    skipPrint?: boolean
    // Storage URLs from GHL upload (optional - for PDF regeneration after upload)
    storageUrls?: {
      drivers_license_url?: string
      passport_url?: string
      green_card_url?: string
    }
  },
) {
  const t = translations[language]

  // prepare masked sensitive fields and upload links
  const maskedRouting = formData.routing_number ? `****${String(formData.routing_number).slice(-4)}` : "N/A"
  const maskedAccount = formData.account_number ? `****${String(formData.account_number).slice(-4)}` : "N/A"
  const driversLicenseLink = formData.drivers_license_upload ? formData.drivers_license_upload : "N/A"
  const passportLink = formData.passport_upload ? formData.passport_upload : "N/A"
  const greenCardLink = formData.green_card_upload ? formData.green_card_upload : "N/A"

  // Create a printable HTML document
  let printWindow: Window | null = null
  if (!options?.skipPrint) {
    printWindow = window.open("", "_blank")
    if (!printWindow) {
      // If popup blocked and we're only generating base64, continue; otherwise warn
      if (!options?.returnBase64) {
        alert("Please allow popups to download the PDF")
        return
      }
    }
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${language === "pt" ? "Solicitação de Seguro de Vida" : language === "es" ? "Solicitud de Seguro de Vida" : "Life Insurance Application"}</title>
      <style>
        @media print {
          @page { margin: 1.5cm; }
          body { margin: 0; }
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 11pt;
          line-height: 1.4;
          color: #000;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .logo { text-align: center; margin-bottom: 20px; }
        .logo img { max-width: 200px; }
        .header {
          background: #4C7AF2;
          color: white;
          padding: 15px;
          text-align: center;
          margin-bottom: 20px;
          border-radius: 5px;
        }
        .header h1 { margin: 0; font-size: 24pt; }
        .section {
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        .section-title {
          background: #f0f2f5;
          color: #4C7AF2;
          padding: 10px;
          font-size: 14pt;
          font-weight: bold;
          margin-bottom: 15px;
          border-radius: 3px;
        }
        .field {
          margin-bottom: 10px;
          display: flex;
          page-break-inside: avoid;
        }
        .field-label {
          font-weight: bold;
          color: #505050;
          min-width: 200px;
          flex-shrink: 0;
        }
        .field-value {
          flex-grow: 1;
        }
        .divider {
          border-top: 1px solid #ddd;
          margin: 15px 0;
        }
        .beneficiary {
          background: #fafafc;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 3px;
        }
        .beneficiary-title {
          color: #4C7AF2;
          font-weight: bold;
          margin-bottom: 10px;
          font-size: 12pt;
        }
        .date-stamp {
          text-align: right;
          color: #787878;
          font-size: 9pt;
          margin-bottom: 15px;
        }
      </style>
    </head>
    <body>
      <div class="logo">
        <img src={process.env.NEXT_PUBLIC_LOGO_URL_LIGHT || "https://storage.googleapis.com/msgsndr/y12SZwzf4UWpjHMRpTe1/media/65138f2bc9753eaaeea07a8a.png"} alt="Logo" />
      </div>
      
      <div class="header">
        <h1>${language === "pt" ? "Solicitação de Seguro de Vida" : language === "es" ? "Solicitud de Seguro de Vida" : "Life Insurance Application"}</h1>
      </div>
      
      <div class="date-stamp">
        ${new Date().toLocaleDateString(language === "pt" ? "pt-BR" : language === "es" ? "es-ES" : "en-US")}
      </div>
      
      <div class="section">
        <div class="section-title">${t.personalInfo}</div>
        <div class="field"><span class="field-label">${t.firstName}:</span><span class="field-value">${formData.first_name || "N/A"}</span></div>
        <div class="field"><span class="field-label">${t.lastName}:</span><span class="field-value">${formData.last_name || "N/A"}</span></div>
        <div class="field"><span class="field-label">${t.email}:</span><span class="field-value">${formData.email || "N/A"}</span></div>
        <div class="field"><span class="field-label">${t.phone}:</span><span class="field-value">${formData.phone || "N/A"}</span></div>
        <div class="field"><span class="field-label">${t.address}:</span><span class="field-value">${formData.address_line || "N/A"}</span></div>
        <div class="field"><span class="field-label">${t.dateOfBirth}:</span><span class="field-value">${formData.dob || "N/A"}</span></div>
        <div class="field"><span class="field-label">${t.height}:</span><span class="field-value">${formData.height_ft_in || "N/A"}</span></div>
        <div class="field"><span class="field-label">${t.weight}:</span><span class="field-value">${formData.weight_lbs || "N/A"} lbs</span></div>
        <div class="field"><span class="field-label">${t.ssn}:</span><span class="field-value">${formData.ssn || "N/A"}</span></div>
      </div>
      <div class="divider"></div>
      
      <div class="section">
        <div class="section-title">${t.documents}</div>
        <div class="field"><span class="field-label">${t.hasDriversLicense}:</span><span class="field-value">${formData.has_drivers_license === "Yes" ? t.yes : t.no}</span></div>
        <div class="field"><span class="field-label">${t.bornInUSA}:</span><span class="field-value">${formData.born_in_usa === "Yes" ? t.yes : t.no}</span></div>
        ${formData.born_in_usa === "Yes" ? `<div class="field"><span class="field-label">${t.stateOfBirth}:</span><span class="field-value">${formData.state_of_birth || "N/A"}</span></div>` : ""}
        <div class="field"><span class="field-label">${t.hasValidVisa}:</span><span class="field-value">${formData.has_valid_visa === "Yes" ? t.yes : t.no}</span></div>
        ${formData.has_valid_visa === "Yes"
      ? `
          <div class="field"><span class="field-label">${t.visaType}:</span><span class="field-value">${formData.visa_type || "N/A"}</span></div>
          <div class="field"><span class="field-label">${t.visaExpirationDate}:</span><span class="field-value">${formData.visa_expiration_date || "N/A"}</span></div>
        `
      : ""
    }
        <div class="field"><span class="field-label">${t.hasGreenCard}:</span><span class="field-value">${formData.has_green_card === "Yes" ? t.yes : t.no}</span></div>
      </div>
      <div class="divider"></div>
      
      <div class="section">
        <div class="section-title">${t.employment}</div>
        <div class="field"><span class="field-label">${t.occupation}:</span><span class="field-value">${formData.occupation || "N/A"}</span></div>
        <div class="field"><span class="field-label">${t.employerName}:</span><span class="field-value">${formData.employer_name || "N/A"}</span></div>
        <div class="field"><span class="field-label">${t.timeWorked}:</span><span class="field-value">${formData.time_worked || "N/A"}</span></div>
        <div class="field"><span class="field-label">${t.monthlySalaryUsd}:</span><span class="field-value">$${formData.monthly_salary_usd || "N/A"}</span></div>
        <div class="field"><span class="field-label">${t.assetsDescription}:</span><span class="field-value">${formData.assets_description || "N/A"}</span></div>
        <div class="field"><span class="field-label">${t.ownBusiness}:</span><span class="field-value">${formData.has_business === "Yes" ? t.yes : t.no}</span></div>
        ${formData.has_business === "Yes"
      ? `
          <div class="field"><span class="field-label">${t.businessName}:</span><span class="field-value">${formData.business_name || "N/A"}</span></div>
          <div class="field"><span class="field-label">${t.businessAddress}:</span><span class="field-value">${formData.business_address || "N/A"}</span></div>
        `
      : ""
    }
      </div>
      <div class="divider"></div>
      
      <div class="section">
        <div class="section-title">${t.banking}</div>
        <div class="field"><span class="field-label">${t.bankName}:</span><span class="field-value">${formData.bank_name || "N/A"}</span></div>
        <div class="field"><span class="field-label">Routing Number:</span><span class="field-value">${maskedRouting}</span></div>
        <div class="field"><span class="field-label">Account Number:</span><span class="field-value">${maskedAccount}</span></div>
        <div class="field"><span class="field-label">${t.accountType}:</span><span class="field-value">${formData.account_type || "N/A"}</span></div>
        <div class="field"><span class="field-label">${t.bestDayToDebit}:</span><span class="field-value">${formData.best_day_to_debit || "N/A"}</span></div>
        <div class="field"><span class="field-label">${t.hasCurrentLifeInsurance}:</span><span class="field-value">${formData.has_current_life_insurance === "Yes" ? t.yes : t.no}</span></div>
        ${formData.has_current_life_insurance === "Yes"
      ? `
          <div class="field"><span class="field-label">${t.insuranceCompanyName}:</span><span class="field-value">${formData.ins_company_name || "N/A"}</span></div>
          <div class="field"><span class="field-label">${t.policyNumber}:</span><span class="field-value">${formData.policy_number || "N/A"}</span></div>
          <div class="field"><span class="field-label">${t.coverageAmountUSD}:</span><span class="field-value">$${formData.coverage_amount_usd || "N/A"}</span></div>
        `
      : ""
    }
      </div>
      <div class="divider"></div>
      
      <div class="section">
        <div class="section-title">Medical / Visits</div>
        <div class="field"><span class="field-label">Visited doctor in US:</span><span class="field-value">${formData.visited_doctor_us === "Yes" ? t.yes : t.no}</span></div>
        <div class="field"><span class="field-label">${t.lastVisitDate}:</span><span class="field-value">${formData.last_visit_date || "N/A"}</span></div>
        <div class="field"><span class="field-label">Doctor Name:</span><span class="field-value">${formData.doctor_name || "N/A"}</span></div>
        <div class="field"><span class="field-label">Doctor Phone:</span><span class="field-value">${formData.doctor_phone || "N/A"}</span></div>
        <div class="field"><span class="field-label">Visit Reason:</span><span class="field-value">${formData.visit_reason || "N/A"}</span></div>
        <div class="field"><span class="field-label">Visit Result:</span><span class="field-value">${formData.visit_result || "N/A"}</span></div>
        <div class="field"><span class="field-label">Has pre-existing disease:</span><span class="field-value">${formData.has_preexisting_disease === "Yes" ? t.yes : t.no}</span></div>
        <div class="field"><span class="field-label">Recent weight change:</span><span class="field-value">${formData.recent_weight_change || "N/A"}</span></div>
        <div class="field"><span class="field-label">Weight change reason:</span><span class="field-value">${formData.weight_change_reason || "N/A"}</span></div>
      </div>
      <div class="divider"></div>

      <div class="section">
        <div class="section-title">Habits & Background</div>
        <div class="field"><span class="field-label">Used nicotine (5y):</span><span class="field-value">${formData.used_nicotine_5y === "Yes" ? t.yes : t.no}</span></div>
        <div class="field"><span class="field-label">Product Type:</span><span class="field-value">${formData.nicotine_product_type || "N/A"}</span></div>
        <div class="field"><span class="field-label">Qty Per Day:</span><span class="field-value">${formData.qty_per_day || "N/A"}</span></div>
        <div class="field"><span class="field-label">Last Use Date:</span><span class="field-value">${formData.last_use_date || "N/A"}</span></div>
        <div class="field"><span class="field-label">Insurance declined history:</span><span class="field-value">${formData.insurance_declined_history || "N/A"}</span></div>
        <div class="field"><span class="field-label">Driving violations:</span><span class="field-value">${formData.driving_violations || "N/A"}</span></div>
        <div class="field"><span class="field-label">Criminal record:</span><span class="field-value">${formData.criminal_record || "N/A"}</span></div>
        <div class="field"><span class="field-label">Bankruptcy involved:</span><span class="field-value">${formData.bankruptcy_involved || "N/A"}</span></div>
        <div class="field"><span class="field-label">Pending life/DI claim (12m):</span><span class="field-value">${formData.pending_life_di_claim_12m || "N/A"}</span></div>
        <div class="field"><span class="field-label">Work disability (5y):</span><span class="field-value">${formData.work_disability_5y || "N/A"}</span></div>
        <div class="field"><span class="field-label">Hazardous activities:</span><span class="field-value">${formData.hazard_activities || "N/A"}</span></div>
        <div class="field"><span class="field-label">Hazard details:</span><span class="field-value">${formData.hazard_details || "N/A"}</span></div>
        <div class="field"><span class="field-label">Non-passenger aviation:</span><span class="field-value">${formData.non_passenger_aviation || "N/A"}</span></div>
        <div class="field"><span class="field-label">Aviation details:</span><span class="field-value">${formData.aviation_details || "N/A"}</span></div>
      </div>
      <div class="divider"></div>

      <div class="section">
        <div class="section-title">Health Checklist</div>
        <div class="field"><span class="field-label">Cardiovascular:</span><span class="field-value">${formData.cardio || "N/A"} ${formData.details_cardio ? `- ${formData.details_cardio}` : ""}</span></div>
        <div class="field"><span class="field-label">Respiratory:</span><span class="field-value">${formData.respiratory || "N/A"} ${formData.details_respiratory ? `- ${formData.details_respiratory}` : ""}</span></div>
        <div class="field"><span class="field-label">Digestive:</span><span class="field-value">${formData.digestive || "N/A"} ${formData.details_digestive ? `- ${formData.details_digestive}` : ""}</span></div>
        <div class="field"><span class="field-label">Neurological:</span><span class="field-value">${formData.neuro || "N/A"} ${formData.details_neuro ? `- ${formData.details_neuro}` : ""}</span></div>
        <div class="field"><span class="field-label">Endocrine:</span><span class="field-value">${formData.endocrine || "N/A"} ${formData.details_endocrine ? `- ${formData.details_endocrine}` : ""}</span></div>
        <div class="field"><span class="field-label">MSK / Skin:</span><span class="field-value">${formData.msk_skin || "N/A"} ${formData.details_msk_skin ? `- ${formData.details_msk_skin}` : ""}</span></div>
        <div class="field"><span class="field-label">Urinary / Reproductive:</span><span class="field-value">${formData.urinary_repro || "N/A"} ${formData.details_urinary_repro ? `- ${formData.details_urinary_repro}` : ""}</span></div>
        <div class="field"><span class="field-label">Mental Health:</span><span class="field-value">${formData.mental || "N/A"} ${formData.details_mental ? `- ${formData.details_mental}` : ""}</span></div>
        <div class="field"><span class="field-label">Oncology / Hematology:</span><span class="field-value">${formData.onco_hema || "N/A"} ${formData.details_onco_hema ? `- ${formData.details_onco_hema}` : ""}</span></div>
        <div class="field"><span class="field-label">HIV / AIDS:</span><span class="field-value">${formData.hiv || "N/A"} ${formData.details_hiv ? `- ${formData.details_hiv}` : ""}</span></div>
        <div class="field"><span class="field-label">Alcohol / Drugs:</span><span class="field-value">${formData.alcohol_drugs || "N/A"} ${formData.details_alcohol_drugs ? `- ${formData.details_alcohol_drugs}` : ""}</span></div>
        <div class="field"><span class="field-label">Current Medications:</span><span class="field-value">${formData.medications_current || "N/A"}</span></div>
        <div class="field"><span class="field-label">Extra Doctors (5y):</span><span class="field-value">${formData.extra_doctors_5y || "N/A"} ${formData.details_extra_doctors_5y ? `- ${formData.details_extra_doctors_5y}` : ""}</span></div>
        <div class="field"><span class="field-label">Hospitalized (5y) or planned:</span><span class="field-value">${formData.hospitalized_5y_or_planned || "N/A"} ${formData.details_hospitalized_5y_or_planned ? `- ${formData.details_hospitalized_5y_or_planned}` : ""}</span></div>
        <div class="field"><span class="field-label">Pending appointments:</span><span class="field-value">${formData.pending_appointments || "N/A"} ${formData.details_pending_appointments ? `- ${formData.details_pending_appointments}` : ""}</span></div>
      </div>
      <div class="divider"></div>

      <div class="section">
        <div class="section-title">Family History</div>
        <div class="field"><span class="field-label">Father alive:</span><span class="field-value">${formData.father_alive || "N/A"}</span></div>
        <div class="field"><span class="field-label">Father current age:</span><span class="field-value">${formData.father_current_age || "N/A"}</span></div>
        <div class="field"><span class="field-label">Father date of death:</span><span class="field-value">${formData.father_dod || "N/A"}</span></div>
        <div class="field"><span class="field-label">Father cause of death:</span><span class="field-value">${formData.father_cause || "N/A"}</span></div>
        <div class="field"><span class="field-label">Mother alive:</span><span class="field-value">${formData.mother_alive || "N/A"}</span></div>
        <div class="field"><span class="field-label">Mother current age:</span><span class="field-value">${formData.mother_current_age || "N/A"}</span></div>
        <div class="field"><span class="field-label">Mother date of death:</span><span class="field-value">${formData.mother_dod || "N/A"}</span></div>
        <div class="field"><span class="field-label">Mother cause of death:</span><span class="field-value">${formData.mother_cause || "N/A"}</span></div>
        <div class="field"><span class="field-label">Major family history:</span><span class="field-value">${formData.family_history_major || "N/A"}</span></div>
        <div class="field"><span class="field-label">Family history details:</span><span class="field-value">${formData.details_family_history_major || "N/A"}</span></div>
      </div>
      <div class="divider"></div>

      <div class="section">
        <div class="section-title">Uploaded Documents</div>
        <div class="field"><span class="field-label">Driver's License:</span><span class="field-value">${driversLicenseLink.startsWith("data:image") ? "Attached below" : driversLicenseLink}</span></div>
        <div class="field"><span class="field-label">Passport:</span><span class="field-value">${passportLink.startsWith("data:image") ? "Attached below" : passportLink}</span></div>
        <div class="field"><span class="field-label">Green Card:</span><span class="field-value">${greenCardLink.startsWith("data:image") ? "Attached below" : greenCardLink}</span></div>
        
        ${formData.drivers_license_upload && formData.drivers_license_upload.startsWith("data:image") ? `
          <div style="margin-top: 20px; page-break-inside: avoid;">
            <div class="field-label" style="margin-bottom: 10px;">Driver's License</div>
            <img src="${formData.drivers_license_upload}" style="max-width: 100%; height: auto; border: 1px solid #ddd; object-fit: contain;" />
          </div>
        ` : ""}
        
        ${formData.passport_upload && formData.passport_upload.startsWith("data:image") ? `
          <div style="margin-top: 20px; page-break-inside: avoid;">
            <div class="field-label" style="margin-bottom: 10px;">Passport</div>
            <img src="${formData.passport_upload}" style="max-width: 100%; height: auto; border: 1px solid #ddd; object-fit: contain;" />
          </div>
        ` : ""}
        
        ${formData.green_card_upload && formData.green_card_upload.startsWith("data:image") ? `
          <div style="margin-top: 20px; page-break-inside: avoid;">
            <div class="field-label" style="margin-bottom: 10px;">Green Card</div>
            <img src="${formData.green_card_upload}" style="max-width: 100%; height: auto; border: 1px solid #ddd; object-fit: contain;" />
          </div>
        ` : ""}
      </div>
      
      <div class="section">
        <div class="section-title">${t.beneficiaries}</div>
        ${formData.beneficiaries
      .map(
        (ben, index) => `
          <div class="beneficiary">
            <div class="beneficiary-title">${t.beneficiary} ${index + 1}</div>
            <div class="field"><span class="field-label">${t.fullName}:</span><span class="field-value">${ben.beneficiary_full_name || "N/A"}</span></div>
            <div class="field"><span class="field-label">${t.dateOfBirth}:</span><span class="field-value">${ben.beneficiary_dob || "N/A"}</span></div>
            <div class="field"><span class="field-label">${t.relation}:</span><span class="field-value">${ben.beneficiary_relation || "N/A"}</span></div>
            <div class="field"><span class="field-label">${t.percentageLabel}:</span><span class="field-value">${ben.beneficiary_percentage || "N/A"}%</span></div>
          </div>
        `,
      )
      .join("")}
      </div>
      <div class="divider"></div>

      <div class="section">
        <div class="section-title">Agreement & Signature</div>
        <div class="field"><span class="field-label">${t.agreementText ? '' : ''}</span><span class="field-value">${formData.agreement ? 'Accepted' : 'Not accepted'}</span></div>
        ${formData.signature ? `
          <div class="field" style="margin-top:12px"><span class="field-label">${t.signature}:</span><span class="field-value"><img src="${formData.signature}" alt="Signature" style="max-height:150px; border:1px solid #ddd; padding:8px; border-radius:4px;" /></span></div>
          <div class="field"><span class="field-label">Name:</span><span class="field-value">${formData.first_name || ''} ${formData.last_name || ''}</span></div>
        ` : `
          <div class="field"><span class="field-label">${t.signature}:</span><span class="field-value">N/A</span></div>
        `}
      </div>
      
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `

  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

  // Helper: generate PDF base64 from text (copyable) with simple layout
  const generateBase64FromHtml = async () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" })
    const margin = 32
    const lineH = 14
    const sectionGap = 16
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const usableWidth = pageWidth - margin * 2
    let y = margin

    const ensureSpace = (needed: number) => {
      if (y + needed > pageHeight - margin) {
        doc.addPage()
        y = margin
      }
    }

    const addTitleBar = (title: string) => {
      ensureSpace(80)
      doc.setFillColor(76, 122, 242)
      doc.rect(margin, y, usableWidth, 44, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(16)
      doc.text(title, margin + 12, y + 27)
      doc.setTextColor(0, 0, 0)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(11)
      y += 64
    }

    const addSectionHeader = (text: string) => {
      ensureSpace(lineH * 2)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.text(text, margin, y)
      y += lineH + 4
      doc.setFont("helvetica", "normal")
      doc.setFontSize(11)
    }

    const addRow = (label: string, val: any) => {
      const text = `${label}: ${formatVal(val)}`
      const lines = doc.splitTextToSize(text, usableWidth)
      lines.forEach((line: string) => {
        ensureSpace(lineH)
        doc.text(line, margin, y)
        y += lineH
      })
    }

    const formatVal = (val: any): string => {
      if (val === null || val === undefined || val === "") return "N/A"
      if (typeof val === "boolean") return val ? "Yes" : "No"
      if (Array.isArray(val)) return val.map((v) => formatVal(v)).join("; ")
      if (typeof val === "object") return JSON.stringify(val)
      return String(val)
    }

    // Header
    addTitleBar("Life Insurance Application")
    addRow("Date", new Date().toLocaleDateString(language === "pt" ? "pt-BR" : language === "es" ? "es-ES" : "en-US"))
    y += sectionGap + 40

    const sections: Array<{ title: string; rows: Array<[string, any]> }> = [
      {
        title: "Personal Information",
        rows: [
          ["First Name", formData.first_name],
          ["Last Name", formData.last_name],
          ["Email", formData.email],
          ["Phone", formData.phone],
          ["Address", formData.address_line],
          ["Date of Birth", formData.dob],
          ["Height", formData.height_ft_in],
          ["Weight (lbs)", formData.weight_lbs],
          ["SSN", formData.ssn],
        ],
      },
      {
        title: "Important Documents",
        rows: [
          ["Have a driver's license?", formData.has_drivers_license],
          ["Born in USA?", formData.born_in_usa],
          ["State of birth", formData.state_of_birth],
          ["Have a valid visa?", formData.has_valid_visa],
          ["Visa type", formData.visa_type],
          ["Visa expiration", formData.visa_expiration_date],
          ["Have a Green Card?", formData.has_green_card],
          ["Household Income", formData.household_income],
          ["Household Members", formData.household_members],
        ],
      },
      {
        title: "Employment & Income",
        rows: [
          ["Occupation", formData.occupation],
          ["Employer Name", formData.employer_name],
          ["Time Worked", formData.time_worked],
          ["Monthly Salary (USD)", formData.monthly_salary_usd],
          ["Assets Description", formData.assets_description],
          ["Own Business?", formData.has_business],
          ["Business Name", formData.business_name],
          ["Business Address", formData.business_address],
        ],
      },
      {
        title: "Banking Information",
        rows: [
          ["Bank Name", formData.bank_name],
          ["Routing Number", formData.routing_number],
          ["Account Number", formData.account_number],
          ["Account Type", formData.account_type],
          ["Best Day to Debit", formData.best_day_to_debit],
          ["Current Life Insurance?", formData.has_current_life_insurance],
          ["Is Replacement?", formData.is_replacement],
          ["Insurance Company", formData.ins_company_name],
          ["Policy Number", formData.policy_number],
          ["Coverage Amount (USD)", formData.coverage_amount_usd],
        ],
      },
      {
        title: "Medical / Visits",
        rows: [
          ["Visited doctor in US", formData.visited_doctor_us],
          ["Last Visit Date", formData.last_visit_date],
          ["Doctor Name", formData.doctor_name],
          ["Doctor Phone", formData.doctor_phone],
          ["Visit Reason", formData.visit_reason],
          ["Visit Result", formData.visit_result],
          ["Visit Reason", formData.visit_reason],
          ["Visit Result", formData.visit_result],
          ["Has pre-existing disease", formData.has_preexisting_disease],
          ...(formData.pre_existing_conditions.flatMap((cond, i) => [
            [`Condition ${i + 1} Name`, cond.diagnosis_name],
            [`Condition ${i + 1} Date`, cond.diagnosis_date],
          ]) as [string, any][]),
          ["Recent weight change", formData.recent_weight_change],
          ["Weight change reason", formData.weight_change_reason],
        ],
      },
      {
        title: "Habits & Background",
        rows: [
          ["Used nicotine (5y)", formData.used_nicotine_5y],
          ["Product Type", formData.nicotine_product_type],
          ["Qty Per Day", formData.qty_per_day],
          ["Last Use Date", formData.last_use_date],
          ["Insurance declined history", formData.insurance_declined_history],
          ["Driving violations", formData.driving_violations],
          ["Criminal record", formData.criminal_record],
          ["Bankruptcy involved", formData.bankruptcy_involved],
          ["Pending life/DI claim (12m)", formData.pending_life_di_claim_12m],
          ["Work disability (5y)", formData.work_disability_5y],
          ["Hazardous activities", formData.hazard_activities],
          ["Hazard details", formData.hazard_details],
          ["Non-passenger aviation", formData.non_passenger_aviation],
          ["Aviation details", formData.aviation_details],
        ],
      },
      {
        title: "Health Checklist",
        rows: [
          ["Cardiovascular", `${formData.cardio} ${formData.details_cardio ? "- " + formData.details_cardio : ""}`],
          ["Respiratory", `${formData.respiratory} ${formData.details_respiratory ? "- " + formData.details_respiratory : ""}`],
          ["Digestive", `${formData.digestive} ${formData.details_digestive ? "- " + formData.details_digestive : ""}`],
          ["Neurological", `${formData.neuro} ${formData.details_neuro ? "- " + formData.details_neuro : ""}`],
          ["Endocrine", `${formData.endocrine} ${formData.details_endocrine ? "- " + formData.details_endocrine : ""}`],
          ["MSK / Skin", `${formData.msk_skin} ${formData.details_msk_skin ? "- " + formData.details_msk_skin : ""}`],
          ["Urinary / Reproductive", `${formData.urinary_repro} ${formData.details_urinary_repro ? "- " + formData.details_urinary_repro : ""}`],
          ["Mental Health", `${formData.mental} ${formData.details_mental ? "- " + formData.details_mental : ""}`],
          ["Oncology / Hematology", `${formData.onco_hema} ${formData.details_onco_hema ? "- " + formData.details_onco_hema : ""}`],
          ["HIV / AIDS", `${formData.hiv} ${formData.details_hiv ? "- " + formData.details_hiv : ""}`],
          ["Alcohol / Drugs", `${formData.alcohol_drugs} ${formData.details_alcohol_drugs ? "- " + formData.details_alcohol_drugs : ""}`],
          ["Current Medications", formData.medications_current],
          ["Extra Doctors (5y)", `${formData.extra_doctors_5y} ${formData.details_extra_doctors_5y ? "- " + formData.details_extra_doctors_5y : ""}`],
          ["Hospitalized (5y) or planned", `${formData.hospitalized_5y_or_planned} ${formData.details_hospitalized_5y_or_planned ? "- " + formData.details_hospitalized_5y_or_planned : ""}`],
          ["Pending appointments", `${formData.pending_appointments} ${formData.details_pending_appointments ? "- " + formData.details_pending_appointments : ""}`],
        ],
      },
      {
        title: "Family History",
        rows: [
          ["Father alive", formData.father_alive],
          ["Father current age", formData.father_current_age],
          ["Father DOD", formData.father_dod],
          ["Father cause", formData.father_cause],
          ["Mother alive", formData.mother_alive],
          ["Mother current age", formData.mother_current_age],
          ["Mother DOD", formData.mother_dod],
          ["Mother cause", formData.mother_cause],
          ["Family history major", formData.family_history_major],
          ["Details family history major", formData.details_family_history_major],
        ],
      },
    ]

    sections.forEach((section) => {
      addSectionHeader(section.title)
      section.rows.forEach(([label, val]) => addRow(label, val))
      y += sectionGap
    })

    // Beneficiaries
    addSectionHeader("Beneficiaries")
    if (Array.isArray(formData.beneficiaries) && formData.beneficiaries.length > 0) {
      formData.beneficiaries.forEach((b, idx) => {
        addRow(`Beneficiary #${idx + 1}`, "")
        addRow("  Full Name", b.beneficiary_full_name)
        addRow("  DOB", b.beneficiary_dob)
        addRow("  Relation", b.beneficiary_relation || b.beneficiary_relation_other)
        addRow("  Percentage", b.beneficiary_percentage)
        addRow("  Address", b.beneficiary_address)
        addRow("  Email", b.beneficiary_email)
        addRow("  Phone", b.beneficiary_phone)
        addRow("  SSN/ITIN", b.beneficiary_ssn)
        y += 4
      })
    } else {
      addRow("Beneficiaries", "None provided")
    }
    y += sectionGap

    // Contingent Beneficiaries
    addSectionHeader("Contingent Beneficiaries")
    if (Array.isArray(formData.contingent_beneficiaries) && formData.contingent_beneficiaries.length > 0) {
      formData.contingent_beneficiaries.forEach((b, idx) => {
        addRow(`Contingent Beneficiary #${idx + 1}`, "")
        addRow("  Full Name", b.beneficiary_full_name)
        addRow("  DOB", b.beneficiary_dob)
        addRow("  Relation", b.beneficiary_relation || b.beneficiary_relation_other)
        addRow("  Percentage", b.beneficiary_percentage)
        addRow("  Address", b.beneficiary_address)
        addRow("  Email", b.beneficiary_email)
        addRow("  Phone", b.beneficiary_phone)
        addRow("  SSN/ITIN", b.beneficiary_ssn)
        y += 4
      })
    } else {
      addRow("Contingent Beneficiaries", "None provided")
    }
    y += sectionGap

    // Agreement
    addSectionHeader("Agreement")
    addRow("Agreement", formData.agreement ? "Yes" : "No")
    addRow("Consent", formData.agreement ? "Yes" : "No")
    if (formData.signature && formData.signature.startsWith("data:image")) {
      ensureSpace(80)
      try {
        doc.addImage(formData.signature, "PNG", margin, y, 120, 60)
        y += 70
      } catch (e) {
        console.error("Error adding signature image:", e)
        addRow("Signature", "[Unable to render signature]")
      }
    } else {
      addRow("Signature", "N/A")
    }

    // Attached Documents - Helper function to load image and get dimensions
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
      })
    }

    // Prepare attachment info with storage URLs if available
    const storageUrls = options?.storageUrls || {}
    const attachments = [
      {
        name: "Driver's License",
        data: formData.drivers_license_upload,
        storageUrl: storageUrls.drivers_license_url || "",
      },
      {
        name: "Passport",
        data: formData.passport_upload,
        storageUrl: storageUrls.passport_url || "",
      },
      {
        name: "Green Card",
        data: formData.green_card_upload,
        storageUrl: storageUrls.green_card_url || "",
      },
    ].filter((item) => item.data && (item.data.startsWith("data:image") || item.data.startsWith("http")))

    if (attachments.length > 0) {
      doc.addPage()
      y = margin
      addTitleBar("Attached Documents")

      for (const item of attachments) {
        // Check if we need a new page (leave room for title + image)
        if (y + 100 > pageHeight - margin) {
          doc.addPage()
          y = margin
        }

        doc.setFont("helvetica", "bold")
        doc.setFontSize(12)
        doc.text(item.name, margin, y)
        y += 20

        // If it's a URL (from storage), show the URL text and a clickable link
        if (item.data.startsWith("http")) {
          doc.setFont("helvetica", "normal")
          doc.setFontSize(9)
          doc.setTextColor(80, 80, 80)
          doc.text("Link: " + item.data, margin, y, { maxWidth: usableWidth })
          y += 15
          doc.setTextColor(76, 122, 242) // Blue link color
          doc.textWithLink("Click to open document →", margin, y, { url: item.data })
          doc.setTextColor(0, 0, 0) // Reset to black
          y += 25
          continue
        }

        // For base64 images, load and render with correct aspect ratio
        try {
          const img = await loadImage(item.data)

          // Calculate dimensions to fit within page while maintaining aspect ratio
          const maxWidth = usableWidth - 20 // Leave some margin
          const maxHeight = 400 // Max height for each image

          let imgWidth = img.width
          let imgHeight = img.height

          // Scale down to fit width
          if (imgWidth > maxWidth) {
            const ratio = maxWidth / imgWidth
            imgWidth = maxWidth
            imgHeight = imgHeight * ratio
          }

          // Scale down to fit height if still too tall
          if (imgHeight > maxHeight) {
            const ratio = maxHeight / imgHeight
            imgHeight = maxHeight
            imgWidth = imgWidth * ratio
          }

          // Check if we need a new page for this image
          if (y + imgHeight + 30 > pageHeight - margin) {
            doc.addPage()
            y = margin
            // Re-add title on new page
            doc.setFont("helvetica", "bold")
            doc.setFontSize(12)
            doc.text(item.name + " (continued)", margin, y)
            y += 20
          }

          // Add image with calculated dimensions (maintaining aspect ratio)
          doc.addImage(item.data, "JPEG", margin, y, imgWidth, imgHeight)
          y += imgHeight + 10

          // Show storage URL below the image if available
          if (item.storageUrl) {
            doc.setFont("helvetica", "normal")
            doc.setFontSize(8)
            doc.setTextColor(80, 80, 80)
            const urlText = "Link: " + item.storageUrl
            const urlLines = doc.splitTextToSize(urlText, usableWidth)
            urlLines.forEach((line: string) => {
              ensureSpace(10)
              doc.text(line, margin, y)
              y += 10
            })
            doc.setTextColor(0, 0, 0) // Reset to black
          } else {
            // Show placeholder if no storage URL yet
            doc.setFont("helvetica", "italic")
            doc.setFontSize(8)
            doc.setTextColor(120, 120, 120)
            doc.text("Link: [URL will be generated after submission]", margin, y)
            doc.setTextColor(0, 0, 0)
          }
          y += 20 // Add spacing after image
        } catch (e) {
          console.error(`Error adding ${item.name} image:`, e)
          doc.setFont("helvetica", "normal")
          doc.text("[Error rendering image]", margin, y)
          y += 20
        }
      }
    }

    const dataUri = doc.output("datauristring") as string
    const base64 = dataUri.split(",")[1]
    return base64
  }

  // If caller wants base64 returned, generate and return it
  if (options?.returnBase64) {
    try {
      const base64 = await generateBase64FromHtml()
      return base64
    } catch (err) {
      console.error("Error generating base64 PDF:", err)
      return null
    }
  }

  // If requested, render the same HTML to a PDF, convert to base64 and POST to webhook
  if (options?.sendToWebhook && options.webhookUrl) {
    try {
      const base64 = await generateBase64FromHtml()
      if (base64) {
        try {
          await fetch(options.webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ form: formData, pdf_base64: base64, pdf_filename: "application.pdf" }),
          })
        } catch (postErr) {
          console.error("Error sending PDF to webhook:", postErr)
        }
      } else {
        console.warn("PDF base64 generation returned null; not posting to webhook.")
      }
    } catch (err) {
      console.error("Error generating PDF blob for webhook:", err)
    }
  }
}
