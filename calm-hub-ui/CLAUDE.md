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
- `npm test -- --run` - Run tests without watch mode (useful for CI/validation)

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

## CALM Data Flow and Relationship Handling

### CALM Schema Integration
- Uses `@finos/calm-shared` package for type definitions via relative path `../shared/src/types/`
- Core types: `CalmArchitectureSchema`, `CalmNodeSchema`, `CalmRelationshipSchema`
- Relationship types: `interacts`, `connects`, `composed-of`, `deployed-in`, `options`

### Data Processing Pipeline
1. **Hub → Visualizer**: Data passed via React Router state from Hub JSON viewer
2. **File Upload**: Local CALM files processed in Visualizer component
3. **Drawer Component**: Main data transformation logic in `src/visualizer/components/drawer/Drawer.tsx`
   - `getNodes()`: Transforms CALM nodes to ReactFlow nodes with parent-child relationships
   - `getEdges()`: Transforms CALM relationships to ReactFlow edges (all relationship types)
4. **Edge Conversion**: `src/visualizer/components/reactflow-renderer/utils/edgeConversion.ts`
   - Different visual styles per relationship type (colors, dash patterns, markers)
   - Smart anchor point calculation based on node positions

### Relationship Visualization
- **interacts**: Actor → multiple target nodes (creates edge per target)
- **connects**: Source node → destination node with interface details
- **composed-of**: Container → composed nodes (parent-child + visible edges)
- **deployed-in**: Container → deployed nodes (parent-child + visible edges)
- **options**: Decision point relationships (basic edge implementation)

## Important Development Notes

### Monorepo Structure
- This UI app depends on `../shared/` for CALM types and `../brand/` for assets
- Backend API expected at `localhost:8080` with `/calm` endpoints
- Build process copies assets and can deploy to `../calm-hub/` Java project

### Testing Patterns
- Vitest with jsdom environment for React component testing
- `*.test.tsx` pattern for test files
- Mock services with axios-mock-adapter for API testing
- Testing Library for React component interactions

### Import Conventions
- Uses `.js` extensions in imports (legacy from Create React App migration)
- Relative imports from shared monorepo packages via `../../../shared/src/`
- ReactFlow components and utilities imported from `reactflow` package