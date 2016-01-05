const React = require('react-native');

const {
  WebView,
} = React;

const hideJS = `
  ;(function GHHide() {
    var args = Array.prototype.slice.call(arguments);
    for (var i = 0; i < args.length; i++) {
      var className = args[i];
      try {
        document.getElementsByClassName(className)[0].style.display="none";
      } catch (e){};
    }
  })('nav-bar',
     'breadcrumb blob-breadcrumb',
     'discussion-block-header',
     'discussion-reply-container',
     'discussion-block-header',
     'thread-subscription-status',
     'clearfix',
     'follow'
     );
`;

const GithubWebComponent = React.createClass({
  onNavigationStateChange(e) {
    console.log('web changed', e);
  },

  render() {
    return (
      <WebView
        url={this.props.html}
        onNavigationStateChange={this.onNavigationStateChange}
        injectedJavaScript={hideJS}
        automaticallyAdjustContentInsets={false}
        contentInset={{top: 64, left: 0, bottom: 49, right: 0}}
        startInLoadingState={true}
      />
    )
  },
});


module.exports = GithubWebComponent;
