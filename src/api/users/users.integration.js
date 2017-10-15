import _ from 'lodash';
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
  active: false,
});

describe('Users', () => {
  beforeEach((done) => {
    User.drop()
      .then(() => User.sync())
      .then(() => {
        return factory.buildMany('User', 5);
      })
      .then((users) => {
        const promises = [];
        users.forEach(user => {
          promises.push(user.save());
        });
        return Promise.all(promises);
      })
      .then(() => done());
  });

  it('should list ALL users on /users GET', (done) => {
    request(app)
      .get('/api/v1/users')
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body).to.have.property('users');
        const users = res.body.users;
        expect(users).to.have.lengthOf(5);
        users.should.all.not.have.property('password');
        users.should.all.not.have.property('salt');
      })
      .then(done)
      .catch(done);
  });

  it('should list a SINGLE user on /users/:id GET', (done) => {
    User.findOne({where: {id: '3'}})
      .then((user) => {
        expect(user).to.exist;
        return request(app)
          .get('/api/v1/users/3')
          .set('Accept', 'application/json')
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property('user');
            expect(res.body.user).to.exist;
            expect(res.body.user).to.not.have.property('password');
            expect(res.body.user).to.not.have.property('salt');
            const plainUser = JSON.parse(JSON.stringify(user.toJSON()));
            expect(res.body.user).to.deep.equal(plainUser);
          });
      })
      .then(done)
      .catch(done);
  });

  it('should add a SINGLE user on /user POST', (done) => {
    factory.attrs('User')
      .then((user) => {
        const date = new Date();
        return request(app)
          .post('/api/v1/users')
          .send(user)
          .set('Accept', 'application/json')
          .expect(201)
          .then((res) => {
            expect(res.body).to.have.property('user');
            expect(res.body.user).to.exist;
            const u = res.body.user;
            expect(u).to.not.have.property('password');
            expect(u).to.not.have.property('salt');
            expect(u.id).to.equal(6);
            expect(u.email).to.equal(user.email);
            expect(u.active).to.equal(user.active);
            expect(u.date_created).to.equal(u.date_updated);
            const d = new Date(u.date_created);
            expect(d).to.equalDate(date);
            const d2 = new Date(date.getTime() + 1000);
            expect(d).to.withinTime(d, d2);
          });
      })
      .then(done)
      .catch(done);
  });

  it('should update a SINGLE user on /user/:id PUT', (done) => {
    request(app)
      .put('/api/v1/users/3')
      .send({email: 'john@mailinator.com'})
      .set('Accept', 'application/json')
      .expect(204)
      .then((res) => {
        expect(res.body).to.deep.equal({});
        return User.findOne({where: {id: 3}});
      })
      .then((user) => {
        expect(user.email).to.equal('john@mailinator.com');
        return User.findAll();
      })
      .then((users) => {
        const plainUsers = JSON.parse(JSON.stringify(users));
        expect(_.filter(plainUsers, {email: 'john@mailinator.com'}))
          .to.have.lengthOf(1);
      })
      .then(done)
      .catch(done);
  });

  it('should delete a SINGLE user on /user/:id DELETE', (done) => {
    request(app)
      .delete('/api/v1/users/3')
      .set('Accept', 'application/json')
      .expect(204)
      .then((res) => {
        expect(res.body).to.deep.equal({});
        return User.findOne({where: {id: 3}});
      })
      .then((user) => {
        expect(user).to.be.null;
        return User.findAll();
      })
      .then((users) => {
        expect(users).to.have.lengthOf(4);
      })
      .then(done)
      .catch(done);
  });
});
