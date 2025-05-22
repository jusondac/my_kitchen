class MigrateRecipeInstructionsToInstructionModel < ActiveRecord::Migration[8.0]
  def up
    Recipe.all.each do |recipe|
      if recipe.instructions.present?
        instructions_text = recipe.instructions.split(/\r?\n/).reject(&:blank?)
        instructions_text.each_with_index do |step, index|
          recipe.instructions.create!(step: step, position: index + 1)
        end
      end
    end
  end

  def down
    # Cannot reliably restore the old format, but we'll keep the text in both places for a while
  end
end
