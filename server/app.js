import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();
const PORT = 8081;
const __dirname = path.resolve();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/images', (_, res) => {
    try {
	const filePath = path.join(__dirname, 'data/templates.json');
	const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
	res.json(data);
    } catch (error) {
        console.log('Internal error: ', error);
	res.status(500).json({ error: `internal error ${error}` });
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
