# AI Studio

A modern, responsive web application for AI-powered image generation and editing. Built with React, TypeScript, and Tailwind CSS, featuring a clean and intuitive user interface for uploading images, applying artistic styles, and generating new content.

## 🚀 Features

- **Image Upload & Processing**: Drag-and-drop image upload with automatic compression and dimension detection
- **Style Selection**: Choose from 8 artistic styles including editorial, cinematic, artistic, photorealistic, anime, sketch, watercolor, and oil-painting
- **AI Generation**: Generate new images based on uploaded content and text prompts
- **Real-time Preview**: Live preview of generation parameters before processing
- **Generation History**: Track and revisit previous generations
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes with persistent preferences
- **Error Handling**: Robust error handling with retry mechanisms and user feedback
- **Performance Monitoring**: Built-in performance tracking and optimization

## 🛠️ Tech Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.2
- **Styling**: Tailwind CSS 3.4.17
- **Testing**: Vitest with React Testing Library
- **Code Quality**: ESLint, Prettier, Husky
- **State Management**: React Context API with custom hooks
- **Image Processing**: Custom utilities for compression and manipulation

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher (or yarn/pnpm)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-studio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   - The application currently uses a mock API for demonstration purposes
   - To integrate with real AI services, configure your API keys in environment variables

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

- Starts the development server at `http://localhost:5173`
- Hot module replacement enabled
- Real-time error reporting

### Production Build

```bash
npm run build
npm run preview
```

- Creates optimized production build
- Serves the built application locally for testing

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:ui

# Run tests once
npm run test:run
```

### Test Coverage

- Unit tests for all components and hooks
- Integration tests for user workflows
- Mock API testing for generation scenarios
- Performance monitoring tests

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ImageStudio.tsx # Main application component
│   ├── ImageUpload.tsx # Image upload and processing
│   ├── StyleSelector.tsx # Style selection interface
│   ├── PromptInput.tsx # Text prompt input
│   ├── GenerateButton.tsx # Generation controls
│   ├── PreviewPanel.tsx # Live preview display
│   ├── GenerationHistory.tsx # History management
│   └── Layout.tsx      # Application layout wrapper
├── context/            # React Context providers
│   ├── AppStateContext.tsx # Application state management
│   └── ThemeContext.tsx    # Theme switching
├── hooks/              # Custom React hooks
│   ├── useAppState.ts      # State management hook
│   ├── useImageProcessing.ts # Image processing logic
│   ├── usePerformanceMonitor.ts # Performance tracking
│   └── useTheme.ts          # Theme management
├── services/           # API and external services
│   └── mockAPI.ts          # Mock generation API
├── types/              # TypeScript type definitions
│   └── index.ts            # All application types
├── utils/              # Utility functions
│   ├── imageUtils.ts       # Image processing utilities
│   ├── helpers.ts          # General helper functions
│   └── logger.ts           # Logging utilities
└── App.tsx             # Main application component
```

## 🎨 Design Notes

### Architecture Patterns

1. **Component Composition**: Modular components with clear separation of concerns
2. **Context API**: Centralized state management without external libraries
3. ** Custom Hooks**: Reusable logic extraction for complex operations
4. **Type Safety**: Comprehensive TypeScript interfaces for all data structures

### UI/UX Design Principles

1. **Responsive Design**: Mobile-first approach with Tailwind CSS utilities
2. **Accessibility**: Semantic HTML, ARIA labels, and keyboard navigation
3. **Performance**: Lazy loading, image optimization, and efficient re-renders
4. **User Feedback**: Loading states, error messages, and success confirmations

### State Management

- **AppStateContext**: Manages application-wide state including:
  - Uploaded images and metadata
  - Generation parameters and results
  - Error states and loading indicators
  - Generation history and retry logic

- **ThemeContext**: Handles theme switching with persistent storage

### Image Processing Pipeline

1. **Upload**: File validation and compression
2. **Processing**: Dimension detection and format optimization
3. **Generation**: Style application and AI processing
4. **Storage**: Local history management and result caching

### Error Handling Strategy

- **Graceful Degradation**: Fallback states for failed operations
- **Retry Logic**: Exponential backoff for transient failures
- **User Communication**: Clear error messages and recovery suggestions
- **Boundary Protection**: Error boundaries prevent application crashes

## 🔧 Development

### Code Quality Tools

- **ESLint**: Code linting and style enforcement
- **Prettier**: Automatic code formatting
- **Husky**: Git hooks for pre-commit validation
- **TypeScript**: Static type checking

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run test suite
npm run test:ui      # Run tests with UI
npm run test:run     # Run tests once
npm run lint         # Lint code
npm run format       # Format code with Prettier
```

### Adding New Styles

To add new artistic styles:

1. Update the `StyleType` union in `src/types/index.ts`
2. Add style options to the `StyleSelector` component
3. Update mock API responses to handle new styles
4. Add corresponding test cases

### Performance Optimization

- **Lazy Loading**: Components load on demand
- **Memoization**: React.memo and useCallback for expensive operations
- **Image Optimization**: Automatic compression and format conversion
- **Bundle Splitting**: Vite optimizations for production builds

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: CloudFlare, AWS CloudFront
- **Container**: Docker with nginx
