const React = require('react-native');
const {
  DeviceEventEmitter,
  NativeModules: {
    GFDiskCacheManager,
  }
} = React;

const GFDiskCache = {
  getDiskCacheCost(cb) {
    GFDiskCacheManager.diskCacheCost((size) => {
      console.log('get diskCacheCost', size);
      cb && cb(this.bytesToSize(size));
    });
  },

  clearDiskCache(cb) {
    GFDiskCacheManager.clearDiskCache((size) => {
      cb && cb(this.bytesToSize(size));
    });
  },

  bytesToSize(bytes) {
     var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
     if (bytes == 0) return '0';
     var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
     return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }
};

module.exports = GFDiskCache;
