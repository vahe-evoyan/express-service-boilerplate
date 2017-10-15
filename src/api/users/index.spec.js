import proxyquire from 'proxyquire';

const usersControllerStub = {
  index: 'usersCtrl.index',
  create: 'usersCtrl.create',
  update: 'usersCtrl.update',
  remove: 'usersCtrl.remove',
  get: 'usersCtrl.get',
};

const routerStub = {
  get: sinon.spy(),
  post: sinon.spy(),
  put: sinon.spy(),
  delete: sinon.spy(),
};

const usersController = proxyquire
  .noCallThru()
  .load('./index', {
    express: {
      Router() {
        return routerStub;
      },
    },
    './users.controller': usersControllerStub,
  });


describe('Users API Router:', () => {
  it('should return an express router instance', () => {
    expect(usersController).to.equal(routerStub);
  });

  describe('GET /users', () => {
    it('should route to users.controller.index', () => {
      expect(routerStub.get.withArgs('/', 'usersCtrl.index'))
        .to.have.been.calledOnce;
    });
  });

  describe('GET /users/:id', () => {
    it('should route to users.controller.get', () => {
      expect(routerStub.get.withArgs('/:id', 'usersCtrl.get'))
        .to.have.been.calledOnce;
    });
  });

  describe('PUT /users/:id', () => {
    it('should route to users.controller.update', () => {
      expect(routerStub.put.withArgs('/:id', 'usersCtrl.update'))
        .to.have.been.calledOnce;
    });
  });

  describe('DELETE /users/:id', () => {
    it('should route to users.controller.remove', () => {
      expect(routerStub.delete.withArgs('/:id', 'usersCtrl.remove'))
        .to.have.been.calledOnce;
    });
  });

  describe('POST /users', () => {
    it('should route to users.controller.create', () => {
      expect(routerStub.post.withArgs('/', 'usersCtrl.create'))
        .to.have.been.calledOnce;
    });
  });
});
