// app.js
const express = require('express');
const bodyParser = require('body-parser');

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
});;

// Start the server
const PORT = 4001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
