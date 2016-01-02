/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/call_center.d.ts" />
 
export var CallCenters = new Mongo.Collection<CallCenter>('call_centers');

CallCenters.allow({
  insert: function(party: Object) {
    var user = Meteor.user();
    return !!user;
  },
  update: function(party: Object, fields, modifier) {
    var user = Meteor.user();
    return !!user;
  },
  remove: function(party: Object) {
    var user = Meteor.user();
    return !!user;
  }
});
