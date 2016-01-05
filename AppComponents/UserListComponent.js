const React = require('react-native');
const RefreshListView = require('./RefreshListView');
const GHService = require('../networkService/GithubServices');
const UserCell = require('./UserCell');

let USER_PAGE = 1;
let MAX_PAGE = 10;

const UserListComponent = React.createClass({
  PropTypes: {
    userListURL: React.PropTypes.string,
  },

  handleReloadData(response) {
    const body = response._bodyInit;
    const jsonResult = JSON.parse(body);

    // console.log('getFeeds response is: ' + JSON.stringify(jsonResult));

    return jsonResult;
  },

  needNextPage() {
    return true;
  },

  reloadPromise() {
    USER_PAGE = 1;
    return this.loadDataPromise();
  },

  appendPromise() {
    USER_PAGE ++;
    return this.loadDataPromise();
  },

  loadDataPromise() {
    let URL = this.props.userListURL + '?page=' + USER_PAGE;
    return GHService.fetchPromise(URL);
  },

  renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <UserCell key={rowID} user={rowData} navigator={this.props.navigator}/>
    )
  },

  handleError(err) {
    console.log('UserListComponent handle error: ' + err);
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

module.exports = UserListComponent;
