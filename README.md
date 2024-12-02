# Student Management System (EduTrack)

The **Student Management System (SMS)** is a comprehensive web-based platform designed to help educational institutions efficiently manage student data, courses, teachers, attendance, fees, grades, and more. This system simplifies academic operations while ensuring secure and streamlined access to critical information.

## Features

- **Student Information Management**: Manage student records, including personal details, enrollment status, and academic history.
- **Subject & Class Management**: Handle course catalogs, create class schedules, and enable course registration.
- **Attendance Tracking**: Monitor student attendance, update attendance statuses, and generate detailed attendance reports.
- **Fee Management**: Process student payments, manage fees, and generate receipts.
- **User Authentication & Roles**: Secure authentication with role-based access (Admin, Teacher, Student).
- **Notifications & Announcements**: Send updates about events, assignments, and announcements.
- **Reporting & Analytics**: Create reports on academic performance, attendance, fee payments, and registrations.
- **Mobile & Web Access**: Use the system on both web and mobile platforms for real-time data access.
- **API Integration**: Integrate with external learning platforms, payment gateways, and more using RESTful APIs.

## Technologies Used

### Backend Technologies and Dependencies

#### Dependencies:

- **bcryptjs**: ^2.4.3  
  Password hashing library for Node.js.
- **body-parser**: ^1.20.3  
  Middleware for parsing request bodies.
- **cors**: ^2.8.5  
  Middleware to enable Cross-Origin Resource Sharing.
- **dayjs**: ^1.11.13  
  Lightweight date utility library.
- **dotenv**: ^16.4.5  
  Module for loading environment variables from `.env`.
- **express**: ^4.21.0  
  Web application framework for Node.js.
- **express-session**: ^1.18.0  
  Middleware for managing session data.
- **jest**: ^29.7.0  
  JavaScript testing framework.
- **jsonwebtoken**: ^9.0.2  
  Token-based authentication library.
- **mysql2**: ^3.11.3  
  Node.js client for MySQL databases.
- **sequelize**: ^6.37.4  
  ORM for relational databases.
- **uuid**: ^10.0.0  
  Generate unique identifiers.
- **validator**: ^13.12.0  
  Library for validating and sanitizing strings.

#### DevDependencies:

- **@babel/core**: ^7.26.0  
  Babel compiler core library.
- **@babel/preset-env**: ^7.26.0  
  Babel preset for modern JavaScript.
- **babel-jest**: ^29.7.0  
  Jest plugin for Babel compatibility.
- **nodemon**: ^3.1.7  
  Utility for automatically restarting Node.js server during development.

### Frontend Technologies and Dependencies

#### Dependencies:

- **@emotion/react**: ^11.13.3  
  Library for writing CSS styles with JavaScript.
- **@emotion/styled**: ^11.13.0  
  Styled components for Emotion.
- **@mui/icons-material**: ^6.1.4  
  Material-UI icon library.
- **@mui/material**: ^6.1.4  
  Material-UI components library.
- **@mui/x-charts**: ^7.21.0  
  Charting components for Material-UI.
- **@mui/x-data-grid**: ^7.21.0  
  Data grid components for Material-UI.
- **@mui/x-date-pickers**: ^7.22.2  
  Date pickers for Material-UI.
- **@mui/x-tree-view**: ^7.21.0  
  Tree view components for Material-UI.
- **axios**: ^1.7.7  
  Promise-based HTTP client for the browser and Node.js.
- **dayjs**: ^1.11.13  
  Lightweight date utility library.
- **react**: ^18.3.1  
  JavaScript library for building user interfaces.
- **react-dom**: ^18.3.1  
  React package for working with the DOM.
- **react-router-dom**: ^6.27.0  
  Routing library for React.

#### DevDependencies:

- **@eslint/js**: ^9.11.1  
  ESLint configuration package.
- **@types/react**: ^18.3.10  
  TypeScript type definitions for React.
- **@types/react-dom**: ^18.3.0  
  TypeScript type definitions for React DOM.
- **@vitejs/plugin-react**: ^4.3.2  
  Vite plugin for React.
- **eslint**: ^9.11.1  
  Linter for JavaScript and TypeScript.
- **eslint-plugin-react**: ^7.37.0  
  ESLint plugin for React.
- **eslint-plugin-react-hooks**: ^5.1.0-rc.0  
  ESLint plugin for React hooks.
- **eslint-plugin-react-refresh**: ^0.4.12  
  ESLint plugin for React Refresh.
- **globals**: ^15.9.0  
  List of global variables for ESLint.
- **vite**: ^5.4.8  
  Next-generation front-end tool for building web applications.

## Getting Started

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/azimy-hamid/miniProjectThree
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   Create a .env file in the root directory.

   Add the following environment variables:

   ```plaintext
   DB_HOST=localhost
   DB_NAME=any_db_name
   DB_USER=root
   DB_PASS=your_mysql_password
   DB_DIALECT=mysql
   PORT_NUMBER=3000

   JWT_SECRET=you_can_create_a_password_online_and_use_that

   SUPER_USER_EMAIL=anyemail@exemple.com
   SUPER_USER_USERNAME=any.username
   SUPER_USER_PASSWORD=password_should_have_a_capital_letter_a_number_and_a_special_char_and_be_longer_than_6

   ADMIN_USER_EMAIL=anyemail@exemple.com
   ADMIN_USER_USERNAME=any.username
   ADMIN_USER_PASSWORD=password_should_have_a_capital_letter_a_number_and_a_special_char_and_be_longer_than_6
   ADMIN_USER_FIRST_NAME=First Name
   ADMIN_USER_LAST_NAME=Last Name
   ```

4. Create the database:

   Open MySQL Workbench.
   Create a database with the name same name as the db name you have in the backend .env.
   Note: Once you run npm start tables and data will directly be injected into the db you created.

5. Start the backend server:

```bash
npm start
```

By default, the server runs on `http://localhost:4000`.

### Frontend Setup

1. Navigate to the `frontend` folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   Create a .env or similar configuration file.
   Add the following variable:

   ```plaintext
   Copy code
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   By default, the frontend runs on `http://localhost:5173`.

## How to Contribute

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature-name
   ```

3. Make your changes and commit them:

   ```bash
   git commit -m "Add feature"
   ```

4. Push to the branch:

   ```bash
   git push origin feature-name
   ```

5. Open a Pull Request.
