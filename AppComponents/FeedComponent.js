const React = require('react-native');
const RefreshListView = require('./RefreshListView');
const GHService = require('../networkService/GithubServices');
const GHCell = require('./GHEventCell');
const UserComponent = require('./UserComponent');
const GHWebComponent = require('./GithubWebComponent');
const UserListComponent = require('./UserListComponent');
const OrgComponent = require('./OrgComponent');
const cssVar = require('cssVar');
const { TabBarIOS, Icon } = require('react-native-icons');
const Colors = require('../commonComponents/Colors');




const {
  StyleSheet,
  ListView,
  View,
  ActivityIndicatorIOS,
  Text,
  Navigator,
  TouchableOpacity,
} = React;

let FeedsPage = 1;
const MAX_PAGE = 5;
<<<<<<< HEAD

const NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Icon
          name='ion|ios-arrow-back'
          size={30}
          style={{width: 44, height: 44, marginLeft: -18}}
          color={Colors.blue}
        />
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator, index, navState) {
    return null
  },

  Title: function(route, navigator, index, navState) {
    let title;
    switch (route.id) {
      case 'feed':
        title = 'Feed';
        break;
      case 'repo':
        title = route.obj.name;
        break;
      case 'user':
        title = route.obj.login;
        break;
      case 'web':
        title = route.obj.title;
        break;
      case 'userList':
        title = route.obj.title;
        break;
      case 'org':
        title = route.obj.title;
        break;
    }
    return (
      <Text style={[styles.navBarText,
                    styles.navBarTitleText,
                    {width: 200, height: 40, textAlign: 'center'}]}
            numberOfLines={1}>
        {title}
      </Text>
    );
  },
};

=======
>>>>>>> 51df17cda54d6567557f21afb267945b498bbd61
const FeedComponent = React.createClass({
  handleReloadData(response) {
    const body = response._bodyInit;
    const jsonResult = JSON.parse(body);

    return jsonResult;
  },

  needNextPage() {
    return FeedsPage < MAX_PAGE;
  },

  reloadPromise() {
    FeedsPage = 1;
    return GHService.getFeeds(FeedsPage);
  },

  appendPromise() {
    FeedsPage ++;
    return GHService.getFeeds(FeedsPage);
  },

  renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <GHCell key={rowID} ghEvent={rowData} navigator={this.props.navigator}/>
    )
  },

  handleError(err) {
<<<<<<< HEAD
    console.log('FeedComponent handle error: ' + err);
  },

  renderScene(route, navigator) {
    switch (route.id) {
      case 'feed': {
        return (
          <RefreshListView
            handleReloadData={this.handleReloadData}
            handleAppendData={this.handleReloadData}
            reloadPromise={this.reloadPromise}
            needNextPage={this.needNextPage}
            appendPromise={this.appendPromise}
            renderRow={this.renderRow}
            handleError={this.handleError}
            name={route.name}
            navigator={navigator}
          />
        )
      }
      case 'user':
        return <UserComponent user={route.obj} navigator={navigator}/>;
      case 'web':
        return <GHWebComponent html={route.obj.html} navigator={navigator}/>;
      case 'userList':
        return <UserListComponent userListURL={route.obj.url} navigator={navigator}/>;
      case 'org':
        return <OrgComponent org = {route.obj}
        navigator={navigator}/>

=======
    if (!err.isReloadError) {
      FeedsPage --;
>>>>>>> 51df17cda54d6567557f21afb267945b498bbd61
    }
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

module.exports = FeedComponent;
