const React = require('react-native');
const { Icon } = require('react-native-icons');
const UserComponent = require('./UserComponent');
const GHWebComponent = require('./GithubWebComponent');
const UserListComponent = require('./UserListComponent');
const FeedComponent = require('./FeedComponent');
const cssVar = require('cssVar');
const Colors = require('../commonComponents/Colors');

const {
  Navigator,
	TouchableOpacity,
	StyleSheet,
	PixelRatio,
	Text,
} = React;

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
    }

    return null;
	}
}

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
