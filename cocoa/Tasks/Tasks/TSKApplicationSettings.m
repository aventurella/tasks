//
//  TSKApplicationSettings.m
//  Tasks
//
//  Created by Adam Venturella on 12/22/13.
//  Copyright (c) 2013 HappyGravity. All rights reserved.
//

#import "TSKApplicationSettings.h"

@implementation TSKApplicationSettings
@synthesize token, currentProjectId, user;

- (id)init
{
    if (self = [super init]){
        [NSUserDefaults resetStandardUserDefaults];
        _defaults = [NSUserDefaults standardUserDefaults];
        [_defaults registerDefaults:@{@"token": @""}];
    }
    
    return self;
}

- (void)setUser:(TSKSettingsUser *)value{
    NSData *encodedUser = [NSKeyedArchiver archivedDataWithRootObject:value];
    [_defaults setObject:encodedUser forKey:@"user"];
    [_defaults synchronize];
    
}

- (TSKSettingsUser *)user{
    NSData *encodedUser = [_defaults objectForKey:@"user"];
    TSKSettingsUser *obj = (TSKSettingsUser *)[NSKeyedUnarchiver unarchiveObjectWithData: encodedUser];
    return obj;
}

- (void)setToken:(NSString *)value{
    [_defaults setObject:value forKey:@"token"];
    [_defaults synchronize];
    
}

- (NSString *)token{
    return [_defaults objectForKey:@"token"];
}

- (void)setCurrentProjectId:(NSUInteger)value{
    
    NSNumber * obj = [NSNumber numberWithUnsignedInteger:value];
    [_defaults setObject:obj forKey:@"currentProjectId"];
    [_defaults synchronize];
    
}

- (NSUInteger)currentProjectId{
    NSNumber * obj =  [_defaults objectForKey:@"currentProjectId"];
    return [obj unsignedIntegerValue];
}
@end
