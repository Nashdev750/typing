const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;
app.use(express.json())
// Define a GET endpoint that returns random text file content
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

// Start the server on port 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
