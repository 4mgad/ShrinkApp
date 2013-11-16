ShrinkApp is a build utility for HTML5 applications (preferably single page applications). The goal is to produce a production ready HTML5 application with minified css and js files along with the relevant HTML markup changes.


Features
---------

1. [x] Looks for html files and parses them using htmlparser2 (https://github.com/fb55/htmlparser2) to find script and link tags
2. [x] Compiles less files using less compiler (https://github.com/less/less.js)
3. [ ] Compiles sass files (http://sass-lang.com/)
4. [x] Shrinks css files using yuicompressor (https://github.com/yui/yuicompressor/)
6. [x] Shrinks javascript files using UglifyJS (https://github.com/mishoo/UglifyJS2)
7. [x] Modifies HTML tags pointing to less/css and/or javascript files to point to the minified ones instead
8. [x] Generates well formatted HTML code using js-beautify (https://github.com/einars/js-beautify)
9. [x] Produces a build directory containing the shrunk application


Tested On
----------

- [x] AngularJS's seed application (https://github.com/angular/angular-seed)
- [x] Bootstrap template from initializr.com
- [x] Classic template from initializr.com
- [x] Responsive template from initializr.com
- [x] Bootstrap template from initializr.com
- [x] HTML5 Boilerplate template from html5boilerplate.com. Version: 4.2.0
- [x] Mobile Boilerplate template from html5boilerplate.com/mobile. Version: 4.1
- [x] Twitter Bootstrap template from getbootstrap.com/2.3.2


Install
-------

First make sure you have installed the latest version of [node.js](http://nodejs.org/)
(You may need to restart your computer after this step).

### From NPM for use as a command line app:

*On Linux:*

```
    npm install shrinkapp -g
```

*On Windows:*

```
    npm install shrinkapp@windows -g
```

### From NPM for programmatic use:

*On Linux:*

```
    npm install shrinkapp
```

*On Windows:*

```
    npm install shrinkapp@windows
```

From Git:

```
    git clone git://github.com/4mgad/ShrinkApp.git
    cd ShrinkApp
    npm link .
```


Usage
-----

```
    shrinkapp [source directory] [options]
```

The available options are:

```
  -c, --create-app [app-name]
        Create a default app.json under the specified source directory.

  -f, --force [app-name]
        If app.json already exists overwrite it.

  -v, --version
        Display package version.

```
