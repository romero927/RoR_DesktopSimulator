import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["header", "content"]
  static values = {
    title: String,
    windowType: String
  }

  connect() {
    console.log("Window controller connected", {
      type: this.windowTypeValue,
      title: this.titleValue
    })
    
    this.element.style.left = "50px"
    this.element.style.top = "50px"
    this.element.style.width = "400px"
    this.element.style.height = "300px"
    this.setupDragging()
    this.bringToFront()
    this.loadContent()
    
    // Add click to focus
    this.element.addEventListener("mousedown", () => this.bringToFront())
    
    // Setup window controls
    const closeBtn = this.element.querySelector(".window-close")
    const minBtn = this.element.querySelector(".window-minimize") 
    const maxBtn = this.element.querySelector(".window-maximize")
    
    closeBtn.addEventListener("click", () => this.close())
    minBtn.addEventListener("click", () => this.minimize())
    maxBtn.addEventListener("click", () => this.maximize())
  }


  minimize() {
    this.element.classList.toggle("minimized")
    if (this.element.classList.contains("minimized")) {
      this.element.style.height = "30px"
      this.element.querySelector(".window-content").style.display = "none"
    } else {
      this.element.style.height = ""
      this.element.querySelector(".window-content").style.display = ""
    }
  }

  maximize() {
    this.element.classList.toggle("maximized")
    if (this.element.classList.contains("maximized")) {
      const desktop = document.querySelector(".desktop")
      const bounds = desktop.getBoundingClientRect()
      this.element.style.top = "0"
      this.element.style.left = "0"
      this.element.style.width = bounds.width + "px"
      this.element.style.height = (bounds.height - 40) + "px" // Account for taskbar
      this.element.style.transform = "none"
    } else {
      this.element.style.top = "50px"
      this.element.style.left = "50px"
      this.element.style.width = ""
      this.element.style.height = ""
    }
  }

  setupDragging() {
    let isDragging = false
    let currentX
    let currentY
    let initialX
    let initialY
    let xOffset = 0
    let yOffset = 0

    this.headerTarget.addEventListener("mousedown", (e) => {
      initialX = e.clientX - xOffset
      initialY = e.clientY - yOffset
      isDragging = true
    })

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        e.preventDefault()
        currentX = e.clientX - initialX
        currentY = e.clientY - initialY

        xOffset = currentX
        yOffset = currentY

        this.setTranslate(currentX, currentY)
      }
    })

    document.addEventListener("mouseup", () => {
      isDragging = false
    })
  }

  setTranslate(xPos, yPos) {
    this.element.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`
  }

  bringToFront() {
    const windows = document.querySelectorAll('.window')
    let maxZ = 0
    windows.forEach(w => {
      const z = parseInt(w.style.zIndex || 0)
      maxZ = Math.max(maxZ, z)
    })
    this.element.style.zIndex = maxZ + 1
  }

  loadContent() {
    console.log("Loading content for window type:", this.windowTypeValue)
    const template = this.getContentTemplate()
    console.log("Generated template:", template)
    this.contentTarget.innerHTML = template
    this.initializeContent()
  }

  getContentTemplate() {
    switch (this.windowTypeValue) {
      case 'documents':
        return `
          <div class="file-explorer">
            <div class="file-list">
              <div class="file-item">
                <i class="fas fa-file-alt"></i>
                <span>Document1.txt</span>
              </div>
              <div class="file-item">
                <i class="fas fa-file-word"></i>
                <span>Report.docx</span>
              </div>
            </div>
          </div>
        `
      case 'pictures':
        return `
          <div class="gallery-grid">
            <div class="gallery-item">
              <i class="fas fa-image fa-3x"></i>
              <span>Photo1.jpg</span>
            </div>
            <div class="gallery-item">
              <i class="fas fa-image fa-3x"></i>
              <span>Photo2.jpg</span>
            </div>
          </div>
        `
      case 'calculator':
        return `
          <div class="calculator" data-controller="calculator">
            <input type="text" class="calc-display" readonly value="0">
            <div class="calc-buttons">
              <button>7</button>
              <button>8</button>
              <button>9</button>
              <button>÷</button>
              <button>4</button>
              <button>5</button>
              <button>6</button>
              <button>×</button>
              <button>1</button>
              <button>2</button>
              <button>3</button>
              <button>-</button>
              <button>0</button>
              <button>.</button>
              <button>=</button>
              <button>+</button>
            </div>
          </div>
        `
      case 'terminal':
        return `
          <div class="terminal-window" data-controller="terminal">
            <div class="terminal-output">Welcome to Terminal
Type 'help' for available commands</div>
            <div class="terminal-input">
              <span class="prompt">$</span>
              <input type="text" autofocus spellcheck="false">
            </div>
          </div>
        `
      case 'notes':
        return `
          <div class="notes-app">
            <textarea placeholder="Type your notes here..." class="notes-content"></textarea>
          </div>
        `
      case 'calendar':
        return `
          <div class="calendar-app" data-controller="calendar">
            <div class="calendar-header">
              <div class="calendar-nav">
                <button class="calendar-nav-btn" data-action="calendar#previousMonth">&lt;</button>
                <h3 data-calendar-target="monthDisplay"></h3>
                <button class="calendar-nav-btn" data-action="calendar#nextMonth">&gt;</button>
              </div>
            </div>
            <div class="calendar-grid" data-calendar-target="grid">
              <div class="calendar-day">Sun</div>
              <div class="calendar-day">Mon</div>
              <div class="calendar-day">Tue</div>
              <div class="calendar-day">Wed</div>
              <div class="calendar-day">Thu</div>
              <div class="calendar-day">Fri</div>
              <div class="calendar-day">Sat</div>
            </div>
          </div>
        `
      default:
        return '<div>App content not available</div>'
    }
  }

  initializeContent() {
    // No need to manually register controllers
    // Stimulus will automatically connect controllers based on data-controller attributes
  }

  close(event) {
    if (event) {
      event.preventDefault()
    }
    this.element.remove()
  }
}
