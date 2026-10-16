function addOptionsDrivers() {


    addLogic("HANGER_ANGLE_OUTPUT", function () {
        this.value = getState("HANGER_ANGLE")
    }, ["HANGER_ANGLE"])

    addLogic("HANGER_ANGLE_QTY_OUTPUT", function () {
        this.value = getState("HANGER_ANGLE_QTY")
    }, ["HANGER_ANGLE_QTY"])

    addLogic("JAMB_SCREWS", function () {
        let product_id = String(getState("GL_PRODUCT_ID"));
        const jamb_seal = getState("JAMB_SEAL");

        if (jamb_seal === 'NONE') {
            this.value = '';
            return;
        }

        if (product_id == "162059085") {
            this.value = getSelected("JAMB_SEAL_COLOR").value.jambscrews;
        }
        else this.value = getSelected("JAMB_SEAL_COLOR").getAttribute("jambscrews")
    }, ["JAMB_SEAL_COLOR", "JAMB_SEAL"])

    addLogic("JAMB_SCREWS_QTY", function () {
        this.value = getState("JAMB_SEAL_SCREW_PACKAGES")
    }, ["JAMB_SEAL_SCREW_PACKAGES"])

    addLogic("JAMB_SEAL_VERTICAL", function () {
        this.value = getJambSealValue(getGlobalDoorHeight());
    }, [
        "HEIGHT",
        "JAMB_SEAL_COLOR",
        "JAMB_SEAL",
        "GL_PRODUCT_ID"
    ]);

    addLogic("JAMB_SEAL_HORIZONTAL", function () {
        this.value = getJambSealValue(getGlobalDoorWidth());
    }, [
        "WIDTH",
        "JAMB_SEAL_COLOR",
        "JAMB_SEAL",
        "GL_PRODUCT_ID"
    ]);

    addLogic("JAMB_SEAL_UNIPACKS", function () {

        if (getState("JAMB_SEAL") === "NONE") {
            this.value = "NONE";
            return;
        }

        const height = getGlobalDoorHeight();

        const match = [
            { max: 84, value: "152-339" },
            { max: 96, value: "152-340" },
            { max: 108, value: "152-348" },
            { max: 120, value: "152-341" }
        ].find(r => height <= r.max);

        this.value = match ? match.value : "";

    }, [
        "HEIGHT",
        "JAMB_SEAL"
    ]);

    addLogic("DEC_SNAP_LATCH", function () {
        const snapLatch = getState("SNAP_LATCH_OPTION");
        const width = getState("WIDTH");
        const doorModel = getState("DOOR_MODEL");

        this.value = getSnapLatchSmartPart(
            snapLatch,
            width,
            doorModel
        )
    }, ["SNAP_LATCH_OPTION", "DOOR_MODEL", "WIDTH"])

    addDecorativeLogic("DEC_FULL_SETS", "FULL_SETS");
    addDecorativeQtyLogic("DEC_FULL_SETS_QTY", "FULL_SETS_QTY");

    addDecorativeLogic("DEC_L_HANDLE", "L_HANDLE");
    addDecorativeQtyLogic("DEC_L_HANDLE_QTY", "L_HANDLE_QTY");

    addDecorativeLogic("DEC_HANDLE", "HANDLE");
    addDecorativeQtyLogic("DEC_HANDLE", "HANDLE_QTY");

    addDecorativeLogic("DEC_DOOR_KNOCKER", "DOOR_KNOCKER");
    addDecorativeQtyLogic("DEC_DOOR_KNOCKER_QTY", "DOOR_KNOCKER_QTY");

    addDecorativeLogic("DEC_DOOR_STUDS", "DOOR_STUDS");
    addDecorativeQtyLogic("DEC_DOOR_STUDS_QTY", "DOOR_STUDS_QTY");

    addDecorativeLogic("DEC_MAGNETIC_SET", "MAGNETIC_SET");
    addDecorativeQtyLogic("DEC_MAGNETIC_SET_QTY", "MAGNETIC_SET_QTY");

    addDecorativeLogic("DEC_STRAPS", "STRAPS");
    addDecorativeQtyLogic("DEC_STRAPS_QTY", "STRAPS_QTY");

}

function addDecorativeLogic(targetKey, stateKey) {
    addLogic(targetKey, function () {
        const value = getState(stateKey);
        this.value = value === "NONE" ? "" : value;
    }, [stateKey]);
}

function addDecorativeQtyLogic(targetKey, stateKey) {
    addLogic(targetKey, function () {
        this.value = getState(stateKey);
    }, [stateKey]);
}

function getJambSealColor() {
    let colour = '';
    let product_id = String(getState("GL_PRODUCT_ID"));


    if (product_id == "162059085") {
        colour = getState('JAMB_SEAL_COLOR').value;
    } else {
        colour = getState('JAMB_SEAL_COLOR')
    }
    return colour;
}

function getJambSealValue(size) {
    const jambType = getState("JAMB_SEAL");

    if (jambType === "NONE") {
        return "NONE";
    }

    return `${jambType}-${getJambSealColor()}-${size}`;
}


function getSnapLatchSmartPart(
    snapLatch,
    width,
    doorModel
) {
    width = Number(width);

    if (snapLatch === "SnapLatch") {

        if (!["A", "D"].includes(doorModel)) {
            return "";
        }

        if (width >= 50 && width <= 120) {
            return "324-350";
        }

        if (width >= 121 && width <= 240) {
            return "324-351";
        }

        return "";
    }

    if (snapLatch === "OnePointLatch") {

        if (!["A", "D", "G"].includes(doorModel)) {
            return "";
        }

        if (width >= 50 && width <= 240) {
            return "324-337";
        }

        return "";
    }

    return "";
}