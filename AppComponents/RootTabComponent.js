const React = require('react-native');
const { TabBarIOS, Icon } = require('react-native-icons');
const FeedComponent = require('./FeedComponent');
const TABBABIDS = ['feed', 'watching', 'trend', 'personal'];
const Routes = require('./Routes');
const {
  NavigatorIOS,
} = React;

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
          {Routes.navigator('feed')}
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
          {Routes.navigator('watching')}
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
          {Routes.navigator('feed')}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Settings"
          iconName={'ion|ios-person-outline'}
          selectedIconName={'ion|ios-gear'}
          selected={this.state.selectedTab === TABBABIDS[3]}
          onPress={() => {
            this.setState({
              selectedTab: TABBABIDS[3],
            });
          }}>
          {Routes.navigator('me')}
        </TabBarIOS.Item>
      </TabBarIOS>
    )
  },
});

module.exports = RootTabBar;
