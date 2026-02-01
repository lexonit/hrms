# YanHRM - Enterprise Human Resource Management Platform

<div align="center">
  <h3>All-in-One Enterprise OS 2.0</h3>
  <p>Production-ready HRM platform built with Next.js 14, TypeScript, and Tailwind CSS</p>
</div>

---

## 🚀 Features

### Core Modules
- **Dashboard** - Real-time analytics and quick actions
- **Attendance Management** - Digital check-in/check-out system with analytics
- **Leave Management** - Comprehensive leave request and approval workflow
- **Project Management** - Portfolio view and team collaboration
- **Kanban Board** - Agile sprint planning with drag-and-drop
- **Timesheet Tracking** - Billable hours and project time tracking
- **Employee Directory** - Organization-wide employee search and profiles
- **Knowledge Base** - Internal wiki and documentation system

### Technical Highlights
- ⚡ **Next.js 14** with App Router for optimal performance
- 🎨 **Tailwind CSS** with custom design system
- 📱 **Fully Responsive** design for all devices
- 🌙 **Dark/Light Mode** with system preference detection
- 🔐 **Role-Based Access Control** (SUPER_ADMIN, HR_ADMIN, MANAGER, EMPLOYEE)
- ♿ **Accessible** components following WCAG guidelines
- 🎭 **Framer Motion** for smooth animations
- 📦 **Zustand** for lightweight state management
- 🎯 **TypeScript** for type safety
- 🔍 **SEO Optimized** with proper metadata

---

## 📁 Project Structure

```
ui/
├── app/                      # Next.js 14 App Router
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Home page with routing logic
│   └── globals.css          # Global styles and CSS variables
├── components/
│   ├── ui/                  # Reusable UI components
│   │   └── index.tsx        # Card, Button, Badge, Input, etc.
│   ├── navigation/          # Navigation components
│   │   ├── sidebar.tsx      # Collapsible sidebar
│   │   ├── topbar.tsx       # Header with notifications
│   │   └── index.ts         # Barrel export
│   └── modules/             # Feature modules
│       ├── login-module.tsx
│       ├── dashboard-module.tsx
│       ├── attendance-module.tsx
│       ├── kanban-module.tsx
│       └── ... (other modules)
├── lib/
│   ├── store/               # State management
│   │   └── index.ts         # Zustand store
│   ├── data/                # Mock data and services
│   │   └── mock-data.ts
│   └── utils.ts             # Utility functions
├── types/
│   └── index.ts             # TypeScript type definitions
├── public/                  # Static assets
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation

1. **Navigate to the ui directory**
   ```bash
   cd ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create optimized production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint for code quality |
| `npm run type-check` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |
| `npm run clean` | Remove build artifacts and dependencies |

---

## 🔐 Demo Accounts

Use these credentials to test different user roles:

| Role | Email | Access Level |
|------|-------|--------------|
| **Super Admin** | admin@nexus.com | Full system access |
| **HR Admin** | hr@nexus.com | HR management features |
| **Manager** | manager@nexus.com | Team and project management |
| **Employee** | employee@nexus.com | Personal features only |

> Password can be anything (mock authentication)

---

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#7C3AED) - Main brand color
- **Secondary**: Pink (#EC4899) - Accent and highlights
- **Accent**: Teal - Backgrounds and borders
- **Destructive**: Red - Error states and warnings

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 400 (regular), 500 (medium), 700 (bold), 900 (black)

### Spacing Scale
Based on Tailwind's default spacing scale (0.25rem increments)

---

## 🏗️ Architecture Decisions

### Why Next.js 14?
- **App Router**: Modern routing with React Server Components
- **Image Optimization**: Automatic image optimization with next/image
- **Performance**: Automatic code splitting and lazy loading
- **SEO**: Built-in metadata API and server-side rendering

### Why Zustand?
- **Lightweight**: ~1KB bundle size
- **Simple API**: No boilerplate like Redux
- **TypeScript**: Full type safety
- **DevTools**: React DevTools integration

### Why Tailwind CSS?
- **Utility-First**: Rapid UI development
- **Customizable**: Easy theme customization
- **Performance**: Purges unused CSS in production
- **Dark Mode**: Built-in dark mode support

---

## 🔄 Migration from Vite

This project was professionally migrated from Vite to Next.js 14 with the following improvements:

### Enhancements
- ✅ Converted to Next.js App Router architecture
- ✅ Separated concerns into modular components
- ✅ Added proper TypeScript types and JSDoc comments
- ✅ Implemented production-ready security headers
- ✅ Optimized images with next/image
- ✅ Added comprehensive error handling
- ✅ Improved accessibility (ARIA labels, semantic HTML)
- ✅ Added ESLint and Prettier configuration
- ✅ Created detailed documentation

### Code Quality
- **Separation of Concerns**: Each module in its own file
- **Reusable Components**: Shared UI components library
- **Type Safety**: Comprehensive TypeScript coverage
- **Documentation**: JSDoc comments for all major functions
- **Standards**: Follows Next.js and React best practices

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t yanhrm-ui .
docker run -p 3000:3000 yanhrm-ui
```

### Manual Build
```bash
npm run build
npm start
```

---

## 🔮 Future Enhancements

- [ ] Real API integration (replace mock data)
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Authentication with NextAuth.js
- [ ] OAuth providers (Google, Microsoft)
- [ ] Real-time notifications with WebSockets
- [ ] File upload and document management
- [ ] Advanced reporting and analytics
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Multi-tenancy support

---

## 📄 License

MIT License - Copyright (c) 2024 Nexus Team

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Contact: support@yan-hrm.com

---

<div align="center">
  <p>Built with ❤️ by Nexus Team</p>
  <p>Next.js 14 · TypeScript · Tailwind CSS</p>
</div>
