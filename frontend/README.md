# BookReader - Modern Online Book Reading Platform

A modern web application for reading books online, built with Next.js, TypeScript, and Shadcn UI.

## Features

- 📚 Browse a library of books
- 🔍 Search and filter books by category
- 📖 Read books with customizable reading experience
- 🌓 Dark mode support
- 📱 Responsive design for all devices

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd 2025-AI-hackaton-cost-effective/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
frontend/
├── public/          # Static assets
├── src/
│   ├── app/         # Next.js app router pages
│   ├── components/  # Reusable UI components
│   └── types.d.ts   # TypeScript type declarations
├── package.json     # Project dependencies
└── tailwind.config.js # Tailwind CSS configuration
```

## Key Pages

- `/` - Home page with featured books
- `/library` - Browse all books with filtering and sorting
- `/book/[id]` - Book reader page with customizable reading experience

## Customization

### Theme

The application uses a theme system based on CSS variables. You can customize the colors, typography, and other design tokens in the `globals.css` file.

### Adding New Books

To add new books, update the mock data in the `library/page.tsx` file. In a real application, this would be fetched from an API.

## License

This project is licensed under the MIT License - see the LICENSE file for details.