const React = require('react-native');
const GHService = require('../networkService/GithubServices');
const CommonComponents = require('../commonComponents/CommonComponents');
const { Icon, } = require('react-native-icons');
const Colors = require('../commonComponents/Colors');
const SettingComponent = require('./SettingsCell');
const ScrollableTabView = require('react-native-scrollable-tab-view');
const DefaultTabBar = require('./DefaultTabBar');
const GHRefreshListView = require('./GHRefreshListView');
const RepoCell = require('./RepoCell');
const UserCell = require('./UserCell');

const {
  View,
  ActivityIndicatorIOS,
  Text,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  Navigator,
  ActionSheetIOS,
  ListView,
} = React;

const ICON_SIZE = 30;

const SearchComponent = React.createClass({
  _selectTab: 0,
  _text: '',
  _lvs: [],

  _resetLoadedStatus() {
    this._lvs.forEach((lv) => {
      lv.clearData();
    })
  },

  onChangeText(text) {
    this._resetLoadedStatus();
    this._text = text;
  },

  onSubmitEditing() {
    if (this._text.length == 0) return;

    this._lvs[this._selectTab].reloadData();
  },

  onChangeTab(tab) {
    this._selectTab = tab.i;
    const refreshListView = this._lvs[tab.i];
    refreshListView && refreshListView.reloadDataIfNeed();
  },

  componentWillMount() {
    const route = this.props.route;
    route.sp = this;
  },

  componentWillUnmount() {
    const route = this.props.route;
    route.sp = null;
  },

  reloadReopPath() {
    if (this._text.length == 0) return;

    let apiPath = GHService.apiPath();
    apiPath += '/search/repositories?' + 'q=' + this._text;

    return apiPath;
  },

  reloadUserPath() {
    if (this._text.length == 0) return;

    let apiPath = GHService.apiPath();
    apiPath += '/search/users?' + 'q=' + this._text;

    return apiPath;
  },

  reloadOrgPath() {
    if (this._text.length == 0) return;

    let apiPath = GHService.apiPath();
    apiPath += '/search/users?' + 'q=' + this._text + '+type:org';

    return apiPath;
  },

  handleReloadData(value) {
    const json = value._bodyInit.length > 0 && JSON.parse(value._bodyInit);
    return json.items;
  },

  renderRepoRow(rowData, sectionID, rowID, highlightRow) {
    return <RepoCell repo={rowData} navigator={this.props.navigator}/>;
  },

  renderUserRow(rowData, sectionID, rowID, highlightRow) {
    return <UserCell key={rowID} user={rowData} navigator={this.props.navigator}/>;
  },

  renderOrgRow(rowData, sectionID, rowID, highlightRow) {
    return <UserCell key={rowID} user={rowData} navigator={this.props.navigator}/>;
  },

  render() {
    return (
      <View style={styles.container}>
        <ScrollableTabView
          renderTabBar={() => <DefaultTabBar/>}
          onChangeTab={this.onChangeTab}>
          <GHRefreshListView
            enablePullToRefresh={false}
            ref={(cp) => this._lvs[0] = cp}
            tabLabel="Repos"
            renderRow={this.renderRepoRow}
            reloadPromisePath={this.reloadReopPath}
            handleReloadData={this.handleReloadData}
            >
          </GHRefreshListView>
          <GHRefreshListView
            enablePullToRefresh={false}
            ref={(cp) => this._lvs[1] = cp}
            tabLabel="Users"
            renderRow={this.renderUserRow}
            reloadPromisePath={this.reloadUserPath}
            handleReloadData={this.handleReloadData}
            >
          </GHRefreshListView>
          <GHRefreshListView
            enablePullToRefresh={false}
            ref={(cp) => this._lvs[2] = cp}
            tabLabel="Orgs"
            renderRow={this.renderUserRow}
            reloadPromisePath={this.reloadOrgPath}
            handleReloadData={this.handleReloadData}
            >
          </GHRefreshListView>
        </ScrollableTabView>
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
  },
  tabView: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    height: 150,
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});

module.exports = SearchComponent;
