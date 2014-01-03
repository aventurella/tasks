//
//  TSKApplicationSettingsExport.h
//  Tasks
//
//  Created by Adam Venturella on 12/22/13.
//  Copyright (c) 2013 HappyGravity. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>
#import "TSKSettingsUser.h"

@protocol TSKApplicationSettingsExport <JSExport>
@property (nonatomic, strong) NSString *token;
@property (nonatomic, strong) TSKSettingsUser *user;
@property(nonatomic, assign) NSUInteger currentProjectId;
@end
