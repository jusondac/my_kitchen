class Ingredient < ApplicationRecord
  has_many :recipe_ingredients, dependent: :destroy
  has_many :recipes, through: :recipe_ingredients

  # Validations
  validates :name, presence: true
  validates :description, presence: true
  validates :category, presence: true

  ## update the ransackable below with column you want to add ransack
  def self.ransackable_attributes(auth_object = nil)
    [ "id", "name", "category", "created_at", "updated_at" ]
  end

  def self.ransackable_associations(auth_object = nil)
    [ "recipe_ingredients", "recipes" ]
  end
end
