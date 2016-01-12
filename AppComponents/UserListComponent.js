const React = require('react-native');
const RefreshListView = require('./RefreshListView');
const GHService = require('../networkService/GithubServices');
const UserCell = require('./UserCell');

let USER_PAGE = 1;

const UserListComponent = React.createClass({
  _endPage: -1,

  PropTypes: {
    userListURL: React.PropTypes.string,
  },

  handleReloadData(response) {
    const body = response._bodyInit;
    const jsonResult = JSON.parse(body);
    console.log('log user is: ', response);

    // TODO: 对正则还不是很熟，用这种比较挫的方式
    if (this._endPage == -1) {
      const links = response.headers.map.link && response.headers.map.link[0];
      if (links) {
        const re = links.split('page=')[2];
        if (re.indexOf('last') >= 0) {
          const en = re.split('>;')[0];

          console.log('links is', links, re, en);
          this._endPage = en;
        }
      } else {
        this._endPage = USER_PAGE;
      }
    }

    return jsonResult;
  },

  needNextPage() {
    return this._endPage != USER_PAGE;
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
