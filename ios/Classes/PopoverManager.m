//
//  PopoverManager.m
//  RN_CNNode
//
//  Created by xiekw on 15/10/20.
//  Copyright © 2015年 Facebook. All rights reserved.
//

#import "PopoverManager.h"
#import "DXPopover.h"

@implementation PopoverManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(showAtView:(NSNumber *)atView withText:(NSString *)text) {
  NSLog(@"hellow js");
  DXPopover *popover = [DXPopover popover];
  NSAttributedString *abs = [[NSAttributedString alloc] initWithString:text attributes:@{NSForegroundColorAttributeName : [UIColor redColor], NSFontAttributeName : [UIFont systemFontOfSize:16.0]}];
  [popover showAtView:atView withText:abs];
}

RCT_EXPORT_METHOD(addEvent:(NSString *)atView location:(NSString *)text) {
  NSLog(@"hellow js %@ %@", atView, text);
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

@end
