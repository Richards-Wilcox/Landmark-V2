function addTrackDrivers() {
    //Removes the shaft from the bundle
    addLogic(
        "SHAFT_LOCATION",
        function () {
            if (getState("WIDTH") > 147) this.value = 0;
            else this.value = 1;
        },
        ["WIDTH"]
    );

    //Shaft Driver
    addLogic(
        "SHAFT_L1_PART",
        function () {

            let doorWidth = getGlobalDoorWidth();
            let shaftLength = doorWidth + 10;
            let shaftType = getState("SHAFT_TYPE");
            let product_id = getState("GL_PRODUCT_ID");

            let doorModel = "";

            if (product_id == "162059085") {
                const selectedModel = getSelected("DOOR_MODEL");

                doorModel = selectedModel?.getAttribute("desc") || "";
            } else {
                doorModel = "STILO";
            }

            // Normalize value for comparison
            doorModel = (doorModel || "").toUpperCase();

            if (doorModel === "STILO") {
                if (shaftType === "T") {
                    if (shaftLength <= 108) this.value = "950-229";
                    else if (shaftLength <= 120) this.value = "950-230";
                    else if (shaftLength <= 132) this.value = "950-231";
                    else if (shaftLength <= 156) this.value = "950-232";
                    else if (shaftLength <= 180) this.value = "950-233";
                    else if (shaftLength <= 204) this.value = "950-234";
                    else if (shaftLength <= 228) this.value = "950-235";
                    else if (shaftLength <= 252) this.value = "950-236";
                }
                else if (shaftType === "K") {
                    if (shaftLength <= 108) this.value = "950-259";
                    else if (shaftLength <= 132) this.value = "950-261";
                    else if (shaftLength <= 156) this.value = "950-262";
                    else if (shaftLength <= 180) this.value = "950-263";
                    else if (shaftLength <= 204) this.value = "950-264";
                    else if (shaftLength <= 228) this.value = "950-265";
                    else if (shaftLength <= 252) this.value = "950-266";
                }

            } else {
                if (shaftType === "T") {
                    if (shaftLength <= 108) this.value = "950-239";
                    else if (shaftLength <= 120) this.value = "950-240";
                    else if (shaftLength <= 132) this.value = "950-241";
                    else if (shaftLength <= 156) this.value = "950-242";
                    else if (shaftLength <= 180) this.value = "950-243";
                    else if (shaftLength <= 204) this.value = "950-244";
                    else if (shaftLength <= 228) this.value = "950-245";
                    else if (shaftLength <= 252) this.value = "950-246";
                }
                else if (shaftType === "K") {
                    if (shaftLength <= 111) this.value = "950-259";
                    else if (shaftLength <= 135) this.value = "950-261";
                    else if (shaftLength <= 159) this.value = "950-262";
                    else if (shaftLength <= 183) this.value = "950-263";
                    else if (shaftLength <= 207) this.value = "950-264";
                    else if (shaftLength <= 231) this.value = "950-265";
                    else if (shaftLength <= 255) this.value = "950-266";
                }
            }
        },
        ["WEIGHT", "WIDTH", "SHAFT_TYPE", "GL_PRODUCT_ID", "DOOR_MODEL"]
    );

    //Track Bundle
    addLogic(
        "TRACK_BUNDLE",

        function () {

            let widthInches = getState("DOOR_WIDTH_INCHES") === "0" ? "" : "-" + getState("DOOR_WIDTH_INCHES");
            let widthFeet = getState("DOOR_WIDTH_FEET");
            let heightInches = getState("DOOR_HEIGHT_INCHES");
            let heightFeet = getState("DOOR_HEIGHT_FEET");
            let liftType = getSelected("LIFT_TYPE").getAttribute("hwdesc");
            let doorModel = '';
            let product_id = getState("GL_PRODUCT_ID");
            let hwType = "+";
            let endStiles = ["double", "Y"].includes(getState("END_CAPS")) ? "DE" : "";
            let springCycle = '';
            let highlift = '';

            if (product_id == "162059085") {
                doorModel = getSelected("DOOR_MODEL").getAttribute("desc");
                springCycle = getState("SPRING_CYCLE");
                highlift = liftType === "I" ? getState("HIGHLIFT") : "";
            } else {
                doorModel = "Stilo";
                springCycle = "20M";
                highlift = liftType === "HL" ? getState("HIGHLIFT") : "";
            }

            // this.value = `TB ${widthFeet}${widthInches}x${heightFeet}-${heightInches} ${doorModel} ${highlift} ${liftType}${hwType} ${endStiles} ${springCycle}`;

            const value = [
                "TB",
                `${widthFeet}${widthInches}x${heightFeet}-${heightInches}`,
                doorModel,
                highlift,          // included only if not empty
                `${liftType}${hwType}`,
                endStiles,         // included only if not empty
                springCycle
            ]
                .filter(v => v)    // removes "", null, undefined
                .join(" ");

            this.value = value;
        },
        ["HEIGHT", "LIFT_TYPE", "WIDTH", "HIGHLIFT", "END_CAPS", "GL_PRODUCT_ID"]
    );

    addLogic(
        "TRACK_SET_INPUT_HL",
        function () {
            let liftType = getState("LIFT_TYPE");
            if (!["High_Lift", "HL"].includes(liftType)) {
                this.value = "NONE";
                return;
            }

            const doorHeight = getGlobalDoorHeight();
            const highlift = getState("HIGHLIFT");

            if (doorHeight <= 84 && highlift <= 54) this.value = "7-2790";
            else if (doorHeight <= 96 && highlift <= 23) this.value = "7-2791";
            else if (doorHeight <= 96 && highlift <= 54) this.value = "7-2790";
            else if (doorHeight <= 108 && highlift <= 23) this.value = "7-2792";
            else if (doorHeight <= 108 && highlift <= 35) this.value = "7-2791";
            else if (doorHeight <= 108 && highlift <= 54) this.value = "7-2790";
            else if (doorHeight <= 120 && highlift <= 23) this.value = "7-2793";
            else if (doorHeight <= 120 && highlift <= 35) this.value = "7-2792";
            else if (doorHeight <= 120 && highlift <= 47) this.value = "7-2791";
            else if (doorHeight <= 120 && highlift <= 54) this.value = "7-2790";
        },
        ["HEIGHT", "LIFT_TYPE", "HIGHLIFT"]
    );

    addLogic(
        "TRACK_SET_INPUT",
        function () {
            let liftType = getState("LIFT_TYPE");
            if (!["High_Lift", "HL"].includes(liftType)) {
                this.value = "NONE";
                return;
            }

            let liftTypePrefix = getSelected("LIFT_TYPE").getAttribute("trackcode");
            let trackSetDoorType = getState("DOOR_WIDTH_FEET") < 12 ? "SC" : "DC";

            let tracksetcode = `${getGlobalDoorHeight()}-${liftTypePrefix}-${trackSetDoorType}`;

            this.value = tracksetcode;
        },
        ["LIFT_TYPE", "WIDTH", "HEIGHT"]
    );

    addLogic(
        "UPPER_VERTICAL_TRACKS",
        function () {
            if (!["High_Lift", "HL"].includes(getState("LIFT_TYPE"))) {
                this.value = "NONE";
                return;
            }

            const highlift = getHiLift();
            if (highlift <= 37) this.value = "7-2786";
            else this.value = "7-2789";
        },
        ["HIGHLIFT", "LIFT_TYPE"]
    );

    addLogic(
        "LOWER_VERTICAL_TRACKS",
        function () {
            if (!["High_Lift", "HL"].includes(getState("LIFT_TYPE"))) {
                this.value = "NONE";
                return;
            }

            const height = getGlobalDoorHeight();
            if (height <= 7 * 12) this.value = "7-2780P";
            else if (height <= 8 * 12) this.value = "7-2781P";
            else if (height <= 9 * 12) this.value = "7-2782";
            else if (height <= 10 * 12) this.value = "7-2783";
        },
        ["HEIGHT", "LIFT_TYPE"]
    );

    //Springs
    addNode(
        {
            id: "SPRING_SOLUTION",
            logic: async function () {

                cacheDebounce(this);
            },
            debounce: getSpringSolutionsRW,
            value: JSON.parse(
                '{"ACTIVE_COILS_HIGH":91.58198771102559,"WEIGHT_LH":12.689963208845942,"QUANTITY":2,"SHAFT_REMAIN":102.97643555265604,"GA_H_CODE":-1,"ACTIVE_COILS_HIGH_LH":87.80224014696961,"VALUE":"433-2036M2","GA_HCONV":-1,"TORTEN_LH":297,"SPRING_RH_DESC":"0.243rd x 2 x 35 \\" RH 1.00C","OPT":"","MIN_LENGTH":-5,"SPRING_LENGTH_RH":34.689524076799074,"FINAL_LENGTH":34.689524076799074,"Q_H":2,"WEIGHT":13.216708673260447,"GA_H_SQFCT":-1,"QTY_EVEN_ODD":2,"BORE_SIZE":1,"MAX_IP":627.4810305007693,"ROUND_OR_SQUARE":"R","SPRING_RH":"52-24350R-R0E","HIGH_LH":1,"SPRING_LH":"52-23320L-R0E","SPRING_LENGTH_LH":32.14134875392614,"MIP_LH":297.0718478819873,"SPRING_GAL":1.266,"WIRE_SIZE_LH":0.234,"WIRE_SIZE":0.243,"DC_1":7,"HIGH_RH":1,"MAX_LENGTH":48,"TORTEN_L":-1,"TORTEN":266.9743,"COUPLER":false,"TORTEN_H":564,"MIP":330.409182618782,"SPRING_LH_DESC":"0.234rd x 2 x 32 LH 1.00C","COIL_DIAMETER":2,"WOUND_LENGTH":39.76356444734397,"CYCLE_LIFE":21.602826154510186}',
            ),
        },
        ["GLAZING_TYPE", "WEIGHT", "HEIGHT", "LIFT_TYPE", "HIGHLIFT", "WINDOWS", "GL_PRODUCT_ID"]
    );

    addLogic(
        "SPRING_RH",
        function () {
            if (!!getState("SPRING_SOLUTION").SPRING_RH) this.value = getState("SPRING_SOLUTION").SPRING_RH.replace("R0E", "R1E");
            else this.value = "";
        },
        ["SPRING_SOLUTION"]
    );
    addLogic(
        "SPRING_LH",
        function () {
            if (!!getState("SPRING_SOLUTION").SPRING_LH) this.value = getState("SPRING_SOLUTION").SPRING_LH.replace("R0E", "R1E");
            else this.value = "";
        },
        ["SPRING_SOLUTION"]
    );
    addLogic(
        "BULK_SPRING_QTY",
        function () {
            if (getState("SPRING_SOLUTION").COIL_DIAMETER === 2) this.value = "";
            else this.value = getState("SPRING_SOLUTION").QUANTITY;
        },
        ["SPRING_SOLUTION"]
    );
    addLogic(
        "INCLUDE_SPRING_CUT_INSTR",
        function () {
            this.value = (getState("BULK_SPRING_QTY") > 0).toString().toUpperCase();
        },
        ["BULK_SPRING_QTY"]
    );
    addLogic(
        "CUT_INSTR_RH_SPRINGS",
        function () {
            this.value = `Cut Springs to ${getState("SPRING_SOLUTION").SPRING_LENGTH_RH.toFixed(0)}"`;
        },
        ["SPRING_SOLUTION"]
    );
    addLogic(
        "SPRING_LH_QTY",
        function () {
            this.value = getState("SPRING_SOLUTION").HIGH_LH;
        },
        ["SPRING_SOLUTION"]
    );
    addLogic(
        "SPRING_RH_QTY",
        function () {
            this.value = getState("SPRING_SOLUTION").HIGH_RH;
        },
        ["SPRING_SOLUTION"]
    );
    addLogic(
        "BULK_SPRING_RH",
        function () {
            this.value = getState("SPRING_SOLUTION").BULK_SPRING_RH ?? "";
        },
        ["SPRING_SOLUTION"]
    );
    addLogic(
        "BULK_SPRING_LH",
        function () {
            this.value = getState("SPRING_SOLUTION").BULK_SPRING_LH ?? "";
        },
        ["SPRING_SOLUTION"]
    );

    addLogic(
        "CUT_INSTR_LH_SPRINGS",
        function () {
            if (!!getState("SPRING_SOLUTION").SPRING_LENGTH_RH) this.value = `Cut Springs to ${getState("SPRING_SOLUTION").SPRING_LENGTH_LH.toFixed(0)}"`;
            else this.value = "";
        },
        ["SPRING_SOLUTION"]
    );
    addLogic(
        "SPRING_RH_DESC",
        function () {
            this.value = getState("SPRING_SOLUTION").SPRING_RH_DESC;
        },
        ["SPRING_SOLUTION"]
    );
    addLogic(
        "SPRING_LH_DESC",
        function () {
            this.value = getState("SPRING_SOLUTION").SPRING_LH_DESC;
        },
        ["SPRING_SOLUTION"]
    );
}

async function getSpringSolutionsRW() {


    const doorData = {
        DOOR_WEIGHT: "" + getState("WEIGHT") ?? 240.03,
        DOOR_HEIGHT: "" + getState("HEIGHT"),
        DOOR_WIDTH: "" + getState("WIDTH"),
        BORE_SIZE: "1.0",
        CYCLES: "10",
        SPRING_GALVANIZED: "1.0",
        COUPLINGS_QTY: "0",
        LIFT_TYPE: getSelected("LIFT_TYPE").getAttribute("numval"),
        HILIFT: getState("HIGHLIFT") + "",
        SPRING_QTY: "2",
        CYCLE_FACTOR: "1.131",
    };
    const drumData = {
        DRUM_HM_ARM: "2.215",
        DRUM_FM_ARM: "2.0",
        DRUM_CABLE_DIA: "0.125",
        DRUM_CIRCUMFERENCE: "12.56637",
        DRUM_WIDTH: "2.63",
        DRUM_RORISE_VALUE: "0.21875",
    };
    const trackData = {
        TRACK_RADIUS: getSelected("LIFT_TYPE").getAttribute("radius"),
        TRACK_ANGLE: "0.0",
    };
    console.log(doorData);
    //Need to check for validation
    if (JSON.stringify(doorData).includes("NaN")) return;

    const body = JSON.stringify({
        door: doorData,
        drum: drumData,
        track: trackData,
    });
    //console.log(body)

    let solutions;

    try {
        solutions = await $.ajax({
            method: "POST",
            url: "/spr/custom/jpoc/json/1568356027",
            data: body,
            dataType: "json",
            contentType: "text/plain",
            processData: false,
            headers: { LOG: true },
        });
    } catch (err) {
        console.log("Spring API failed", err);

        // Return a valid default object
        return getState("SPRING_SOLUTION");
    }
    //Remove Invalid spring solutions
    solutions = solutions.filter(
        (a) =>
            //Only two valid diameters / quantities
            (a.COIL_DIAMETER === 2 || a.COIL_DIAMETER === 2.625) &&
            a.QUANTITY <= 2 &&
            //2" ID springs only valid if the length is less than 42"
            !((a.COIL_DIAMETER === 2 && Math.round(a.SPRING_LENGTH_RH) >= 42) || (a.COIL_DIAMETER === 2 && Math.round(a.SPRING_LENGTH_LH) >= 42)) &&
            //Max gauge for 2" springs is 2.2625
            !(a.COIL_DIAMETER === 2 && a.WIRE_SIZE > 2.2625) &&
            //Max door width for single spring solutions is 12'
            !(getGlobalDoorWidth() >= 144 && a.QUANTITY == 1),
    );

    //We want the solution that is closest to 20k cycles and we want to prefer single spring over double spring.
    solutions.sort((a, b) => {
        if ((b.MIP > 410 || b.MIP_LH > 410) && b.QUANTITY === 1) return -1;
        const cycleLifeDiff = Math.abs(a.CYCLE_LIFE - 20) - Math.abs(b.CYCLE_LIFE - 20);
        if (Math.abs(cycleLifeDiff) < 0.005 && a.COIL_DIAMETER !== b.COIL_DIAMETER) return a.COIL_DIAMETER - b.COIL_DIAMETER;
        if (a.COIL_DIAMETER === b.COIL_DIAMETER && a.QUANTITY !== b.QUANTITY) return a.QUANTITY - b.QUANTITY;
        return cycleLifeDiff;
    });

    return solutions[0];
}
