// app.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Parse URL-encoded bodies (for form data)
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (for CSS)
app.use(express.static('public'));

// Routes
app.get('/', (req,res)=>{
    res.render('index');
});;
app.get('/typing-test', (req,res)=>{
    res.render('typing-test');
});
app.get('/text', (req, res) => {
    // Generate a random number between 1 and 10 to pick a random text file
    const randomFileNumber = Math.floor(Math.random() * 10) + 1;
    const filePath = path.join(__dirname, `text${randomFileNumber}.txt`);

    // Read the content of the randomly selected text file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('An error occurred while reading the file');
        }

        // Send the file content as the response
        res.send(data);
    });
});
// Start the server
const PORT = 4001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
