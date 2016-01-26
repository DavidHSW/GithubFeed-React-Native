//
//  NSData+JoyMapsAdditions.h
//  JoyMapsKit
//
//  Created by yanhao on 12/24/14.
//  Copyright (c) 2014 taobao inc. All rights reserved.
//

@import Foundation;

/**
 *  提供`NSData`的通用扩展方法
 */
@interface NSData (JoyMapsAdditions)

/**
 * ---------------------------------------------------------------------------
 * @name 消息摘要
 * ---------------------------------------------------------------------------
 */

/**
 *  生成MD5信息摘要
 *
 *  @return 返回MD5信息摘要
 */
- (NSString *)jm_MD5Digest;

/**
 *  生成SHA1信息摘要
 *
 *  @return 返回SHA1信息摘要
 */
- (NSString *)jm_SHA1Digest;

/**
 *  生成SHA256信息摘要
 *
 *  @return 返回SHA256信息摘要
 */
- (NSString *)jm_SHA256Digest;

/**
 *  生成SHA512信息摘要
 *
 *  @return 返回SHA512信息摘要
 */
- (NSString *)jm_SHA512Digest;

/**
 *  使用16进制编码表示当前字符串
 *
 *  @return 返回使用16进制编码表示的字符串
 */
- (NSString *)jm_hexadedimalString;


/**
 * ---------------------------------------------------------------------------
 * @name Base64 编码解码
 * ---------------------------------------------------------------------------
 */

/**
 *  Base64编码
 *
 *  @return 返回Base64编码后的字符串
 */
- (NSString *)jm_encodeAsBase64String;

/**
 *  Base64解码
 *
 *  @return 返回Base64解码的字符串
 */
- (NSString *)jm_decodeBase64String;

@end
