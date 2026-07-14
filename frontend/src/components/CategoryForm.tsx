/**
 * Form component for adding/editing categories
 */

import React from "react";
import { CategoryFormData } from "../types";
import { TextField, Button } from "../vibes";
import { useCategoryForm } from "../hooks/useCategoryForm";

// Props for the CategoryForm component
interface CategoryFormProps {
  initialData?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}


/**
 * Form component for adding/editing categories
 * @param initialData - optional initial data for the form, used for editing an existing category
 * @param onSubmit - function to call when the form is submitted
 * @param onCancel - optional function to call when the cancel button is clicked
 * @param submitLabel - optional label for the submit button, defaults to "Add Category"
 * @returns a form with a text field for the category name and submit/cancel buttons
 */
export function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Category",
}: CategoryFormProps) {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useCategoryForm({
      initialData,
      onSubmit,
    });

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  return (
    /* Form for adding/editing categories with validation and submit/cancel buttons */
    <form onSubmit={handleSubmit} style={formStyle}>
      <TextField
        label="Category Name"
        type="text"
        placeholder="Enter Category Name"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        error={errors.name}
        fullWidth
        required
      />

      <div style={buttonGroupStyle}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
    /* End of form for adding/editing categories with validation and submit/cancel buttons */
  );
}
