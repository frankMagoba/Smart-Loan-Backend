const express = require('express');
const app = new express();

app.post('/authenticate', (req, res) => {
    res.status(200).json({ "statusCode": 200, "message": "hello" });
});

app.listen(3000, () => {
    console.log('App running at 3000')
})