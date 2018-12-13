# CanvasTools librarary for VoTT

CanvasTools is one of the UI modules used in the [VoTT project](https://github.com/Microsoft/VoTT/). The library impelements the following core features:

* Region (box) selection & manipulation
* Filters pipeline for underlaying canvas element
* Toolbar for all available tools

## Dependencies

* CanvasTools heavily uses the [Snap.Svg](https://github.com/adobe-webplatform/Snap.svg) library. In the webpack-eged version it is bundled with CanvasTools into one `ct.js` file, including also styles.
* Current version of the library depends on some features (e.g., masks-support in SVG) that are not fully cross-browser, but targeting Electron (Chromium).

## How to use

### Install npm package

```npm
npm i vott-ct
```

### Add library to the app

Add the `ct.js` file to your web-app (e.g., an Electron-based app).

```html
<script src="ct.js"></script>
<!-- OR -->
<script src="ct.min.js"></script>

```

Copy toolbar icons from the [`src` folder](https://github.com/kichinsky/CanvasTools-for-VOTT/tree/master/src/canvastools/icons) to your project.

Create a reference to the CanvasTools.

```js
let ct = CanvasTools.CanvasTools;
```

### Add Editor to the page

Add container elements to host SVG elements for the toolbar and the editor.

```html
<div id="ctZone">
    <div id="toolbarzone"></div>
        <div id="selectionzone">
            <div id="editorzone"></div>
        </div>
    </div>
```

Initiate Editor-object from the CanvasTools.

```js
var sz = document.getElementById("editorzone");
var tz = document.getElementById("toolbarzone");

var editor = new ct.Editor(sz);
editor.addToolbar(tz, ct.Editor.FullToolbarSet, "./images/icons/");
```

The editor will auto-adjust to available space in provided container block.
`FullToolbarSet` icons set is used by default and exposes all available tools. The `RectToolbarSet` set contains only box-creation tools.
Correct the path to toolbar icons based on the structure of your project.

### Add callbacks to the Editor

Add a callback for `onSelectionEnd` event to define what should happen when a new region is selected. Usually at the end of processing new region you want to add it actuall to the screen. Use `.RM.addPointRegion` to register point-based regions, and `.RM.addRectRegion` to register box-based regions.

```js
// Random tags generation
let primaryTag = new ct.Core.Tag(
                    (Math.random() > 0.5) ? "Awesome" : "Brilliante",
                     Math.floor(Math.random() * 360.0));
let secondaryTag = new ct.Core.Tag(
                   (Math.random() > 0.5) ? "Yes" : "No",
                    Math.floor(Math.random() * 360.0));
let ternaryTag = new ct.Core.Tag(
                 (Math.random() > 0.5) ? "one" : "two",
                  Math.floor(Math.random() * 360.0));

// Callback for onSelectionEnd
editor.onSelectionEnd = (commit) => {
    let r = commit.boundRect;
  
    // Build a random tags collection
    let tags =
        (Math.random() < 0.3) ?
         new ct.Core.TagsDescriptor(primaryTag, [secondaryTag, ternaryTag]):
        ((Math.random() > 0.5) ?
         new ct.Core.TagsDescriptor(secondaryTag, [ternaryTag, primaryTag]):
         new ct.Core.TagsDescriptor(ternaryTag, [primaryTag, secondaryTag]));

    // Add new region to the Editor based on selection type
    if (commit.meta !== undefined && commit.meta.point !== undefined) {
        let point = commit.meta.point;
        editor.RM.addPointRegion((incrementalRegionID++).toString(), new ct.Core.Point2D(point.x, point.y), tags);
    } else {
        editor.RM.addRectRegion((incrementalRegionID++).toString(), new ct.Core.Point2D(r.x1, r.y1), new ct.Core.Point2D(r.x2, r.y2), tags);
    }
}
```

### Update background

Once the background image for tagging task is loaded (or a video element is ready, or a canvas element), pass it to the editor as a new content source.

```js
let imagePath = "./../images/background-forest-v.jpg";
let image = new Image();
image.addEventListener("load", (e) => {
    editor.addContentSource(e.target);
});
image.src = imagePath;
```