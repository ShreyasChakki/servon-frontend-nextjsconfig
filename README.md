# ServonF Frontend - Next.js Application

A modern Next.js application for the ServonF platform, featuring a comprehensive service marketplace with customer and provider portals, real-time chat, quotation management, and administrative dashboard.

## 🚀 Quick Start

**TL;DR - Run these commands to get started:**

```bash
git clone https://github.com/ShreyasChakki/servon-frontend-nextjsconfig.git
cd servon-frontend-nextjsconfig
npm install --legacy-peer-deps
npm run dev
```

Your app will be running at `http://localhost:3000` (or the next available port).

## 🚀 Features

- **Multi-role Authentication System** (Customer, Provider, Admin)
- **Service Marketplace** with categories and search functionality
- **Real-time Chat System** between customers and providers
- **Quotation Management** with request and response workflows
- **Dashboard Interfaces** for all user types
- **Review and Rating System**
- **Notification System**
- **Responsive Design** with modern UI components
- **AI-powered Features** with integrated chatbot

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.4
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: Sonner
- **Theme**: Next Themes for dark/light mode
- **AI Integration**: Vercel AI SDK

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18.0 or higher)
- **npm** (comes with Node.js) or **pnpm** (recommended)
- **Git** (for version control)

You can check your versions by running:
```bash
node --version
npm --version
```

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ShreyasChakki/servon-frontend-nextjsconfig.git
cd servon-frontend-nextjsconfig
```

### 2. Install Dependencies

The project uses multiple package managers. Choose one of the following:

#### Option A: Using npm (Recommended if you encounter issues)
```bash
npm install --legacy-peer-deps
```

#### Option B: Using pnpm (Faster and more efficient)
```bash
# Install pnpm globally if you haven't already
npm install -g pnpm

# Install dependencies
pnpm install
```

> **Note**: The `--legacy-peer-deps` flag is used with npm to resolve peer dependency conflicts, particularly with the Zod package versions.

### 3. Environment Setup (Optional)

If your project requires environment variables, create a `.env.local` file in the root directory:

```bash
# Example environment variables
NEXT_PUBLIC_API_URL=your_api_url_here
NEXT_PUBLIC_APP_NAME=ServonF
```

## 🚀 Running the Project

### Development Mode

To start the development server:

```bash
npm run dev
```

or with pnpm:

```bash
pnpm dev
```

The application will be available at:
- **Local**: http://localhost:3000
- **Network**: http://[your-ip]:3000

The development server features:
- ✅ Hot reloading
- ✅ TypeScript support
- ✅ Tailwind CSS compilation
- ✅ Next.js optimizations

### Production Build

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

### Other Available Scripts

```bash
# Run ESLint for code linting
npm run lint

# Type checking (if using TypeScript)
npx tsc --noEmit
```

## 📁 Project Structure

```
servon-frontend-nextjsconfig/
├── app/                    # Next.js App Router directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   ├── page.jsx          # Home page
│   ├── admin/            # Admin dashboard pages
│   ├── api/              # API routes
│   ├── customer/         # Customer portal pages
│   ├── provider/         # Provider portal pages
│   └── services/         # Service-related pages
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/ui components
│   └── ...              # Custom components
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and configurations
├── public/              # Static assets
├── styles/              # Additional stylesheets
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── next.config.mjs      # Next.js configuration
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Dependency Conflicts (Zod Version Issues)
If you encounter peer dependency warnings or errors, especially with Zod packages:

**Error Example:**
```
npm warn ERESOLVE overriding peer dependency
npm warn Could not resolve dependency: peer zod@"^3.25.76 || ^4.1.8"
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json (Windows)
rmdir /s node_modules
del package-lock.json

# Or on Unix/Mac
rm -rf node_modules package-lock.json

# Reinstall with legacy peer deps (REQUIRED for this project)
npm install --legacy-peer-deps
```

**Why this happens:** The project uses Zod version 3.25.67, but some AI SDK packages require newer versions. The `--legacy-peer-deps` flag resolves this conflict.

#### 2. Port Already in Use
If port 3000 is already in use:

```bash
# Kill the process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or start on a different port
npm run dev -- -p 3001
```

#### 3. TypeScript Errors
For TypeScript-related issues:

```bash
# Check for type errors
npx tsc --noEmit

# Update TypeScript types
npm update @types/node @types/react @types/react-dom
```

#### 4. Build Cache Issues
If you encounter build errors or the app won't start properly:

```bash
# Remove Next.js build cache (Windows)
rmdir /s .next

# Or on Unix/Mac
rm -rf .next

# Then restart the development server
npm run dev
```

#### 5. Tailwind CSS Not Working
If styles aren't loading:

1. Check if `globals.css` is imported in `layout.tsx`
2. Verify Tailwind configuration in `tailwind.config.js`
3. Restart the development server

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Vercel will automatically detect it's a Next.js project
3. Deploy with default settings

### Other Platforms

For deployment on other platforms, build the project first:

```bash
npm run build
```

Then follow the specific deployment instructions for your platform.

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling
- Implement responsive design patterns

### Component Structure
- Keep components small and focused
- Use React hooks for state management
- Implement proper error boundaries
- Follow accessibility guidelines

### API Integration
- Use Next.js API routes for backend logic
- Implement proper error handling
- Use environment variables for configuration

## 📞 Support

If you encounter any issues or need help:

1. Check the troubleshooting section above
2. Review the Next.js documentation: https://nextjs.org/docs
3. Check the project's issue tracker
4. Contact the development team

## 📄 License

This project is part of the ServonF platform. Please refer to the license file for usage rights and restrictions.

---

**Happy Coding! 🚀**

For more information about Next.js features, visit the [Next.js Documentation](https://nextjs.org/docs).