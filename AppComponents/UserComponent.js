const React = require('react-native');
const GHService = require('../networkService/GithubServices');
const CommonComponents = require('../commonComponents/CommonComponents');
const ScrollableTabView = require('react-native-scrollable-tab-view');
const { Icon, } = require('react-native-icons');
const Colors = require('../commonComponents/Colors');
const RepoCell = require('./RepoCell');

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

const UserComponent = React.createClass({
  _detailUser: {},
  _headerHeight: 0,

  PropTypes: {
    user: React.PropTypes.object,
  },

  getInitialState() {
    const dataSourceParam = {
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }

    return {
      dataSource: new ListView.DataSource(dataSourceParam),
      userDetailLoaded: false,
      userReposLoaded: false,
      userOrgLoaded: false,
    };
  },

  componentWillMount() {
    this._detailUser = this.props.user;
    const userURL = this._detailUser.url;

    GHService.fetchPromise(userURL)
      .then(res => {
        const resUser = JSON.parse(res._bodyInit);
        this._detailUser = Object.assign(this._detailUser, resUser);
        this.setState({
          userDetailLoaded: true,
        });

        const repoURL = resUser.repos_url + '?sort=updated';
        return GHService.fetchPromise(repoURL);
      })
      .then(res => {
        const repos = JSON.parse(res._bodyInit);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(repos),
          userReposLoaded: true,
        });

        const orgURL = this._detailUser.organizations_url;
        return GHService.fetchPromise(orgURL);
      })
      .then(res => {
        const orgs = JSON.parse(res._bodyInit);
        if (Array.isArray(orgs) && orgs.length > 0) {
          this._detailUser.orgs = orgs;
          this.setState({
            userOrgLoaded: true,
          });
        }
      })
      .catch(err => {console.log('promise err', err);});
  },

  onOpenRepos() {
    if (!this.state.dataSource.getRowCount > 0) {
      return;
    }

    this.scv && this.scv.scrollResponderScrollTo(0, this._headerHeight);
  },

  onHeaderLayout(e) {
    this._headerHeight = e.nativeEvent.layout.height;
  },

  renderHeader() {
    return (
      <AboutComponent
        user={this._detailUser}
        onOpenRepos={this.onOpenRepos}
        onLayout={this.onHeaderLayout}
        navigator={this.props.navigator}
      />
    )
  },

  renderRow(rowData, sectionID, rowID, highlightRow) {
    return <RepoCell repo={rowData} navigator={this.props.navigator}/>
  },

  render() {
    return (
      <ListView
        ref={(scv) => this.scv = scv}
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        renderHeader={this.renderHeader}
        automaticallyAdjustContentInsets={false}
        contentInset={{top: 64, left: 0, bottom: 49, right: 0}}
        contentOffset={{x:0, y:-64}}
        scrollRenderAheadDistance={50}
      >
      </ListView>
    )
  }
});

const AboutComponent = React.createClass({
  PropTypes: {
    onOpenRepos: React.PropTypes.func,
    user: React.PropTypes.object,
  },

  onPressEmail() {
    console.log('press email');
  },

  onPressBlog() {

  },

  onPressOrg(org) {
    const orgObj = {
        url:org.url,
        title:'Organizations',
    }
    this.props.navigator.push({id:'org',obj:orgObj});
  },

  onFollow() {

  },

  onOpenFollowers() {
    const user = {
      url: this.props.user.followers_url,
      title: 'Followers',
    }
    this.props.navigator.push({id: 'userList', obj: user});
  },

  onOpenFollowing() {
    const user = {
      url: this.props.user.url + '/following',
      title: 'Following',
    }
    this.props.navigator.push({id: 'userList', obj: user});
  },

  onOpenRepos() {
    this.props.onOpenRepos && this.props.onOpenRepos();
  },

  renderOrg(org) {
    return (
      <TouchableOpacity onPress={() => this.onPressOrg(org)}>
        <Image style={styles.orgnizationsImage} source={{uri: org.avatar_url}}/>
      </TouchableOpacity>
    )
  },

  render() {
    const user = this.props.user;

    let userCompany;
    if (user.company) {
      userCompany = (
        <View style={styles.iconTextContainer}>
          <Icon
            name='ion|ios-people-outline'
            size={ICON_SIZE}
            style={styles.icon}
            color={Colors.textGray}/>
          <Text style={styles.profileInfoLocation}>{user.company}</Text>
        </View>
      )
    }

    let userLocation;
    if (user.location) {
      userLocation = (
        <View style={styles.iconTextContainer}>
          <Icon
            name='ion|ios-location-outline'
            size={ICON_SIZE}
            style={styles.icon}
            color={Colors.textGray}/>
          <Text style={styles.profileInfoLocation}>{user.location}</Text>
        </View>
      )
    }

    let userEmail;
    if (user.email) {
      userEmail = (
        <View style={styles.iconTextContainer}>
          <Icon
            name='ion|ios-email-outline'
            size={ICON_SIZE}
            style={styles.icon}
            color={Colors.textGray}/>
          <Text
            style={styles.profileInfoEmailAndSite}
            onPress={this.onPressEmail}
            >{user.email}</Text>
        </View>
      )
    }

    let userBlog;
    if (user.blog) {
      userBlog = (
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

    let userOrg;
    if (user.orgs) {
      userOrg = (
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.orgnizationsText}>Organizations</Text>
          <View style={styles.orgnizations}>
            {user.orgs.map(this.renderOrg)}
          </View>
        </View>
      )
    }

    return (
      <View style={[styles.scvContainerStyle]} {...this.props}>
        <View style={styles.profile}>
          <Image style={styles.profileImage} source={{uri: user.avatar_url}}/>
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
        {userOrg}
        <View style={styles.status}>
          <TouchableOpacity onPress={this.onFollow}>
            <View style={styles.statusFollowButton}>
              <Icon
                name='ion|ios-person-outline'
                size={ICON_SIZE}
                style={styles.icon}
                color='white'/>
              <Text style={styles.statusFollowButtonText}>Follow</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.statusInfo}>
            <TouchableOpacity onPress={this.onOpenFollowers}>
              <View style={styles.statusInfoTouch}>
                <Text style={styles.statusInfoTouchNum}>
                  {user.followers}
                </Text>
                <Text style={styles.statusInfoTouchDes}>
                  Followers
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onOpenRepos}>
              <View style={styles.statusInfoTouch}>
                <Text style={styles.statusInfoTouchNum}>
                  {user.public_repos}
                </Text>
                <Text style={styles.statusInfoTouchDes}>
                  Repos
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onOpenFollowing}>
              <View style={styles.statusInfoTouch}>
                <Text style={styles.statusInfoTouchNum}>
                  {user.following}
                </Text>
                <Text style={styles.statusInfoTouchDes}>
                  Following
                </Text>
              </View>
            </TouchableOpacity>
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
  },
  scvContainerStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    flex: 1,
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
    backgroundColor: 'lightGray',
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
  orgnizations: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    flexWrap: 'wrap',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    paddingLeft: 20,
    paddingBottom: 10,
    paddingTop: 10,
  },
  orgnizationsText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 15,
  },
  orgnizationsImage: {
    width: 30,
    height: 30,
    marginLeft: 3,
    borderRadius: 2,
    marginBottom: 2,
    backgroundColor: 'lightGray',
  },
  status: {
    flexDirection: 'column',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    paddingBottom: 10,
    paddingTop: 10,
  },
  statusFollowButton: {
    alignSelf: 'stretch',
    backgroundColor: '#5ca941',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  statusFollowButtonText: {
    color: 'white',
  },
  statusInfo: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
    paddingBottom: 0,
  },
  statusInfoTouch: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 100,
  },
  statusInfoTouchNum: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 17,
  },
  statusInfoTouchDes: {
    color: 'gray',
    fontSize: 13,
    fontWeight: 'normal'
  },

});

module.exports = UserComponent;
