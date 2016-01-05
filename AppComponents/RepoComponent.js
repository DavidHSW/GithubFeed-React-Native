const React = require('react-native');
const GHService = require('../networkService/GithubServices');
const CommonComponents = require('../commonComponents/CommonComponents');

const {
  ListView,
  View,
  ActivityIndicatorIOS,
  Text,
  WebView,
} = React;

const MAX_PAGE = 5;
const hideJS = `
  ;(function hideHead(){
    document.getElementsByClassName("nav-bar")[0].style.display="none";
    document.getElementsByClassName("breadcrumb blob-breadcrumb")[0].style.display="none";
    document.getElementsByClassName("clearfix")[0].style.display="none";
  })();
`;

const RepoComponent = React.createClass({
  onNavigationStateChange(e) {
    console.log('web changed', e);
  },

  render() {
    const readmeURL = 'https://github.com/' + this.props.repo.name + '/blob/master/README.md'
    return (
      <WebView
        url={readmeURL}
        onNavigationStateChange={this.onNavigationStateChange}
        injectedJavaScript={hideJS}
        automaticallyAdjustContentInsets={false}
        contentInset={{top: 64, left: 0, bottom: 49, right: 0}}
        startInLoadingState={true}
      />
    )
  },
});


module.exports = RepoComponent;
