"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.walkDOM = walkDOM;
exports.toArray = toArray;
exports.fireEvent = fireEvent;
exports.extend = extend;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _$(selector) {
  var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

  return toArray(element.querySelectorAll(selector));
}

exports.$ = _$;
function walkDOM(node) {
  var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
    return true;
  };
  var skipNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
    return false;
  };

  var arr = new QueryableArray();
  var loop = function loop(node) {
    return toArray(node.children).forEach(function (child) {
      filter(child) && arr.push(child);
      !skipNode(child) && child.hasChildNodes() && loop(child);
    });
  };
  loop(node);
  return arr;
}

function toArray(nodes) {
  var arr = [];
  for (var i = 0, ref = arr.length = nodes.length; i < ref; i++) {
    arr[i] = nodes[i];
  }
  return arr;
}

function fireEvent(eventName, target, eventData) {
  target = target || document.body;
  var event;
  try {
    event = new Event(eventName, { "bubbles": true, "cancelable": true });
  } catch (e) {
    event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
  }
  event.eventData = eventData || null;
  target.dispatchEvent(event);
}

function _html(html_string, target) {
  var fragment = document.createDocumentFragment();
  var temp_container = document.createElement('div');
  temp_container.innerHTML = html_string;
  while (temp_container.firstChild) {
    fragment.appendChild(temp_container.firstChild);
  }
  if (target) {
    target.innerHTML = '';
    target.appendChild(fragment);
    return target;
  }
  return fragment;
}

//deprecated
exports.html = _html;

var QueryableArray = function (_Array) {
  _inherits(QueryableArray, _Array);

  function QueryableArray() {
    _classCallCheck(this, QueryableArray);

    var _this = _possibleConstructorReturn(this, (QueryableArray.__proto__ || Object.getPrototypeOf(QueryableArray)).call(this));

    _this.querySelector = function (selector) {
      for (var index = 0; index < _this.length; index++) {
        if (_this[index].matches(selector)) {
          return _this[index];
        }
      }
      return null;
    };
    _this.querySelectorAll = function (selector) {
      var output = new QueryableArray();
      for (var index = 0; index < _this.length; index++) {
        _this[index].matches(selector) && output.push(_this[index]);
      }
      return output;
    };
    return _this;
  }

  return QueryableArray;
}(Array);

var BaseController = exports.BaseController = function (_extend) {
  _inherits(BaseController, _extend);

  function BaseController() {
    _classCallCheck(this, BaseController);

    return _possibleConstructorReturn(this, (BaseController.__proto__ || Object.getPrototypeOf(BaseController)).apply(this, arguments));
  }

  _createClass(BaseController, [{
    key: "componentType",
    get: function get() {
      return 'controller';
    }
  }]);

  return BaseController;
}(extend(HTMLElement));

var BaseComponent = exports.BaseComponent = function (_extend2) {
  _inherits(BaseComponent, _extend2);

  function BaseComponent() {
    _classCallCheck(this, BaseComponent);

    return _possibleConstructorReturn(this, (BaseComponent.__proto__ || Object.getPrototypeOf(BaseComponent)).apply(this, arguments));
  }

  _createClass(BaseComponent, [{
    key: "componentType",
    get: function get() {
      return 'component';
    }
  }]);

  return BaseComponent;
}(extend(HTMLElement));

function extend(baseClass) {
  return function (_baseClass) {
    _inherits(_class, _baseClass);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));
    }

    _createClass(_class, [{
      key: "toggleHighlight",
      value: function toggleHighlight() {
        this.classList.toggle(this.componentType + '-highlighted');
      }
    }, {
      key: "toggleHighlightAll",
      value: function toggleHighlightAll() {
        this.toggleHighlight();
        this.childComponents.forEach(function (child) {
          child.toggleHighlightAll();
        });
      }
    }, {
      key: "$",
      value: function $(selector) {
        return _$(selector, this);
      }
    }, {
      key: "trigger",
      value: function trigger(eventName, eventData) {
        fireEvent(eventName, this, eventData);
      }
    }, {
      key: "html",
      value: function html(html_string) {
        _html(html_string, this);
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        this.trigger('component-attached');
        this.addEventListener('component-attached', function (event) {
          event.stopPropagation();
        });
        _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "connectedCallback", this) && _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "connectedCallback", this).call(this);
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "disconnectedCallback", this) && _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "disconnectedCallback", this).call(this);
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback() {}
    }, {
      key: "__isAscesis",
      get: function get() {
        return true;
      }
    }, {
      key: "childComponents",
      get: function get() {
        return walkDOM(this, function (node) {
          return node.__isAscesis;
        }, function (node) {
          return node.__isAscesis;
        });
      }
    }, {
      key: "parentComponent",
      get: function get() {
        var parent = this;
        while (parent = parent.parentNode) {
          if (parent.__isAscesis) {
            break;
          }
        }
        return parent;
      }
    }]);

    return _class;
  }(baseClass);
}