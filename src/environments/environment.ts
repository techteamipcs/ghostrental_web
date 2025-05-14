// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://localhost:5014',
  url:'http://localhost:4200',
  isBrowser: true, // Add a flag
  // baseUrl: 'https://pcommerce.pixtar.ae:5007',
  // url:'https://pcommerce.pixtar.ae',
  recaptcha_key : '6LdVAeAqAAAAANRiCTIwsrPp7DwcP3jSOpzVk0wi',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
