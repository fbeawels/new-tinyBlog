# TinyBlog Frontend

A modern, responsive blog application built with Next.js, React, and Tailwind CSS.

## Overview

TinyBlog Frontend is a feature-rich blog application that provides a clean and intuitive user interface for reading and managing blog posts. It includes features such as:

- Responsive article listing with pagination
- User authentication (login/register)
- Category and tag filtering
- Modern UI components using Shadcn UI

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 14.2.16
- **UI Library**: [React](https://reactjs.org/) 18
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 3.4
- **UI Components**: Custom components built with [Radix UI](https://www.radix-ui.com/)
- **State Management**: [React Query](https://tanstack.com/query/latest) for server state
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes) for light/dark mode support

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository (if not already done)
2. Navigate to the frontend directory:

```bash
cd frontend
```

3. Install dependencies:

```bash
npm install
# or
yarn install
```

### Configuration

Create a `.env.local` file in the root of the frontend directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Adjust the API URL as needed to match your backend server configuration.

### Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

### Running Production Build

To start the production server after building:

```bash
npm run start
# or
yarn start
```

## Project Structure

```
frontend/
├── app/                  # Next.js app directory (pages and layouts)
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── layout/           # Layout components (navbar, sidebar)
│   ├── posts/            # Post-related components
│   ├── ui/               # UI components (buttons, forms, etc.)
│   └── providers.tsx     # App providers
├── services/             # API services
│   ├── api.ts            # Axios instance and interceptors
│   └── post-service.ts   # Post-related API calls
├── types/                # TypeScript type definitions
├── public/               # Static assets
└── package.json          # Project dependencies and scripts
```

## Features

- **Authentication**: User registration and login
- **Blog Posts**: View list of posts with pagination
- **Categories & Tags**: Filter posts by categories and tags
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Dark Mode**: Toggle between light and dark themes

## API Integration

The frontend connects to a RESTful API backend. API calls are centralized in the `services` directory, with Axios handling HTTP requests and React Query managing server state and caching.

Authentication is handled via JWT tokens stored in localStorage and automatically attached to API requests through Axios interceptors.
