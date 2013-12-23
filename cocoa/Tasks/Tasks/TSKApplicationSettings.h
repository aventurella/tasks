//
//  TSKApplicationSettings.h
//  Tasks
//
//  Created by Adam Venturella on 12/22/13.
//  Copyright (c) 2013 HappyGravity. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TSKApplicationSettingsExport.h"

@interface TSKApplicationSettings : NSObject<TSKApplicationSettingsExport>{
    NSUserDefaults *_defaults;
}

@end
