"use client"

import { useState, useEffect } from "react"
import { PersonalInfo } from "@/components/steps/personal-info"
import { Documents } from "@/components/steps/documents"
import { Employment } from "@/components/steps/employment"
import { Banking } from "@/components/steps/banking"
import { MedicalHistory } from "@/components/steps/medical-history"
import { Habits } from "@/components/steps/habits"
import { HealthChecklist } from "@/components/steps/health-checklist"
import { FamilyHistory } from "@/components/steps/family-history"
import { Beneficiaries } from "@/components/steps/beneficiaries"
import { Review } from "@/components/steps/review"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { translations, type Language } from "@/lib/translations"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { generatePDF } from "@/lib/generate-pdf"
import { validateStep } from "@/lib/validation"
import { sampleData } from "@/lib/sample-data"
import { toast } from "sonner"

export type FormData = {
  // Step 1
  first_name: string
  last_name: string
  email: string
  phone: string
  address_line: string
  dob: string
  height_ft_in: string
  weight_lbs: string
  ssn: string
  // Step 2
  has_drivers_license: string
  drivers_license_upload: string
  born_in_usa: string
  state_of_birth: string
  passport_upload: string
  has_valid_visa: string
  visa_type: string
  visa_expiration_date: string
  has_green_card: string
  green_card_upload: string
  // Step 3
  occupation: string
  employer_name: string
  time_worked: string
  monthly_salary_usd: string
  assets_description: string
  has_business: string
  business_name: string
  business_address: string
  // Step 4
  bank_name: string
  routing_number: string
  account_number: string
  account_type: string
  best_day_to_debit: string
  has_current_life_insurance: string
  is_replacement: string
  ins_company_name: string
  policy_number: string
  coverage_amount_usd: string
  // Step 5
  visited_doctor_us: string
  last_visit_date: string
  doctor_name: string
  doctor_phone: string
  visit_reason: string
  visit_result: string
  has_preexisting_disease: string
  pre_dx_date: string
  pre_dx_name: string
  recent_weight_change: string
  weight_change_reason: string
  // Step 6
  used_nicotine_5y: string
  nicotine_product_type: string
  qty_per_day: string
  last_use_date: string
  insurance_declined_history: string
  driving_violations: string
  criminal_record: string
  bankruptcy_involved: string
  pending_life_di_claim_12m: string
  work_disability_5y: string
  hazard_activities: string
  hazard_details: string
  non_passenger_aviation: string
  aviation_details: string
  // Step 7
  cardio: string
  details_cardio: string
  respiratory: string
  details_respiratory: string
  digestive: string
  details_digestive: string
  neuro: string
  details_neuro: string
  endocrine: string
  details_endocrine: string
  msk_skin: string
  details_msk_skin: string
  urinary_repro: string
  details_urinary_repro: string
  mental: string
  details_mental: string
  onco_hema: string
  details_onco_hema: string
  hiv: string
  details_hiv: string
  alcohol_drugs: string
  details_alcohol_drugs: string
  medications_current: string
  extra_doctors_5y: string
  details_extra_doctors_5y: string
  hospitalized_5y_or_planned: string
  details_hospitalized_5y_or_planned: string
  pending_appointments: string
  details_pending_appointments: string
  // Step 8
  father_alive: string
  father_current_age: string
  father_dod: string
  father_cause: string
  mother_alive: string
  mother_current_age: string
  mother_dod: string
  mother_cause: string
  family_history_major: string
  details_family_history_major: string
  // Step 9
  beneficiaries: Array<{
    beneficiary_full_name: string
    beneficiary_dob: string
    beneficiary_relation: string
    beneficiary_relation_other: string
    beneficiary_percentage: string
  }>
  // Step 10
  agreement: boolean
  signature: string
  // Consent
  consent: boolean
}

const TOTAL_STEPS = 10
const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || ""

export default function InsuranceForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [language, setLanguage] = useState<Language>("en")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address_line: "",
    dob: "",
    height_ft_in: "",
    weight_lbs: "",
    ssn: "",
    has_drivers_license: "",
    drivers_license_upload: "",
    born_in_usa: "",
    state_of_birth: "",
    passport_upload: "",
    has_valid_visa: "",
    visa_type: "",
    visa_expiration_date: "",
    has_green_card: "",
    green_card_upload: "",
    occupation: "",
    employer_name: "",
    time_worked: "",
    monthly_salary_usd: "",
    assets_description: "",
    has_business: "",
    business_name: "",
    business_address: "",
    bank_name: "",
    routing_number: "",
    account_number: "",
    account_type: "",
    best_day_to_debit: "",
    has_current_life_insurance: "",
    is_replacement: "",
    ins_company_name: "",
    policy_number: "",
    coverage_amount_usd: "",
    visited_doctor_us: "",
    last_visit_date: "",
    doctor_name: "",
    doctor_phone: "",
    visit_reason: "",
    visit_result: "",
    has_preexisting_disease: "",
    pre_dx_date: "",
    pre_dx_name: "",
    recent_weight_change: "",
    weight_change_reason: "",
    used_nicotine_5y: "",
    nicotine_product_type: "",
    qty_per_day: "",
    last_use_date: "",
    insurance_declined_history: "",
    driving_violations: "",
    criminal_record: "",
    bankruptcy_involved: "",
    pending_life_di_claim_12m: "",
    work_disability_5y: "",
    hazard_activities: "",
    hazard_details: "",
    non_passenger_aviation: "",
    aviation_details: "",
    cardio: "",
    details_cardio: "",
    respiratory: "",
    details_respiratory: "",
    digestive: "",
    details_digestive: "",
    neuro: "",
    details_neuro: "",
    endocrine: "",
    details_endocrine: "",
    msk_skin: "",
    details_msk_skin: "",
    urinary_repro: "",
    details_urinary_repro: "",
    mental: "",
    details_mental: "",
    onco_hema: "",
    details_onco_hema: "",
    hiv: "",
    details_hiv: "",
    alcohol_drugs: "",
    details_alcohol_drugs: "",
    medications_current: "",
    extra_doctors_5y: "",
    details_extra_doctors_5y: "",
    hospitalized_5y_or_planned: "",
    details_hospitalized_5y_or_planned: "",
    pending_appointments: "",
    details_pending_appointments: "",
    father_alive: "",
    father_current_age: "",
    father_dod: "",
    father_cause: "",
    mother_alive: "",
    mother_current_age: "",
    mother_dod: "",
    mother_cause: "",
    family_history_major: "",
    details_family_history_major: "",
    beneficiaries: [],
    agreement: false,
    signature: "",
    consent: false,
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedTheme) setTheme(savedTheme)
    if (savedLanguage) setLanguage(savedLanguage)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.classList.toggle("light", theme === "light")
    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  useEffect(() => {
    const saved = localStorage.getItem("insuranceFormData")
    if (saved) {
      try {
        setFormData((prev) => ({ ...prev, ...JSON.parse(saved) }))
      } catch (e) {
        console.error("[v0] Error loading form data:", e)
      }
    }
  }, [])

  useEffect(() => {
    // Exclude large base64 file uploads from localStorage to prevent quota exceeded errors
    // Mobile browsers have limited localStorage (~5-10MB) and base64 images can easily exceed this
    const dataToSave = { ...formData }
    // Clear file upload fields before saving (these are temporary and will be re-uploaded)
    dataToSave.drivers_license_upload = ""
    dataToSave.passport_upload = ""
    dataToSave.green_card_upload = ""
    dataToSave.signature = "" // Signature can also be large

    try {
      localStorage.setItem("insuranceFormData", JSON.stringify(dataToSave))
    } catch (e) {
      // localStorage quota exceeded - silently fail
      // This can happen on mobile devices with limited storage
      console.warn("[v0] Could not save form data to localStorage:", e)
    }
  }, [formData])

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
    // Clear errors for fields that are being updated
    if (errors.length > 0) {
      const updatedFields = Object.keys(data)
      setErrors((prev) => prev.filter((field) => !updatedFields.includes(field)))
    }
  }

  // ... inside component ...

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData)
    if (stepErrors.length > 0) {
      setErrors(stepErrors)
      toast.error(t.fillAllRequired)
      return
    }
    setErrors([])
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleFillAndSendSample = async () => {
    setFormData(sampleData)
    setErrors([])
    // Wait for state update then submit
    setTimeout(() => {
      // We need to trigger submission logic. 
      // Since handleSubmit uses formData from state, and state update is async, 
      // we might need a way to force submit with specific data or wait.
      // For this simple implementation, we'll just fill the data and let the user click submit on the last page 
      // OR we can try to call handleSubmit. 
      // However, handleSubmit relies on the state being updated.
      // A better approach for "Send" is to call the API directly with sampleData.

      submitSampleData(sampleData)
    }, 100)
  }

  const submitSampleData = async (data: FormData) => {
    console.log("Submitting sample data...")
    setIsSubmitting(true)
    setSubmitError("")

    try {
      // Generate PDF as base64 to include in submission
      let pdfBase64: string | null = null
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        pdfBase64 = await generatePDF(data, language, { returnBase64: true, skipPrint: true })
      } catch (pdfErr) {
        console.error("Error creating PDF for submission:", pdfErr)
        pdfBase64 = null
      }

      if (!pdfBase64) {
        setSubmitError("Could not generate the PDF for submission. Please try again.")
        setIsSubmitting(false)
        return
      }

      const payload = {
        ...data,
        pdf_base64: pdfBase64,
        pdf_filename: "application_sample.pdf",
        pdf_mime: "application/pdf",
      }

      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        console.log("Sample data submitted successfully. Setting isSubmitted to true.")
        setIsSubmitted(true)
        localStorage.removeItem("insuranceFormData")
        toast.success("Sample data sent successfully!")
        return
      }

      const respText = await response.text()
      setSubmitError(`Submission failed. ${respText}`)
    } catch (error) {
      console.error(error)
      setSubmitError("Network error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      await generatePDF(formData, language, {
        sendToWebhook: true,
        webhookUrl: WEBHOOK_URL,
      })
    } catch (error) {
      console.error("[v0] PDF generation error:", error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitError("")

    const totalPercentage = formData.beneficiaries.reduce(
      (sum, b) => sum + (Number.parseFloat(b.beneficiary_percentage) || 0),
      0,
    )

    // Only enforce 100% total if there are any beneficiaries
    if (formData.beneficiaries.length > 0 && totalPercentage !== 100) {
      setSubmitError(`Beneficiaries percentages must total exactly 100%. Current total: ${totalPercentage}%`)
      return
    }

    if (!formData.agreement) {
      setSubmitError("You must agree that all information is correct.")
      return
    }

    if (!formData.signature) {
      setSubmitError("You must provide your signature.")
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      // Step 1: Upload document files first to get storage URLs
      let storageUrls: {
        drivers_license_url?: string
        passport_url?: string
        green_card_url?: string
      } = {}

      const hasFilesToUpload =
        (formData.drivers_license_upload && formData.drivers_license_upload.startsWith('data:')) ||
        (formData.passport_upload && formData.passport_upload.startsWith('data:')) ||
        (formData.green_card_upload && formData.green_card_upload.startsWith('data:'))

      if (hasFilesToUpload) {
        console.log("[submit] Uploading document files first...")
        try {
          const uploadResponse = await fetch("/api/upload-files", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              first_name: formData.first_name,
              last_name: formData.last_name,
              drivers_license_upload: formData.drivers_license_upload,
              passport_upload: formData.passport_upload,
              green_card_upload: formData.green_card_upload,
            }),
          })

          if (uploadResponse.ok) {
            storageUrls = await uploadResponse.json()
            console.log("[submit] Got storage URLs:", storageUrls)
          } else {
            console.warn("[submit] File upload failed, continuing without URLs")
          }
        } catch (uploadErr) {
          console.warn("[submit] Error uploading files:", uploadErr)
          // Continue without URLs - they'll still be embedded as base64
        }
      }

      // Step 2: Generate PDF with storage URLs embedded
      let pdfBase64: string | null = null
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        pdfBase64 = await generatePDF(formData, language, {
          returnBase64: true,
          skipPrint: true,
          storageUrls: storageUrls, // Pass the storage URLs to embed in PDF
        })
      } catch (pdfErr) {
        console.error("Error creating PDF for submission:", pdfErr)
        pdfBase64 = null
      }

      if (!pdfBase64) {
        setSubmitError("Could not generate the PDF for submission. Please try again.")
        setIsSubmitting(false)
        return
      }
      console.log("[submit] pdf_base64 length:", pdfBase64.length)

      // Step 3: Build payload with form data, PDF, and pre-uploaded URLs
      const payload = {
        ...formData,
        pdf_base64: pdfBase64,
        pdf_filename: "application.pdf",
        pdf_mime: "application/pdf",
        // Include the storage URLs so the backend doesn't re-upload them
        ...storageUrls,
      }

      // Step 4: Send via our API route (server-side will forward JSON to n8n)
      let respText = ""
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      try {
        respText = await response.text()
      } catch (e) {
        console.error("Error reading webhook response text:", e)
      }

      if (response.ok) {
        console.log("Submission successful. Setting isSubmitted to true.")
        setIsSubmitted(true)
        localStorage.removeItem("insuranceFormData")
        return
      }

      console.error("Webhook returned non-OK status:", response.status, respText)
      setSubmitError(`Submission failed. Server responded ${response.status}. ${respText || "No response body."}`)
    } catch (error) {
      console.error("[v0] Submission error:", error)
      setSubmitError("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const t = translations[language]

  if (isSubmitted) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-card border-2 border-border rounded-2xl shadow-2xl p-12 text-center">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">{t.applicationSubmitted}</h1>
          <p className="text-muted-foreground text-lg mb-8">{t.thankYou}</p>
          <Button onClick={handleDownloadPDF} disabled={isGeneratingPDF} size="lg" className="gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {isGeneratingPDF ? t.generatingPDF : t.downloadPDF}
          </Button>
        </div>
      </main>
    )
  }

  const progress = (currentStep / TOTAL_STEPS) * 100

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-6">
          <img
            src={
              theme === "dark"
                ? process.env.NEXT_PUBLIC_LOGO_URL_DARK || "https://storage.googleapis.com/msgsndr/y12SZwzf4UWpjHMRpTe1/media/65138fe96bd8d3413d3b4e3e.png"
                : process.env.NEXT_PUBLIC_LOGO_URL_LIGHT || "https://storage.googleapis.com/msgsndr/y12SZwzf4UWpjHMRpTe1/media/65138f2bc9753eaaeea07a8a.png"
            }
            alt="Logo"
            className="h-16 w-auto object-contain"
          />
        </div>

        <div className="flex items-center justify-end gap-3 mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="w-10 h-10 bg-card">
                {language === "pt" && (
                  <img src="https://flagcdn.com/br.svg" alt="Português" className="w-5 h-5 rounded-sm" />
                )}
                {language === "en" && (
                  <img src="https://flagcdn.com/us.svg" alt="English" className="w-5 h-5 rounded-sm" />
                )}
                {language === "es" && (
                  <img src="https://flagcdn.com/es.svg" alt="Español" className="w-5 h-5 rounded-sm" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")}>English {language === "en" && "✓"}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("pt")}>
                Português {language === "pt" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("es")}>Español {language === "es" && "✓"}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 bg-card"
          >
            {theme === "dark" ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">
              {t.stepOf} {currentStep} {t.of} {TOTAL_STEPS}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}% {t.complete}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="bg-card border-2 border-border rounded-2xl shadow-2xl p-8 md:p-12">
          {currentStep === 1 && (
            <PersonalInfo formData={formData} updateFormData={updateFormData} language={language} errors={errors} />
          )}
          {currentStep === 2 && <Documents formData={formData} updateFormData={updateFormData} language={language} errors={errors} />}
          {currentStep === 3 && <Employment formData={formData} updateFormData={updateFormData} language={language} errors={errors} />}
          {currentStep === 4 && <Banking formData={formData} updateFormData={updateFormData} language={language} errors={errors} />}
          {currentStep === 5 && (
            <MedicalHistory formData={formData} updateFormData={updateFormData} language={language} errors={errors} />
          )}
          {currentStep === 6 && <Habits formData={formData} updateFormData={updateFormData} language={language} errors={errors} />}
          {currentStep === 7 && (
            <HealthChecklist formData={formData} updateFormData={updateFormData} language={language} errors={errors} />
          )}
          {currentStep === 8 && (
            <FamilyHistory formData={formData} updateFormData={updateFormData} language={language} errors={errors} />
          )}
          {currentStep === 9 && (
            <Beneficiaries formData={formData} updateFormData={updateFormData} language={language} errors={errors} />
          )}
          {currentStep === 10 && (
            <Review
              formData={formData}
              updateFormData={updateFormData}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitError={submitError}
              language={language}
              errors={errors}
            />
          )}

          {currentStep < 10 && (
            <div className="flex items-center justify-between mt-8 pt-8 border-t-2 border-border">
              <Button
                onClick={handleBack}
                disabled={currentStep === 1}
                variant="outline"
                size="lg"
                className="gap-2 bg-transparent border-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t.back}
              </Button>
              <Button onClick={handleNext} size="lg" className="gap-2">
                {t.next}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Button variant="ghost" size="sm" onClick={handleFillAndSendSample} className="text-muted-foreground opacity-50 hover:opacity-100">
              Fill & Send Sample Data
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}