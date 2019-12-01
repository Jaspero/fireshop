export const BROWSER_CONFIG = {
  webpSupported: true,

  /**
   * Here we detect if the device a mobile one
   * using navigation and window. Note this method
   * isn't a 100% reliable
   * http://detectmobilebrowsers.com/
   */
  isMobileDevice: false,

  /**
   * Screen resolution is captured at load time
   * and we don't refresh it on resize
   */
  screenWidth: 0,
  screenHeight: 0
};
