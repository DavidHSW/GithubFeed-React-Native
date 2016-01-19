//
//  JMWebResourceInterceptorSettings.m
//  JoyMapsKit
//
//  Created by yanhao on 12/24/14.
//  Copyright (c) 2014 taobao inc. All rights reserved.
//

#import "JMWebResourceInterceptorSettings+Internal.h"

@implementation JMWebResourceInterceptorSettings

@synthesize version = _version;
@synthesize enabled = _enabled;
@synthesize extensions = _extensions;
@synthesize whitelist = _whitelist;
@synthesize blacklist = _blacklist;
@synthesize cacheMaxAge = _cacheMaxAge;

+ (instancetype)buildDefaultWebResourceInterceptorSettings {
  JMWebResourceInterceptorSettings *settings = [JMWebResourceInterceptorSettings new];
  settings.version = 0;
  settings.enabled = YES;
  settings.extensions = @"js,css,md";
  settings.whitelist = @[@"github.com"];
  settings.blacklist = @[@"www.google-analytics.com"];
//  settings.cacheMaxAge = 24 * 60 * 60 * 3;
  settings.cacheMaxAge = 60 * 60 * 1;

  return settings;
}

+ (instancetype)defaultInterceptorSettings {
  return [[self class] buildDefaultWebResourceInterceptorSettings];
}

@end
