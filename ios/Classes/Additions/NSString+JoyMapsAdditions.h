//
//  NSString+JoyMapsAdditions.h
//  JoyMapsKit
//
//  Created by yanhao on 12/24/14.
//  Copyright (c) 2014 taobao inc. All rights reserved.
//

@import Foundation;

/**
 *  提供`NSString`的通用扩展方法
 */
@interface NSString (JoyMapsAdditions)

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
 * ---------------------------------------------------------------------------
 * @name 版本比较
 * ---------------------------------------------------------------------------
 */

/**
 *  版本比较
 *
 *  <pre>
 *     <code>
 *       [@"10.4" compareToVersionString:@"10.3"]; // NSOrderedDescending
 *       [@"10.5" compareToVersionString:@"10.5.0"]; // NSOrderedSame
 *       [@"10.4 Build 8L127" compareToVersionString:@"10.4 Build 8P135"]; // NSOrderedAscending
 *     </code>
 *  </pre>
 *
 *  @param version 传入需要进行比较的版本
 *
 *  @return 返回两个版本的比较结果
 */
- (NSComparisonResult)jm_compareToVersionString:(NSString *)version;


/**
 * ---------------------------------------------------------------------------
 * @name HTML转义和反转义
 * ---------------------------------------------------------------------------
 */

/**
 *  转义HTML标签
 *
 *  @return 返回转义后的HTML字符串
 */
- (NSString *)jm_escapeHTMLAsString;

/**
 *  反转义HTML标签
 *
 *  @return 返回反转义后的HTML字符串
 */
- (NSString *)jm_unescapeHTMLAsString;


/**
 * ---------------------------------------------------------------------------
 * @name Base64 编码解码
 * ---------------------------------------------------------------------------
 */

/**
 *  Base64编码字符串
 *
 *  @return 返回Base64编码后的字符串
 */
- (NSString *)jm_encodeAsBase64String;

/**
 *  Base64解码字符串
 *
 *  @return 返回Base64解码的字符串
 */
- (NSString *)jm_decodeBase64String;

@end