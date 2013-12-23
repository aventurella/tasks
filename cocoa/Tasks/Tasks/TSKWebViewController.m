//
//  TSKWebViewController.m
//  Tasks
//
//  Created by Adam Venturella on 12/22/13.
//  Copyright (c) 2013 HappyGravity. All rights reserved.
//

#import "TSKWebViewController.h"
#import "TSKBridge.h"

@implementation TSKWebViewController

- (void)awakeFromNib
{
    _bridge = [[TSKBridge alloc] init];
    [self initializeWebView];
    
}

- (void)initializeWebView
{
    [self.webView setFrameLoadDelegate:self];
    
    NSString *resourcePath = [[NSBundle mainBundle] resourcePath];
    resourcePath = [resourcePath stringByAppendingPathComponent:@"src"];
    
    NSString * index = [resourcePath stringByAppendingPathComponent:@"index.html"];
    
    NSError *err;
    NSString *data = [NSString stringWithContentsOfURL:[NSURL fileURLWithPath:index]
                                              encoding:NSUTF8StringEncoding
                                                 error:&err];
    
    NSURL *baseURL = [NSURL fileURLWithPath:resourcePath isDirectory:YES];
    [self.webView.mainFrame loadHTMLString:data baseURL:baseURL];
}

- (void)webView:(WebView *)sender didFinishLoadForFrame:(WebFrame *)frame
{
    //    NSScrollView *mainScrollView = sender.mainFrame.frameView.documentView.enclosingScrollView;
    //    [mainScrollView setVerticalScrollElasticity:NSScrollElasticityNone];
    //    [mainScrollView setHorizontalScrollElasticity:NSScrollElasticityNone];
    
    // disable scrolling
    [[[sender mainFrame] frameView] setAllowsScrolling:NO];
}

- (void)webView:(WebView *)webView didCreateJavaScriptContext:(JSContext *)context forFrame:(WebFrame *)frame
{
    context[@"Bridge"] = self.bridge;
    
}

@end
