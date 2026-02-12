"use client"

import type { FormData } from "@/app/page"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { translations, type Language } from "@/lib/translations"

interface Props {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  language: Language
  errors?: string[]
}

export function Banking({ formData, updateFormData, language, errors = [] }: Props) {
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
        <h2 className="text-2xl font-bold mb-2">{t.banking}</h2>
        <p className="text-muted-foreground">{t.bankingDesc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bank_name" className={getLabelClass("bank_name")}>
            {t.bankName} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="bank_name"
            value={formData.bank_name}
            onChange={(e) => updateFormData({ bank_name: e.target.value })}
            required
            className={getErrorClass("bank_name")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="routing_number" className={getLabelClass("routing_number")}>
            {t.routingNumber} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="routing_number"
            placeholder="9 digits"
            value={formData.routing_number}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").substring(0, 9)
              updateFormData({ routing_number: value })
            }}
            required
            className={getErrorClass("routing_number")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="account_number" className={getLabelClass("account_number")}>
            {t.accountNumber} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="account_number"
            value={formData.account_number}
            onChange={(e) => updateFormData({ account_number: e.target.value })}
            required
            className={getErrorClass("account_number")}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="account_type" className={getLabelClass("account_type")}>
            {t.accountType} <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.account_type} onValueChange={(value) => updateFormData({ account_type: value })}>
            <SelectTrigger className={getErrorClass("account_type")}>
              <SelectValue placeholder={t.selectAccountType} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="checking">{t.checking}</SelectItem>
              <SelectItem value="savings">{t.savings}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label className={getLabelClass("best_day_to_debit")}>
          {t.bestDayToDebit} <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => updateFormData({ best_day_to_debit: day.toString() })}
              className={cn(
                "h-12 rounded-lg border-2 font-medium transition-colors",
                formData.best_day_to_debit === day.toString()
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-secondary-foreground border-border hover:border-primary",
                errors.includes("best_day_to_debit") ? "border-destructive" : ""
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className={getLabelClass("has_current_life_insurance")}>
          {t.hasCurrentLifeInsurance} <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => updateFormData({ has_current_life_insurance: "yes" })}
            className={cn(
              "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
              formData.has_current_life_insurance === "yes"
                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
              errors.includes("has_current_life_insurance") ? "border-destructive" : ""
            )}
          >
            {t.yes}
          </button>
          <button
            type="button"
            onClick={() => updateFormData({ has_current_life_insurance: "no" })}
            className={cn(
              "py-3 px-6 rounded-xl border-2 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
              formData.has_current_life_insurance === "no"
                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                : "bg-card text-card-foreground border-border hover:border-primary hover:shadow-md hover:scale-102",
              errors.includes("has_current_life_insurance") ? "border-destructive" : ""
            )}
          >
            {t.no}
          </button>
        </div>
      </div>

      {formData.has_current_life_insurance === "yes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="is_replacement" className={getLabelClass("is_replacement")}>
              {t.isReplacement} <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.is_replacement}
              onValueChange={(value) => updateFormData({ is_replacement: value })}
            >
              <SelectTrigger className={getErrorClass("is_replacement")}>
                <SelectValue placeholder={t.select} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">{t.yes}</SelectItem>
                <SelectItem value="no">{t.no}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ins_company_name" className={getLabelClass("ins_company_name")}>
              {t.insuranceCompanyName} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ins_company_name"
              value={formData.ins_company_name}
              onChange={(e) => updateFormData({ ins_company_name: e.target.value })}
              required
              className={getErrorClass("ins_company_name")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="policy_number" className={getLabelClass("policy_number")}>
              {t.policyNumber} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="policy_number"
              value={formData.policy_number}
              onChange={(e) => updateFormData({ policy_number: e.target.value })}
              required
              className={getErrorClass("policy_number")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverage_amount_usd" className={getLabelClass("coverage_amount_usd")}>
              {t.coverageAmountUSD} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="coverage_amount_usd"
              type="number"
              value={formData.coverage_amount_usd}
              onChange={(e) => updateFormData({ coverage_amount_usd: e.target.value })}
              required
              className={getErrorClass("coverage_amount_usd")}
            />
          </div>
        </div>
      )}
    </div>
  )
}
