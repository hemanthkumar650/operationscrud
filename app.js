const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
app.use(bodyParser.json());

app.post('/create-task', async (req, res) => {
  const { id,title, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO task (id,title, description) VALUES ($1, $2, $3) RETURNING *',
      [id,title, description]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('An error occurred:', error);
  res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/assign-task/:taskId/:userId', async (req, res) => {
  const taskId = parseInt(req.params.taskId, 10);
  const userId = parseInt(req.params.userId, 10);
  try {
    const result = await pool.query(
      'UPDATE task SET assigned_to = $1 WHERE id = $2 RETURNING *',
      [userId, taskId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.put('/update-task/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { title, description, assigned_to, completed } = req.body; 
  try {
    let updateFields = [];
    let queryParams = [taskId];

    if (typeof title !== 'undefined') {
      updateFields.push('title = $' + (queryParams.length + 1));
      queryParams.push(title);
    }

    if (typeof description !== 'undefined') {
      updateFields.push('description = $' + (queryParams.length + 1));
      queryParams.push(description);
    }

    if (typeof assigned_to !== 'undefined') {
      updateFields.push('assigned_to = $' + (queryParams.length + 1));
      queryParams.push(assigned_to);
    }

    if (typeof completed !== 'undefined') {
      updateFields.push('completed = $' + (queryParams.length + 1));
      queryParams.push(completed);
    }

    if (updateFields.length === 0) {
      res.status(400).json({ error: 'No valid update fields provided' });
      return;
    }

    const updateQuery = 'UPDATE task SET ' + updateFields.join(', ') + ' WHERE id = $1 RETURNING *';

    const result = await pool.query(updateQuery, queryParams);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.put('/complete-task/:taskId', async (req, res) => {
  const { taskId } = req.params;
  try {
    const result = await pool.query(
      'UPDATE task SET completed = true WHERE id = $1 RETURNING *',
      [taskId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('An error occurred:', error);
  res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/list-tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM task');
    res.json(result.rows);
  } catch (error) {
    console.error('An error occurred:', error);
  res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/filter-tasks', async (req, res) => {
  const { completed } = req.query;
  try {
    let result;

    if (completed === 'true') {
      result = await pool.query('SELECT * FROM task WHERE completed = true');
    } else if (completed === 'false') {
      result = await pool.query('SELECT * FROM task WHERE completed = false');
    } else {
      result = await pool.query('SELECT * FROM task');
    }

    res.json(result.rows);
  } catch (error) {
    console.error('An error occurred:', error);
  res.status(500).json({ error: 'An error occurred' });
  }
});

app.delete('/delete-task/:taskId', async (req, res) => {
  const { taskId } = req.params;
  try {
    const result = await pool.query('DELETE FROM task WHERE id = $1', [taskId]);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('An error occurred:', error);
  res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/create-user', async (req, res) => {
  const {id, name, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO "user" (id, name, email) VALUES ($1, $2, $3) RETURNING *',
      [id, name, email]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/list-users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "user"');
    res.json(result.rows);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
