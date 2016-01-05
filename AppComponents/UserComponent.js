const React = require('react-native');
const GHService = require('../networkService/GithubServices');
const CommonComponents = require('../commonComponents/CommonComponents');
const ScrollableTabView = require('react-native-scrollable-tab-view');
const { Icon, } = require('react-native-icons');
const Colors = require('../commonComponents/Colors');

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

  PropTypes: {
    user: React.PropTypes.object,
  },

  getInitialState() {
    return {
      userDetailLoaded: false,
      userReposLoaded: false,
    }
  },

  componentWillMount() {
    this._detailUser = this.props.user;
    const userURL = this._detailUser.url;

    GHService.fetchPromise(userURL)
      .then(res => {
        let resUser = JSON.parse(res._bodyInit);
        this._detailUser = Object.assign(this._detailUser, resUser);
        this.setState({
          userDetailLoaded: true,
        });

        return GHService.fetchPromise(resUser.repos_url);
      })
      .then(res => {
        console.log('repo res', res);
      })
      .catch(err => {console.log('promise err', err);})
  },

  render() {
    return (
      <View style={styles.container}>
        <ScrollableTabView>
          <AboutComponent tabLabel="About" user={this._detailUser}/>
          <RepoListComponent tabLabel="Repositories" user={this._detailUser}/>
        </ScrollableTabView>
      </View>
    )
  }
});

const AboutComponent = React.createClass({
  onPressEmail() {
    console.log('press email');
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
    if (user.userJoined) {
      userJoined = <Text style={styles.profileInfoLocation}>{user.userJoined}</Text>;
    }

    return (
      <ScrollView contentContainerStyle={[styles.scvContainerStyle]}>
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
        <View style={styles.status}>
          <TouchableOpacity>
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
            <TouchableOpacity>
              <View style={styles.statusInfoTouch}>
                <Text style={styles.statusInfoTouchNum}>
                  {user.followers}
                </Text>
                <Text style={styles.statusInfoTouchDes}>
                  Followers
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}}>
              <View style={styles.statusInfoTouch}>
                <Text style={styles.statusInfoTouchNum}>
                  {user.public_repos}
                </Text>
                <Text style={styles.statusInfoTouchDes}>
                  Repos
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}}>
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
      </ScrollView>
   )
  }
});

const RepoListComponent = React.createClass({
  render() {
    return (
      <View style={styles.card}>
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
    marginTop: 64,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  scvContainerStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: '#fff',
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
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    alignSelf: 'stretch',
  },
  profileImage: {
    width: 110,
    height: 110,
    backgroundColor: 'gray',
    borderRadius: 3,
  },
  profileInfo: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    marginLeft: 15,
    justifyContent: 'space-between',
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
  status: {
    flexDirection: 'column',
    padding: 15,
    height: 123,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
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
