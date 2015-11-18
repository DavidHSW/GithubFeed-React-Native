const React = require('react-native');
const Colors = require('./Colors');

const {
  StyleSheet,
} = React;

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  lineStyle: {
    width: 3,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    backgroundColor: Colors.red,
  },

  floorTopText: {
    fontSize: 16,
    marginLeft: 5,
    color: Colors.textBlack,
    alignSelf: 'center',
  },

  shadowLine: {
    shadowColor: '#999999',
    shadowOpacity: 0.8,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 1
    },
  },

});

module.exports = commonStyles;
