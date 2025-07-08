# 🏡 Rent Home Service

A full-stack **Rent Home web application** where:

- 🧍 Guests can view homes, book them, and manage favorites  
- 🧑‍💼 Hosts can add, edit, or delete their home listings  
- 📦 Built using **Node.js**, **Express.js**, **EJS**, **MongoDB**, **Tailwind CSS**, and optionally run with **Docker**

---

## 🚀 Features

### 👤 Guest User
- View list of available homes
- Book a home
- Add/remove homes from favorites

### 🏠 Host (Owner)
- Add new home listings
- Edit or delete existing listings
- Manage bookings

---

## 🛠 Tech Stack

| Layer       | Technology                        |
|-------------|------------------------------------|
| **Frontend**| EJS, Tailwind CSS, JavaScript      |
| **Backend** | Node.js, Express.js                |
| **Database**| MongoDB                            |
| **Deployment** | Docker                          |

---

## 📦 Installation

### 🔧 Option 1: Manual (Local)

```bash
# Clone the repository
git clone https://github.com/Amit-Pancholi/hotel-management.git
cd hotel-management

# Install dependencies
npm install

# Run the app
node app.js
```

The app will start on:
```
http://localhost:3000
```

> You may configure the port in `app.js` or `.env`

### 🐳 Option 2: Docker

> Ensure you have Docker installed on your system.

```bash
# Build the Docker image
docker build -t rent-home-app .

# Run the container
docker run -p 3000:3000 rent-home-app
```

> Docker will expose the app at `http://localhost:3000`

---

## 📁 Project Structure

```
hotel-management/
├── controllers/        # Route and business logic
├── models/             # Mongoose data models
├── routes/             # Express routers
├── views/              # EJS templates
├── public/             # Tailwind + static assets
├── app.js              # Entry point
├── Dockerfile          # Docker config
├── package.json
└── README.md
```

---

## 🌱 Environment Variables

Create a `.env` file in the root with the following:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

---
## 👥 User Roles

| Role   | Abilities                             |
|--------|----------------------------------------|
| Guest  | View homes, book, manage favorites     |
| Host   | Add/edit/delete homes, manage bookings |



---

## 🧾 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome!

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a pull request

---

## 🙋 Author

- **Amit Pancholi**  
  [GitHub](https://github.com/Amit-Pancholi)

---

## 📌 Todo / Future Enhancements

- [ ] Implement booking history
- [ ] Add rating and review system
- [ ] Stripe or Razorpay integration for payments
- [ ] REST API version

---
