/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/call_center.d.ts" />
declare var process: any;
 
import {CallCenters} from './call_centers';
 
Meteor.methods({
  hfDbVersion: function() {
    console.log(HTTP.get(process.env.COUCH_URL).content);
  },
  hfDbGetFlightIdByName: function(flightName: string) {
    let options = { auth: process.env.COUCH_AUTH };
    let flightList = HTTP.get(process.env.COUCH_URL + '/' + process.env.COUCH_DB + '/_design/basic/_view/flights?descending=true&limit=5', options).content;
    console.log(flightList);
  }
});
