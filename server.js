const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8888; // Changed to 8888

// Serve static files from the src directory
app.use(express.static(path.join(__dirname, 'src')));

// Handle all routes by serving the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Open your browser and navigate to http://localhost:${PORT}`);
});