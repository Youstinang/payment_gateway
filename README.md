
# Payment Gateway Project

## Overview
This project implements a secure payment gateway that captures and processes credit card information. It's built using Node.js, Express, and PostgreSQL, and includes front-end implementation with HTML, CSS, and JavaScript for AJAX requests.

## Prerequisites
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine. 
- **npm**: A package manager for JavaScript, included with Node.js. 
- **PostgreSQL**: An open source relational database.
- **Text Editor**: Such as Visual Studio Code, Sublime Text, etc.

## Detailed Project Setup

### Step 1: Project Initialization
Create a new directory for your project and initialize it using npm to create a `package.json` file that will manage project dependencies.

```bash
mkdir payment_gateway
cd payment_gateway
npm init -y
```

### Step 2: Dependency Installation
Install necessary Node.js modules that will be used throughout the project.

```bash
npm install express pg body-parser crypto-js dotenv
```
- `express`: Framework for creating routing of our application.
- `pg`: PostgreSQL client for Node.js, used to interact with your PostgreSQL database.
- `body-parser`: Parse incoming request bodies before your handlers, available under `req.body`.
- `crypto-js`: Used for securing data through encryption.
- `dotenv`: Loads environment variables from a `.env` file into `process.env`.

### Step 3: Database Configuration
Set up a PostgreSQL database to store encrypted credit card information securely.

1. **Create Database**: Launch PostgreSQL command line utility and create a new database.
   ```sql
   CREATE DATABASE payment_gateway;
   ```
2. **Create Table**: Define a structure to store credit card data.
   ```sql
   \c payment_gateway
   CREATE TABLE credit_cards (
       id SERIAL PRIMARY KEY,
       card_number TEXT NOT NULL,
       cvv TEXT NOT NULL,
       card_holder_name TEXT NOT NULL,
       expiration_date TEXT NOT NULL
   );
   ```

### Step 4: Environment Setup
Configure environment variables to securely store database credentials and encryption keys.

1. **Create `.env` File**: In the root of your project directory.
   ```plaintext
   DATABASE_URL=postgresql://username:password@localhost:5432/payment_gateway
   SECRET_KEY=your_secret_key_here
   ```

### Step 5: Server Implementation (`index.js`)
Implement the server logic in `index.js`, setting up endpoints and integrating middleware.

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto-js');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

function isValidCardNumber(number) {
    // Implement Luhn Algorithm to validate the card number
}

app.post('/submit-card', async (req, res) => {
    // Extract card details from request body
    // Validate card number
    // Encrypt card details
    // Save encrypted data to the database
    // Send response to client
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
```

### Step 6: Front-End Setup (`public/index.html`)
Design the HTML form and handle form submission using AJAX to interact with the server without reloading the page.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Payment Form</title>
    <!-- Styling for the form -->
</head>
<body>
    <div class="container">
        <h1>Payment Form</h1>
        <form id="paymentForm">
            <!-- Input fields for credit card details -->
            <button type="submit">Submit</button>
        </form>
    </div>
    <!-- JavaScript for AJAX request -->
</body>
</html>
```

## Running the Project
To launch the project, navigate to the project directory in your command line interface and run:

```bash
node index.js
```

Access the payment form by navigating to `http://localhost:3000` in your web browser 
![1](https://github.com/Youstinang/payment_gateway/assets/162867385/82df44d5-a6d1-4b3d-aa7d-caa717f2ded5)

OR check it in postman :

![image](https://github.com/Youstinang/payment_gateway/assets/162867385/29a1cc48-2161-443b-9c47-b94fc00612a3)

Database Saving Test: 
![2](https://github.com/Youstinang/payment_gateway/assets/162867385/7a0bd999-b8b1-4d96-87e2-18240d935d34)
