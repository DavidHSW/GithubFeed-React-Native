const React = require('react-native');

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

var numbers = ['Repos', 'Following', 'Stars', 'ok', 'baby', 'come', 'go', 'where', 'mars', 'japan', 'shanghai', 'nanjing'];

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
