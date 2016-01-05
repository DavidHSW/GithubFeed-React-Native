const Routes = require('./Routes');
const React = require('react-native');
const { TabBarIOS, } = require('react-native-icons');
const FeedComponent = require('./FeedComponent');
const cssVar = require('cssVar');
const RepoComponent = require('./RepoComponent');
const UserComponent = require('./UserComponent');
const GHWebComponent = require('./GithubWebComponent');

const {
  PixelRatio,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
} = React;

const TABBABIDS = ['feed', 'watching', 'trend', 'personal'];

const NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    var previousRoute = '返回';
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          {previousRoute}
        </Text>
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

const RootTabBar = React.createClass({
  getInitialState: function() {
    return {
      selectedTab: TABBABIDS[0],
    };
  },

  renderScene(route, navigator) {
    switch (route.id) {
      case 'feed': {
        return (
          <FeedComponent
            name={route.name}
            navigator={navigator}
            navigationBar={navigator.NavigationBar}
          />
        )
      }
      case 'repo':
        return <RepoComponent repo={route.obj} navigator={navigator}/>;
      case 'user':
        return <UserComponent user={route.obj} navigator={navigator}/>;
      case 'web':
        return <GHWebComponent html={route.obj.html} navigator={navigator}/>;
    }

    return null;
  },

  render: function() {
    return (
      <TabBarIOS>
        <TabBarIOS.Item
          iconName={'ion|ios-home-outline'}
          selectedIconName={'ion|ios-home'}
          title={'Feed'}
          iconSize={32}
          selected={this.state.selectedTab === TABBABIDS[0]}
          onPress={() => {
            this.setState({
              selectedTab: TABBABIDS[0],
            });
          }}>
          <Navigator
            initialRoute={{id: 'feed'}}
            renderScene={this.renderScene}
            navigationBar={
              <Navigator.NavigationBar
                routeMapper={NavigationBarRouteMapper}
                style={styles.navBar}
              />
            }
          />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Watching"
          iconName={'ion|ios-eye-outline'}
          selectedIconName={'ion|ios-eye'}
          selected={this.state.selectedTab === TABBABIDS[1]}
          onPress={() => {
            this.setState({
              selectedTab: TABBABIDS[1],
            });
          }}>
          <NavigatorIOS style={{flex: 1}} initialRoute={Routes.watchings()}/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Trend"
          iconName={'ion|ios-flame-outline'}
          selectedIconName={'ion|ios-flame'}
          iconSize={32}
          selected={this.state.selectedTab === TABBABIDS[2]}
          onPress={() => {
            this.setState({
              selectedTab: TABBABIDS[2],
            });
          }}>
          <NavigatorIOS style={{flex: 1}} initialRoute={Routes.trends()}/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Setting"
          iconName={'ion|ios-gear-outline'}
          selectedIconName={'ion|ios-gear'}
          selected={this.state.selectedTab === TABBABIDS[3]}
          onPress={() => {
            this.setState({
              selectedTab: TABBABIDS[3],
            });
          }}>
          <NavigatorIOS style={{flex: 1}} initialRoute={Routes.personal()}/>
        </TabBarIOS.Item>
      </TabBarIOS>
    )
  },
});

var styles = StyleSheet.create({
  messageText: {
    fontSize: 17,
    fontWeight: '500',
    padding: 15,
    marginTop: 50,
    marginLeft: 15,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#CDCDCD',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
  },
  navBar: {
    backgroundColor: 'white',
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: cssVar('fbui-bluegray-60'),
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: cssVar('fbui-accent-blue'),
  },
  scene: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#EAEAEA',
  },
});


module.exports = RootTabBar;
