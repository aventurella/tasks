//
//  TSKTask.h
//  Tasks
//
//  Created by Adam Venturella on 12/22/13.
//  Copyright (c) 2013 HappyGravity. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef enum {
    BACKLOG,
    TODO,
    ACCEPTED,
    IN_PROGRESS,
    COMPLETED,
    ARCHIVED
} TSKStatus;

@interface TSKTask : NSObject

@end
