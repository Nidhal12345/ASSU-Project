"use client"

import { useState, useCallback } from "react"

type ValidationRule<T> = {
  field: keyof T
  validate: (value: any, formData: T) => string | null
}

export function useFormValidation<T extends Record<string, any>>(initialData: T, validationRules: ValidationRule<T>[]) {
  const [formData, setFormData] = useState<T>(initialData)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const updateField = useCallback(
    (field: keyof T, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      setTouched((prev) => ({ ...prev, [field]: true }))

      // Validate field on change
      const rule = validationRules.find((r) => r.field === field)
      if (rule) {
        const error = rule.validate(value, { ...formData, [field]: value })
        setErrors((prev) => ({ ...prev, [field]: error || undefined }))
      }
    },
    [formData, validationRules],
  )

  const validateAll = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    let isValid = true

    validationRules.forEach((rule) => {
      const error = rule.validate(formData[rule.field], formData)
      if (error) {
        newErrors[rule.field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [formData, validationRules])

  const reset = useCallback(() => {
    setFormData(initialData)
    setErrors({})
    setTouched({})
  }, [initialData])

  return {
    formData,
    errors,
    touched,
    updateField,
    validateAll,
    reset,
    setFormData,
  }
}
