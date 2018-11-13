# **SCROLLAR**

[![NPM](https://nodei.co/npm/scrollar.png)](https://nodei.co/npm/scrollar/)

Scrollar is a super lightweight and awesome vanilla javascript parallax library.

### **Why use Scrollar?**
<p>Scrollar focuses on the ***original position*** of elements unlike many other parallax libraries.</p>
<p>If you use other libraries, parallax elements often **disappear** out of its original place and you have to manually adjust the position to make the elements appear in the place you want.</p>
<p>However, with Scrollar, all elements will smoothly scroll according to its original position so that you **DON'T** have to worry about manual positioning or other screen supports.</p>

### **Contents**
- **[Install](#install)**
- **[Getting Started](#getting-started)**
- **[Options](#options)**
- **[More Info on Options](#more-info-on-options)**
- **[License](#license)**
<!-- - **[Development](#development)** -->

#### **by [Park Jong Won](https://parkjongwon.com)**

## **Install**
**Old school like me -** Download and insert
```html
<script src="path/to/scrollar.min.js"></script>
```

or use **CDN**
```html
<script src="https://cdn.jsdelivr.net/npm/scrollar/scrollar.min.js"></script>
```

or use **NPM**
```
npm install scrollar --save
```

## **Getting Started**
```html
<div class="scrollar">
  I am moving at the default speed of 0.6px per 1px of scrolling
</div>
<div class="scrollar" data-scrollar-speed="2">
  I am super fast! -- 2px per 1px of scrolling
</div>
<div class="scrollar" data-scrollar-speed="-4">
  I am super slow! -- 0.2px per 1px of scrolling
</div>

<script src="scrollar.min.js"></script>
<script>
  // Accepts any class name (default is ".scrollar")
  var scrollar = new Scrollar(".scrollar");
</script>
```
Also with optional settings
```html
<script>
  var scrollar = new Scrollar(".scrollar", {
    speed: 0.6,
    wrapper: null,
    distance: 1000,
    vertical: true,
    callback: null,
  });
</script>
```

## **Options**
\* *Future options*

Option | Explanation | Accepted
--- | --- | ---
speed | How much pixel per user scrolled pixel should the parallax element be moved.<br><br>DEFAULT: `0.6` px | number (px)
wrapper | The parent element of the parallax element. Used to evaluate offset top and align the parallax element according to the wrapper.<br><br>DEFAULT: `null` (document) | any class name
distance | The distance in px before the parallax element pauses. Prevents unnecessary parallax scrolling once out of the designated area. <br><br>DEFAULT: `1000` px | number (px)
&#x01C2; vertical | Should vertical parallax scrolling be activated.<br><br>DEFAULT: `true` | boolean
&#x01C2; \**horizontal* | Should horizontal parallax scrolling be activated.<br><br>DEFAULT: `false` | boolean
callback | Function to be called when any of the parallax element is moved.<br><br>PARAMETERS: `none` | function

&#x01C2; Only one can be `true`

## **More Info on Options**
#### **speed**
The scrolling speed (in px) of the parallax element per user scrolled px. In other words, the speed represents how much the element should move when the user scrolls 1px.

<!-- #### **wrapper** -->


<!-- ## **Development**

1. Open demo.html
2. Make code changes & refresh browser
3. Once done, fix lint issues with [jshint](https://jshint.com/)
4. Use [Google Closure Compiler](http://closure-compiler.appspot.com/home) to minify
5. Cheers! :cocktail: :beers: :wine_glass: -->

## **License**
MIT License

Copyright (c) 2018 Park Jong Won

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
