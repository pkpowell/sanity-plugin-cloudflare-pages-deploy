"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _nanoid = require("nanoid");

var _client = _interopRequireDefault(require("part:@sanity/base/client"));

var _anchor = _interopRequireDefault(require("part:@sanity/components/buttons/anchor"));

var _default2 = _interopRequireDefault(require("part:@sanity/components/formfields/default"));

var _ui = require("@sanity/ui");

var _cloudflareDeploy = _interopRequireDefault(require("./cloudflare-deploy.css"));

var _deployItem = _interopRequireDefault(require("./deploy-item"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var initialDeploy = {
  title: '',
  project: '',
  apiUrl: '',
  email: '',
  apiKey: ''
};

var CloudflareDeploy = function CloudflareDeploy() {
  var WEBHOOK_TYPE = 'webhook_deploy';
  var WEBHOOK_QUERY = "*[_type == \"".concat(WEBHOOK_TYPE, "\"] | order(_createdAt)");

  var client = _client["default"].withConfig({
    apiVersion: '2021-03-25'
  });

  var _useState = (0, _react.useState)(true),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      isLoading = _useState2[0],
      setIsLoading = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      isSubmitting = _useState4[0],
      setIsSubmitting = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
      isFormOpen = _useState6[0],
      setIsFormOpen = _useState6[1];

  var _useState7 = (0, _react.useState)([]),
      _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
      deploys = _useState8[0],
      setDeploys = _useState8[1];

  var _useState9 = (0, _react.useState)(initialDeploy),
      _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
      pendingDeploy = _useState10[0],
      setpendingDeploy = _useState10[1];

  var toast = (0, _ui.useToast)();

  var onSubmit = /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              setIsSubmitting(true);
              client.create({
                // Explicitly define an _id inside the cloudflare-deploy path to make sure it's not publicly accessible
                // This will protect users' tokens & project info. Read more: https://www.sanity.io/docs/ids
                _id: "cloudflare-pages-deploy.".concat((0, _nanoid.nanoid)()),
                _type: WEBHOOK_TYPE,
                name: pendingDeploy.title,
                cloudflareApiEndpointUrl: "".concat(pendingDeploy.apiUrl, "/client/v4/accounts/").concat(accountId, "/pages/projects/").concat(pendingDeploy.project, "/deployments"),
                cloudflareAccountId: pendingDeploy.accountID,
                cloudflareProject: pendingDeploy.project,
                cloudflareEmail: pendingDeploy.email,
                cloudflareApiKey: pendingDeploy.apiKey
              }).then(function () {
                toast.push({
                  status: 'success',
                  title: 'Success!',
                  description: "Created Deployment: ".concat(pendingDeploy.title)
                });
                setIsFormOpen(false);
                setIsSubmitting(false);
                setpendingDeploy(initialDeploy); // Reset the pending webhook state
              });

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function onSubmit() {
      return _ref.apply(this, arguments);
    };
  }(); // Fetch all existing webhooks and listen for newly created


  (0, _react.useEffect)(function () {
    var webhookSubscription;
    client.fetch(WEBHOOK_QUERY).then(function (w) {
      setDeploys(w);
      setIsLoading(false);
      webhookSubscription = client.listen(WEBHOOK_QUERY, {}, {
        includeResult: true
      }).subscribe(function (res) {
        var wasCreated = res.mutations.some(function (item) {
          return Object.prototype.hasOwnProperty.call(item, 'create');
        });
        var wasDeleted = res.mutations.some(function (item) {
          return Object.prototype.hasOwnProperty.call(item, 'delete');
        });

        if (wasCreated) {
          setDeploys(function (prevState) {
            return [].concat((0, _toConsumableArray2["default"])(prevState), [res.result]);
          });
        }

        if (wasDeleted) {
          setDeploys(function (prevState) {
            return prevState.filter(function (w) {
              return w._id !== res.documentId;
            });
          });
        }
      });
    });
    return function () {
      webhookSubscription && webhookSubscription.unsubscribe();
    };
  }, []);
  return /*#__PURE__*/_react["default"].createElement(_ui.ThemeProvider, {
    theme: _ui.studioTheme
  }, /*#__PURE__*/_react["default"].createElement(_ui.ToastProvider, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: _cloudflareDeploy["default"].appContainer
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _cloudflareDeploy["default"].container
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _cloudflareDeploy["default"].header
  }, /*#__PURE__*/_react["default"].createElement("h2", {
    className: _cloudflareDeploy["default"].title
  }, /*#__PURE__*/_react["default"].createElement("svg", {
    fill: "currentColor",
    viewBox: "0 0 32 32",
    height: "64",
    width: "64",
    xmlns: "http://www.w3.org/2000/svg",
    className: _cloudflareDeploy["default"].titleIcon
  }, /*#__PURE__*/_react["default"].createElement("path", {
    d: "M8.16 23h21.177v-5.86l-4.023-2.307-.694-.3-16.46.113z",
    fill: "#fff"
  }), /*#__PURE__*/_react["default"].createElement("path", {
    d: "M22.012 22.222c.197-.675.122-1.294-.206-1.754-.3-.422-.807-.666-1.416-.694l-11.545-.15c-.075 0-.14-.038-.178-.094s-.047-.13-.028-.206c.038-.113.15-.197.272-.206l11.648-.15c1.38-.066 2.88-1.182 3.404-2.55l.666-1.735a.38.38 0 0 0 .02-.225c-.75-3.395-3.78-5.927-7.4-5.927-3.34 0-6.17 2.157-7.184 5.15-.657-.488-1.5-.75-2.392-.666-1.604.16-2.9 1.444-3.048 3.048a3.58 3.58 0 0 0 .084 1.191A4.84 4.84 0 0 0 0 22.1c0 .234.02.47.047.703.02.113.113.197.225.197H21.58a.29.29 0 0 0 .272-.206l.16-.572z",
    fill: "#f38020"
  }), /*#__PURE__*/_react["default"].createElement("path", {
    d: "M25.688 14.803l-.32.01c-.075 0-.14.056-.17.13l-.45 1.566c-.197.675-.122 1.294.206 1.754.3.422.807.666 1.416.694l2.457.15c.075 0 .14.038.178.094s.047.14.028.206c-.038.113-.15.197-.272.206l-2.56.15c-1.388.066-2.88 1.182-3.404 2.55l-.188.478c-.038.094.028.188.13.188h8.797a.23.23 0 0 0 .225-.169A6.41 6.41 0 0 0 32 21.106a6.32 6.32 0 0 0-6.312-6.302",
    fill: "#faae40"
  })), ' ', "Cloudflare Deployments")), /*#__PURE__*/_react["default"].createElement("div", {
    className: _cloudflareDeploy["default"].list
  }, isLoading ? /*#__PURE__*/_react["default"].createElement("div", {
    className: _cloudflareDeploy["default"].loader
  }, /*#__PURE__*/_react["default"].createElement(_ui.Flex, {
    direction: "column",
    align: "center",
    justify: "center"
  }, /*#__PURE__*/_react["default"].createElement(_ui.Spinner, {
    size: 4
  }), /*#__PURE__*/_react["default"].createElement(_ui.Box, {
    padding: 4
  }, /*#__PURE__*/_react["default"].createElement(_ui.Text, {
    size: 2
  }, "loading deployments...")))) : deploys.length ? deploys.map(function (deploy) {
    return /*#__PURE__*/_react["default"].createElement(_deployItem["default"], {
      key: deploy._id,
      name: deploy.name,
      id: deploy._id,
      cloudflareApiEndpointUrl: deploy.cloudflareApiEndpointUrl,
      cloudflareAccountId: deploy.cloudflareAccountId,
      cloudflareProject: deploy.cloudflareProject,
      cloudflareEmail: deploy.cloudflareEmail,
      cloudflareAPIKey: deploy.cloudflareApiKey
    });
  }) : /*#__PURE__*/_react["default"].createElement(EmptyState, null)), /*#__PURE__*/_react["default"].createElement("div", {
    className: _cloudflareDeploy["default"].footer
  }, /*#__PURE__*/_react["default"].createElement(_anchor["default"], {
    onClick: function onClick() {
      return setIsFormOpen(true);
    },
    bleed: true,
    color: "primary",
    kind: "simple"
  }, "Create New")))), isFormOpen && /*#__PURE__*/_react["default"].createElement(_ui.Dialog, {
    header: "New Deployment",
    id: "create-webhook",
    width: 1,
    onClickOutside: function onClickOutside() {
      return setIsFormOpen(false);
    },
    onClose: function onClose() {
      return setIsFormOpen(false);
    },
    footer: /*#__PURE__*/_react["default"].createElement(_ui.Box, {
      padding: 3
    }, /*#__PURE__*/_react["default"].createElement(_ui.Grid, {
      columns: 2,
      gap: 3
    }, /*#__PURE__*/_react["default"].createElement(_ui.Button, {
      padding: 4,
      mode: "ghost",
      text: "Cancel",
      onClick: function onClick() {
        return setIsFormOpen(false);
      }
    }), /*#__PURE__*/_react["default"].createElement(_ui.Button, {
      padding: 4,
      text: "Publish",
      tone: "primary",
      loading: isSubmitting,
      onClick: function onClick() {
        return onSubmit();
      },
      disabled: isSubmitting || !pendingDeploy.title || !pendingDeploy.project || !pendingDeploy.projectID || !pendingDeploy.apiUrl || !pendingDeploy.email || !pendingDeploy.apiKey
    })))
  }, /*#__PURE__*/_react["default"].createElement(_ui.Box, {
    padding: 4
  }, /*#__PURE__*/_react["default"].createElement(_ui.Stack, {
    space: 4
  }, /*#__PURE__*/_react["default"].createElement(_default2["default"], {
    label: "Display Title",
    description: "Give your deploy a name, like 'Production'"
  }, /*#__PURE__*/_react["default"].createElement(_ui.TextInput, {
    type: "text",
    value: pendingDeploy.title,
    onChange: function onChange(e) {
      e.persist();
      setpendingDeploy(function (prevState) {
        var _e$target;

        return _objectSpread(_objectSpread({}, prevState), {
          title: e === null || e === void 0 ? void 0 : (_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.value
        });
      });
    }
  })), /*#__PURE__*/_react["default"].createElement(_default2["default"], {
    label: "Cloudflare Project Name",
    description: "The exact name of the associated project on Cloudflare"
  }, /*#__PURE__*/_react["default"].createElement(_ui.TextInput, {
    type: "text",
    value: pendingDeploy.project,
    onChange: function onChange(e) {
      e.persist();
      setpendingDeploy(function (prevState) {
        var _e$target2;

        return _objectSpread(_objectSpread({}, prevState), {
          project: e === null || e === void 0 ? void 0 : (_e$target2 = e.target) === null || _e$target2 === void 0 ? void 0 : _e$target2.value
        });
      });
    }
  })), /*#__PURE__*/_react["default"].createElement(_default2["default"], {
    label: "Cloudflare API Endpoint URL",
    description: "The Cloudflare Workers url without trailing slashes e.g. 'https://worker.cf.com'"
  }, /*#__PURE__*/_react["default"].createElement(_ui.TextInput, {
    type: "url",
    value: pendingDeploy.apiUrl,
    onChange: function onChange(e) {
      e.persist();
      setpendingDeploy(function (prevState) {
        var _e$target3;

        return _objectSpread(_objectSpread({}, prevState), {
          apiUrl: e === null || e === void 0 ? void 0 : (_e$target3 = e.target) === null || _e$target3 === void 0 ? void 0 : _e$target3.value
        });
      });
    }
  })), /*#__PURE__*/_react["default"].createElement(_default2["default"], {
    label: "Cloudflare Email",
    description: "Required for API access"
  }, /*#__PURE__*/_react["default"].createElement(_ui.TextInput, {
    type: "email",
    value: pendingDeploy.email,
    onChange: function onChange(e) {
      e.persist();
      setpendingDeploy(function (prevState) {
        var _e$target4;

        return _objectSpread(_objectSpread({}, prevState), {
          email: e === null || e === void 0 ? void 0 : (_e$target4 = e.target) === null || _e$target4 === void 0 ? void 0 : _e$target4.value
        });
      });
    }
  })), /*#__PURE__*/_react["default"].createElement(_default2["default"], {
    label: "Cloudflare Account ID",
    description: "Account ID accociated with Project"
  }, /*#__PURE__*/_react["default"].createElement(_ui.TextInput, {
    type: "text",
    value: pendingDeploy.accountID,
    onChange: function onChange(e) {
      e.persist();
      setpendingDeploy(function (prevState) {
        var _e$target5;

        return _objectSpread(_objectSpread({}, prevState), {
          accountID: e === null || e === void 0 ? void 0 : (_e$target5 = e.target) === null || _e$target5 === void 0 ? void 0 : _e$target5.value
        });
      });
    }
  })), /*#__PURE__*/_react["default"].createElement(_default2["default"], {
    label: "Cloudflare API Key",
    description: "Cloudflare Global API Key"
  }, /*#__PURE__*/_react["default"].createElement(_ui.TextInput, {
    type: "text",
    value: pendingDeploy.apiKey,
    onChange: function onChange(e) {
      e.persist();
      setpendingDeploy(function (prevState) {
        var _e$target6;

        return _objectSpread(_objectSpread({}, prevState), {
          apiKey: e === null || e === void 0 ? void 0 : (_e$target6 = e.target) === null || _e$target6 === void 0 ? void 0 : _e$target6.value
        });
      });
    }
  })))))));
};

var EmptyState = function EmptyState() {
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    width: "360",
    viewBox: "0 0 64 64",
    className: _cloudflareDeploy["default"].emptyIcon
  }, /*#__PURE__*/_react["default"].createElement("g", {
    transform: "matrix(0.9375,0,0,1,2.00001,-2)"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    stroke: "#DDD",
    strokeWidth: "0.5",
    d: "M0.544,46L58.674,46L58.674,45.958L63.072,45.958C63.281,45.961 63.467,45.821 63.522,45.62C63.834,44.511 63.995,43.364 64,42.212C63.98,35.298 58.29,29.617 51.376,29.608L51.376,29.606L50.736,29.626C50.69,29.626 50.645,29.637 50.604,29.656L49.315,29.098C49.317,29.037 49.311,28.976 49.298,28.916C47.798,22.126 41.738,17.062 34.498,17.062C27.818,17.062 22.158,21.376 20.13,27.362C18.816,26.386 17.13,25.862 15.346,26.03C12.138,26.35 9.546,28.918 9.25,32.126C9.172,32.924 9.229,33.729 9.418,34.508C4.203,34.649 -0.008,38.983 0,44.2C0,44.668 0.04,45.14 0.094,45.606C0.134,45.832 0.32,46 0.544,46Z"
  })), /*#__PURE__*/_react["default"].createElement("g", {
    transform: "matrix(-1.1776e-16,0.615385,-0.928571,-1.65246e-16,43.7143,16.8462)"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    stroke: "#DDD",
    strokeWidth: "0.5",
    d: "M20.563,13.45L20.563,18L10,11L20.563,4L20.563,8.55L36,8.55L36,13.45L20.563,13.45Z"
  }))), /*#__PURE__*/_react["default"].createElement("p", {
    className: _cloudflareDeploy["default"].emptyList
  }, "No deploys created yet.", ' ', /*#__PURE__*/_react["default"].createElement("a", {
    className: _cloudflareDeploy["default"].emptyHelpLink,
    href: "https://github.com/estallio/sanity-plugin-cloudflare-pages-deploy#your-first-vercel-deployment",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Need help?")));
};

var _default = CloudflareDeploy;
exports["default"] = _default;