class CreateRecipes < ActiveRecord::Migration[8.0]
  def change
    create_table :recipes do |t|
      t.string :name
      t.text :description
      t.text :instructions
      t.integer :cooking_time
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
