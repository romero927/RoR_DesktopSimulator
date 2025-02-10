import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["icon"]

  connect() {
    this.dragStartHandler = this.startDragging.bind(this)
    this.dragHandler = this.drag.bind(this)
    this.dragEndHandler = this.stopDragging.bind(this)
    
    this.element.addEventListener('mousedown', this.dragStartHandler)
    document.addEventListener('mousemove', this.dragHandler)
    document.addEventListener('mouseup', this.dragEndHandler)
    
    this.isDragging = false
    this.dragStartTime = 0
    this.currentX = 0
    this.currentY = 0
    this.initialX = 0
    this.initialY = 0
    this.xOffset = 0
    this.yOffset = 0
  }

  disconnect() {
    this.element.removeEventListener('mousedown', this.dragStartHandler)
    document.removeEventListener('mousemove', this.dragHandler)
    document.removeEventListener('mouseup', this.dragEndHandler)
  }

  startDragging(e) {
    this.dragStartTime = Date.now()
    this.initialX = e.clientX - this.xOffset
    this.initialY = e.clientY - this.yOffset
    
    if (e.target.closest('.desktop-icon')) {
      this.isDragging = true
      this.element.classList.add('dragging')
    }
  }

  drag(e) {
    if (this.isDragging) {
      e.preventDefault()
      
      this.currentX = e.clientX - this.initialX
      this.currentY = e.clientY - this.initialY

      // Keep icon within desktop bounds
      const desktop = document.querySelector('.desktop')
      const bounds = desktop.getBoundingClientRect()
      const iconBounds = this.element.getBoundingClientRect()

      this.currentX = Math.max(0, Math.min(this.currentX, bounds.width - iconBounds.width))
      this.currentY = Math.max(0, Math.min(this.currentY, bounds.height - iconBounds.height - 40)) // Account for taskbar

      this.xOffset = this.currentX
      this.yOffset = this.currentY

      this.setTranslate(this.currentX, this.currentY)
    }
  }

  stopDragging() {
    const dragDuration = Date.now() - this.dragStartTime
    
    if (dragDuration < 200) {
      // This was a click rather than a drag
      this.element.classList.add('clicked')
      setTimeout(() => this.element.classList.remove('clicked'), 200)
      
      // Handle single click to select
      this.handleClick()
    }

    this.initialX = this.currentX
    this.initialY = this.currentY
    this.isDragging = false
    this.element.classList.remove('dragging')
  }

  handleClick() {
    // Remove selection from other icons
    document.querySelectorAll('.desktop-icon').forEach(icon => {
      icon.classList.remove('selected')
    })
    
    // Add selection to clicked icon
    this.element.classList.add('selected')
    
    // Launch app on single click
    const appType = this.element.getAttribute("data-app-type")
    const title = this.element.querySelector("span").textContent
    
    // Get the start menu controller
    const startMenu = document.querySelector("[data-controller='start-menu']")
    if (startMenu) {
      const controller = this.application.getControllerForElementAndIdentifier(startMenu, "start-menu")
      if (controller) {
        controller.launchApp(appType, title)
      }
    }
  }

  setTranslate(xPos, yPos) {
    requestAnimationFrame(() => {
      this.element.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`
    })
  }

}
