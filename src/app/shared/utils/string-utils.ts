export class StringUtils {
  public static cleanupURLForGA(url: string) {
    url = url.replace(/(.*)\/practice.*/,'$1');
    url = url.replace(/(.*)\/review.*/,'$1');
    return url;
  }
}
