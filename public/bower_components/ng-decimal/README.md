ng-decimal
==========

AngularJS Directive for decimal numbers.

Main features:

* Permits work with decimal numbers
* Has a decimal limiter
* The only required dependency is angular!
* Input value is always filtered with locale number when load and on blur (with the decimal limit).

## Bower

You may install it via bower using

`bower install ng-decimal`

## How to use


+ Include the required libraries:

>
``` html
<script src="/path/to/angular.js"></script>
<script src="/path/to/ng-decimal.js"></script>
```

+ Inject the `ngDecimal` module into your app:

>
``` JavaScript
angular.module('myApp', ['ng-decimal']);
```

+ In your input tag

>
``` html
<input type="text" model="yourModel" ng-decimal />
```

+ It is also possible to add 'max decimal'

>
``` html
<input type="text" model="yourModel" ng-decimal decimal="3" />
```

+ If you want to be able to dynamically change maxdecimal

>
``` html
<input type="text" model="yourModel" ng-decimal decimal="my_scope_variable" />
```

## Authors

**Bruno Porto**

+ http://github.com/brunoporto


## Copyright and license

	The MIT License

	Copyright (c) 2012 - 2014 Olivier Louvignes

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
