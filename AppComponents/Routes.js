const React = require('react-native');
const { Icon } = require('react-native-icons');
const cssVar = require('cssVar');
const Colors = require('../commonComponents/Colors');
const GHService = require('../networkService/GithubServices');
const Dimensions = require('Dimensions');
const ScreenWidth = Dimensions.get('window').width;

const {UserComponent} = require('./UserComponent');
const GHWebComponent = require('./GithubWebComponent');
const UserListComponent = require('./UserListComponent');
const FeedComponent = require('./FeedComponent');
const LoginComponent = require('./LoginComponent');
const OrgComponent = require('./OrgComponent');
const PersonalComponent = require('./PersonalComponent');
const WatchingComponent = require('./WatchingComponent');
const SettingsComponent = require('./SettingsComponent');
const RepoListComponent = require('./RepoListComponent');
const ExploreComponent = require('./ExploreComponent');
const SearchComponent = require('./SearchComponent');
const ShowCaseComponent = require('./ShowcaseComponent');

const {
  Navigator,
	TouchableOpacity,
	StyleSheet,
	PixelRatio,
	Text,
  TextInput,
  View,
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
            <Text style={[styles.navBarText, {marginRight: 10}]}>
              Cancel
            </Text>
          </TouchableOpacity>
        )
      }
        break;
      // case 'search': {
      //   rightButton = (
      //     <TouchableOpacity onPress={route.sp.onChooseLang}>
      //       <Text style={[styles.navBarText, {marginRight: 20, color: Colors.blue}]}>
      //         Language
      //       </Text>
      //     </TouchableOpacity>
      //   )
      // }
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
      case 'settings':
        title = "Settings";
        break;
      case 'repos':
        title = route.obj.title;
        break;
      case 'explore':
        title = 'explore';
        break;
      case 'search':
        title = 'search';
        break;
      case 'showcase':
        title = route.obj.name;
        break;
    }
    const searchPlaceholder = 'Search users, repos';
    if (title == 'explore') {
      return (
        <TouchableOpacity
          style={[styles.searchBar, {justifyContent: 'center'}]}
          onPress={() => {navigator.push({id: 'search'})}}
          >
          <Icon
            name={'ion|ios-search'}
            size={20}
            style={styles.searchIcon}
            color={Colors.black}
          />
          <Text style={[styles.textInput, {alignSelf: 'center', flex: 0}]}>
            {searchPlaceholder}
          </Text>
        </TouchableOpacity>
      )
    } else if (title == 'search') {
      return (
        <View style={[styles.searchBar, {width: ScreenWidth - 40, marginLeft: 40}]}>
          <Icon
            name={'ion|ios-search'}
            size={20}
            style={styles.searchIcon}
            color={Colors.black}
          />
          <TextInput
            style={[styles.textInput]}
            placeholder={searchPlaceholder}
            autoFocus={true}
            onChangeText={route.sp.onChangeText}
            onSubmitEditing={route.sp.onSubmitEditing}
            clearButtonMode={'while-editing'}
            />
        </View>
      )
    } else {
      return (
        <Text style={[styles.navBarText,
                      styles.navBarTitleText,
                      {width: 200, height: 40, textAlign: 'center'}]}
              numberOfLines={1}>
          {title}
        </Text>
      );
    }
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
      case 'settings':
        return <SettingsComponent navigator={navigator}/>;
      case 'repos':
        return <RepoListComponent navigator={navigator} repoListURL={route.obj.url}/>;
      case 'explore':
        return <ExploreComponent navigator={navigator}/>;
      case 'search':
        /**
         * Here's a little tricky for pass the textInput's onChangeText callback
         *
         * I do it by several steps:
         * 1. pass the route to SearchComponent's props
         * 2. in SearchComponent's componentWillMount pass it to route
         * 3. in Navigator's renderTitle, use SearchComponent's onChangeText for
         * 		callback
         *
         * Maybe some RN version will change Navigator's renderScene and renderTitle
         * So need some better approach.
         */
        return <SearchComponent navigator={navigator} route={route}/>;
      case 'showcase':
        return <ShowCaseComponent navigator={navigator} showcase={route.obj}/>;
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
  searchBar: {
    padding: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: ScreenWidth - 10,
    height: 35,
    // borderWidth: 1,
    // borderColor: Colors.borderColor,
    borderRadius: 4,
    margin: 5,
    backgroundColor: Colors.backGray,
  },
  searchIcon: {
    marginLeft: 3,
    marginRight: 3,
    width: 20,
    height: 20
  },
  textInput: {
    fontSize: 15,
    alignSelf: 'stretch',
    flex: 1,
    color: Colors.black,
  },
});

module.exports = routes;
