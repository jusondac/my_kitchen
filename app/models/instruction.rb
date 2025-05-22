class Instruction < ApplicationRecord
  belongs_to :recipe

  # Validations
  validates :step, presence: true
  validates :position, presence: true

  # Default scope to ensure instructions are ordered by position
  default_scope { order(position: :asc) }

  ## update the ransackable below with column you want to add ransack
  def self.ransackable_attributes(auth_object = nil)
    [ "id", "step", "position", "recipe_id" ]
  end

  def self.ransackable_associations(auth_object = nil)
    [ "recipe" ]
  end
end
