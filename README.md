# Full Stack Open - Bloglist CI/CD

This repository contains the full-stack Bloglist application with a complete CI/CD pipeline built for **Full Stack Open Part 11 (Exercises 11.21 & 11.22)**.

- **Main Part 11 Repository (Exercises 11.1 - 11.19)**: [https://github.com/GilbertIrumva/fullstackopen-part11](https://github.com/GilbertIrumva/fullstackopen-part11)

## Architecture

- **Backend (Root)**: Node.js & Express REST API with MongoDB/Mongoose.
  - Serves API routes under `/api/*`
  - Exposes health check endpoints at `/health` and `/version`
  - Serves the compiled production React frontend from `frontend/dist`
  - Handles client-side routing fallback
- **Frontend (`/frontend`)**: React + Vite single page application with Zustand state management and React Router.

## CI/CD Pipeline

The GitHub Actions pipeline is configured with:
1. **Continuous Integration**:
   - Automated linting for backend and frontend (`npm run lint`)
   - Production build of the frontend (`npm run build`)
   - Automated unit and component tests (`npm test`)
   - Failure notification sent to Discord
2. **Continuous Deployment**:
   - Triggers automatic deployment to Render via webhook on pushes to `main`
   - Skips deployment and release tagging when commit message contains `#skip`
3. **Automated Semantic Versioning**:
   - Uses `anothrNick/github-tag-action` to bump version tags on successful merges to `main`
4. **Discord Notifications**:
   - Sends Discord notifications on build failure and successful deployment
5. **Periodic Health Check**:
   - Scheduled GitHub Action workflow (`healthcheck.yml`) monitoring the live service URL

## Deployed Application

- **Live URL**: [https://bloglist-ci-cd-1e4j.onrender.com/](https://bloglist-ci-cd-1e4j.onrender.com/)
- **Health Check**: [https://bloglist-ci-cd-1e4j.onrender.com/health](https://bloglist-ci-cd-1e4j.onrender.com/health)

## Branch Protection (Exercise 11.22)
- The `main` branch is protected requiring pull request reviews before merging (including administrators).

## Scripts

### Setup
```bash
npm install
npm install --prefix frontend
```

### Development
```bash
npm run dev:server    # Run Express backend with auto-reload
npm run dev:ui        # Run Vite frontend dev server
```

### Quality & Testing
```bash
npm run lint          # Run ESLint on both server and frontend
npm test              # Run backend unit tests and frontend Vitest suite
npm run build         # Build production frontend bundle into frontend/dist
```

### Production
```bash
npm start             # Start the production Node server
```

