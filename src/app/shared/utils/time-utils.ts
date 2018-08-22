export class TimeUtils {
  static epoch_to_mm_ss(epoch) {
    return new Date(epoch * 1000).toISOString().substr(14, 5);
  }
}
