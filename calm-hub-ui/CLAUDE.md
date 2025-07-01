# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm start` - Start development server with brand assets copied and Vite dev server
- `npm run build` - Build for production (copies brand assets then builds with Vite)
- `npm run serve` - Preview production build locally
- `npm run prod` - Build and copy to ../calm-hub/src/main/resources/META-INF/resources

### Testing
- `npm test` - Run tests once with Vitest
- `npm run test-coverage` - Run tests with coverage report
- `npm run watch-test` - Run tests in watch mode

### Code Quality
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Utilities
- `npm run copy-public` - Copy brand assets from ../brand/ to public/

## Architecture Overview

This is a React + TypeScript application built with Vite that provides a web interface for the CALM (Common Architecture Language Model) ecosystem. The application has two main views:

### Hub View (`/`)
- Main landing page for browsing CALM resources (Architectures, Patterns, Flows, ADRs)
- Hierarchical navigation: Namespaces → Resource Types → Resource IDs → Versions/Revisions
- JSON viewer for CALM data with "Visualize" button to navigate to visualizer
- ADR (Architecture Decision Record) viewer with markdown rendering

### Visualizer View (`/visualizer`)
- Interactive graph visualization using ReactFlow
- Supports file upload for local CALM instances
- Toggle controls for node and connection descriptions
- Built-in pan, zoom, minimap, and layout controls
- Node position persistence using localStorage
- Uses data passed from Hub or uploaded files

## Key Technical Details

### Frontend Stack
- **React 19** with TypeScript
- **Vite** for build tooling and dev server
- **Tailwind CSS 4** + **DaisyUI** for styling
- **React Router** with HashRouter for routing
- **ReactFlow** for interactive graph visualization with built-in controls and layouts

### Testing
- **Vitest** for unit testing with jsdom environment
- **Testing Library** for React component testing
- Test files follow `*.test.tsx` pattern

### Key Dependencies
- `@finos/calm-shared` - Shared CALM types and models
- `reactflow` for interactive graph visualization with built-in layouts
- `react-markdown` for ADR rendering
- `axios` for HTTP requests

### Backend Integration
- Development proxy configured to `http://localhost:8080` for `/calm` endpoints
- Expects CALM backend API at port 8080

### File Structure
- `src/hub/` - Hub view components and services
- `src/visualizer/` - Visualizer view and graph components  
- `src/service/` - API services for CALM and ADR data
- `src/model/` - TypeScript type definitions
- `src/components/` - Shared components (navbar)

### Brand Assets
Brand assets are copied from `../brand/` to `public/` during build. The copy-public script runs before both dev and build commands.

### Code Style
- ESLint with TypeScript rules and React plugins
- Prettier for formatting
- Uses .js extensions in imports (legacy from Create React App migration)

### Graph Visualization
- **ReactFlow** handles all graph rendering and interactions
- Nodes support descriptions, interfaces, and controls from CALM schema
- Edges represent relationships between CALM nodes
- Parent-child relationships rendered using ReactFlow's parentId system
- Automatic layout with manual node positioning override
- Position data persisted per CALM instance using unique storage keys