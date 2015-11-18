/**
 * @providesModule DXTopMessageManager
 * @flow
 */
'use strict';

var React = require('react-native');
var {
  DeviceEventEmitter,
  NativeModules: {
    DXTopMessageManager,
  }
} = React;

/**
 * A pull down to refresh control like the one in Apple's iOS6 Mail App.
 */

var MESSAGE_TAPPED = 'messageTapped';

var callbacks = {};

var subscription = DeviceEventEmitter.addListener(
  MESSAGE_TAPPED,
  (reactTag) => callbacks[reactTag]()
);
// subscription.remove();

var DXRNTopMessage = {
  showTopMessage(node, message, config, callback) {
    var nodeHandle = React.findNodeHandle(node) || 1;
    DXTopMessageManager.showTopMessage(nodeHandle, message, config, () => {
      callbacks[nodeHandle] = callback;
    });
  },
};

module.exports = DXRNTopMessage;
