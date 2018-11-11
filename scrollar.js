// ------------------------------------------
// Scrollar.js
// v 1.0.0
// Parallax library
// Copyright (c) 2018 Park Jong Won (@park.vroom)
// MIT license
// ------------------------------------------

(function(root, factory){
  // AMD. Register as an anonymous module.
  if (typeof define === "function" && define.amd) define([], factory);
  // Node. Does not work with strict CommonJS, but only CommonJS-like environments that support module.exports, like Node.
  else if (typeof module === "object" && module.exports) module.exports = factory();
  // Browser globals (root is window)
  else root.Scrollar = factory();
}(this, function(){
  var Scrollar = function(elems, opts){
    "use strict";

    // create new prototype object
    var
      self, isObject, pos, size, calcSize, getHeight, isNode, cpos, blocks = [], notLegitWrappers = [], frame, frameId, frameClear, pause, transformProp,
      init, createBlock, cacheBlocks, getOffset, scrollState, updatePosition, animate, update;

    self = Object.create(Scrollar.prototype);

    notLegitWrappers = [document, window]; // I couldn't think of a better name :)

    isObject = function(o){return o && typeof o === "object" && o.constructor === Object;};

    // apply user defined options to default configs
    self.conf = {
      // the parent of scrollar object,
      wrapper: null,
      // direction of the scroll (supports only vertical for now)
      vertical: true, // horizontal: true,
      // speed of the blocks (data-scrollar tags override this config)
      // movement value to 1px scroll (e.g. 0.6 : 1 means the element will scroll 0.6px when the window is scrolled 1px)
      speed: 0.6,
      // amount of travel until stop (in px)
      // prevent extra scrolling
      distance: 1000,
      // callback when element is moved
      callback: null,
    };

    // apply user defined options
    // no need for deep extend right now
    if (opts){
      Object.keys(opts).forEach(function(key){
        self.conf[key] = opts[key];
      });
    }

    // fix conf
    if (typeof self.conf.callback !== "function") self.conf.callback = function(){};

    // used to store blocks
    self.blocks = [];

    // default to .scrollar if not provided, make elems an array for looping later if not array
    elems = !elems ? [".scrollar"] : elems.constructor !== "Array" ? [elems] : elems;

    // validate if elems exist
    for (var i = 0; i < elems.length; i++){
      if (!document.querySelector(elems[i])) throw new Error("The elements you are trying to select ["+(elems[i])+"] don't exist.");
    }
    self.elems = elems;
    self.elemsNode = document.querySelectorAll(elems);

    // check if element is node, convert if not
    isNode = function(el){
      return typeof el === "string" ? document.querySelector(el) : el;
    };

    // validate wrapper if assigned, else assign document as wrapper
    if (self.conf.wrapper){
      if (document.querySelector(self.conf.wrapper)) self.wrapper = self.conf.wrapper;
      else throw new Error("The wrapper you are trying to select ["+(self.conf.wrapper)+"] doesn't exist.");
    } else self.wrapper = document;

    // returns current scroll top based on wrapper target (default is window)
    cpos = function(isY, wrapper){
      isY = isY || true;
      wrapper = wrapper || window;
      if (!isY) return; // currently only support y
      return isNode(wrapper).scrollY;
    };

    // scroll position
    pos = {
      // ox, cx
      oy: 0, // old y value
      cy: cpos(), // current (new) y value
    };

    calcSize = function(){
      var calc = {
        // use inner value!
        window: {
          height: {
            full: window.innerHeight,
          },
          width: {
            full: window.innerWidth,
          },
        }
      };
      calc.window.height.half = calc.window.height.full / 2;
      calc.window.width.half = calc.window.width.full / 2;
      size = calc;
    };

    // gives size info, will change on resize
    calcSize();

    // check for requestAnimationFrame, use setTimeout if not supported
    frame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      function(callback){return setTimeout(callback, 1000/60);}; // simulate 60 FPS

    frameId = null;

    frameClear = window.cancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      function(requestID){clearTimeout(requestID);}; // fall back

    // used to manually pause actions, set to true for init
    pause = true;

    // check which transform property to use
    transformProp = window.transformProp || (function(){
      var testEl = document.createElement("div");
      if (testEl.style.transform === null){
        var vendors = ["Webkit", "Moz", "ms"];
        for (var vendor in vendors){
          if (testEl.style[ vendors[vendor] + "Transform" ] !== undefined) return vendors[vendor] + "Transform";
        }
      }
      return "transform";
    })();

    getHeight = function(el){
      var styles, margin;
      // Get the DOM Node if you pass in a string
      el = isNode(el);
      styles = window.getComputedStyle(el);
      margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
      return el.getBoundingClientRect().height + margin;
    };

    // checks for any change in scroll position and return boolean
    // supports only vertical for now
    scrollState = function(){
      // update old
      pos.oy = pos.cy;

      // update new
      pos.cy = cpos();

      // true: scroll position DID change
      // false: scroll position DID NOT change
      return pos.cy !== pos.oy && self.conf.vertical;
    };

    updatePosition = function(el, offsetY, block){
      var transform, customTransform = "";

      // if block data exists, apply speed & previous transform style
      // this filters out init updatePosition with no block data
      if (block){
        offsetY = offsetY * block.travel.speed;
        customTransform = " " + block.transform;
      }

      // apply transform value to style
      transform = "translate3d(0px, " + offsetY + "px, 0px)" + customTransform;
      el.style[transformProp] = transform;

      return {offsetY: offsetY, transform: transform};
    };

    animate = function(){
      var len = self.elemsNode.length;

      for (var i = 0; i < len; i++){
        var block, elem, toWrapper;

        block = blocks[i];
        elem = self.elemsNode[i];

        // check if wrapper is legit
        if (block.offsetY.isWrapperLegit){
          toWrapper = pos.cy - block.offsetY.wrapper;
        } else {
          // wrapper is document/window
          var fakeWrapperTop;
          // if block is within the first window height of the document, set toWrapper to pos.cy
          if (block.offsetY.abs + block.mtdt.height.full < size.window.height.full) toWrapper = pos.cy;
          else {
            // fake wrapper = centers the block to the window
            // calculation: abs - (window height/2 - block height half)
            fakeWrapperTop = block.offsetY.abs - (size.window.height.half - block.mtdt.height.half);
            toWrapper = pos.cy - fakeWrapperTop;
          }
        }

        // distance limiter, stops extra style change when the elment is not seen
        // this limiter unaccounts for the speed, so it's (distance) px of real (user) scroll
        if (toWrapper > self.conf.distance || toWrapper < -self.conf.distance) continue;

        updatePosition(elem, toWrapper, block);
      }
      self.conf.callback();
    };

    // get offset of element
    // NOTE: need to react on resize
    getOffset = function(el){
      // not legit wrapper (document/window) because they are at 0
      if (notLegitWrappers.indexOf(el) >= 0) return {top: 0, right: 0, bottom: 0, left: 0};
      // keep aware of odd value calculation: http://javascript.info/coordinates
      else {
        var _el, offset, translate3d;
        _el = isNode(el);
        // get offsett data
        offset = _el.getBoundingClientRect();
        // get current translate3d data for subtraction
        // which makes the animation smooth when resized
        translate3d = _el.style.transform.match(/translate3d\(([\w\W].*?)\)/);
        if (!translate3d) translate3d = [0, 0, 0];
        else {
          var captured = translate3d[1];
          translate3d = captured.split(",");
          for (var i = 0; i < translate3d.length; i++){
            translate3d[i] = parseFloat(translate3d[i]);
          }
        }
        // translate3d = translate3d.length > 0 ? translate3d: [0, 0, 0];
        return {
          // add window.scrollY to calculate the distance from the top of the page (document/window)
          // element.getBoundingClientRect() gives the position within the viewport
          // window.scrollY gives the distance from the top of the viewport to the top of the document.
          top: offset.y + window.scrollY - translate3d[1],
        };
      }
    };

    // create data for block for animation
    createBlock = function(el, i){
      var opts = {}, data = {}, wrapper, _el = isNode(el);

      // get attributes
      opts.speed = Number(_el.getAttribute("data-scrollar-speed")) || self.conf.speed;
      wrapper = _el.getAttribute("data-scrollar-wrapper");

      // check if wrapper provided in wrapper is valid
      // if not, default to self.wrapper
      if (wrapper){
        if (!document.querySelector(wrapper)) throw new Error("The wrapper you are trying to select ["+(self.conf.wrapper)+"] doesn't exist.");
      } else wrapper = self.wrapper;

      // offset
      data.offsetY = {};
      // offset abs(olute): offset from document top
      // offset rel(ative): offset from wrapper top
      data.offsetY.abs = getOffset(_el).top;
      data.offsetY.wrapper = getOffset(wrapper).top;
      data.offsetY.isWrapperLegit = notLegitWrappers.indexOf(wrapper) === -1;
      data.offsetY.rel = data.offsetY.abs - data.offsetY.wrapper; // abs offset - wrapper offset

      // initialize element position (neg the distance to achieve opposite startt)
      // do it after getting offset data
      // NOTE: turn it off for now since init forces animate()
      // updatePosition(self.elemsNode[i], -opts.distance);

      // travel info
      data.travel = {
        zero: data.offsetY.abs,
        speed: opts.speed,
      };

      // block metadata
      data.mtdt = {
        height: {
          full: getHeight(el),
        },
      };
      data.mtdt.height.half = data.mtdt.height.full / 2;

      // retrieve inline transform style, but remove translate3d value
      // NOTE: to get transform style from css files
      // refer to https://www.w3.org/TR/2011/WD-css3-2d-transforms-20111215/#matrix-decomposition
      data.transform = self.elemsNode[i].style.transform.replace(/translate3d\([\w\W].*?\)/, "");

      return data;
    };

    cacheBlocks = function(){
      var len = self.elemsNode.length;
      // delete blocks
      blocks = [];
      // create blocks
      for (var i = 0; i < len; i++){
        var block = createBlock(self.elemsNode[i], i);
        blocks.push(block);
      }
      self.blocks = blocks;
    };

    // update (animate) frame based on the current state
    update = function(){
      if (scrollState() && pause === false) animate();

      // loop the update
      frameId = frame(update);
    };

    init = function(){
      // recalculate size
      calcSize();

      // cache blocks for animation & update
      cacheBlocks();

      // force animate for init
      // when the user opens the browser OR resizes the window
      animate();

      // start animation frame loading
      update();

      if (pause){
        window.addEventListener("resize", init);
        pause = false;
      }
    };

    // allow init (refresh) on request
    self.refresh = init;

    self.destroy = function(){
      // Remove resize event listener if not pause, and pause
      if (!pause){
        window.removeEventListener("resize", init);
        pause = true;
      }

      // Clear the animation loop to prevent possible memory leak
      frameClear(frameId);
      frameId = null;
    };

    init();

    return self;
  };
  return Scrollar;
}));
