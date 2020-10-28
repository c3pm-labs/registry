# c3pm Registry

This repository contains the c3pm registry.

## Usage
### Environment
```
PORT=4444
DEST_DIR=./package-data
SECRET_KEY=secret
```

### Start
```bash
npm install
npm start
```

## Example script
```javascript
const FormData = require('form-data');
const { request } = require('http');
const { createReadStream } = require('fs');

const readStream = createReadStream('./main.js');

const form = new FormData();
form.append('package', readStream);

const req = request(
  {
    host: 'localhost',
    port: '4444',
    path: '/v1',
    method: 'POST',
    headers: {
      ...form.getHeaders(),
      name: 'boost',
      version: '1.0.0',
      authorization: 'secret',
    },
  },
  response => {
    console.log(response.statusCode); // 200
  }
);

form.pipe(req);
```

You can download packages with a `GET` http request to
`http://<host>:<port>/v1/<package_name>/<package_version>`
