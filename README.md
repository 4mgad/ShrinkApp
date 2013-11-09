ShrinkApp is a build utility for HTML5 applications (preferably single page applications). The goal is to produce a production ready HTML5 application with minified/complied css and js files along with the relevant HTML markup changes.

Features
---------

1. [x] Looks for html files and parses them to find script and link tags
2. [x] Compiles less files using less compiler (https://github.com/less/less.js)
3. [ ] Compiles sass (http://sass-lang.com/)
4. [x] Shrinks css files using yuicompressor (https://github.com/yui/yuicompressor/)
5. [x] Shrinks js files using closure compiler (https://github.com/dcodeIO/ClosureCompiler.js)
6. [x] Shrinks js files using UglifyJS (https://github.com/mishoo/UglifyJS2)
7. [x] Modifies tags pointing to less/css and js files to point to the minified ones
8. [x] Produces a build directory containing the shrunk application


Tested On
----------

- [x] AngularJS's seed application (https://github.com/angular/angular-seed)
- [ ] Bootstrap template from initializr.com
- [ ] Classic template from initializr.com
- [ ] Responsive template from initializr.com
- [ ] Bootstrap template from initializr.com
- [ ] HTML5 Boilerplate template from html5boilerplate.com. Version: 4.2.0
- [ ] Mobile Boilerplate template from html5boilerplate.com/mobile. Version: 4.1
- [ ] Twitter Bootstrap template from getbootstrap.com/2.3.2
