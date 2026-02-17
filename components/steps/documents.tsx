"use client"

import { useState } from "react"
import type { FormData } from "@/app/page"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { translations, type Language } from "@/lib/translations"
import { compressImage } from "@/lib/compress-image"

interface Props {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  language: Language
  errors?: string[]
}

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
]

export function Documents({ formData, updateFormData, language, errors = [] }: Props) {
  const t = translations[language]

  const [isCompressing, setIsCompressing] = useState<string | null>(null)

  const getErrorClass = (field: string) => {
    return errors.includes(field) ? "border-destructive" : "border-2"
  }

  const getLabelClass = (field: string) => {
    return errors.includes(field) ? "text-destructive" : ""
  }

  // Handle file upload with compression
  const handleFileUpload = async (
    file: File,
    fieldName: 'drivers_license_upload' | 'passport_upload' | 'green_card_upload',
    inputElement: HTMLInputElement
  ) => {
    // Check file size - warn if over 15MB (we'll compress it anyway)
    if (file.size > 15 * 1024 * 1024) {
      alert("File is too large. Please use a file under 15MB.")
      inputElement.value = ""
      return
    }

    setIsCompressing(fieldName)

    try {
      // Compress image to reduce payload size
      const compressedData = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1600,
        quality: 0.7,
        maxSizeKB: 400, // Keep each file under 400KB
      })

      updateFormData({ [fieldName]: compressedData })
    } catch (error) {
      console.error("Error compressing file:", error)
      alert("Error processing file. Please try again with a different file.")
      inputElement.value = ""
    } finally {
      setIsCompressing(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b-2 border-border">
        <h2 className="text-2xl font-bold mb-2">{t.householdTitle}</h2>
        <p className="text-muted-foreground">{t.householdDesc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="household_income" className={getLabelClass("household_income")}>
            {t.householdIncome} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="household_income"
            placeholder={t.householdIncomePlaceholder}
            value={formData.household_income}
            onChange={(e) => {
              // Allow numbers, commas, dots, and dollar sign
              const value = e.target.value
              updateFormData({ household_income: value })
            }}
            required
            className={getErrorClass("household_income")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="household_members" className={getLabelClass("household_members")}>
            {t.householdMembers} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="household_members"
            type="number"
            placeholder={t.householdMembersPlaceholder}
            value={formData.household_members}
            onChange={(e) => updateFormData({ household_members: e.target.value })}
            required
            className={getErrorClass("household_members")}
          />
        </div>
      </div>

      <div className="pb-4 border-b-2 border-border">
        <h2 className="text-2xl font-bold mb-2">{t.documents}</h2>
        <p className="text-muted-foreground">{t.documentsDesc}</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className={getLabelClass("has_drivers_license")}>
            {t.hasDriversLicense} <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateFormData({ has_drivers_license: "yes" })}
              className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.has_drivers_license === "yes"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
                } ${errors.includes("has_drivers_license") ? "border-destructive" : ""}`}
            >
              {t.yes}
            </button>
            <button
              type="button"
              onClick={() => updateFormData({ has_drivers_license: "no" })}
              className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.has_drivers_license === "no"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
                } ${errors.includes("has_drivers_license") ? "border-destructive" : ""}`}
            >
              {t.no}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <Label className={getLabelClass("is_us_citizen")}>
            {t.isUSCitizen} <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateFormData({ is_us_citizen: "yes" })}
              className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.is_us_citizen === "yes"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
                } ${errors.includes("is_us_citizen") ? "border-destructive" : ""}`}
            >
              {t.yes}
            </button>
            <button
              type="button"
              onClick={() => updateFormData({ is_us_citizen: "no" })}
              className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.is_us_citizen === "no"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
                } ${errors.includes("is_us_citizen") ? "border-destructive" : ""}`}
            >
              {t.no}
            </button>
          </div>
        </div>

        {formData.is_us_citizen === "yes" && (
            <div className="space-y-3">
             <Label className={getLabelClass("born_in_usa")}>
                {t.bornInUSA} <span className="text-destructive">*</span>
             </Label>
             <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateFormData({ born_in_usa: "yes" })}
                    className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.born_in_usa === "yes"
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
                        } ${errors.includes("born_in_usa") ? "border-destructive" : ""}`}
                   >
                    {t.yes}
                   </button>
                   <button
                    type="button"
                    onClick={() => updateFormData({ born_in_usa: "no" })}
                    className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.born_in_usa === "no"
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
                        } ${errors.includes("born_in_usa") ? "border-destructive" : ""}`}
                   >
                    {t.no}
                   </button>
              </div>
            </div>
        )}
        
        {formData.is_us_citizen === "yes" && formData.born_in_usa === "yes" && (
          <div className="space-y-2">
            <Label htmlFor="state_of_birth" className={getLabelClass("state_of_birth")}>
              {t.stateOfBirth} <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.state_of_birth}
              onValueChange={(value) => updateFormData({ state_of_birth: value })}
            >
              <SelectTrigger className={getErrorClass("state_of_birth")}>
                <SelectValue placeholder={t.selectState} />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {formData.has_drivers_license === "yes" && (
          <div className="space-y-2">
            <Label htmlFor="drivers_license_upload" className={getLabelClass("drivers_license_upload")}>
              {t.driversLicenseUpload} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="drivers_license_upload"
              type="file"
              accept="image/*,.pdf"
              disabled={isCompressing === 'drivers_license_upload'}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleFileUpload(file, 'drivers_license_upload', e.target)
                }
              }}
              required
              className={getErrorClass("drivers_license_upload")}
            />
            {isCompressing === 'drivers_license_upload' && (
              <p className="text-sm text-muted-foreground animate-pulse">Compressing image...</p>
            )}
          </div>
        )}

        {formData.is_us_citizen === "no" && (
            <>
        <div className="space-y-3">
          <Label className={getLabelClass("born_in_usa")}>
            {t.bornInUSA} <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateFormData({ born_in_usa: "yes" })}
              className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.born_in_usa === "yes"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
                } ${errors.includes("born_in_usa") ? "border-destructive" : ""}`}
            >
              {t.yes}
            </button>
            <button
              type="button"
              onClick={() => updateFormData({ born_in_usa: "no" })}
              className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.born_in_usa === "no"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
                } ${errors.includes("born_in_usa") ? "border-destructive" : ""}`}
            >
              {t.no}
            </button>
          </div>
        </div>
        </>
        )}

        {formData.is_us_citizen === "no" && formData.born_in_usa === "yes" && (
          <div className="space-y-2">
            <Label htmlFor="state_of_birth" className={getLabelClass("state_of_birth")}>
              {t.stateOfBirth} <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.state_of_birth}
              onValueChange={(value) => updateFormData({ state_of_birth: value })}
            >
              <SelectTrigger className={getErrorClass("state_of_birth")}>
                <SelectValue placeholder={t.selectState} />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {formData.is_us_citizen === "no" && formData.born_in_usa === "no" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="passport_upload" className={getLabelClass("passport_upload")}>
                {t.passportUpload} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="passport_upload"
                type="file"
                accept="image/*,.pdf"
                disabled={isCompressing === 'passport_upload'}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleFileUpload(file, 'passport_upload', e.target)
                  }
                }}
                required
                className={getErrorClass("passport_upload")}
              />
              {isCompressing === 'passport_upload' && (
                <p className="text-sm text-muted-foreground animate-pulse">Compressing image...</p>
              )}
            </div>

            <div className="space-y-3">
              <Label className={getLabelClass("has_valid_visa")}>
                {t.hasValidVisa} <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateFormData({ has_valid_visa: "yes" })}
                  className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.has_valid_visa === "yes"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
                    } ${errors.includes("has_valid_visa") ? "border-destructive" : ""}`}
                >
                  {t.yes}
                </button>
                <button
                  type="button"
                  onClick={() => updateFormData({ has_valid_visa: "no" })}
                  className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.has_valid_visa === "no"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
                    } ${errors.includes("has_valid_visa") ? "border-destructive" : ""}`}
                >
                  {t.no}
                </button>
              </div>
            </div>

            {formData.has_valid_visa === "yes" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="visa_type" className={getLabelClass("visa_type")}>
                    {t.visaType} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="visa_type"
                    value={formData.visa_type}
                    onChange={(e) => updateFormData({ visa_type: e.target.value })}
                    required
                    className={getErrorClass("visa_type")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visa_expiration_date" className={getLabelClass("visa_expiration_date")}>
                    {t.visaExpirationDate} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="visa_expiration_date"
                    type="date"
                    value={formData.visa_expiration_date}
                    onChange={(e) => updateFormData({ visa_expiration_date: e.target.value })}
                    required
                    className={getErrorClass("visa_expiration_date")}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label className={getLabelClass("has_green_card")}>
                {t.hasGreenCard} <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateFormData({ has_green_card: "yes" })}
                  className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.has_green_card === "yes"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
                    } ${errors.includes("has_green_card") ? "border-destructive" : ""}`}
                >
                  {t.yes}
                </button>
                <button
                  type="button"
                  onClick={() => updateFormData({ has_green_card: "no" })}
                  className={`py-3 px-6 rounded-lg transition-all duration-200 font-semibold text-sm tracking-wide ${formData.has_green_card === "no"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-card border-2 border-border hover:border-primary/50 hover:bg-accent"
                    } ${errors.includes("has_green_card") ? "border-destructive" : ""}`}
                >
                  {t.no}
                </button>
              </div>
            </div>

            {formData.has_green_card === "yes" && (
              <div className="space-y-2">
                <Label htmlFor="green_card_upload" className={getLabelClass("green_card_upload")}>
                  {t.greenCardUpload} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="green_card_upload"
                  type="file"
                  accept="image/*,.pdf"
                  disabled={isCompressing === 'green_card_upload'}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleFileUpload(file, 'green_card_upload', e.target)
                    }
                  }}
                  required
                  className={getErrorClass("green_card_upload")}
                />
                {isCompressing === 'green_card_upload' && (
                  <p className="text-sm text-muted-foreground animate-pulse">Compressing image...</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
