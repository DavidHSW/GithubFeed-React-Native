const Routes = require('./AppComponents/Routes');
const React = require('react-native');
const RootTab = require('./AppComponents/RootTabComponent');
const GHService = require('./networkService/GithubServices');
const CommonComponents = require('./commonComponents/CommonComponents');
const OnboardComponent = require('./AppComponents/OnboardComponent');
const LoginMixin = require('./AppComponents/LoginMixin');
const LoginComponent = require('./AppComponents/LoginComponent');

const {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  NavigatorIOS,
  ActivityIndicatorIOS,
} = React;

const LoginState = {
  pending: 0,
  onboard: 1,
  unOnboard: 2,
  needLogin: 3,
}

const GitFeedApp = React.createClass({
  getInitialState() {
    return {
      userState: LoginState.pending,
    }
  },

  componentWillMount() {
    GHService.queryLoginState()
      .then(value => {
        let lst = LoginState.pending;
        if (value.username.length > 0) {
          lst = LoginState.onboard;
        } else {
          lst = LoginState.unOnboard;
        }

        console.log('login userstate is: ' + JSON.stringify(lst));

        this.setState({
          userState: lst,
        });
      })

    GHService.addListener('didLogout', () => {
      this.setState({
        userState: LoginState.unOnboard,
      });
    });
  },

  componentWillUnmount: function() {
    GHService.removeListener('didLogout');
  },

  didOnboard(user, needLogin) {
    let lst = user == null ? LoginState.unOnboard : LoginState.onboard;
    if (needLogin) lst = LoginState.needLogin;
    this.setState({
      userState: lst,
    });
  },

  didLogin() {
    this.setState({
      userState: LoginState.onboard,
    });
  },

  render() {
    let cp;
    switch (this.state.userState) {
      case LoginState.pending: {
        cp = CommonComponents.renderLoadingView();
      }
        break;
      case LoginState.onboard: {
        cp = <RootTab />;
      }
        break;
      case LoginState.unOnboard: {
        cp = <OnboardComponent didOnboard={this.didOnboard}/>;
      }
        break;
      case LoginState.needLogin: {
        cp = <LoginComponent didLogin={this.didLogin}/>;
      }
        break;
    }

    return cp;
  }
});

AppRegistry.registerComponent('Github_RN', () => GitFeedApp);
