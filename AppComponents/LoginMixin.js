const GHService = require('../networkService/GithubServices');

var LoginMixin = {
  getInitialState() {
    return {
      // logined: GHService.isLogined(),
      logined: false,
      onboarded: false,
    }
  },

  componentWillMount() {
    GHService.addListener('login', () => {
      console.log('did login');
      this.setState({
        logined: true,
      });
    });

    GHService.addListener('onboard', () => {
      console.log('did onboard');
      this.setState({
        onboarded: true,
      });
    })
  },

  componentWillUnmount() {
    GHService.removeListener('login');
    GHService.removeListener('onboard');
  },
}

module.exports = LoginMixin
