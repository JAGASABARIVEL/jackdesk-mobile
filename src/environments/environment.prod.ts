// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  googleClientId: "556673880157-840ns0acfd66aq42kjjaphg9l6dbqe5h.apps.googleusercontent.com"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

/** Constants */
// TODO:L Cahnge the Id to 5 in production accordingly
export const WEBSITE_OWNING_ORG = 5;

/** Service URIs */
export let HOST = 'https://api.jackdesk.com'
export let WEBSOCKET_HOST = 'https://solvedesktop.onrender.com'
//export let HOST = 'http://127.0.0.1:8000'
//export let WEBSOCKET_HOST = 'http://localhost:5001'
/** Google client */


/** Landing URIs */
export const DEFAULT_INDIVIDUAL_LANDING_APP = "apps/fmanager"
export const DEFAULT_ENTERPRISE_LANDING_APP = "apps"

export const SUPPORTED_MEDIA = [
  // Images
  "image/jpeg",
  "image/png",

  // Documents
  "application/pdf", // PDF
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // MS Word (.docx)
  "application/msword", // MS Word older format (.doc)

  // Spreadsheets
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel (.xlsx)
  "application/vnd.ms-excel", // Excel older format (.xls)

  // Archives
  "application/zip", // .zip
  "application/x-zip-compressed", // alternate for zip


  // Generic file fallback (optional)
  "application/octet-stream"

]