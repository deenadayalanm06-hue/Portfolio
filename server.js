const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Data file paths
const MESSAGES_FILE = './data/messages.json';
const PROJECTS_FILE = './data/projects.json';

// Helper: read/write JSON
function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Ensure data folder and files exist
if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync(MESSAGES_FILE)) writeJSON(MESSAGES_FILE, []);
if (!fs.existsSync(PROJECTS_FILE)) {
  // Default projects data
  writeJSON(PROJECTS_FILE, [
    {
      id: '1',
      title: 'E-Commerce Website',
      description: 'A full-stack e-commerce platform with product listing, cart, and checkout functionality.',
      tech: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
      github: 'https://github.com/alexjohnson/ecommerce',
      demo: '#'
    },
    {
      id: '2',
      title: 'Blog Platform',
      description: 'A blog platform with user authentication, post creation, and comment system.',
      tech: ['Node.js', 'Express', 'JavaScript'],
      github: 'https://github.com/alexjohnson/blog-platform',
      demo: '#'
    },
    {
      id: '3',
      title: 'AI Chat Assistant',
      description: 'An AI-powered chat assistant built using Python and NLP techniques.',
      tech: ['Python', 'Flask', 'NLP'],
      github: 'https://github.com/alexjohnson/ai-chat',
      demo: '#'
    }
  ]);
}

// ─── PROJECTS ROUTES ────────────────────────────────────────

// Get all projects
app.get('/api/projects', (req, res) => {
  const projects = readJSON(PROJECTS_FILE);
  res.json(projects);
});

// Get single project
app.get('/api/projects/:id', (req, res) => {
  const projects = readJSON(PROJECTS_FILE);
  const project = projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

// ─── CONTACT ROUTES ─────────────────────────────────────────

// Submit contact message
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: 'All fields are required' });

  const messages = readJSON(MESSAGES_FILE);
  const msg = {
    id: Date.now().toString(),
    name,
    email,
    message,
    createdAt: new Date().toISOString()
  };
  messages.push(msg);
  writeJSON(MESSAGES_FILE, messages);
  res.json({ message: 'Message sent successfully!' });
});

// Get all messages (admin view)
app.get('/api/messages', (req, res) => {
  const messages = readJSON(MESSAGES_FILE);
  res.json(messages);
});

// ─── PORTFOLIO INFO ROUTE ────────────────────────────────────

// Get portfolio owner info
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Alex Johnson',
    role: 'Full Stack Developer',
    about: 'I am a passionate full stack developer with experience in building web applications using modern technologies. I love solving problems and creating clean, efficient code.',
    email: 'alex.johnson@email.com',
    github: 'https://github.com/alexjohnson',
    linkedin: 'https://linkedin.com/in/alexjohnson',
    skills: [
      { category: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'React'] },
      { category: 'Backend', items: ['Node.js', 'Express', 'Python', 'Flask'] },
      { category: 'Database', items: ['MongoDB', 'MySQL', 'PostgreSQL'] },
      { category: 'Tools', items: ['Git', 'GitHub', 'VS Code', 'Postman'] }
    ]
  });
});

// Start server
app.listen(PORT, () => console.log(`Portfolio running at http://localhost:${PORT}`));