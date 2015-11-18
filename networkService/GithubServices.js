const _ = require('underscore');
const config = require('../config');
const {EventEmitter} = require('events');
const URL = require('url');
const React = require('react-native');
const {
  AsyncStorage,
} = React;

const API_PATH = 'https://api.github.com';
const LOGIN_PATH = 'https://github.com/login/oauth/authorize'
                    +'?client_id=' + config.GithubClientId
                    +'&redirect_uri=' + config.redirectURI;
const GH_ACCESSTOKEN_KEY = 'GH_ACCESSTOKEN_KEY';
let GLOBAL_TOKEN = '';

class GithubService extends EventEmitter {
  getLoginURL() {
    return LOGIN_PATH;
  }

  handleDidLogin(ne) {
    const self = this;
    const query = URL.parse(ne.url, true).query;
    const token = query.code;
    if (!token || GLOBAL_TOKEN.length > 0 || token === GLOBAL_TOKEN) {
      console.log('handleLoginToken thisToken: ' + GLOBAL_TOKEN + 'nowToken: ' + token);
    } else {
      GLOBAL_TOKEN = token;
      AsyncStorage.setItem(GH_ACCESSTOKEN_KEY, token, ((error) => {
        if (error) {
          console.log('store token falied: ' + error);
        }
        console.log('save token: ' + token);
      }))

      SingleGHService.emitLogin();
    }
  }

  emitLogin() {
    super.emit('login');
  }

  isLogined() {
    console.log('isLogined: ' + GLOBAL_TOKEN);
    return GLOBAL_TOKEN.length > 0;
  }

  constructor() {
    super();
    AsyncStorage.getItem(GH_ACCESSTOKEN_KEY, ((error, result) => {
      if (!error && result) {
        console.log('result is:' + JSON.stringify(result));
        GLOBAL_TOKEN = result;
      }
    }));
  }
}

const SingleGHService = new GithubService();

module.exports = SingleGHService;
