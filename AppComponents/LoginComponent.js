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

const WEBVIEWREF = 'webview';

const LoginComponent = React.createClass({
  PropTypes: {
    /* A next action promise */
    nextPromise: React.PropTypes.object,
    nextPromiseAction: React.PropTypes.object,
    didLogin: React.PropTypes.func,
  },

  getInitialState() {
    return {
      username: GHService.currentUser().username,
      password: GHService.currentUser().password,
      logining: false,
      loginError: null,
    }
  },

  submitLogin() {
    const state = this.state;
    console.log('name & pwd is: ' + this.state.username + this.state.password);
    if (this.state.logining) return;

    this.setState({
      logining: true,
      loginError: null,
    });
    console.log('submitLogin');
    GHService.login(state.username, state.password)
      .then(() => {
        this.props.navigator && this.props.navigator.pop();
        this.props.didLogin && this.props.didLogin();

        const nextPromise = this.props.nextPromise && this.props.nextPromise();
        const nextPromiseAction = this.props.nextPromiseAction;
        if (nextPromise) {
          nextPromise.then(nextPromiseAction)
        }
        console.log('after login');
      })
      .catch(err => {
        console.log('login error', err);
        this.setState({
          loginError: err,
        });
      })
      .done(() => {
        this.setState({
          logining: false,
        });
      })
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

    let errorDesc;
    if (this.state.loginError) {
      errorDesc = (
        <Text style={styles.errorDesc}>
          {this.state.loginError.message}
        </Text>
      );
    }

    return (
      <View style={{backgroundColor: 'white'}}>
        {errorDesc}
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
              defaultValue={this.state.username}
            />
            <Text style={styles.nameAndPwd}>
              Password
            </Text>
            <TextInput
              style={styles.textInput}
              returnKeyType={'done'}
              onSubmitEditing={this.submitLogin}
              onChangeText={this.onPwdChange}
              secureTextEntry={true}
              defaultValue={this.state.password}
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

const styles = StyleSheet.create({
  loginCard: {
    height: 250,
    margin: 20,
    marginTop: 40,
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
    backgroundColor: '#EFEFEF',
    borderWidth: 1,
    borderColor: Colors.black,
    height: 35,
    justifyContent: 'center',
    alignSelf: 'stretch',
    marginTop: 10,
    borderRadius: 4,
    borderColor: Colors.borderColor,
  },

  errorDesc: {
    color: Colors.red,
    alignSelf: 'center',
    marginTop: 40,
  }
});

module.exports = LoginComponent
