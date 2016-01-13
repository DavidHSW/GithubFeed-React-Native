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
} = React;

 const ICON_SIZE = 30;

const PersonComponent = React.createClass({
  avatarLoadEnd(e) {
    console.log('onImage load end', e);
  },

  render() {
    const user = GHService.currentUser();
    console.log('user', user);
    return (
      <ScrollView
        style={styles.container}
        automaticallyAdjustContentInsets={false}
        contentInset={{top: 64, left: 0, bottom: 49, right: 0}}
        contentOffset={{x:0, y:-64}}
        >
        <TouchableHighlight underlayColor={'lightGray'} style={styles.userTouch}>
          <View style={styles.user}>
            <Image
              source={{uri: user.avatar}}
              style={styles.avatar}
              onLoadEnd={this.avatarLoadEnd}/>
            <View style={styles.nameInfo}>
              <Text style={styles.name}>
                {user.username}
              </Text>
            </View>
            <Icon
              name='ion|ios-arrow-right'
              size={ICON_SIZE}
              style={styles.arrow}
              color={Colors.textGray}/>
            </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor={'lightGray'} style={styles.userTouch}>
          <View style={styles.user}>
            <Icon
              name='ion|ios-cog'
              size={ICON_SIZE}
              style={styles.arrow}
              color={Colors.blue}/>
            <View style={styles.nameInfo}>
              <Text style={styles.name}>
                Settings
              </Text>
            </View>
            <Icon
              name='ion|ios-arrow-right'
              size={ICON_SIZE}
              style={styles.arrow}
              color={Colors.textGray}/>
          </View>
        </TouchableHighlight>
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
});

module.exports = PersonComponent;
