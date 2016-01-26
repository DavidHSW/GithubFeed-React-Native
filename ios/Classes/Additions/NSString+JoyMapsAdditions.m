//
//  NSString+JoyMapsAdditions.m
//  JoyMapsKit
//
//  Created by yanhao on 12/24/14.
//  Copyright (c) 2014 taobao inc. All rights reserved.
//

#import "NSString+JoyMapsAdditions.h"
#import "NSData+JoyMapsAdditions.h"

@implementation NSString (JoyMapsAdditions)

- (NSData *)jm_prehashData {
    const char *cstr = [self cStringUsingEncoding:NSUTF8StringEncoding];
    return [NSData dataWithBytes:cstr length:self.length];
}

- (NSString *)jm_MD5Digest {
    return [[self jm_prehashData] jm_MD5Digest];
}

- (NSString *)jm_SHA1Digest {
    return [[self jm_prehashData] jm_SHA1Digest];
}

- (NSString *)jm_SHA256Digest {
    return [[self jm_prehashData] jm_SHA256Digest];
}

- (NSString *)jm_SHA512Digest {
    return [[self jm_prehashData] jm_SHA512Digest];
}


// Adapted from http://snipplr.com/view/2771/compare-two-version-strings
- (NSComparisonResult)jm_compareToVersionString:(NSString *)version {
    // Break version into fields (separated by '.')
    NSMutableArray *leftFields = [[NSMutableArray alloc] initWithArray:[self  componentsSeparatedByString:@"."]];
    NSMutableArray *rightFields = [[NSMutableArray alloc] initWithArray:[version componentsSeparatedByString:@"."]];
    
    // Implict ".0" in case version doesn't have the same number of '.'
    if ([leftFields count] < [rightFields count]) {
        while ([leftFields count] != [rightFields count]) {
            [leftFields addObject:@"0"];
        }
        
    } else if ([leftFields count] > [rightFields count]) {
        while ([leftFields count] != [rightFields count]) {
            [rightFields addObject:@"0"];
        }
    }
    
    // Do a numeric comparison on each field
    for (NSUInteger i = 0; i < [leftFields count]; i++) {
        NSComparisonResult result
            = [[leftFields objectAtIndex:i] compare:[rightFields objectAtIndex:i]
                                            options:NSNumericSearch];
        
        if (result != NSOrderedSame) {
            return result;
        }
    }
    
    return NSOrderedSame;
}


//////////////////////////////////////////////////////////////////////////////////

#pragma mark -
#pragma mark Escape/Unescape HTML

- (NSString *)jm_escapeHTMLAsString {
    NSMutableString *s = [NSMutableString string];
    
    NSUInteger start = 0;
    NSUInteger len = [self length];
    NSCharacterSet *chs = [NSCharacterSet characterSetWithCharactersInString:@"<>&\""];
    
    while (start < len) {
        NSRange r = [self rangeOfCharacterFromSet:chs
                                          options:NSCaseInsensitiveSearch
                                            range:NSMakeRange(start, len-start)];
        
        if (r.location == NSNotFound) {
            [s appendString:[self substringFromIndex:start]];
            
            break;
        }
        
        if (start < r.location) {
            [s appendString:[self substringWithRange:NSMakeRange(start, r.location-start)]];
        }
        
        switch ([self characterAtIndex:r.location]) {
            case '<':
                [s appendString:@"&lt;"];
                break;
                
            case '>':
                [s appendString:@"&gt;"];
                break;
                
            case '"':
                [s appendString:@"&quot;"];
                break;
                
            case '&':
                [s appendString:@"&amp;"];
                break;
        }
        
        start = r.location + 1;
    }
    
    return s;
}

- (NSString *)jm_unescapeHTMLAsString {
    NSMutableString *s = [NSMutableString string];
    NSMutableString *target = [self mutableCopy];
    NSCharacterSet *chs = [NSCharacterSet characterSetWithCharactersInString:@"&"];
    
    while ([target length] > 0) {
        NSRange r = [target rangeOfCharacterFromSet:chs];
        if (r.location == NSNotFound) {
            [s appendString:target];
            break;
        }
        
        if (r.location > 0) {
            [s appendString:[target substringToIndex:r.location]];
            [target deleteCharactersInRange:NSMakeRange(0, r.location)];
        }
        
        if ([target hasPrefix:@"&lt;"]) {
            [s appendString:@"<"];
            [target deleteCharactersInRange:NSMakeRange(0, 4)];
            
        } else if ([target hasPrefix:@"&gt;"]) {
            [s appendString:@">"];
            [target deleteCharactersInRange:NSMakeRange(0, 4)];
        
        } else if ([target hasPrefix:@"&quot;"]) {
            [s appendString:@"\""];
            [target deleteCharactersInRange:NSMakeRange(0, 6)];
        
        } else if ([target hasPrefix:@"&#39;"]) {
            [s appendString:@"'"];
            [target deleteCharactersInRange:NSMakeRange(0, 5)];
        
        } else if ([target hasPrefix:@"&amp;"]) {
            [s appendString:@"&"];
            [target deleteCharactersInRange:NSMakeRange(0, 5)];
        
        } else if ([target hasPrefix:@"&hellip;"]) {
            [s appendString:@"…"];
            [target deleteCharactersInRange:NSMakeRange(0, 8)];
        
        } else {
            [s appendString:@"&"];
            [target deleteCharactersInRange:NSMakeRange(0, 1)];
        }
    }
    
    return s;
}


//////////////////////////////////////////////////////////////////////////////////

#pragma mark -
#pragma mark Base64 Encoding/Decoding

- (NSString *)jm_encodeAsBase64String  {
    if ([self length] == 0) return nil;
    
    return [[self dataUsingEncoding:NSUTF8StringEncoding] jm_encodeAsBase64String];
}

- (NSString *)jm_decodeBase64String {
    return [[self dataUsingEncoding:NSUTF8StringEncoding] jm_decodeBase64String];
}

@end

