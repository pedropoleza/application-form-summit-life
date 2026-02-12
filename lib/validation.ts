import { FormData } from "@/app/page"

export const validateStep = (step: number, formData: FormData): string[] => {
    const errors: string[] = []
    switch (step) {
        case 1: // Personal Info
            if (!formData.first_name) errors.push("first_name")
            if (!formData.last_name) errors.push("last_name")
            if (!formData.email) errors.push("email")
            if (!formData.phone) errors.push("phone")
            if (!formData.address_line) errors.push("address_line")
            if (!formData.dob) errors.push("dob")
            if (!formData.height_ft_in) errors.push("height_ft_in")
            if (!formData.weight_lbs) errors.push("weight_lbs")
            return errors
        case 2: // Documents
            if (!formData.has_drivers_license) errors.push("has_drivers_license")
            if (formData.has_drivers_license === "yes" && !formData.drivers_license_upload) errors.push("drivers_license_upload")

            if (!formData.born_in_usa) errors.push("born_in_usa")
            if (formData.born_in_usa === "yes") {
                if (!formData.state_of_birth) errors.push("state_of_birth")
            } else if (formData.born_in_usa === "no") {
                if (!formData.passport_upload) errors.push("passport_upload")
                if (!formData.has_valid_visa) errors.push("has_valid_visa")
                if (formData.has_valid_visa === "yes") {
                    if (!formData.visa_type) errors.push("visa_type")
                    if (!formData.visa_expiration_date) errors.push("visa_expiration_date")
                }
                if (!formData.has_green_card) errors.push("has_green_card")
                if (formData.has_green_card === "yes" && !formData.green_card_upload) errors.push("green_card_upload")
            }
            // Household Info
            if (!formData.household_income) errors.push("household_income")
            if (!formData.household_members) errors.push("household_members")
            return errors
        case 3: // Employment
            if (!formData.occupation) errors.push("occupation")
            if (!formData.employer_name) errors.push("employer_name")
            if (!formData.time_worked) errors.push("time_worked")
            if (!formData.monthly_salary_usd) errors.push("monthly_salary_usd")
            if (!formData.assets_description) errors.push("assets_description")
            if (!formData.has_business) errors.push("has_business")
            if (formData.has_business === "yes") {
                if (!formData.business_name) errors.push("business_name")
                if (!formData.business_address) errors.push("business_address")
            }
            return errors
        case 4: // Banking
            if (!formData.bank_name) errors.push("bank_name")
            if (!formData.routing_number) errors.push("routing_number")
            if (!formData.account_number) errors.push("account_number")
            if (!formData.account_type) errors.push("account_type")
            if (!formData.best_day_to_debit) errors.push("best_day_to_debit")
            if (!formData.has_current_life_insurance) errors.push("has_current_life_insurance")
            if (formData.has_current_life_insurance === "yes") {
                if (!formData.is_replacement) errors.push("is_replacement")
                if (!formData.ins_company_name) errors.push("ins_company_name")
                if (!formData.policy_number) errors.push("policy_number")
                if (!formData.coverage_amount_usd) errors.push("coverage_amount_usd")
            }
            return errors
        case 5: // Medical History
            if (!formData.visited_doctor_us) errors.push("visited_doctor_us")
            if (formData.visited_doctor_us === "yes") {
                if (!formData.last_visit_date) errors.push("last_visit_date")
                if (!formData.doctor_name) errors.push("doctor_name")
                if (!formData.doctor_phone) errors.push("doctor_phone")
                if (!formData.visit_reason) errors.push("visit_reason")
                if (!formData.visit_result) errors.push("visit_result")
            }
            if (!formData.has_preexisting_disease) errors.push("has_preexisting_disease")
            if (formData.has_preexisting_disease === "yes") {
                // Validate array of conditions
                if (formData.pre_existing_conditions.length === 0) {
                     // Should have at least one if YES
                } else {
                     formData.pre_existing_conditions.forEach((cond, idx) => {
                         if (!cond.diagnosis_name) errors.push(`pre_existing_conditions[${idx}].diagnosis_name`)
                         if (!cond.diagnosis_date) errors.push(`pre_existing_conditions[${idx}].diagnosis_date`)
                     })
                }
            }
            if (!formData.recent_weight_change) errors.push("recent_weight_change")
            if (formData.recent_weight_change === "yes") {
                if (!formData.weight_change_reason) errors.push("weight_change_reason")
            }
            return errors
        case 6: // Habits
            if (!formData.used_nicotine_5y) errors.push("used_nicotine_5y")
            if (formData.used_nicotine_5y === "yes") {
                if (!formData.nicotine_product_type) errors.push("nicotine_product_type")
                if (!formData.qty_per_day) errors.push("qty_per_day")
                if (!formData.last_use_date) errors.push("last_use_date")
            }
            if (!formData.insurance_declined_history) errors.push("insurance_declined_history")
            if (!formData.driving_violations) errors.push("driving_violations")
            if (!formData.criminal_record) errors.push("criminal_record")
            if (!formData.bankruptcy_involved) errors.push("bankruptcy_involved")
            if (!formData.pending_life_di_claim_12m) errors.push("pending_life_di_claim_12m")
            if (!formData.work_disability_5y) errors.push("work_disability_5y")
            if (!formData.hazard_activities) errors.push("hazard_activities")
            if (formData.hazard_activities === "yes" && !formData.hazard_details) errors.push("hazard_details")
            if (!formData.non_passenger_aviation) errors.push("non_passenger_aviation")
            if (formData.non_passenger_aviation === "yes" && !formData.aviation_details) errors.push("aviation_details")
            return errors
        case 7: // Health Checklist
            const healthQuestions = [
                "cardio", "respiratory", "digestive", "neuro", "endocrine", "msk_skin",
                "urinary_repro", "mental", "onco_hema", "hiv", "alcohol_drugs",
                "extra_doctors_5y", "hospitalized_5y_or_planned", "pending_appointments"
            ]
            healthQuestions.forEach(q => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (!(formData as any)[q]) errors.push(q)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((formData as any)[q] === "yes" && !(formData as any)[`details_${q}`]) errors.push(`details_${q}`)
            })
            if (!formData.medications_current) errors.push("medications_current")
            return errors
        case 8: // Family History
            if (!formData.father_alive) errors.push("father_alive")
            if (formData.father_alive === "yes" && !formData.father_current_age) errors.push("father_current_age")
            if (formData.father_alive === "no") {
                if (!formData.father_dod) errors.push("father_dod")
                if (!formData.father_cause) errors.push("father_cause")
            }
            if (!formData.mother_alive) errors.push("mother_alive")
            if (formData.mother_alive === "yes" && !formData.mother_current_age) errors.push("mother_current_age")
            if (formData.mother_alive === "no") {
                if (!formData.mother_dod) errors.push("mother_dod")
                if (!formData.mother_cause) errors.push("mother_cause")
            }
            if (!formData.family_history_major) errors.push("family_history_major")
            if (formData.family_history_major === "yes" && !formData.details_family_history_major) errors.push("details_family_history_major")
            return errors
        case 9: // Beneficiaries
            if (formData.beneficiaries.length === 0) errors.push("beneficiaries")
            // Check if any beneficiary field is empty
            formData.beneficiaries.forEach((b, index) => {
                if (!b.beneficiary_full_name) errors.push(`beneficiaries[${index}].beneficiary_full_name`)
                if (!b.beneficiary_dob) errors.push(`beneficiaries[${index}].beneficiary_dob`)
                if (!b.beneficiary_relation) errors.push(`beneficiaries[${index}].beneficiary_relation`)
                if (b.beneficiary_relation === "Other" && !b.beneficiary_relation_other) errors.push(`beneficiaries[${index}].beneficiary_relation_other`)
                if (!b.beneficiary_percentage) errors.push(`beneficiaries[${index}].beneficiary_percentage`)
                if (!b.beneficiary_address) errors.push(`beneficiaries[${index}].beneficiary_address`)
                if (!b.beneficiary_email) errors.push(`beneficiaries[${index}].beneficiary_email`)
                if (!b.beneficiary_phone) errors.push(`beneficiaries[${index}].beneficiary_phone`)
            })

            // Optional contingent beneficiaries check
            if (formData.contingent_beneficiaries && formData.contingent_beneficiaries.length > 0) {
                 formData.contingent_beneficiaries.forEach((b, index) => {
                    if (!b.beneficiary_full_name) errors.push(`contingent_beneficiaries[${index}].beneficiary_full_name`)
                    if (!b.beneficiary_dob) errors.push(`contingent_beneficiaries[${index}].beneficiary_dob`)
                    if (!b.beneficiary_relation) errors.push(`contingent_beneficiaries[${index}].beneficiary_relation`)
                    if (b.beneficiary_relation === "Other" && !b.beneficiary_relation_other) errors.push(`contingent_beneficiaries[${index}].beneficiary_relation_other`)
                    if (!b.beneficiary_percentage) errors.push(`contingent_beneficiaries[${index}].beneficiary_percentage`)
                     if (!b.beneficiary_address) errors.push(`contingent_beneficiaries[${index}].beneficiary_address`)
                    if (!b.beneficiary_email) errors.push(`contingent_beneficiaries[${index}].beneficiary_email`)
                    if (!b.beneficiary_phone) errors.push(`contingent_beneficiaries[${index}].beneficiary_phone`)
                })
            }
            return errors
        default:
            return []
    }
}
