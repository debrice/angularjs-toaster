# angularjs-toaster

A toaster service for angular JS web application.

Toaster expects you to be using ui-router library and to have a
dedicated toaster view for it to render itself.

## Usage

Import toaster as a module dependency

```coffee
angular.module('my_app', ['toaster'])
```

in your index.html make sure you have a ui-view. Something like:

```jade
doctype html

html(
    lang = "en"
        ng-app = "app"
    )

    head
        each script in scripts
            script(src="/#{script}")
    body
        div(ui-view="content")
        div(ui-view="toaster")
```
