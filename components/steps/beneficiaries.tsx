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

  const totalPercentage = formData.beneficiaries.reduce(
    (sum, b) => sum + (Number.parseFloat(b.beneficiary_percentage) || 0),
    0,
  )

  const getErrorClass = (index: number, field: string) => {
    return errors.includes(`beneficiaries[${index}].${field}`) ? "border-destructive" : "border-2"
  }

  const getLabelClass = (index: number, field: string) => {
    return errors.includes(`beneficiaries[${index}].${field}`) ? "text-destructive" : ""
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b-2 border-border">
        <h2 className="text-2xl font-bold mb-2">{t.beneficiaries}</h2>
        <p className="text-muted-foreground">{t.beneficiariesDesc}</p>
      </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`ben_name_${index}`} className={getLabelClass(index, "beneficiary_full_name")}>
                  {t.fullName} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`ben_name_${index}`}
                  value={beneficiary.beneficiary_full_name}
                  onChange={(e) => updateBeneficiary(index, "beneficiary_full_name", e.target.value)}
                  required
                  className={getErrorClass(index, "beneficiary_full_name")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`ben_dob_${index}`} className={getLabelClass(index, "beneficiary_dob")}>
                  {t.dateOfBirth} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`ben_dob_${index}`}
                  type="date"
                  value={beneficiary.beneficiary_dob}
                  onChange={(e) => updateBeneficiary(index, "beneficiary_dob", e.target.value)}
                  required
                  className={getErrorClass(index, "beneficiary_dob")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`ben_relation_${index}`} className={getLabelClass(index, "beneficiary_relation")}>
                  {t.relation} <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={beneficiary.beneficiary_relation}
                  onValueChange={(value) => updateBeneficiary(index, "beneficiary_relation", value)}
                >
                  <SelectTrigger className={getErrorClass(index, "beneficiary_relation")}>
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
                  <Label htmlFor={`ben_relation_other_${index}`} className={getLabelClass(index, "beneficiary_relation_other")}>
                    {t.specifyRelation} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`ben_relation_other_${index}`}
                    value={beneficiary.beneficiary_relation_other}
                    onChange={(e) => updateBeneficiary(index, "beneficiary_relation_other", e.target.value)}
                    required
                    className={getErrorClass(index, "beneficiary_relation_other")}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor={`ben_percentage_${index}`} className={getLabelClass(index, "beneficiary_percentage")}>
                  {t.percentageLabel} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`ben_percentage_${index}`}
                  type="number"
                  min="0"
                  max="100"
                  value={beneficiary.beneficiary_percentage}
                  onChange={(e) => updateBeneficiary(index, "beneficiary_percentage", e.target.value)}
                  required
                  className={getErrorClass(index, "beneficiary_percentage")}
                />
              </div>
            </div>
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
    </div>
  )
}
