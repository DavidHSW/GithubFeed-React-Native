const React = require('react-native');
const DXTextMenu = require('../iosComponents/DXTextMenu');
const GHService = require('../networkService/GithubServices');

const OPTIONS = ['你好', '问号', '狗带', '好玩', '你好', '问号', '狗带', '好玩', '你好', '问号', '狗带', '好玩'];

const MessageComponent = React.createClass({
  componentWillMount() {
  },

  render() {
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
    );
  },
});

module.exports = MessageComponent;
