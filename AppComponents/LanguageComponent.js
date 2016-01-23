const React = require('react-native');
const CommonComponents = require('../commonComponents/CommonComponents');
const Config = require('../config');
const PropTypes = React.PropTypes;
const Languages = require('../commonComponents/LanguageList');
const { Icon, } = require('react-native-icons');
const Colors = require('../commonComponents/Colors');

const {
  ListView,
  View,
  ActivityIndicatorIOS,
  Text,
  TouchableHighlight,
  StyleSheet,
} = React;

const LISTVIEWREF = 'listview';
const CONTAINERREF = 'container';

const FloorListView = React.createClass({
  propTypes: {
    onSelectLanguage: React.PropTypes.func,
  },

  getInitialState() {
    const dataSourceParam = {
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }
    let dataSource = new ListView.DataSource(dataSourceParam);

    return {
      dataSource: dataSource.cloneWithRows(Languages),
    };
  },

  renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <LanguageCell
       key={rowID}
       name={rowData}
       onSelectCell={this.props.onSelectLanguage}/>
    )
  },

  render() {
    return (
      <View style={this.props.style} ref={CONTAINERREF}>
        <ListView
          ref={LISTVIEWREF}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          automaticallyAdjustContentInsets={false}
          contentInset={{top: 0, left: 0, bottom: 49, right: 0}}
        />
      </View>
    );
  },
});

const ICON_SIZE = 20;

const LanguageCell = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    onSelectCell: React.PropTypes.func,
  },

  onSelectCell() {
    this.props.onSelectCell && this.props.onSelectCell(this.props.name);
  },

  render() {
    return (
      <TouchableHighlight onPress={this.onSelectCell} underlayColor={'lightGray'}>
        <View style={styles.cellContentView}>
          <Text style={styles.userName}>{this.props.name}</Text>
        </View>
      </TouchableHighlight>
    );
  },
});

const styles = StyleSheet.create({
  cellContentView: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: 0.5,
  },
  userName: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 17,
    marginLeft: 20,
    flex: 1,
  },
  cellLeftRepoIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginRight: 8,
  },
});

module.exports = FloorListView;
