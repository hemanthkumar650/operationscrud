const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432, 
});


app.post('/tasks', (req, res) => {
  const { title, descriptio } = req.body;
  pool.query('INSERT INTO tasks (title, descriptio) VALUES ($1, $2) RETURNING *', [title, descriptio], (err, result) => {
    if (err) {
      console.error('Error inserting task:', err);
      res.status(500).json({ message: 'Error inserting task' });
    } else {
      const createdTask = result.rows[0];
      res.json(createdTask);
    }
  });
});


app.get('/tasks', (req, res) => {
  pool.query('SELECT * FROM tasks', (err, result) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      res.status(500).json({ message: 'Error fetching tasks' });
    } else {
      const tasks = result.rows;
      res.json({ tasks });
    }
  });
});


app.get('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  pool.query('SELECT * FROM tasks WHERE id = $1', [taskId], (err, result) => {
    if (err) {
      console.error('Error fetching task:', err);
      res.status(500).json({ message: 'Error fetching task' });
    } else if (result.rowCount === 0) {
      res.status(404).json({ message: 'Task not found' });
    } else {
      const task = result.rows[0];  
      res.json(task);
    }
  });
});


app.put('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const { title, descriptio } = req.body;
  pool.query('UPDATE tasks SET title = $1, descriptio = $2 WHERE id = $3 RETURNING *', [title, descriptio, taskId], (err, result) => {
    if (err) {
      console.error('Error updating task:', err);
      res.status(500).json({ message: 'Error updating task' });
    } else if (result.rowCount === 0) {
      res.status(404).json({ message: 'Task not found' });
    } else {
      const updatedTask = result.rows[0];
      res.json(updatedTask);
    }
  });
});


app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  pool.query('DELETE FROM tasks WHERE id = $1', [taskId], (err, result) => {
    if (err) {
      console.error('Error deleting task:', err);
      res.status(500).json({ message: 'Error deleting task' });
    } else if (result.rowCount === 0) {
      res.status(404).json({ message: 'Task not found' });
    } else {
      res.json({ message: 'Task deleted successfully' });
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
