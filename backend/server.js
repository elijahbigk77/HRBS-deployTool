const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/connect', (req, res) => {
  res.json({ success: true, message: 'Connected to domain controller' });
});

app.post('/api/computers', (req, res) => {
  const { domainController, username, password } = req.body;

  const ps = spawn('powershell.exe', [
    '-NoProfile',
    '-ExecutionPolicy', 'Bypass',
    '-File', './powershell/listComputers.ps1',
    '-DomainController', domainController,
    '-Username', username,
    '-Password', password
  ]);

  const stdoutChunks = [];
  const stderrChunks = [];

  ps.stdout.on('data', data => stdoutChunks.push(data));
  ps.stderr.on('data', data => stderrChunks.push(data));

  ps.on('close', (code) => {
    const stdout = Buffer.concat(stdoutChunks).toString();
    const stderr = Buffer.concat(stderrChunks).toString();

    if (stderr) {
      console.error('PowerShell stderr:', stderr);
    }

    try {
      const parsed = JSON.parse(stdout);
      res.json(parsed);
    } catch (err) {
      console.error('Failed to parse PowerShell output:', err);
      console.error('Raw output:', stdout);
      res.status(500).json({ error: 'Failed to parse PowerShell output' });
    }
  });

  ps.on('error', (err) => {
    console.error('Failed to start PowerShell process:', err);
    res.status(500).json({ error: 'PowerShell execution failed' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
