ShrinkApp is a build utility for HTML5 applications (preferably single page applications). The goal is to produce a production ready HTML5 application with minified css and js files along with the relevant HTML markup changes.


Features
---------

- Parses HTML files to find *link* and *script* tags using htmlparser2 (https://github.com/fb55/htmlparser2)
- Compiles less files using less compiler (https://github.com/less/less.js)
- Shrinks css files using yuicompressor (https://github.com/yui/yuicompressor/)
- Shrinks javascript files using UglifyJS (https://github.com/mishoo/UglifyJS2)
- Modifies HTML tags pointing to less/css and/or javascript files to point to the minified ones instead
- Generates well formatted HTML code using js-beautify (https://github.com/einars/js-beautify)
- Produces a build directory containing the shrunk application
- Displays shrinkapp analysis


Tested On
----------

- AngularJS's seed application (https://github.com/angular/angular-seed)
- Bootstrap template from initializr.com
- Classic template from initializr.com
- Responsive template from initializr.com
- Bootstrap template from initializr.com
- HTML5 Boilerplate template from html5boilerplate.com. Version: 4.2.0
- Mobile Boilerplate template from html5boilerplate.com/mobile. Version: 4.1
- Twitter Bootstrap template from getbootstrap.com/2.3.2


Install
--------

First make sure you have installed the latest version of [node.js](http://nodejs.org/)
(You may need to restart your computer after this step).

### From NPM for use as a command line app:

*On Linux:*

```
    npm install shrinkapp@linux -g
```

*On Windows:*

```
    npm install shrinkapp@windows -g
```

### From NPM for programmatic use:

*On Linux:*

```
    npm install shrinkapp@linux
```

*On Windows:*

```
    npm install shrinkapp@windows
```

### From Git:

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

  -f, --force
        overwrite files.

  -a, --analysis
        Display analysis data after shrink.

  -v, --version
        Display package version.

  -h, --help
        Display help.

```
