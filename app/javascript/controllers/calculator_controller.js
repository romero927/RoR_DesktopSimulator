import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["display"]
  
  connect() {
    this.currentValue = "0"
    this.previousValue = null
    this.operation = null
    this.shouldResetDisplay = false
    this.setupEventListeners()
  }

  setupEventListeners() {
    this.element.querySelectorAll(".calc-buttons button").forEach(button => {
      button.addEventListener("click", (e) => {
        const value = e.target.textContent
        if ("0123456789.".includes(value)) {
          this.handleNumber(value)
        } else if ("+-×÷".includes(value)) {
          this.handleOperator(value)
        } else if (value === "=") {
          this.calculate()
        }
        this.updateDisplay()
      })
    })
  }

  handleNumber(num) {
    if (this.shouldResetDisplay) {
      this.currentValue = num
      this.shouldResetDisplay = false
    } else {
      if (num === "." && this.currentValue.includes(".")) return
      this.currentValue = this.currentValue === "0" ? num : this.currentValue + num
    }
  }

  handleOperator(op) {
    if (this.previousValue !== null) {
      this.calculate()
    }
    this.previousValue = parseFloat(this.currentValue)
    this.operation = op
    this.shouldResetDisplay = true
  }

  calculate() {
    if (this.previousValue === null || this.operation === null) return

    const current = parseFloat(this.currentValue)
    let result

    switch (this.operation) {
      case "+":
        result = this.previousValue + current
        break
      case "-":
        result = this.previousValue - current
        break
      case "×":
        result = this.previousValue * current
        break
      case "÷":
        if (current === 0) {
          result = "Error"
        } else {
          result = this.previousValue / current
        }
        break
    }

    this.currentValue = result.toString()
    this.previousValue = null
    this.operation = null
    this.shouldResetDisplay = true
  }

  updateDisplay() {
    const display = this.element.querySelector(".calc-display")
    if (display) {
      display.value = this.currentValue
    }
  }
}
