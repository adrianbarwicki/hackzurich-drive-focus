# Drive:Focus Server

## Run it
The API will listen at the port 8080 per default.
```
npm install

MCS_HACKZURICH_API_KEY=xxxxxxxxxxxx node index.js
```

## API

### GET /driver/behaviour
Gets the last evaluations of uploaded photos.<br />
Current limitations:<br />
1. Only one driver is supported <br />

***Example response**
```
[{
    extracted: ...
    mcs: ...
}]
```

### POST /upload
Endpoint for uploading files. It handles multipart/form-data. Field name specified in the form should be 'image'.
<br />
Supported input methods: Raw image binary. 
<br />
Input requirements: <br />
1. Supported image formats: JPEG, PNG, GIF, BMP. 
2. Image file size must be less than 4MB.
.3 Image dimensions must be at least 50 x 50.
