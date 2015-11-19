const Routes = require('./AppComponents/Routes');
const React = require('react-native');
const RootTab = require('./AppComponents/RootTabComponent');
const GHService = require('./networkService/GithubServices');
const CommonComponents = require('./commonComponents/CommonComponents');
const OnboardComponent = require('./AppComponents/OnboardComponent');
const LoginMixin = require('./AppComponents/LoginMixin');

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
}

const GitFeedApp = React.createClass({
  mixins: [
    LoginMixin,
  ],

  getInitialState() {
    return {
      userState: LoginState.pending,
    }
  },

  componentWillMount() {
    GHService.queryLoginState()
      .then(value => {
        console.log('value is: ' + JSON.stringify(value));
        let lst = LoginState.pending;
        if (value.username.length > 0) {
          lst = LoginState.onboard;
        } else {
          lst = LoginState.unOnboard;
        }

        console.log('lst is: ' + JSON.stringify(lst));

        this.setState({
          userState: lst,
        });
      })
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
        cp = <OnboardComponent />;
      }
        break;
    }

    if (this.state.onboarded) {
      cp = <RootTab />;
    }

    return cp;
  }
});

AppRegistry.registerComponent('Github_RN', () => GitFeedApp);
