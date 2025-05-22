# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Clear existing data
puts "Clearing existing data..."
RecipeIngredient.destroy_all
Recipe.destroy_all
Ingredient.destroy_all
User.destroy_all

# Create main user
puts "Creating main user..."
main_user = User.create!(
  email_address: "user@example.com",
  password: "q1w2e3r4",
  password_confirmation: "q1w2e3r4"
)

# Create 20 additional users
puts "Creating 20 additional users..."
20.times do |i|
  User.create!(
    email_address: "user#{i+1}@example.com",
    password: "q1w2e3r4",
    password_confirmation: "q1w2e3r4"
  )
end

# Create ingredients by category
puts "Creating ingredients..."

# Vegetables
vegetables = [
  { name: "Tomato", description: "Red, juicy fruit often used as vegetable", category: "Vegetable" },
  { name: "Onion", description: "Layered vegetable with strong flavor", category: "Vegetable" },
  { name: "Garlic", description: "Pungent bulb used for flavoring", category: "Vegetable" },
  { name: "Carrot", description: "Orange root vegetable", category: "Vegetable" },
  { name: "Bell Pepper", description: "Sweet, colorful peppers", category: "Vegetable" },
  { name: "Spinach", description: "Leafy green vegetable", category: "Vegetable" }
]

# Proteins
proteins = [
  { name: "Chicken Breast", description: "Lean white meat", category: "Protein" },
  { name: "Ground Beef", description: "Minced beef meat", category: "Protein" },
  { name: "Tofu", description: "Soybean curd", category: "Protein" },
  { name: "Eggs", description: "Chicken eggs", category: "Protein" },
  { name: "Salmon", description: "Pink-fleshed fish", category: "Protein" }
]

# Grains
grains = [
  { name: "Rice", description: "White or brown grain", category: "Grain" },
  { name: "Pasta", description: "Wheat-based noodles", category: "Grain" },
  { name: "Quinoa", description: "Protein-rich grain", category: "Grain" },
  { name: "Bread", description: "Baked wheat product", category: "Grain" }
]

# Dairy
dairy = [
  { name: "Milk", description: "Cow's milk", category: "Dairy" },
  { name: "Cheese", description: "Fermented milk product", category: "Dairy" },
  { name: "Yogurt", description: "Fermented milk with cultures", category: "Dairy" },
  { name: "Butter", description: "Fat made from cream", category: "Dairy" }
]

# Spices
spices = [
  { name: "Salt", description: "Basic seasoning", category: "Spice" },
  { name: "Black Pepper", description: "Ground peppercorns", category: "Spice" },
  { name: "Cumin", description: "Earthy spice from seeds", category: "Spice" },
  { name: "Paprika", description: "Ground red peppers", category: "Spice" },
  { name: "Oregano", description: "Aromatic herb", category: "Spice" }
]

all_ingredients = vegetables + proteins + grains + dairy + spices

# Create ingredients in database
ingredients = {}
all_ingredients.each do |ingredient_data|
  ingredient = Ingredient.create!(ingredient_data)
  ingredients[ingredient.name] = ingredient
end

puts "Creating recipes..."

# Create sample recipes
recipes_data = [
  {
    name: "Spaghetti Bolognese",
    description: "Classic Italian pasta with meat sauce",
    instructions: "1. Cook pasta according to package instructions.\n2. Brown ground beef in a pan.\n3. Add onions, garlic, and tomatoes.\n4. Simmer for 20 minutes.\n5. Serve sauce over pasta.",
    cooking_time: 35,
    user: main_user,
    ingredients: [
      { ingredient: ingredients["Ground Beef"], quantity: "500g" },
      { ingredient: ingredients["Onion"], quantity: "1 medium, diced" },
      { ingredient: ingredients["Garlic"], quantity: "3 cloves, minced" },
      { ingredient: ingredients["Tomato"], quantity: "5 medium, chopped" },
      { ingredient: ingredients["Pasta"], quantity: "400g" },
      { ingredient: ingredients["Salt"], quantity: "to taste" },
      { ingredient: ingredients["Black Pepper"], quantity: "to taste" },
      { ingredient: ingredients["Oregano"], quantity: "1 tsp" }
    ]
  },
  {
    name: "Vegetable Stir Fry",
    description: "Quick and healthy vegetable dish",
    instructions: "1. Heat oil in a wok or large pan.\n2. Add garlic and onion, sauté until fragrant.\n3. Add vegetables and stir fry for 5-7 minutes.\n4. Add sauce and cook for another minute.\n5. Serve hot with rice.",
    cooking_time: 15,
    user: User.all.sample,
    ingredients: [
      { ingredient: ingredients["Bell Pepper"], quantity: "1, sliced" },
      { ingredient: ingredients["Carrot"], quantity: "2, julienned" },
      { ingredient: ingredients["Garlic"], quantity: "2 cloves, minced" },
      { ingredient: ingredients["Onion"], quantity: "1 small, sliced" },
      { ingredient: ingredients["Tofu"], quantity: "200g, cubed" },
      { ingredient: ingredients["Rice"], quantity: "2 cups, cooked" },
      { ingredient: ingredients["Salt"], quantity: "1/2 tsp" }
    ]
  },
  {
    name: "Creamy Tomato Soup",
    description: "Comforting tomato soup with a creamy finish",
    instructions: "1. Sauté onions and garlic until soft.\n2. Add tomatoes and simmer for 15 minutes.\n3. Blend until smooth.\n4. Return to heat and add milk or cream.\n5. Season and serve hot.",
    cooking_time: 30,
    user: User.all.sample,
    ingredients: [
      { ingredient: ingredients["Tomato"], quantity: "8 large, chopped" },
      { ingredient: ingredients["Onion"], quantity: "1 medium, chopped" },
      { ingredient: ingredients["Garlic"], quantity: "2 cloves, minced" },
      { ingredient: ingredients["Milk"], quantity: "1 cup" },
      { ingredient: ingredients["Salt"], quantity: "to taste" },
      { ingredient: ingredients["Black Pepper"], quantity: "to taste" },
      { ingredient: ingredients["Butter"], quantity: "2 tbsp" }
    ]
  }
]

# Create recipes in database
recipes_data.each do |recipe_data|
  ingredients_data = recipe_data.delete(:ingredients)
  recipe = Recipe.create!(recipe_data)

  ingredients_data.each do |ingredient_data|
    RecipeIngredient.create!(
      recipe: recipe,
      ingredient: ingredient_data[:ingredient],
      quantity: ingredient_data[:quantity]
    )
  end
end

# Create 7 more random recipes
7.times do |i|
  user = User.all.sample
  recipe = Recipe.create!(
    name: "Recipe #{i+1}",
    description: "A delicious homemade dish #{i+1}",
    instructions: "Step 1: Prepare ingredients.\nStep 2: Cook everything together.\nStep 3: Serve and enjoy!",
    cooking_time: rand(15..60),
    user: user
  )

  # Add 3-6 random ingredients to each recipe
  rand(3..6).times do
    RecipeIngredient.create!(
      recipe: recipe,
      ingredient: ingredients.values.sample,
      quantity: "#{rand(1..4)} #{[ 'cup', 'tbsp', 'tsp', 'g', 'kg', 'piece', 'slice' ].sample}#{rand(1..2) == 1 ? 's' : ''}"
    )
  end
end

puts "Seed completed successfully!"
