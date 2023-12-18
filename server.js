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
    const cppProcess = spawn('g++', ['-o', 'output', '-xc++', '-'], {
        shell: true
    });

    cppProcess.stdin.write(code);
    cppProcess.stdin.end();

    cppProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    cppProcess.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    cppProcess.on('close', (code) => {
        if (code === 0) {
            const runProcess = spawn('./output', {
                shell: true
            });

            let output = '';
            runProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            runProcess.stderr.on('data', (data) => {
                output += data.toString();
            });

            runProcess.on('close', (code) => {
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
