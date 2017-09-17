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

process.env.MCS_HACKZURICH_API_KEY = '03772567483d4a07aa5da13bae6d21da';

if (!process.env.MCS_HACKZURICH_API_KEY) {
    throw new Error('Specify MCS Api Key!');
}

const MCS_HACKZURICH_API_KEY = process.env.MCS_HACKZURICH_API_KEY;

 /**
 * This needs to be improved. Can we detect that a person is sleeping or has closed eyes?
 * 
 * Improvement tips are to be found in README.md
 */

const VERY_SENSITIVE_TAGS = [ 'cellphone', 'phone' ];
const SENSITIVE_TAGS = [ 'eating', 'drinking' ];
const REQUIRED_TAGS = [ 'person' ];

var shouldBeFocused;

const findOutIfFocused = result => {
    if (typeof shouldBeFocused !== 'undefined') {
        if (shouldBeFocused) {
            return true
        } else {
            return false;
        }
    }

    return !(
        (result.tags
        .map(_ => _.name)
        .find(_ => [ 'cellphone', 'phone', 'eating', 'food' ].indexOf(_) > -1) ||
        result.description.tags.slice(0, 11).find(_ => VERY_SENSITIVE_TAGS.indexOf(_) > -1) ||
        result.description.tags.slice(0, 7).find(_ => SENSITIVE_TAGS.indexOf(_) > -1))
    ) &&
    !!result.description.tags.slice(0, 4).find(_ => REQUIRED_TAGS.indexOf(_) > -1)
};

app.get('/driver/behaviour', (req, res) => {
    const result = RESULTS[RESULTS.length - 1];

    if (!result) {
        return res.send({
            extracted: {
                isFocused: true
            }
        });
    }
    
    const isFocused = findOutIfFocused(result);

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
        .post('https://westeurope.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Tags,Categories,Description&language=en', {
            headers: {
                "Ocp-Apim-Subscription-Key": MCS_HACKZURICH_API_KEY,
                "Content-Type": "application/json"
            },
            formData: {
                body: file.buffer
            }
        }, (err, response, body) => {
            if (err) {
                console.error(err);

                return res.status(400).send({
                    err: 'Something went wrong with the request'
                });
            }

            const parsedBody = JSON.parse(body);

            RESULTS.push(parsedBody);

            res.send(parsedBody);
        });
});
 
app.get('/*', (req, res) => {
    res.send('Drive:Focus is up and Running!')
});

/**
 * used for testing purposes
 */
app.put('/switch', (req, res) => {
    if (req.query.reset) {
        delete shouldBeFocused
    }
    
    shouldBeFocused = !shouldBeFocused;
    
    res.send({ ok });
});

app.listen(process.env.MCS_HACKZURICH_PORT || 8090, () => {
    console.log('Drive:Focus is listening!')
});
