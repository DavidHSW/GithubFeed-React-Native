const GHService = require('../networkService/GithubServices');

var LoginMixin = {
  getInitialState() {
    return {
      logined: GHService.isLogined(),
    }
  },

  componentDidMount() {
    GHService.addListener('login', () => {
      console.log('did login');
      this.setState({
        logined: true,
      });
    })
  },

  componentWillUnmount() {
    GHService.removeListener('login');
  },
}

module.exports = LoginMixin
