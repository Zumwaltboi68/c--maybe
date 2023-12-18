function runCode() {
    const code = document.getElementById('code').value;
    fetch('/run', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('output').innerText = data.output;
        })
        .catch(error => {
            document.getElementById('output').innerText = `Error: ${error.message}`;
        });
}
