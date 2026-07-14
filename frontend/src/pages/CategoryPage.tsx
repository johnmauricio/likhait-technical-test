import React, { useState, useEffect } from "react";
import { getCategories, createCategory } from "../services/api";
import { Category, CategoryFormData } from "../types";
import { Modal, Button } from "../vibes";
import { COLORS } from "../constants/colors";
import { CategoryForm } from "../components/CategoryForm";
import { CategoryListTable } from "../components/CategoryListTable";

const CategoryPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data as Category[]);
    } catch (error: any) {
        alert(error.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleAddCategory = async (data: CategoryFormData) => {
    try {
      await createCategory(data);
      await loadCategories();
      setIsModalOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : typeof error === 'string' ? error : JSON.stringify(error);
      alert(message || "Failed to create category");
      throw error;
    }
  };

  const pageStyle: React.CSSProperties = {
    padding: "48px 64px",
    minHeight: "100vh",
    background: COLORS.secondary.s01,
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    justifyContent: "space-between",
  };

  const leftHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "40px",
    fontWeight: 700,
    color: COLORS.secondary.s10,
    margin: 0,
    flexShrink: 0,
  };

  const loadingStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "48px",
    fontSize: "18px",
    color: COLORS.secondary.s08,
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={loadingStyle}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div style={leftHeaderStyle}>
          <h1 style={titleStyle}>List of Categories</h1>
        
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Add Category
        </Button>
      </div>
      <div style={{ marginTop: "32px" }}>
        <CategoryListTable
            categories={categories}
            onCategoryUpdated={loadCategories}
        />
        </div>
     <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Category"
      >
        <CategoryForm
            onSubmit={handleAddCategory}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default CategoryPage;
