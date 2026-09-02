let sectionBundleDriversAdded = false;
let configureInProgress = false;

function runNodeLogic(id) {
    const node = getNode(id);

    if (node && typeof node.logic === "function") {        
        node.logic.call(node);
    } else {        
    }
}

function initializeDriversOnDemand() {

    if (sectionBundleDriversAdded) {
        return Promise.resolve();
    }
    try {        
        addSectionBundleDrivers();        
        addGlazingCodeLogic();        
        addSchedulingCodeLogic();
        addHardwareDrivers();        
        addTrackDrivers();    
        addOperatorEvents();
        
        sectionBundleDriversAdded = true;

        return Promise.resolve();

    } catch (e) {

        sectionBundleDriversAdded = false;

        console.error(
            "Driver initialization failed:",
            e
        );

        return Promise.reject(e);
    }
}


function finalvalidation(options) {
    options = options || {};

    const isConfigureClick = options.isConfigureClick === true;
    const renderNode = getNode("RENDER");

    renderSuspended = true;

    return forceInitialValidationLM()
    // return forceInitialValidation()
        .then(function (res) {

            renderSuspended = false;

            if (
                isConfigureClick &&
                renderNode &&
                typeof renderNode.logic === "function"
            ) {                

                return Promise.resolve(
                    renderNode.logic.call(renderNode)
                )
                .then(() => {
                    return res;

                });
            }
            return res;
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

async function Configure(event) {

    if (event && typeof event.preventDefault === "function") {
        event.preventDefault();
        event.stopPropagation();
    }

    if (configureInProgress) {
        return false;
    }

    configureInProgress = true;

    showConfigureLoader();

    // Give browser a chance to paint loader
    await new Promise(resolve => {
        requestAnimationFrame(() => {
            setTimeout(resolve, 0);
        });
    });

    try {

        await initializeDriversOnDemand();

        await finalvalidation({
            isConfigureClick: true
        });

        nextPage();

    }
    catch (e) {

        console.error("Configure error:", e);

    }
    finally {

        configureInProgress = false;

        hideConfigureLoader();

    }

    return false;
}