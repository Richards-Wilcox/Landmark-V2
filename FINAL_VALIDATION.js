var sectionBundleDriversAdded = false;
var configureInProgress = false;

function showConfigureLoader() {
    var $loader = $("#canvas-loader");

    if (!$loader.length) {
        console.warn("Loader element #canvas-loader not found");
        return;
    }

    $loader.show();

    // Force reflow so browser applies display change immediately
    $loader[0].offsetHeight;
}

function hideConfigureLoader() {
    var $loader = $("#canvas-loader");

    if ($loader.length) {
        $loader.hide();
    }
}

function finalvalidation() {
    const renderNode = getNode("RENDER");
    const render_fn = renderNode.logic;

    renderNode.logic = function () { };

    return forceInitialValidation()
        .then(function (res) {
            renderNode.logic = render_fn;
            rw(renderNode);
            render_fn();
            return res;
        })
        .catch(function (e) {
            renderNode.logic = render_fn;
            rw(renderNode);
            render_fn();
            throw e;
        });
}

function loadTestResults(json) {
    $("#INPUT_JSON").val(json);
    loadInputValues();
    return finalvalidation();
}

function Configure() {
    if (configureInProgress) {
        return false;
    }

    configureInProgress = true;
    showConfigureLoader();

    // Give browser time to actually paint loader before EW heavy work starts
    setTimeout(function () {
        try {
            if (!sectionBundleDriversAdded) {
                addSectionBundleDrivers();
				addGlazingCodeLogic();
				addSchedulingCodeLogic();
                sectionBundleDriversAdded = true;
            }

            finalvalidation()
                .then(function () {
                    nextPage();
                })
                .catch(function (e) {
                    console.error("Configure error:", e);
                    hideConfigureLoader();
                    configureInProgress = false;
                });

        } catch (e) {
            console.error("Configure sync error:", e);
            hideConfigureLoader();
            configureInProgress = false;
        }
    }, 20); // 20ms is usually enough to paint loader

    return false;
}