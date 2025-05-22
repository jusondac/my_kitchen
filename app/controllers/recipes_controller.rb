class RecipesController < ApplicationController
  before_action :set_recipe, only: %i[ show edit update destroy ]

  # GET /recipes
  def index
    @q = Recipe.ransack(params[:q])
    @pagy, @recipes = pagy(@q.result(distinct: true).order(created_at: :desc))
    @recipe_form = Recipe.new
  end

  # GET /recipes/1
  def show
  end

  # GET /recipes/new
  def new
    @recipe = Recipe.new
    3.times { @recipe.recipe_ingredients.build }
  end

  # GET /recipes/1/edit
  def edit
    @recipe.recipe_ingredients.build if @recipe.recipe_ingredients.empty?
  end

  # POST /recipes
  def create
    @recipe = Recipe.new(recipe_params)

    if @recipe.save
      redirect_to recipes_path, notice: "Recipe was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /recipes/1
  def update
    if @recipe.update(recipe_params)
      redirect_to recipes_path, notice: "Recipe was successfully updated.", status: :see_other
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /recipes/1
  def destroy
    @recipe.destroy!
    redirect_to recipes_path, notice: "Recipe was successfully destroyed.", status: :see_other
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_recipe
      @recipe = Recipe.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def recipe_params
      params.require(:recipe).permit(:name, :description, :instructions, :cooking_time, :user_id,
        recipe_ingredients_attributes: [ :id, :ingredient_id, :quantity, :_destroy ])
    end
end
