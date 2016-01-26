const React = require('react-native');
const GHService = require('../networkService/GithubServices');
const CommonComponents = require('../commonComponents/CommonComponents');
const ScrollableTabView = require('react-native-scrollable-tab-view');
const { Icon, } = require('react-native-icons');
const Colors = require('../commonComponents/Colors');
const DefaultTabBar = require('./DefaultTabBar');
const GHRefreshListView = require('./GHRefreshListView');
const RepoCell = require('./RepoCell');
const UserCell = require('./UserCell');
const Swiper = require('react-native-swiper');
const LanguageComponent = require('./LanguageComponent');
const TrendLanguages = require('../commonComponents/TrendLanguages.json');
const ShowCasesComponent = require('./ShowCasesComponent');
const ExploreCell = require('./ExploreCell');

const {
  View,
  ActivityIndicatorIOS,
  Text,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  ListView,
} = React;

const ICON_SIZE = 12;
const BASE_TRENDING_PATH = 'http://trending.codehub-app.com/v2/trending';
const LAN_PLACEHOLDER = 'Choose Language';
const LAN_ALL_LANGUAGE = 'All Languages';

const OrgComponent = React.createClass({
  _selectTab: 0,
  _lvs: [],

  getInitialState() {
    return {
      toggleLanguage: false,
      currentLanguage: LAN_PLACEHOLDER,
    }
  },

  _resetLoadedStatus() {
    this._lvs.forEach((lv) => {
      lv.clearData();
    })
  },

  onChooseLang() {
    this.setState({
      toggleLanguage: !this.state.toggleLanguage,
    });
  },

  onSelectLanguage(language) {
    if (this.state.currentLanguage == language) {
      this.setState({
        toggleLanguage: false,
      });

      return;
    };

    this.setState({
      toggleLanguage: false,
      currentLanguage: language,
    });

    this._resetLoadedStatus();
    this._lvs[this._selectTab].reloadData();
  },

  onCancelChoose() {
    this.setState({
      toggleLanguage: false,
    });
  },

  onChangeTab(tab) {
    this._selectTab = tab.i;
    const refreshListView = this._lvs[tab.i];
    refreshListView && refreshListView.reloadDataIfNeed();
  },

  _getPath(desc) {
    let path = BASE_TRENDING_PATH + '?since=' + desc;
    const currentLanguage = this.state.currentLanguage;
    if (currentLanguage != LAN_PLACEHOLDER && currentLanguage != LAN_ALL_LANGUAGE) {
      path = path + '&language=' + this.state.currentLanguage.toLowerCase();
    }

    console.log('get path', path);

    return path;
  },

  reloadDailyPath() {
    return this._getPath('daily');
  },

  reloadWeeklyPath() {
    return this._getPath('weekly');
  },

  reloadMonthlyPath() {
    return this._getPath('monthly');
  },

  handleReloadData(value) {
    const json = value._bodyInit.length > 0 && JSON.parse(value._bodyInit);
    return json;
  },

  renderRepo(rowData, sectionID, rowID, highlightRow) {
    return <ExploreCell key={rowID} trendRepo={rowData} navigator={this.props.navigator}/>;
  },

  render() {
    let languageCp;
    if (this.state.toggleLanguage) {
      languageCp = (
        <LanguageComponent
          languageList={TrendLanguages}
          style={styles.language}
          onSelectLanguage={this.onSelectLanguage}
          onCancelChoose={this.onCancelChoose}/>
      );
    } else {
      languageCp = (
        <TouchableOpacity style={styles.chooseLan} onPress={this.onChooseLang}>
          <Text style={styles.lan}>
            {this.state.currentLanguage}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={{backgroundColor: 'white', paddingTop: 64, flex: 1}}>
        <ShowCasesComponent style={styles.showcase} navigator={this.props.navigator}/>
        <View style={styles.poplular}>
          <Text style={{fontWeight: 'bold',fontSize: 15, color: Colors.textGray}}>
            Popular repos
          </Text>
        </View>
        {languageCp}
        <ScrollableTabView
          renderTabBar={() => <DefaultTabBar />}
          onChangeTab={this.onChangeTab}
          >
          <GHRefreshListView
            enablePullToRefresh={false}
            ref={(cp) => this._lvs[0] = cp}
            tabLabel="Daily"
            renderRow={this.renderRepo}
            reloadPromisePath={this.reloadDailyPath}
            handleReloadData={this.handleReloadData}
            navigator={this.props.navigator}
            >
          </GHRefreshListView>
          <GHRefreshListView
            enablePullToRefresh={false}
            ref={(cp) => this._lvs[1] = cp}
            tabLabel="Weekly"
            renderRow={this.renderRepo}
            reloadPromisePath={this.reloadWeeklyPath}
            handleReloadData={this.handleReloadData}
            navigator={this.props.navigator}
            >
          </GHRefreshListView>
          <GHRefreshListView
            enablePullToRefresh={false}
            ref={(cp) => this._lvs[2] = cp}
            tabLabel="Monthly"
            renderRow={this.renderRepo}
            reloadPromisePath={this.reloadMonthlyPath}
            handleReloadData={this.handleReloadData}
            navigator={this.props.navigator}
            >
          </GHRefreshListView>
        </ScrollableTabView>
      </View>
    )
  }
});


var styles = StyleSheet.create({
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginRight: 3,
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  scvContainerStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  showcase: {
    height: 120,
  },
  poplular: {
    padding: 5,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#F2F2F2',
  },
  language: {
    height: 320,
  },
  chooseLan: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  lan: {
    color: Colors.blue,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

module.exports = OrgComponent;
