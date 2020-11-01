export const isObject = function(arg) {
	return Object.prototype.toString.call(arg) === '[object Object]';
}