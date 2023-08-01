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
app.post('/collab_task', (req, res) => {
  const { id, title, description, assigne, start_date, due_date, status, image_attachment, file_attachment, audio_attachment, date_attachment, time_attachment } = req.body;
  const validStatusValues = ['DONE', 'IN-PROGRESS', 'ARCHIVED'];

  if (!validStatusValues.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  pool.query(
    'INSERT INTO collab_task (id, title, description, assigne, start_date, due_date, status, image_attachment, file_attachment, audio_attachment, date_attachment, time_attachment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
    [id, title, description, assigne, start_date, due_date, status, image_attachment, file_attachment, audio_attachment, date_attachment, time_attachment],
    (err, result) => {
      if (err) {
        console.error('Error inserting task:', err);
        res.status(500).json({ message: 'Error inserting task' });
      } else {
        const createdTask = result.rows[0];
        res.json(createdTask);
      }
    }
  );
});
app.post('/todo', (req, res) => {
  const { title, description } = req.body;
  pool.query('INSERT INTO tasks (title, description ) VALUES ($1, $2) RETURNING *', [title, description], (err, result) => {
    if (err) {
      console.error('Error inserting task:', err);
      res.status(500).json({ message: 'Error inserting task' });
    } else {
      const createdTask = result.rows[0];
      res.json(createdTask);
    }
  });
});
app.get('/collab_task', (req, res) => {
  pool.query('SELECT * FROM collab_task', (err, result) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      res.status(500).json({ message: 'Error fetching tasks' });
    } else {
      const tasks = result.rows;
      res.json({ tasks });
    }
  });
});
app.get('/collab_task/:id', (req, res) => {
  const taskId = req.params.id;
  pool.query('SELECT * FROM collab_task WHERE id = $1', [taskId], (err, result) => {
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
app.put('/collab_task/:id', (req, res) => {
  const taskId = req.params.id;
  const { title, description, image_attachment, file_attachment, audio_attachment, date_attachment, time_attachment } = req.body;
  pool.query(
    'UPDATE collab_task SET title = $1, description = $2, image_attachment = $3, file_attachment = $4, audio_attachment = $5, date_attachment = $6, time_attachment = $7 WHERE id = $8 RETURNING *',
    [title, description, image_attachment, file_attachment, audio_attachment, date_attachment, time_attachment, taskId],
    (err, result) => {
      if (err) {
        console.error('Error updating task:', err);
        res.status(500).json({ message: 'Error updating task' });
      } else if (result.rowCount === 0) {
        res.status(404).json({ message: 'Task not found' });
      } else {
        const updatedTask = result.rows[0];
        res.json(updatedTask);
      }
    }
  );
});
app.delete('/collab_task/:id', (req, res) => {
  const taskId = req.params.id;
  pool.query('DELETE FROM collab_task WHERE id = $1', [taskId], (err, result) => {
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
module.exports = app;

