"use client"

import type { FormData } from "@/app/page"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { translations, type Language } from "@/lib/translations"

interface Props {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  language: Language
  errors?: string[]
}

const HEALTH_CATEGORIES = [
  { key: "cardio", translationKey: "cardiovascular" as const },
  { key: "respiratory", translationKey: "respiratory" as const },
  { key: "digestive", translationKey: "digestive" as const },
  { key: "neuro", translationKey: "neurological" as const },
  { key: "endocrine", translationKey: "endocrine" as const },
  { key: "msk_skin", translationKey: "musculoskeletalSkin" as const },
  { key: "urinary_repro", translationKey: "urinaryReproductive" as const },
  { key: "mental", translationKey: "mentalHealth" as const },
  { key: "onco_hema", translationKey: "oncologyHematology" as const },
  { key: "hiv", translationKey: "hivAids" as const },
  { key: "alcohol_drugs", translationKey: "alcoholDrugs" as const },
]

export function HealthChecklist({ formData, updateFormData, language, errors = [] }: Props) {
  const t = translations[language]

  const getErrorClass = (field: string) => {
    return errors.includes(field) ? "border-destructive" : ""
  }

  const getLabelClass = (field: string) => {
    return errors.includes(field) ? "text-destructive" : ""
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t.detailedHealthHistory}</h2>
        <p className="text-muted-foreground">{t.healthCategoryDesc}</p>
      </div>

      <div className="space-y-6">
        {HEALTH_CATEGORIES.map((category) => (
          <div key={category.key} className="space-y-3 p-6 bg-secondary/50 rounded-xl border-2 border-border">
            <Label className={`text-base ${getLabelClass(category.key)}`}>
              {t[category.translationKey]} <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateFormData({ [category.key]: "yes" })}
                className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData[category.key as keyof FormData] === "yes"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
                  } ${errors.includes(category.key) ? "border-destructive" : ""}`}
              >
                {t.yes}
              </button>
              <button
                type="button"
                onClick={() => updateFormData({ [category.key]: "no" })}
                className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData[category.key as keyof FormData] === "no"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
                  } ${errors.includes(category.key) ? "border-destructive" : ""}`}
              >
                {t.no}
              </button>
            </div>

            {formData[category.key as keyof FormData] === "yes" && (
              <div className="space-y-2 mt-4">
                <Label htmlFor={`details_${category.key}`} className={getLabelClass(`details_${category.key}`)}>
                  {t.details} <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id={`details_${category.key}`}
                  value={formData[`details_${category.key}` as keyof FormData] as string}
                  onChange={(e) => updateFormData({ [`details_${category.key}`]: e.target.value })}
                  placeholder={t.detailsPlaceholder}
                  required
                  className={getErrorClass(`details_${category.key}`)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="medications_current" className={getLabelClass("medications_current")}>
          {t.currentMedications} <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="medications_current"
          value={formData.medications_current}
          onChange={(e) => updateFormData({ medications_current: e.target.value })}
          placeholder={t.currentMedicationsPlaceholder}
          required
          className={getErrorClass("medications_current")}
        />
      </div>

      <div className="space-y-3">
        <Label className={getLabelClass("extra_doctors_5y")}>
          {t.visitedExtraDoctors5y} <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updateFormData({ extra_doctors_5y: "yes" })}
            className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.extra_doctors_5y === "yes"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
              } ${errors.includes("extra_doctors_5y") ? "border-destructive" : ""}`}
          >
            {t.yes}
          </button>
          <button
            type="button"
            onClick={() => updateFormData({ extra_doctors_5y: "no" })}
            className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.extra_doctors_5y === "no"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
              } ${errors.includes("extra_doctors_5y") ? "border-destructive" : ""}`}
          >
            {t.no}
          </button>
        </div>
      </div>

      {formData.extra_doctors_5y === "yes" && (
        <div className="space-y-2">
          <Label htmlFor="details_extra_doctors_5y" className={getLabelClass("details_extra_doctors_5y")}>
            {t.details} <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="details_extra_doctors_5y"
            value={formData.details_extra_doctors_5y}
            onChange={(e) => updateFormData({ details_extra_doctors_5y: e.target.value })}
            required
            className={getErrorClass("details_extra_doctors_5y")}
          />
        </div>
      )}

      <div className="space-y-3">
        <Label className={getLabelClass("hospitalized_5y_or_planned")}>
          {t.hospitalized5yOrPlanned} <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updateFormData({ hospitalized_5y_or_planned: "yes" })}
            className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.hospitalized_5y_or_planned === "yes"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
              } ${errors.includes("hospitalized_5y_or_planned") ? "border-destructive" : ""}`}
          >
            {t.yes}
          </button>
          <button
            type="button"
            onClick={() => updateFormData({ hospitalized_5y_or_planned: "no" })}
            className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.hospitalized_5y_or_planned === "no"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
              } ${errors.includes("hospitalized_5y_or_planned") ? "border-destructive" : ""}`}
          >
            {t.no}
          </button>
        </div>
      </div>

      {formData.hospitalized_5y_or_planned === "yes" && (
        <div className="space-y-2">
          <Label htmlFor="details_hospitalized_5y_or_planned" className={getLabelClass("details_hospitalized_5y_or_planned")}>
            {t.details} <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="details_hospitalized_5y_or_planned"
            value={formData.details_hospitalized_5y_or_planned}
            onChange={(e) => updateFormData({ details_hospitalized_5y_or_planned: e.target.value })}
            required
            className={getErrorClass("details_hospitalized_5y_or_planned")}
          />
        </div>
      )}

      <div className="space-y-3">
        <Label className={getLabelClass("pending_appointments")}>
          {t.pendingAppointments} <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updateFormData({ pending_appointments: "yes" })}
            className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.pending_appointments === "yes"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
              } ${errors.includes("pending_appointments") ? "border-destructive" : ""}`}
          >
            {t.yes}
          </button>
          <button
            type="button"
            onClick={() => updateFormData({ pending_appointments: "no" })}
            className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.pending_appointments === "no"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
              } ${errors.includes("pending_appointments") ? "border-destructive" : ""}`}
          >
            {t.no}
          </button>
        </div>
      </div>

      {formData.pending_appointments === "yes" && (
        <div className="space-y-2">
          <Label htmlFor="details_pending_appointments" className={getLabelClass("details_pending_appointments")}>
            {t.details} <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="details_pending_appointments"
            value={formData.details_pending_appointments}
            onChange={(e) => updateFormData({ details_pending_appointments: e.target.value })}
            required
            className={getErrorClass("details_pending_appointments")}
          />
        </div>
      )}
    </div>
  )
}
