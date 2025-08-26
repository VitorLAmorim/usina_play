// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import {addIcons} from "ionicons";
import {add, body, helpCircle, menuOutline, notifications, trophy} from "ionicons/icons";

addIcons({
  'menu-outline': menuOutline,
  'notifications': notifications,
  'body': body,
  'trophy': trophy,
  'add': add,
  'help-circle': helpCircle
});

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
