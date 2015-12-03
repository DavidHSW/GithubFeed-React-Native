
var React = require('react-native');
var {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} = React;

var deviceWidth = Dimensions.get('window').width;
var precomputeStyle = require('precomputeStyle');
var TAB_UNDERLINE_REF = 'TAB_UNDERLINE';

var styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignSelf: 'center',
    paddingBottom: 10,
    alignItems: 'center',
  },

  tabs: {
    height: 50,
    flexDirection: 'row',
    marginTop: 20,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
  },

  textStyle: {
    position: 'absolute',
     top: 0,
  }
});

var DefaultTabBar = React.createClass({
  selectedTabIcons: [],
  unselectedTabIcons: [],

  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array
  },

  renderTabOption(name, page) {
    var isTabActive = this.props.activeTab === page;

    return (
      <TouchableOpacity key={name} onPress={() => this.props.goToPage(page)} style={[styles.tab]}>
        <View >
          <Text style={[{color: 'red'}, styles.textStyle]} ref={(text) => this.selectedTabIcons[page] = text}>
            {name}
          </Text>
          <Text style={[{color: 'gray'}, styles.textStyle]} ref={(text) => this.unselectedTabIcons[page] = text}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },

  setAnimationValue(value) {
    this.refs[TAB_UNDERLINE_REF].setNativeProps(precomputeStyle({
      left: (deviceWidth * value) / this.props.tabs.length
    }));

    this.unselectedTabIcons.forEach((icon, i) => {
      var iconRef = icon;

      if (value - i >= 0 && value - i <= 1) {
        iconRef.setNativeProps({opacity: value - i});
      }
      if (i - value >= 0 &&  i - value <= 1) {
        iconRef.setNativeProps({opacity: i - value});
      }
    });
  },

  render() {
    var numberOfTabs = this.props.tabs.length;
    var tabUnderlineStyle = {
      position: 'absolute',
      width: deviceWidth / numberOfTabs,
      height: 4,
      backgroundColor: 'navy',
      bottom: 0,
    };

    return (
      <View style={styles.tabs}>
        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
        <View style={tabUnderlineStyle} ref={TAB_UNDERLINE_REF} />
      </View>
    );
  },
});

module.exports = DefaultTabBar;
