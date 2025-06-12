# TinyBlog - Modern Blogging Platform

TinyBlog is a lightweight blogging platform designed for individuals and small organizations. This modernized version is built with a Python FastAPI backend and Next.js frontend.

## Features

- **Simple Blog Management**: Create, edit, and manage blog posts with ease
- **Category and Tag System**: Organize content with categories and tags
- **User Management**: Support for different user roles (admin, author, reader)
- **Comment System**: Allow readers to engage with content through comments
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Search Functionality**: Find content quickly with built-in search
- **Secure Authentication**: Robust user authentication and authorization
- **REST API**: Well-documented API for potential integrations

## Technology Stack

- **Backend**:
  - Python FastAPI
  - MongoDB (via motor async driver)
  - JWT for authentication
  - Pydantic for data validation

- **Frontend**:
  - Next.js
  - React
  - Tailwind CSS for styling
  - React Query for state management
  - Axios for API communication
  - TypeScript

- **Deployment**:
  - Docker
  - Docker Compose
  - Nginx for frontend serving

## Project Structure

```
tinyBlog/
├── backend/                # FastAPI backend
│   ├── app/                # Application code
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Core functionality
│   │   ├── db/             # Database models and connections
│   │   ├── models/         # Pydantic models
│   │   ├── services/       # Business logic
│   │   └── main.py         # Application entry point
│   ├── tests/              # Backend tests
│   ├── .env                # Environment variables
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # Next.js frontend
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── public/             # Static files
│   ├── services/           # API services
│   ├── styles/             # CSS styles
│   ├── types/              # TypeScript type definitions
│   ├── package.json        # JavaScript dependencies
│   └── tailwind.config.js  # Tailwind CSS configuration
│
├── docker/                 # Docker configuration
│   ├── backend/            # Backend Docker configuration
│   └── frontend/           # Frontend Docker configuration
│
├── docker-compose.yml      # Docker Compose configuration
├── docs/                   # Documentation
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- MongoDB
- Docker and Docker Compose (optional, for containerized setup)

### Option 1: Docker Setup (Recommended)

The easiest way to run TinyBlog is using Docker Compose:

1. Clone the repository:
   ```
   git clone <repository-url>
   cd tinyBlog
   ```

2. Start the application using Docker Compose:
   ```
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:3002
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```
   cd tinyBlog/backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables (create a .env file based on .env.example):
   ```
   MONGODB_URI=mongodb://localhost:27017/tinyblog
   SECRET_KEY=your_secret_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

5. Run the server:
   ```
   uvicorn app.main:app --reload
   ```

6. Access the API documentation at http://localhost:8000/docs

#### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd tinyBlog/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables (create a .env.local file):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Access the application at http://localhost:3000

## API Documentation

The API documentation is automatically generated and available at http://localhost:8000/docs when the backend server is running.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

This project is a modernized version of the original TinyBlog application, which was built with Pharo Smalltalk and Seaside.