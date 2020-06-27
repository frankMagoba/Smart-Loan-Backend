const express = require('express');
const app = new express();

const auth = () => {
    return (req, res, next) => {
        next()
    }
}

app.post('/authenticate', (req, res) => {
    res.status(200).json({ "statusCode": 200, "message": "hello" });
});

app.listen(3000, () => {
    console.log('App running at 3000')
})