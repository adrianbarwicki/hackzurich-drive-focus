const express = require('express');
const multer  = require('multer');
const cors = require('cors')
const bodyParser = require('body-parser');
const request = require("request");
const upload  = multer();
const app = express();
 
app.use(bodyParser.json());

app.use(cors());

// in-memory stack (push/pop) database for simplicity
const RESULTS = [];

if (!process.env.MCS_HACKZURICH_API_KEY) {
    throw new Error('Specify MCS Api Key!');
}

const MCS_HACKZURICH_API_KEY = process.env.MCS_HACKZURICH_API_KEY;

app.get('/driver/behaviour', (req, res) => {
    const result = RESULTS[RESULTS.length - 1];

    if (!result) {
        return res.send({});
    }

    /**
     * This needs to be improved. Can we detect that a person is sleeping or has closed eyes?
     */
    const isFocused = !(
        result.description.tags.indexOf("cellphone") > -1 ||
        result.description.tags.indexOf("eating") > -1 ||
        result.description.tags.indexOf("phone") > -1);

    res.send({
        extracted: {
            isFocused: isFocused
        },
        msc: RESULTS[RESULTS.length - 1]
    });
});

app.post('/upload', upload.single('image'), (req, res) => {
    const file = req.file;

    request
        .post('https://westeurope.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Categories,Description,Color&language=en', {
            headers: {
                "Ocp-Apim-Subscription-Key": MCS_HACKZURICH_API_KEY,
                "Content-Type": "application/json"
            },
            formData: {
                body: file.buffer
            }
        }, (err, response, body) => {
            if (err) {
                return cb(err);
            }

            RESULTS.push(JSON.parse(body));

            res.send(response);
        });
});
 
app.get('/*', (req, res) => {
    res.send('Drive:Focus is up and Running!')
});

app.listen(process.env.MCS_HACKZURICH_PORT || 8090, () => {
    console.log('Drive:Focus is listening!')
});
