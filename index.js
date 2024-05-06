// Import necessary Node.js modules
const express = require('express'); // Import Express framework for creating the server ( importing Express package, which helps us build web applications in Node.js)
const bodyParser = require('body-parser'); // Import body-parser to parse incoming request bodies (imports a middleware package body-parser, which helps us parse data from incoming requests)
const crypto = require('crypto-js'); // Import crypto-js for encryption functionalities (importing crypto-js package, which provides cryptographic functions that we'll use to encrypt sensitive data)
const { Pool } = require('pg'); // Import Pool from pg module to manage PostgreSQL connections (importing a part of a package pg, which helps us connect to and interact with a PostgreSQL database)
require('dotenv').config(); // Load environment variables from a .env file into process.env (loads environment variables from a file called .env, which allows us to keep sensitive information like database credentials and encryption keys secure)

// Setup the server using Express
const app = express(); // Create an Express application (creating an instance of the Express application, which we'll use to define our routes and start the server)
const port = process.env.PORT || 3000; // Define the port to run the server on, defaulting to 3000 if not specified in the environment 

// Setup PostgreSQL connection pool (creating a pool of database connections using the credentials stored in the DATABASE_URL environment variable)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL // Set up the pool using DATABASE_URL from the environment variables
});

// Middlewares for parsing request bodies ( middleware to parse incoming request bodies as JSON or URL-encoded data, and to serve static files from a directory named 'public')
app.use(bodyParser.json()); // Use body-parser to parse JSON-formatted request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Use body-parser to parse URL-encoded request bodies
app.use(express.static('public')); // Serve static files located in the 'public' directory

//defining a function called isValidCardNumber to validate credit card numbers using the Luhn Algorithm, and a route handler to handle POST requests to '/submit-card'
// Helper function to validate credit card numbers 
function isValidCardNumber(number) { // Function to check if a credit card number is valid using the Luhn Algorithm
    return number.split('').reverse().reduce((sum, digit, index) => {
        digit = parseInt(digit, 10); // Convert each character to integer
        if (index % 2 === 1) digit *= 2; // Double every second digit
        if (digit > 9) digit -= 9; // Subtract 9 from numbers over 9
        return sum + digit; // Add digit to sum
    }, 0) % 10 === 0; // Check if the total modulo 10 is zero
}

// Route to handle POST requests to '/submit-card'
///a "route handler to handle POST requests to '/submit-card'" means you're setting up a specific function or piece of code that will be executed when your server receives a POST request to the '/submit-card' URL endpoint
app.post('/submit-card', async (req, res) => {
    const { cardNumber, cvv, cardHolderName, expirationDate } = req.body; // Extract data from request body ( extracting data from the request body sent by the client, including the credit card number, CVV, cardholder's name, and expiration date)

    // Validate the card number
    //checking if the credit card number is valid using the isValidCardNumber function.
    //If it's not valid, we're sending a response to the client with a 400 status code and an error message
    if (!isValidCardNumber(cardNumber)) {
        return res.status(400).json({ message: "Invalid card number." }); // Send a 400 response if the card number is invalid
    }

    // Encrypt the card number and CVV
    //encrypting the credit card number and CVV using the AES encryption algorithm and a secret key stored in the SECRET_KEY environment variable
    const encryptedCardNumber = crypto.AES.encrypt(cardNumber, process.env.SECRET_KEY).toString(); // Encrypt card number
    const encryptedCvv = crypto.AES.encrypt(cvv, process.env.SECRET_KEY).toString(); // Encrypt CVV

    // Try inserting the card data into the database
    //constructing an SQL query to insert the encrypted credit card data into a table called 'credit_cards' in the database,
    //and executing the query using the database connection pool
    try {
        const query = 'INSERT INTO credit_cards (card_number, cvv, card_holder_name, expiration_date) VALUES ($1, $2, $3, $4)'; // SQL query
        const params = [encryptedCardNumber, encryptedCvv, cardHolderName, expirationDate]; // Parameters for the SQL query
        await pool.query(query, params); // Execute the query
        res.json({ message: "Card data submitted successfully!" }); // If the insertion is successful, send a response to the client with a JSON object containing a success message
    } catch (error) {
        console.error('Database error:', error); // Log errors to the console
        res.status(500).json({ message: "Failed to submit card data" }); // If an error occurs during the database operation, we're logging the error to the console and send a response to the client with a 500 status code and an error message
    }
});

// Start the server
//starting the server and listening for incoming requests on the specified port.
//When the server starts, we log a message to the console indicating its address and port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`); // Log the server's address and port
});
