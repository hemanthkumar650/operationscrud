const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.post('/tasks', (req, res) => {
  const tasks = getTasksFromFile();
  const newTask = {
    id: generateTaskId(),
    title: req.body.title,
    description: req.body.description
  };
  tasks.push(newTask);
  saveTasksToFile(tasks);
  res.json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const tasks = getTasksFromFile();
  const taskId = req.params.id;
  const taskToUpdate = tasks.find(task => task.id === taskId);
  if (!taskToUpdate) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  taskToUpdate.title = req.body.title;
  taskToUpdate.description = req.body.description;
  saveTasksToFile(tasks);
  res.json(taskToUpdate);
});

app.delete('/tasks/:id', (req, res) => {
  const tasks = getTasksFromFile();
  const taskId = req.params.id;
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  const deletedTask = tasks.splice(taskIndex, 1)[0];
  saveTasksToFile(tasks);
  res.json({ message: 'Task deleted successfully' });
});

app.get('/tasks', (req, res) => {
  const tasks = getTasksFromFile();
  res.json({ tasks });
});

app.get('/tasks/:id', (req, res) => {
  const tasks = getTasksFromFile();
  const taskId = req.params.id;
  const task = tasks.find(task => task.id === taskId);
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  res.json(task);
});
function getTasksFromFile() {
  const data = fs.readFileSync('tasks.json', 'utf8');
  return JSON.parse(data);
}

function saveTasksToFile(tasks) {
  fs.writeFileSync('tasks.json', JSON.stringify(tasks));
}

function generateTaskId() {
  return Date.now().toString();
}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
