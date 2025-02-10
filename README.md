# RoR Desktop Simulator

A web-based desktop environment simulator built with Ruby on Rails and Stimulus.js. This application recreates a classic desktop interface in the browser, complete with:

- Interactive windows with drag-and-drop functionality
- Working clock widget
- Calculator application
- Calendar widget
- Terminal emulator
- Start menu

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

## Docker

You can run the application using Docker:

```bash
# Build the image
docker build -t ro_r_desktop_simulator .

# Run the container
docker run -d -p 80:80 -e RAILS_MASTER_KEY=<your-master-key> --name ro_r_desktop_simulator ro_r_desktop_simulator
```

## Deployment to fly.io

1. Install the flyctl CLI:
```bash
# On macOS
brew install flyctl

# On Linux
curl -L https://fly.io/install.sh | sh
```

2. Login to fly.io:
```bash
fly auth login
```

3. Create a new app:
```bash
fly launch
```

4. Set the Rails master key:
```bash
fly secrets set RAILS_MASTER_KEY=$(cat config/master.key)
```

5. Deploy the application:
```bash
fly deploy
```

## Architecture

The application is built using:
- Ruby on Rails for the backend
- Stimulus.js for frontend interactivity
- Turbo for seamless page updates
- CSS for styling the desktop interface

Each desktop component (calculator, calendar, etc.) is implemented as a separate Stimulus controller, making the codebase modular and maintainable.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
