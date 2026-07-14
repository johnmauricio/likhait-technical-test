/**
 * API service for communicating with the backend
 */

import { Category, Expense, ExpenseFormData, CategoryFormData } from "../types";

const API_BASE_URL = "http://localhost:3000/api";

/**
 * Fetch all expenses
 * @returns a promise that resolves to an array of Expense objects
 */
export async function fetchExpenses(): Promise<Expense[]> {
  const response = await fetch(`${API_BASE_URL}/expenses`);
  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }
  return response.json();
}

/**
 * Fetch expenses for a specific year and month
 * @returns a promise that resolves to an array of Expense objects
 */
export async function getExpenses(
  year: number,
  month: number,
): Promise<Expense[]> {
  const response = await fetch(
    `${API_BASE_URL}/expenses?year=${year}&month=${month}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }
  return response.json();
}

/**
 * Fetch all categories
 * @returns a promise that resolves to an array of category objects
 */
export async function fetchCategories(): Promise<
  Array<{ id: number; name: string }>
> {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

/**
 * Create a new expense
 * @param data - the expense data to create
 * @returns a promise that resolves to the created Expense object
 */
export async function createExpense(data: ExpenseFormData): Promise<Expense> {
  // Convert category name to category_id
  const categories = await fetchCategories();
  const category = categories.find((c) => c.name === data.category);

  const expenseData = {
    description: data.description,
    amount: data.amount,
    category_id: category?.id,
    date: data.date,
  };

  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expense: expenseData }),
  });

  if (!response.ok) {
    throw new Error("Failed to create expense");
  }

  return response.json();
}

/**
 * Update an existing expense
 * @param id - the ID of the expense to update
 * @param data - the updated expense data
 * @returns a promise that resolves to the updated Expense object 
 */
export async function updateExpense(
  id: number,
  data: Partial<ExpenseFormData>,
): Promise<Expense> {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expense: data }),
  });

  if (!response.ok) {
    throw new Error("Failed to update expense");
  }

  return response.json();
}

/**
 * Delete an expense
 * @param id - the ID of the expense to delete
 * @returns a promise that resolves when the expense is deleted 
 */
export async function deleteExpense(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete expense");
  }
}


/**
 * get categories 
 * @returns a promise that resolves to an array of category objects
 */
export async function getCategories(): Promise<Array<{ id: number; name: string }>> {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

/**
 * Create a new category
 * @param data - the category data to create
 * @returns a promise that resolves to the created Category object
 */
export async function createCategory(data: CategoryFormData): Promise<Category> {
  
  const categoryData = {
    name: data.name
  };
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category: categoryData }),
  });

  if (!response.ok) {
    throw new Error("Failed to create category");
  }

  return response.json();
}


/**
 * Delete an category
 * @param id - the ID of the category to delete
 * @returns a promise that resolves when the category is deleted
 */
export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete category");
  }
}



/**
 * Update an existing category
 * @param id - the ID of the category to update
 * @param data - the updated category data
 * @returns a promise that resolves to the updated Category object
 */
export async function updateCategory(
  id: number,
  data: Partial<CategoryFormData>,
): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category: data }),
  });

  if (!response.ok) {
    throw new Error("Failed to update category");
  }

  return response.json();
}
