const React = require('react-native');
const RefreshListView = require('./RefreshListView');
const GHService = require('../networkService/GithubServices');
const GHCell = require('./GHEventCell');

const {
  ListView,
  View,
  ActivityIndicatorIOS,
  Text,
  AppRegistry,
} = React;

let FeedsPage = 1;
const MAX_PAGE = 5;

const FeedComponent = React.createClass({
  handleReloadData(response) {
    const body = response._bodyInit;
    const jsonResult = JSON.parse(body);

    // console.log('getFeeds response is: ' + JSON.stringify(jsonResult));

    return jsonResult;
  },

  needNextPage() {
    return FeedsPage < MAX_PAGE;
  },

  reloadPromise() {
    FeedsPage = 1;
    return GHService.getFeeds(FeedsPage);
  },

  appendPromise() {
    FeedsPage ++;
    return GHService.getFeeds(FeedsPage);
  },

  renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <GHCell key={rowID} ghEvent={rowData} navigator={this.props.navigator}/>
    )
  },

  handleError(err) {
    console.log('FeedComponent handle error: ' + err);
  },

  render() {
    return (
      <RefreshListView
        handleReloadData={this.handleReloadData}
        handleAppendData={this.handleReloadData}
        reloadPromise={this.reloadPromise}
        needNextPage={this.needNextPage}
        appendPromise={this.appendPromise}
        renderRow={this.renderRow}
        handleError={this.handleError}
      />
    );
  },
});

module.exports = FeedComponent;
