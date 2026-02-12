"use client"

import type { FormData } from "@/app/page"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { translations, type Language } from "@/lib/translations"
import { cn } from "@/lib/utils"

interface Props {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  language: Language
  errors?: string[]
}

export function MedicalHistory({ formData, updateFormData, language, errors = [] }: Props) {
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
        <h2 className="text-2xl font-bold mb-2">{t.medicalHistory}</h2>
        <p className="text-muted-foreground">{t.medicalHistoryDesc}</p>
      </div>

      <div className="space-y-3">
        <Label className={getLabelClass("visited_doctor_us")}>
          {t.visitedDoctorUS} <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => updateFormData({ visited_doctor_us: "yes" })}
            className={cn(
              "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
              formData.visited_doctor_us === "yes"
                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
              errors.includes("visited_doctor_us") ? "border-destructive" : ""
            )}
          >
            {t.yes}
          </button>
          <button
            type="button"
            onClick={() => updateFormData({ visited_doctor_us: "no" })}
            className={cn(
              "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
              formData.visited_doctor_us === "no"
                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
              errors.includes("visited_doctor_us") ? "border-destructive" : ""
            )}
          >
            {t.no}
          </button>
        </div>
      </div>

      {formData.visited_doctor_us === "yes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="last_visit_date" className={getLabelClass("last_visit_date")}>
              {t.lastVisitDate} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="last_visit_date"
              type="date"
              value={formData.last_visit_date}
              onChange={(e) => updateFormData({ last_visit_date: e.target.value })}
              required
              className={getErrorClass("last_visit_date")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor_name" className={getLabelClass("doctor_name")}>
              {t.doctorName} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="doctor_name"
              value={formData.doctor_name}
              onChange={(e) => updateFormData({ doctor_name: e.target.value })}
              required
              className={getErrorClass("doctor_name")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor_phone" className={getLabelClass("doctor_phone")}>
              {t.doctorPhone} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="doctor_phone"
              type="tel"
              value={formData.doctor_phone}
              onChange={(e) => updateFormData({ doctor_phone: e.target.value })}
              required
              className={getErrorClass("doctor_phone")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visit_reason" className={getLabelClass("visit_reason")}>
              {t.visitReason} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="visit_reason"
              value={formData.visit_reason}
              onChange={(e) => updateFormData({ visit_reason: e.target.value })}
              required
              className={getErrorClass("visit_reason")}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="visit_result" className={getLabelClass("visit_result")}>
              {t.visitResult} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="visit_result"
              value={formData.visit_result}
              onChange={(e) => updateFormData({ visit_result: e.target.value })}
              required
              className={getErrorClass("visit_result")}
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Label className={getLabelClass("has_preexisting_disease")}>
          {t.hasPreexistingDisease} <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => updateFormData({ has_preexisting_disease: "yes" })}
            className={cn(
              "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
              formData.has_preexisting_disease === "yes"
                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
              errors.includes("has_preexisting_disease") ? "border-destructive" : ""
            )}
          >
            {t.yes}
          </button>
          <button
            type="button"
            onClick={() => updateFormData({ has_preexisting_disease: "no" })}
            className={cn(
              "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
              formData.has_preexisting_disease === "no"
                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
              errors.includes("has_preexisting_disease") ? "border-destructive" : ""
            )}
          >
            {t.no}
          </button>
        </div>
      </div>

      {formData.has_preexisting_disease === "yes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="pre_dx_date" className={getLabelClass("pre_dx_date")}>
              {t.diagnosisDate} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="pre_dx_date"
              type="date"
              value={formData.pre_dx_date}
              onChange={(e) => updateFormData({ pre_dx_date: e.target.value })}
              required
              className={getErrorClass("pre_dx_date")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pre_dx_name" className={getLabelClass("pre_dx_name")}>
              {t.diagnosisName} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="pre_dx_name"
              value={formData.pre_dx_name}
              onChange={(e) => updateFormData({ pre_dx_name: e.target.value })}
              required
              className={getErrorClass("pre_dx_name")}
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Label className={getLabelClass("recent_weight_change")}>
          {t.recentWeightChange} <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => updateFormData({ recent_weight_change: "yes" })}
            className={cn(
              "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
              formData.recent_weight_change === "yes"
                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
              errors.includes("recent_weight_change") ? "border-destructive" : ""
            )}
          >
            {t.yes}
          </button>
          <button
            type="button"
            onClick={() => updateFormData({ recent_weight_change: "no" })}
            className={cn(
              "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
              formData.recent_weight_change === "no"
                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
              errors.includes("recent_weight_change") ? "border-destructive" : ""
            )}
          >
            {t.no}
          </button>
        </div>
      </div>

      {formData.recent_weight_change === "yes" && (
        <div className="space-y-2">
          <Label htmlFor="weight_change_reason" className={getLabelClass("weight_change_reason")}>
            {t.weightChangeReason} <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="weight_change_reason"
            value={formData.weight_change_reason}
            onChange={(e) => updateFormData({ weight_change_reason: e.target.value })}
            required
            className={getErrorClass("weight_change_reason")}
          />
        </div>
      )}
    </div>
  )
}
