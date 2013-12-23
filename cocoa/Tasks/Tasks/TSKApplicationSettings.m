//
//  TSKApplicationSettings.m
//  Tasks
//
//  Created by Adam Venturella on 12/22/13.
//  Copyright (c) 2013 HappyGravity. All rights reserved.
//

#import "TSKApplicationSettings.h"

@implementation TSKApplicationSettings
@synthesize token;

- (id)init
{
    if (self = [super init]){
        [NSUserDefaults resetStandardUserDefaults];
        _defaults = [NSUserDefaults standardUserDefaults];
        [_defaults registerDefaults:@{@"token": @""}];
    }
    
    return self;
}

- (void)setToken:(NSString *)value{
    [_defaults setObject:value forKey:@"token"];
    [_defaults synchronize];
    
}

- (NSString *)token{
    return [_defaults objectForKey:@"token"];
}
@end
