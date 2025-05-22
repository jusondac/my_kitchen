import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["ingredients", "instructions"]

  connect() {
    // Set up ingredient functionality
    const addIngredientButton = document.getElementById("add-ingredient")
    if (addIngredientButton) {
      addIngredientButton.addEventListener("click", this.addIngredient.bind(this))
    }

    // Set up instruction functionality
    const addInstructionButton = document.getElementById("add-instruction")
    if (addInstructionButton) {
      addInstructionButton.addEventListener("click", this.addInstruction.bind(this))
    }

    // Add event listeners for all buttons
    this.setupRemoveButtons()
    this.setupDestroyToggleButtons()
    this.setupInstructionButtons()

    // Ensure positions are correctly numbered on load
    this.updateInstructionPositions()

    // Add classes for custom scrollbar
    if (this.hasIngredientsTarget) {
      this.ingredientsTarget.classList.add('custom-scrollbar')
    }

    if (this.hasInstructionsTarget) {
      this.instructionsTarget.classList.add('custom-scrollbar')
    }
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

    // Handle instruction destroy toggles
    document.querySelectorAll('.toggle-instruction-destroy').forEach(button => {
      button.addEventListener('click', (event) => {
        const checkboxEl = event.target.closest('div').querySelector('.destroy-instruction-checkbox')
        if (checkboxEl) {
          checkboxEl.checked = !checkboxEl.checked

          // Visual indication that the instruction will be removed
          const instructionItem = event.target.closest('.instruction-container')
          if (checkboxEl.checked) {
            instructionItem.classList.add('opacity-50')
            button.classList.add('bg-red-700/60')
            button.textContent = "Marked for removal"
          } else {
            instructionItem.classList.remove('opacity-50')
            button.classList.remove('bg-red-700/60')
            button.innerHTML = `
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              Remove
            `
          }

          // Update positions after marking for destruction
          this.updateInstructionPositions()
        }
      })
    })
  }

  setupInstructionButtons() {
    // Remove instructions
    document.querySelectorAll('.remove-instruction').forEach(button => {
      button.addEventListener('click', (event) => {
        const instructionItem = event.target.closest('.instruction-container')
        if (instructionItem) {
          instructionItem.remove()

          // Update the position numbers of remaining instructions
          this.updateInstructionPositions()

          // Show "no instructions" message if this was the last one
          if (this.instructionsTarget.querySelectorAll('.instruction-container:not(.opacity-50)').length === 0) {
            const noInstructionsHtml = `
              <p class="text-gray-400 text-center py-6 border border-dashed border-gray-700 rounded-lg mt-4 no-instructions-message">
                No steps added yet. Click "Add Step" to start.
              </p>
            `
            const existingMessage = document.querySelector('.no-instructions-message')
            if (!existingMessage) {
              this.instructionsTarget.insertAdjacentHTML('afterend', noInstructionsHtml)
            }
          }
        }
      })
    })

    // Move instruction up
    document.querySelectorAll('.move-instruction-up').forEach(button => {
      button.addEventListener('click', (event) => {
        const currentInstruction = event.target.closest('.instruction-container')
        const previousInstruction = currentInstruction.previousElementSibling

        if (previousInstruction && previousInstruction.classList.contains('instruction-container')) {
          this.instructionsTarget.insertBefore(currentInstruction, previousInstruction)
          this.updateInstructionPositions()
        }
      })
    })

    // Move instruction down
    document.querySelectorAll('.move-instruction-down').forEach(button => {
      button.addEventListener('click', (event) => {
        const currentInstruction = event.target.closest('.instruction-container')
        const nextInstruction = currentInstruction.nextElementSibling

        if (nextInstruction && nextInstruction.classList.contains('instruction-container')) {
          this.instructionsTarget.insertBefore(nextInstruction, currentInstruction)
          this.updateInstructionPositions()
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

  addInstruction(event) {
    event.preventDefault()

    // Calculate the next position number
    const nextPosition = this.getNextInstructionPosition()

    const timestamp = new Date().getTime()
    const instructionHtml = `
      <div class="bg-gray-900/60 rounded-lg p-4 border border-gray-700 transition-colors hover:border-gray-600 instruction-container">
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <div class="bg-blue-900/60 text-blue-200 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 step-number">
              ${nextPosition}
            </div>
            <div class="w-full">
              <input type="hidden" name="recipe[instructions_attributes][${timestamp}][position]" value="${nextPosition}" class="position-field">
              <textarea name="recipe[instructions_attributes][${timestamp}][step]" rows="2" placeholder="Describe this step..." class="block w-full rounded-md shadow-sm bg-gray-800 border border-gray-700 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" class="move-instruction-up inline-flex items-center px-2 py-1 bg-gray-700/80 text-gray-300 text-xs rounded hover:bg-gray-600 transition-colors">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              Move Up
            </button>
            <button type="button" class="move-instruction-down inline-flex items-center px-2 py-1 bg-gray-700/80 text-gray-300 text-xs rounded hover:bg-gray-600 transition-colors">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Move Down
            </button>
            <button type="button" class="remove-instruction inline-flex items-center px-2 py-1 bg-red-900/40 text-red-300 text-xs rounded hover:bg-red-800/60 transition-colors">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              Remove
            </button>
          </div>
        </div>
      </div>
    `

    // Remove "no instructions" message if it exists
    const noInstructionsMessage = document.querySelector('.no-instructions-message')
    if (noInstructionsMessage) {
      noInstructionsMessage.remove()
    }

    // Add the new instruction to the container
    this.instructionsTarget.insertAdjacentHTML("beforeend", instructionHtml)

    // Set up event listeners for the new instruction's buttons
    const newInstructionItem = this.instructionsTarget.lastElementChild

    // Setup remove button
    const removeButton = newInstructionItem.querySelector('.remove-instruction')
    if (removeButton) {
      removeButton.addEventListener('click', () => {
        newInstructionItem.remove()
        this.updateInstructionPositions()

        // Show "no instructions" message if this was the last one
        if (this.instructionsTarget.querySelectorAll('.instruction-container:not(.opacity-50)').length === 0) {
          const noInstructionsHtml = `
            <p class="text-gray-400 text-center py-6 border border-dashed border-gray-700 rounded-lg mt-4 no-instructions-message">
              No steps added yet. Click "Add Step" to start.
            </p>
          `
          this.instructionsTarget.insertAdjacentHTML('afterend', noInstructionsHtml)
        }
      })
    }

    // Setup move up button
    const moveUpButton = newInstructionItem.querySelector('.move-instruction-up')
    if (moveUpButton) {
      moveUpButton.addEventListener('click', () => {
        const previousInstruction = newInstructionItem.previousElementSibling
        if (previousInstruction && previousInstruction.classList.contains('instruction-container')) {
          this.instructionsTarget.insertBefore(newInstructionItem, previousInstruction)
          this.updateInstructionPositions()
        }
      })
    }

    // Setup move down button
    const moveDownButton = newInstructionItem.querySelector('.move-instruction-down')
    if (moveDownButton) {
      moveDownButton.addEventListener('click', () => {
        const nextInstruction = newInstructionItem.nextElementSibling
        if (nextInstruction && nextInstruction.classList.contains('instruction-container')) {
          this.instructionsTarget.insertBefore(nextInstruction, newInstructionItem)
          this.updateInstructionPositions()
        }
      })
    }
  }

  getNextInstructionPosition() {
    // Find all visible instructions (not marked for destruction)
    const visibleInstructions = Array.from(
      this.instructionsTarget.querySelectorAll('.instruction-container:not(.opacity-50)')
    )
    return visibleInstructions.length + 1
  }

  updateInstructionPositions() {
    // Get all instruction containers that aren't marked for destruction
    const instructionContainers = Array.from(
      this.instructionsTarget.querySelectorAll('.instruction-container:not(.opacity-50)')
    )

    // Update position numbers
    instructionContainers.forEach((container, index) => {
      const stepNumber = index + 1
      // Update the visible step number
      const stepNumberElement = container.querySelector('.step-number')
      if (stepNumberElement) {
        stepNumberElement.textContent = stepNumber
      }

      // Update the hidden position field
      const positionField = container.querySelector('.position-field')
      if (positionField) {
        positionField.value = stepNumber
      }
    })
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
