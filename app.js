// app.js
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const app = express();

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.use(helmet());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
  });
app.use(express.json())  
app.use(limiter);

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

app.get('/sitemap.xml', async (req, res, next) => {
    try {
      // Define static URLs to include in the sitemap
      const links = [
        { url: '/', changefreq: 'monthly', priority: 1.0 },
        { url: '/typing-test', changefreq: 'monthly', priority: 0.8 }
      ];
  
      // Create a stream for the sitemap
      const stream = new SitemapStream({ hostname: 'https://typingsprint.com' });
  
      // Convert the stream into a promise and send the sitemap XML as a response
      const xml = await streamToPromise(Readable.from(links).pipe(stream)).then(data => data.toString());
  
      // Send the sitemap
      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (err) {
      next(err);
    }
  });






const CREDENTIALS_PATH = path.join(__dirname, 'auth.json');

// Define the scope for accessing Google Sheets
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Authenticate using the Service Account credentials
function authenticate() {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: SCOPES,
    });

    return auth;
}



app.post('/row',async (req, res)=>{
  try {
    const auth = authenticate();
    const sheets = google.sheets({ version: 'v4', auth });

    // Specify the ID of your Google Sheet
    const spreadsheetId = '1EH1NRipRG3QYSqdQcfsqXz81P506QZb-RqqtxY8nPb0';  // Replace with your actual spreadsheet ID
    const range = 'RoutePlan';  // Adjust the range accordingly

    // Define the new row values
    const values = [req.body.row];
    // Define the request body for appending the row
    const resource = {
        values,
    };

    sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource,
    });
    res.send({success:true})
} catch (err) {
    console.error('Error adding row:', err.message);
    res.status(500).send({error:err.message})
}
})
// Start the server
const PORT = 4001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
