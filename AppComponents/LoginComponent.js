const React = require('react-native');
const Colors = require('../commonComponents/Colors');
const Configs = require('../config');
const CommonStyles = require('../commonComponents/CommonStyles');
const CommonComponents = require('../commonComponents/CommonComponents');
const GHService = require('../networkService/GithubServices')

const {
  StyleSheet,
  WebView,
  ActivityIndicatorIOS,
  View,
  Text,
  TouchableHighlight,
} = React;

const styles = StyleSheet.create({
});

const WEBVIEWREF = 'webview';

const LoginComponent = React.createClass({

  render() {
    return (
      <WebView
        ref={WEBVIEWREF}
        renderError={this.renderError}
        renderLoading={CommonComponents.renderLoadingView}
        url={GHService.getLoginURL()}
        onNavigationStateChange={GHService.handleDidLogin}
      />
    );
  },
});

module.exports = LoginComponent
