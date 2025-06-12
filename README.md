# TinyBlog - Modern Blogging Platform

TinyBlog is a lightweight blogging platform designed for individuals and small organizations. This modernized version is built with a Python FastAPI backend and React frontend.

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
  - React.js
  - React Router for navigation
  - React Query for state management
  - Tailwind CSS for styling
  - Axios for API communication

## Project Structure

```
tinyBlog/
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Core functionality
│   │   ├── db/             # Database models and connections
│   │   ├── models/         # Pydantic models
│   │   ├── services/       # Business logic
│   │   └── main.py         # Application entry point
│   ├── tests/              # Backend tests
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   ├── App.js          # Main component
│   │   └── index.js        # Entry point
│   ├── package.json        # JavaScript dependencies
│   └── tailwind.config.js  # Tailwind CSS configuration
│
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- MongoDB

### Backend Setup

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

4. Set up environment variables (create a .env file):
   ```
   MONGODB_URL=mongodb://localhost:27017
   DATABASE_NAME=tinyblog
   SECRET_KEY=your_secret_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

5. Run the server:
   ```
   uvicorn app.main:app --reload
   ```

6. Access the API documentation at http://localhost:8000/docs

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd tinyBlog/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables (create a .env file):
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

4. Run the development server:
   ```
   npm start
   ```

5. Access the application at http://localhost:3000

## API Documentation

The API documentation is automatically generated and available at http://localhost:8000/docs when the backend server is running.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

This project is a modernized version of the original TinyBlog application, which was built with Pharo Smalltalk and Seaside.