let sectionBundleDriversAdded = false;
let configureInProgress = false;

function runNodeLogic(id) {
    const node = getNode(id);

    if (node && typeof node.logic === "function") {
        console.log("Running node logic:", id);
        node.logic.call(node);
    } else {
        console.warn("Node logic not found:", id);
    }
}
function initializeDriversOnDemand() {
    if (sectionBundleDriversAdded) {
        return Promise.resolve();
    }

    console.log("Initializing drivers...");

    try {
        addSectionBundleDrivers();
        addGlazingCodeLogic();
        addSchedulingCodeLogic();
        addHardwareDrivers();
        addTrackDrivers();
        addOperatorEvents();

        sectionBundleDriversAdded = true;

        // Force logic to run once after registration
        // [
        //     "FACE",
        //     "FACE_desc",
        //     "PANEL_SPACING",
        //     "DESIGN_CODE",
        //     "DESIGN_CODE_VISIBILITY",
        //     "GLASS_SHAPE",            
        //     "GLASS_TYPE_VISIBILITY",
        //     "GLASS_INSERT",
        //     "GLASS_INSERT_VISIBILITY",
        //     "WINDOW_STATE",
        //     "WINDOW_POSITION",
        //     "RENDER"
        // ].forEach(runNodeLogic);

        return Promise.resolve();
    } catch (e) {
        sectionBundleDriversAdded = false;
        console.error("Driver initialization failed:", e);
        return Promise.reject(e);
    }
}

function finalvalidation(options) {
    console.log(
        "finalvalidation start",
        $("#DOOR_WIDTH_FEET").val(),
        $("#DOOR_WIDTH_INCHES").val(),
        $("#DOOR_HEIGHT_FEET").val(),
        $("#DOOR_HEIGHT_INCHES").val()
    );

    options = options || {};

    const isConfigureClick = options.isConfigureClick === true;
    const renderNode = getNode("RENDER");

    renderSuspended = true;

    return forceInitialValidationLM()
        .then(function (res) {
            console.log("finalvalidation completed", {
                result: res
            });

            renderSuspended = false;

            if (
                isConfigureClick &&
                renderNode &&
                typeof renderNode.logic === "function"
            ) {
                return Promise.resolve(
                    renderNode.logic.call(renderNode)
                ).then(() => res);
            }

            return res;
        })
        .catch(function (e) {
            renderSuspended = false;

            console.error("finalvalidation failed:", e);

            throw e;
        });
}

// function loadTestResults(json) {
//     return initializeDriversOnDemand()
//         .then(function () {
//             $("#INPUT_JSON").val(json);

//             loadInputValues();

//             return finalvalidation({
//                 isConfigureClick: false
//             });
//         });
// }

function Configure(event) {
    if (event && typeof event.preventDefault === "function") {
        event.preventDefault();
        event.stopPropagation();
    }

    if (configureInProgress) {
        return false;
    }

    configureInProgress = true;
    showConfigureLoader();

    initializeDriversOnDemand()
        .then(function () {
            console.log("Drivers ready");

            return finalvalidation({
                isConfigureClick: true
            });
        })
        .then(function () {
            console.log("Validation complete");
            // nextPage();
        })
        .catch(function (e) {
            console.error("Configure error:", e);
        })
        .finally(function () {
            configureInProgress = false;
            hideConfigureLoader();
        });

    return false;
}