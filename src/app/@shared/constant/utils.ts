export default class Utils {  
  static getPosition(str, substr, index) {
    return str.split(substr, index).join(substr).length;
  }

  static saveLastLoc() {
    let str = window.window.location.href;
    window.sessionStorage.lastloc = str.substring(Utils.getPosition(str, '/', 3));
  }

  static getLastLoc() {
    let val = window.sessionStorage.lastloc;
    window.sessionStorage.lastloc = '';
    return val;
  }
}

