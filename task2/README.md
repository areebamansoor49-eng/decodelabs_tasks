# TaskFlow-API

A RESTful task management API built with Node.js and Express.js.

## 📌 Overview

**TaskFlow API** is a simple and modular REST API for managing tasks. It demonstrates core backend development concepts including CRUD operations, request validation, HTTP status codes, JSON handling, middleware, CORS, error handling, and API deployment.

The project uses an in-memory data store, making it lightweight and easy to run without requiring a database.

## ✨ Features

* Create, read, update, and delete tasks
* RESTful API architecture
* JSON request and response handling
* Input validation
* HTTP status code handling
* CORS support
* Centralized error handling
* Health check endpoint
* Modular project structure
* In-memory task storage
* Vercel deployment support

## 🛠️ Tech Stack

* **Node.js**
* **Express.js**
* **JavaScript**
* **CORS**
* **Nodemon**
* **Vercel**

## 📁 Project Structure

```text
TaskFlow-API/
│
├── api/
│   └── index.js
│
├── src/
│   ├── controllers/
│   │   └── taskController.js
│   │
│   ├── data/
│   │   └── tasks.js
│   │
│   ├── middleware/
│   │   └── errorHandler.js
│   │
│   ├── routes/
│   │   └── taskRoutes.js
│   │
│   └── server.js
│
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── vercel.json
```

## 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/areebamansoor49-eng/TaskFlow-API.git
```

Navigate into the project:

```bash
cd TaskFlow-API
```

Install dependencies:

```bash
npm install
```

## ▶️ Run Locally

Start the development server:

```bash
npm run dev
```

The API will run at:

```text
http://localhost:3000
```

For production mode:

```bash
npm start
```

## 🔗 API Endpoints

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/`              | API information   |
| GET    | `/api/health`    | Health check      |
| GET    | `/api/tasks`     | Get all tasks     |
| GET    | `/api/tasks/:id` | Get a task by ID  |
| POST   | `/api/tasks`     | Create a new task |
| PUT    | `/api/tasks/:id` | Update a task     |
| DELETE | `/api/tasks/:id` | Delete a task     |

## 📋 Task Format

A task contains the following fields:

```json
{
  "id": 1,
  "title": "Complete backend API",
  "description": "Build and test the TaskFlow REST API",
  "status": "in-progress",
  "priority": "high"
}
```

### Valid Status Values

```text
pending
in-progress
completed
```

### Valid Priority Values

```text
low
medium
high
```

## ➕ Create a Task

**POST**

```text
/api/tasks
```

Example request:

```json
{
  "title": "Learn REST APIs",
  "description": "Practice REST API development with Express",
  "status": "pending",
  "priority": "high"
}
```

Example response:

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 3,
    "title": "Learn REST APIs",
    "description": "Practice REST API development with Express",
    "status": "pending",
    "priority": "high"
  }
}
```

## ✏️ Update a Task

**PUT**

```text
/api/tasks/3
```

Example request:

```json
{
  "title": "Learn Express REST APIs",
  "status": "completed",
  "priority": "high"
}
```

## 🗑️ Delete a Task

**DELETE**

```text
/api/tasks/3
```

A successful response returns:

```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## 🔍 Validation

The API validates:

* Task title is required
* Task title must be a non-empty string
* Status must be `pending`, `in-progress`, or `completed`
* Priority must be `low`, `medium`, or `high`
* Task IDs must be valid numbers
* Requests for non-existing tasks return `404`

## 📊 HTTP Status Codes

| Status Code | Meaning                             |
| ----------- | ----------------------------------- |
| `200`       | Successful request                  |
| `201`       | Resource created                    |
| `400`       | Invalid request or validation error |
| `404`       | Resource or route not found         |
| `500`       | Internal server error               |

## ❤️ Health Check

The health endpoint can be used to verify that the server is running:

```text
GET /api/health
```

Example response:

```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2026-09-25T00:00:00.000Z"
}
```

## 🌐 Live Deployment

The API is deployed on Vercel.

**Base URL:**

```text
https://task-flow-api-psi.vercel.app
```

### Live Health Check

```text
https://task-flow-api-psi.vercel.app/api/health
```

### Live Tasks Endpoint

```text
https://task-flow-api-psi.vercel.app/api/tasks
```

## 🧪 Testing

The API was tested locally and on the production Vercel deployment.

Verified operations include:

* GET all tasks
* GET task by ID
* POST task creation
* PUT task update
* DELETE task
* Validation errors
* 404 handling
* Health check

Production CRUD operations were successfully verified using the deployed API.

## 💾 Data Storage

This project uses an **in-memory JavaScript array** for task storage.

Because no database is connected, data is temporary and can reset when the server instance restarts or is redeployed.

This approach keeps the project simple and focused on demonstrating REST API development.

## 🎯 Project Purpose

TaskFlow API was created as a backend development project to demonstrate practical knowledge of:

* REST API design
* Express.js
* CRUD operations
* Middleware
* Validation
* HTTP status codes
* Error handling
* API testing
* Git and GitHub
* Cloud deployment with Vercel

## 👩‍💻 Author

**Areeba Mansoor**

GitHub:

https://github.com/areebamansoor49-eng
