//
//  TSKWebView.h
//  Tasks
//
//  Created by Adam Venturella on 12/22/13.
//  Copyright (c) 2013 HappyGravity. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>
#import <JavaScriptCore/JavaScriptCore.h>


@interface TSKWebView : WebView

@property (assign, readonly) JSContext *context;
@end
