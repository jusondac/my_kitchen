class ApplicationController < ActionController::Base
  include Pagy::Backend
  include SvgIconsHelper
  include Authentication
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  before_action :sidebar_menu

  def sidebar_menu
    @sidebar_menus = [
      { name: "Dashboard", path: "/", icon: dashboard },
      { name: "Recipes", path: "/recipes", icon: recipes },
      { name: "Ingredients", path: "/ingredients", icon: ingredients }
    ]
  end
end
