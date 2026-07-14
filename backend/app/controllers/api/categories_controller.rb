class Api::CategoriesController < ApplicationController
  # load and return all categories, ordered by name
  def index
    categories = Category.order(:name)

    render json: categories.map { |category| format_category(category) }
  end

  # create a new category with the given name
  def create
    category = Category.new(category_params)
  
    if category.save
      render json: format_category(category), status: :created
    else
      render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # update an existing category with the given name
  def update
    category = Category.find(params[:id])

    if category.update(category_params)
      render json: format_category(category)
    else
      render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # delete a category if it has no associated expenses
  def destroy
    category = Category.find(params[:id])
    if category.expenses.exists?
    render json: { errors: ["Cannot delete category because it is in use"] },
           status: :unprocessable_entity
    else
      category.destroy
      head :no_content
    end
  end

  private
  # permit only the name parameter for category
    def category_params
      params.require(:category).permit(:name)
    end
  # format the category object for JSON response
    def format_category(category)
      {
        id: category.id,
        name: category.name,
        created_at: category.created_at,
        updated_at: category.updated_at
      }
    end
  end

