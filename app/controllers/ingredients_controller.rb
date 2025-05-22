class IngredientsController < ApplicationController
  before_action :set_ingredient, only: %i[ show edit update destroy ]

  # GET /ingredients
  def index
    @q = Ingredient.ransack(params[:q])
    @pagy, @ingredients = pagy(@q.result(distinct: true).order(created_at: :desc))
    @ingredient_form = Ingredient.new
  end

  # GET /ingredients/1
  def show
  end

  # GET /ingredients/new
  def new
    @ingredient = Ingredient.new
  end

  # GET /ingredients/1/edit
  def edit
  end

  # POST /ingredients
  def create
    @ingredient = Ingredient.new(ingredient_params)

    if @ingredient.save
      redirect_to ingredients_path, notice: "Ingredient was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /ingredients/1
  def update
    if @ingredient.update(ingredient_params)
      redirect_to ingredients_path, notice: "Ingredient was successfully updated.", status: :see_other
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /ingredients/1
  def destroy
    @ingredient.destroy!
    redirect_to ingredients_path, notice: "Ingredient was successfully destroyed.", status: :see_other
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_ingredient
      @ingredient = Ingredient.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def ingredient_params
      params.expect(ingredient: [ :name, :description, :category ])
    end
end
