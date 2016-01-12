const config = require('../config');
const {EventEmitter} = require('events');
const React = require('react-native');
const DXUtils = require('../iosComponents/DXRNUtils');
const MockFeedJSON = require('./mockFeed');

const {
  AsyncStorage,
  Navigator,
} = React;

const API_PATH = 'https://api.github.com';
const AUTH_URL_PATH = API_PATH + '/authorizations';

const GH_USER_KEY = 'GH_USER_KEY';

const EMPTY_TOKEN = {
  id: '',
  token: ''
};
const EMPTY_USER = {
  username: '',
  password: '',
  avatar: '',
  userId: '',
  tokenInfo: EMPTY_TOKEN,
};
let GLOBAL_USER = EMPTY_USER;

/*
  User has two state:
  1. onboard (just enter username)
  2. login (will has the accessToken)
*/
class GithubService extends EventEmitter {
  constructor() {
    super();
  }

  queryLoginState() {
    return (
      AsyncStorage.getItem(GH_USER_KEY)
        .then(result => {
          if (result) {
            console.log('GHService start user is:' + result);
            GLOBAL_USER = JSON.parse(result);
          }
          return GLOBAL_USER;
        })
        .catch(err => {
          console.log('loginErr is: ' + err);
        })
      );
  }

  emitOnboard() {
    this.emit('onboard');
  }

  isOnboard() {
    return GLOBAL_USER.username.length > 0;
  }

  onboard(username) {
    GLOBAL_USER = EMPTY_USER;
    GLOBAL_USER.username = username;
    SingleGHService.emitOnboard();
    SingleGHService._setNeedSaveGlobalUser();
  }

  isLogined() {
    return this.isOnboard() && GLOBAL_USER.tokenInfo.token.length > 0;
  }

  login(name, pwd, cb) {
    // const uandp = Base64.encode('xiekw2010@gmail.com:z57482148');
    const uandp = 'eGlla3cyMDEwQGdtYWlsLmNvbTp6NTc0ODIxNDg=';
    console.log('basic is' + uandp);

    return (
      fetch(AUTH_URL_PATH, {
        method: 'POST',
        headers: {
          'Authorization' : 'Basic ' + uandp,
          'User-Agent': 'GithubFeed'
        },
        body: JSON.stringify({
          'client_id': config.GithubClientId,
          'client_secret': config.GithubClientSecret,
          'scopes': config.scopes,
          'note': 'not abuse'
        })
      })
        .then((response) => {
          const body = response._bodyInit;
          const jsonResult = JSON.parse(body);
          const token = jsonResult.token;
          const tokenId = jsonResult.id;
          console.log('body is: ' + JSON.stringify(body), 'jsonResult is: ', jsonResult, 'token is: ', token);
          let tokenInfo = {};
          tokenInfo.id = tokenId;
          tokenInfo.token = token;
          GLOBAL_USER.tokenInfo = tokenInfo;
          GLOBAL_USER.username = name;
          GLOBAL_USER.password = pwd;

          cb && cb(GLOBAL_USER);

          return SingleGHService._setNeedSaveGlobalUser();
        })
    )
  }

  logout(cb) {
    fetch(AUTH_URL_PATH + '/' + GLOBAL_TOKEN.id, {
      method: 'DELETE',
      headers: this.tokenHeader()
    })
      .catch(err => {
        console.log('logout err is: ' + err);
      });

    GLOBAL_USER = EMPTY_USER;
    AsyncStorage.removeItem(GH_USER_KEY);
    DXUtils.clearCookie();

    cb && cb();
  }

  tokenHeader() {
    let tHeader = {
      'User-Agent': config.userAgent,
      'Accept': 'application/vnd.github.v3+json'
    }
    if (this.isLogined()) {
      tHeader.Authorization = 'token ' + GLOBAL_USER.tokenInfo.token;
    }
    console.log('token header is: ' + JSON.stringify(tHeader));

    return tHeader;
  }

  getFeeds(page) {
    if (!this.isOnboard()) return;

    // MockData Mode
    if (config.mockData) {
      return new Promise(function(resolve, reject) {
        setTimeout(function () {
          resolve({_bodyInit: JSON.stringify(MockFeedJSON)})
        }, 1000);
      });
    }

    let feedsURL = API_PATH + '/users/' + GLOBAL_USER.username + '/received_events';
    if (page && page > 0) {
      feedsURL +=  '?page=' + page;
    }
    return (
      fetch(feedsURL, {
        headers: this.tokenHeader()
      })
    )
  }

  getNotifications() {
    if (!this.isLogined()) return;

    return (
      fetch(API_PATH + '/notifications', {
        headers: this.tokenHeader(),
      })
    )
  }

  checkNeedLogin(bobyMessage, navigator) {
    const loginMessages = [
      'exceeded',
      'Bad credentials',
      'Requires authentication'
    ];
    const needLogin = loginMessages.some(item => bobyMessage.indexOf(item) < 0);
    console.log('needLogin', needLogin);
    if (needLogin) {
      navigator.push({
        id: 'login',
        sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
        title: 'Please Login now',
      });
    }
  }

  getRepoHTMLString(userAndRepo) {
    let tokenHeader = this.tokenHeader();
    tokenHeader.Accept = 'application/vnd.github.VERSION.raw';
    const repoURL = API_PATH + '/repos/' + userAndRepo + '/readme';

    return fetch(repoURL, {
      headers: tokenHeader,
    })
  }

  _setNeedSaveGlobalUser() {
    return AsyncStorage.setItem(GH_USER_KEY, JSON.stringify(GLOBAL_USER));
  }

  currentUser() {
    return GLOBAL_USER;
  }

  fetchPromise(url) {
    return fetch(url, {
      headers: this.tokenHeader(),
    });
  }

  // repo: repo_full_name, action: 'GET', 'DELETE', 'PUT'
  repoStarQuery(repo, action) {
    const path = API_PATH + '/user/starred/' + repo;
    const method = action || 'GET';
    return fetch(path, {
      method: method,
      headers: this.tokenHeader(),
    })
  }

  repoWatchQuery(repo, action) {
    const path = API_PATH + '/repos/' + repo + '/subscription';
    const method = action || 'GET';
    return fetch(path, {
      method: method,
      headers: this.tokenHeader(),
    })
  }

  userFollowQuery(targetUser, action) {
    let path = API_PATH + '/users/' + GLOBAL_USER.username + '/following' + targetUser;
    const method = action || 'GET';
    if (this.isLogined() || method !== 'GET') {
      path = API_PATH + '/user/following/' + targetUser;
    }
    return fetch(path, {
      method: method,
      headers: this.tokenHeader(),
    })
  }
}

const SingleGHService = new GithubService();

module.exports = SingleGHService;
