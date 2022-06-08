"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _spacetime = _interopRequireDefault(require("spacetime"));

var _ui = require("@sanity/ui");

var _deployHistory = _interopRequireDefault(require("./deploy-history.css"));

var _cloudflareStatus = _interopRequireDefault(require("./cloudflare-status"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var DeployHistory = function DeployHistory(_ref) {
  var _state$deployments;

  var cloudflareApiEndpointUrl = _ref.cloudflareApiEndpointUrl,
      cloudflareProject = _ref.cloudflareProject,
      cloudflareEmail = _ref.cloudflareEmail,
      cloudflareAPIKey = _ref.cloudflareAPIKey;

  var _useState = (0, _react.useState)({}),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  (0, _react.useEffect)(function () {
    if (!cloudflareProject) {
      return;
    }

    setState({
      loading: true
    });

    _axios["default"].get(cloudflareApiEndpointUrl, {
      headers: {
        'X-Auth-Email': cloudflareEmail,
        'X-Auth-Key': cloudflareAPIKey,
        'Content-Type': 'application/json'
      }
    }).then(function (_ref2) {
      var data = _ref2.data;
      setState({
        deployments: data.result,
        loading: false,
        error: false
      });
    })["catch"](function (e) {
      setState({
        error: true,
        loading: false
      });
      console.warn(e);
    });
  }, [cloudflareProject]);

  if (state.loading) {
    return /*#__PURE__*/_react["default"].createElement(_ui.Flex, {
      align: "center",
      justify: "center"
    }, /*#__PURE__*/_react["default"].createElement(_ui.Spinner, {
      muted: true
    }));
  }

  if (state.error) {
    return /*#__PURE__*/_react["default"].createElement(_ui.Card, {
      padding: [3, 3, 4],
      radius: 2,
      shadow: 1,
      tone: "critical"
    }, /*#__PURE__*/_react["default"].createElement(_ui.Text, {
      size: [2, 2, 3]
    }, "Could not load deployments for ", cloudflareProject));
  }

  return /*#__PURE__*/_react["default"].createElement(_ui.Box, {
    as: "table",
    className: _deployHistory["default"].table
  }, /*#__PURE__*/_react["default"].createElement(_ui.Box, {
    as: "thead",
    style: {
      display: 'table-header-group'
    }
  }, /*#__PURE__*/_react["default"].createElement("tr", null, /*#__PURE__*/_react["default"].createElement("th", null, "Deployment"), /*#__PURE__*/_react["default"].createElement("th", null, "State"), /*#__PURE__*/_react["default"].createElement("th", null, "Commit"), /*#__PURE__*/_react["default"].createElement("th", null, "Time"))), /*#__PURE__*/_react["default"].createElement(_ui.Box, {
    as: "tbody",
    style: {
      display: 'table-row-group'
    }
  }, (_state$deployments = state.deployments) === null || _state$deployments === void 0 ? void 0 : _state$deployments.map(function (deployment) {
    var _deployment$latest_st, _deployment$deploymen, _deployment$deploymen2, _deployment$deploymen3, _deployment$deploymen4;

    return /*#__PURE__*/_react["default"].createElement("tr", {
      as: "tr",
      key: deployment.id
    }, /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement("a", {
      href: deployment.url,
      target: "_blank"
    }, deployment.url)), /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement(_cloudflareStatus["default"], {
      status: (_deployment$latest_st = deployment.latest_stage) === null || _deployment$latest_st === void 0 ? void 0 : _deployment$latest_st.status
    })), /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement("div", null, (_deployment$deploymen = deployment.deployment_trigger) === null || _deployment$deploymen === void 0 ? void 0 : (_deployment$deploymen2 = _deployment$deploymen.metadata) === null || _deployment$deploymen2 === void 0 ? void 0 : _deployment$deploymen2.commit_hash), /*#__PURE__*/_react["default"].createElement("small", {
      className: _deployHistory["default"].commit
    }, (_deployment$deploymen3 = deployment.deployment_trigger) === null || _deployment$deploymen3 === void 0 ? void 0 : (_deployment$deploymen4 = _deployment$deploymen3.metadata) === null || _deployment$deploymen4 === void 0 ? void 0 : _deployment$deploymen4.commit_message)), /*#__PURE__*/_react["default"].createElement("td", null, _spacetime["default"].now().since((0, _spacetime["default"])(deployment.created_on)).rounded));
  })));
};

var _default = DeployHistory;
exports["default"] = _default;