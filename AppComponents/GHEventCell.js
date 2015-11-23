const React = require('react-native');
const Colors = require('../commonComponents/Colors');
const CommonComponents = require('../commonComponents/CommonComponents');

const {
  StyleSheet,
  View,
  Text,
  Image,
} = React;

const styles = StyleSheet.create({
  cellContentView: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'stretch',
  },

  cellUp: {
    margin: 10,
    height: 40,
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 1,
  },

  avatar: {
    width: 40,
    height: 40,
    backgroundColor: Colors.backGray
  },

  username: {
    marginLeft: 10,
    height: 19,
    color: '#4078C0',
    fontSize: 15,
  },

  textActionContainer: {
    margin: 10,
    marginTop: 7,
    marginBottom: 10,
    marginLeft: 10,
  },

  textDesContainer: {
    margin: 10,
    marginTop: -5,
    marginBottom: 10,
    marginLeft: 25,
    borderStyle: 'dashed',
  },

  linkText: {
    color: '#4078C0',
    fontSize: 15,
    fontWeight: 'normal',
  },

  actionText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: 'bold',
  },

  normalText: {
    color: '#666666',
    fontSize: 15,
    fontWeight: 'normal',
  },

  commentText: {
    color: Colors.textGray,
  },

  createAt: {
    marginLeft: 10,
    marginTop: 2,
    height: 14,
    fontSize: 11,
    color: '#BFBFBF',
  },
});

const GHCell = React.createClass({
  propTypes: {
    ghEvent: React.PropTypes.object,
  },

  actionForEvent(ghEvent) {
    let action = 'Started';
    if (ghEvent.type === 'ForkEvent') {
      action = 'Forked';
    } else if (ghEvent.type === 'WatchEvent') {
      action = 'Started';
    } else if (ghEvent.type === 'PushEvent') {
      action = 'Pushed';
    } else if (ghEvent.type === 'IssueCommentEvent') {
      let realActoin = ghEvent.payload.action;
      action = realActoin + ' comment'
    } else if (ghEvent.type === 'PullRequestEvent') {
      let realActoin = ghEvent.payload.action;
      action = realActoin + ' pull request';
    } else if (ghEvent.type === 'MemberEvent') {
      action = ghEvent.payload.action;
    } else if (ghEvent.type === 'IssuesEvent') {
      let realActoin = ghEvent.payload.action;
      action = realActoin + ' issue ' + '"' +  ghEvent.payload.issue.title + '" ';
    }

    return action;
  },

  detailComponentForEvent(ghEvent) {
    let detail;

    if (ghEvent.type === 'PushEvent') {
      const payloadCommits = ghEvent.payload.commits;
      let cpCommits = [];
      payloadCommits.forEach((commit) => {
        const sha = commit.sha.slice(0, 6);
        const cp = (
          <Text style={[styles.linkText, {fontSize: 13}]}  numberOfLines={0}>
            {sha + ' '}
            <Text style={[styles.commentText, {marginTop: 3}]}>
              {commit.message}
            </Text>
          </Text>
        )
        cpCommits.push(cp);
      })
      const father = (
        <View style={styles.textDesContainer}>
        </View>
      );
      detail = React.cloneElement(father, {}, cpCommits);
    } else if (ghEvent.type === 'IssueCommentEvent') {
      const comment = ghEvent.payload.comment.body;
      detail = (
        <View style={styles.textDesContainer}>
          <Text style={[styles.commentText, {marginTop: 3}]} numberOfLines={0}>
            {comment}
          </Text>
        </View>
      )
    } else if (ghEvent.type === 'PullRequestEvent') {
      const reqDes = ghEvent.payload.pull_request.title;
      detail = (
        <View style={styles.textDesContainer}>
          <Text style={[styles.commentText, {marginTop: 3}]} numberOfLines={0}>
            {reqDes}
          </Text>
        </View>
      )
    }

    return detail;
  },

  openTargetRepo() {
    const ghEvent = this.props.ghEvent;
    const targetRepo = ghEvent.repo;
  },

  openAuthor() {

  },

  openTargetUser() {

  },

  render() {
    const ghEvent = this.props.ghEvent;
    // console.log('ghEvent is: ' + JSON.stringify(ghEvent));
    const author = ghEvent.actor;
    const timesAgo = '20 hours ago';
    const targetRepo = ghEvent.repo;

    let textContainer;
    if (ghEvent.type === 'MemberEvent') {
      const to = ' to ';
      textContainer = (
        <Text style={styles.textActionContainer} numberOfLines={2}>
          <Text style={styles.linkText} onPress={this.openAuthor}>
            {author.login + ' '}
            <Text style={styles.actionText}>
              {this.actionForEvent(ghEvent) + ' '}
              <Text style={styles.linkText} onPress={this.openTargetUser}>
                {ghEvent.payload.member.login}
                  <Text style={styles.normalText}>
                    {to}
                    <Text style={styles.linkText} onPress={this.openTargetRepo}>
                      {targetRepo.name}
                    </Text>
                  </Text>
              </Text>
            </Text>
          </Text>
        </Text>
      )
    } else {
      textContainer = (
        <Text style={styles.textActionContainer} numberOfLines={0}>
          <Text style={styles.actionText}>
            {this.actionForEvent(ghEvent) + ' '}
            <Text style={styles.linkText} onPress={this.openTargetRepo}>
              {targetRepo.name}
            </Text>
          </Text>
        </Text>
      )
    }

    return (
      <View style={styles.cellContentView}>
        <View style={styles.cellUp}>
          <Image
            source={{uri: author.avatar_url}}
            style={styles.avatar}
          />
        <Text style={styles.username} onPress={this.openAuthor}>
            {author.login}
          </Text>
          <Text style={styles.createAt}>{timesAgo}</Text>
        </View>
        {textContainer}
        {this.detailComponentForEvent(ghEvent)}
        {CommonComponents.renderSepLine()}
      </View>
    );
  },
});

module.exports = GHCell
