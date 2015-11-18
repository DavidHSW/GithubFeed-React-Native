//
//  NativePlayViewControllr.m
//  RN_CNNode
//
//  Created by xiekw on 15/10/22.
//  Copyright © 2015年 Facebook. All rights reserved.
//

#import "NativePlayViewControllr.h"
#import "DXTextCategoryMenu.h"

@interface NativePlayViewControllr () {
  DXTextCategoryMenu *_menu;
}

@end

@implementation NativePlayViewControllr

- (void)viewDidLoad {
  [super viewDidLoad];
  // Do any additional setup after loading the view.

  UIImage *image = [UIImage imageNamed:@"IMG_1718"];
  UIImageView *imageV = [[UIImageView alloc] initWithFrame:self.view.bounds];
  imageV.image = image;
  [self.view addSubview:imageV];
  
  NSArray *options = @[@"nihao", @"我好", @"大家号", @"不错", @"aiyo", @"周杰伦", @"才衣领", @"王心凌",
                       @"go", @"mic", @"大家号", @"不错", @"aiyo", @"周杰伦", @"才衣领", @"王心凌"];
//  NSArray *options = @[@"王心凌", @"王心凌", @"大家号", @"王心凌", @"王心凌", @"周杰伦", @"才衣领", @"王心凌"];

  _menu = [[DXTextCategoryMenu alloc] initWithFrame:CGRectMake(0, 100, CGRectGetWidth(self.view.bounds), 38.0)];
  _menu.options = options;
  
  [self.view addSubview:_menu];
}

- (void)didReceiveMemoryWarning {
  [super didReceiveMemoryWarning];
  // Dispose of any resources that can be recreated.
}

/*
 #pragma mark - Navigation
 
 // In a storyboard-based application, you will often want to do a little preparation before navigation
 - (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
 // Get the new view controller using [segue destinationViewController].
 // Pass the selected object to the new view controller.
 }
 */

@end
