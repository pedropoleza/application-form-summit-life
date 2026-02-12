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

export function Habits({ formData, updateFormData, language, errors = [] }: Props) {
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
        <h2 className="text-2xl font-bold mb-2">{t.habitsTitle}</h2>
        <p className="text-muted-foreground">{t.habitsDescription}</p>
      </div>

      <div className="space-y-3">
        <Label className={getLabelClass("used_nicotine_5y")}>
          {t.usedNicotine5y} <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => updateFormData({ used_nicotine_5y: "yes" })}
            className={cn(
              "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
              formData.used_nicotine_5y === "yes"
                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
              errors.includes("used_nicotine_5y") ? "border-destructive" : ""
            )}
          >
            {t.yes}
          </button>
          <button
            type="button"
            onClick={() => updateFormData({ used_nicotine_5y: "no" })}
            className={cn(
              "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
              formData.used_nicotine_5y === "no"
                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
              errors.includes("used_nicotine_5y") ? "border-destructive" : ""
            )}
          >
            {t.no}
          </button>
        </div>
      </div>

      {formData.used_nicotine_5y === "yes" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nicotine_product_type" className={getLabelClass("nicotine_product_type")}>
              {t.nicotineProductType} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nicotine_product_type"
              value={formData.nicotine_product_type}
              onChange={(e) => updateFormData({ nicotine_product_type: e.target.value })}
              required
              className={getErrorClass("nicotine_product_type")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qty_per_day" className={getLabelClass("qty_per_day")}>
              {t.qtyPerDay} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="qty_per_day"
              value={formData.qty_per_day}
              onChange={(e) => updateFormData({ qty_per_day: e.target.value })}
              required
              className={getErrorClass("qty_per_day")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_use_date" className={getLabelClass("last_use_date")}>
              {t.lastUseDate} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="last_use_date"
              type="date"
              value={formData.last_use_date}
              onChange={(e) => updateFormData({ last_use_date: e.target.value })}
              required
              className={getErrorClass("last_use_date")}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className={getLabelClass("insurance_declined_history")}>
            {t.insuranceDeclinedHistory} <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateFormData({ insurance_declined_history: "yes" })}
              className={cn(
                "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
                formData.insurance_declined_history === "yes"
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                  : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
                errors.includes("insurance_declined_history") ? "border-destructive" : ""
              )}
            >
              {t.yes}
            </button>
            <button
              type="button"
              onClick={() => updateFormData({ insurance_declined_history: "no" })}
              className={cn(
                "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
                formData.insurance_declined_history === "no"
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                  : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
                errors.includes("insurance_declined_history") ? "border-destructive" : ""
              )}
            >
              {t.no}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <Label className={getLabelClass("driving_violations")}>
            {t.drivingViolations} <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateFormData({ driving_violations: "yes" })}
              className={cn(
                "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
                formData.driving_violations === "yes"
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                  : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
                errors.includes("driving_violations") ? "border-destructive" : ""
              )}
            >
              {t.yes}
            </button>
            <button
              type="button"
              onClick={() => updateFormData({ driving_violations: "no" })}
              className={cn(
                "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
                formData.driving_violations === "no"
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                  : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
                errors.includes("driving_violations") ? "border-destructive" : ""
              )}
            >
              {t.no}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <Label className={getLabelClass("criminal_record")}>
            {t.criminalRecord} <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateFormData({ criminal_record: "yes" })}
              className={cn(
                "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
                formData.criminal_record === "yes"
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                  : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
                errors.includes("criminal_record") ? "border-destructive" : ""
              )}
            >
              {t.yes}
            </button>
            <button
              type="button"
              onClick={() => updateFormData({ criminal_record: "no" })}
              className={cn(
                "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
                formData.criminal_record === "no"
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                  : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
                errors.includes("criminal_record") ? "border-destructive" : ""
              )}
            >
              {t.no}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <Label className={getLabelClass("bankruptcy_involved")}>
            {t.bankruptcyInvolved} <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateFormData({ bankruptcy_involved: "yes" })}
              className={cn(
                "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
                formData.bankruptcy_involved === "yes"
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                  : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
                errors.includes("bankruptcy_involved") ? "border-destructive" : ""
              )}
            >
              {t.yes}
            </button>
            <button
              type="button"
              onClick={() => updateFormData({ bankruptcy_involved: "no" })}
              className={cn(
                "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
                formData.bankruptcy_involved === "no"
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                  : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
                errors.includes("bankruptcy_involved") ? "border-destructive" : ""
              )}
            >
              {t.no}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <Label className={getLabelClass("pending_life_di_claim_12m")}>
            {t.pendingLifeDIClaim12m} <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateFormData({ pending_life_di_claim_12m: "yes" })}
              className={cn(
                "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
                formData.pending_life_di_claim_12m === "yes"
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                  : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
                errors.includes("pending_life_di_claim_12m") ? "border-destructive" : ""
              )}
            >
              {t.yes}
            </button>
            <button
              type="button"
              onClick={() => updateFormData({ pending_life_di_claim_12m: "no" })}
              className={cn(
                "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
                formData.pending_life_di_claim_12m === "no"
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                  : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
                errors.includes("pending_life_di_claim_12m") ? "border-destructive" : ""
              )}
            >
              {t.no}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <Label className={getLabelClass("work_disability_5y")}>
            {t.workDisability5y} <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateFormData({ work_disability_5y: "yes" })}
              className={cn(
                "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
                formData.work_disability_5y === "yes"
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                  : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
                errors.includes("work_disability_5y") ? "border-destructive" : ""
              )}
            >
              {t.yes}
            </button>
            <button
              type="button"
              onClick={() => updateFormData({ work_disability_5y: "no" })}
              className={cn(
                "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
                formData.work_disability_5y === "no"
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                  : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
                errors.includes("work_disability_5y") ? "border-destructive" : ""
              )}
            >
              {t.no}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className={getLabelClass("hazard_activities")}>
          {t.hazardousActivities} <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => updateFormData({ hazard_activities: "yes" })}
            className={cn(
              "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
              formData.hazard_activities === "yes"
                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
              errors.includes("hazard_activities") ? "border-destructive" : ""
            )}
          >
            {t.yes}
          </button>
          <button
            type="button"
            onClick={() => updateFormData({ hazard_activities: "no" })}
            className={cn(
              "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
              formData.hazard_activities === "no"
                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
              errors.includes("hazard_activities") ? "border-destructive" : ""
            )}
          >
            {t.no}
          </button>
        </div>
      </div>

      {formData.hazard_activities === "yes" && (
        <div className="space-y-2">
          <Label htmlFor="hazard_details" className={getLabelClass("hazard_details")}>
            {t.hazardDetails} <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="hazard_details"
            value={formData.hazard_details}
            onChange={(e) => updateFormData({ hazard_details: e.target.value })}
            required
            className={getErrorClass("hazard_details")}
          />
        </div>
      )}

      <div className="space-y-3">
        <Label className={getLabelClass("non_passenger_aviation")}>
          {t.nonPassengerAviation} <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => updateFormData({ non_passenger_aviation: "yes" })}
            className={cn(
              "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
              formData.non_passenger_aviation === "yes"
                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
              errors.includes("non_passenger_aviation") ? "border-destructive" : ""
            )}
          >
            {t.yes}
          </button>
          <button
            type="button"
            onClick={() => updateFormData({ non_passenger_aviation: "no" })}
            className={cn(
              "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
              formData.non_passenger_aviation === "no"
                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
              errors.includes("non_passenger_aviation") ? "border-destructive" : ""
            )}
          >
            {t.no}
          </button>
        </div>
      </div>

      {formData.non_passenger_aviation === "yes" && (
        <div className="space-y-2">
          <Label htmlFor="aviation_details" className={getLabelClass("aviation_details")}>
            {t.aviationDetails} <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="aviation_details"
            value={formData.aviation_details}
            onChange={(e) => updateFormData({ aviation_details: e.target.value })}
            required
            className={getErrorClass("aviation_details")}
          />
        </div>
      )}
    </div>
  )
}
