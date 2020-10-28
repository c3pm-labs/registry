const mkdirp = require('mkdirp');
const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;

const app = express();
const path = require('path');

const DEST_DIR = process.env.DEST_DIR || './package-data';
const PORT = process.env.PORT || 4444;
const SECRET_KEY = process.env.SECRET_KEY || 'secret';

const v1 = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dest = path.join(DEST_DIR, req.headers['name']);
    mkdirp(dest).then(() => cb(null, dest));
  },
  filename(req, file, cb) {
    return cb(null, req.headers['version']);
  },
});

v1.post('/', (req, res, next) => {
  if (req.headers.authorization !== SECRET_KEY) {
    res.status(401).end();
  } else {
    next();
  }
}, multer({ storage }).single('package'), (req, res) => {
  res.status(200).end();
})

v1.get('/', async (req, res, next) => {
  const { pkg } = req.query;

  try {
    const files = await fs.readdir(DEST_DIR);
    console.log(files)
    const versions = (await fs.readdir(`${DEST_DIR}/${files.filter(f => f === pkg)[0]}`));
    res.status(200).send(versions);
  } catch {
    res.status(200).send([]);
  }
})

v1.use(express.static(DEST_DIR));

app.use('/v1', v1);

app.listen(PORT, () => {
  console.log(`registry listening on 0.0.0.0:${PORT}`);
});
