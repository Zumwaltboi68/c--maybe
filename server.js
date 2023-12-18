const express = require('express');
const { spawn } = require('child_process');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/run', (req, res) => {
    const { code } = req.body;

    const cppProcess = spawn('g++', ['-o', 'output', '-xc++', '-']);

    cppProcess.stdin.write(code);
    cppProcess.stdin.end();

    cppProcess.on('close', (code) => {
        if (code === 0) {
            const runProcess = spawn('./output');

            let output = '';

            runProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            runProcess.stderr.on('data', (data) => {
                output += data.toString();
            });

            runProcess.on('close', () => {
                res.json({ output });
            });
        } else {
            res.json({ output: 'Compilation Error!' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
