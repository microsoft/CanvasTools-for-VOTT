const { Builder, By, Key, until } = require('selenium-webdriver')
// var chrome = require('selenium-webdriver/chrome')
const firefox = require('selenium-webdriver/firefox')
// var edge = require('selenium-webdriver/edge');
// require('chromedriver')
require('geckodriver')
const { querySelector } = require('./helpers')
const path = require("path");
const { CTHelper } = require('./ct-helpers');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 5

describe("Editor - No Toolbar tests", () => {
    let driver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('firefox').build();
        await driver.manage().window().setRect({ width: 1280, height: 800 });
    });

    afterAll(async () => driver.quit());

    it('editor test page is loaded', async () => {
        let url = 'file://' + path.join(__dirname, './shared/editor-no-toolbar.html')
        await driver.get(url)
    });

    it('editor`s SVG element is created', async () => {
        const svg = await querySelector(".CanvasToolsEditor svg", driver);
        expect(svg).not.toBeUndefined();
        expect(await svg.isDisplayed()).toBe(true);
        const size = await svg.getRect();
        expect(size.width).toBeGreaterThan(0);
        expect(size.height).toBeGreaterThan(0);
    });

    it("new region can be created and it is selected", async () => {
        const svg = await querySelector(".CanvasToolsEditor svg", driver);
        const size = await svg.getRect();
        const w4 = Math.floor(size.width / 4);
        const h4 = Math.floor(size.height / 4);

        await CTHelper.createRectRegion(driver, -w4, -h4, w4 * 2, h4 * 2);
        
        // Check region visual size
        const region = await querySelector(".regionStyle", driver);
        expect(await region.isDisplayed()).toBe(true);
        const regionSize = await region.getRect();
        // surroundings like ghost create extra space
        expect(regionSize.width).toBeGreaterThan(w4 * 2);
        expect(regionSize.height).toBeGreaterThan(h4 * 2);

        // Check that region is selected
        const regionClass = await region.getAttribute("class");
        expect(regionClass).toContain("selected");
    });
});
