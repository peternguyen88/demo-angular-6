import * as $ from 'jquery';

export class ScreenUtils {
  public static getWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }

  public static isOnSmallScreen() {
    return ScreenUtils.getWidth() <= 800;
  }

  static xPosBeforeModal = 0;
  static yPosBeforeModal = 0;

  static preventBackgroundScroll(shouldPrevent){  // Need to add Modal Module for this to have effect
    if(shouldPrevent){
      if (!document.body.classList.contains('modal-open')){
        document.body.classList.add('modal-open');
      }

      if(ScreenUtils.isOnSmallScreen()){
        const rect = document.body.getBoundingClientRect();
        ScreenUtils.xPosBeforeModal = rect.left;
        ScreenUtils.yPosBeforeModal = rect.top;

        $('#summary-page').hide();
      }
    }else{
      if (document.body.classList.contains('modal-open')){
        document.body.classList.remove('modal-open');
      }

      if(ScreenUtils.isOnSmallScreen()){
        window.scrollTo(this.xPosBeforeModal, -this.yPosBeforeModal);
        $('#summary-page').show();
      }
    }
  }
}
