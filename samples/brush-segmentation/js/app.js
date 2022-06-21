// const { default: Konva } = require("konva");

function getImagesList () {
    // The list of images
    const images = [
        {
            path: "./../shared/media/background-cat-hd.jpg",
            title: "Cat (HD)"
        },
        {
            path: "./../shared/media/background-cat2.jpg",
            title: "Cat - Grumpy"
        },
        {
            path: "./../shared/media/background-cat3.jpg",
            title: "Cat - Inspiring"
        },                                   
        {
            path: "./../shared/media/background-city.jpg",
            title: "City"
        },
        {
            path: "./../shared/media/background-forest-hd.jpg",
            title: "Forest (HD)"
        },
        {
            path: "./../shared/media/background-glass.jpg",
            title: "Cafe"
        },
        {
            path: "./../shared/media/background-sea-hd.jpg",
            title: "Sea (HD)"
        },
        {
            path: "./../shared/media/background-snow.jpg",
            title: "Snow"
        }, 
    ];

    return images;
}

const images = getImagesList();

document.addEventListener("DOMContentLoaded", (e) => {
    // Get references for editor and toolbar containers
    const editorContainer = document.getElementById("editorDiv");
    const toolbarContainer = document.getElementById("toolbarDiv");

    // Init the editor with toolbar.
    const editor = new CanvasTools.Editor(editorContainer).api;
    editor.addToolbar(toolbarContainer, CanvasTools.Editor.FullToolbarSet, "./../shared/media/icons/");

    let incrementalRegionID = 100;

    // Add new region to the editor when new region is created
    editor.onSelectionEnd = (regionData) => {
        let id = (incrementalRegionID++).toString();

        // Generate random tag
        let tags = generateRandomTagsDescriptor();            
        editor.addRegion(id, regionData, tags);

        console.log(`Created ${id}: {${regionData.x}, ${regionData.y}} x {${regionData.width}, ${regionData.height}}`);
    };     
    
    // Log region manipulations
    editor.onRegionMoveBegin = (id, regionData) => {
        console.log(`Began moving ${id}: {${regionData.x}, ${regionData.y}} x {${regionData.width}, ${regionData.height}}`);
    };
    editor.onRegionMove = (id, regionData) => {
        // console.log(`Moving ${id}: {${regionData.x}, ${regionData.y}} x {${regionData.width}, ${regionData.height}}`);
    };
    editor.onRegionMoveEnd = (id, regionData) => {
        console.log(`Ended moving ${id}: {${regionData.x}, ${regionData.y}} x {${regionData.width}, ${regionData.height}}`);
    };
    editor.onRegionSelected = (id, multiselection) => {
        console.log(`Selected ${id}: multiselection = ${multiselection}`);
    }
    editor.onRegionDelete = (id, regionData) => {
        console.log(`Deleted ${id}: {${regionData.x}, ${regionData.y}} x {${regionData.width}, ${regionData.height}}`);
    };

    // Short references to Colors.* classes
    const Color = CanvasTools.Core.Colors.Color;
    const RGBColor = CanvasTools.Core.Colors.RGBColor;
    const LABColor = CanvasTools.Core.Colors.LABColor;
    const HSLColor = CanvasTools.Core.Colors.HSLColor;

    // Collection of primary tags. Use Color class to define color.
    const primaryTags = [
        new CanvasTools.Core.Tag("Awesome", new Color("#c48de7")),
        new CanvasTools.Core.Tag("Amazing", new Color("#3b1")),
        new CanvasTools.Core.Tag("Brilliante", new Color("#f94c48")),
    ];

    // Collection of secondary tags. Use hex-string to define color.
    const secondaryTags = [
        new CanvasTools.Core.Tag("Yes", "#fff"),
        new CanvasTools.Core.Tag("No", "#000"),
        new CanvasTools.Core.Tag("Unknown", "#999"),
    ];

    // Collection of ternary tags. Use varios color formats to define color.
    const ternaryTags = [
        new CanvasTools.Core.Tag("one", new Color(new RGBColor(0.55, 0.24, 0.25))),
        new CanvasTools.Core.Tag("two", new Color(new HSLColor(0.32, 0.27, 0.51))),
        new CanvasTools.Core.Tag("many", new Color(new LABColor(0.62, 0.50, -0.55))),
    ]

    // Randomly generate tags descriptor object
    function generateRandomTagsDescriptor() {
        const rnd = (n) => {
            let r = Math.floor(Math.random() * n);
            if (r === n) {
                r = n - 1;
            }
            return r;
        };

        const primaryTag = primaryTags[rnd(3)];
        const secondaryTag = secondaryTags[rnd(3)];
        const ternaryTag = ternaryTags[rnd(3)];

        const r = Math.random();
        let tags;
        
        if (r < 0.2) {
            // Create tags descriptor passing all three tags 
            tags = new CanvasTools.Core.TagsDescriptor(primaryTag, [secondaryTag, ternaryTag]);
        } else if (requestAnimationFrame < 0.4) {
            // Create tags descriptor without primary tag
            tags = new CanvasTools.Core.TagsDescriptor(null, [secondaryTag, ternaryTag]);
        } else if (r < 0.6) {
            // Create tags descriptor defining only primary tags
            tags = new CanvasTools.Core.TagsDescriptor(primaryTag);
        } else if (r < 0.8) {
            // Create tags descriptor passing array of tags
            tags = new CanvasTools.Core.TagsDescriptor([primaryTag, secondaryTag]);
        } else {
            // Create tags descriptor without specifying tags
            tags = new CanvasTools.Core.TagsDescriptor();
        }
        return tags;
    };

    let imageIndex = 0;
    // Init images selector
    initImageSelect(images, (index, path) => {
        imageIndex = index;
        loadImage(path, (image) => {
            editor.addContentSource(image);
        });

        // Delete current regions on image change
        editor.deleteAllRegions();
    });

    

    // Load first image
    loadImage(images[imageIndex].path, (image) => {
        editor.addContentSource(image);
        //var konvaImage = new Konva.Image({image: image, width: 1000, height: 500})
        //imagelayer.add(konvaImage);
    });
});

// Builds select element using provided list of images 
function initImageSelect(images, onSelect) {
    var imageSelect = document.getElementById("imageSelect");

    images.forEach((image) => {
        let o = document.createElement("option");
        o.text = image.title;
        imageSelect.add(o);
    })
    imageSelect.selectedIndex = 0;

    // Register listener for image change
    imageSelect.addEventListener("change", (e) => {
        let index = imageSelect.selectedIndex;
        if (index >= 0 && index < images.length) {
            onSelect(index, images[index].path);
        }
    });
}

const stage = new Konva.Stage({
    container: "editorDiv",
    width: 1000,
    height: 500
});

const imagelayer = new Konva.Layer();
const canvaslayer = new Konva.Layer();
stage.add(imagelayer);
stage.add(canvaslayer);

// then we are going to draw into special canvas element
const canvas = document.createElement('canvas');
canvas.width = stage.width();
canvas.height = stage.height();

// created canvas we can add to layer as "Konva.Image" element
const image = new Konva.Image({
  image: canvas,
  x: 0,
  y: 0,
  width: stage.width(),
  height: stage.height()
});
canvaslayer.add(image);

// Good. Now we need to get access to context element
const context = canvas.getContext('2d');
context.strokeStyle = '#df4b26';
context.lineJoin = 'round';
context.lineWidth = 5;

let isPaint = false;
let lastPointerPosition;
let mode = 'brush';

// now we need to bind some events
// we need to start drawing on mousedown
// and stop drawing on mouseup
stage.on('mousedown touchstart', function () {
    isPaint = true;
    lastPointerPosition = stage.getPointerPosition();
});

// will it be better to listen move/end events on the window?

stage.on('mouseup touchend', function () {
    isPaint = false;
});

// and core function - drawing
stage.on('mousemove touchmove', function () {
    if (!isPaint) {
        return;
    }

    if (mode === 'brush') {
        context.globalCompositeOperation = 'source-over';
    }
    if (mode === 'eraser') {
        context.globalCompositeOperation = 'destination-out';
    }
    context.beginPath();

    var localPos = {
        x: lastPointerPosition.x - image.x(),
        y: lastPointerPosition.y - image.y(),
    };
    context.moveTo(localPos.x, localPos.y);
    var pos = stage.getPointerPosition();
    localPos = {
        x: pos.x - image.x(),
        y: pos.y - image.y(),
    };
    context.lineTo(localPos.x, localPos.y);
    context.closePath();
    context.stroke();

    lastPointerPosition = pos;
    // redraw manually
    canvaslayer.batchDraw();
});

// Load an image from specified path and notify when it is loaded.
function loadImage(path, onready) {
    // const container = document.getElementsByClassName("CanvasToolsEditor");
    const image = new Image();
    image.addEventListener("load", (e) => {
        onready(e.target);                
    });
    image.src = path;
}