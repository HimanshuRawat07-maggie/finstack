const express = require('express');
const path = require('path');

const app = express();
app.use(express.static('.'));  // Serve static assets
app.use((req, res, next) => {
    res.sendFile("/var/app/spont-software-ui/index.html");
});
// Start the server
app.listen(8081, () => console.log('Spont Software web portal on port 8081'));
