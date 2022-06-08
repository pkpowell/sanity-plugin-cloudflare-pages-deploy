"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _cloudflareStatus = _interopRequireDefault(require("./cloudflare-status.css"));

var StatusIndicator = function StatusIndicator(_ref) {
  var status = _ref.status,
      children = _ref.children;
  return /*#__PURE__*/_react["default"].createElement("span", {
    className: _cloudflareStatus["default"].hookStatusIndicator,
    "data-indicator": status
  }, titleCase(status), children);
};

var titleCase = function titleCase(str) {
  return str === null || str === void 0 ? void 0 : str.toLowerCase().split(' ').map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};

var _default = StatusIndicator;
exports["default"] = _default;