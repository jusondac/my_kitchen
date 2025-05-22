class CreateInstructions < ActiveRecord::Migration[8.0]
  def change
    create_table :instructions do |t|
      t.text :step, null: false
      t.integer :position, null: false
      t.references :recipe, null: false, foreign_key: true, index: true

      t.timestamps
    end

    # Add index for ordering instructions by position
    add_index :instructions, [ :recipe_id, :position ]
  end
end
