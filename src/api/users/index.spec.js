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
    './user.controller': usersControllerStub
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
  /*
  it('should list ALL users on /users GET');
  it('should list a SINGLE user on /user/:id GET');
  it('should add a SINGLE user on /user POST');
  it('should update a SINGLE user on /user/:id PUT');
  it('should delete a SINGLE user on /user/:id DELETE');
  */
});
