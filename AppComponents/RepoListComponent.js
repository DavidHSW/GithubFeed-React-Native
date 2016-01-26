const React = require('react-native');
const RefreshListView = require('./RefreshListView');
const GHService = require('../networkService/GithubServices');
const RepoCell = require('./RepoCell');

let USER_PAGE = 1;

const RepoListComponent = React.createClass({
  _endPage: -1,

  PropTypes: {
    repoListURL: React.PropTypes.string,
  },

  handleReloadData(response) {
    const body = response._bodyInit;
    const jsonResult = JSON.parse(body);

    if (this._endPage == -1) {
      const links = response.headers.map.link && response.headers.map.link[0];
      if (links) {
        const reg = /page=(\d+)\S+\s+rel="last"/g;
        const matchs = reg.exec(links);
        const end = matchs[1];
        if (end) {
          console.log('end page is', end);
          this._endPage = end;
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
    let URL = this.props.repoListURL + '?page=' + USER_PAGE;
    return GHService.fetchPromise(URL);
  },

  renderRow(rowData, sectionID, rowID, highlightRow) {
    return <RepoCell repo={rowData} navigator={this.props.navigator}/>
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

module.exports = RepoListComponent;
