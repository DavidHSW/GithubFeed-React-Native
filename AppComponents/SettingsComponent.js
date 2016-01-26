const React = require('react-native');
const GHService = require('../networkService/GithubServices');
const CommonComponents = require('../commonComponents/CommonComponents');
const { Icon, } = require('react-native-icons');
const Colors = require('../commonComponents/Colors');
const SettingComponent = require('./SettingsCell');
const GFDiskCache = require('../iosComponents/GFDiskCache');

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
  getInitialState() {
    return {
      cachedSize: null,
    };
  },

  componentWillMount() {
    GFDiskCache.getDiskCacheCost((size) => {
      this.setState({
        cachedSize: size,
      });
    });
  },

  render() {
    let cachedSize = this.state.cachedSize ? this.state.cachedSize : '...';
    cachedSize = 'Clear cache, current is: ' + cachedSize;
    return (
      <ScrollView
        style={styles.container}
        automaticallyAdjustContentInsets={false}
        contentInset={{top: 64, left: 0, bottom: 49, right: 0}}
        contentOffset={{x:0, y:-64}}
        >
        <SettingComponent
          iconName={'ion|ios-trash'}
          iconColor={'orange'}
          settingName={cachedSize}
          onPress={() => {GFDiskCache.clearDiskCache((size) => {
            this.setState({
              cachedSize: size,
            });
          })}}/>
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0EFF5',
    flex: 1,
  },
});

module.exports = PersonComponent;
