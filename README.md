# TMO – Task Matrix Organizer

**TMO (Task Matrix Organizer)** is a web-based **task management** system designed to help students and professionals organize their tasks efficiently, according to their own logic and priorities. Built as a full-stack individual project for the Web Development module at **Inteli – Instituto de Tecnologia e Liderança**, incorporating both UX design and programming, this application emphasizes **productivity, customization, and intuitive UX.**

---

## Project Objective

The main goal of **TMO** is to provide a smart and flexible environment for managing personal tasks, helping users categorize, prioritize, and track their to-dos in a way that suits their workflow — whether that’s by urgency, due date, status, or custom tags.

---
<!-- 
## Tech Stack

- **Frontend**: 
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **Authentication**: 
- **API Architecture**: 

--- -->

## Core Features

- User registration and login
- Create, read, update, and delete (CRUD) tasks
- Organize tasks by:
  - Priority
  - Due date
  - Status (e.g., To Do, In Progress, Done)
  - Custom tags
- Filter and sort task lists
- Responsive design for desktop and mobile devices
- Visual feedback to enhance usability without tutorials

---

## Target Users

The primary users of **TMO** are individuals who are reasonably comfortable with technology and seek a more customizable, flexible setup for task organization. A key example is a **university student** with a demanding academic schedule, who needs a clean, efficient tool to manage tasks across multiple contexts — from classes and labs to personal projects.

---

## Project Structure

```
TMO/
│
├── config/                # Configuration files (e.g., database connection)
│  └── db.js
├── controllers/           # Request handling logic (controllers)
│  └── userController.js
├── models/                # Data model definitions (database structure)
│  └── userModel.js
├── routes/                # System route definitions
│  ├── frontRoutes.js
│  └── userRoutes.js
├── services/              # Auxiliary system services
│  └── userService.js
├── assets/                # Public files such as images and fonts
├── scripts/               # Public JavaScript files
├── views/                 # Public CSS files (Note: "views" usually refers to templates — see note below)
├── tests/                 # Unit test files
│  └── example.test.js
├── .gitignore             # Git ignore file
├── .env                   # Environment variables file (example)
├── jest.config.js         # Jest configuration file
├── package-lock.json      # Node.js dependency lock file
├── package.json           # Node.js dependency manager configuration
├── readme.md              # Project documentation (Markdown)
├── server.js              # Main file that starts the server
└── rest.http              # Endpoint testing file (optional)
```

---

## How to Run Locally

1. Clone this repository:
git clone https://github.com/m4ichel/TMO

2. Install backend dependencies:
cd backend
npm install

3. Install frontend dependencies:
cd ../frontend
npm install

4. Set up your `.env` files for both backend and frontend.

5. Run the development servers:
- Backend (development): `npm run dev` (on port 3000)
- Backend (production): `npm start` (on port 3000)
- Frontend: `npm run dev` 

---

## 🙏 Acknowledgments

I would like to thank everyone who supported me throughout the development of **TMO** — especially my instructors, colleagues at **Inteli**, and friends who helped test and give feedback during the process. Your insights and encouragement made this project possible.

Special thanks to:

- [Kizzy Terra](https://www.linkedin.com/in/kizzyterra/) – for backend debugging help
- [Bruna Mayer](https://bumayer.myportfolio.com/sobre) – for UI feedback and testing
- [Inteli (Institute of Technology and Leadership)](https://www.inteli.edu.br/en/) – for providing the structure, guidance, and environment that made this project possible

---

## Author

Developed by Lucas Michel  
Student at **Inteli – Institute of Technology and Leadership**  
[GitHub](https://github.com/m4ichel) | [LinkedIn](https://www.linkedin.com/in/lucas-michel-pereira-1a338734b/)

---