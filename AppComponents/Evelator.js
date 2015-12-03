
var React = require('react-native');
var {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  ScrollView,
  Dimensions,
} = React;

var deviceWidth = Dimensions.get('window').width;
var precomputeStyle = require('precomputeStyle');
var TAB_UNDERLINE_REF = 'TAB_UNDERLINE';
var RCTUIManager = require('NativeModules').UIManager;

var styles = StyleSheet.create({
  tab: {
    alignSelf: 'center',
    marginLeft: 10,
  },

  tabs: {
    width: deviceWidth,
    height: 30,
    marginTop: 20,
  },

  line: {
    height: 1,
    borderColor: '#ccc',
    alignSelf: 'stretch'
  },

  scvContainerStyle: {
    height: 30,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

const DEFAULT_UNSELECTEDCOLOR = 'rgba(20,20,20,1)';
const DEFAULT_SELECTEDCOLOR = 'rgba(50,50,255,1)';

var EvelatorBar = React.createClass({
  selectedTabIcons: [],
  unselectedTabIcons: [],
  allTabRefs: [],

  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    selectedColor: React.PropTypes.string, //better 'rgba(20,20,20,1)'
    unSelectedColor: React.PropTypes.string,
  },

  getInitialState() {
    return {
      selectedTab: -1,
    }
  },

  goToTab(tab) {
    console.log('page is', tab);
    this.setState({
      selectedTab: tab,
    });
    this._setNeedScrollToTab(tab);
  },

  renderTabOption(name, tab) {
    const unsColor = this.props.unSelectedColor || DEFAULT_UNSELECTEDCOLOR;
    const sColor = this.props.selectedColor || DEFAULT_SELECTEDCOLOR;
    const isActive = this.state.selectedTab === tab;
    const textColor = isActive ? sColor : unsColor;

    return (
      <TouchableOpacity key={name} onPress={() => {this.goToTab(tab)}} style={[styles.tab]}>
        <View >
          <Text key={name}
                style={[{color: textColor}]}
                ref={(text) => this.allTabRefs[tab] = text}>
          {name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },

  _setNeedScrollToTab(tab) {
    const tabText = React.findNodeHandle(this.allTabRefs[tab]);
    RCTUIManager.measure(tabText, (x, y, w, h, px, py) => {
      // textLayout

      var scv = React.findNodeHandle(this.scv);
      RCTUIManager.getContentOffset(scv, (e) => {
        // scv propertys
        console.log('getContentOffset\n', e);

        // text & scv judge event


        RCTUIManager.scrollTo(nodeHandle, 100, 0);

      });
    });    
  },

  render() {
    return (
      <View style={styles.tabs}>
        <ScrollView
          contentContainerStyle={styles.scvContainerStyle}
          horizontal={true}
          automaticallyAdjustContentInsets={false}
          directionalLockEnabled={true}
          alwaysBounceVertical={false}
          showsHorizontalScrollIndicator={false}
          ref={(scv) => this.scv = scv}
        >
          {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
        </ScrollView>
      </View>
    );
  },
});

module.exports = EvelatorBar;
