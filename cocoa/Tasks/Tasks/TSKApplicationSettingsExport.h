//
//  TSKApplicationSettingsExport.h
//  Tasks
//
//  Created by Adam Venturella on 12/22/13.
//  Copyright (c) 2013 HappyGravity. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>

@protocol TSKApplicationSettingsExport <JSExport>
@property (strong) NSString *token;
@end
