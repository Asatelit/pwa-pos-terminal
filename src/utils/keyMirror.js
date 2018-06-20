/**
 * Creating an object with values equal to its keys
 * @function keyMirror
 * @access public
 * @param {Object} obj
 * @returns {Object}
 */
export default function keyMirror(obj) {
  Object.keys(obj).forEach(key => Object.assign(obj, { [key]: key }));
  return obj;
}
