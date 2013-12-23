//
//  TSKBridgeExport.h
//  Tasks
//
//  Created by Adam Venturella on 12/22/13.
//  Copyright (c) 2013 HappyGravity. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>
#import "TSKApplicationSettings.h"

@protocol TSKBridgeExport <JSExport>
@property(assign) NSUInteger currentProjectId;
@property (strong) TSKApplicationSettings *settings;

- (void)taskDidChange:(NSDictionary *)data;
@end


