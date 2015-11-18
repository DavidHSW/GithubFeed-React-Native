//
//  DXNavMenuManager.m
//  RN_CNNode
//
//  Created by xiekw on 15/10/26.
//  Copyright © 2015年 Facebook. All rights reserved.
//

#import "DXCategoryMenuManager.h"
#import "RCTUtils.h"
#import "RCTEventDispatcher.h"
#import "UIView+React.h"
#import "RCTBridge.h"
#import "RCTSparseArray.h"
#import "RCTUIManager.h"


@implementation DXCategoryMenuManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(options, NSArray)
RCT_EXPORT_VIEW_PROPERTY(lockStartPosition, BOOL)
RCT_EXPORT_VIEW_PROPERTY(selectedColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(unSelectedColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(contentInset, UIEdgeInsets)
RCT_EXPORT_VIEW_PROPERTY(spacingBetweenMenu, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(bottomLineHeight, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(selectedAnimationDuration, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(needCenterMenuOffset, BOOL)
RCT_EXPORT_VIEW_PROPERTY(blur, BOOL)
RCT_EXPORT_VIEW_PROPERTY(blurEffectStyle, NSInteger)

RCT_EXPORT_METHOD(updateSelectedIndex:(nonnull NSNumber *)reactTag selectedIndex:(nonnull NSNumber *)selectedIndex) {
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, RCTSparseArray *viewRegistry) {
    DXTextCategoryMenu *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[DXTextCategoryMenu class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting DXTextCategoryMenu, got: %@", view);
    } else {
      [view updateSelectedIndex:selectedIndex.integerValue];
    }
  }];
}

- (UIView *)view {
  DXTextCategoryMenu *menu = [[DXTextCategoryMenu alloc] init];
  menu.delegate = self;
  
  return menu;
}

- (void)textCategoryMenu:(DXTextCategoryMenu *)menu willSelectedMenuFromIndex:(NSInteger)fromIndex toIndex:(NSInteger)index {
  NSDictionary *event = @{
                          @"target": menu.reactTag,
                          @"from": @(fromIndex),
                          @"to": @(index)
                          };
  [self.bridge.eventDispatcher sendInputEventWithName:@"topChange" body:event];
}

- (void)textCategoryMenu:(DXTextCategoryMenu *)menu didSelectedMenuFromIndex:(NSInteger)fromIndex toIndex:(NSInteger)index {
}

@end
