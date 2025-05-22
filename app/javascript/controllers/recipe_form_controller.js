import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["ingredients"]

  connect() {
    const addButton = document.getElementById("add-ingredient")
    if (addButton) {
      addButton.addEventListener("click", this.addIngredient.bind(this))
    }
    
    // Add event listeners for remove buttons on existing ingredients
    this.setupRemoveButtons()
    this.setupDestroyToggleButtons()
    
    // Add class for custom scrollbar
    this.ingredientsTarget.classList.add('custom-scrollbar')
  }
  
  setupRemoveButtons() {
    document.querySelectorAll('.remove-ingredient').forEach(button => {
      button.addEventListener('click', (event) => {
        const ingredientItem = event.target.closest('.bg-gray-900\\/60')
        if (ingredientItem) {
          ingredientItem.remove()
          
          // Show "no ingredients" message if this was the last one
          if (this.ingredientsTarget.children.length === 0) {
            const noIngredientsHtml = `
              <p class="text-gray-400 text-center py-6 border border-dashed border-gray-700 rounded-lg mt-4">
                No ingredients added yet. Click "Add Ingredient" to start.
              </p>
            `
            this.ingredientsTarget.insertAdjacentHTML('afterend', noIngredientsHtml)
          }
        }
      })
    })
  }
  
  setupDestroyToggleButtons() {
    document.querySelectorAll('.toggle-destroy').forEach(button => {
      button.addEventListener('click', (event) => {
        const checkboxEl = event.target.closest('div').querySelector('.destroy-checkbox')
        if (checkboxEl) {
          checkboxEl.checked = !checkboxEl.checked
          
          // Visual indication that the ingredient will be removed
          const ingredientItem = event.target.closest('.bg-gray-900\\/60')
          if (checkboxEl.checked) {
            ingredientItem.classList.add('opacity-50')
            button.classList.add('bg-red-700/60')
            button.textContent = "Marked for removal"
          } else {
            ingredientItem.classList.remove('opacity-50')
            button.classList.remove('bg-red-700/60')
            button.innerHTML = `
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              Remove
            `
          }
        }
      })
    })
  }

  addIngredient(event) {
    event.preventDefault()

    const timestamp = new Date().getTime()
    const ingredientHtml = `
      <div class="bg-gray-900/60 rounded-lg p-4 border border-gray-700 transition-colors hover:border-gray-600">
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-400 mb-1">Ingredient</label>
            <select name="recipe[recipe_ingredients_attributes][${timestamp}][ingredient_id]" 
                    class="block w-full rounded-md shadow-sm bg-gray-800 border border-gray-700 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select an ingredient</option>
              ${this.getIngredientOptions()}
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-400 mb-1">Quantity</label>
            <input type="text" 
                   name="recipe[recipe_ingredients_attributes][${timestamp}][quantity]" 
                   placeholder="e.g., 2 cups, 500g, 3 tbsp" 
                   class="block w-full rounded-md shadow-sm bg-gray-800 border border-gray-700 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div class="flex justify-end">
            <button type="button" class="remove-ingredient inline-flex items-center px-2 py-1 bg-red-900/40 text-red-300 text-sm rounded hover:bg-red-800/60 transition-colors">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              Remove
            </button>
          </div>
        </div>
      </div>
    `

    // Check if there's a "no ingredients" message and remove it
    const noIngredientsMessage = document.querySelector('p.text-gray-400.text-center');
    if (noIngredientsMessage && noIngredientsMessage.textContent.includes('No ingredients added yet')) {
      noIngredientsMessage.remove();
    }

    this.ingredientsTarget.insertAdjacentHTML("beforeend", ingredientHtml)
    
    // Setup the remove button for this new ingredient
    const newButton = this.ingredientsTarget.lastElementChild.querySelector('.remove-ingredient')
    if (newButton) {
      newButton.addEventListener('click', (event) => {
        const ingredientItem = event.target.closest('.bg-gray-900\\/60')
        if (ingredientItem) {
          ingredientItem.remove()
          
          // Show "no ingredients" message if this was the last one
          if (this.ingredientsTarget.children.length === 0) {
            const noIngredientsHtml = `
              <p class="text-gray-400 text-center py-6 border border-dashed border-gray-700 rounded-lg mt-4">
                No ingredients added yet. Click "Add Ingredient" to start.
              </p>
            `
            this.ingredientsTarget.insertAdjacentHTML('afterend', noIngredientsHtml)
          }
        }
      })
    }
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
