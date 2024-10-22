const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// Multer setup for file upload
const upload = multer({ dest: 'uploads/' });

// PDF to HTML conversion route
// PDF to HTML conversion route
app.post('/convert', upload.single('pdf'), (req, res) => {
    const filePath = req.file.path;
    const outputHtml = `${filePath}.html`;

    // Use pdf2htmlEX to convert PDF to HTML
    exec(`pdf2htmlEX ${filePath} ${outputHtml}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error converting PDF: ${error.message}`);
            console.error(`stderr: ${stderr}`); // Log the standard error output
            return res.status(500).json({ message: 'Conversion failed' });
        }

        // Read the generated HTML file and send it back to the client
        fs.readFile(outputHtml, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading HTML file: ${err}`);
                return res.status(500).json({ message: 'Failed to read HTML' });
            }

            // Clean up files after reading
            fs.unlinkSync(filePath); // Delete PDF
            fs.unlinkSync(outputHtml); // Delete HTML

            res.json({ html: data });
        });
    });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
app.use(cors({
    origin: 'http://localhost:3000', // replace with your frontend URL
    methods: ['GET', 'POST'], // allow only these methods
  }));
  