"use client"

import type { FormData } from "@/app/page"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { translations, type Language } from "@/lib/translations"
import { SignaturePad } from "@/components/signature-pad"
import { useState } from "react"

interface Props {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  onSubmit: () => void
  isSubmitting: boolean
  submitError: string
  language: Language
  errors?: string[]
}

export function Review({ formData, updateFormData, onSubmit, isSubmitting, submitError, language, errors = [] }: Props) {
  const t = translations[language]
  const [showSignaturePad, setShowSignaturePad] = useState(false)

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b-2 border-border">
        <h2 className="text-2xl font-bold mb-2">{t.review}</h2>
        <p className="text-muted-foreground">{t.reviewDesc}</p>
      </div>

      <div className="space-y-6">
        <div className="p-6 bg-secondary/50 border-2 border-border rounded-lg space-y-3">
          <h3 className="text-lg font-semibold pb-2 border-b-2 border-border">{t.personalInfo}</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <p className="text-muted-foreground">Name:</p>
            <p className="font-medium">
              {formData.first_name} {formData.last_name}
            </p>
            <p className="text-muted-foreground">Email:</p>
            <p className="font-medium">{formData.email}</p>
            <p className="text-muted-foreground">Phone:</p>
            <p className="font-medium">{formData.phone}</p>
            <p className="text-muted-foreground">Date of Birth:</p>
            <p className="font-medium">{formData.dob}</p>
          </div>
        </div>

        <div className="p-6 bg-secondary/50 border-2 border-border rounded-lg space-y-3">
          <h3 className="text-lg font-semibold pb-2 border-b-2 border-border">{t.employment}</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <p className="text-muted-foreground">Occupation:</p>
            <p className="font-medium">{formData.occupation}</p>
            <p className="text-muted-foreground">Employer:</p>
            <p className="font-medium">{formData.employer_name}</p>
            <p className="text-muted-foreground">Monthly Salary:</p>
            <p className="font-medium">${formData.monthly_salary_usd}</p>
          </div>
        </div>

        <div className="p-6 bg-secondary/50 border-2 border-border rounded-lg space-y-3">
          <h3 className="text-lg font-semibold pb-2 border-b-2 border-border">{t.banking}</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <p className="text-muted-foreground">Bank:</p>
            <p className="font-medium">{formData.bank_name}</p>
            <p className="text-muted-foreground">Account Type:</p>
            <p className="font-medium">{formData.account_type}</p>
            <p className="text-muted-foreground">Debit Day:</p>
            <p className="font-medium">Day {formData.best_day_to_debit}</p>
          </div>
        </div>

        <div className="p-6 bg-secondary/50 border-2 border-border rounded-lg space-y-3">
          <h3 className="text-lg font-semibold pb-2 border-b-2 border-border">{t.beneficiaries}</h3>
          {formData.beneficiaries.map((ben, i) => (
            <div
              key={i}
              className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t-2 border-border pt-3 first:border-t-0 first:pt-0"
            >
              <p className="text-muted-foreground">Name:</p>
              <p className="font-medium">{ben.beneficiary_full_name}</p>
              <p className="text-muted-foreground">Relation:</p>
              <p className="font-medium">
                {ben.beneficiary_relation === "Other" ? ben.beneficiary_relation_other : ben.beneficiary_relation}
              </p>
              <p className="text-muted-foreground">Percentage:</p>
              <p className="font-medium">{ben.beneficiary_percentage}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className={`flex items-start space-x-3 p-4 bg-secondary/50 border-2 rounded-lg ${errors.includes("agreement") ? "border-destructive" : "border-border"}`}>
          <Checkbox
            id="agreement"
            checked={formData.agreement}
            onCheckedChange={(checked) => updateFormData({ agreement: checked as boolean })}
            className="mt-1"
          />
          <Label
            htmlFor="agreement"
            className={`cursor-pointer font-normal leading-relaxed text-base ${errors.includes("agreement") ? "text-destructive" : "text-foreground"}`}
          >
            {t.agreementText} <span className="text-destructive">*</span>
          </Label>
        </div>

        <div className="space-y-3">
          <div>
            <Label className={`text-base font-semibold ${errors.includes("signature") ? "text-destructive" : "text-foreground"}`}>
              {t.signature} <span className="text-destructive">*</span>
            </Label>
            <p className="text-sm text-muted-foreground mt-1">{t.signatureInstruction}</p>
          </div>

          {formData.signature ? (
            <div className={`relative p-4 border-2 rounded-lg bg-white ${errors.includes("signature") ? "border-destructive" : "border-border"}`}>
              <img src={formData.signature || "/placeholder.svg"} alt="Signature" className="max-h-32 mx-auto" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSignaturePad(true)}
                className="absolute top-2 right-2 gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                {t.reSign}
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSignaturePad(true)}
              className={`w-full gap-2 h-24 border-2 border-dashed ${errors.includes("signature") ? "border-destructive text-destructive" : ""}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              {t.clickToSign}
            </Button>
          )}
        </div>
      </div>

      {submitError && (
        <div className="p-4 bg-destructive/10 border-2 border-destructive rounded-lg">
          <p className="text-destructive font-medium">{submitError}</p>
        </div>
      )}

      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        size="lg"
        className="w-full gap-2"
      >
        {isSubmitting && (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {isSubmitting ? t.submitting : t.submit}
      </Button>

      <SignaturePad
        open={showSignaturePad}
        onClose={() => setShowSignaturePad(false)}
        onSave={(signature) => updateFormData({ signature })}
        language={language}
      />
    </div>
  )
}
