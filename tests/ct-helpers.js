const { querySelector } = require('./helpers')

async function createRectRegion(driver, x, y, w, h) {
    const selector = await querySelector(".areaSelector", driver);
    const actions = driver.actions();

    await actions.move({origin: selector, x, y})
    .pause(200)
    .press()
    .move({origin: selector, x: x + w, y: y + h})
    .release()
    .perform();
}


module.exports = {
    CTHelper: {
        createRectRegion,
    }
};