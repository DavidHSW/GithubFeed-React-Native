const React = require('react-native');
const CommonComponents = require('../commonComponents/CommonComponents');
const DXRefreshControl = require('../iosComponents/DXRefreshControl');
const DXTopMessage = require('../iosComponents/DXTopMessage');
const Config = require('../config');
const PropTypes = React.PropTypes;
const GHService = require('../networkService/GithubServices');

const {
  ListView,
  View,
  ActivityIndicatorIOS,
  Text,
  AppRegistry,
} = React;

const LISTVIEWREF = 'listview';
const CONTAINERREF = 'container';

let DataSource = [];

const FloorListView = React.createClass({
  propTypes: {
    reloadPromise: PropTypes.func,
    handleReloadData: PropTypes.func,
    appendPromise: PropTypes.func,
    handleAppendData: PropTypes.func,
    needNextPage: PropTypes.func,
    renderRow: PropTypes.func,
    handleError: PropTypes.func,
  },

  getInitialState() {
    const dataSourceParam = {
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }

    return {
      dataSource: new ListView.DataSource(dataSourceParam),
      loaded: false,
    };
  },

  showError(error) {
    DXTopMessage.showTopMessage(this.refs[CONTAINERREF], error.toString(), {offset: 64.0}, () => {
    });
  },

  componentDidMount() {
    this.reloadData();
  },

  reloadData() {
    DataSource = [];

    const reloadPromise = this.props.reloadPromise();
    reloadPromise
      .then(value => {
        // console.log('Refresh listView response is: ' + JSON.stringify(value));
        GHService.checkError(value);

        const rdata = this.props.handleReloadData(value);
        this._setNeedsRenderList(rdata);
      })
      .catch(err => {
        this.showError(err);
        this.props.handleError && this.props.handleError(err);

        this.setState({
          loaded: true,
        });
      })
      .done(() => {
        const node = this.refs[LISTVIEWREF];
        if (node) {
          DXRefreshControl.endRefreshing(node);
        }
      })
  },

  appendPage() {
    if (!this.props.needNextPage()) return;

    console.log('append Page');
    const appendPromise = this.props.appendPromise();
    appendPromise
     .then(value => {
       GHService.checkError(value);

       const rdata = this.props.handleAppendData(value);
       this._setNeedsRenderList(rdata);
     })
     .catch(err => {
       this.showError(err);
       this.props.handleError && this.props.handleError(err);
     })
  },

  _setNeedsRenderList(rdata) {
    DataSource.push(...rdata);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(DataSource),
      loaded: true,
    });
  },

  componentDidUpdate(prevProps, prevState) {
    let node = this.refs[LISTVIEWREF];
    if (!node || this.state.didAddRefreshControl) {
      return;
    }
    let refreshConfig = {
      headerViewClass: 'UIRefreshControl',
    };
    DXRefreshControl.configureCustom(node, refreshConfig, this.reloadData);
    this.setState({
      didAddRefreshControl: true,
    });
  },

  render() {
    if (!this.state.loaded) {
      return CommonComponents.renderLoadingView();
    }
    return (
      <View style={{flex: 1, backgroundColor: 'white'}} ref={CONTAINERREF}>
        <ListView
          ref={LISTVIEWREF}
          dataSource={this.state.dataSource}
          renderRow={this.props.renderRow}
          removeClippedSubviews={true}
          renderFooter={this.renderFooter}
          onEndReached={this.appendPage}
          automaticallyAdjustContentInsets={false}
          contentInset={{top: 64, left: 0, bottom: 49, right: 0}}
          contentOffset={{x:0, y:-64}}
          scrollRenderAheadDistance={50}
        />
      </View>
    );


    /* 在RN 15里面需要这样
    contentInset={{top: 64, left: 0 , bottom: 49, right: 0}}
    contentOffset={{x:0, y:-64}}
    */
  },

  renderFooter() {
    if (this.props.needNextPage()) {
      return (
        <View style={{flex: 1, alignItems: 'center', height: 40, justifyContent: 'center'}} >
          <ActivityIndicatorIOS size='small' />
        </View>
      )
    }
  },
});

module.exports = FloorListView;
