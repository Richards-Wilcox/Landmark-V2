var sectionBundleDriversAdded = false;
var configureInProgress = false;


function finalvalidation(options) {
    options = options || {};

    const isConfigureClick = options.isConfigureClick === true;
    const renderNode = getNode("RENDER");

    renderSuspended = true;

    console.log("finalvalidation: calling forceInitialValidation()");

    return forceInitialValidationLM()
        .then(function (res) {
            console.log("finalvalidation: forceInitialValidation resolved", res);
            renderSuspended = false;

            // ✅ Only manually trigger final render when Configure button was clicked
            if (isConfigureClick && renderNode && typeof renderNode.logic === "function") {
                console.log("finalvalidation: calling renderNode.logic()");
                return Promise.resolve(renderNode.logic.call(renderNode))
                    .then(function () {
                        console.log("finalvalidation: renderNode.logic() resolved");
                        return res;
                    });
            }

            return res;
        })
        .catch(function (e) {
            console.error("finalvalidation: forceInitialValidation REJECTED:", e);
            renderSuspended = false;

            if (isConfigureClick && renderNode && typeof renderNode.logic === "function") {
                return Promise.resolve(renderNode.logic.call(renderNode))
                    .catch(function (renderError) {
                        console.error("Render after validation error failed:", renderError);
                    })
                    .then(function () {
                        throw e;
                    });
            }

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

    setTimeout(function () {

        try {

            if (!sectionBundleDriversAdded) {
                addSectionBundleDrivers();
                addGlazingCodeLogic();
                addSchedulingCodeLogic();
                addHardwareDrivers();
               // addTrackDrivers();
                addOperatorEvents();
                sectionBundleDriversAdded = true;
            }

            console.log("Configure: calling finalvalidation()");

            finalvalidation({
                isConfigureClick: true
            })
                .then(function () {
                    console.log("Configure: finalvalidation resolved, calling nextPage()");
                    nextPage();
                })
                .catch(function (e) {
                    console.error("Configure error:", e);
                })
                .finally(function () {
                    console.log("Configure: finally block, hiding loader");
                    configureInProgress = false;
                    hideConfigureLoader();
                });

        } catch (e) {

            console.error("Configure sync error:", e);
            configureInProgress = false;
            hideConfigureLoader();

        }

    }, 20);

    return false;
}