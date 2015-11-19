//
//  DXRNUtils.m
//  RN_CNNode
//
//  Created by xiekw on 15/11/18.
//  Copyright © 2015年 Facebook. All rights reserved.
//

#import "DXRNUtils.h"

@implementation DXRNUtils

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(clearCookies:(RCTResponseSenderBlock)callback) {
  NSHTTPCookieStorage *cookieStore = [NSHTTPCookieStorage sharedHTTPCookieStorage];
  for (NSHTTPCookie *cookie in [cookieStore cookies]) {
    [cookieStore deleteCookie:cookie];
  }
  
  callback(@[[NSNull null]]);
}

@end
