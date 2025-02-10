import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["grid", "monthDisplay"]
  
  connect() {
    this.currentDate = new Date()
    this.selectedDate = null
    this.renderCalendar()
  }

  renderCalendar() {
    // Clear existing calendar days except weekday headers
    const days = this.gridTarget.querySelectorAll('.calendar-date')
    days.forEach(day => day.remove())

    const year = this.currentDate.getFullYear()
    const month = this.currentDate.getMonth()

    // Get first day of month and total days
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const totalDays = lastDay.getDate()
    const firstDayIndex = firstDay.getDay()

    // Add empty cells for days before first of month
    for (let i = 0; i < firstDayIndex; i++) {
      this.addDayToGrid('')
    }

    // Add days of month
    for (let day = 1; day <= totalDays; day++) {
      this.addDayToGrid(day)
    }

    // Update month display
    this.monthDisplayTarget.textContent = `${this.currentDate.toLocaleString('default', { month: 'long' })} ${year}`
  }

  addDayToGrid(content) {
    const dayElement = document.createElement('div')
    dayElement.className = 'calendar-date'
    if (content) {
      dayElement.textContent = content
      dayElement.setAttribute('data-action', 'click->calendar#selectDate')
      dayElement.setAttribute('data-date', `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-${content}`)
      
      // Highlight current day
      const today = new Date()
      if (content === today.getDate() && 
          this.currentDate.getMonth() === today.getMonth() && 
          this.currentDate.getFullYear() === today.getFullYear()) {
        dayElement.classList.add('current-day')
      }

      // Highlight selected day
      if (this.selectedDate && 
          content === this.selectedDate.getDate() && 
          this.currentDate.getMonth() === this.selectedDate.getMonth() && 
          this.currentDate.getFullYear() === this.selectedDate.getFullYear()) {
        dayElement.classList.add('selected')
      }
    }
    this.gridTarget.appendChild(dayElement)
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1)
    this.renderCalendar()
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1)
    this.renderCalendar()
  }

  selectDate(event) {
    const dateStr = event.currentTarget.getAttribute('data-date')
    if (!dateStr) return

    const [year, month, day] = dateStr.split('-').map(num => parseInt(num))
    this.selectedDate = new Date(year, month - 1, day)

    // Remove selected class from all dates
    this.element.querySelectorAll('.calendar-date').forEach(date => {
      date.classList.remove('selected')
    })

    // Add selected class to clicked date
    event.currentTarget.classList.add('selected')
  }
}
