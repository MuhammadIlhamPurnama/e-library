# E-Library

Aplikasi perpustakaan digital sederhana dengan fitur katalog buku, favorit, upload buku (admin only), dan manajemen profil.

---

## 🚀 Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL (Sequelize ORM)
- JWT Authentication
- Multer (file upload)
- Cloudinary (image hosting)

### Frontend
- React.js
- React Router
- Tailwind CSS
- Axios
- SweetAlert2

---

## 📦 Cara Instalasi

### 1. Clone Repository
```bash
git clone <repository-url>
cd e-library
```

### 2. Setup Backend

```bash
cd backend
npm install
```

**Konfigurasi Environment Variables**

Buat file `.env` di folder `backend/` dengan isi:

```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/e_library
JWT_SECRET=your_jwt_secret_key_here

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Sesuaikan config postgres (didalam folder config/config.json)**

```js
"development": {
  "username": "postgres", //sesuaikan username
  "password": "postgres", //sesuaikan password
  "database": "e_library", //sesuaikan database name
  "host": "127.0.0.1",
  "dialect": "postgres"
}
```

**Migrasi Database**

```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

**Konfigurasi Base URL**

Pastikan file `frontend/src/libraries/http.js` menggunakan base URL backend:

```javascript
import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:3000' // sesuaikan dengan PORT backend
})

export default http
```

---

## ▶️ Cara Menjalankan

### Jalankan Backend

```bash
cd backend
npm run dev
# atau
node app.js
```

Server berjalan di `http://localhost:3000`

### Jalankan Frontend

```bash
cd frontend
npm run dev
# atau
npm start
```

Aplikasi berjalan di `http://localhost:5173` (Vite)

---

## 📖 Dokumentasi API

Base URL: `http://localhost:3000/api`

### Authentication

#### Register
```http
POST /register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully registered user",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "User",
    "updatedAt": "2025-11-08T00:51:54.596Z",
    "createdAt": "2025-11-08T00:51:54.596Z"
  }
}
```

#### Login
```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login success",
  "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Books

#### Get All Books (with pagination & search)
```http
GET /books?page=1&search=react
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully get books data",
  "data": {
    "books": [
      {
        "id": 1,
        "bookName": "React for Beginners",
        "description": "Learn React.js",
        "imageUrl": "https://cloudinary.com/...",
        "createdAt": "2025-11-07T15:16:28.795Z"
      }
    ],
    "pagination": {
      "totalItems": 21,
      "totalPages": 3,
      "currentPage": 1,
      "limit": 10
    }
  }
}
```

#### Get Book by ID
```http
GET /books/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully get book",
  "data": {
    "id": 1,
    "bookName": "React for Beginners",
    "description": "Learn React.js",
    "imageUrl": "https://cloudinary.com/...",
    "createdAt": "2025-11-07T15:16:28.795Z"
  }
}
```

#### Upload Book (Admin Only)
```http
POST /books
Authorization: Bearer <token>
Content-Type: multipart/form-data

bookName: "New Book"
description: "Book description"
imageUrl: [file]
```

**Response:**
```json
{
    "success": true,
    "message": "Successfully created book",
    "data": {
        "id": 27,
        "bookName": "Salt to the sea",
        "description": "Salt to the ... ",
        "imageUrl": "https://res.cloudinary.com/...",
        "updatedAt": "2025-11-08T07:18:09.390Z",
        "createdAt": "2025-11-08T07:18:09.390Z"
    }
}
```

---

### Favorites

#### Get User Favorites
```http
GET /favorites?page=1
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully get favorites",
  "data": {
    "favorites": [
      {
        "id": 1,
        "bookId": 12,
        "Book": {
          "id": 12,
          "bookName": "React for Beginners",
          "imageUrl": "https://..."
        }
      }
    ],
    "pagination": {
      "totalItems": 11,
      "totalPages": 2,
      "currentPage": 1,
      "limit": 10
    }
  }
}
```

#### Add to Favorites
```http
POST /favorites
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": 12
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully added to favorites",
  "data": null
}
```

#### Remove from Favorites
```http
DELETE /favorites/:bookId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully removed from favorites",
  "data": null
}
```

---

### Profile

#### Get User Profile
```http
GET /profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully get profile",
  "data": {
    "user": {
      "id": 2,
      "email": "user@example.com",
      "role": "User",
      "createdAt": "2025-11-07T14:27:13.835Z"
    },
    "favoriteCount": 11
  }
}
```

---

## Akun Demo

### Admin
- **Email:** `admin@gmail.com`
- **Password:** `Password123`
- **Akses:** Upload buku, lihat katalog, favorit, profil

---

## Fitur Utama

- Autentikasi (Register, Login, JWT)
- CRUD Books (Admin only)
- Katalog Buku (pagination + search)
- Favorit Buku (per user)
- Upload gambar (Cloudinary)
- Role-based access (Admin / User)
- Responsive UI (Tailwind CSS)

---
