/// <reference path="../../typings/meteor/meteor.d.ts" />
declare var process: any;

export function getDbVersion() {
  console.log(HTTP.get(process.env.HF_COUCH_DB).content);
}
