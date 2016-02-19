import {UserProfiles} from 'collections/user_profiles';
import {CallCenters} from 'collections/call_centers';
import {CallPackets} from 'collections/call_packets';
import {VeteranCallSheets} from 'collections/veteran_call_sheets';
import {GuardianCallSheets} from 'collections/guardian_call_sheets';
import {Messages} from 'collections/messages';

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
    var filter: any;

    if (isSystemAdmin(this.userId)) {
      filter = {};
    } else if (isCenterAdmin(this.userId)) {
      filter = { $and: [ { isValidated: true } , { isRemoved: false } ] };
    } else {
      filter = { userId: this.userId };
    }

    return UserProfiles.find( filter );
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

Meteor.publish('callPackets', function(callCenterId) {
  check(callCenterId, String);
  if(this.userId){
    return isCenterAdmin(this.userId)
            ? CallPackets.find( {
                $and: [
                        { callCenterId: callCenterId }
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

Meteor.publish('veteranCallSheet', function(veteranCallSheetId) {
  check(veteranCallSheetId, String);
  if(this.userId){
    return isCenterAdmin(this.userId)
            ? VeteranCallSheets.find( { _id: veteranCallSheetId } )
            : VeteranCallSheets.find( {
                $and: [
                        { _id: veteranCallSheetId },
                   //     { callerId: this.userId },
                        { isRemoved: false }
                      ]
            } );
  }
});

Meteor.publish('guardianCallSheet', function(guardianCallSheetId) {
  check(guardianCallSheetId, String);
  if(this.userId){
    return isCenterAdmin(this.userId)
            ? GuardianCallSheets.find( { _id: guardianCallSheetId } )
            : GuardianCallSheets.find( {
                $and: [
                        { _id: guardianCallSheetId },
                   //     { callerId: this.userId },
                        { isRemoved: false }
                      ]
            } );
  }
});

Meteor.publish('messages', function(callCenterId) {
  check(callCenterId, String);
  if(this.userId){
    return isCenterAdmin(this.userId)
            ? Messages.find( {
                $and: [
                        { callCenterId: callCenterId }
                      ]
            }, { sort: { createdAt: -1 } } )
            : Messages.find( {
                $and: [
                        { callCenterId: callCenterId },
                        { $or: [ { callerId:  this.userId }, 
                                 { createdBy: this.userId } ] },
                        { isRemoved: false }
                      ]
            }, { sort: { createdAt: -1 } } );
  }
});

