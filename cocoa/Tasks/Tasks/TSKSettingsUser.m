//
//  TSKSettingsUser.m
//  Tasks
//
//  Created by Adam Venturella on 1/3/14.
//  Copyright (c) 2014 HappyGravity. All rights reserved.
//

#import "TSKSettingsUser.h"

@implementation TSKSettingsUser
@synthesize first_name, last_name, organization, organization_id;

+ (TSKSettingsUser *)userWithDict:(NSDictionary *)dict
{
    TSKSettingsUser *obj = [[TSKSettingsUser alloc] init];
    obj.first_name = dict[@"first_name"];
    obj.last_name = dict[@"last_name"];
    obj.organization = dict[@"organization"];
    obj.organization_id = dict[@"organization_id"];
    
    return obj;
}

- (void)encodeWithCoder:(NSCoder *)encoder {
    [encoder encodeObject:self.first_name forKey:@"first_name"];
    [encoder encodeObject:self.last_name forKey:@"last_name"];
    [encoder encodeObject:self.organization forKey:@"organization"];
    [encoder encodeObject:self.organization_id forKey:@"organization_id"];
}

- (id)initWithCoder:(NSCoder *)decoder {
    if((self = [super init])) {
        self.first_name = [decoder decodeObjectForKey:@"first_name"];
        self.last_name = [decoder decodeObjectForKey:@"last_name"];
        self.organization = [decoder decodeObjectForKey:@"organization"];
        self.organization_id = [decoder decodeObjectForKey:@"organization_id"];
    }
    
    return self;
}

@end
