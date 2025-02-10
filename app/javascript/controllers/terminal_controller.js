import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["output", "input"]

  connect() {
    this.commandHistory = []
    this.historyIndex = -1
    this.setupInput()
  }

  setupInput() {
    this.inputTarget.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        this.handleCommand(this.inputTarget.value)
        this.inputTarget.value = ''
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        this.navigateHistory('up')
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        this.navigateHistory('down')
      }
    })
  }

  handleCommand(command) {
    if (!command.trim()) return

    this.commandHistory.push(command)
    this.historyIndex = this.commandHistory.length

    this.outputTarget.innerHTML += `<div class="command-line"><span class="prompt">$</span> ${this.escapeHtml(command)}</div>`

    let response = this.processCommand(command)
    this.outputTarget.innerHTML += `<div class="response">${response}</div>`

    // Scroll to bottom
    this.outputTarget.scrollTop = this.outputTarget.scrollHeight
  }

  processCommand(command) {
    const cmd = command.toLowerCase().trim()
    
    if (cmd === 'help') {
      return `Available commands:
- help: Show this help message
- clear: Clear the terminal
- echo [text]: Display text
- date: Show current date and time
- ls: List files
- whoami: Show current user`
    }
    
    if (cmd === 'clear') {
      this.outputTarget.innerHTML = ''
      return ''
    }
    
    if (cmd.startsWith('echo ')) {
      return cmd.substring(5)
    }
    
    if (cmd === 'date') {
      return new Date().toString()
    }
    
    if (cmd === 'ls') {
      return `Documents/
Downloads/
Pictures/
Desktop/
example.txt
readme.md`
    }
    
    if (cmd === 'whoami') {
      return 'user@desktop-simulator'
    }

    return `Command not found: ${this.escapeHtml(cmd)}\nType 'help' for available commands.`
  }

  navigateHistory(direction) {
    if (this.commandHistory.length === 0) return

    if (direction === 'up' && this.historyIndex > 0) {
      this.historyIndex--
      this.inputTarget.value = this.commandHistory[this.historyIndex]
    } else if (direction === 'down') {
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++
        this.inputTarget.value = this.commandHistory[this.historyIndex]
      } else {
        this.historyIndex = this.commandHistory.length
        this.inputTarget.value = ''
      }
    }
  }

  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }
}
