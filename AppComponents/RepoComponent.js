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

let FeedsPage = 1;
const MAX_PAGE = 5;

const RepoComponent = React.createClass({
  getInitialState() {
    return {
      html: '',
    }
  },

  componentWillMount() {
    const repo = this.props.repo;
    GHService.getRepoHTMLString(repo.name)
      .then(value => {
        GHService.checkError(value);


        console.log('repo value is:' + value._bodyInit);
        this.setState({
          html: value._bodyInit,
        });
      })
  },

  render() {
    if (this.state.html.length === 0) {
      return CommonComponents.renderLoadingView();
    } else {
      return (
        <WebView
          html={this.state.html}
        />
      )
    }
  },
});

module.exports = RepoComponent;
