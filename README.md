# England Football Clubs

A modern Single Page Application (SPA) built with Svelte 5, featuring England football club data and designed as a Progressive Web App (PWA).

## 🚀 Overview

This application serves as a comprehensive learning project for exploring Svelte 5's capabilities while creating a functional football club information platform. The app fetches and displays data about England football clubs in an intuitive, responsive interface.

## 🎯 Purpose

This project was developed as a personal learning initiative to master Svelte UI library fundamentals and modern web development practices. It demonstrates practical implementation of various frontend technologies and design patterns.

## ✨ Features

- **Progressive Web App (PWA)**: Installable and works offline
- **Single Page Application**: Smooth navigation without page reloads
- **Responsive Design**: Optimized for all device sizes
- **Real-time Data**: Fetches live England football club information
- **Modern UI**: Clean and professional interface design

## 🛠️ Technologies Used

- **Svelte 5**: Modern reactive framework
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **Yarn**: Package manager
- **Custom Router**: Hand-built SPA routing system
- **Vercel**: Deployment platform
- **CORS Proxy**: Custom API proxy for handling CORS issues

## 📚 Learning Objectives

This project encompasses several key learning areas:

- **Custom SPA Router**: Built from scratch routing system
- **Component Architecture**: Modular and reusable component design
- **State Management**: Svelte stores implementation
- **Local Storage**: Client-side data persistence
- **UI/UX Design**: Modern interface design principles
- **Code Organization**: Clean, maintainable code structure
- **CORS Handling**: Implementing proxy solutions for API access
- **Vercel Deployment**: Cloud deployment and serverless functions

## 🏗️ Architecture

The application follows modern frontend architecture principles:

- **Component-based Structure**: Modular components for better maintainability
- **Store Pattern**: Centralized state management using Svelte stores
- **Custom Routing**: Self-implemented SPA routing for learning purposes
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **API Proxy**: Custom CORS proxy in the `/api` folder for handling cross-origin requests
- **Serverless Deployment**: Optimized for Vercel's serverless environment

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Yarn package manager

### Installation

1. Clone the repository

```bash
git clone https://github.com/Kuhlen/england-football-clubs.git
cd england-football-clubs
```

2. Install dependencies

```bash
yarn install
```

3. Start the development server

```bash
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
yarn build
```

### Preview Production Build

```bash
yarn preview
```

## 🌐 CORS Handling

This application implements a custom CORS proxy solution to handle cross-origin requests when fetching football club data. The proxy is located in the `/api` folder and deployed as a serverless function on Vercel.

### Important Note

If you encounter issues with data fetching, you may need to activate the CORS proxy service first:

1. Visit: https://cors-anywhere.herokuapp.com/corsdemo
2. Click "Request temporary access to the demo server"
3. Return to the application and refresh

This step is required due to CORS restrictions when accessing external APIs from the browser.

## 🚀 Deployment

This application is deployed on Vercel, leveraging its serverless architecture for optimal performance and scalability. The deployment includes:

- Static site hosting
- Serverless functions for API proxy
- Automatic deployments from GitHub
- Global CDN distribution

## 🎨 Design Philosophy

The application emphasizes clean, modern design with focus on:

- User-friendly navigation
- Responsive layouts
- Accessible interface elements
- Performance optimization

## 🔧 Technical Implementation

The application emphasizes clean, modern design with focus on:

- User-friendly navigation
- Responsive layouts
- Accessible interface elements
- Performance optimization

## 🔧 Technical Implementation

### Custom Router

Hand-built SPA routing system to understand the fundamentals of client-side navigation without relying on external libraries.

### State Management

Utilizes Svelte's built-in store system for managing application state and data flow.

### Local Storage Integration

Implements browser storage for persisting user preferences and cached data.

### Component Architecture

Organized into reusable components following best practices for maintainability and scalability.

### CORS Proxy Implementation

Custom serverless function deployed on Vercel to handle cross-origin requests, enabling secure access to external football APIs without exposing API keys or dealing with browser CORS restrictions.

## 📱 PWA Features

- Offline functionality
- Installable on mobile devices
- Fast loading with service worker caching
- Native app-like experience

## 🤝 Contributing

This is a personal learning project, but feedback and suggestions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎓 Learning Outcomes

Through this project, I've gained hands-on experience with:

- Svelte 5 ecosystem and reactive programming
- Modern JavaScript/TypeScript development
- Component-based architecture
- State management patterns
- Progressive Web App development
- Custom routing implementation
- Responsive design with Tailwind CSS
- CORS handling and proxy implementation
- Vercel deployment and serverless functions
- API integration and data fetching strategies

---

## 📝 Update Notes

When I updated this project on July 13, 2025, the details page couldn't display squads. This was because the squad key in the API https://api.football-data.org/v2/teams/{id} no longer provided squad data. However, I noticed that the API https://api.football-data.org/v4/teams/{id} provided squad data, albeit with a different schema than v2. Feel free to change it if you want to try it.

_This project represents my journey in learning modern web development with Svelte 5. It serves as both a functional application and a comprehensive learning resource._
