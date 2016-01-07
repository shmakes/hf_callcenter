/// <reference path="../typings/angular2-meteor.d.ts" />
 
import {CallCenters} from 'collections/call_centers';
 
Meteor.publish('callCenters', function() {
  return CallCenters.find();
});
