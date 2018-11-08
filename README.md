# CanvasTools.js librarary for VoTT

CanvasTools.js is one of the UI modules used in the [VoTT project](https://github.com/Microsoft/VoTT/). The library is implementing the following features core for visual tagging:

* Region (box) selection (CanvasTools.Selection.AreaSelector)
* Regions manipulation (CanvasTools.Region.RegionsManager)
* Filters pipeline for underlaying canvas element (CanvasTools.Filter.FilterPipeline)

## Dependencies

* CanvasTools heavily uses the [Snap.Svg library](https://github.com/adobe-webplatform/Snap.svg). In webpack-eged version it bundled with CanvasTools.js into one ct.js file.
* Current version of the library depends on some Chrome-specific features like masks-support in SVG.

## Use

### Add script to the app

Add ct.js file to your web-app (e.g., an Electron-based app).

```html
<script src="ct.js"></script>
<!-- OR -->
<script src="ct.min.js"></script>

```

```js
let ct = CanvasTools.CanvasTools;
```

### Add SVG host

Add SVG element to the html-page. Filter inside SVG-element is used for shadow effect on elements.

```html
<svg id="svgHost">
    <defs>
        <filter id="black-glow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                <feOffset dx="0" dy="0" result="offsetblur" />
                <feComponentTransfer>
                <feFuncA type="linear" slope="0.8" />
            </feComponentTransfer>
            <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>
</svg>
```

```js
let svgHost = document.getElementById("svgHost");
```

### Selection & manipulation

Create `RegionsManager` and `AreaSelector` in specified order and cross-link them:

```js
let rm = new ct.Region.RegionsManager(svgHost, () => { }, () => { });

let selector = new ct.Selection.AreaSelector(sz,
    function onselectionBegin() {
        // no arguments, just notification
    },
    function onselectionEnd(x1, y1, x2, y2) {
        // console.log("Selection: " + x1 + ": " + y1 + "; " + x2 + ": " + y2);
        // build new tag (titles + color hue value)
        var primaryTag = new ct.Base.Tags.Tag(
            (Math.random() > 0.5) ? "Awesome" : "Brilliante!",
             Math.floor(Math.random() * 360.0));
        var secondaryTag = new ct.Base.Tags.Tag(
            (Math.random() > 0.5) ? "Yes" : "No",
             Math.floor(Math.random() * 360.0));
        var ternaryTag = new ct.Base.Tags.Tag(
            (Math.random() > 0.5) ? "one" : "two",
             Math.floor(Math.random() * 360.0));
        var tags = new ct.Base.Tags.TagsDescriptor(primaryTag, [secondaryTag, ternaryTag]);
        // create region using regionsmanager
        rm.addRegion((regionId++).toString(), { x: x1, y: y1 }, { x: x2, y: y2 }, tags);
    });

    rm.onManipulationEnd = function () {
        selector.enable();
    };
    rm.onManipulationBegin = function () {
        selector.disable();
    };
```

### Applying filters

Assuming that `canvasSource` is a source `HTMLCanvasElement` and `canvasHost` as a destination `HTMLCanvasElement`:

```js
let filter = new ct.Filter.FilterPipeline();
filter.addFilter(ftools.InvertFilter);
filter.addFilter(ct.Filter.GrayscaleFilter);

filter.applyToCanvas(canvasSource).then((bcnvs) => {
    canvasHost.width = bcnvs.width;
    canvasHost.height = bcnvs.height;
    let hostContext = canvasHost.getContext("2d");
    hostContext.drawImage(bcnvs, 0, 0, bcnvs.width, bcnvs.height);
})
```