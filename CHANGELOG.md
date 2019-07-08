## Changelog

### 2.2.1 
Update repo links and add new interface method `getAllRegions` in `RegionsManager`. Also available in `Editor` through `RM` or `api`.

### 2.2.0-beta.0

*New versioning aproach*
2.2.0 and futher updates will consider releasing new features/fixes under beta-version packages till stabilization.

*CT Library Changes*
* Fixed major compatiblity issues with Edge and Firefox.
* Fixed minor interaction bugs and visual glitches.
* Changed model for emitting (internal) `onManipulation*` events. Reduced number of generated events and internal emitters.
* Removed mask from rect-selection.

### 2.1.28

*CT Library Changes*
* Polyline default background fix

### 2.1.27

Fix to missing /Core folder in the package.

### 2.1.26 - Background toggling from the [v2-toolbar-background-toggle](https://github.com/microsoft/CanvasTools-for-VOTT/tree/v2-toolbar-background-toggle) branch

*CT Library Changes*
* Exposed the `toggleBackgroun` method for `RegionsManager` as public.
* Removed `KeyB`-event listener from the `RegionsManager`. Use toolbar insted.
* Updated styles for the light theme without background.

*CT Toolbar*
* Added background toggling button to the toolbar icon sets.

### 2.1.25 - Trigger button type for Toolbar from the [v2-toolbar-clear-regions](https://github.com/microsoft/CanvasTools-for-VOTT/tree/v2-toolbar-clear-regions) branch

*CT Library Changes*
* Added new `ToolbarTriggerIcon` type for Toolbar, allowing adding buttons that trigger some action but does not change state.
* Added new "Delete all regions" button to default toolbar presets.


### 2.1.24 - API Update from the [v2-rect-select-manipulate-update](https://github.com/microsoft/CanvasTools-for-VOTT/tree/v2-rect-select-manipulate-update) branch

*CT Library Changes*
* Added a new `getSelectedRegions` method to replace deprecated `getSelectedRegionsBounds` in `RegionsManager`. Also available in `Editor` through `RM` or `api`.
* Selection mode (`AreaSelector`):
    * Extracted new `ISelectorSettings` interface to use in `setSelectionMode` (wraps previous selectionMode and options).
    * Added new signature for the `setSelectionMode` method to use `ISelectorSettings` object instead of `selectionMode`.
    ```js
    // new way:
    editor.AS.setSelectionMode({ mode: SelectionMode.NONE });

    // old way (still available but not recommended):
    editor.AS.setSelectionMode(mode: SelectionMode.NONE);

    // new way with template
    editor.AS.setSelectionMode({
        mode: SelectionMode.COPYRECT,
        template: new Rect(r.regionData.width, r.regionData.height),
    });

    // note: the old way with setting a template for 'COPYRECT' mode as a second arg is not available any more
    ```
    * Moved `SelectionMode` definition to the `ISelectorSettings` file.
    * Added new `getSelectorSettings` method for the `AreaSelector` to get current settings.

### 2.1.23 - Rect resizing update from the [v2-rect-select-manipulate-update](https://github.com/microsoft/CanvasTools-for-VOTT/tree/v2-rect-select-manipulate-update) branch

*CT Library Changes*
* Fix for the [issue #42](https://github.com/microsoft/CanvasTools-for-VOTT/issues/42) with rects overflowing canvas edge when created using the copy-rect tool.
* Added rect resizing by dragging edges ([issue #30](https://github.com/microsoft/CanvasTools-for-VOTT/issues/30)).

### 2.1.22

*CT Library Changes*
* Updated `Editor` properties to use named function types instead of hardcoded ones. 
* `regionData` param is now optional for all callbacks on the `Editor` -- following the `RegionUpdateFunction` type definition.

### 2.1.21 - New color infrastructure from the [v3-color-lab](https://github.com/microsoft/CanvasTools-for-VOTT/tree/v3-color-lab) branch

*New color infrastructure*
* Implementation of core color spaces: sRGB, RGB, HSL, XYZ and CIE LAB, including conversion between formats. Added new classes under `CanvasTools.Core.Colors.*`: `SRGBColor`, `RGBColor`, `HSLColor`, `XYZColor` and `LABColor`. The `Color` class is a wrapper around various formats.
* Implementation for the color difference algorithms in the CIE LAB color space.
* New `Palette` class to generate color swatches or expand color swatches in a specified lightness plane of the LAB color space.
* New samples to use the color infrastructure: `palette-swatches`, `palette-swatch-iterator` and `palette-editor`.
* Updated readme and basic `editor-*` samples to use the new infrastructure.

*CT Library Changes*
* Added the `color` property to `ITag` and `Tag`. Using `colorHue` is now deprecated. Consider using the `Color` class or hex-string when creating new tags.
* Updated styling of regions to use the new `Color` infrastructure.
* Partially refactored the `canvastools.css` file to use variables to define cursors and colors.
* Added `regionData` to the `onRegionDeleted` callback.
* Fixed a bug with the menu positioning when a region is deleted.
* Changed the shift-key to the ctrl-key for multiselection.

### 2.1.20

Fix to expose the `multiselection` flag in the `onRegionSelected` callback.

### 2.1.19

Changed compiler options for `lib` to preserve comments.

### 2.1.18

*Docs*
* Added jsdocs for all classes and interfaces.

*CT Library Changes*
* `Editor` class now exposes the internal `filterPipeline` object as `FP` instead of `FilterPipeline` to follow other shortcuts namings (like `RM` and `AS`). 
* For `PointRegion`, `PolygonRegion`, `PolylineRegion` and `RectRegion`classes aligned the constructor signature with the `Region` class.
* Small refactorings for internal methods and classes naming.

*Samples*
* Moved the `/test` folder to a new `samples` folder to better reflect that those are usage samples, not tests.
* Splitted original sample into 1) `/editor` and 2) `/filters`. Extracted common media and js files into `/shared` folder.
* Extracted new sample without toolbar under the `/editor-no-toolbar` folder.
* Updated `package.json` and `webpack.config.js` to reflect changes.


### 2.1.17

Added `onRegionMoveBegin` and `onRegionMoveEnd` callbacks to the `Editor` and the `RegionsManager` classes. Usage:

```js
        editor.onRegionMoveBegin = (id, regionData) => {
            console.log(`Move Begin ${id}: {${regionData.x}, ${regionData.y}} x {${regionData.width}, ${regionData.height}}`);
        };

        editor.onRegionMove = (id, regionData) => {
            console.log(`Moving ${id}: {${regionData.x}, ${regionData.y}} x {${regionData.width}, ${regionData.height}}`);
        };

        editor.onRegionMoveEnd = (id, regionData) => {
            console.log(`Move End ${id}: {${regionData.x}, ${regionData.y}} x {${regionData.width}, ${regionData.height}}`);
        };
```

### 2.1.15-16

Updated `README` and sample under the `/test` folder.

### 2.1.14

1. Added a new `api` proxy to the `Editor` class. It wraps accessing to all the public methods of `Editor`, `RegionsManager`, `AreaSelector` and `FilterPipeline`. So instead of writing `editor.RM.addRegion(...)`, you can use the following approach:
    ```js
    var editor = new ct.Editor(editorDiv).api;
    editor.addRegion(...)
    editor.setSelectionMode(...)
    ```

2. Removed from the `Editor` class itself the `setSelectionMode` method. Use instead the approach above or `editor.AS.setSelectionMode(...)`.

3. Added new overloads for the `Editor` class `constructor`. You can now also provide custom components (`AreaSelector`, `RegionsManager` or `FilterPipeline`). E.g., to create `Editor` with custom `RegionsManager`:
    ```js
    let editor = new ct.Editor(sz, null, regionsManager);
    ```
    Note: editor will override the `callbacks` properties for `AreaSelector` and `RegionsManager` to ensure they crossreference and can work together.  