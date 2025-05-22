import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["ingredients"]

  connect() {
    const addButton = document.getElementById("add-ingredient")
    if (addButton) {
      addButton.addEventListener("click", this.addIngredient.bind(this))
    }
  }

  addIngredient(event) {
    event.preventDefault()

    const timestamp = new Date().getTime()
    const ingredientHtml = `
      <div class="p-3 border border-gray-600 rounded">
        <div class="mb-2">
          <select name="recipe[recipe_ingredients_attributes][${timestamp}][ingredient_id]" 
                  class="block shadow-sm rounded-md border bg-gray-700 px-3 py-2 w-full border-gray-600 focus:outline-blue-600">
            <option value="">Select an ingredient</option>
            ${this.getIngredientOptions()}
          </select>
        </div>
        <div>
          <input type="text" 
                 name="recipe[recipe_ingredients_attributes][${timestamp}][quantity]" 
                 placeholder="Quantity (e.g., 2 cups)" 
                 class="block shadow-sm rounded-md border bg-gray-700 px-3 py-2 w-full border-gray-600 focus:outline-blue-600">
        </div>
      </div>
    `

    this.ingredientsTarget.insertAdjacentHTML("beforeend", ingredientHtml)
  }

  getIngredientOptions() {
    // This will be populated from the server with available ingredients
    const ingredientSelect = document.querySelector('select[name*="[ingredient_id]"]')
    if (ingredientSelect) {
      return Array.from(ingredientSelect.options)
        .map(option => {
          if (option.value === "") return ""
          return `<option value="${option.value}">${option.text}</option>`
        })
        .join('')
    }
    return ""
  }
}
