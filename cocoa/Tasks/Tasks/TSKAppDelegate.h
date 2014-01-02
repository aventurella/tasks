//
//  TSKAppDelegate.h
//  Tasks
//
//  Created by Adam Venturella on 12/22/13.
//  Copyright (c) 2013 HappyGravity. All rights reserved.
//

#import <Cocoa/Cocoa.h>
//#import "TSKWebView.h"
#import "TSKWebViewController.h"
@interface TSKAppDelegate : NSObject <NSApplicationDelegate>

@property (assign) IBOutlet NSWindow *window;
@property (strong) IBOutlet TSKWebViewController *webController;
@property (assign) IBOutlet NSMenu *mainMenu;

@end
