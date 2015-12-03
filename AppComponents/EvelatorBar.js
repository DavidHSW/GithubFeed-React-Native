
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

  renderTabOption(name, page) {
    const unsColor = this.props.unSelectedColor || DEFAULT_UNSELECTEDCOLOR;
    const sColor = this.props.selectedColor || DEFAULT_SELECTEDCOLOR;
    const isActive = this.props.activeTab === page;
    const textColor = isActive ? sColor : unsColor;

    // console.log('animation value is: ' + this.props.activeTab);

    return (
      <TouchableOpacity key={name} onPress={() => this.props.goToPage(page)} style={[styles.tab]}>
        <View >
          <Text key={name}
                style={[{color: textColor}]}
                ref={(text) => this.allTabRefs[page] = text}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },

  _setNeedScrollPage(value) {

    if (value > 5) {
      var nodeHandle = React.findNodeHandle(this.scv);
      RCTUIManager.scrollTo(nodeHandle, 100, 0);
      RCTUIManager.getContentOffset(nodeHandle, (e) => {
        console.log('getContentOffset\n', e);
      });
    }
  },

  setAnimationValue(value) {
    // console.log('animation value is: ' + value);
    this._setNeedScrollPage(value);

  },

  contentSizeChange(e) {
    console.log('contentSizeChange\n', e.nativeEvent);
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
        <ScrollView
          onContentSizeChange={this.contentSizeChange}
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
