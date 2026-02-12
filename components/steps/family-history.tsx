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

export function FamilyHistory({ formData, updateFormData, language, errors = [] }: Props) {
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
        <h2 className="text-2xl font-bold mb-2">{t.familyHistoryTitle}</h2>
        <p className="text-muted-foreground">{t.familyHistorySubtitle}</p>
      </div>

      <div className="space-y-6">
        <div className="p-6 bg-secondary/50 rounded-xl border-2 border-border space-y-4">
          <h3 className="text-lg font-semibold">{t.father}</h3>

          <div className="space-y-3">
            <Label className={getLabelClass("father_alive")}>
              {t.isFatherAlive} <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateFormData({ father_alive: "yes" })}
                className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.father_alive === "yes"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
                  } ${errors.includes("father_alive") ? "border-destructive" : ""}`}
              >
                {t.yes}
              </button>
              <button
                type="button"
                onClick={() => updateFormData({ father_alive: "no" })}
                className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.father_alive === "no"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
                  } ${errors.includes("father_alive") ? "border-destructive" : ""}`}
              >
                {t.no}
              </button>
            </div>
          </div>

          {formData.father_alive === "yes" && (
            <div className="space-y-2">
              <Label htmlFor="father_current_age" className={getLabelClass("father_current_age")}>
                {t.currentAge} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="father_current_age"
                type="number"
                value={formData.father_current_age}
                onChange={(e) => updateFormData({ father_current_age: e.target.value })}
                required
                className={getErrorClass("father_current_age")}
              />
            </div>
          )}

          {formData.father_alive === "no" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="father_dod" className={getLabelClass("father_dod")}>
                  {t.dateOfDeath} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="father_dod"
                  type="date"
                  value={formData.father_dod}
                  onChange={(e) => updateFormData({ father_dod: e.target.value })}
                  required
                  className={getErrorClass("father_dod")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="father_cause" className={getLabelClass("father_cause")}>
                  {t.causeOfDeath} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="father_cause"
                  value={formData.father_cause}
                  onChange={(e) => updateFormData({ father_cause: e.target.value })}
                  required
                  className={getErrorClass("father_cause")}
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-secondary/50 rounded-xl border-2 border-border space-y-4">
          <h3 className="text-lg font-semibold">{t.mother}</h3>

          <div className="space-y-3">
            <Label className={getLabelClass("mother_alive")}>
              {t.isMotherAlive} <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateFormData({ mother_alive: "yes" })}
                className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.mother_alive === "yes"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
                  } ${errors.includes("mother_alive") ? "border-destructive" : ""}`}
              >
                {t.yes}
              </button>
              <button
                type="button"
                onClick={() => updateFormData({ mother_alive: "no" })}
                className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.mother_alive === "no"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
                  } ${errors.includes("mother_alive") ? "border-destructive" : ""}`}
              >
                {t.no}
              </button>
            </div>
          </div>

          {formData.mother_alive === "yes" && (
            <div className="space-y-2">
              <Label htmlFor="mother_current_age" className={getLabelClass("mother_current_age")}>
                {t.currentAge} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="mother_current_age"
                type="number"
                value={formData.mother_current_age}
                onChange={(e) => updateFormData({ mother_current_age: e.target.value })}
                required
                className={getErrorClass("mother_current_age")}
              />
            </div>
          )}

          {formData.mother_alive === "no" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="mother_dod" className={getLabelClass("mother_dod")}>
                  {t.dateOfDeath} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="mother_dod"
                  type="date"
                  value={formData.mother_dod}
                  onChange={(e) => updateFormData({ mother_dod: e.target.value })}
                  required
                  className={getErrorClass("mother_dod")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mother_cause" className={getLabelClass("mother_cause")}>
                  {t.causeOfDeath} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="mother_cause"
                  value={formData.mother_cause}
                  onChange={(e) => updateFormData({ mother_cause: e.target.value })}
                  required
                  className={getErrorClass("mother_cause")}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Label className={getLabelClass("family_history_major")}>
            {t.majorFamilyHistory} <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateFormData({ family_history_major: "yes" })}
              className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.family_history_major === "yes"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
                } ${errors.includes("family_history_major") ? "border-destructive" : ""}`}
            >
              {t.yes}
            </button>
            <button
              type="button"
              onClick={() => updateFormData({ family_history_major: "no" })}
              className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.family_history_major === "no"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
                } ${errors.includes("family_history_major") ? "border-destructive" : ""}`}
            >
              {t.no}
            </button>
          </div>
        </div>

        {formData.family_history_major === "yes" && (
          <div className="space-y-2">
            <Label htmlFor="details_family_history_major" className={getLabelClass("details_family_history_major")}>
              {t.details} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="details_family_history_major"
              value={formData.details_family_history_major}
              onChange={(e) => updateFormData({ details_family_history_major: e.target.value })}
              placeholder={t.familyHistoryPlaceholder}
              required
              className={getErrorClass("details_family_history_major")}
            />
          </div>
        )}
      </div>
    </div>
  )
}
