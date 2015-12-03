const React = require('react-native');
const GHService = require('../networkService/GithubServices');
const ScrollableTabView = require('react-native-scrollable-tab-view');
const CommonComponents = require('../commonComponents/CommonComponents');
const ScrollingTabBar = require('./ScrollingTabBar');
const EvelatorBar = require('./EvelatorBar');

const {
  View,
  ActivityIndicatorIOS,
  Text,
  StyleSheet,
} = React;

var styles = StyleSheet.create({
  evelatorBar: {
    height: 30,
  }
});


const UserComponent = React.createClass({
  getInitialState() {
    return {
      selectedTab: 0,
      config: {
        a: 1,
        b: 2,
      }
    }
  },

  componentDidMount() {
    // this.state.config.a = 3;
    this.setState({
      config:  {},
    });
  },

  renderRounds() {
    var numbers = ['Repos', 'Following', 'Stars', 'ok', 'baby', 'come', 'go', 'where', 'mars', 'japan', 'shanghai', 'nanjing'];

    return numbers.map((n) => {
      return (
        <View tabLabel={n} style={{backgroundColor: 'red', margin: 100, flex: 1}}/>
      )
    })
  },

  onChangeTab({i, ref}) {
    setTimeout(() => {
      this.setState({selectedTab: i});
    }, 500);
  },

  render() {
    return (
      <View style={styles.container}>
        <ScrollableTabView
          style={{backgroundColor: '#fff'}}
          onChangeTab={this.onChangeTab}
          edgeHitWidth={200}
          renderTabBar={() => <EvelatorBar style={styles.evelatorBar} />}>
          {this.renderRounds()}
        </ScrollableTabView>
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
});


module.exports = UserComponent;
