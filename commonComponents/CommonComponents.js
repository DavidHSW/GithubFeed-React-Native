const React = require('react-native');
const Colors = require('./Colors');
const CommonStyles = require('./CommonStyles');

const {
  StyleSheet,
  View,
  ActivityIndicatorIOS,
  Text,
} = React;

class CommonComponents {
  static renderLoadingView() {
    return (
      <View style={CommonStyles.container}>
        <ActivityIndicatorIOS size="large" />
      </View>
    );
  }

  static renderPlaceholder(text, image, onPress) {
    return (
      <View>
      </View>
    )
  }

  static renderSepLine() {
    return (
      <View style={CommonStyles.sepLine}>
      </View>
    )
  }
}

module.exports = CommonComponents;
