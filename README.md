# CanvasTools.js librarary for VoTT

CanvasTools.js is one of the UI modules used in the [VoTT project](https://github.com/Microsoft/VoTT/). The library is implementing the following features core for visual tagging:

* Region (box) selection & manipulation
* Filters pipeline for underlaying canvas element
* Toolbar for all available tools

## Dependencies

* CanvasTools heavily uses the [Snap.Svg](https://github.com/adobe-webplatform/Snap.svg) library. In the webpack-eged version it is bundled with `CanvasTools.js` into one `ct.js` file.
* Current version of the library depends on some features (e.g., masks-support in SVG) that are not fully cross-browser, but targeting Electron (Chromium).

## Use

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

Add some containers to host SVG elements for the toolbar and the editor.

```html
<div id="ctZone">
    <div id="toolbarzone"></div>
        <div id="selectionzone">
            <div id="editorzone"></div>
        </div>
    </div>
```

Add Editor from CanvasTools.

```js
var sz = document.getElementById("editorzone");
var tz = document.getElementById("toolbarzone");

var editor = new ct.Editor(sz);
editor.addToolbar(tz, ct.Editor.FullToolbarSet, "./images/icons/");
```

The editor will auto-adjust to available space in provided container block.
`FullToolbarSet` is one of the available icons sets. Another one is `RectToolbarSet` containing only box-creation tools.
Correct the path to toolbar icons based on the structure of your project.

### Add callbacks to the Editor

Add a callback for onSelectionEnd to define what should happen when a new region is selected.

```js
// Random tags generation
let primaryTag = new ct.Base.Tags.Tag(
                    (Math.random() > 0.5) ? "Awesome" : "Brilliante",
                     Math.floor(Math.random() * 360.0));
let secondaryTag = new ct.Base.Tags.Tag(
                   (Math.random() > 0.5) ? "Yes" : "No",
                    Math.floor(Math.random() * 360.0));
let ternaryTag = new ct.Base.Tags.Tag(
                 (Math.random() > 0.5) ? "one" : "two",
                  Math.floor(Math.random() * 360.0));

// Callback for onSelectionEnd
editor.onSelectionEnd = (commit) => {
    let r = commit.boundRect;
  
    // Build a random tags collection
    let tags = 
        (Math.random() < 0.3) ?        
         new ct.Base.Tags.TagsDescriptor(primaryTag, [secondaryTag, ternaryTag]):
        ((Math.random() > 0.5) ? 
         new ct.Base.Tags.TagsDescriptor(secondaryTag, [ternaryTag, primaryTag]):
         new ct.Base.Tags.TagsDescriptor(ternaryTag, [primaryTag, secondaryTag]));

    // Add new region to the Editor based on selection type
    if (commit.meta !== undefined && commit.meta.point !== undefined) {
        let point = commit.meta.point;
        editor.RM.addPointRegion((incrementalRegionID++).toString(), new ct.Base.Point.Point2D(point.x, point.y), tags);
    } else {
        editor.RM.addRectRegion((incrementalRegionID++).toString(), new ct.Base.Point.Point2D(r.x1, r.y1), new ct.Base.Point.Point2D(r.x2, r.y2), tags);
    }
}
```

### Update background

Once a background image for tagging task is loaded (or a video element is ready), create a `HTMLCanvasElement`, fill it with the image to be used and pass to the editor as new content source.

```js
let imagePath = "./../images/background-forest-v.jpg";
let image = new Image();
image.addEventListener("load", (e) => {
    // Create buffer
    let buffCnvs = document.createElement("canvas");
    let context = buffCnvs.getContext("2d");
    buffCnvs.width = e.target.width;
    buffCnvs.height = e.target.height;

    // Fill buffer
    context.drawImage(e.target, 0, 0, buffCnvs.width, buffCnvs.height);

    editor.addContentSource(buffCnvs);
});
image.src = imagePath;
```