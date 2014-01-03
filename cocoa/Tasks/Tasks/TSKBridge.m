//
//  TSKBridge.m
//  Tasks
//
//  Created by Adam Venturella on 12/22/13.
//  Copyright (c) 2013 HappyGravity. All rights reserved.
//

#import "TSKBridge.h"
#import "TSKTask.h"


@implementation TSKBridge
@synthesize currentProjectId;
@synthesize settings;


- (id) init
{
    if (self = [super init])
    {

        self.settings = [[TSKApplicationSettings alloc] init];
        [[NSUserNotificationCenter defaultUserNotificationCenter] setDelegate:self];
    }

    return self;
}


- (void)taskDidChange:(NSDictionary *)data
{
    NSUserNotification *notification = [[NSUserNotification alloc] init];
    NSString *label = data[@"label"];
    NSString *project_label = data[@"project_label"];
    NSString *target;
    NSString *assigned_email = data[@"assigned_email"];

    // http://stackoverflow.com/questions/5684157/how-to-detect-if-nsstring-is-null
    NSString *token = data[@"token"] == [NSNull null] ? @"" : data[@"token"];

    TSKStatus status = (TSKStatus)[data[@"status"] integerValue];

    switch (status) {

        case BACKLOG:
            target = @"Backlog";
            break;

        case TODO:
            target = @"Todo";
            break;

        case IN_PROGRESS:
            target = @"In Progress";
            break;

        case COMPLETED:
            target = @"Completed";
            break;

        case ARCHIVED:
            target = @"Archived";
            break;

        default:
            target = @"Unknown";
            break;
    }

    NSString *message = [NSString stringWithFormat:@"'%@' has moved to '%@'", label, target];
    NSString *subtitle;
    
    if([assigned_email length] > 0){
        subtitle = [NSString stringWithFormat:@"Project: '%@' (%@)", project_label, assigned_email];
    } else {
        subtitle = [NSString stringWithFormat:@"Project: '%@'", project_label];
    }
    

    notification.title = @"Task Update";
    notification.informativeText = message;
    notification.subtitle = subtitle;
    notification.soundName = NSUserNotificationDefaultSoundName;
    notification.userInfo = @{@"status": [NSNumber numberWithInteger:status],
                              @"token": token,
                              @"project_id": [NSNumber numberWithInteger:[data[@"project_id"] integerValue]]};

    [self sendNotification:notification];
    /*
     {
     action = update;
     "assigned_to" = "<null>";
     description = "It's great batman!";
     id = 16;
     label = "Something Great";
     loe = 0;
     "organization_id" = 1;
     project = 5;
     "project_id" = 5;
     status = 3;
     "task_type" = 0;
     token = "<null>";
     type = task;
     }
     */

}


- (void)sendNotification:(NSUserNotification *)notification
{
    [[NSUserNotificationCenter defaultUserNotificationCenter] deliverNotification:notification];

}

- (BOOL)userNotificationCenter:(NSUserNotificationCenter *)center shouldPresentNotification:(NSUserNotification *)notification
{
    NSDictionary *data = notification.userInfo;

    NSNumber *project_id = data[@"project_id"];
    NSString *token = data[@"token"];

    if([project_id unsignedIntegerValue] != self.currentProjectId){
        return NO;
    }

    if([self.settings.token isEqualToString:token]){
        return NO;
    }

    return YES;
}

@end
