const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./app'); 

chai.use(chaiHttp);
const expect = chai.expect;

describe('Collab Task API', () => {
  before((done) => {
    chai
      .request(app)
      .delete('/collab_task')
      .end((err, res) => {
        done();
      });
  });
  describe('POST /collab_task', () => {
    it('should create a new collab_task', (done) => {
      const newTask = {
        id:6,
        title: 'Sample Task',
        description: 'This is sample task',
        assigne: 'HK',
        start_date: '2023-07-31',
        due_date: '2023-08-07',
        status: 'IN-PROGRESS',
      };

      chai
        .request(app)
        .post('/collab_task')
        .send(newTask)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('id');
          expect(res.body.title).to.equal(newTask.title);
          expect(res.body.description).to.equal(newTask.description);
          expect(res.body.assigne).to.equal(newTask.assigne);
          expect(res.body.start_date).to.equal(newTask.start_date);
          expect(res.body.due_date).to.equal(newTask.due_date);
          expect(res.body.status).to.equal(newTask.status);
          done();
        });
    });

    it('should return 400 if invalid status value is provided', (done) => {
      const newTask = {
        id: 7,
        title: 'Invalid Task',
        description: 'This task has an invalid status',
        assigne: 'Darshan',
        start_date: '2023-07-31',
        due_date: '2023-07-31',
        status: 'INVALID_STATUS', 
      };

      chai
        .request(app)
        .post('/collab_task')
        .send(newTask)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message', 'Invalid status value');
          done();
        });
    });
  });

  describe('GET /collab_task', () => {
    it('should get all collab_tasks', (done) => {
      chai
        .request(app)
        .get('/collab_task')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('tasks').to.be.an('array');
          expect(res.body.tasks).to.have.lengthOf.at.least(1);
          done();
        });
    });
  });

  describe('GET /collab_task/:id', () => {
    let taskId;

    before((done) => {
      const newTask = {
        id: 8,
        title: 'Sample Task',
        description: 'This is a sample task ',
        assigne: 'Deepak',
        start_date: '2023-07-31',
        due_date: '2023-07-31',
        status: 'IN-PROGRESS',
      };

      chai
        .request(app)
        .post('/collab_task')
        .send(newTask)
        .end((err, res) => {
          taskId = res.body.id;
          done();
        });
    });

    it('should get a single collab_task by id', (done) => {
      chai
        .request(app)
        .get(`/collab_task/${taskId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('id', taskId);
          done();
        });
    });

    it('should return 404 if collab_task with given id does not exist', (done) => {
      const nonExistentTaskId = 1000;

      chai
        .request(app)
        .get(`/collab_task/${nonExistentTaskId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message', 'Task not found');
          done();
        });
    });
  });

  describe('PUT /collab_task/:id', () => {
    let taskId;

    before((done) => {
      const newTask = {
        id: 9,
        title: 'Sample Task',
        description: 'This is sample task ',
        assigne: 'Sudeep',
        start_date: '2023-07-31',
        due_date: '2023-07-31',
        status: 'IN-PROGRESS',
      };

      chai
        .request(app)
        .post('/collab_task')
        .send(newTask)
        .end((err, res) => {
          taskId = res.body.id;
          done();
        });
    });

    it('should update a collab_task by id', (done) => {
      const updatedTask = {
        title: 'Updated Task Title',
        description: 'This task has been updated',
      };

      chai
        .request(app)
        .put(`/collab_task/${taskId}`)
        .send(updatedTask)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('id', taskId);
          expect(res.body.title).to.equal(updatedTask.title);
          expect(res.body.description).to.equal(updatedTask.description);
          done();
        });
    });

    it('should return 404 if collab_task with given id does not exist', (done) => {
      const nonExistentTaskId = 1000;
      const updatedTask = {
        title: 'Updated Task Title',
        description: 'This task has been updated',
      };

      chai
        .request(app)
        .put(`/collab_task/${nonExistentTaskId}`)
        .send(updatedTask)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message', 'Task not found');
          done();
        });
    });
  });

  describe('DELETE /collab_task/:id', () => {
    let taskId;

    before((done) => {
      const newTask = {
        id: 10,
        title: 'Sample task',
        description: 'This is sample task',
        assigne: 'Akash',
        start_date: '2023-07-31',
        due_date: '2023-07-31',
        status: 'IN-PROGRESS',
      };

      chai
        .request(app)
        .post('/collab_task')
        .send(newTask)
        .end((err, res) => {
          taskId = res.body.id;
          done();
        });
    });

    it('should delete a collab_task by id', (done) => {
      chai
        .request(app)
        .delete(`/collab_task/${taskId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Task deleted successfully');
          done();
        });
    });

    it('should return 404 if collab_task with given id does not exist', (done) => {
      const nonExistentTaskId = 1000;

      chai
        .request(app)
        .delete(`/collab_task/${nonExistentTaskId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message', 'Task not found');
          done();
        });
    });
  });
});
