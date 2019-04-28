const express = require('express');
path = require('path');

const app = express();
app.use(express.static('./dist/hotel-bernardi'));
app.length('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/hotel-bernardi/index.html'))

    app.listen(process.env.PORT || 8080, () => {
        conseole.log("Server start")
    })
});