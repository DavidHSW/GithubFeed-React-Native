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
const ErrorPlaceholder = require('../commonComponents/ErrorPlacehoderComponent');
const LanguageComponent = require('./LanguageComponent');

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

  getInitialState() {
    return {
      toggleLanguage: false,
    }
  },

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

  onChooseLang() {
    this.setState({
      toggleLanguage: !this.state.toggleLanguage,
    });
  },

  onSelectLanguage(language) {
    console.log('onSelectLanguage', language);
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

  renderRepoError(error) {
    let message = error.message;
    if (message == 'Not Found') {
      message = message + ' ' + this._text + ' for repo';
    }
    const reloadData = this._lvs[0] && this._lvs[0].reloadData;

    return (
      <ErrorPlaceholder
        title={message}
        desc={'repo load failed'}
        onPress={this._lvs[0].reloadData}/>
    );
  },

  renderUserError(error) {
    let message = error.message;
    if (message == 'Not Found') {
      message = message + ' ' + this._text + ' for user';
    }
    const reloadData = this._lvs[1] && this._lvs[1].reloadData;

    return (
      <ErrorPlaceholder
        title={message}
        desc={'user load failed'}
        onPress={this._lvs[1].reloadData}/>
    );
  },

  renderOrgError(error) {
    let message = error.message;
    if (message == 'Not Found') {
      message = message + ' ' + this._text + ' for org';
    }
    const reloadData = this._lvs[2] && this._lvs[2].reloadData;

    return (
      <ErrorPlaceholder
        title={message}
        desc={'org load failed'}
        onPress={reloadData}/>
    );
  },

  render() {
    let languageCp;
    if (this.state.toggleLanguage) {
      languageCp = (
        <LanguageComponent
          style={styles.language}
          onSelectLanguage={this.onSelectLanguage}/>
      );
    }

    return (
      <View style={styles.container}>
        {languageCp}
        <ScrollableTabView
          renderTabBar={() => <DefaultTabBar/>}
          initialPage={0}
          onChangeTab={this.onChangeTab}>
          <GHRefreshListView
            enablePullToRefresh={false}
            ref={(cp) => this._lvs[0] = cp}
            tabLabel="Repos"
            renderRow={this.renderRepoRow}
            reloadPromisePath={this.reloadReopPath}
            handleReloadData={this.handleReloadData}
            navigator={this.props.navigator}
            renderErrorPlaceholder={this.renderRepoError}
            >
          </GHRefreshListView>
          <GHRefreshListView
            enablePullToRefresh={false}
            ref={(cp) => this._lvs[1] = cp}
            tabLabel="Users"
            renderRow={this.renderUserRow}
            reloadPromisePath={this.reloadUserPath}
            handleReloadData={this.handleReloadData}
            navigator={this.props.navigator}
            context={this.searchedText}
            renderErrorPlaceholder={this.renderUserError}
            >
          </GHRefreshListView>
          <GHRefreshListView
            enablePullToRefresh={false}
            ref={(cp) => this._lvs[2] = cp}
            tabLabel="Orgs"
            renderRow={this.renderUserRow}
            reloadPromisePath={this.reloadOrgPath}
            handleReloadData={this.handleReloadData}
            navigator={this.props.navigator}
            context={this.searchedText}
            renderErrorPlaceholder={this.renderOrgError}
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
  language: {
    height: 320,
  },
});

module.exports = SearchComponent;
