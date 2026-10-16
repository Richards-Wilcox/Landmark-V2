function getCurrentDoorWeight() {
    return getSpringingWeight();
}

function getDoorWeight() {
    try {

        const widthFt = Number(getState("DOOR_WIDTH_FEET")) || 0;
        const heightFt = Number(getState("DOOR_HEIGHT_FEET")) || 0;
        const sections = Number(getState("NUM_OF_SEC")) || 0;
        const globalWidth = Number(getState("WIDTH")) || 0;
        const doorModel = getState("DOOR_MODEL");
        const endType = getState("END_CAPS");
        const panel = getState("FACE");
        const color = getState("COLOR").value;

        let reinforcingFactor = 0;
        let panelSqft = 0;
        let endCapFactor = 0;
        let doubleEndFactor = 0;
        let extraWeight = 0;

        const btmRetFactor = 0.2484;
        const btmSealFactor = 0.15;

        if (doorModel === "A") {
            panelSqft = panel === 'B' ? 1.4928 : 1.775      // H2
            reinforcingFactor = 0.4937; // H6          
            endCapFactor = 1.018775;      // H7
            doubleEndFactor = 2.049692   // H8
        }
        else if (doorModel === 'D') {

            panelSqft = panel === 'B' ? 1.61856 : 1.74     // H2
            reinforcingFactor = 0.8515; // H6            
            endCapFactor = 1.13664;      // H7
            doubleEndFactor = 2.166111   // H8
        }

        // AD
        const panelWeight =
            widthFt *
            heightFt *
            panelSqft;

        // AE
        const reinforcingWeight =
            widthFt *
            sections *
            reinforcingFactor;

        // AF
        const endCapWeight =
            endCapFactor *
            heightFt;

        // AG
        const doubleEndWeight =
            endType === "Y"
                ? sections * doubleEndFactor
                : 0;

        // AH 
        const bottomWeight =
            (btmRetFactor * globalWidth) / 12 +
            (btmSealFactor * (globalWidth + 6)) / 12;
        //bottom retainer + bottm seal


        // Y
        if(color === 'X' || color === 'Y'){
            extraWeight = 0.0458
        }


        const totalWeight =
            panelWeight +
            reinforcingWeight +
            endCapWeight +
            doubleEndWeight +
            bottomWeight +
            extraWeight;

        $("#WEIGHT_BREAKDOWN").val(
            `Total: ${totalWeight.toFixed(2)} ` +
            `Panel: ${panelWeight.toFixed(2)} ` +
            `Reinforcing: ${reinforcingWeight.toFixed(2)} ` +
            `EndCap: ${endCapWeight.toFixed(2)} ` +
            `DoubleEnd: ${doubleEndWeight.toFixed(2)} ` +
            `Bottom: ${bottomWeight.toFixed(2)} ` +
            `Extra: ${extraWeight.toFixed(2)}`
        );

        // console.log("WEIGHT BREAKDOWN", {
        //     widthFt,
        //     globalWidth,
        //     heightFt,
        //     sections,
        //     doorModel,
        //     endType,

        //     panelSqft,
        //     reinforcingFactor,
        //     endCapFactor,
        //     doubleEndFactor,

        //     panelWeight,
        //     reinforcingWeight,
        //     endCapWeight,
        //     doubleEndWeight,
        //     bottomWeight,
        //     extraWeight,

        //     totalWeight
        // });


        return totalWeight;

    } catch (e) {
        console.error("Door Weight Error:", e);
        return 0;
    }
}

function getOnDoorCode() {

    const model = getState("DOOR_MODEL");

    const endCode =
        getState("END_CAPS") === "Y"
            ? "D"
            : "S";

    const sections =
        Number(getState("NUM_OF_SEC")) || 0;

    const centerHingeQty =
        Number(getState("CENTER_HINGE_QTY")) || 1;

    const trussQty =
        Number(getState("TRUSS_QTY")) || 0;

    const trussFlag =
        trussQty === 0 ? "0" : "1";

    return `P${model}${endCode}${sections}${centerHingeQty}${trussFlag}`;
}

function getOnDoorWeight() {

    const code = getOnDoorCode();

    const ON_DOOR_WEIGHTS = {

        PDS410: 11.697,
        PAS411: 11.745,
        PQS411: 11.697,

        CAS410: 11.697,
        CAS411: 11.745,
        CAS412: 11.793,
        CAS414: 11.889,

        CAD310: 13.939,
        CAD311: 13.987,
        CAD312: 14.035,
        CAD313: 14.083,

        CAD320: 14.723,
        CAD321: 14.771,
        CAD322: 14.819,
        CAD323: 14.867,

        CAD330: 15.507,
        CAD331: 15.555,
        CAD332: 15.603,
        CAD333: 15.651,

        CAD340: 16.291,
        CAD341: 16.339,
        CAD342: 16.387,
        CAD343: 16.435
    };

    return ON_DOOR_WEIGHTS[code] || 0;
}

function getTrussWeight() {

    const widthInches =
        (Number(getState("DOOR_WIDTH_FEET")) || 0) * 12;

    const trussQty =
        Number(getState("TRUSS_QTY")) || 0;

    const factor =
        widthInches > 194.95
            ? 1.15
            : 0.82;

    return (
        ((widthInches - 1) / 12) *
        trussQty *
        factor
    );
}

function getSpringingWeight() {

    const doorWeight = getDoorWeight();   // AI
    const onDoorWeight = getOnDoorWeight(); // AO
    const trussWeight = getTrussWeight(); // AM

    const totalWeight =
        doorWeight +
        onDoorWeight +
        trussWeight;

    $("#v").val(
        `Total: ${totalWeight.toFixed(2)} ` +
        `Door: ${doorWeight.toFixed(2)} ` +
        `OnDoor: ${onDoorWeight.toFixed(2)} ` +
        `Truss: ${trussWeight.toFixed(2)}`
    );

    return totalWeight;
}
