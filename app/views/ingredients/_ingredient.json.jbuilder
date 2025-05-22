json.extract! ingredient, :id, :name, :description, :category, :created_at, :updated_at
json.url ingredient_url(ingredient, format: :json)
