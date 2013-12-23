//
//  TSKWebViewController.h
//  Tasks
//
//  Created by Adam Venturella on 12/22/13.
//  Copyright (c) 2013 HappyGravity. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TSKWebView.h"
#import "TSKBridgeExport.h"
#import "TSKApplicationSettings.h"

@interface TSKWebViewController : NSObject
@property (strong) IBOutlet TSKWebView *webView;
@property (strong, readonly) NSObject<TSKBridgeExport> *bridge;

- (void)initializeWebView;
@end
