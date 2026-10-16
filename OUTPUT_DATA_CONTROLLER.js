function ShowHideReasonCodes() {

    createNode(
        "REASON_CODE_VISIBILITY",
        function () {

            const orderStatus = getState("GL_ORDER_STATUS1");

            const $labelCell = $("#GL_REASON_CODES1_TD_tag");
            const $valueCell = $("#GL_REASON_CODES1").closest("td");

            if (orderStatus === "SO" || orderStatus === "SA") {

                $labelCell.hide();
                $valueCell.hide();

            } else {

                $labelCell.show();
                $valueCell.show();

            }

        },
        "",
        $("#REASON_CODE_VISIBILITY")[0],
        ["GL_ORDER_STATUS1"]
    );

    // FORCE INITIAL RUN
    const node = getNode("REASON_CODE_VISIBILITY");

    if (node && typeof node.logic === "function") {
        node.logic.call(node);
    }
}