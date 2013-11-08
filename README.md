ShrinkApp is a build utility for HTML5 applications.

*It does the following to a directory containing HTML5 application (preferably single page applications):*

1. Looks for html files and parses them to find script and link tags
2. Compiles less files using less compiler (https://github.com/less/less.js)
3. Shrinks css files using yuicompressor (https://github.com/yui/yuicompressor/)
4. Shrinks js files using closure compiler (https://github.com/dcodeIO/ClosureCompiler.js)
5. Replaces tags pointing to less/css and js files with the minified ones
6. Produces a build directory containing the shrunk application


Tested On
----------

- [x] AngularJS's seed application (https://github.com/angular/angular-seed)


Future Enhancements
---------------------

1. [ ] Add support for UglifyJS (https://github.com/mishoo/UglifyJS2)
2. [ ] Add support for sass (http://sass-lang.com/)
3. [ ] Test on the following:

- [ ] Bootstrap template from initializr.com
- [ ] Classic template from initializr.com
- [ ] Responsive template from initializr.com
- [ ] Bootstrap template from initializr.com
- [ ] HTML5 Boilerplate template from html5boilerplate.com. Version: 4.2.0
- [ ] Mobile Boilerplate template from html5boilerplate.com/mobile. Version: 4.1
- [ ] Twitter Bootstrap template from getbootstrap.com/2.3.2
