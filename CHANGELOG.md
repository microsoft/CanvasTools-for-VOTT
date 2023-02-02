## Changelog

### 2.4.2
* Restore function for sorting of regions by area, update scope to public so it may be invoked on demand.

### 2.4.1
* Small bug fix with getAllMasks not cleaning erased maks/tags
* Remove sorting of regions by area. So that user can navigate regions in the order of they were created

### 2.4.0
* Addition of semantic segmentation or brush/eraser control to annotate an image at pixel level.

*CT Library Changes*
* CanvasTools.Editor api is updated to include `enableMask`.
```js
    var editor = new CanvasTools.Editor(
        container: HTMLDivElement,
        areaSelector?: AreaSelector,
        regionsManager?: RegionsManager,
        filterPipeline?: FilterPipeline,
        enableMask?: boolean).api
```
* When `enableMask = true`, the `masksManager` is initialized that helps in annotating an image at pixel level.
* 2 callbacks - `onMaskDrawingBegin` & `onMaskDrawingEnd` are exposed on CanvasTools.Editor api. These needs to be defined.
```js
    // Callback for `MasksManager` called when the drawing mask begins. Returns a tagDescriptor
    onMaskDrawingBegin: () => TagsDescriptor;

    // Callback for `MasksManager` called when the mask is drawn.
    onMaskDrawingEnd: () => void;
```
* `addContentSource` takes in a new callback `onContentLoadCb`. Callback is executed after the image onLoad is fired.
```js
addContentSource(source: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement, onContentLoadCb?: () => void): Promise<void>;
```
*CT Tags Changes*
* `Tag` now accpets a new parameter `sequenceNumber` while initialization. This parameter is required for the purpose of semantic segmentation. The `sequenceNumber` can be number starting at 1 which indicates the order number of a tag w.r.t to its color. Each color/tag would havbe an unique `sequenceNumber`.
```js
new Tag(name: string, color: number|string|Color, id: string, sequenceNumber: number)
```

*CT Selector Changes*
* 2 more `SelectionMode` named `Brush` & `Eraser` are added.

*CT MaskManager Changes*
* `setSelection` function is used the set the selection mode to brush or eraser and also disable mask mode.
```js
setSelection(enabled: boolean, mode?: MaskSelectorMode): void;
```
* `setBrushSize` function sets the brush and eraser size
```js
setBrushSize(size: IBrushSize): void;
```
* `eraseAllMasks` function removes all masks and resets mask layer
```js
eraseAllMasks(): void;
```
* `getAllMasks` function gets the mask layer for the entire image. If image is of `w` width and `h` height, it has wh pixels. Mask(imageData) is a `number[]` of size `wh` where each entry or pixel is denoted by the `sequenceNumber` of the corresponding tag color on it.
`tags` represents all the tags present in the mask

```js
getAllMasks(): => IMask;
export interface IMask {
    imageData: number[];
    tags: TagsDescriptor[];
}
```
* `loadAllMasks` function loads the mask layer on the image
```js
loadAllMasks(allMasks: IMask): void;
```
* `polygonsToMask` function converts any polygon drawn to a mask
```js
polygonsToMask(): void;
```
*Samples*

The samples folder has new example to showcase semantic segmentation.
Eg. samples/editor-with-mask/index.html


### 2.3.3
* Users of `RegionManager.updateRegionVisibility()` can now supply callbacks that can accept a region object in addition to tagsDescriptor for the `shouldHideThisRegion` parameter.
* NOTE: The `tagsDescriptor` parameter will be removed in upcoming release and users are recommended to use `region.tag` in the callback body instead.

### 2.3.2
* Expose getters to frameWidth and frameHeight on `Editor`

### 2.3.1
* Added a new ZoomType `CursorCenter` which allows users to set the zoom around cursor position.

### 2.3.0
* Add an `enablePathRegions` editor configuration to enable/disable path region types (Bezier curve support).
```js
const editor = new CanvasTools.Editor(...);
editor.enablePathRegions(true);
```
* Add a new "PathRegion" type which will be created in place of polygon region types when `enablePathRegions` is enabled.
* Replace bounding box calculation in region metadata with Snap.SVG path getBBox utility to accommodate BBox of complex paths.
* Add Bezier control information to region metadata.
* Add midpoint line markers, when clicked will assign bezier control data to that line.
* Add Bezier control anchors to lines with bezier control data to allow manipulation of line shape.
* Deprecate "setPoints" region data method in favor of "splicePoints". Use of setPoints is not compatible with "PathRegion" region types.

### 2.2.26
* Add `.toggleTagsTextVisibility()` to `RegionManager` for toggling visibility of tags text on region.

### 2.2.23
*CT Library Changes*
* CanvasTools.Editor api is updated to include `zoomProperties`
```js
    var editor = new CanvasTools.Editor(container: HTMLDivElement, areaSelector?: AreaSelector, regionsManager?: RegionsManager,
                filterPipeline?: FilterPipeline) {
                filterPipeline?: FilterPipeline, zoomProperties?: ZoomProperties).api
```
* ZoomType and isZoomEnabled can now be set on ZoomProperties.
* ZoomType allows users to set the zoom around a point like image center or view port center.

### 2.2.22
* Add `.reset()` null check for before if called before the editor is loaded or if no selector is present

### 2.2.21
* Add public `.reset()` to `AreaSelector`

### 2.2.20
* Improve render time significantly, by caching values expensive svg calculation call
* Remove unnecessary re-render calls on add new region and complete region

### 2.2.19
* Small bug fixed with ghost anchor

### 2.2.18
* Fix bugs with ghost anchor (add and remove points) for polygon
* Add new toolbar control for easier accessing ghost anchors

### 2.2.17
* Add `.updateRegionVisibility()` to `RegionManager` for easier region visibility toggling
* Fix a bug with add region accessibility announcing

### 2.2.16
* Fix a bug with `PolygonSelector` where calling `.show` after deleting a box could cause an unwanted selection to start
* Add `.undo()` and `.redo()` methods on `AreaSelector` (currently only works when the selector is a `PolygonSelector`)
* Add `.onNextSelectionPoint()` callback for when a new point is drawn by the `PolygonSelector`

### 2.2.13
* The functionality of tabbing has been heavily changed

key | previous functionality | current functionality
--- | --- | ---
_Tab_ | Moves selection forward through region list, looping back to the start when it reaches the last selection. Does not prevent HTML focus movement. | Moves selection forward through region list, unfocusing the editor if Tab is pressed while the last region is selected. Prevents HTML focus movement while the editor has focus
_Shift + Tab_ | No Shift + Tab functionality | Moves selection backward through region list, unfocusing the editor if Shift + Tab is pressed while the first region is selected. Prevents HTML focus movement while the editor has focus.

### 2.2.12
* Removes a bug introduced in 2.2.10 in which the tag announced is displayed in an element under the editor.

### 2.2.11
* The "Template-based box" selector can now be used with keyboard controls. Similar to the Rect selector keyboard controls, these controls are enabled by pressing `K` when the Template-based box selector is active.
* Functions related to enabling and disabling keyboard controls are now made public to allow external scripts to incorporate those functions into their own logic.
* The UI elements corresponding to the Template-based box selector have also been updated to use an `AlternatingCrossElement` for higher visibility.
* The announcer that reads the TagsDescriptor after a region is added now reads from the TagsDescriptors `toString()` method instead of only its primary tag.

### 2.2.10
* The `Toolbar` can now be navigated with standard HTML5 controls.
    * All `ToolbarIcon`s can now be tabbed through.
    * A focused `ToolbarIcon` can be activated with the Enter or space key.
* Upon `Region` creation, screen reader technologies will now announce the primary tag of that region.

### 2.2.9
* The colors used for the styles of `RegionMenu.ts` and `Toolbar.ts` previously contained hues of gray with different shades and opacities. They have been changed to three colors, `#fff`, `#000`, and `#157ff0`, which all possess luminosity ratios above 3:1 against the other two. This is to ensure visibility for people with vision disabilities. These changes are noted in the table below:

class | property | previous color | current color
--- | --- | --- | ---
_.menuRectStyle_ | fill | rgba(64, 64, 64, 0.8) | #000
_.menuItemBack_ | fill | rgb(32, 32, 32) | #000
_.menuIcon_ | fill | rgb(64, 64, 64) | #fff
_.menuItem_ | stroke | rgba(198, 198, 198, 0.2) | #fff
_.menuItem:hover_ | stroke | rgba(198, 198, 198, 0.8) | #157ff0
_.toolbarBGStyle_ | fill | #666 | #000
_.iconStyle.selector:hover .iconBGRectStyle_ | fill | rgba(68, 68, 68, 0.5) | #157ff0
_.iconStyle.selector.selected .iconBGRectStyle_ | fill | #333 | #157ff0
_.iconStyle.switch:hover .iconBGRectStyle_ | fill | rgba(68, 68, 68, 0.5) | #157ff0
_.iconStyle.switch .iconImageStyle_ | stroke | #333 | #fff
_.iconStyle.separator line | stroke | #333 | #fff

* The `CrossElement` nodes of `RectSelector.ts` have been replaced with `AlternateCrossElement` nodes, which are derived from `CrossElement`. While `CrossElement` is composed of lines with a dotted grey pattern, `AlternateCrossElement` is composed of lines with an alternating black-and-white pattern. This ensures that the cross is visible on background images of all colors.
* Keyboard controls have been changed in the following ways:
    * In order to start using keyboard controls for the `RectSelector`, the user will now press the `K` key instead of the space bar. This is to avoid collision with existing HTML5 functionalities that use the space bar.
    * While users previously used the `UHJK` keys to move the selection cross, the functionality has moved to holding the shift key in conjunction with the arrow keys. This reduces the number of keys with enhanced functionality.

### 2.2.7
Keyboard controls are now available when using the RectSelector.

### 2.2.6
Bug fixes related to zoom feature

### 2.2.5
*CT Library Changes*
* `resetZoomOnContentLoad` is introduced on `ZoomManager` so that the zoom behavior can be reset before new content load.

*Unit Tests*
* Jest and ts-jest is setup now in this repo.
* Added Unit tests for `ZoomManager` file.

### 2.2.4
*CT Library Changes*
* Zoom feature is introduced to zoom in/out the image for region selection & manipulation.
    * The feature is specifically introduced only for Rect related region selection and can be optionally initialized.
    * Max zoom is set to 400% and min zoom at 100%. The scale to increase or decrease zoom is 50%.
    * CanvasTools.Editor api is updated to include `isZoomEnabled`
    ```js
        var editor = new CanvasTools.Editor(container: HTMLDivElement, areaSelector?: AreaSelector, regionsManager?: RegionsManager,
                    filterPipeline?: FilterPipeline) {
                    filterPipeline?: FilterPipeline, isZoomEnabled?: boolean).api
    ```
    * `onZoomEnd` is introduced on `Editor.api` as a callback which is called after zoom is updated.
        ```js
            editor.onZoomEnd = (zoom: ZoomData) => { 
                // callback function implementation
            }
        ```
    * `setMaxZoomScale` and `setZoomScale` are added to ZoomManager. Also available in `Editor` through `ZM`.

*CT Toolbar*
* Zoom in and Zoom out buttons are added to Rect only toolbar set.

*Samples*
* The samples folder has new example to showcase zoom feature. 
* Eg. [`samples/editor-with-zoom/index.html` folder](https://github.com/microsoft/CanvasTools-for-VOTT/blob/master/samples/editor-with-zoom/index.html)

### 2.2.2
*CT Library Changes*
* Update `registerRegion()` in `RegionsManager` to unselect the region after it is registered.
* Unselect all regions after updating tags in `updateTagsForSelectedRegions` in `RegionsManager`.

### 2.2.1 
Update repo links and add new interface method `getAllRegions` in `RegionsManager`. Also available in `Editor` through `RM` or `api`.

### 2.2.0-beta.0

*New versioning approach*
2.2.0 and further updates will consider releasing new features/fixes under beta-version packages till stabilization.

*CT Library Changes*
* Fixed major compatibility issues with Edge and Firefox.
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
* Exposed the `toggleBackground` method for `RegionsManager` as public.
* Removed `KeyB`-event listener from the `RegionsManager`. Use toolbar instead.
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