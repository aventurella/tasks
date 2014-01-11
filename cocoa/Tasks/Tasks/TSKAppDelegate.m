//
//  TSKAppDelegate.m
//  Tasks
//
//  Created by Adam Venturella on 12/22/13.
//  Copyright (c) 2013 HappyGravity. All rights reserved.
//

#import "TSKAppDelegate.h"

@implementation TSKAppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification
{
    // Insert code here to initialize your application
    //[self.window makeFirstResponder:self.webController];
    //NSMenuItem *file = [self.mainMenu itemWithTitle:@"File"];
    //NSMenuItem *new = [file.submenu itemWithTitle:@"New"];
    //[new setEnabled:YES];
    
}

- (BOOL)applicationShouldHandleReopen:(NSApplication *)app hasVisibleWindows:(BOOL)hasWindows
{
    if(hasWindows){
        return NO;
    }
    
    [self.window makeKeyAndOrderFront:self];
    return YES;
}

@end