"use client"

import type { FormData } from "@/app/page"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { translations, type Language } from "@/lib/translations"

interface Props {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  language: Language
  errors?: string[]
}

const getRelations = (t: typeof translations.en) => [
  { value: "Spouse", label: t.relationSpouse },
  { value: "Child", label: t.relationChild },
  { value: "Parent", label: t.relationParent },
  { value: "Sibling", label: t.relationSibling },
  { value: "Grandparent", label: t.relationGrandparent },
  { value: "Grandchild", label: t.relationGrandchild },
  { value: "Friend", label: t.relationFriend },
  { value: "Other", label: t.relationOther },
]

export function Beneficiaries({ formData, updateFormData, language, errors = [] }: Props) {
  const t = translations[language]
  const relations = getRelations(t)

  const addBeneficiary = () => {
    updateFormData({
      beneficiaries: [
        ...formData.beneficiaries,
        {
          beneficiary_full_name: "",
          beneficiary_dob: "",
          beneficiary_relation: "",
          beneficiary_relation_other: "",
          beneficiary_percentage: "",
          beneficiary_address: "",
          beneficiary_email: "",
          beneficiary_phone: "",
          beneficiary_ssn: "",
        },
      ],
    })
  }

  const removeBeneficiary = (index: number) => {
    const updated = formData.beneficiaries.filter((_, i) => i !== index)
    updateFormData({ beneficiaries: updated })
  }

  const updateBeneficiary = (index: number, field: string, value: string) => {
    const updated = [...formData.beneficiaries]
    updated[index] = { ...updated[index], [field]: value }
    updateFormData({ beneficiaries: updated })
  }

  const addContingentBeneficiary = () => {
    updateFormData({
      contingent_beneficiaries: [
        ...formData.contingent_beneficiaries,
        {
          beneficiary_full_name: "",
          beneficiary_dob: "",
          beneficiary_relation: "",
          beneficiary_relation_other: "",
          beneficiary_percentage: "",
          beneficiary_address: "",
          beneficiary_email: "",
          beneficiary_phone: "",
          beneficiary_ssn: "",
        },
      ],
    })
  }

  const removeContingentBeneficiary = (index: number) => {
    const updated = formData.contingent_beneficiaries.filter((_, i) => i !== index)
    updateFormData({ contingent_beneficiaries: updated })
  }

  const updateContingentBeneficiary = (index: number, field: string, value: string) => {
    const updated = [...formData.contingent_beneficiaries]
    updated[index] = { ...updated[index], [field]: value }
    updateFormData({ contingent_beneficiaries: updated })
  }

  const totalPercentage = formData.beneficiaries.reduce(
    (sum, b) => sum + (Number.parseFloat(b.beneficiary_percentage) || 0),
    0,
  )

  const contingentTotalPercentage = formData.contingent_beneficiaries.reduce(
    (sum, b) => sum + (Number.parseFloat(b.beneficiary_percentage) || 0),
    0,
  )

  const getErrorClass = (index: number, field: string, isContingent = false) => {
    const prefix = isContingent ? "contingent_beneficiaries" : "beneficiaries"
    return errors.includes(`${prefix}[${index}].${field}`) ? "border-destructive" : "border-2"
  }

  const getLabelClass = (index: number, field: string, isContingent = false) => {
    const prefix = isContingent ? "contingent_beneficiaries" : "beneficiaries"
    return errors.includes(`${prefix}[${index}].${field}`) ? "text-destructive" : ""
  }

  const renderBeneficiaryFields = (beneficiary: any, index: number, updateFunc: (idx: number, f: string, v: string) => void, isContingent: boolean) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor={`ben_name_${isContingent ? 'c_' : ''}${index}`} className={getLabelClass(index, "beneficiary_full_name", isContingent)}>
          {t.fullName} <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`ben_name_${isContingent ? 'c_' : ''}${index}`}
          value={beneficiary.beneficiary_full_name}
          onChange={(e) => updateFunc(index, "beneficiary_full_name", e.target.value)}
          required
          className={getErrorClass(index, "beneficiary_full_name", isContingent)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`ben_dob_${isContingent ? 'c_' : ''}${index}`} className={getLabelClass(index, "beneficiary_dob", isContingent)}>
          {t.dateOfBirth} <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`ben_dob_${isContingent ? 'c_' : ''}${index}`}
          type="date"
          value={beneficiary.beneficiary_dob}
          onChange={(e) => updateFunc(index, "beneficiary_dob", e.target.value)}
          required
          className={getErrorClass(index, "beneficiary_dob", isContingent)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`ben_relation_${isContingent ? 'c_' : ''}${index}`} className={getLabelClass(index, "beneficiary_relation", isContingent)}>
          {t.relation} <span className="text-destructive">*</span>
        </Label>
        <Select
          value={beneficiary.beneficiary_relation}
          onValueChange={(value) => updateFunc(index, "beneficiary_relation", value)}
        >
          <SelectTrigger className={getErrorClass(index, "beneficiary_relation", isContingent)}>
            <SelectValue placeholder={t.selectRelation} />
          </SelectTrigger>
          <SelectContent>
            {relations.map((relation) => (
              <SelectItem key={relation.value} value={relation.value}>
                {relation.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {beneficiary.beneficiary_relation === "Other" && (
        <div className="space-y-2">
          <Label htmlFor={`ben_relation_other_${isContingent ? 'c_' : ''}${index}`} className={getLabelClass(index, "beneficiary_relation_other", isContingent)}>
            {t.specifyRelation} <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`ben_relation_other_${isContingent ? 'c_' : ''}${index}`}
            value={beneficiary.beneficiary_relation_other}
            onChange={(e) => updateFunc(index, "beneficiary_relation_other", e.target.value)}
            required
            className={getErrorClass(index, "beneficiary_relation_other", isContingent)}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor={`ben_percentage_${isContingent ? 'c_' : ''}${index}`} className={getLabelClass(index, "beneficiary_percentage", isContingent)}>
          {t.percentageLabel} <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`ben_percentage_${isContingent ? 'c_' : ''}${index}`}
          type="number"
          min="0"
          max="100"
          value={beneficiary.beneficiary_percentage}
          onChange={(e) => updateFunc(index, "beneficiary_percentage", e.target.value)}
          required
          className={getErrorClass(index, "beneficiary_percentage", isContingent)}
        />
      </div>

      {/* New Fields */}
      <div className="space-y-2">
        <Label htmlFor={`ben_address_${isContingent ? 'c_' : ''}${index}`} className={getLabelClass(index, "beneficiary_address", isContingent)}>
          {t.beneficiaryAddress} <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`ben_address_${isContingent ? 'c_' : ''}${index}`}
          value={beneficiary.beneficiary_address || ""}
          onChange={(e) => updateFunc(index, "beneficiary_address", e.target.value)}
          required
          className={getErrorClass(index, "beneficiary_address", isContingent)}
        />
      </div>

       <div className="space-y-2">
        <Label htmlFor={`ben_email_${isContingent ? 'c_' : ''}${index}`} className={getLabelClass(index, "beneficiary_email", isContingent)}>
          {t.beneficiaryEmail} <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`ben_email_${isContingent ? 'c_' : ''}${index}`}
          type="email"
          value={beneficiary.beneficiary_email || ""}
          onChange={(e) => updateFunc(index, "beneficiary_email", e.target.value)}
          required
          className={getErrorClass(index, "beneficiary_email", isContingent)}
        />
      </div>

       <div className="space-y-2">
        <Label htmlFor={`ben_phone_${isContingent ? 'c_' : ''}${index}`} className={getLabelClass(index, "beneficiary_phone", isContingent)}>
          {t.beneficiaryPhone} <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`ben_phone_${isContingent ? 'c_' : ''}${index}`}
          type="tel"
          value={beneficiary.beneficiary_phone || ""}
          onChange={(e) => updateFunc(index, "beneficiary_phone", e.target.value)}
          required
          className={getErrorClass(index, "beneficiary_phone", isContingent)}
        />
      </div>

       <div className="space-y-2">
        <Label htmlFor={`ben_ssn_${isContingent ? 'c_' : ''}${index}`} className={getLabelClass(index, "beneficiary_ssn", isContingent)}>
          {t.beneficiarySSN}
        </Label>
        <Input
          id={`ben_ssn_${isContingent ? 'c_' : ''}${index}`}
          value={beneficiary.beneficiary_ssn || ""}
          onChange={(e) => updateFunc(index, "beneficiary_ssn", e.target.value)}
          className={getErrorClass(index, "beneficiary_ssn", isContingent)}
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b-2 border-border">
        <h2 className="text-2xl font-bold mb-2">{t.beneficiaries}</h2>
        <p className="text-muted-foreground">{t.beneficiariesDesc}</p>
      </div>

      {/* Main Beneficiaries */}
      <h3 className="text-xl font-semibold mt-4">Main Beneficiaries</h3>
      <div className="space-y-4">
        {formData.beneficiaries.map((beneficiary, index) => (
          <div key={index} className="p-6 bg-secondary/50 border-2 border-border rounded-lg space-y-4 relative">
            <div className="flex items-center justify-between pb-3 border-b-2 border-border">
              <h3 className="text-lg font-semibold">
                {t.beneficiary} {index + 1}
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeBeneficiary(index)}
                className="text-destructive hover:text-destructive"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </Button>
            </div>

            {renderBeneficiaryFields(beneficiary, index, updateBeneficiary, false)}
          </div>
        ))}
      </div>

      <Button type="button" onClick={addBeneficiary} variant="outline" className="gap-2 bg-transparent border-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {t.addBeneficiary}
      </Button>
      {errors.includes("beneficiaries") && (
        <p className="text-destructive text-sm font-medium">{t.fillAllRequired}</p>
      )}

      {formData.beneficiaries.length > 0 && (
        <div
          className={`p-4 rounded-lg border-2 ${totalPercentage === 100 ? "bg-green-500/10 border-green-500/50" : "bg-orange-500/10 border-orange-500/50"
            }`}
        >
          <p className="font-medium">
            {t.totalPercentage} {totalPercentage}% {totalPercentage === 100 ? "✓" : t.mustBe100}
          </p>
        </div>
      )}

       {/* Contingent Beneficiaries */}
       <div className="pt-8 pb-4 border-b-2 border-border">
        <h2 className="text-2xl font-bold mb-2">{t.contingentBeneficiaries}</h2>
        <p className="text-muted-foreground">{t.contingentBeneficiariesDesc}</p>
      </div>

      <div className="space-y-4">
        {formData.contingent_beneficiaries.map((beneficiary, index) => (
          <div key={index} className="p-6 bg-secondary/50 border-2 border-border rounded-lg space-y-4 relative">
            <div className="flex items-center justify-between pb-3 border-b-2 border-border">
              <h3 className="text-lg font-semibold">
                {t.contingentBeneficiary} {index + 1}
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeContingentBeneficiary(index)}
                className="text-destructive hover:text-destructive"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </Button>
            </div>

            {renderBeneficiaryFields(beneficiary, index, updateContingentBeneficiary, true)}
          </div>
        ))}
      </div>

      <Button type="button" onClick={addContingentBeneficiary} variant="outline" className="gap-2 bg-transparent border-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {t.addContingentBeneficiary}
      </Button>

      {formData.contingent_beneficiaries.length > 0 && (
        <div
          className={`p-4 rounded-lg border-2 ${contingentTotalPercentage === 100 ? "bg-green-500/10 border-green-500/50" : "bg-orange-500/10 border-orange-500/50"
            }`}
        >
          <p className="font-medium">
             {t.totalPercentage} {contingentTotalPercentage}% {contingentTotalPercentage === 100 ? "✓" : t.mustBe100}
          </p>
        </div>
      )}
    </div>
  )
}
