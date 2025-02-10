import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.updateClock()
    this.interval = setInterval(this.updateClock.bind(this), 1000)
  }

  disconnect() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  updateClock() {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, '0')
    
    this.element.textContent = `${displayHours}:${displayMinutes} ${ampm}`
  }
}
