# QueueLess — Virtual Queue Management System

**QueueLess** is a web-based Virtual Queue Management System designed for university services. It allows students to join queues online, receive a token, track their queue position, and estimate their waiting time without standing in long physical lines.

The project is being developed as a university semester project using Node.js, Express.js, EJS, and MySQL.

## 📌 Problem Statement

University offices such as Student Affairs, the Fee Office, Admissions, and the Examination Office often have long queues. Students may need to wait for a long time without knowing how many people are ahead of them or when their turn will arrive.

QueueLess aims to reduce unnecessary waiting by allowing students and staff to manage queues through a centralized web application.

## 🎯 Project Objectives

- Allow students to join service queues online.
- Generate a unique token for each queue entry.
- Display the current serving token and the student's queue position.
- Estimate waiting time based on the number of people ahead.
- Allow staff to call the next token and manage service requests.
- Provide administrators with tools to manage services, counters, and users.
- Maintain queue history for monitoring and reporting.

## ✨ Planned Features

### Student Module
- Register and log in securely.
- View available university services.
- Join a queue and receive a token.
- Track queue position and estimated waiting time.
- View the current serving token.
- Cancel a queue entry when permitted.
- View previous queue activity.

### Staff Module
- View assigned services and queues.
- Call the next waiting token.
- Mark a token as serving or completed.
- Skip a token when necessary.
- Pause or resume queue operations where authorized.
- View queue activity.

### Admin Module
- Manage students and staff accounts.
- Create and manage university services.
- Manage service counters and staff assignments.
- Monitor active queues.
- View queue history and basic statistics.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Custom styling |
| Bootstrap | Responsive user interface |
| JavaScript | Client-side interactions |
| EJS | Dynamic server-rendered pages |
| Node.js | JavaScript runtime |
| Express.js | Web server and routing |
| MySQL | Relational database |
| mysql2 | Node.js–MySQL connection |
| Git and GitHub | Version control and collaboration |

## 📁 Project Structure

```text
QueueLess/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── studentController.js
│   ├── staffController.js
│   └── adminController.js
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── models/
│   ├── User.js
│   ├── Service.js
│   ├── Counter.js
│   └── QueueToken.js
├── routes/
│   ├── authRoutes.js
│   ├── studentRoutes.js
│   ├── staffRoutes.js
│   └── adminRoutes.js
├── services/
│   └── queueService.js
├── views/
│   ├── layouts/
│   │   └── main.ejs
│   ├── partials/
│   │   ├── navbar.ejs
│   │   ├── footer.ejs
│   │   └── messages.ejs
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── student/
│   ├── staff/
│   ├── admin/
│   ├── errors/
│   └── home.ejs
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   └── queue-status.js
│   └── images/
├── database/
│   └── schema.sql
├── docs/
│   ├── proposal.md
│   └── diagrams/
├── tests/
├── .env.example
├── .gitignore
├── app.js
├── server.js
├── package.json
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- [Git](https://git-scm.com/)
- A code editor such as Visual Studio Code

### 1. Clone the Repository

```bash
git clone https://github.com/ShaheerAhmedSiddiqui/QueueLess.git
cd QueueLess
```

### 2. Install Dependencies

```bash
npm install
```

The required dependencies will be added to `package.json` as development progresses. Typical dependencies include:

```bash
npm install express ejs mysql2 dotenv bcrypt express-session
```

### 3. Create the Database

Open MySQL Workbench or your MySQL client and execute:

```sql
CREATE DATABASE queueless_db;
```

Import `database/schema.sql` once the database schema has been created.

### 4. Configure Environment Variables

Create a `.env` file in the project root using `.env.example` as a template.

Example configuration:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=queueless_db
SESSION_SECRET=replace_with_a_long_random_secret
```

Update the values to match your local MySQL configuration. Never commit your actual `.env` file or credentials to GitHub.

### 5. Start the Application

Once `app.js`, `server.js`, and the required configuration files have been implemented, start the development server using the script configured in `package.json`, for example:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

**Note:** The setup instructions describe the intended development workflow. The application will run once the corresponding files, dependencies, and database schema are implemented.

## 🔄 How QueueLess Will Work

1. A student registers or logs in.
2. The student selects a university service.
3. The system creates a queue entry and assigns a token.
4. The student checks their position and estimated waiting time.
5. Staff call tokens and process students in the queue.
6. The system updates token statuses as service progresses.
7. Queue records are retained for history and reporting.

### Queue Token Statuses

- `WAITING` — The student is waiting.
- `CALLED` — The student's token has been called.
- `SERVING` — The service is in progress.
- `COMPLETED` — The service has finished.
- `SKIPPED` — The token was skipped by authorized staff.
- `CANCELLED` — The queue entry was cancelled.

## 🔐 Security Considerations

- Hash passwords before storing them.
- Validate and sanitize user input.
- Protect restricted pages with authentication middleware.
- Enforce role-based access for students, staff, and administrators.
- Keep database credentials and session secrets in environment variables.
- Use parameterized SQL queries to reduce SQL injection risks.
- Apply appropriate session and cookie security settings.

## 🧪 Testing

Testing will cover:

- User registration and login.
- Role-based access control.
- Queue token creation and cancellation.
- Queue position and waiting-time calculations.
- Calling, skipping, and completing tokens.
- Database operations and error handling.
- Validation and unauthorized access attempts.

## 🚀 Future Enhancements

Potential future improvements include:

- Real-time updates using WebSockets.
- Email or SMS notifications.
- QR-code-based check-in.
- Improved waiting-time prediction.
- Support for multiple campuses or branches.
- Advanced analytics and reporting.

These enhancements are optional and will be considered after the core system is working.

## 👥 Team

This project is being developed by a two-member student team as part of a university semester project.

Team members and responsibilities can be added here.

## 📚 Project Status

**Status:** In Development

QueueLess is currently in the planning and initial development stage. Features will be implemented and documented as the project progresses.

## 📄 License

A license can be added after checking the university's project requirements. If the project is intended for open-source distribution, the MIT License is one possible option.

---

**QueueLess — Less Waiting, Better Service.**
