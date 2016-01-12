const React = require('react-native');
const GHService = require('../networkService/GithubServices');
const CommonComponents = require('../commonComponents/CommonComponents');
const ScrollableTabView = require('react-native-scrollable-tab-view');
const { Icon, } = require('react-native-icons');
const Colors = require('../commonComponents/Colors');
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

  render(){
    return (
      <View>
        <View style = {{height:64}} />
        <AboutComponent org={this.props.org}/>
        <ScrollableTabView renderTabBar={() => <FacebookTabBar />}>
          <RepoList tabLabel="ion|ios-paper" org={this.props.org}/>
          <MemberList tabLabel="ion|person-stalker" org={this.props.org}/>
        </ScrollableTabView>
      </View>
    )
  }
});

const RepoList = React.createClass({
  _detailOrg:{},

  getInitialState() {
    const dataSourceParam = {
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }

    return {
      dataSource: new ListView.DataSource(dataSourceParam),
      orgReposLoaded: false,
    };
  },

  componentWillMount() {
    this._detailOrg = this.props.org;
    const orgURL = this._detailOrg.url;

    GHService.fetchPromise(orgURL)
      .then(res => {
        const resOrg = JSON.parse(res._bodyInit);
        const repoURL = resOrg.repos_url + '?sort=updated';
        return GHService.fetchPromise(repoURL);
      })
      .then(res => {
        const repos = JSON.parse(res._bodyInit);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(repos),
          orgReposLoaded: true,
        });
      })
      .catch(err => {console.log('promise err', err);});
  },

  renderRow(rowData, sectionID, rowID, highlightRow) {
    return <RepoCell repo={rowData} navigator={this.props.navigator}/>
  },

  render() {
    return (
      <ListView
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        automaticallyAdjustContentInsets={false}
        contentInset={{top: 0, left: 0, bottom: 49, right: 0}}
        contentOffset={{x:0, y:0}}
        scrollRenderAheadDistance={50}
        >
      </ListView>
    )
  }
});

const MemberList = React.createClass({
  _memberListURL:{},

  getInitialState() {
    return {
      orgReposLoaded: false,
    };
  },

  componentWillMount() {
    const orgURL = this.props.org.url;

    GHService.fetchPromise(orgURL)
      .then(res => {
        const resOrg = JSON.parse(res._bodyInit);
        const cutIndex = resOrg.members_url.indexOf('{');
        this._memberListURL = resOrg.members_url.substring(0,cutIndex);
        this._memberListURL += '?sort=updated';
        this.setState({
          orgReposLoaded: true,
        });
      })
      .catch(err => {console.log('promise err', err);});
  },

  render() {
    if(this.state.orgReposLoaded){
      return (
        <UserListComponent userListURL = {this._memberListURL}/>
        // <ListView
        //   style={styles.container}
        //   dataSource={this.state.dataSource}
        //   renderRow={this.renderRow}
        //   automaticallyAdjustContentInsets={false}
        //   contentInset={{top: 0, left: 0, bottom: 49, right: 0}}
        //   contentOffset={{x:0, y:-64}}
        //   scrollRenderAheadDistance={50}
        //   >
        // </ListView>
      )
    }else {
      return(
        <ScrollView/>
      );
    }

  }
});

const AboutComponent = React.createClass({
  _detailOrg:{},

  getInitialState(){
    return {
      orgDetailLoaded:false,
    };
  },

  componentWillMount(){
    this._detailOrg = this.props.org;
    const orgURL = this._detailOrg.url;

    GHService.fetchPromise(orgURL)
      .then(res => {
        const resOrg = JSON.parse(res._bodyInit);
        this._detailOrg = Object.assign(this._detailOrg, resOrg);
        this.setState({
          orgDetailLoaded: true,
        });
      })
      .catch(err => {console.log('promise err', err);});

  },

  onPressEmail() {
    console.log('press email');
  },

  onPressBlog() {

  },

  render() {
    const org = this._detailOrg;

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
            >{org.blog}</Text>
        </View>
      )
    }

    return (
      <View style={[styles.scvContainerStyle]}>
        <View style={styles.profile}>
          <Image style={styles.profileImage} source={{uri: org.avatar_url}}/>
          <View style={styles.profileInfo}>
            <Text style={styles.profileInfoName}>{org.name}</Text>
            <Text style={styles.profileInfoNickName}>{org.login}</Text>
            {orgCompany}
            {orgLocation}
            {orgEmail}
            {orgBlog}
          </View>
        </View>
      </View>
   )
  }
});

// const OrgTabBar = React.createClass({
//   render() {
//     return (
//       <View style={styles.tabs}>
//         <TouchableOpacity>
//             <View><Text>t1</Text></View>
//         </TouchableOpacity>
//         <TouchableOpacity>
//             <View><Text>t2</Text></View>
//         </TouchableOpacity>
//       </View>
//    )
//   }
// });

var styles = StyleSheet.create({
  // tabs: {
  //   height: 45,
  //   flexDirection: 'row',
  //   paddingTop: 5,
  //   borderWidth: 1,
  //   borderTopWidth: 0,
  //   borderLeftWidth: 0,
  //   borderRightWidth: 0,
  //   borderBottomColor: 'rgba(0,0,0,0.05)',
  // },
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
    backgroundColor:'lightGray',
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
