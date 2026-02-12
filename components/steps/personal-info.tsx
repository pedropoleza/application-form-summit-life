"use client"

import type { FormData } from "@/app/page"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { translations, type Language } from "@/lib/translations"

interface Props {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  language: Language
  errors: string[]
}

export function PersonalInfo({ formData, updateFormData, language, errors }: Props) {
  const t = translations[language]

  const getErrorClass = (field: string) => {
    return errors.includes(field) ? "border-destructive" : "border-2"
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b-2 border-border">
        <h2 className="text-2xl font-bold mb-2">{t.personalInfo}</h2>
        <p className="text-muted-foreground">{t.personalInfoDesc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="first_name" className={errors.includes("first_name") ? "text-destructive" : ""}>
            {t.firstName} <span className="text-destructive">{t.required}</span>
          </Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => updateFormData({ first_name: e.target.value })}
            required
            className={getErrorClass("first_name")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name" className={errors.includes("last_name") ? "text-destructive" : ""}>
            {t.lastName} <span className="text-destructive">{t.required}</span>
          </Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => updateFormData({ last_name: e.target.value })}
            required
            className={getErrorClass("last_name")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className={errors.includes("email") ? "text-destructive" : ""}>
            {t.email} <span className="text-destructive">{t.required}</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            required
            className={getErrorClass("email")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className={errors.includes("phone") ? "text-destructive" : ""}>
            {t.phone} <span className="text-destructive">{t.required}</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(XXX) XXX-XXXX"
            value={formData.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "")
              const formatted = value
                .replace(/^(\d{3})/, "($1) ")
                .replace(/\) (\d{3})/, ") $1-")
                .substring(0, 14)
              updateFormData({ phone: formatted })
            }}
            required
            className={getErrorClass("phone")}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address_line" className={errors.includes("address_line") ? "text-destructive" : ""}>
            {t.address} <span className="text-destructive">{t.required}</span>
          </Label>
          <Input
            id="address_line"
            value={formData.address_line}
            onChange={(e) => updateFormData({ address_line: e.target.value })}
            required
            className={getErrorClass("address_line")}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="ssn">
            {t.ssn}
          </Label>
          <Input
            id="ssn"
            value={formData.ssn}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "")
              const formatted = value
                .replace(/^(\d{3})/, "$1-")
                .replace(/-(\d{2})/, "-$1-")
                .substring(0, 11)
              updateFormData({ ssn: formatted })
            }}
            placeholder="XXX-XX-XXXX"
            className="border-2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob" className={errors.includes("dob") ? "text-destructive" : ""}>
            {t.dateOfBirth} <span className="text-destructive">{t.required}</span>
          </Label>
          <Input
            id="dob"
            type="date"
            value={formData.dob}
            onChange={(e) => updateFormData({ dob: e.target.value })}
            required
            className={getErrorClass("dob")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height_ft_in" className={errors.includes("height_ft_in") ? "text-destructive" : ""}>
            {t.height} <span className="text-destructive">{t.required}</span>
          </Label>
          <Input
            id="height_ft_in"
            placeholder="5'9&quot;"
            value={formData.height_ft_in}
            onChange={(e) => updateFormData({ height_ft_in: e.target.value })}
            required
            className={getErrorClass("height_ft_in")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight_lbs" className={errors.includes("weight_lbs") ? "text-destructive" : ""}>
            {t.weight} <span className="text-destructive">{t.required}</span>
          </Label>
          <Input
            id="weight_lbs"
            type="number"
            value={formData.weight_lbs}
            onChange={(e) => updateFormData({ weight_lbs: e.target.value })}
            required
            className={getErrorClass("weight_lbs")}
          />
        </div>
      </div>
    </div>
  )
}
