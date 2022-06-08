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

var _swr = _interopRequireDefault(require("swr"));

var _spacetime = _interopRequireDefault(require("spacetime"));

var _client = _interopRequireDefault(require("part:@sanity/base/client"));

var _ui = require("@sanity/ui");

var _icons = require("@sanity/icons");

var _deployItem = _interopRequireDefault(require("./deploy-item.css"));

var _cloudflareStatus = _interopRequireDefault(require("./cloudflare-status"));

var _deployHistory = _interopRequireDefault(require("./deploy-history"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var fetcher = function fetcher(url, email, apiKey) {
  return _axios["default"].get(url, {
    headers: {
      'X-Auth-Email': email,
      'X-Auth-Key': apiKey,
      'Content-Type': 'application/json'
    }
  }).then(function (res) {
    return res.data;
  });
};

var deployItem = function deployItem(_ref) {
  var _deploymentData$resul;

  var name = _ref.name,
      id = _ref.id,
      cloudflareApiEndpointUrl = _ref.cloudflareApiEndpointUrl,
      cloudflareProject = _ref.cloudflareProject,
      cloudflareEmail = _ref.cloudflareEmail,
      cloudflareAPIKey = _ref.cloudflareAPIKey;

  var client = _client["default"].withConfig({
    apiVersion: '2021-03-25'
  });

  var _useState = (0, _react.useState)(true),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      isLoading = _useState2[0],
      setIsLoading = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      isDeploying = _useState4[0],
      setDeploying = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
      isHistoryOpen = _useState6[0],
      setIsHistoryOpen = _useState6[1];

  var _useState7 = (0, _react.useState)(null),
      _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
      errorMessage = _useState8[0],
      setErrorMessage = _useState8[1];

  var _useState9 = (0, _react.useState)('loading'),
      _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
      status = _useState10[0],
      setStatus = _useState10[1];

  var _useState11 = (0, _react.useState)(null),
      _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
      timestamp = _useState12[0],
      setTimestamp = _useState12[1];

  var _useState13 = (0, _react.useState)(null),
      _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
      buildTime = _useState14[0],
      setBuildTime = _useState14[1];

  var toast = (0, _ui.useToast)();

  var _useSWR = (0, _swr["default"])([cloudflareApiEndpointUrl, cloudflareEmail, cloudflareAPIKey], function (url, email, apiKey) {
    return fetcher(url, email, apiKey);
  }, {
    errorRetryCount: 3,
    refreshInterval: isDeploying ? 5000 : 0,
    onError: function onError(err) {
      var _err$response, _err$response$data, _err$response$data$er;

      // to not make things too complicated - display just the first error
      var errorMessage = (_err$response = err.response) === null || _err$response === void 0 ? void 0 : (_err$response$data = _err$response.data) === null || _err$response$data === void 0 ? void 0 : (_err$response$data$er = _err$response$data.errors[0]) === null || _err$response$data$er === void 0 ? void 0 : _err$response$data$er.message;
      setStatus('unavailable');
      setErrorMessage(errorMessage);
      setIsLoading(false);
    }
  }),
      deploymentData = _useSWR.data;

  var onDeploy = function onDeploy() {
    setStatus('initiated');
    setDeploying(true);
    setTimestamp(null);
    setBuildTime(null);

    _axios["default"].post(cloudflareApiEndpointUrl, {}, {
      headers: {
        'X-Auth-Email': cloudflareEmail,
        'X-Auth-Key': cloudflareAPIKey,
        'Content-Type': 'application/json'
      }
    }).then(function (res) {
      toast.push({
        status: 'success',
        title: 'Success!',
        description: "Triggered Deployment: ".concat(name)
      });
    })["catch"](function (err) {
      setDeploying(false);
      toast.push({
        status: 'error',
        title: 'Deploy Failed.',
        description: "".concat(err)
      });
    });
  };

  var onCancel = function onCancel(deploymentId) {
    setIsLoading(true);

    _axios["default"].post("".concat(cloudflareApiEndpointUrl, "/").concat(deploymentId, "/cancel"), null, {
      headers: {
        'X-Auth-Email': cloudflareEmail,
        'X-Auth-Key': cloudflareAPIKey,
        'Content-Type': 'application/json'
      }
    }).then(function (res) {
      var _res$data;

      return (_res$data = res.data) === null || _res$data === void 0 ? void 0 : _res$data.result;
    }).then(function (res) {
      var _res$latest_stage;

      setStatus('canceled');
      setDeploying(false);
      setIsLoading(false);
      setBuildTime(null);
      setTimestamp(res === null || res === void 0 ? void 0 : (_res$latest_stage = res.latest_stage) === null || _res$latest_stage === void 0 ? void 0 : _res$latest_stage.ended_on);
    });
  }; // removes the whole deployments-entry in sanity


  var onRemove = function onRemove() {
    setIsLoading(true);
    client["delete"](id).then(function (res) {
      toast.push({
        status: 'success',
        title: "Successfully deleted deployment: ".concat(name)
      });
    });
  }; // set status when new deployment data comes in


  (0, _react.useEffect)(function () {
    var isSubscribed = true;

    if (deploymentData !== null && deploymentData !== void 0 && deploymentData.result && isSubscribed) {
      var _latestDeployment$lat;

      var latestDeployment = deploymentData.result[0];
      setStatus((latestDeployment === null || latestDeployment === void 0 ? void 0 : (_latestDeployment$lat = latestDeployment.latest_stage) === null || _latestDeployment$lat === void 0 ? void 0 : _latestDeployment$lat.status) || 'idle');

      if (latestDeployment !== null && latestDeployment !== void 0 && latestDeployment.created_on) {
        setTimestamp(latestDeployment === null || latestDeployment === void 0 ? void 0 : latestDeployment.created_on);
      }

      setIsLoading(false);
    }

    return function () {
      return isSubscribed = false;
    };
  }, [deploymentData]); // update deploy state after status is updated

  (0, _react.useEffect)(function () {
    var isSubscribed = true;

    if (isSubscribed) {
      if (status === 'success' || status === 'idle' || status === 'failure' || status === 'canceled') {
        setDeploying(false);
      } else if (status === 'active') {
        setDeploying(true);
      }
    }

    return function () {
      return isSubscribed = false;
    };
  }, [status]); // count build time

  var tick = function tick(timestamp) {
    if (timestamp) {
      setBuildTime(_spacetime["default"].now().since((0, _spacetime["default"])(timestamp)).rounded);
    }
  };

  (0, _react.useEffect)(function () {
    var isTicking = true;
    var timer = setInterval(function () {
      if (isTicking && isDeploying) {
        tick(timestamp);
      }
    }, 1000);

    if (!isDeploying) {
      clearInterval(timer);
    }

    return function () {
      isTicking = false;
      clearInterval(timer);
    };
  }, [timestamp, isDeploying]);
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: _deployItem["default"].hook
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _deployItem["default"].hookDetails
  }, /*#__PURE__*/_react["default"].createElement("h4", {
    className: _deployItem["default"].hookTitle
  }, /*#__PURE__*/_react["default"].createElement("span", null, name), /*#__PURE__*/_react["default"].createElement(_ui.Badge, null, cloudflareProject)), /*#__PURE__*/_react["default"].createElement("p", {
    className: _deployItem["default"].hookURL
  }, cloudflareApiEndpointUrl)), /*#__PURE__*/_react["default"].createElement("div", {
    className: _deployItem["default"].hookActions
  }, cloudflareEmail && cloudflareAPIKey && cloudflareProject && /*#__PURE__*/_react["default"].createElement("div", {
    className: _deployItem["default"].hookStatus
  }, /*#__PURE__*/_react["default"].createElement(_cloudflareStatus["default"], {
    status: status
  }, errorMessage && /*#__PURE__*/_react["default"].createElement(_ui.Tooltip, {
    content: /*#__PURE__*/_react["default"].createElement(_ui.Box, {
      padding: 2
    }, /*#__PURE__*/_react["default"].createElement(_ui.Text, {
      muted: true,
      size: 1
    }, /*#__PURE__*/_react["default"].createElement("span", {
      style: {
        display: 'inline-block',
        textAlign: 'center'
      }
    }, errorMessage))),
    placement: "top"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: _deployItem["default"].hookStatusError
  }, /*#__PURE__*/_react["default"].createElement(_ui.Badge, {
    mode: "outline",
    tone: "critical"
  }, "?")))), /*#__PURE__*/_react["default"].createElement("span", {
    className: _deployItem["default"].hookTime
  }, isDeploying ? buildTime || '--' : timestamp ? _spacetime["default"].now().since((0, _spacetime["default"])(timestamp)).rounded : '--')), /*#__PURE__*/_react["default"].createElement(_ui.Inline, {
    space: 2
  }, /*#__PURE__*/_react["default"].createElement(_ui.Button, {
    type: "button",
    tone: "positive",
    disabled: isDeploying || isLoading || status === 'unavailable',
    loading: isDeploying || isLoading,
    onClick: function onClick() {
      return onDeploy();
    },
    text: "Deploy"
  }), isDeploying && status === 'active' && /*#__PURE__*/_react["default"].createElement(_ui.Button, {
    type: "button",
    tone: "critical",
    onClick: function onClick() {
      return onCancel(deploymentData.result[0].id);
    },
    text: "Cancel"
  }), /*#__PURE__*/_react["default"].createElement(_ui.MenuButton, {
    button: /*#__PURE__*/_react["default"].createElement(_ui.Button, {
      mode: "bleed",
      icon: _icons.EllipsisVerticalIcon,
      disabled: isDeploying || isLoading
    }),
    portal: true,
    menu: /*#__PURE__*/_react["default"].createElement(_ui.Menu, null, /*#__PURE__*/_react["default"].createElement(_ui.MenuItem, {
      text: "History",
      icon: _icons.ClockIcon,
      onClick: function onClick() {
        return setIsHistoryOpen(true);
      },
      disabled: !(deploymentData !== null && deploymentData !== void 0 && (_deploymentData$resul = deploymentData.result) !== null && _deploymentData$resul !== void 0 && _deploymentData$resul.length)
    }), /*#__PURE__*/_react["default"].createElement(_ui.MenuItem, {
      text: "Delete",
      icon: _icons.TrashIcon,
      tone: "critical",
      onClick: function onClick() {
        return onRemove();
      }
    })),
    placement: "bottom"
  })))), isHistoryOpen && /*#__PURE__*/_react["default"].createElement(_ui.Dialog, {
    header: "Deployment History: ".concat(name, " (").concat(cloudflareProject, ")"),
    onClickOutside: function onClickOutside() {
      return setIsHistoryOpen(false);
    },
    onClose: function onClose() {
      return setIsHistoryOpen(false);
    },
    width: 2
  }, /*#__PURE__*/_react["default"].createElement(_ui.Box, {
    padding: 4
  }, /*#__PURE__*/_react["default"].createElement(_deployHistory["default"], {
    cloudflareApiEndpointUrl: cloudflareApiEndpointUrl,
    cloudflareProject: cloudflareProject,
    cloudflareEmail: cloudflareEmail,
    cloudflareAPIKey: cloudflareAPIKey
  }))));
};

var _default = deployItem;
exports["default"] = _default;