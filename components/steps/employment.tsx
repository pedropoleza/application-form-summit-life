"use client"

import type { FormData } from "@/app/page"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { translations, type Language } from "@/lib/translations"

interface Props {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  language: Language
  errors?: string[]
}

export function Employment({ formData, updateFormData, language, errors = [] }: Props) {
  const t = translations[language]

  const getErrorClass = (field: string) => {
    return errors.includes(field) ? "border-destructive" : ""
  }

  const getLabelClass = (field: string) => {
    return errors.includes(field) ? "text-destructive" : ""
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b-2 border-border">
        <h2 className="text-2xl font-bold mb-2">{t.employment}</h2>
        <p className="text-muted-foreground">{t.employmentDesc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="occupation" className={getLabelClass("occupation")}>
            {t.occupation} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="occupation"
            value={formData.occupation}
            onChange={(e) => updateFormData({ occupation: e.target.value })}
            required
            className={getErrorClass("occupation")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="employer_name" className={getLabelClass("employer_name")}>
            {t.employerName} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="employer_name"
            value={formData.employer_name}
            onChange={(e) => updateFormData({ employer_name: e.target.value })}
            required
            className={getErrorClass("employer_name")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time_worked" className={getLabelClass("time_worked")}>
            {t.timeWorked} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="time_worked"
            placeholder={t.timeWorkedPlaceholder}
            value={formData.time_worked}
            onChange={(e) => updateFormData({ time_worked: e.target.value })}
            required
            className={getErrorClass("time_worked")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthly_salary_usd" className={getLabelClass("monthly_salary_usd")}>
            {t.monthlySalaryUsd} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="monthly_salary_usd"
            type="number"
            placeholder={t.salaryPlaceholder}
            value={formData.monthly_salary_usd}
            onChange={(e) => updateFormData({ monthly_salary_usd: e.target.value })}
            required
            className={getErrorClass("monthly_salary_usd")}
          />
        </div>


      </div>

      <div className="space-y-3">
        <Label className={getLabelClass("has_business")}>
          {t.ownBusiness}
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updateFormData({ has_business: "yes" })}
            className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.has_business === "yes"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
              } ${errors.includes("has_business") ? "border-destructive" : ""}`}
          >
            {t.yes}
          </button>
          <button
            type="button"
            onClick={() => updateFormData({ has_business: "no" })}
            className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.has_business === "no"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
              } ${errors.includes("has_business") ? "border-destructive" : ""}`}
          >
            {t.no}
          </button>
        </div>
      </div>

      {formData.has_business === "yes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="business_name" className={getLabelClass("business_name")}>
              {t.businessName}
            </Label>
            <Input
              id="business_name"
              value={formData.business_name}
              onChange={(e) => updateFormData({ business_name: e.target.value })}
              className={getErrorClass("business_name")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_address" className={getLabelClass("business_address")}>
              {t.businessAddress}
            </Label>
            <Input
              id="business_address"
              value={formData.business_address}
              onChange={(e) => updateFormData({ business_address: e.target.value })}
              className={getErrorClass("business_address")}
            />
          </div>
        </div>
      )}
    </div>
  )
}
