# DNTRNG™ Desktop Node - Developer Guide

This document outlines the protocols for setting up and building the DNTRNG™ Desktop application using Electron.

## 🏗️ Architecture
The desktop node is a high-performance wrapper around the Next.js application. It shares the same logic, components, and Google Sheets Registry Bridge as the web version.

**Crucially**, in production mode, the Electron process spawns a background Next.js server (`next start`) on port `9005` to handle dynamic routing and Server Components.

## 🛠️ Prerequisites
- **Node.js**: v18.x or higher.
- **Graphical Environment**: A local machine (Windows, macOS, or Linux Desktop) is required to run the Electron GUI.

## 🚀 Development Protocol
To launch the desktop node in development mode:

1.  **Clone & Initialize**:
    ```bash
    git clone <your-repo-url>
    cd dntrng-platform
    npm install
    ```

2.  **Launch Dev Node**:
    ```bash
    npm run electron:dev
    ```
    - **Engine Port**: `9005` (Designated for Electron to avoid web conflicts).
    - **Wait Protocol**: Uses `wait-on` to ensure the Next.js server is fully initialized before opening the desktop window.

## 📦 Build & Distribution Protocol
To generate a standalone installer (`.exe`, `.dmg`):

1.  **Production Compilation**:
    ```bash
    npm run electron:build
    ```

2.  **Output Registry**:
    - Look in the `dist/` directory.
    - The installer will be named according to your OS (e.g., `DNTRNG-Setup-1.0.0.exe`).

## 📡 Troubleshooting
- **Blank White Page**: This occurs if the background server fails to start or if port `9005` is blocked. 
    - Check the system Task Manager for ghost `node` processes.
    - Use `View > Toggle DevTools` in the app menu to see the console errors.
- **Port Conflict**: If port `9005` is busy, the app will hang at the "Initializing..." stage. Ensure no other instance of DNTRNG is running.
- **MIME Type Errors**: Ensure `npm run build` completed successfully before running `electron:build`.
