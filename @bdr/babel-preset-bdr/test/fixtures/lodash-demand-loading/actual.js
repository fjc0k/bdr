"use strict";

exports.__esModule = true;
exports.default = void 0;

var _isArray2 = _interopRequireDefault(require("lodash/isArray"));

var _isNumber2 = _interopRequireDefault(require("lodash/isNumber"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  isNumber: _isNumber2.default,
  isArray: _isArray2.default
};
exports.default = _default;