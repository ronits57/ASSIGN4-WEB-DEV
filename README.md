# Secure Connect and Communication Platform

This is my **Web Development III – Lab 4** project. I built this project to practise backend development, user authentication, API security and real-time communication.

The application allows users to create an account, log in, manage their own notes and chat with other connected users. It also has an admin route to view registered users.

I have added screenshots of the actual Postman tests, chat page and server terminal so the working of the project can be checked easily.

## 1. What this project does

- Users can register and log in.
- Passwords are stored as bcrypt hashes instead of plain text.
- JWT is used to protect routes that require login.
- Normal users and admins have different permissions.
- Logged-in users can create, view, update and delete notes.
- Socket.IO is used for real-time chat.
- Users can join a chat room and exchange messages.
- EventEmitter is used to log important events such as registration, login, note creation and chat messages.

## 2. Technologies used

| Technology | How I used it |
|---|---|
| Node.js | Run the backend |
| Express.js | Create the API routes |
| MongoDB | Store users and notes |
| Mongoose | Work with MongoDB documents |
| bcrypt | Hash and check passwords |
| JSON Web Token (JWT) | Authenticate users |
| Socket.IO | Real-time chat |
| EventEmitter | Handle application events |
| dotenv | Read environment variables |
| Postman | Test the APIs |
| HTML, CSS and JavaScript | Chat page |

## 3. Project setup

### Requirements

Install these before running the project:

- Node.js and npm
- MongoDB running locally
- Postman (for API testing)

### Download the project and install packages

Open the project folder in VS Code and run:

```bash
npm install
```

### Add environment variables

Create a `.env` file in the root folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/secure_connect
JWT_SECRET=put_your_own_long_random_secret_here
NODE_ENV=development
```

Use your own secret for `JWT_SECRET`. Do not upload the real `.env` file or its secret to GitHub. Keep an `.env.example` file with placeholder values instead.

### Start the server

Run:

```bash
npm start
```

If the `start` script is not available in your `package.json`, you can run:

```bash
npx nodemon server.js
```

When everything starts correctly, the terminal should show that MongoDB is connected and the server is listening on port `5000`.

### Open the chat page

After starting the server, open:

```text
http://localhost:5000/chat.html
```

## 4. Main API endpoints

Base URL:

```text
http://localhost:5000
```

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a user | Not required |
| POST | `/api/auth/login` | Log in and receive a JWT | Not required |
| GET | `/api/notes` | Get the logged-in user's notes | Required |
| POST | `/api/notes` | Create a note | Required |
| PUT | `/api/notes/:id` | Update a note | Required |
| DELETE | `/api/notes/:id` | Delete a note | Required |
| GET | `/api/admin/users` | View registered users | Admin only |

For protected API requests, select **Bearer Token** in Postman's Authorization tab and paste the JWT received from login.

For the test without a token, select **No Auth** and remove the saved `localhost` token cookie from Postman as well. Otherwise, Postman may still send the cookie from an earlier login.

## 5. How I tested the project

I tested the main APIs using Postman. These are the important tests and their results.

### A. User registration and validation

I registered two test accounts: Ankit and Security Test. I also checked duplicate email, invalid email and short password cases.

The signup test with `"role": "admin"` was also checked. The response created the account with the `user` role, so a user cannot assign themselves the admin role through public signup.

![Server started](screenshots/01-server-start.png)

![Ankit registration](screenshots/02-user-registration-ankit.png)

![Security Test registration](screenshots/03-user-registration-security-test.png)

![Duplicate email validation](screenshots/04-duplicate-email-validation.png)

![Invalid email validation](screenshots/05-invalid-email-validation.png)

![Short password validation](screenshots/06-short-password-validation.png)

![Admin role protection during signup](screenshots/07-admin-role-protection-at-signup.png)

### B. Login and authentication

I tested login with the correct details and also tried an incorrect password. The incorrect password request returned `401 Unauthorized`.

![Incorrect password login](screenshots/08-login-invalid-password.png)

After a successful login, the API returns a JWT. I used that token in the Authorization tab to access protected routes. (The token itself is not included in this README.)

### C. Notes API

I first called the Notes API without a token. It returned `403 Forbidden` with the message `No token provided`.

After that, I used the JWT to create two notes, view them, update one note and delete the other one. The final GET request showed that only the remaining note was present.

![Notes request without token](screenshots/09-notes-unauthorized-request.png)

![Create first note](screenshots/10-create-first-note.png)

![Create second note](screenshots/11-create-second-note.png)

![Get notes](screenshots/12-view-notes.png)

![Update note](screenshots/13-update-note.png)

![Delete note](screenshots/14-delete-note.png)

![Verify note deletion](screenshots/15-verify-note-deletion.png)

### D. Admin access

I tested the admin endpoint with a normal user's token first. The API denied access with `403 Forbidden`.

For the admin test, I changed Ankit's role to `admin` in my local MongoDB database and logged in again to get a token containing the updated role. The admin endpoint then returned the registered users.

![Normal user denied from admin API](screenshots/16-admin-access-denied.png)

![Admin users list](screenshots/17-admin-users-list.png)

### E. Real-time chat using Socket.IO

I opened the chat page in two separate browser windows. I connected as Ankit in one window and Security Test in the other one. Both users joined the `general` room and exchanged messages.

The screenshots show the chat working in both browser windows. The JWT input has been hidden in these screenshots.

![Real-time chat in first browser](screenshots/18-realtime-chat.png)

![Real-time chat in second browser](screenshots/19-realtime-chat-second-window.png)

### F. EventEmitter logs

I checked the VS Code terminal while registering users, logging in, creating notes and sending chat messages. The terminal showed the related event logs.

![EventEmitter terminal logs](screenshots/20-event-emitter-terminal-logs.png)

## 6. What I learned

While making this project, I got practical experience with:

- Creating REST APIs using Express.
- Connecting Node.js with MongoDB.
- Registering users and checking passwords with bcrypt.
- Generating and verifying JWT tokens.
- Protecting routes with authentication middleware.
- Giving different permissions to users and admins.
- Performing create, read, update and delete operations.
- Using Socket.IO for real-time communication.
- Using EventEmitter to handle application events.
- Testing API responses and status codes in Postman.

## 7. Conclusion

This project helped me understand how authentication, authorization, database operations and real-time communication work together in a backend application.

I tested the main features using Postman and tested the chat using two different users in separate browser windows. The screenshots above show the important parts of the execution.

---

**Project:** Secure Connect and Communication Platform  
**Subject:** Web Development III  
**Assignment:** Lab 4  
**Student:** Ankit Kumar Pandey  
**University:** K.R. Mangalam University
