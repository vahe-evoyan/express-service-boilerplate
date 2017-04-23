import proxyquire from 'proxyquire';

const authControllerStub = {
  login: 'authCtrl.login',
  logout: 'authCtrl.logout',
};

const routerStub = {
  post: sinon.spy(),
  delete: sinon.spy(),
};

const authController = proxyquire
  .noCallThru()
  .load('./index', {
    express: {
      Router() {
        return routerStub;
      },
    },
    './auth.controller': authControllerStub,
  });


describe('Auth API Router:', () => {
  it('should return an express router instance', () => {
    expect(authController).to.equal(routerStub);
  });

  describe('POST /auth', () => {
    it('should route to auth.controller.login', () => {
      expect(routerStub.post.withArgs('/', 'authCtrl.login'))
        .to.have.been.calledOnce;
    });
  });

  describe('DELET /auth', () => {
    it('should route to auth.controller.logout', () => {
      expect(routerStub.delete.withArgs('/', 'authCtrl.logout'))
        .to.have.been.calledOnce;
    });
  });
});
