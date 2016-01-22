/// <reference path="../typings/angular2-meteor.d.ts" />

import {UserProfiles} from 'collections/user_profiles';
import {CallCenters} from 'collections/call_centers';
import {CallPackets} from 'collections/call_packets';

var isAdmin = function(userId: string) {
  var profile = UserProfiles.findOne( { userId: userId } );
  return (!!profile && profile.isAdmin);
}

Meteor.publish('userProfiles', function() {
  if(this.userId){
    return isAdmin(this.userId)
            ? UserProfiles.find()
            : UserProfiles.find( { userId: this.userId } );
  }
});

Meteor.publish('callCenters', function() {
  if(this.userId){
    return isAdmin(this.userId)
            ? CallCenters.find()
            : CallCenters.find( {
                $and: [
                        { callers: { $exists: true } },
                        { callers: this.userId },
                        { isRemoved: false }
                      ]
            } );
  }
});

Meteor.publish('assignedCallPackets', function(callCenterId) {
  check(callCenterId, String);
  if(this.userId){
    return isAdmin(this.userId)
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
    return isAdmin(this.userId)
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
    return isAdmin(this.userId)
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

