import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu"]

  connect() {
    this.setupAppLaunchers()
    document.addEventListener("click", this.handleOutsideClick.bind(this))
  }

  disconnect() {
    document.removeEventListener("click", this.handleOutsideClick.bind(this))
  }

  toggle() {
    this.menuTarget.classList.toggle("active")
    this.isOpen = this.menuTarget.classList.contains("active")
  }

  search(event) {
    const query = event.target.value.toLowerCase()
    const items = this.menuTarget.querySelectorAll(".start-menu-item")
    
    items.forEach(item => {
      const text = item.textContent.toLowerCase()
      item.style.display = text.includes(query) ? "" : "none"
    })
  }

  setupAppLaunchers() {
    const items = this.menuTarget.querySelectorAll(".start-menu-item")
    items.forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault()
        const appType = item.getAttribute("data-app-type")
        if (appType) {
          this.launchApp(appType, item.querySelector("span").textContent)
          this.toggle()
        }
      })
    })
  }

  launchApp(type, title) {
    const windowsContainer = document.querySelector(".windows-container")
    const window = document.createElement("div")
    window.className = "window"
    window.setAttribute("data-controller", "window")
    window.setAttribute("data-window-window-type-value", type)
    window.setAttribute("data-window-title-value", title)
    
    window.innerHTML = `
      <div class="window-header" data-window-target="header">
        <div class="window-controls">
          <div class="window-control window-close"></div>
          <div class="window-control window-minimize"></div>
          <div class="window-control window-maximize"></div>
        </div>
        <div class="window-title">${title}</div>
      </div>
      <div class="window-content" data-window-target="content"></div>
    `
    
    windowsContainer.appendChild(window)
  }

  handleOutsideClick(event) {
    if (this.isOpen && !this.element.contains(event.target)) {
      this.isOpen = false
      this.menuTarget.classList.remove("active")
    }
  }
}
