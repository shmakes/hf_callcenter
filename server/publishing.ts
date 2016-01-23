/// <reference path="../typings/angular2-meteor.d.ts" />

import {UserProfiles} from 'collections/user_profiles';
import {CallCenters} from 'collections/call_centers';
import {CallPackets} from 'collections/call_packets';

var isSystemAdmin = function(userId: string) {
  var profile = UserProfiles.findOne( { userId: userId } );
  return (!!profile && profile.isSystemAdmin);
}

var isCenterAdmin = function(userId: string) {
  var profile = UserProfiles.findOne( { userId: userId } );
  return (!!profile && profile.isCenterAdmin);
}

Meteor.publish('userProfiles', function() {
  if(this.userId){
    return isCenterAdmin(this.userId)
            ? UserProfiles.find()
            : UserProfiles.find( { userId: this.userId } );
  }
});

Meteor.publish('callCenters', function() {
  if(this.userId){
    return isSystemAdmin(this.userId)
            ? CallCenters.find({}, {sort: {startDate: 1}})
            : CallCenters.find( {
                $and: [
                        { callers: { $exists: true } },
                        { callers: this.userId },
                        { isRemoved: false }
                      ]
            }, {sort: {startDate: 1}} );
  }
});

Meteor.publish('assignedCallPackets', function(callCenterId) {
  check(callCenterId, String);
  if(this.userId){
    return isCenterAdmin(this.userId)
            ? CallPackets.find( {
                $and: [
                        { callCenterId: callCenterId },
                        { callerId: {'$ne' : ''}}
                      ]
            } )
            : CallPackets.find( {
                $and: [
                        { callCenterId: callCenterId },
                        { callerId: this.userId },
                        { isRemoved: false }
                      ]
            } );
  }
});

Meteor.publish('availableCallPackets', function(callCenterId) {
  check(callCenterId, String);
  if(this.userId){
    return isCenterAdmin(this.userId)
            ? CallPackets.find( {
                $and: [
                        { callCenterId: callCenterId },
                        { callerId: '' }
                      ]
            } )
            : CallPackets.find( {
                $and: [
                        { callCenterId: callCenterId },
                        { callerId: '' },
                        { isRemoved: false }
                      ]
            } );
  }
});

Meteor.publish('callPacket', function(callPacketId) {
  check(callPacketId, String);
  if(this.userId){
    return isCenterAdmin(this.userId)
            ? CallPackets.find( { _id: callPacketId } )
            : CallPackets.find( {
                $and: [
                        { _id: callPacketId },
                        { callerId: this.userId },
                        { isRemoved: false }
                      ]
            } );
  }
});

