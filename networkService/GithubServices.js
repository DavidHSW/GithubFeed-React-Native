const _ = require('underscore');
const config = require('../config');
const {EventEmitter} = require('events');
const URL = require('url');
const React = require('react-native');
const DXUtils = require('../iosComponents/DXRNUtils');

const {
  AsyncStorage,
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
            console.log('result is:' + result);
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

  emitLogin() {
    this.emit('login');
  }

  isLogined() {
    return GLOBAL_USER.tokenInfo.token.length > 0;
  }

  login(name, pwd) {
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

          SingleGHService.emitLogin();

          return SingleGHService._setNeedSaveGlobalUser();
        })
        .catch(err => {
          console.log('login error is:' + err);
        })
    )
  }

  logout() {
    return new Promise(function(resolve, reject) {
      fetch(AUTH_URL_PATH + '/' + GLOBAL_TOKEN.id, {
        method: 'DELETE',
        headers: this.tokenHeader()
      })
        .catch(err => {
          console.log('logout err is: ' + err);
        })
      GLOBAL_USER = EMPTY_USER;
      AsyncStorage.removeItem(GH_USER_KEY);
      DXUtils.clearCookie();
      resolve(null);
    });
  }

  tokenHeader() {
    const tokenHeader = {
      'Authorization': 'token ' + GLOBAL_USER.tokenInfo.token,
      'User-Agent': config.userAgent
    }

    return tokenHeader;
  }

  getNotifications() {
    if (!this.isLogined()) return;

    fetch(API_PATH + '/notifications', {
      headers: this.tokenHeader(),
    })
      .then(response => {
        console.log('getNotifications res is: ' + JSON.stringify(response));
      })
  }

  _setNeedSaveGlobalUser() {
    return AsyncStorage.setItem(GH_USER_KEY, JSON.stringify(GLOBAL_USER));
  }
}

const SingleGHService = new GithubService();

module.exports = SingleGHService;
