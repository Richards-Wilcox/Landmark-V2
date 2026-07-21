//TODO: Rename to Residential Hardware Carton
function addHardwareDrivers() {

    addLogic("END_HINGE_OUTPUT", function () {
        this.value = "327-040"
    }, ["DOOR_WIDTH_FEET"])

    addLogic("END_HINGE_QTY", function () {
        const width = getState("DOOR_WIDTH_FEET")
        const isDouble = getState("END_CAPS") === "double"
        if (!isDouble)
            this.value = 6
        else
            this.value = 12
    }, ["END_CAPS"])

    addLogic("CENTER_HINGE_QTY", function () {

        let product_id = String(getState("GL_PRODUCT_ID"));

        if (product_id == "162059085") {

            const center_hinge_code = getState("CENTER_HINGE_CODE");

            const hingeMap = {
                A: 1,
                B: 2,
                C: 3,
                D: 4,
                E: 5,
                F: 6,
                G: 7,
                H: 8,
                I: 9
            };

            this.value = hingeMap[center_hinge_code] || "";

        } else {

            const width = Number(getState("DOOR_WIDTH_FEET")) || 0;

            this.value = width <= 9 ? 6 : 12;
        }

    }, ["DOOR_WIDTH_FEET", "CENTER_HINGE_CODE", "GL_PRODUCT_ID"])

    //*** CENTER HINGES ***//
    addLogic("CENTER_HINGE_OUTPUT", function () {
        this.value = '327-041'
    }, ["DOOR_WIDTH_FEET"])

    addLogic("HARDWARE_SET_CODE", function () {

        let doorHeightFeet = getState("DOOR_HEIGHT_FEET");
        let heightCode = ""
        if (doorHeightFeet <= 7) {
            heightCode = "070"
        } else if (doorHeightFeet <= 8) {
            heightCode = "080"
        } else if (doorHeightFeet <= 9) {
            heightCode = "090"
        } else if (doorHeightFeet < 11) {
            heightCode = "100"
        } else {
            heightCode = "120"
        }
        const numSections = getNumberOfSections();
        let sectionCode = numSections
        if (numSections <= 4)
            sectionCode = "4"
        //If >4 then the value has to be D
        const numCenterHinges = "0BCDEDDDDDDDDDDDDDDDDD".charAt(getTotalCenterHingeQTY());
        /**Not part of current Implementation. Here for future-proofing. **/
        const hardwareType = "N"
        const springType = "H" //H = torsion F = extension
        const partNum = "LHC"
        const hardwareSetCode = `${partNum}-B${springType}${heightCode}${sectionCode}-${numCenterHinges}11${hardwareType}SBN`;

        this.value = (hardwareSetCode);
    }, ["DOOR_HEIGHT_FEET", "LIFT_TYPE", "WIDTH", "CENTER_HINGE_QTY"])

    addLogic("DRUMS_CABLES_KIT", function () {
        if (getState("LIFT_TYPE") !== "High_Lift") {
            this.value = "NONE"
            return;
        }

        const height = getState("HEIGHT") / 12
        if (height <= 7)
            this.value = ("327-431")
        else if (height <= 8)
            this.value = ("327-432")
        else if (height <= 9)
            this.value = ("327-433")
        else if (height <= 10)
            this.value = ("327-434")

    }, ["LIFT_TYPE", "HEIGHT"])

    addLogic("QTY_215306", function () {
        if (getState("TRUSS_QTY") !== 0)
            this.value = 1
        else
            this.value = 0
    }, ["TRUSS_QTY"])


    addLogic("DOUBLE_END_HINGES_OUTPUT", function () {
        const numSections = getNumberOfSections();
        let product_id = String(getState("GL_PRODUCT_ID"));

        let isDBLEnabled = false;

        if (product_id === "162059085") {
            isDBLEnabled = getState("END_CAPS") === "Y";
        } else {
            isDBLEnabled = getState("END_CAPS") === "double";
        }

        if (!isDBLEnabled) {
            this.value = "NONE";
            return;
        }

        if (numSections === 4) {
            this.value = "327-395";
        } else if (numSections === 5) {
            this.value = "327-396";
        } else if (numSections === 6) {
            this.value = "327-398";
        } else {
            this.value = "NONE";
        }

    }, ["END_CAPS", "NUM_SECTIONS", "GL_PRODUCT_ID", "NUM_OF_SEC"]);

    addLogic("CONVERSION_KIT", function () {
        const liftType = getState("LIFT_TYPE")
        if (liftType === "LHR_Fr_Mnt" || liftType === "LHF") {
            this.value = ("327-391")
        } else if (liftType === "LHR_Rr_Mnt" || liftType === "LHROUT") {
            this.value = ("327-392")

        } else {
            this.value = ("NONE")
        }
    }, ["LIFT_TYPE"])

    addLogic("CABLE", function () {

        const doorHeight = getState("HEIGHT");
        const liftType = getState("LIFT_TYPE");
        let product_id = getState("GL_PRODUCT_ID");

        this.value = ("NONE")

        switch (liftType) {
            case ('Std_Lift_12R'):
            case ("STD12"):
            case ('Std_Lift_15R'):
            case ("STD15"):
            case ('LHR_Fr_Mnt'):
            case ('LHF'):
                if (doorHeight >= (10 * 12 + 3) && doorHeight <= (10 * 12 + 9))
                    this.value = ("133-099")
                break;
            case ("Std_Lift_32R"):
            case ("32R"):
                if (doorHeight <= 7 * 12)
                    this.value = '133-086'
                if (doorHeight <= 8 * 12)
                    this.value = '133-087'
                break;
            case ("LHR_Rr_Mnt"):
            case ("LHROUT"):
                if (doorHeight <= 6 * 12)
                    this.value = '133-072'
                else if (doorHeight <= 7 * 12)
                    this.value = '133-077'
                else if (doorHeight <= 8 * 12)
                    this.value = '133-078'
                else if (doorHeight <= 9 * 12)
                    this.value = '133-079'
                else if (doorHeight <= 10 * 12)
                    this.value = '133-080'
                else if (doorHeight <= 11 * 12)
                    this.value = '13-021-2990-1'
                else if (doorHeight <= 12 * 12)
                    this.value = '13-021-323201'
        }

        //assign value to none for LM v2 when glass shape is selected. (we are removing heavy Top) 
        if (product_id === "162059085") {
            const glass_shape = getState("GLASS_SHAPE");

            if (glass_shape && glass_shape !== "NONE") {
                this.value = "NONE";
            }
        }


    }, ["HEIGHT", "LIFT_TYPE", "GLASS_SHAPE"])

    addLogic("SLICE_KIT", function () {

        if (!["High_Lift", "HL"].includes(getState("LIFT_TYPE"))) {
            this.value = "NONE";
            return;
        }

        const hiLift = getHiLift()
        if (hiLift > 36)
            this.value = ("327-414")
        else
            this.value = ("327-404")


    }, ["LIFT_TYPE", "HIGHLIFT", "HEIGHT"])

    addLogic("HARDWARE_DESC", function () {

        let widthInches = getState("DOOR_WIDTH_INCHES") === "0" ? "" : "-" + getState("DOOR_WIDTH_INCHES")
        let widthFeet = getState("DOOR_WIDTH_FEET")
        let heightInches = getState("DOOR_HEIGHT_INCHES")
        let heightFeet = getState("DOOR_HEIGHT_FEET")
        let liftType = getSelected("LIFT_TYPE").getAttribute("hwdesc")
        let product_id = getState("GL_PRODUCT_ID");
        let doorModel = '';
        const hwType = "+"
        const endStiles = ["double", "Y"].includes(getState("END_CAPS")) ? "DE" : ""

        if (product_id == "162059085") {
            doorModel = getState("DOOR_MODEL").getAttribute("desc");
        } else {
            doorModel = "Stilo";
        }


        this.value = [
            "HC",
            `${widthFeet}${widthInches}x${heightFeet}-${heightInches}`,
            doorModel,
            liftType ? `${liftType}${hwType}` : "",
            endStiles
        ]
            .filter(v => v != null && v !== "")
            .join(" ");

    }, ["WIDTH", "HEIGHT", "END_CAPS", "LIFT_TYPE", "GL_PRODUCT_ID"])

    // addNode({
    //     id: "UPDATE_HINGE_PACKS", value: 0, logic: function () {
    //         updateHingePacks()
    //     }
    // }, ["CENTER_HINGE_QTY", "HEIGHT"])

    addLogic("HINGE_PACK_1", function () {
        this.value = getHingePackValues().hingePack1;
    }, ["CENTER_HINGE_QTY", "HEIGHT"]);


    addLogic("HINGE_PACK_1_QTY", function () {
        this.value = getHingePackValues().hingePack1Qty;
    }, ["CENTER_HINGE_QTY", "HEIGHT"]);


    addLogic("HINGE_PACK_2", function () {
        this.value = getHingePackValues().hingePack2;
    }, ["CENTER_HINGE_QTY", "HEIGHT"]);


    addLogic("HINGE_PACK_2_QTY", function () {
        this.value = getHingePackValues().hingePack2Qty;
    }, ["CENTER_HINGE_QTY", "HEIGHT"]);

    addLogic("QTY_950188", function () {
        if (getState("END_CAPS") == "single" && getState("WEIGHT") > 600)
            this.value = 1;
        else
            this.value = 0;
    }, ["END_CAPS", "WEIGHT"])
    addLogic("QTY_950189", function () {
        if (getState("END_CAPS") == "single" && getState("WEIGHT") > 600)
            this.value = 1;
        else
            this.value = 0;
    }, ["END_CAPS", "WEIGHT"])
    addLogic("QTY_950192", function () {
        if (getState("END_CAPS") == "single" && getState("WEIGHT") > 600)
            this.value = 2;
        else
            this.value = 0;
    }, ["END_CAPS", "WEIGHT"])
    addLogic("QTY_40021", function () {
        if (getState("WEIGHT") > 600)
            this.value = 2;
        else
            this.value = 0;
    }, ["WEIGHT"])
    addLogic("QTY_950190", function () {
        if (getState("END_CAPS") == "double" && getState("WEIGHT") > 600)
            this.value = 1;
        else
            this.value = 0;
    }, ["END_CAPS", "WEIGHT"])
    addLogic("QTY_950191", function () {
        if ((getState("END_CAPS") == "double" || getState("END_CAPS") == 'Y') && getState("WEIGHT") > 600)
            this.value = 1;
        else
            this.value = 0;
    }, ["END_CAPS", "WEIGHT"])
    addLogic("QTY_950195", function () {
        if (getState("END_CAPS") == "double" && getState("WEIGHT") > 600)
            this.value = 2;
        else
            this.value = 0;
    }, ["END_CAPS", "WEIGHT"])
    addLogic("QTY_950176", function () {
        if (getState("HEIGHT") > 8 * 12 && getState("WEIGHT") < 600)
            this.value = 1;
        else
            this.value = 0;
    }, ["HEIGHT", "WEIGHT"])

    addLogic("QTY_950177", function () {
        if (getState("HEIGHT") > 8 * 12 && getState("WEIGHT") < 600)
            this.value = 1;
        else
            this.value = 0;
    }, ["HEIGHT", "WEIGHT"])

    //Needed for some completely asinine shaft behaviour
    $("#DOOR_WIDTH_INCHES").change(() => $("#GLOBAL_DOOR_WIDTH_INPUT").val(getGlobalDoorWidth()));
    $("#DOOR_WIDTH_FEET").change(() => $("#GLOBAL_DOOR_WIDTH_INPUT").val(getGlobalDoorWidth()));


}
function resiCartonCodeMap(doorWidth) {
    if (doorWidth < 48)
        return '0'
    if (doorWidth < 111)
        return 'B'
    if (doorWidth < 147)
        return 'C'
    if (doorWidth < 195)
        return 'D'
    return 'E'
}


function updateHingePacks() {
    const numSections = getNumberOfSections()
    //TODO: Probably inaccurate
    const hingeCount = getTotalCenterHingeQTY();
    const hingecode = numSections + "" + hingeCount

    $("#HINGE_PACK_1").val("NONE")
    $("#HINGE_PACK_1_QTY").val(0)
    $("#HINGE_PACK_2").val("NONE")
    $("#HINGE_PACK_2_QTY").val(0)


    switch (hingecode) {
        case ('44'):

            $("#HINGE_PACK_1").val("327-393")
            $("#HINGE_PACK_1_QTY").val("1")
            break;
        case ('45'):
        case ('64'):
        case ('74'):
            $("#HINGE_PACK_1").val("327-393")
            $("#HINGE_PACK_1_QTY").val("2")
            break;
        case ('46'):
            $("#HINGE_PACK_1").val("327-393")
            $("#HINGE_PACK_1_QTY").val("3")
            break;
        case ('54'):
            $("#HINGE_PACK_2").val("327-394")
            $("#HINGE_PACK_2_QTY").val("1")
            break;
        case ('55'):
            $("#HINGE_PACK_2").val("327-394")
            $("#HINGE_PACK_2_QTY").val("2")
            break;
        case ('56'):
        case ('75'):
            $("#HINGE_PACK_2").val("327-394")
            $("#HINGE_PACK_2_QTY").val("3")
            break;
        case ('65'):
            $("#HINGE_PACK_1").val("327-393")
            $("#HINGE_PACK_1_QTY").val("2")
            $("#HINGE_PACK_2").val("327-394")
            $("#HINGE_PACK_2_QTY").val("1")
            break;
        case ('66'):
            $("#HINGE_PACK_1").val("327-393")
            $("#HINGE_PACK_1_QTY").val("1")
            $("#HINGE_PACK_2").val("327-394")
            $("#HINGE_PACK_2_QTY").val("3")
            break;
        case ('76'):
            $("#HINGE_PACK_1").val("327-393")
            $("#HINGE_PACK_1_QTY").val("2")
            $("#HINGE_PACK_2").val("327-394")
            $("#HINGE_PACK_2_QTY").val("3")
            break;
        case ('84'):
            $("#HINGE_PACK_1").val("327-393")
            $("#HINGE_PACK_1_QTY").val("1")
            $("#HINGE_PACK_2").val("327-394")
            $("#HINGE_PACK_2_QTY").val("1")
            break;
        case ('85'):
            $("#HINGE_PACK_1").val("327-393")
            $("#HINGE_PACK_1_QTY").val("2")
            $("#HINGE_PACK_2").val("327-394")
            $("#HINGE_PACK_2_QTY").val("2")
            break;
        case ('86'):
            $("#HINGE_PACK_1").val("327-393")
            $("#HINGE_PACK_1_QTY").val("3")
            $("#HINGE_PACK_2").val("327-394")
            $("#HINGE_PACK_2_QTY").val("3")
            break;
    }

}


function getHingePackValues() {
    const numSections = getNumberOfSections();
    const hingeCount = getState("CENTER_HINGE_QTY");

    const hingecode = `${numSections}${hingeCount}`;
    const result = {
        hingePack1: "NONE",
        hingePack1Qty: 0,
        hingePack2: "NONE",
        hingePack2Qty: 0
    };

    switch (hingecode) {
        case "44":
            result.hingePack1 = "327-393";
            result.hingePack1Qty = 1;
            break;

        case "45":
        case "64":
        case "74":
            result.hingePack1 = "327-393";
            result.hingePack1Qty = 2;
            break;

        case "46":
            result.hingePack1 = "327-393";
            result.hingePack1Qty = 3;
            break;

        case "54":
            result.hingePack2 = "327-394";
            result.hingePack2Qty = 1;
            break;

        case "55":
            result.hingePack2 = "327-394";
            result.hingePack2Qty = 2;
            break;

        case "56":
        case "75":
            result.hingePack2 = "327-394";
            result.hingePack2Qty = 3;
            break;

        case "65":
            result.hingePack1 = "327-393";
            result.hingePack1Qty = 2;
            result.hingePack2 = "327-394";
            result.hingePack2Qty = 1;
            break;

        case "66":
            result.hingePack1 = "327-393";
            result.hingePack1Qty = 1;
            result.hingePack2 = "327-394";
            result.hingePack2Qty = 3;
            break;

        case "76":
            result.hingePack1 = "327-393";
            result.hingePack1Qty = 2;
            result.hingePack2 = "327-394";
            result.hingePack2Qty = 3;
            break;

        case "84":
            result.hingePack1 = "327-393";
            result.hingePack1Qty = 1;
            result.hingePack2 = "327-394";
            result.hingePack2Qty = 1;
            break;

        case "85":
            result.hingePack1 = "327-393";
            result.hingePack1Qty = 2;
            result.hingePack2 = "327-394";
            result.hingePack2Qty = 2;
            break;

        case "86":
            result.hingePack1 = "327-393";
            result.hingePack1Qty = 3;
            result.hingePack2 = "327-394";
            result.hingePack2Qty = 3;
            break;
    }

    return result;
}

