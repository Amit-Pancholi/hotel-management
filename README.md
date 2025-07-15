
# 🏡 Rent Home Service

A full-stack **Rent Home web application** to enable users to **list, book, and manage homes easily**.

---

## 🚀 Features

### 👤 Guest Users
- View and explore homes
- Book homes with dynamic total calculation
- Favorite/unfavorite homes
- Manage and cancel bookings
- Profile management with image upload & live preview

### 🧑‍💼 Host Users
- Add, update, or delete home listings
- View bookings on listed homes
- Edit personal profile

---

## 🛠 Tech Stack

| Layer         | Technology                                   |
|---------------|-----------------------------------------------|
| **Frontend**  | EJS, Tailwind CSS, JavaScript                |
| **Backend**   | Node.js, Express.js                          |
| **Database**  | MongoDB with Mongoose                        |
| **Media**     | Cloudinary for image hosting                 |
| **Deployment**| Railway (Production), Docker (Optional)      |

---

## 📦 Setup Instructions

### ✅ Prerequisites
- Node.js
- MongoDB or Atlas URI
- Cloudinary account (for image storage)

### 🧪 Installation

```bash
# Clone the repository
git clone https://github.com/Amit-Pancholi/hotel-management.git
cd hotel-management

# Install dependencies
npm install

# Run the server
npm start
```

Visit: [http://localhost:3000](http://localhost:3000)

### 🔐 Environment Variables (`.env`)

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🗂️ Project Structure

```
├── app.js
├── models/
├── views/
├── routes/
├── controllers/
├── utils/
├── public/
├── .env
└── README.md
```

---

## 📌 User Roles

| Role  | Access |
|-------|--------|
| Guest | Book homes, manage profile, favorite listings |
| Host  | Add homes, manage hosted bookings, edit listings |

---

## 🎯 Future Improvements

- Online payments (Razorpay/Stripe)
- Review & rating system
- Admin panel with analytics
- Search/filter by location, price, etc.

---

## 🤝 Contributing

1. Fork the repo  
2. Create a feature branch  
3. Commit your changes  
4. Submit a PR  

---

## 👨‍💻 Author

- Amit Kumar Pancholi  
- [GitHub](https://github.com/Amit-Pancholi)  
- Email: amitjipancholi@gmail.com  

---

## 🧾 License

This project is licensed under the [MIT License](LICENSE).
