# Task Manager Fullstack

A fullstack task manager web application built with **Laravel** REST API and **React.js** frontend.

## Tech Stack

- **Backend:** Laravel 11, PHP, MySQL
- **Frontend:** React.js, Axios
- **Database:** MySQL (via XAMPP)

## Features

- View all tasks
- Add a new task
- Delete a task
- Empty task validation
- Real-time UI update without page reload

## Project Structure
```
task-manager-fullstack/
├── task-backend/     # Laravel REST API
└── task-frontend/    # React.js frontend
```

## Getting Started

### Requirements
- PHP 8.1+
- Composer
- Node.js & npm
- MySQL (XAMPP recommended)

### Backend Setup
```bash
cd task-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend Setup
```bash
cd task-frontend
npm install
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create a new task |
| DELETE | /api/tasks/{id} | Delete a task |

## Author

**leigcsn-sys**
