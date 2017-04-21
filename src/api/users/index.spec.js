import proxyquire from 'proxyquire';

const usersControllerStub = {
  index: 'usersCtrl.index',
  create: 'usersCtrl.create',
};

const routerStub = {
  get: sinon.spy(),
  post: sinon.spy(),
};

const usersController = proxyquire
  .noCallThru()
  .load('./index', {
    express: {
      Router() {
        return routerStub;
      }
    },
    './users.controller': usersControllerStub
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

  describe('POST /users', () => {
    it('should route to users.controller.create', () => {
      expect(routerStub.post.withArgs('/', 'usersCtrl.create'))
        .to.have.been.calledOnce;
    });
  });
});
