const React = require('react-native');
const GHService = require('../networkService/GithubServices');
const CommonComponents = require('../commonComponents/CommonComponents');
const ScrollableTabView = require('react-native-scrollable-tab-view');
const { Icon, } = require('react-native-icons');
const Colors = require('../commonComponents/Colors');
const DefaultTabBar = require('./DefaultTabBar');
const GHRefreshListView = require('./GHRefreshListView');
const RepoCell = require('./RepoCell');
const FacebookTabsExample = require('./FacebookTabsExample');
const FacebookTabBar = require('./FacebookTabBar');
const UserListComponent = require('./UserListComponent')


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

 const ICON_SIZE = 18;

const OrgComponent = React.createClass({

  PropTypes: {
    org: React.PropTypes.object,
  },

  handleReloadData(value) {
    const json = value._bodyInit.length > 0 && JSON.parse(value._bodyInit);
    return json;
  },

  reloadReopPath() {
    const org = this.props.org;
    const apiPath = GHService.apiPath() + '/orgs/' + org.login + '/repos';
    return apiPath;
  },

  reloadUserPath() {
    const org = this.props.org;
    const apiPath = GHService.apiPath() + '/orgs/' + org.login + '/members';

    return apiPath;
  },

  renderRepoRow(rowData, sectionID, rowID, highlightRow) {
    return <RepoCell key={rowID} repo={rowData} navigator={this.props.navigator}/>;
  },

  renderUserRow(rowData, sectionID, rowID, highlightRow) {
    return <UserCell key={rowID} user={rowData} navigator={this.props.navigator}/>;
  },

  render() {
    return (
      <View style={{backgroundColor: 'white', marginTop: 64, flex: 1}}>
        <AboutComponent user={this.props.org} navigator={this.props.navigator}/>
        <ScrollableTabView renderTabBar={() => <DefaultTabBar />}>
          <GHRefreshListView
            enablePullToRefresh={false}
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
            tabLabel="Members"
            renderRow={this.renderUserRow}
            reloadPromisePath={this.reloadUserPath}
            handleReloadData={this.handleReloadData}
            navigator={this.props.navigator}
            renderErrorPlaceholder={this.renderUserError}
            >
          </GHRefreshListView>
        </ScrollableTabView>
      </View>
    )
  }
});

const AboutComponent = React.createClass({
  PropTypes: {
    user: React.PropTypes.object,
  },

  getInitialState() {
    return {
      user: this.props.user,
    }
  },

  onPressEmail() {
    console.log('press email');
  },

  onPressBlog() {
    const blog = {
      html: this.state.user.blog,
      title: this.state.user.login + "'s blog"
    }
    this.props.navigator.push({id: 'web', obj: blog})
  },

  componentDidMount() {
    GHService.fetchPromise(this.props.user.url)
      .then(value => {
        const resUser = JSON.parse(value._bodyInit);
        const detailUser = Object.assign(this.state.user, resUser);
        this.setState({
          user: detailUser,
        });
      })
  },

  render() {
    const user = this.state.user;

    let orgCompany;
    if (org.company) {
      orgCompany = (
        <View style={styles.iconTextContainer}>
          <Icon
            name='ion|ios-people-outline'
            size={ICON_SIZE}
            style={styles.icon}
            color={Colors.textGray}/>
          <Text style={styles.profileInfoLocation}>{org.company}</Text>
        </View>
      )
    }

    let orgLocation;
    if (org.location) {
      orgLocation = (
        <View style={styles.iconTextContainer}>
          <Icon
            name='ion|ios-location-outline'
            size={ICON_SIZE}
            style={styles.icon}
            color={Colors.textGray}/>
          <Text style={styles.profileInfoLocation}>{org.location}</Text>
        </View>
      )
    }

    let orgEmail;
    if (org.email) {
      orgEmail = (
        <View style={styles.iconTextContainer}>
          <Icon
            name='ion|ios-email-outline'
            size={ICON_SIZE}
            style={styles.icon}
            color={Colors.textGray}/>
          <Text
            style={styles.profileInfoEmailAndSite}
            onPress={this.onPressEmail}
            >{org.email}</Text>
        </View>
      )
    }

    let orgBlog;
    if (org.blog) {
      orgBlog = (
        <View style={styles.iconTextContainer}>
          <Icon
            name='ion|social-rss-outline'
            size={ICON_SIZE}
            style={styles.icon}
            color={Colors.textGray}/>
          <Text
            style={styles.profileInfoEmailAndSite}
            onPress={this.onPressBlog}
            >{user.blog}</Text>
        </View>
      )
    }

    let userJoined;
    if (user.created_at) {
      const date = new Date(user.created_at).toISOString().slice(0, 10);
      const joined = 'Joined on ' + date;
      userJoined = (
        <View style={styles.iconTextContainer}>
          <Icon
            name='ion|ios-clock-outline'
            size={ICON_SIZE}
            style={styles.icon}
            color={Colors.textGray}/>
          <Text style={styles.profileInfoLocation}>{joined}</Text>
        </View>
      )
    }

    return (
      <View style={[styles.scvContainerStyle]} {...this.props}>
        <View style={styles.profile}>
          <Image style={styles.profileImage} source={{uri: org.avatar_url}}/>
          <View style={styles.profileInfo}>
            <Text style={styles.profileInfoName}>{user.name}</Text>
            <Text style={styles.profileInfoNickName}>{user.login}</Text>
            {userCompany}
            {userLocation}
            {userEmail}
            {userBlog}
            {userJoined}
          </View>
        </View>
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
  profile: {
    padding: 15,
    flexDirection: 'row',
    alignSelf: 'stretch',
    paddingBottom: 0,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 3,
  },
  profileInfo: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    marginLeft: 15,
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  profileInfoName: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 3,
  },
  profileInfoNickName: {
    color: 'gray',
    fontSize: 12,
    marginBottom: 10,
  },
  profileInfoLocation: {
    color: 'black',
    fontSize: 12,
  },
  profileInfoEmailAndSite: {
    color: Colors.blue,
    fontSize: 12,
  },
});

module.exports = OrgComponent;
