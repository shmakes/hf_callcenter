/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/call_center.d.ts" />
declare var process: any;
 
import {CallCenters} from './call_centers';
 
Meteor.methods({
  hfDbVersion: function() {
    console.log(HTTP.get(process.env.HF_COUCH_DB).content);
  }
});
