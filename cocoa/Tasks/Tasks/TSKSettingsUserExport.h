//
//  TSKSettingsUserExport.h
//  Tasks
//
//  Created by Adam Venturella on 1/3/14.
//  Copyright (c) 2014 HappyGravity. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>

@class TSKSettingsUser;

@protocol TSKSettingsUserExport <JSExport>
@property (nonatomic, copy) NSString *first_name;
@property (nonatomic, copy) NSString *last_name;
@property (nonatomic, copy) NSString *organization;
@property (nonatomic, copy) NSString *organization_id;

+ (TSKSettingsUser *)userWithDict:(NSDictionary *)dict;
@end

