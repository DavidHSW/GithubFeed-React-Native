const React = require('react-native');
const { Icon } = require('react-native-icons');
const Colors = require('../commonComponents/Colors');
const GHService = require('../networkService/GithubServices');
const UserList = require('./UserListComponent');

const {
  StyleSheet,
  WebView,
  View,
  TouchableOpacity,
  Text,
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
  _isRepo: false,

  PropTypes: {
    webURL: React.PropTypes.string,
    param: React.PropTypes.object,
  },

  getInitialState() {
    return {
      URL: this.props.webURL,
      backAble: false,
      forwardAble: false,
      refreshAble: false,
    }
  },

  onNavigationStateChange(e) {
    console.log('web changed', e);

    const title = e.title;
    const URLNeedChanged = title.indexOf('Page not found') >= 0 && this._isRepo;
    let url = e.url;
    if (URLNeedChanged) {
      url = 'https://github.com/' + this.props.param.name + '/blob/master/readme.md';
    }
    this.setState({
      URL: url,
      backAble: e.canGoBack,
      forwardAble: e.canGoForward,
      refreshAble: !e.loading && title.length > 0
    });
  },

  componentWillMount() {
    const originURL = this.props.webURL;
    const isRepo = originURL.indexOf('/blob/master') > 0;
    if (isRepo) {

    }
    this._isRepo = isRepo;
  },

  render() {
    console.log('render web');
    let repoToolBar;
    if (this._isRepo) {
      repoToolBar = <RepoToolBar
                      URL={this.props.param.url}
                      navigator={this.props.navigator}/>;
    }

    return (
      <View style={{flex: 1}}>
        {repoToolBar}
        <WebView
          ref={(webView) => this.webView = webView}
          styles={{flex: 1}}
          url={this.state.URL}
          onNavigationStateChange={this.onNavigationStateChange}
          injectedJavaScript={hideJS}
          automaticallyAdjustContentInsets={false}
          contentInset={{top: 0, left: 0, bottom: 49, right: 0}}
          startInLoadingState={true}>
        </WebView>
        <WebToolBar
          goBack={() => this.webView.goBack()}
          goForward={() => this.webView.goForward()}
          onRefresh={() => this.webView.reload()}
          backAble={this.state.backAble}
          forwardAble={this.state.forwardAble}
          refreshAble={this.state.refreshAble}
        />
      </View>
    )
  },
});

const RepoToolBar = React.createClass({
  _repoRes: null,

  PropTypes: {
    URL: React.PropTypes.string,
  },

  getInitialState() {
    return {
      watchNumber: '...',
      starNumber: '...',
      forkNumber: '...',
      watchStatus: 'Watch',
      starStatus: 'Star',
    }
  },

  componentWillMount() {
    GHService.fetchPromise(this.props.URL)
      .then(value => {
        console.log('value', value);
        const res = JSON.parse(value._bodyInit);
        if (!res) return;

        this.setState({
          watchNumber: res.subscribers_count,
          starNumber: res.stargazers_count,
          forkNumber: res.forks_count,
        });
        this._repoRes = res;

        const pms = [
          GHService.repoWatchQuery(this._repoRes.full_name),
          GHService.repoStarQuery(this._repoRes.full_name)
        ];

        return Promise.all(pms);
      })
      .then(value => {
        console.log('pm all', value);
        let watchStatus;
        let starStatus;
        value.forEach((res, idx) => {
          const status = res.status;
          if (idx === 0) {
            watchStatus = status < 400 ? 'Unwatch' : 'Watch';
          } else if (idx === 1) {
            starStatus = status < 400 ? 'Unstar' : 'Star';
          }
        });
        this.setState({
          watchStatus: watchStatus,
          starStatus: starStatus,
        });
      });
  },

  onPressWatch() {
    const isWatch = this.state.watchStatus == 'Unwatch';
    const toggleAction = isWatch ? 'DELETE' : 'PUT';
    const watchQuery = () => {
      return GHService.repoWatchQuery(this._repoRes.full_name, toggleAction);
    };
    const watchThen = (value) => {
      console.log('watch response', value);
      const status = value.status;
      const isNowStar = this.state.watchStatus == 'Unwatch';
      const starStatus = isNowStar ? 'Watch' : 'Unwatch';
      const toggleCount = isNowStar ? -1 : 1;

      if (status < 400) {
        this.setState({
          watchStatus: starStatus,
          watchNumber: this.state.watchNumber + toggleCount
        });
      }
    };

    GHService.checkNeedLoginWithPromise(watchQuery, watchThen, this.props.navigator)
  },

  onPressWatchers() {
    const user = {
      url: this._repoRes.subscribers_url,
      title: 'Watchers',
    }
    this.props.navigator.push({id: 'userList', obj: user});
  },

  onPressStar() {
    const isStar = this.state.starStatus == 'Unstar';
    const toggleAction = isStar ? 'DELETE' : 'PUT';
    const starQuery = () => {
      return GHService.repoStarQuery(this._repoRes.full_name, toggleAction);
    };
    const watchThen = (value) => {
      const status = value.status;
      const isNowStar = this.state.starStatus == 'Unstar';
      const starStatus = isNowStar ? 'Star' : 'Unstar';
      const toggleCount = isNowStar ? -1 : 1;

      if (status < 400) {
        this.setState({
          starStatus: starStatus,
          starNumber: this.state.starNumber + toggleCount
        });
      }
    };

    GHService.checkNeedLoginWithPromise(starQuery, watchThen, this.props.navigator)
  },

  onPressStarers() {
    const user = {
      url: this._repoRes.stargazers_url,
      title: 'Forkers',
    }
    this.props.navigator.push({id: 'userList', obj: user});
  },

  onPressFork() {

  },

  onPressForkers() {
    const user = {
      url: this._repoRes.forks_url,
      title: 'Starers',
    }
    this.props.navigator.push({id: 'userList', obj: user});
  },

  render() {
    return (
      <View style={styles.repoToolBar}>
        <ActionComponent
          iconName={'ion|eye'}
          actionName={this.state.watchStatus}
          actionNumber={this.state.watchNumber}
          onPressAction={this.onPressWatch}
          onPressNumbers={this.onPressWatchers}
        />
        <ActionComponent
          iconName={'ion|ios-star'}
          actionName={this.state.starStatus}
          actionNumber={this.state.starNumber}
          onPressAction={this.onPressStar}
          onPressNumbers={this.onPressStarers}
        />
      </View>
    )
  }
});

const ActionComponent = React.createClass({
  PropTypes: {
    iconName: React.PropTypes.string,
    actionName: React.PropTypes.string,
    actionNumber: React.PropTypes.string,
    onPressAction: React.PropTypes.func,
    onPressNumbers: React.PropTypes.func,
  },
  render() {
    return (
      <View style={styles.action}>
        <TouchableOpacity
          onPress={this.props.onPressAction}
          >
          <View style={styles.leftAction}>
            <Icon
              name={this.props.iconName}
              size={20}
              style={{width: 20, height: 20}}
              color={Colors.black}
            />
            <Text style={styles.actionText}>
              {this.props.actionName}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.props.onPressNumbers}
          style={styles.rightAction}>
          <Text style={[styles.actionText, {marginTop: 2}]}>
            {this.props.actionNumber}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
});

const iconSize = 30;
const WebToolBar = React.createClass({
  PropTypes: {
    goBack: React.PropTypes.func,
    goForward: React.PropTypes.func,
    onRefresh: React.PropTypes.func,
    backAble: React.PropTypes.bool,
    forwardAble: React.PropTypes.bool,
    refreshAble: React.PropTypes.bool,
  },

  goBack() {
    this.props.backAble && this.props.goBack && this.props.goBack();
  },

  goForward() {
    this.props.forwardAble && this.props.goForward && this.props.goForward();
  },

  onRefresh() {
    this.props.refreshAble && this.props.onRefresh && this.props.onRefresh();
  },

  render() {
    const backOpacity = this.props.backAble ? 0.5 : 1.0;
    const backColor = this.props.backAble ? Colors.blue : 'lightGray';

    const forwardOpacity = this.props.forwardAble ? 0.5 : 1.0;
    const forwardColor = this.props.forwardAble ? Colors.blue : 'lightGray';

    const refreshOpacity = this.props.refreshAble ? 0.5 : 1.0;
    const refreshColor = this.props.refreshAble ? Colors.blue : 'lightGray';

    return (
      <View style={styles.webViewToolBar}>
        <View style={styles.webLeft}>
          <TouchableOpacity
            style={{marginRight: 15}}
            onPress={this.props.goBack}
            activeOpacity={backOpacity}>
            <Icon
              name='ion|android-arrow-back'
              size={iconSize}
              style={styles.icon}
              color={backColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginLeft: 15}}
            onPress={this.props.goForward}
            activeOpacity={forwardOpacity}>
            <Icon
              name='ion|android-arrow-forward'
              size={iconSize}
              style={styles.icon}
              color={forwardColor}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{marginRight: 15}}
          onPress={this.props.onRefresh}
          activeOpacity={refreshOpacity}>
          <Icon
            name='ion|android-refresh'
            size={iconSize}
            style={styles.icon}
            color={refreshColor}
          />
        </TouchableOpacity>
      </View>
    )
  }
});

var styles = StyleSheet.create({
  repoToolBar: {
    backgroundColor: '#FAFAFA',
    height: 40,
    marginTop: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  action: {
    borderStyle: 'solid',
    borderColor: '#F2F2F2',
    borderRadius: 2,
    borderWidth: 0.5,
    flexDirection: 'row',
    marginRight: 20,
  },
  leftAction: {
    padding: 3,
    backgroundColor: "#F2F2F2",
    flexDirection: 'row'
  },
  rightAction: {
    padding: 3,
    backgroundColor: "white",
  },
  actionText: {
    color: Colors.black,
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  webViewToolBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    height: 40,
    position: 'absolute',
    left: 0,
    bottom: 49,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  webLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  icon: {
    width: iconSize,
    height: iconSize,
  }
});

module.exports = GithubWebComponent;
