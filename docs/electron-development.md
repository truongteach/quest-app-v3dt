# DNTRNG™ Desktop Node - Developer Guide

This document outlines the protocols for setting up and building the DNTRNG™ Desktop application using Electron.

## 🏗️ Architecture
The desktop node is a high-performance wrapper around the Next.js application. It shares the same logic, components, and Google Sheets Registry Bridge as the web version, ensuring absolute data synchronization.

## 🛠️ Prerequisites
- **Node.js**: v18.x or higher.
- **Git**: For repository cloning.
- **Graphical Environment**: A local machine (Windows, macOS, or Linux Desktop) is required to run the Electron GUI.

## 🚀 Development Protocol
To launch the desktop node in development mode:

1. **Clone & Initialize**:
   ```bash
   git clone <your-repo-url>
   cd dntrng-platform
   npm install
   ```

2. **Launch Dev Node**:
   ```bash
   npm run electron:dev
   ```
   - **Engine Port**: `9005` (Designated for Electron to avoid web conflicts).
   - **Wait Protocol**: Uses `wait-on` to ensure the Next.js server is fully initialized before opening the desktop window.

## 📦 Build & Distribution Protocol
To generate a standalone installer (`.exe`, `.dmg`, or `.AppImage`):

1. **Production Compilation**:
   ```bash
   npm run electron:build
   ```

2. **Output Registry**:
   - Look in the `dist/` directory.
   - The installer will be named according to your OS (e.g., `DNTRNG-Setup-1.0.0.exe`).

## 🔐 Security Considerations
- **Registry Bridge**: Ensure `src/lib/api-config.ts` points to a valid GAS v18.2 endpoint.
- **Context Isolation**: The Electron window is configured with `contextIsolation: true` and `nodeIntegration: false` to maintain maximum security while running standard web protocols.

## 📡 Troubleshooting
- **Port Conflict**: If port `9005` is busy, update the port in `package.json` scripts and `main.js`.
- **White Screen**: Ensure the local Next.js server started correctly. Check console logs via `View > Toggle DevTools` in the app menu.
