class RecipeIngredient < ApplicationRecord
  belongs_to :recipe
  belongs_to :ingredient

  validates :quantity, presence: true

  ## update the ransackable below with column you want to add ransack
  def self.ransackable_attributes(auth_object = nil)
    [ "quantity" ]
  end

  def self.ransackable_associations(auth_object = nil)
    [ "ingredient", "recipe" ]
  end
end
