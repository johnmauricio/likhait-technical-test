/**
 * Custom hook for managing category form state and validation
 */

import { useState } from "react";
import { CategoryFormData } from "../types";

interface UseCategoryFormProps {
  initialData?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
}

/**
 * Custom hook for managing category form state and validation
 * @param param0 - object containing initialData and onSubmit function
 * @param param0 initialData - optional initial data for the form
 * @param param0 onSubmit - function to call when the form is submitted
 * @returns an object containing formData, errors, isSubmitting, handleChange, handleSubmit, and resetForm
 */
export function useCategoryForm({ initialData, onSubmit }: UseCategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || "",
  });

  const [errors, setErrors] = useState<Partial<CategoryFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof CategoryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CategoryFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        name: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: initialData?.name || "",
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
