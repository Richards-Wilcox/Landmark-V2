let sectionBundleDriversAdded = false;
let configureInProgress = false;

function initializeDriversOnDemand() {

    if (sectionBundleDriversAdded) {
        return Promise.resolve();
    }

    console.log("Initializing drivers...");

    addSectionBundleDrivers();
    addGlazingCodeLogic();
    addSchedulingCodeLogic();
    addHardwareDrivers();
    addTrackDrivers();
    addOperatorEvents();

    sectionBundleDriversAdded = true;

    return Promise.resolve();
}

function finalvalidation(options) {


    console.log("finalvalidation start",
        $("#DOOR_WIDTH_FEET").val(),
        $("#DOOR_WIDTH_INCHES").val(),
        $("#DOOR_HEIGHT_FEET").val(),
        $("#DOOR_HEIGHT_INCHES").val()
    );

    options = options || {};

    const isConfigureClick = options.isConfigureClick === true;
    const renderNode = getNode("RENDER");

    renderSuspended = true;

    // return Promise.race([    
    //     forceInitialValidationLM(),
    //     new Promise((_, reject) =>
    //         setTimeout(
    //             () => reject(new Error("Validation timeout")),
    //             30000
    //         )
    //     )
    // ])
    return forceInitialValidationLM()
        .then(function (res) {

            console.log(
                "finalvalidation resolved",
                res
            );

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

            console.error(
                "finalvalidation failed:",
                e
            );

            throw e;
        });
}

function loadTestResults(json) {
    $("#INPUT_JSON").val(json);
    loadInputValues();

    // ✅ No configure loader/render behavior during load/test restore
    return finalvalidation({
        isConfigureClick: false
    });
}

function Configure() {

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

            nextPage();

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