const GHService = require('../networkService/GithubServices');

var LoginMixin = {
  getInitialState() {
    return {
      // logined: GHService.isLogined(),
      logined: false,
      onboarded: false,
      needOnboard: false,
    }
  },

  componentWillMount() {
    GHService.addListener('login', () => {
      console.log('did login');
      this.setState({
        logined: true,
        needLogin: false,
        onboard: true,
        needOnboard: false,
      });
    });

    GHService.addListener('onboard', () => {
      console.log('did onboard');
      this.setState({
        onboarded: true,
        needOnboard: false,
        needLogin: false,
        logined: false,
      });
    });

    GHService.addListener('needOnboard', () => {
      console.log('did needOnboard');
      this.setState({
        logined: false,
        onboard: false,
        needOnboard: true,
        needLogin: false,
      });
    });

    GHService.addListener('needLogin', () => {
      console.log('did needLogin');
      this.setState({
        logined: false,
        needLogin: true,
        onboard: false,
        needOnboard: false,
      });
    });

  },

  componentWillUnmount() {
    GHService.removeListener('login');
    GHService.removeListener('onboard');
    GHService.removeListener('needLogin');
    GHService.removeListener('needOnboard');
  },
}

module.exports = LoginMixin
