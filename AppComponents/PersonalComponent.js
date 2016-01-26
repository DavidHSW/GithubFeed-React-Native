const React = require('react-native');
const GHService = require('../networkService/GithubServices');
const CommonComponents = require('../commonComponents/CommonComponents');
const { Icon, } = require('react-native-icons');
const Colors = require('../commonComponents/Colors');
const SettingComponent = require('./SettingsCell');

const {
  View,
  ActivityIndicatorIOS,
  Text,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  Navigator,
  ActionSheetIOS,
} = React;

const ICON_SIZE = 30;

const PersonComponent = React.createClass({
  pressLogin() {
    const isLogined = GHService.isLogined();
    if (isLogined) return;

    this.props.navigator.push({
      id: 'login',
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
      title: 'Please Login now',
    });
  },

  pressLogout() {
    ActionSheetIOS.showActionSheetWithOptions({
      title: 'Are you sure to leave?',
      options:['logout', 'cancel'],
      cancelButtonIndex: 1,
      destructiveButtonIndex: 0,
    },
    (buttonIndex) => {
      if (buttonIndex == 0) {
        GHService.logout();
      }
    });
  },

  render() {
    const user = GHService.currentUser();
    const isLogined = GHService.isLogined();
    const stateText = isLogined ? 'Logined' : 'Better Press to Login';
    const stateColor = isLogined ? Colors.green : 'orange';
    const logoutColor = isLogined ? Colors.red : 'orange';
    const avatarURL = user.avatar || 'a';
    return (
      <ScrollView
        style={styles.container}
        automaticallyAdjustContentInsets={false}
        contentInset={{top: 64, left: 0, bottom: 49, right: 0}}
        contentOffset={{x:0, y:-64}}
        >
        <TouchableHighlight
          underlayColor={'lightGray'}
          style={styles.userTouch}
          onPress={() => this.props.navigator.push({id: 'user', obj: user})}>
          <View style={styles.user}>
            <Image
              source={{uri: avatarURL}}
              style={styles.avatar}
              onLoadEnd={this.avatarLoadEnd}/>
            <View style={styles.nameInfo}>
              <Text style={styles.name}>
                {user.login}
              </Text>
            </View>
            <Text
              style={[styles.loginState, {color: stateColor}]}
              onPress={this.pressLogin}>
              {stateText}
            </Text>
            <Icon
              name='ion|ios-arrow-right'
              size={ICON_SIZE}
              style={styles.arrow}
              color={Colors.textGray}/>
            </View>
        </TouchableHighlight>
        <SettingComponent
          onPress={() => this.props.navigator.push({id: 'settings'})}
          />
        <TouchableOpacity
          style={[styles.logout, {backgroundColor: logoutColor}]}
          onPress={this.pressLogout}>
          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0EFF5',
    flex: 1,
  },
  userTouch: {
    marginTop: 20,
  },
  user: {
    padding: 8,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EDECF1',
  },
  avatar: {
    backgroundColor: 'lightGray',
    borderRadius: 2,
    width: 48,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 0.5,
  },
  nameInfo: {
    flexDirection: 'column',
    marginLeft: 8,
    justifyContent: 'center',
    flex: 1,
  },
  name: {
    color: 'black',
    fontSize: 17,
  },
  arrow: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  settings: {
    height: 44,
  },
  logout: {
    height: 44,
    borderRadius: 3,
    margin: 10,
    marginTop: 40,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  }
});

module.exports = PersonComponent;
