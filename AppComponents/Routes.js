const React = require('react-native');
const { Icon } = require('react-native-icons');
const cssVar = require('cssVar');
const Colors = require('../commonComponents/Colors');
const GHService = require('../networkService/GithubServices');

const {UserComponent} = require('./UserComponent');
const GHWebComponent = require('./GithubWebComponent');
const UserListComponent = require('./UserListComponent');
const FeedComponent = require('./FeedComponent');
const LoginComponent = require('./LoginComponent');
const OrgComponent = require('./OrgComponent');
const PersonalComponent = require('./PersonalComponent');
const WatchingComponent = require('./WatchingComponent');

const {
  Navigator,
	TouchableOpacity,
	StyleSheet,
	PixelRatio,
	Text,
} = React;

const NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    if (index === 0 || route.id === 'login') {
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
    let rightButton;
    switch (route.id) {
      case 'login': {
        rightButton = (
          <TouchableOpacity onPress={() => navigator.pop()}>
            <Text style={[styles.navBarText, {marginRight: 20}]}>
              Cancel
            </Text>
          </TouchableOpacity>
        )
      }
        break;
      default:
    }

    return rightButton;
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
      case 'login':
        title = route.title;
        break;
      case 'org':
        title = 'org';
        break;
      case 'me':
        title = 'Me';
        break;
      case 'watching':
        title = 'Watching';
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

const routes = {
	navigator: function (initialRoute) {
		return (
			<Navigator
				initialRoute={{id: initialRoute}}
				renderScene={this.renderScene}
        configureScene={(route) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.FloatFromRight;
        }}
				navigationBar={
					<Navigator.NavigationBar
						routeMapper={NavigationBarRouteMapper}
						style={styles.navBar}
					/>
				}
			/>
		);
	},
	renderScene: function (route, navigator) {
		switch (route.id) {
      case 'feed':
        return <FeedComponent navigator={navigator}/>
      case 'user':
        return <UserComponent user={route.obj} navigator={navigator}/>;
      case 'web':
        return <GHWebComponent webURL={route.obj.html} param={route.obj} navigator={navigator}/>;
      case 'userList':
        return <UserListComponent userListURL={route.obj.url} navigator={navigator}/>;
      case 'login':
        return (
          <LoginComponent
            navigator={navigator}
            nextPromise={route.nextPromiseFunc}
            />
        )
      case 'org':
        return <OrgComponent navigator={navigator} org={route.obj}/>;
      case 'me':
        return <PersonalComponent navigator={navigator}/>;
      case 'watching':
        return <WatchingComponent navigator={navigator}/>;
    }

    return null;
	}
}

const styles = StyleSheet.create({
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
    borderBottomColor: 'lightGray',
    borderBottomWidth: 0.5,
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

module.exports = routes;
