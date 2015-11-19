var React = require('react-native');
var {
  NativeModules: {
    DXRNUtils,
  }
} = React;

var Uitls = {
  clearCookie(cb) {
    console.log('clear cookies');
    DXRNUtils.clearCookies((error, results) => {
      if (error) {
        console.log('clearCookie error occured' + error);
      }
    });
  }
};

module.exports = Uitls;
