const React = require('react-native');
const DXTextMenu = require('../iosComponents/DXTextMenu');
const LoginComponent = require('./LoginComponent');
const LoginMixin = require('./LoginMixin');

const OPTIONS = ['你好', '问号', '狗带', '好玩', '你好', '问号', '狗带', '好玩', '你好', '问号', '狗带', '好玩'];

const WatchingComponent = React.createClass({
  mixins: [
    LoginMixin,
  ],

  render() {
    if (this.state.logined) {
      return (
        <DXTextMenu
          ref={(textMenu) => this.textMenu = textMenu}
          style={{height: 38, marginTop: 100}}
          options={OPTIONS}
          selectedColor={'blue'}
          blur={true}
          blurEffectStyle={2}
          contentInset={{top: 0, left: 0, bottom: 0, right: 0}}
        />
      )
    } else {
      return (
        <LoginComponent />
      )
    }
  },
});

module.exports = WatchingComponent;
