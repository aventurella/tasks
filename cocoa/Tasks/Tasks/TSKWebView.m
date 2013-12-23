//
//  TSKWebView.m
//  Tasks
//
//  Created by Adam Venturella on 12/22/13.
//  Copyright (c) 2013 HappyGravity. All rights reserved.
//

#import "TSKWebView.h"

@implementation TSKWebView
- (BOOL)performKeyEquivalent:(NSEvent *)theEvent
{
    NSString * chars = [theEvent characters];
    BOOL status = NO;
    
    if ([theEvent modifierFlags] & NSCommandKeyMask){
        
        if ([chars isEqualTo:@"a"]){
            [self selectAll:nil];
            status = YES;
        }
        
        if ([chars isEqualTo:@"c"]){
            [self copy:nil];
            status = YES;
        }
        
        if ([chars isEqualTo:@"v"]){
            [self paste:nil];
            status = YES;
        }
        
        if ([chars isEqualTo:@"x"]){
            [self cut:nil];
            status = YES;
        }
        
        if ([chars isEqualTo:@"n"]){
            JSValue *app = self.context[@"application"];
            JSValue *method = app[@"createTask"];
            
            [method callWithArguments:@[]];
            status = YES;
        }
    }
    return status;
}

- (JSContext *) context
{
    return [[self mainFrame] javaScriptContext];
}

- (void)keyDown:(NSEvent *)theEvent
{
    // no op - kills the beep;
}

@end
