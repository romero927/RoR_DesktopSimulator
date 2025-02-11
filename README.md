# RoR Desktop Simulator

A sophisticated web-based desktop environment simulator built with Ruby on Rails and Stimulus.js. This application recreates a modern desktop interface in the browser, featuring a comprehensive window management system, application framework, and UI components.

This project was developed through a combination of manual development and AI assistance using the Cline VS Code extension connected to Anthropic's Claude 3.5 Sonnet API. This collaborative approach enabled rapid development while maintaining code quality and architectural consistency.

Live Demo: https://kgromero-desktopsimulator.fly.dev/

## Quick Start Guide

Get up and running in minutes:

1. **One-Command Setup** (requires Ruby, Node.js, and PostgreSQL):
```bash
git clone https://github.com/yourusername/RoR_DesktopSimulator.git && \
cd RoR_DesktopSimulator && \
bundle install && \
yarn install && \
bin/rails db:create db:migrate && \
bin/dev
```

2. **Common Customizations**

Add a new application in 3 steps:
```javascript
// 1. Create app/javascript/controllers/myapp_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.element.innerHTML = `
      <div class="my-app-content">
        <h1>My App</h1>
        <button data-action="click->myapp#doSomething">Click Me</button>
      </div>
    `
  }
  
  doSomething() {
    console.log("Button clicked!")
  }
}

// 2. Add to app/views/desktop/index.html.erb in the start-menu-items div:
<a href="#" class="start-menu-item" data-app-type="myapp">
  <i class="fas fa-star"></i>
  <span>My App</span>
</a>

// 3. Add to app/assets/stylesheets/application.css:
.my-app-content {
  padding: 20px;
}
```

Change the theme colors:
```css
/* In app/assets/stylesheets/application.css */
.desktop {
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); /* New background */
}

.taskbar {
  background: rgba(44, 62, 80, 0.8); /* New taskbar color */
}
```

3. **Common Use Cases**

Create a document viewer:
```javascript
// app/javascript/controllers/document_viewer_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content"]
  
  connect() {
    this.element.innerHTML = `
      <div class="document-viewer">
        <div class="toolbar">
          <button data-action="click->document-viewer#zoomIn">Zoom In</button>
          <button data-action="click->document-viewer#zoomOut">Zoom Out</button>
        </div>
        <div data-document-viewer-target="content" class="viewer-content">
          <!-- Content here -->
        </div>
      </div>
    `
  }
  
  zoomIn() {
    const content = this.contentTarget
    const currentScale = parseFloat(content.style.transform.replace('scale(', '')) || 1
    content.style.transform = `scale(${currentScale + 0.1})`
  }
  
  zoomOut() {
    const content = this.contentTarget
    const currentScale = parseFloat(content.style.transform.replace('scale(', '')) || 1
    content.style.transform = `scale(${currentScale - 0.1})`
  }
}
```

4. **Troubleshooting**

Common issues and solutions:

- **Windows not draggable**: Check if `pointer-events: none` is properly set on `.windows-container` and `pointer-events: auto` on `.window`
- **Z-index issues**: Ensure proper layering:
  ```css
  .desktop-icons { z-index: 50; }
  .windows-container { z-index: 100; }
  .window { z-index: 200; }
  .taskbar { z-index: 1000; }
  ```
- **Start menu not showing**: Verify the click handler in `start_menu_controller.js` and check if the menu has `display: none` when inactive

## Features

- Draggable window system with minimize/maximize functionality
- Start menu with application launcher
- File system simulation with desktop icons
- Built-in applications:
  - Calculator with basic operations
  - Calendar with date selection
  - Terminal emulator
  - File explorer
  - Notes application
- System tray with clock widget
- Modern UI with blur effects and animations

## Requirements

- Ruby 3.3.0
- Node.js 18.19.1
- Yarn 1.22.22
- PostgreSQL

## Local Development

1. Clone the repository
2. Install dependencies:
```bash
bundle install
yarn install
```

3. Setup the database:
```bash
bin/rails db:create db:migrate
```

4. Start the development server:
```bash
bin/dev
```

5. Visit http://localhost:3000 in your browser

## Code Structure

The application follows a modular architecture designed for extensibility:

### Backend (Ruby on Rails)

```
app/
├── controllers/
│   ├── application_controller.rb    # Base controller
│   └── desktop_controller.rb        # Main desktop interface controller
├── views/
│   ├── layouts/
│   │   └── application.html.erb     # Main layout template
│   └── desktop/
│       └── index.html.erb           # Desktop interface template
└── assets/
    └── stylesheets/
        └── application.css          # Core styling
```

### Frontend (Stimulus.js Controllers)

```
app/javascript/
└── controllers/
    ├── application.js               # Base Stimulus configuration
    ├── draggable_controller.js      # Window dragging functionality
    ├── window_controller.js         # Window management
    ├── start_menu_controller.js     # Start menu behavior
    ├── calculator_controller.js     # Calculator application
    ├── calendar_controller.js       # Calendar widget
    ├── terminal_controller.js       # Terminal emulator
    └── clock_controller.js          # System clock widget
```

## Architecture Deep Dive

### Window Management System

The window system is built on three key components:

1. **Windows Container** (`windows-container` class)
- Acts as a layer manager for all application windows
- Uses `pointer-events: none` to allow desktop interaction
- Maintains z-index hierarchy for proper window stacking

2. **Window Controller** (`window_controller.js`)
- Handles window state (minimize, maximize, restore)
- Manages window positioning and z-index
- Implements window focus behavior

3. **Draggable Controller** (`draggable_controller.js`)
- Provides drag-and-drop functionality
- Handles window movement constraints
- Manages drag state and animations

### Application Framework

The application system is designed for easy extension:

1. **Base Structure**
```html
<div class="window" data-controller="window">
  <div class="window-header">
    <div class="window-title">App Name</div>
    <div class="window-controls">
      <!-- Window controls -->
    </div>
  </div>
  <div class="window-content">
    <!-- Application content -->
  </div>
</div>
```

2. **Application Registration**
- Applications are registered in the start menu configuration
- Each application has a unique identifier and icon
- Applications can be launched from desktop icons or start menu

### Styling System

The CSS is organized in a modular fashion:

1. **Core Styles**
- Base reset and typography
- Desktop environment styles
- Window system styles

2. **Component Styles**
- Individual application styles
- Widget-specific styles
- Utility classes

3. **Theme System**
- Color variables for easy customization
- Consistent spacing and sizing
- Animation definitions

## Extending the System

### Adding New Applications

1. Create a new Stimulus controller:
```javascript
// app/javascript/controllers/my_app_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    // Initialize application
  }
  
  // Add application-specific methods
}
```

2. Create the application template:
```html
<div class="window" data-controller="window my-app">
  <!-- Window structure -->
  <div class="window-content">
    <!-- Application content -->
  </div>
</div>
```

3. Register in the start menu:
```html
<a href="#" class="start-menu-item" data-app-type="my-app">
  <i class="fas fa-custom-icon"></i>
  <span>My App</span>
</a>
```

### Customizing the Interface

1. **Theme Customization**
- Modify color variables in CSS
- Adjust spacing and sizing constants
- Customize window appearances

2. **Layout Modifications**
- Edit desktop grid system
- Modify taskbar positioning
- Adjust window default sizes

3. **Feature Extensions**
- Add new system tray widgets
- Implement additional window controls
- Create custom desktop widgets

## Real-World Applications

This simulator can be adapted for various use cases:

1. **Educational Platforms**
- Create interactive learning environments
- Build coding simulators
- Develop educational games

2. **Web Applications**
- Use as a base for web-based IDEs
- Create document management systems
- Build project management tools

3. **Development Tools**
- Implement testing environments
- Create sandboxed development spaces
- Build demonstration platforms

## Performance Considerations

1. **Window Management**
- Implement window pooling for better memory usage
- Use CSS transforms for smooth animations
- Optimize z-index management

2. **Application Loading**
- Lazy load application controllers
- Implement application state management
- Cache application resources

3. **Event Handling**
- Debounce window movement events
- Optimize drag performance
- Manage memory usage

## Security Considerations

1. **Terminal Emulator**
- Implement proper command sanitization
- Set up execution boundaries
- Manage user permissions

2. **File System**
- Implement proper access controls
- Sanitize file operations
- Manage storage limits

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Docker

Build and run the application using Docker:

```bash
# Build the image
docker build -t ro_r_desktop_simulator .

# Run the container
docker run -d -p 80:80 -e RAILS_MASTER_KEY=<your-master-key> --name ro_r_desktop_simulator ro_r_desktop_simulator
```

## Deployment

Deploy to fly.io:

1. Install flyctl:
```bash
# On macOS
brew install flyctl

# On Linux
curl -L https://fly.io/install.sh | sh
```

2. Setup and deploy:
```bash
fly auth login
fly launch
fly secrets set RAILS_MASTER_KEY=$(cat config/master.key)
fly deploy
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
