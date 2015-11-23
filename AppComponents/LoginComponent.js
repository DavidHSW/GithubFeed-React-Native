const React = require('react-native');
const Colors = require('../commonComponents/Colors');
const Configs = require('../config');
const CommonStyles = require('../commonComponents/CommonStyles');
const CommonComponents = require('../commonComponents/CommonComponents');
const GHService = require('../networkService/GithubServices')

const {
  StyleSheet,
  ActivityIndicatorIOS,
  View,
  Text,
  TouchableHighlight,
  TextInput,
} = React;

const styles = StyleSheet.create({
  loginCard: {
    height: 250,
    margin: 20,
    marginTop: 80,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 2,
  },

  up: {
    flexDirection: 'column',
    backgroundColor: Colors.black,
    height: 38.0,
    borderRadius: 2,
    justifyContent: 'center',
  },

  introText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 18,
    alignSelf: 'flex-start',
    textAlign: 'left',
  },

  indicator: {
    position: 'absolute',
    right: 10,
    top: 10,
    color: 'white',
  },

  down: {
    margin: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  nameAndPwd: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
  },

  textInput: {
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.black,
    height: 30,
    alignSelf: 'stretch',
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 4,
    padding: 3,
    borderColor: Colors.borderColor,
  },

  confirm: {
    flexDirection: 'column',
    backgroundColor: 'EFEFEF',
    borderWidth: 1,
    borderColor: Colors.black,
    height: 35,
    justifyContent: 'center',
    alignSelf: 'stretch',
    marginTop: 10,
    borderRadius: 4,
    borderColor: Colors.borderColor,
  },

});

const WEBVIEWREF = 'webview';

const LoginComponent = React.createClass({
  getInitialState() {
    return {
      username: '',
      password: '',
      logining: false,
    }
  },

  submitLogin() {
    const state = this.state;
    console.log('name & pwd is: ' + this.state.username + this.state.password);
    if (this.state.logining) return;

    this.setState({
      logining: true,
    });
    console.log('submitLogin');
    GHService.login(state.username, state.password);
  },

  onNameChange(text) {
    this.setState({
      username: text,
    });
  },

  onPwdChange(text) {
    this.setState({
      password: text,
    });
  },

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.logining != nextState.logining;
  },

  render() {
    let signInCp;
    if (this.state.logining) {
      signInCp = (
        <ActivityIndicatorIOS
          style={styles.indicator}
          size="small"
        />
      )
    }

    return (
      <View>
        <View style={styles.loginCard}>
          <View style={styles.up}>
            <Text style={styles.introText}>
              Sign in to Github
            </Text>
            {signInCp}
          </View>
          <View style={styles.down}>
            <Text style={styles.nameAndPwd}>
              Username or email
            </Text>
            <TextInput
              style={styles.textInput}
              returnKeyType={'next'}
              onChangeText={this.onNameChange}
            />
            <Text style={styles.nameAndPwd}>
              Password
            </Text>
            <TextInput
              style={styles.textInput}
              returnKeyType={'done'}
              onSubmitEditing={this.submitLogin}
              onChangeText={this.onPwdChange}
            />
            <TouchableHighlight
              style={styles.confirm}
              onPress={this.submitLogin}
              underlayColor={Colors.backGray}
              >
              <Text style={[styles.nameAndPwd, {'textAlign': 'center'}]}>
                Sign in
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  },
});

module.exports = LoginComponent
