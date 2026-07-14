/**
 * Calendar expense table component
 */

import React, { useState } from "react";
import { Category, CategoryFormData } from "../types";
import { COLORS } from "../constants/colors.ts";
import { Button, Modal, Pagination } from "../vibes/index";
import { deleteCategory, updateCategory } from "../services/api";
import { CategoryForm } from "./CategoryForm.tsx";

// Props for the CategoryListTable component
interface CategoryListTableProps {
  categories: Category[];
  onCategoryUpdated: () => void;
}

const ITEMS_PER_PAGE = 10;

/**
 * CategoryListTable component for displaying a list of categories in a table with pagination
 * @param categories - array of category objects to display in the table
 * @param onCategoryUpdated - function to call when a category is updated or deleted
 * @returns a table with category names and action buttons for editing/deleting categories
 */
export function CategoryListTable({
  categories,
  onCategoryUpdated,
}: CategoryListTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCategories = categories.slice(startIndex, endIndex);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingCategory) return;
    try {
      await deleteCategory(deletingCategory.id);
      setIsDeleteModalOpen(false);
      setDeletingCategory(null);
      onCategoryUpdated();
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category");
    }
  };

  const handleUpdate = async (data: CategoryFormData) => {
    if (!editingCategory) return;
    try {
      await updateCategory(editingCategory.id, data);
      setIsEditModalOpen(false);
      setEditingCategory(null);
      onCategoryUpdated();
    } catch (error) {
      const message = error instanceof Error ? error.message : typeof error === 'string' ? error : JSON.stringify(error);
      alert(message || "Failed to update category");
      throw error;
    }
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: COLORS.background.main,
    borderRadius: "0.5rem",
    overflow: "hidden",
    border: `1px solid ${COLORS.border}`,
  };

  const theadStyle: React.CSSProperties = {
    backgroundColor: COLORS.background.card,
  };

  const thStyle: React.CSSProperties = {
    padding: "0.75rem",
    textAlign: "left",
    fontWeight: 600,
    color: COLORS.text.primary,
    borderBottom: `2px solid ${COLORS.border}`,
  };

  const tdStyle: React.CSSProperties = {
    padding: "0.75rem",
    borderBottom: `1px solid ${COLORS.border}`,
    color: COLORS.text.primary,
  };

  const emptyStyle: React.CSSProperties = {
    padding: "2rem",
    textAlign: "center",
    color: COLORS.text.secondary,
  };

  const actionButtonsStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
  };
  
  if (categories.length === 0) {
    return (
      <div style={tableStyle}>
        <div style={emptyStyle}>
          No categories found. Add your first category to get started!
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Table displaying the list of categories with action buttons for editing and deleting */}
      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={{ ...thStyle, textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.map((category) => (
            <tr key={category.id}>
              <td style={tdStyle}>{category.name}</td>
              
              <td style={{ ...tdStyle, textAlign: "center" }}>
                <div style={actionButtonsStyle}>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleEdit(category)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDelete(category)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* End of table displaying the list of categories with action buttons for editing and deleting */}

      {/* Pagination component for navigating through the list of categories */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      {/* End of pagination component for navigating through the list of categories */}

      {/* Edit category modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCategory(null);
        }}
        title="Edit Category"
      >
        {editingCategory && (
          <CategoryForm
            initialData={{
              name: editingCategory.name,
            }}
            onSubmit={handleUpdate}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingCategory(null);
            }}
        
            submitLabel="Update Category"
          />
        )}
      </Modal>
      {/* End of edit category modal */}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingCategory(null);
        }}
        title="Delete Category"
      >
        <div style={{ padding: "1rem 0" }}>
          <p style={{ marginBottom: "1.5rem", color: COLORS.text.primary }}>
            Are you sure you want to delete this category?
          </p>
          {deletingCategory && (
            <p style={{ marginBottom: "1.5rem", color: COLORS.text.secondary }}>
              <strong>{deletingCategory.name}</strong>
            </p>
          )}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="secondary"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeletingCategory(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      {/* End of delete confirmation modal */}
    </>
  );
}
