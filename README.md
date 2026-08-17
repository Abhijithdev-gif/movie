# 🎬 Movie & TV Show Watchlist Application

A full-stack modern **Movie & TV Show Watchlist web application** built with a **Django REST Framework** backend and a **React (Vite)** frontend with Vanilla CSS styling.

![Watchlist Architecture](https://img.shields.io/badge/Stack-Django%20%7C%20React%20%7C%20SQLite%20%7C%20Vite-6366f1)

---

## 🌟 Key Features

1. **Watchlist Management**: Add, view, edit, and delete movies and TV shows.
2. **Watch Status & Tab Migration**: Instant seamless switching between **To Watch** (unwatched) and **Watched** tabs.
3. **Interactive 5-Star Rating System**: Rate completed titles with a custom star component that updates live in the Django database.
4. **Dashboard Analytics**: Statistics metrics including Total Items, To Watch count, Watched count, Average Rating, and Recently Watched activity.
5. **Search & Filters**: Real-time filtering by category (All, Movies, TV Shows) and title search.
6. **Authentication & User Isolation**: Built-in Django session authentication ensuring each user sees only their own watchlist.
7. **Responsive Glassmorphism UI**: High-definition obsidian theme designed for Desktop, Tablet, and Mobile screens.

---

## 📁 Project Folder Structure

```text
movielist/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── db.sqlite3
│   │
│   ├── config/
│   │   ├── settings.py          # CORS, DRF, & Auth configuration
│   │   ├── urls.py              # Main URL routing
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   └── watchlist/
│       ├── models.py            # Media model (Title, Type, Status, Rating, Owner)
│       ├── serializers.py       # DRF validation & user serializers
│       ├── views.py             # ViewSets, Stats & Auth API views
│       ├── urls.py              # API routes (/api/media/, /api/stats/, /api/auth/)
│       ├── admin.py             # Admin panel registration
│       ├── tests.py             # Django automated test suite
│       └── migrations/
│
├── frontend/
│   ├── package.json             # React, Vite, Axios, Lucide-react
│   ├── vite.config.js          # Proxy config to http://127.0.0.1:8000
│   ├── index.html
│   │
│   └── src/
│       ├── main.jsx             # React entry point
│       ├── App.jsx              # Main App layout & Auth provider
│       ├── App.css              # Obsidian Glassmorphism Design System
│       │
│       ├── components/
│       │   ├── Sidebar.jsx      # Navigation & Mobile collapsible drawer
│       │   ├── Header.jsx       # Header bar & Action triggers
│       │   ├── WatchlistTabs.jsx# To Watch / Watched tab switcher
│       │   ├── MovieCard.jsx    # Media card with poster fallback & controls
│       │   ├── StarRating.jsx   # 5-star interactive rating component
│       │   ├── AddMovieModal.jsx# New item creation modal
│       │   ├── EditMovieModal.jsx# Item edit modal
│       │   ├── SearchBar.jsx    # Search input & filter chips
│       │   ├── EmptyState.jsx   # Empty state graphic placeholders
│       │   └── ConfirmDialog.jsx# Delete confirmation modal
│       │
│       ├── pages/
│       │   ├── Dashboard.jsx    # Stats summary & recent activity feed
│       │   ├── Watchlist.jsx    # Main Watchlist manager page
│       │   └── Login.jsx        # Authentication (Login / Register) page
│       │
│       └── services/
│           └── api.js           # Axios REST API service layer
│
└── README.md
```

---

## 🚀 Setup & Installation

### 1. Backend Setup (Django)

1. Open terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows PowerShell / Command Prompt:
   .\venv\Scripts\activate
   ```

3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Run database migrations:
   ```bash
   python manage.py migrate
   ```

5. Create an admin superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

6. Run the Django development server:
   ```bash
   python manage.py runserver
   ```
   The backend will start at `http://127.0.0.1:8000/`.

---

### 2. Frontend Setup (React + Vite)

1. Open a second terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will run at `http://localhost:5173/`.

---

## ⚡ Quick Demo Access

When launching the application on `http://localhost:5173/`:
- Click the **"✨ Quick Demo Account Login"** button on the Login page to instantly authenticate with a test account.
- Alternatively, register a new account to experience isolated watchlists.

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/media/` | List all user media (supports `?status=`, `?type=`, `?search=`) |
| `POST` | `/api/media/` | Create a new movie/show |
| `GET` | `/api/media/<id>/` | Retrieve specific media item |
| `PUT / PATCH` | `/api/media/<id>/` | Update media item or star rating |
| `DELETE` | `/api/media/<id>/` | Delete media item |
| `GET` | `/api/stats/` | Fetch dashboard statistics summary |
| `POST` | `/api/auth/register/` | Register new user |
| `POST` | `/api/auth/login/` | Log in user |
| `POST` | `/api/auth/logout/` | Log out user |
| `GET` | `/api/auth/me/` | Check active session |

---

## 🧪 Running Automated Tests

To run the backend Django test suite:
```bash
cd backend
.\venv\Scripts\python.exe manage.py test watchlist
```

To build the React production bundle:
```bash
cd frontend
npm run build
```
