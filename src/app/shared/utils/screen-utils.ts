import * as $ from 'jquery';

declare var navigator: any;

export class ScreenUtils {

  private static iOSFullScreen = false;
  public static isOnIOSFullScreenMode() {
    ScreenUtils.iOSFullScreen = ('standalone' in navigator && navigator.standalone && (/iphone|ipod|ipad/gi).test(navigator.platform) && (/Safari/i).test(navigator.appVersion));
    return ScreenUtils.iOSFullScreen;
  }

  public static isOnPhoneFullScreenMode() {
    ScreenUtils.iOSFullScreen = ('standalone' in navigator && navigator.standalone);
    return ScreenUtils.iOSFullScreen;
  }

  public static initAutoLoginBackOnIOsDevices(location) {
    if (ScreenUtils.isOnIOSFullScreenMode()) {
      const lastVisit = localStorage.getItem('lastVisit');
      if(lastVisit && location.path(true) !== lastVisit){
        location.go(lastVisit);
      }
    }
  }

  public static updateLastVisitOnIOS(url){
    if(ScreenUtils.iOSFullScreen){
      localStorage.setItem('lastVisit', url);
    }
  }

  public static getWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }

  public static isOnSmallScreen() {
    return ScreenUtils.getWidth() <= 800;
  }

  static xPosBeforeModal = 0;
  static yPosBeforeModal = 0;

  static preventBackgroundScroll(shouldPrevent) {  // Need to add Modal Module for this to have effect
    if (shouldPrevent) {
      if (!document.body.classList.contains('modal-open')) {
        document.body.classList.add('modal-open');
      }

      if (ScreenUtils.isOnSmallScreen()) {
        const rect = document.body.getBoundingClientRect();
        ScreenUtils.xPosBeforeModal = rect.left;
        ScreenUtils.yPosBeforeModal = rect.top;

        $('#summary-page').hide();
      }
    } else {
      if (document.body.classList.contains('modal-open')) {
        document.body.classList.remove('modal-open');
      }

      if (ScreenUtils.isOnSmallScreen()) {
        window.scrollTo(this.xPosBeforeModal, -this.yPosBeforeModal);
        $('#summary-page').show();
      }
    }
  }
}
