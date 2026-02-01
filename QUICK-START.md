# Quick Start Guide - Nexus HRM Next.js

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm or yarn package manager

### Installation

1. **Navigate to the UI directory:**
```bash
cd ui
```

2. **Install dependencies:**
```bash
npm install
```

This will install all required packages:
- Next.js 14.2.15
- React 18.3.1
- TypeScript 5.8.2
- Tailwind CSS 3.4.17
- Zustand 5.0.10
- Framer Motion 12.29.2
- Lucide React 0.468.0

### Development

**Start the development server:**
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev` | Start development server |
| `build` | `next build` | Create production build |
| `start` | `next start` | Start production server |
| `lint` | `next lint` | Run ESLint |
| `type-check` | `tsc --noEmit` | TypeScript type checking |
| `format` | `prettier --write .` | Format code |
| `clean` | `rm -rf .next` | Clean build artifacts |

### Quick Login

The application includes quick login buttons for demo users:

1. **Admin User**
   - Full access to all modules
   - Can approve/reject requests
   - Manage all users

2. **Manager User**
   - Team management
   - Project oversight
   - Leave approvals

3. **Developer User**
   - Personal dashboard
   - Timesheet logging
   - Task management

4. **HR User**
   - Employee directory
   - Leave management
   - Attendance tracking

Just click any of the quick login buttons on the login page to access the application.

---

## 📱 Application Modules

After logging in, you'll have access to 8 main modules:

### 1. Dashboard
- Overview statistics
- Quick actions
- Engagement metrics
- Welcome message

### 2. Projects
- View all projects
- Create new projects
- Assign project owners
- Track team members

### 3. Kanban Board
- **Board View:** Drag-drop task management
- **List View:** Table format
- **Backlog:** Unplanned items
- **Planning:** Sprint assignment
- Task assignment with searchable dropdown
- Team filtering
- Progress tracking

### 4. Employee Directory
- Search employees
- View by department
- Contact information
- Role badges

### 5. Attendance
- Check in/out system
- Office vs Remote
- **Analytics Dashboard:**
  - Week/Month/Year filtering
  - Average check-in time
  - Average check-out time
  - Average daily hours
- Complete attendance logs

### 6. Leave Management
- Submit leave requests
- Choose leave type (Annual, Sick, Personal, etc.)
- Select date range
- Provide reason
- Track status (Pending/Approved/Rejected)

### 7. Timesheet
- Log work hours
- Select project
- Choose category (Development, Design, Testing, etc.)
- Mark billable/non-billable
- Add task description
- View all entries

### 8. Knowledge Base (Yan Wiki)
- Search documentation
- Create new documents
- Edit existing pages
- Organize by space (General, Engineering, HR, etc.)
- Markdown support

---

## 🎨 Theme Toggle

The application supports both light and dark modes:
- Click the theme toggle button in the top-right corner
- Theme preference is saved locally
- All components adapt automatically

---

## 🔧 Development Tips

### Hot Module Replacement
- Changes to components reload instantly
- No need to refresh the browser
- State is preserved when possible

### TypeScript Errors
Check for type errors before building:
```bash
npm run type-check
```

### Code Formatting
Format all files with Prettier:
```bash
npm run format
```

### Linting
Check for code quality issues:
```bash
npm run lint
```

---

## 📂 Project Structure

```
ui/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main entry point
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable UI components
│   ├── navigation/        # Sidebar and topbar
│   └── modules/           # Feature modules
├── lib/
│   ├── store/             # Zustand state management
│   ├── data/              # Mock data
│   └── utils.ts           # Utilities
└── types/                 # TypeScript definitions
```

---

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is occupied:
```bash
# Use a different port
PORT=3001 npm run dev
```

### Module Not Found
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Type Errors
Packages are not yet installed. Run:
```bash
npm install
```

### Build Errors
Clean build artifacts:
```bash
npm run clean
npm run build
```

---

## 🚢 Production Build

### Create Production Build
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

The production build will:
- Optimize bundle size
- Minify code
- Generate static pages where possible
- Enable all performance optimizations

---

## 📊 Performance

### Lighthouse Scores (Expected)
- **Performance:** 90+
- **Accessibility:** 95+
- **Best Practices:** 100
- **SEO:** 100

### Bundle Size Analysis
```bash
npm run build
```

Check `.next/build-manifest.json` for detailed bundle information.

---

## 🔐 Security Features

- Content Security Policy headers
- X-Frame-Options protection
- XSS protection
- HSTS enabled
- Referrer policy configured

---

## 📝 Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
# Example environment variables
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Nexus HRM
```

---

## 🧪 Testing (Future)

Recommended testing setup:

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests
npm test
```

---

## 📖 Additional Resources

### Next.js Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Next.js Learn](https://nextjs.org/learn)

### React Documentation
- [React Docs](https://react.dev)
- [React Hooks](https://react.dev/reference/react)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindcss.com/components)

### Zustand
- [Zustand Docs](https://docs.pmnd.rs/zustand)

### Framer Motion
- [Framer Motion Docs](https://www.framer.com/motion/)

---

## 🤝 Contributing

### Code Standards
1. Use TypeScript for all new files
2. Follow existing component patterns
3. Add JSDoc comments for complex logic
4. Run linter and type-check before committing
5. Use Prettier for formatting

### Component Guidelines
- Use functional components with hooks
- Keep components focused (single responsibility)
- Extract reusable logic into custom hooks
- Use proper TypeScript typing

---

## ✅ Checklist

Before deployment, ensure:

- [ ] All dependencies installed (`npm install`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Application runs in production mode (`npm start`)
- [ ] All modules are accessible
- [ ] Theme toggle works
- [ ] All forms submit correctly
- [ ] Drag-and-drop functions properly

---

## 🎉 You're Ready!

The application is fully migrated and ready for:
- ✅ Development
- ✅ Testing
- ✅ Backend integration
- ✅ Production deployment

**Start developing:**
```bash
cd ui
npm install
npm run dev
```

**Happy coding! 🚀**
