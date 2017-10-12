import factory, {SequelizeAdapter} from 'factory-girl';
import app from '../..';
import User from './user.model';
// import faker from 'faker';
// import bluebird from 'bluebird';
import request from 'supertest';

const adapter = new SequelizeAdapter();
factory.setAdapter(adapter);

factory.define('User', User, {
  email: factory.sequence('user.email', n => `user${n}@mailinator.com`),
  password: factory.chance('word', {syllables: 4}),
  status: 'inactive',
});

describe('Users', () => {
  beforeEach((done) => {
    User.destroy({truncate: true}).then(done);
  });

  it('should list ALL users on /users GET', (done) => {
    factory.buildMany('User', 5)
      .then((users) => {
        const promises = [];
        users.forEach(user => {
          promises.push(user.save());
        });
        return Promise.all(promises);
      })
      .then((users) => {
        request(app)
          .get('/api/v1/users')
          .set('Accept', 'application/json')
          .expect(200)
          .then((res) => {
            assert.exists(res.body.users);
            assert(res.body.users.length, 5);
          })
          .then(done);
      })
      .catch(done);
  });
});
 /*
  it('should list ALL users on /users GET');
  it('should list a SINGLE user on /user/:id GET');
  it('should add a SINGLE user on /user POST');
  it('should update a SINGLE user on /user/:id PUT');
  it('should delete a SINGLE user on /user/:id DELETE');
  */
