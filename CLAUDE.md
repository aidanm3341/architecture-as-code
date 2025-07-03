# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Architecture as Code (AasC) is a FINOS project providing a framework for defining software architecture through the Common Architecture Language Model (CALM) specification. This is a monorepo containing:

- **CALM specification** (`/calm`) - JSON schemas and samples
- **CLI tools** (`/cli`, `/shared`) - TypeScript-based validation and generation tools  
- **CALM Hub backend** (`/calm-hub`) - Java/Quarkus REST API
- **CALM Hub UI** (`/calm-hub-ui`) - React frontend with architecture visualization
- **Documentation** (`/docs`) - Docusaurus-based documentation site

## Development Commands

### Root Level (npm workspaces)
```bash
# Build all projects
npm run build

# Test all projects  
npm run test

# Lint all projects
npm run lint

# Watch mode for CLI and shared libraries
npm run watch

# Start CALM Hub UI
npm run calm-hub-ui:run
```

### CLI and Shared Libraries
```bash
# Build CLI (includes shared dependency)
npm run build:cli

# Test CLI (includes building shared first)
npm run test:cli

# Watch shared library changes
npm run watch:shared

# Link CLI globally for testing
npm run link:cli
```

### CALM Hub (Java/Quarkus)
```bash
cd calm-hub

# Development mode with hot reload
mvn quarkus:dev

# Build and test
mvn clean install
mvn test
```

### CALM Hub UI (React)
```bash
cd calm-hub-ui

# Development server
npm run start

# Build for production
npm run build

# Run tests
npm run test
```

### Documentation
```bash
cd docs

# Development server
npm run start

# Build static site
npm run build
```

## Architecture

### Schema-Driven Development
The CALM specification lives in `/calm/release/1.0-rc1/` with JSON schemas defining the architecture language. All tooling validates against these schemas using Spectral rules.

### Multi-Language Monorepo Structure
- **TypeScript projects** use npm workspaces with shared dependencies
- **Java backend** uses Maven with Quarkus framework  
- **React frontend** uses Vite for building and development
- **Documentation** uses Docusaurus with automated generation from schemas

### Key Architectural Patterns
- **Repository pattern** with multiple data store implementations (MongoDB, Nitrite)
- **Template-based generation** using Handlebars for documentation output
- **Plugin architecture** for extensible validation rules and output formats
- **Event-driven validation** using JSON schema + Spectral custom rules

### Data Flow
1. CALM documents are validated against JSON schemas
2. Spectral rules provide additional semantic validation  
3. CLI processes documents into various output formats (documentation, diagrams)
4. CALM Hub provides REST API for document management and visualization
5. UI renders architecture graphs using Cytoscape.js

## Testing Strategy

- **CLI/Shared**: Vitest with TypeScript
- **CALM Hub**: JUnit with TestContainers for integration tests  
- **UI**: Vitest + React Testing Library
- **Schema validation**: Automated testing of sample documents against schemas

Always run the appropriate test suite after making changes. The monorepo structure means changes in `shared` affect `cli`, so rebuild shared before testing CLI changes.

## Schema Governance

CALM schemas follow a governance process: Draft → Review → Release Candidate → Release. Schema changes require community validation during 4-week testing periods. Current release candidate is in `/calm/release/1.0-rc1/`.