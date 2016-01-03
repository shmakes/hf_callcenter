/// <reference path="../../typings/meteor/meteor.d.ts" />
declare var process: any;

export function getDbVersion() {
  console.log(HTTP.get(process.env.COUCH_URL).content);
}
