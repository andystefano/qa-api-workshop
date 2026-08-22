const express = require('express');

const app = express();

app.get('/demo-codeql', (req, res) => {
  const comando = req.query.cmd || 'echo demo';
  require('child_process').exec(comando, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr || error.message });
    }

    return res.status(200).json({ salida: stdout });
  });
});

module.exports = app;