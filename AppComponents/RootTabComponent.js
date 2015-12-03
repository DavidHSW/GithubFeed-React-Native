const Routes = require('./Routes');
const React = require('react-native');
const { TabBarIOS, } = require('react-native-icons');

const {
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
} = React;

const TABBABIDS = ['feed', 'watching', 'trend', 'personal'];

const RootTabBar = React.createClass({
  getInitialState: function() {
    return {
      selectedTab: TABBABIDS[0],
    };
  },

  render: function() {
    return (
      <TabBarIOS>
        <TabBarIOS.Item
          iconName={'ion|ios-home-outline'}
          selectedIconName={'ion|ios-home'}
          title={'Feed'}
          iconSize={32}
          selected={this.state.selectedTab === TABBABIDS[0]}
          onPress={() => {
            this.setState({
              selectedTab: TABBABIDS[0],
            });
          }}>
          <NavigatorIOS style={{flex: 1}} initialRoute={Routes.feeds()}/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Watching"
          iconName={'ion|ios-eye-outline'}
          selectedIconName={'ion|ios-eye'}
          selected={this.state.selectedTab === TABBABIDS[1]}
          onPress={() => {
            this.setState({
              selectedTab: TABBABIDS[1],
            });
          }}>
          <NavigatorIOS style={{flex: 1}} initialRoute={Routes.watchings()}/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Trend"
          iconName={'ion|ios-flame-outline'}
          selectedIconName={'ion|ios-flame'}
          iconSize={32}
          selected={this.state.selectedTab === TABBABIDS[2]}
          onPress={() => {
            this.setState({
              selectedTab: TABBABIDS[2],
            });
          }}>
          <NavigatorIOS style={{flex: 1}} initialRoute={Routes.trends()}/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Setting"
          iconName={'ion|ios-gear-outline'}
          selectedIconName={'ion|ios-gear'}
          selected={this.state.selectedTab === TABBABIDS[3]}
          onPress={() => {
            this.setState({
              selectedTab: TABBABIDS[3],
            });
          }}>
          <NavigatorIOS style={{flex: 1}} initialRoute={Routes.personal()}/>
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  },
});

module.exports = RootTabBar;
