class Recipe < ApplicationRecord
  belongs_to :user
  has_many :recipe_ingredients, dependent: :destroy
  has_many :ingredients, through: :recipe_ingredients

  accepts_nested_attributes_for :recipe_ingredients, allow_destroy: true, reject_if: :all_blank

  # Validations
  validates :name, presence: true
  validates :description, presence: true
  validates :instructions, presence: true
  validates :cooking_time, presence: true

  ## update the ransackable below with column you want to add ransack
  def self.ransackable_attributes(auth_object = nil)
    [ "id", "name", "description", "cooking_time", "created_at", "updated_at" ]
  end

  def self.ransackable_associations(auth_object = nil)
    [ "ingredients", "recipe_ingredients", "user" ]
  end
end
