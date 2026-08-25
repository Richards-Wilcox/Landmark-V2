const BUNDLES = [
    { sb: "SB1_SPNUM", scs: ["BUNDLE1_SC1_SPNUM", "BUNDLE1_SC2_SPNUM"] },
    { sb: "SB2_SPNUM", scs: ["BUNDLE2_SC1_SPNUM", "BUNDLE2_SC2_SPNUM"] },
    { sb: "SB3_SPNUM", scs: ["BUNDLE3_SC1_SPNUM", "BUNDLE3_SC2_SPNUM"] },
    { sb: "SB4_SPNUM", scs: ["BUNDLE4_SC1_SPNUM", "BUNDLE4_SC2_SPNUM"] },
    { sb: "SB5_SPNUM", scs: ["BUNDLE5_SC1_SPNUM"] },
    { sb: "SB6_SPNUM", scs: ["BUNDLE6_SC1_SPNUM"] },
    { sb: "SB7_SPNUM", scs: ["BUNDLE7_SC1_SPNUM"] },
    { sb: "SB8_SPNUM", scs: ["BUNDLE8_SC1_SPNUM"] },
    { sb: "SB9_SPNUM", scs: ["BUNDLE9_SC1_SPNUM"] }
];


const liteCodeMap = {
    "colonial": "C",
    "ranch": "R",
    "slim_single": "S",
    "slim_double": "L"
};

const glazingHooks = [
    "FACE",
    "EXTERIOR_FRAME_1",
    "EXTERIOR_FRAME_2",
    "WINDOW_1",
    "WINDOW_2",
    "INTERIOR_FRAME_1",
    "INTERIOR_FRAME_2",
    "INSERT_1",
    "INSERT_2",
    "SCREWS",
    "PANEL_SPACING",
    "GLASS_SHAPE",
    "WINDOW_POSITION",
    "GLASS_TYPE",
    "GLASS_INSERT",
    "GLASS_TEMPERED",
    "WINDOW_STATE",
    "DESIGN_CODE"
];

const GLASS_QTY_NODE_DEPS = [
    "GLASS_QTY_B1_SC1",
    "GLASS_QTY_B1_SC1_TEMP_OR_MIXED",
    "GLASS_QTY_B1_SC2",
    "GLASS_QTY_B1_SC2_TEMP_OR_MIXED",

    "GLASS_QTY_B2_SC1",
    "GLASS_QTY_B2_SC1_TEMP_OR_MIXED",
    "GLASS_QTY_B2_SC2",
    "GLASS_QTY_B2_SC2_TEMP_OR_MIXED",

    "GLASS_QTY_B3_SC1",
    "GLASS_QTY_B3_SC1_TEMP_OR_MIXED",
    "GLASS_QTY_B3_SC2",
    "GLASS_QTY_B3_SC2_TEMP_OR_MIXED",

    "GLASS_QTY_B4_SC1",
    "GLASS_QTY_B4_SC1_TEMP_OR_MIXED",
    "GLASS_QTY_B4_SC2",
    "GLASS_QTY_B4_SC2_TEMP_OR_MIXED",

    "GLASS_QTY_B5_SC1",
    "GLASS_QTY_B5_SC1_TEMP_OR_MIXED",

    "GLASS_QTY_B6_SC1",
    "GLASS_QTY_B6_SC1_TEMP_OR_MIXED",

    "GLASS_QTY_B7_SC1",
    "GLASS_QTY_B7_SC1_TEMP_OR_MIXED",

    "GLASS_QTY_B8_SC1",
    "GLASS_QTY_B8_SC1_TEMP_OR_MIXED",

    "GLASS_QTY_B9_SC1",
    "GLASS_QTY_B9_SC1_TEMP_OR_MIXED"
];

// const GLZ_DEPS = [
//     "WINDOW_POSITION",
//     "GLAZING_CODE",
//     "WINDOW_1", "WINDOW_1_QTY",
//     "HEIGHT", "WIDTH", "NUM_OF_SEC", "LITE_LOCATION",
//     "GLASS_TEMPERED"
// ];

const GLZ_DEPS = [
    "WINDOW_POSITION",
    "WINDOW_1",
    "WINDOW_2",
    "WINDOW_1_QTY",
    "WINDOW_2_QTY",
    "HEIGHT",
    "WIDTH",
    "NUM_OF_SEC",
    "LITE_LOCATION",
    "GLASS_TEMPERED",
    "GLASS_INSERT",
    "INSERT_1",
    "INSERT_2",
    "EXTERIOR_FRAME_1",
    "EXTERIOR_FRAME_2",
    "INTERIOR_FRAME_1",
    "INTERIOR_FRAME_2",
    "SCREWS",
    "FACE",
    "GLASS_SHAPE",
    "GLASS_TYPE",
    "DESIGN_CODE",
    "WINDOW_STATE",
    ...GLASS_QTY_NODE_DEPS
];

const DEBUG = false;
var glassMapperRunning = false;

const SECTION_RLL_VALUES = [];
const RLL_CACHE_BY_SMARTCOM = {};


function logDebug() {
    if (DEBUG) {
        console.log.apply(console, arguments);
    }
}

function hasLiteInputsReady(requireGlassType) {
    const width = getState("WIDTH");
    const panel_style = getState("FACE");
    const glass_shape = getState("GLASS_SHAPE") || "";
    const glass_type = getState("GLASS_TYPE") || "";

    if (!width || !panel_style) return false;
    if (!glass_shape) return false;
    if (requireGlassType && !glass_type) return false;
    return true;
}

function getLiteCacheKey(width, panel_style, glass_shape, spacing) {
    return `${width}|${panel_style}|${glass_shape}|${spacing}`;
}

function addGlazingCodeLogic() {
    // Generate all 9 sections   
    addLogic("DOOR_THICKNESS", function () {
        let door_model = getState("LM_DOOR_MODEL");
        const thicknessMap = {
            "L138": 1.375,
            "L138C": 1.375,
            "S160": 1.60,
            "L200": 2.00,
            "L200C": 2.00,
            "L200GV": 2.00,
            "L200BC": 2.00
        };

        this.value = thicknessMap[door_model] || 0;
    }, ["DOOR_MODEL"])

    addLogic("WINDOW_1_QTY", function () {
        const glass_shape = getState("GLASS_SHAPE") || "";
        const glass_type = getState("GLASS_TYPE") || "";
        const window_pos = getState("WINDOW_POSITION");
        const sections = getSectionInfo();
        const temp_glass = getState("GLASS_TEMPERED");
        const face = getState("FACE");

        if (face === "M") {
            const pattern = getNode("DESIGN_CODE").getAttribute("pattern");
            const counts = countMixedPanelStyles(pattern);
            this.value = counts.C;
            return;
        }


        if ((!glass_shape || !glass_type)) {
            this.value = 0;
            return;
        }

        if (getDoorInfo().custom_windows === false && !glass_shape.includes("slim")) {
            if (window_pos === 'top') {
                this.value = computeValue("lites");
            }
        }

        if (getDoorInfo().custom_windows === true && !glass_shape.includes("slim")) {
            const onlyLastHasGlass =
                sections[sections.length - 1].glass_qty > 0 &&
                sections.slice(0, -1).every(s => s.glass_qty === 0);
            if (onlyLastHasGlass) {
                this.value = sections[sections.length - 1].glass_qty;
            }
            else {
                this.value = "";
            }
        }
    }, ["WIDTH", "FACE", "GLASS_SHAPE", "GLASS_TYPE", "PANEL_SPACING", "GLASS_TEMPERED", "DESIGN_CODE"]);

    addLogic("WINDOW_2_QTY", function () {
        const face = getState("FACE");
        if (face === "M") {
            const pattern = getNode("DESIGN_CODE").getAttribute("pattern");
            const counts = countMixedPanelStyles(pattern);
            this.value = counts.R;
            return;
        } else this.value = 0;

    }, ["FACE", "DESIGN_CODE"]);

    addLogic("CENTER_HINGE_QTY", function () {
        this.value = getState("CENTER_HINGE_CODE");
    }, ["CENTER_HINGE_CODE"])

    addLogic("LITE_LOCATION", function () {
        const glass_shape = getState("GLASS_SHAPE") || "";
        const window_1_qty = getState("WINDOW_1_QTY") || 0;
        const liteCode = liteCodeMap[glass_shape] ?? "";
        const sections = getSectionInfo();
        const window_pos = getState("WINDOW_POSITION");

        // Standard logic
        if (getDoorInfo().custom_windows === false && !glass_shape.includes("slim")) {
            if (window_pos === 'top') {
                const window_1_qty = getState("WINDOW_1_QTY") || 0;
                this.value = liteCode.repeat(window_1_qty);
                return;
            }
        }

        // Custom windows logic      
        if (getDoorInfo().custom_windows === true && !glass_shape.includes("slim")) {
            const onlyLastHasGlass =
                sections[sections.length - 1].glass_qty > 0 &&
                sections.slice(0, -1).every(s => s.glass_qty === 0); // check if top section is selected only in custom window
            if (onlyLastHasGlass) {
                const enabled = sections[sections.length - 1].enabled || [];
                this.value = enabled
                    .map(v => v ? liteCode : "0")
                    .join("");
            } else {
                this.value = "";
            }
        }
    }, ["WINDOW_1_QTY", "GLASS_SHAPE"])

    addLogic("INSERT_1_QTY", function () {
        const glass_insert = getState("GLASS_INSERT");
        if (!glass_insert || glass_insert === "") {
            this.value = "0";
            return;
        }

        if (!hasLiteInputsReady(false)) {
            this.value = 0;
            return;
        }

        this.value = computeValue("lites");
    }, ["WIDTH", "FACE", "GLASS_INSERT", "GLASS_SHAPE", "PANEL_SPACING"]);

    addLogic("INSERT_2_QTY", function () {
        this.value = 0; //use only when mix panel is selected
    }, ["FACE"])

    // addLogic("GLAZING_CODE", function () {
    //     const glassShape = getState("GLASS_SHAPE");
    //     let face = getState("FACE");
    //     let window_1 = getState("WINDOW_1");
    //     let window_2 = getState("WINDOW_2");
    //     let mixedPanelGlassKey = '';

    //     if (!glassShape && face !== 'M') {
    //         this.value = "";
    //         return;
    //     }

    //     if (face !== 'M') {
    //         this.value = generateGlazingCodeString("WINDOW_1");
    //     } else {
    //         mixedPanelGlassKey = `${window_1},${window_2}`;
    //         this.value = generateGlazingCodeString(mixedPanelGlassKey);
    //     }
    // }, [glazingHooks]);

    // addLogic("GLAZING_CODE_TEMP", function () {


    //     const tempGlass = getState("GLASS_TEMPERED");

    //     if (!tempGlass) {
    //         this.value = "";
    //         return;
    //     }

    //     this.value = generateGlazingCodeString("WINDOW_2");


    // }, [glazingHooks, "GLASS_TEMPERED"]);


    addNode({
        id: "NO_GLAZING_CODE",
        value: "",
        logic: function () {
            this.value = "0,0,0,0,0,0,0,0,0,0";
        }
    }, [""])

    addLogic("SECTION_01_SMARTCOM_CODE", createSmartcomLogic("SECTION_01"), ["SECTION_01", "FACE", "PANEL_SPACING", "CENTER_HINGE_CODE", "DRILL", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "GLASS_SHAPE"]);

    addLogic("SECTION_02_SMARTCOM_CODE", createSmartcomLogic("SECTION_02"), ["SECTION_02", "FACE", "PANEL_SPACING", "CENTER_HINGE_CODE", "DRILL", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "GLASS_SHAPE"]);

    addLogic("SECTION_03_SMARTCOM_CODE", createSmartcomLogic("SECTION_03"), ["SECTION_03", "FACE", "PANEL_SPACING", "CENTER_HINGE_CODE", "DRILL", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "GLASS_SHAPE"]);

    addLogic("SECTION_04_SMARTCOM_CODE", createSmartcomLogic("SECTION_04"), ["SECTION_04", "FACE", "PANEL_SPACING", "CENTER_HINGE_CODE", "DRILL", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "GLASS_SHAPE"]);

    addLogic("SECTION_05_SMARTCOM_CODE", createSmartcomLogic("SECTION_05"), ["SECTION_05", "FACE", "PANEL_SPACING", "CENTER_HINGE_CODE", "DRILL", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "GLASS_SHAPE"]);

    addLogic("SECTION_06_SMARTCOM_CODE", createSmartcomLogic("SECTION_06"), ["SECTION_06", "FACE", "PANEL_SPACING", "CENTER_HINGE_CODE", "DRILL", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "GLASS_SHAPE"]);

    addLogic("SECTION_07_SMARTCOM_CODE", createSmartcomLogic("SECTION_07"), ["SECTION_07", "FACE", "PANEL_SPACING", "CENTER_HINGE_CODE", "DRILL", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "GLASS_SHAPE"]);

    addLogic("SECTION_08_SMARTCOM_CODE", createSmartcomLogic("SECTION_08"), ["SECTION_08", "FACE", "PANEL_SPACING", "CENTER_HINGE_CODE", "DRILL", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "GLASS_SHAPE"]);

    addLogic("SECTION_09_SMARTCOM_CODE", createSmartcomLogic("SECTION_09"), ["SECTION_09", "FACE", "PANEL_SPACING", "CENTER_HINGE_CODE", "DRILL", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "GLASS_SHAPE"]);

    addLogic("GLZ_CODE_SECTION_01", function () {
        this.value = buildGlzCode(1);
    }, GLZ_DEPS);

    addLogic("GLZ_CODE_SECTION_02", function () {
        this.value = buildGlzCode(2);
    }, GLZ_DEPS);

    addLogic("GLZ_CODE_SECTION_03", function () {
        this.value = buildGlzCode(3);
    }, GLZ_DEPS);

    addLogic("GLZ_CODE_SECTION_04", function () {
        this.value = buildGlzCode(4);
    }, GLZ_DEPS);

    addLogic("GLZ_CODE_SECTION_05", function () {
        this.value = buildGlzCode(5);
    }, GLZ_DEPS);

    addLogic("GLZ_CODE_SECTION_06", function () {
        this.value = buildGlzCode(6);
    }, GLZ_DEPS);

    addLogic("GLZ_CODE_SECTION_07", function () {
        this.value = buildGlzCode(7);
    }, GLZ_DEPS);

    addLogic("GLZ_CODE_SECTION_08", function () {
        this.value = buildGlzCode(8);
    }, GLZ_DEPS);

    addLogic("GLZ_CODE_SECTION_09", function () {
        this.value = buildGlzCode(9);
    }, GLZ_DEPS);

    addLogic("CNC_SECTION_01", function () {
        const glz = getState("GLZ_CODE_SECTION_01");
        this.value = glz ? buildCncCode(1) : "";
    }, ["GLZ_CODE_SECTION_01", "SECTION_01_SMARTCOM_CODE"]);

    addLogic("CNC_SECTION_02", function () {
        const glz = getState("GLZ_CODE_SECTION_02");
        this.value = glz ? buildCncCode(2) : "";
    }, ["GLZ_CODE_SECTION_02", "SECTION_02_SMARTCOM_CODE"]);

    addLogic("CNC_SECTION_03", function () {
        const glz = getState("GLZ_CODE_SECTION_03");
        this.value = glz ? buildCncCode(3) : "";
    }, ["GLZ_CODE_SECTION_03", "SECTION_03_SMARTCOM_CODE"]);

    addLogic("CNC_SECTION_04", function () {
        const glz = getState("GLZ_CODE_SECTION_04");
        this.value = glz ? buildCncCode(4) : "";
    }, ["GLZ_CODE_SECTION_04", "SECTION_04_SMARTCOM_CODE"]);

    addLogic("CNC_SECTION_05", function () {
        const glz = getState("GLZ_CODE_SECTION_05");
        this.value = glz ? buildCncCode(5) : "";
    }, ["GLZ_CODE_SECTION_05", "SECTION_05_SMARTCOM_CODE"]);

    addLogic("CNC_SECTION_06", function () {
        const glz = getState("GLZ_CODE_SECTION_06");
        this.value = glz ? buildCncCode(6) : "";
    }, ["GLZ_CODE_SECTION_06", "SECTION_06_SMARTCOM_CODE"]);

    addLogic("CNC_SECTION_07", function () {
        const glz = getState("GLZ_CODE_SECTION_07");
        this.value = glz ? buildCncCode(7) : "";
    }, ["GLZ_CODE_SECTION_07", "SECTION_07_SMARTCOM_CODE"]);

    addLogic("CNC_SECTION_08", function () {
        const glz = getState("GLZ_CODE_SECTION_08");
        this.value = glz ? buildCncCode(8) : "";
    }, ["GLZ_CODE_SECTION_08", "SECTION_08_SMARTCOM_CODE"]);

    addLogic("CNC_SECTION_09", function () {
        const glz = getState("GLZ_CODE_SECTION_09");
        this.value = glz ? buildCncCode(9) : "";
    }, ["GLZ_CODE_SECTION_09", "SECTION_09_SMARTCOM_CODE"]);

    addLogic("PUNCH_CODE_SECTION_01", function () {
        setPunchCode.call(this, 1);
    }, ["HEIGHT", "WIDTH", "NUM_OF_SEC", "WINDOW_POSITION", "GLASS_SHAPE"]);

    addLogic("PUNCH_CODE_SECTION_02", function () {
        setPunchCode.call(this, 2);
    }, ["HEIGHT", "WIDTH", "NUM_OF_SEC", "WINDOW_POSITION", "GLASS_SHAPE"]);

    addLogic("PUNCH_CODE_SECTION_03", function () {
        setPunchCode.call(this, 3);
    }, ["HEIGHT", "WIDTH", "NUM_OF_SEC", "WINDOW_POSITION", "GLASS_SHAPE"]);

    addLogic("PUNCH_CODE_SECTION_04", function () {
        setPunchCode.call(this, 4);
    }, ["HEIGHT", "WIDTH", "NUM_OF_SEC", "WINDOW_POSITION", "GLASS_SHAPE"]);

    addLogic("PUNCH_CODE_SECTION_05", function () {
        setPunchCode.call(this, 5);
    }, ["HEIGHT", "WIDTH", "NUM_OF_SEC", "WINDOW_POSITION", "GLASS_SHAPE"]);

    addLogic("PUNCH_CODE_SECTION_06", function () {
        setPunchCode.call(this, 6);
    }, ["HEIGHT", "WIDTH", "NUM_OF_SEC", "WINDOW_POSITION", "GLASS_SHAPE"]);

    addLogic("PUNCH_CODE_SECTION_07", function () {
        setPunchCode.call(this, 7);
    }, ["HEIGHT", "WIDTH", "NUM_OF_SEC", "WINDOW_POSITION", "GLASS_SHAPE"]);

    addLogic("PUNCH_CODE_SECTION_08", function () {
        setPunchCode.call(this, 8);
    }, ["HEIGHT", "WIDTH", "NUM_OF_SEC", "WINDOW_POSITION", "GLASS_SHAPE"]);

    addLogic("PUNCH_CODE_SECTION_09", function () {
        setPunchCode.call(this, 9);
    }, ["HEIGHT", "WIDTH", "NUM_OF_SEC", "WINDOW_POSITION", "GLASS_SHAPE"]);
}

function setPunchCode(sectionNumber) {
    const enabledArr =
        getSectionInfo()[sectionNumber - 1]?.enabled || [];
    const punchCode = enabledArr
        .slice()
        .reverse()
        .map(v => v ? 0 : 1);
    this.value = punchCode.join("");
}

function setGlassQtyToSCInputs() {
    // Bottom -> Top order
    var sections = getDoorInfo().sections.slice().reverse();

    var bundles = getBundles();
    // Reset all fields
    BUNDLES.forEach(function (bundle, bIndex) {

        bundle.scs.forEach(function (scKey, scIndex) {

            var field =
                "GLASS_QTY_B" +
                (bIndex + 1) +
                "_SC" +
                (scIndex + 1);

            if (getNode(field)) {
                setState(field, 0);
            }
        });
    });

    // Map glass qty to bundle slots
    bundles.forEach(function (bundle, bundleIndex) {

        var sortedIndexes = bundle.indexes
            .slice()
            .sort(function (a, b) {
                return a - b;
            });

        for (var i = 0; i < sortedIndexes.length; i++) {

            var sectionIndex = sortedIndexes[i] - 1;

            var section = sections[sectionIndex];

            var qty = Number(section?.glass_qty) || 0;

            var field =
                "GLASS_QTY_B" +
                (bundleIndex + 1) +
                "_SC" +
                (i + 1);



            if (getNode(field)) {

                if (getState(field) !== qty) {
                    setState(field, qty);
                }
            }
        }
    });


}

// function buildGlzCode(sectionIndex) {
//     const window_position = getState("WINDOW_POSITION");
//     const glazing_code = getState("GLAZING_CODE");
//     const no_glz_code = getState("NO_GLAZING_CODE");
//     const total_sections = getState("NUM_OF_SEC") || 0;

//     if (!window_position) return "";

//     const slot = getScForSection(sectionIndex);
//     console.log("slot", slot);
//     if (!slot) return "";

//     const sb_part_no = getState(slot.sb);
//     const sc_part_no = getState(slot.sc);

//     if (!sc_part_no || sc_part_no === "None" || sc_part_no === "") return "";

//     const panel_identity = `SB-INT${sc_part_no.slice(-2)}`;
//     const sc_panel_index = parseInt(sc_part_no.slice(-1));  // e.g. 1, 2, 3, 4

//     // This SC is the top section if its panel index matches total sections
//     const isTopSection = sc_panel_index === parseInt(total_sections);

//     // Section 1 is always bottom
//     if (sectionIndex === 1) {
//         return window_position === "top"
//             ? `${sb_part_no},SB-BTM,${sc_part_no},${no_glz_code}`
//             : `${sb_part_no},SB-BTM,${sc_part_no},${glazing_code}`;
//     }

//     // All other sections
//     if (window_position === "top") {
//         // Only the SC whose panel index matches total sections gets glazing_code
//         return isTopSection
//             ? getGlazingCode(sb_part_no, panel_identity, sc_part_no, glazing_code)
//             : getGlazingCode(sb_part_no, panel_identity, sc_part_no, no_glz_code);
//     }

//     return getGlazingCode(sb_part_no, panel_identity, sc_part_no, glazing_code);
// }

function getAllSCs() {
    return BUNDLES
        .flatMap(bundle => bundle.scs)
        .map(key => getState(key))
        .filter(sc => sc && sc !== "None");
}


function getMatchingSC(sectionIndex) {
    for (const bundle of BUNDLES) {
        for (const scKey of bundle.scs) {
            const scVal = getState(scKey);

            if (scVal && parseInt(scVal.slice(-2)) === sectionIndex) {
                return {
                    sc_part_no: scVal,
                    sc_key: scKey,
                    sb_part_no: getState(bundle.sb),

                    // ✅ determine height key
                    height_key: scKey.includes("SC1")
                        ? scKey.replace("SPNUM", "HEIGHT")
                        : scKey.replace("SPNUM", "HEIGHT")
                };
            }
        }
    }

    return null;
}


function findSBForSC(sc_part_no) {
    for (const bundle of BUNDLES) {
        for (const scKey of bundle.scs) {
            if (getState(scKey) === sc_part_no) {
                return getState(bundle.sb);
            }
        }
    }
    return "";
}

// function buildGlzCode(sectionIndex, temp_glass_flg) {
//     const window_position = getState("WINDOW_POSITION");
//     const glazing_code = getState("GLAZING_CODE");
//     const no_glz_code = getState("NO_GLAZING_CODE");
//     const glazing_code_temp = getState("GLAZING_CODE_TEMP");
//     const total_sections = Number(getState("NUM_OF_SEC")) || 0;
//     const temp_glass = getState("GLASS_TEMPERED");
//     const glass_shape = getState("GLASS_SHAPE");

//     if (!glass_shape) return "";

//     const sections = getSectionInfo();

//     // ✅ Get enabled array for correct section
//     const enabledArr =
//         Array.isArray(sections[sectionIndex - 1]?.enabled)
//             ? sections[sectionIndex - 1].enabled
//             : [];

//     const allSCs = getAllSCs();

//     // ✅ Match SC by last 2 digits
//     const sc_part_no = allSCs.find(sc =>
//         parseInt(sc.slice(-2)) === sectionIndex
//     );

//     if (!sc_part_no) return "";

//     const sb_part_no = findSBForSC(sc_part_no);
//     if (!sb_part_no) return "";

//     const panel_identity = `SB-INT${sc_part_no.slice(-2)}`;
//     const isTopSection = sectionIndex === total_sections;

//     let finalCode = glazing_code; // default


//     // ✅ CORE LOGIC USING enabledArr
//     const hasAnyEnabled = enabledArr.some(v => v === true);
//     const allDisabled = enabledArr.every(v => v === false);

//     if (allDisabled) {
//         finalCode = no_glz_code;
//     } else {
//         if (temp_glass === "all") {
//             finalCode = glazing_code_temp;
//         }
//         else if (temp_glass === "bottom_1" && sectionIndex === 1) {
//             finalCode = glazing_code_temp;
//         }
//         else if (temp_glass === "bottom_2" && (sectionIndex === 1 || sectionIndex === 2)) {
//             finalCode = glazing_code_temp;
//         }
//         else {
//             finalCode = glazing_code;
//         }
//     }

//     return getGlazingCode(
//         sb_part_no,
//         panel_identity,
//         sc_part_no,
//         finalCode
//     );

// }

function buildGlzCode(sectionIndex) {
    const no_glz_code = getState("NO_GLAZING_CODE");
    const temp_glass = getState("GLASS_TEMPERED");
    const glass_shape = getState("GLASS_SHAPE") || "";
    const face = getState("FACE");

    if (!glass_shape && face !== "M") {
        return "";
    }

    const sections = getSectionInfo();

    const section =
        sections[sectionIndex - 1] || {};

    const enabledArr =
        Array.isArray(section.enabled)
            ? section.enabled
            : [];

    const allDisabled =
        enabledArr.length === 0 ||
        enabledArr.every(v => v === false);

    const allSCs = getAllSCs();

    const sc_part_no = allSCs.find(sc =>
        parseInt(sc.slice(-2), 10) === sectionIndex
    );

    if (!sc_part_no) {
        return "";
    }

    const sb_part_no = findSBForSC(sc_part_no);

    if (!sb_part_no) {
        return "";
    }

    const match = getMatchingSC(sectionIndex);

    if (!match) {
        return "";
    }

    const panel_identity = `SB-INT${sc_part_no.slice(-2)}`;

    let finalCode = "";

    if (allDisabled) {
        finalCode = no_glz_code;
    }

    else if (face === "M") {
        const mixedPanelGlassValue = [
            getState("WINDOW_1"),
            getState("WINDOW_2")
        ].join(",");

        finalCode = generateGlazingCodeString("WINDOW_1", {
            scKey: match.sc_key,
            glassValue: mixedPanelGlassValue
        });
    }

    else if (
        temp_glass === "all" ||
        (temp_glass === "bottom_1" && sectionIndex === 1) ||
        (temp_glass === "bottom_2" && (sectionIndex === 1 || sectionIndex === 2))
    ) {
        finalCode = generateGlazingCodeString("WINDOW_2", {
            scKey: match.sc_key,
            useTempQty: true
        });
    }

    else {
        finalCode = generateGlazingCodeString("WINDOW_1", {
            scKey: match.sc_key,
            useTempQty: false
        });
    }

    return getGlazingCode(
        sb_part_no,
        panel_identity,
        sc_part_no,
        finalCode
    );
}

function getTopSectionIndex() {
    const sections = getSectionBundle();
    return sections.length;
}

function getGlazingCode(sb_part_no, panel_identity, sc_part_no, glazing_code) {
    // return `${sb_part_no},${panel_identity},${sc_part_no},${glazing_code}`;
    return `${sb_part_no},${sc_part_no},${glazing_code}`;
}

function createSmartcomLogic(sectionField) {
    return function () {
        var sectionValue = getState(sectionField);
        var panel_style = getState("FACE");
        var panel_spacing = getState("PANEL_SPACING");
        var hinge_code = getState("CENTER_HINGE_CODE");
        var drill_code = getState("DRILL");
        var width_ft = getState("DOOR_WIDTH_FEET");
        var width_inch = getState("DOOR_WIDTH_INCHES");
        let custom_window = getDoorInfo().custom_windows;
        let window_position = getState("WINDOW_POSITION");
        let glass_shape = getState("GLASS_SHAPE");
        let design_code = getState("DESIGN_CODE");

        let prefix = '';
        let panel_code = '';

        if (panel_style === "F" || panel_style === "V") {
            if (custom_window === true || window_position === 'top') {
                prefix = liteCodeMap[glass_shape] ?? "";
            }

            if (glass_shape.includes("slim")) {
                prefix = liteCodeMap[glass_shape] ?? "";
            }
        } else prefix = panel_style;

        if (panel_style === "M") {
            panel_code = design_code;
        } else panel_code = panel_spacing;

        var code = prefix + panel_code + hinge_code + "S" + drill_code + "-" + width_ft + width_inch;

        // ✅ Apply rule
        if (sectionValue !== "" && sectionValue !== null && sectionValue !== undefined) {
            this.value = code;       // ✅ filled
        } else {
            this.value = "";         // ✅ empty
        }
    };
}

// function getCNCString(section_height, sc_part_no, sectionIndex) {
//     try {
//         const MAX_WINDOWS = 10;

//         const LOC_Y_MAP = {
//             24: 12.0,
//             21: 10.5,
//             18: 9.0
//         };

//         const widthMap = {
//             colonial: 18.8125,
//             ranch: 41.6875,
//             slim_single: 34.469,
//             slim_double: 68.469,
//         };

//         const heightMap = {
//             colonial: 13.625,
//             ranch: 13.625,
//             slim_single: 6.594,
//             slim_double: 6.594,
//         };

//         const shapeCodeMap = {
//             ranch: "R",
//             colonial: "C",
//             slim_single: "S",
//             slim_double: "L"
//         };


//         const door_thickness = getState("DOOR_THICKNESS");
//         // const lite_location = getState("LITE_LOCATION");
//         const rp_width = Number(getState("WIDTH")) || 0;
//         const glass_shape = getState("GLASS_SHAPE");
//         const window_pos = getState("WINDOW_POSITION");

//         const liteCode = liteCodeMap[glass_shape] || "";
//         const sections = getSectionInfo();
//         const double_end_cap = getState("END_CAPS");


//         // ✅ Get enabled array for correct section
//         const enabledArr =
//             Array.isArray(sections[sectionIndex - 1]?.enabled)
//                 ? sections[sectionIndex - 1].enabled
//                 : [];

//         // 1 => R/C, 0 => 0
//         const punchCode = enabledArr
//             .slice()
//             .map(v => v ? liteCode : "0")
//             .join("");

//         // ✅ Get RLL values (1X → nX)
//         const sectionRLL =
//             SECTION_RLL_VALUES[sectionIndex - 1] || Array(15).fill(0);

//         // ✅ Apply enabled mask
//         const RLL = Array.from({ length: MAX_WINDOWS }, (_, i) => {
//             return enabledArr[i]
//                 ? Number(sectionRLL[i]) || 0
//                 : 0;
//         });

//         const num_of_windows = enabledArr.filter(v => v === true).length;

//         const location_y = LOC_Y_MAP[section_height] ?? 0;

//         const windowWidth = widthMap[glass_shape] || 0;
//         const windowheight = heightMap[glass_shape] || 0;
//         const slimOffset = shape =>
//             shape === "slim_single"
//                 ? (double_end_cap === "Y" ? 25 : 22)
//                 : (double_end_cap === "Y" ? 42 : 39);

//         const WIDTHS = enabledArr.map(v => v ? windowWidth : 0);
//         const HEIGHTS = enabledArr.map(v => v ? windowheight : 0);
//         const LOC_Y = enabledArr.map(v => v ? location_y : 0);

//         const WC = enabledArr.map(enabled =>
//             enabled ? shapeCodeMap[glass_shape] : 0
//         );

//         let cnc = `${sc_part_no},${door_thickness},${punchCode},${rp_width},${section_height},LR`;

//         cnc += "," + Array(14).fill(0).join(",");
//         cnc += `,${num_of_windows}`;

//         const appendSlimWindows = (locXValues, useDecimals = true) => {

//             let liteIndex = 0;

//             for (let i = 0; i < MAX_WINDOWS; i++) {

//                 if (!enabledArr[i]) {
//                     cnc += ",0,0,0,0,0";
//                     continue;
//                 }

//                 const locX = locXValues[liteIndex++];

//                 cnc += `,${WC[i]},${windowWidth},${windowheight},${useDecimals
//                     ? Number(locX).toFixed(2)
//                     : locX
//                     },${location_y}`;
//             }
//         };

//         const buildLocXValues = (firstCenterLine, spacing, qty) => {

//             const values = [];

//             let centerLine = firstCenterLine;

//             for (let i = 0; i < qty; i++) {

//                 values.push(
//                     Number(centerLine.toFixed(2))
//                 );

//                 centerLine += spacing;
//             }

//             return values.reverse();
//         };

//         if (glass_shape.includes("slim")) { // slim logic
//             const custom_windows = getState("CUSTOM_WINDOWS");
//             const section = sections[sectionIndex - 1] || {};
//             const windowQty = section.max_window_qty;

//             if (custom_windows) {

//                 if (section.slim_one) {

//                     const offset = slimOffset(section.shape);

//                     const windowIndex =
//                         enabledArr.findIndex(v => v);

//                     let slim_loc_x;

//                     if (windowIndex === 1) {

//                         slim_loc_x = rp_width / 2;

//                     } else if (windowIndex === 0) {

//                         slim_loc_x = rp_width - offset;

//                     } else {

//                         slim_loc_x = offset;
//                     }

//                     appendSlimWindows(
//                         [slim_loc_x],
//                         false
//                     );
//                 }

//                 else if (section.slim_spacing === "even") {

//                     const offset =
//                         (rp_width - (windowQty * windowWidth))
//                         / (windowQty + 1);

//                     const firstCenterLine =
//                         offset + (windowWidth / 2);

//                     const spacing =
//                         offset + windowWidth;

//                     appendSlimWindows(
//                         buildLocXValues(
//                             firstCenterLine,
//                             spacing,
//                             windowQty
//                         )
//                     );
//                 }

//                 else if (section.slim_spacing === "fixed") {

//                     const F =
//                         getState("END_CAPS") === "N"
//                             ? 4.8125
//                             : 7.8125;

//                     const firstCenterLine =
//                         F + (windowWidth / 2);

//                     const spacing =
//                         (rp_width - (2 * firstCenterLine))
//                         / (windowQty - 1);

//                     appendSlimWindows(
//                         buildLocXValues(
//                             firstCenterLine,
//                             spacing,
//                             windowQty
//                         )
//                     );
//                 }
//             }

//             else { // slim default selected option

//                 const offset = slimOffset(glass_shape);

//                 if (window_pos === "both") {

//                     const firstIndex = enabledArr.indexOf(true);
//                     const lastIndex = enabledArr.lastIndexOf(true);

//                     for (let i = 0; i < MAX_WINDOWS; i++) {

//                         if (i === firstIndex) {

//                             cnc += `,${WC[i]},${windowWidth},${windowheight},${rp_width - offset},${location_y}`;

//                         } else if (i === lastIndex && firstIndex !== lastIndex) {

//                             cnc += `,${WC[i]},${windowWidth},${windowheight},${offset},${location_y}`;

//                         } else {

//                             cnc += ",0,0,0,0,0";
//                         }
//                     }

//                 } else {

//                     let slim_loc_x;

//                     if (window_pos === "center") {

//                         slim_loc_x = rp_width / 2;

//                     } else {

//                         slim_loc_x =
//                             window_pos === "left"
//                                 ? rp_width - offset
//                                 : offset;
//                     }

//                     const windowIndex = enabledArr.findIndex(v => v);

//                     cnc += `,${WC[windowIndex]},${windowWidth},${windowheight},${slim_loc_x},${location_y}`;

//                     for (let i = 1; i < MAX_WINDOWS; i++) {
//                         cnc += ",0,0,0,0,0";
//                     }
//                 }
//             }
//         }
//         else { // non-slim logic
//             for (let i = 0; i < MAX_WINDOWS; i++) {

//                 if (enabledArr[i]) {
//                     cnc += `,${WC[i]},${WIDTHS[i]},${HEIGHTS[i]},${RLL[i]},${LOC_Y[i]}`;
//                 } else {
//                     cnc += `,0,0,0,0,0`;
//                 }
//             }
//         }

//         return cnc;

//     } catch (err) {
//         console.error("ERROR in getCNCString:", err);
//         return "";
//     }
// }

function getCNCString(section_height, sc_part_no, sectionIndex) {
    try {
        const MAX_WINDOWS = 10;

        const LOC_Y_MAP = {
            24: 12.0,
            21: 10.5,
            18: 9.0
        };

        const widthMap = {
            colonial: 18.8125,
            ranch: 41.6875,
            slim_single: 34.469,
            slim_double: 68.469
        };

        const heightMap = {
            colonial: 13.625,
            ranch: 13.625,
            slim_single: 6.594,
            slim_double: 6.594
        };

        const shapeCodeMap = {
            ranch: "R",
            colonial: "C",
            slim_single: "S",
            slim_double: "L"
        };

        const door_thickness = getState("DOOR_THICKNESS");
        const rp_width = Number(getState("WIDTH")) || 0;
        const glass_shape = getState("GLASS_SHAPE") || "";
        const face = getState("FACE");
        const window_pos = getState("WINDOW_POSITION");
        const double_end_cap = getState("END_CAPS");

        const isMixed = face === "M";

        const sections = getSectionInfo();
        const section = sections[sectionIndex - 1] || {};

        const enabledArr = Array.isArray(section.enabled)
            ? section.enabled
            : [];

        const mixedPanels = isMixed && Array.isArray(section.mixed_panels)
            ? section.mixed_panels
            : [];

        function getMixedPanelStyle(index) {
            return mixedPanels[index] && mixedPanels[index].style
                ? mixedPanels[index].style
                : "";
        }

        function getShapeForIndex(index) {
            if (!isMixed) {
                return glass_shape;
            }

            const mixedStyle = getMixedPanelStyle(index);

            if (mixedStyle === "C") {
                return "colonial";
            }

            if (mixedStyle === "R") {
                return "ranch";
            }

            return "";
        }

        function getCodeForIndex(index) {
            if (!enabledArr[index]) {
                return "0";
            }

            if (isMixed) {
                return getMixedPanelStyle(index) || "0";
            }

            return shapeCodeMap[glass_shape] || "0";
        }

        const punchCode = enabledArr
            .slice()
            .map(function (enabled, index) {
                return enabled ? getCodeForIndex(index) : "0";
            })
            .join("");

        const sectionRLL =
            SECTION_RLL_VALUES[sectionIndex - 1] || Array(15).fill(0);

        const RLL = Array.from({ length: MAX_WINDOWS }, function (_, index) {
            return enabledArr[index]
                ? Number(sectionRLL[index]) || 0
                : 0;
        });

        const num_of_windows = enabledArr.filter(function (value) {
            return value === true;
        }).length;

        const location_y = LOC_Y_MAP[section_height] || 0;

        const WIDTHS = Array.from({ length: MAX_WINDOWS }, function (_, index) {
            if (!enabledArr[index]) {
                return 0;
            }

            const shapeForIndex = getShapeForIndex(index);

            return widthMap[shapeForIndex] || 0;
        });

        const HEIGHTS = Array.from({ length: MAX_WINDOWS }, function (_, index) {
            if (!enabledArr[index]) {
                return 0;
            }

            const shapeForIndex = getShapeForIndex(index);

            return heightMap[shapeForIndex] || 0;
        });

        const LOC_Y = Array.from({ length: MAX_WINDOWS }, function (_, index) {
            return enabledArr[index] ? location_y : 0;
        });

        const WC = Array.from({ length: MAX_WINDOWS }, function (_, index) {
            if (!enabledArr[index]) {
                return 0;
            }

            return getCodeForIndex(index);
        });

        let cnc = `${sc_part_no},${door_thickness},${punchCode},${rp_width},${section_height},LR`;

        cnc += "," + Array(14).fill(0).join(",");
        cnc += `,${num_of_windows}`;

        function slimOffset(shape) {
            if (shape === "slim_single") {
                return double_end_cap === "Y" ? 25 : 22;
            }

            return double_end_cap === "Y" ? 42 : 39;
        }

        function appendSlimWindows(locXValues, useDecimals) {
            let liteIndex = 0;

            for (let index = 0; index < MAX_WINDOWS; index++) {
                if (!enabledArr[index]) {
                    cnc += ",0,0,0,0,0";
                    continue;
                }

                const locX = locXValues[liteIndex++];
                const shapeForIndex = getShapeForIndex(index);
                const windowWidth = widthMap[shapeForIndex] || 0;
                const windowHeight = heightMap[shapeForIndex] || 0;

                cnc += `,${WC[index]},${windowWidth},${windowHeight},${useDecimals
                    ? Number(locX).toFixed(2)
                    : locX
                    },${location_y}`;
            }
        }

        function buildLocXValues(firstCenterLine, spacing, qty) {
            const values = [];
            let centerLine = firstCenterLine;

            for (let index = 0; index < qty; index++) {
                values.push(Number(centerLine.toFixed(2)));
                centerLine += spacing;
            }

            return values.reverse();
        }

        /*
         * Slim logic only applies to non-mixed.
         * Mixed has no GLASS_SHAPE and should use the normal CNC loop.
         */
        if (!isMixed && glass_shape.includes("slim")) {
            const custom_windows = getState("CUSTOM_WINDOWS");
            const windowQty = section.max_window_qty;

            if (custom_windows) {
                if (section.slim_one) {
                    const offset = slimOffset(section.shape);

                    const windowIndex = enabledArr.findIndex(function (value) {
                        return value === true;
                    });

                    let slim_loc_x;

                    if (windowIndex === 1) {
                        slim_loc_x = rp_width / 2;
                    } else if (windowIndex === 0) {
                        slim_loc_x = rp_width - offset;
                    } else {
                        slim_loc_x = offset;
                    }

                    appendSlimWindows([slim_loc_x], false);
                } else if (section.slim_spacing === "even") {
                    const shapeForSlim = section.shape || glass_shape;
                    const windowWidth = widthMap[shapeForSlim] || 0;

                    const offset =
                        (rp_width - (windowQty * windowWidth)) /
                        (windowQty + 1);

                    const firstCenterLine =
                        offset + (windowWidth / 2);

                    const spacing =
                        offset + windowWidth;

                    appendSlimWindows(
                        buildLocXValues(
                            firstCenterLine,
                            spacing,
                            windowQty
                        ),
                        true
                    );
                } else if (section.slim_spacing === "fixed") {
                    const shapeForSlim = section.shape || glass_shape;
                    const windowWidth = widthMap[shapeForSlim] || 0;

                    const fixedOffset =
                        getState("END_CAPS") === "N"
                            ? 4.8125
                            : 7.8125;

                    const firstCenterLine =
                        fixedOffset + (windowWidth / 2);

                    const spacing =
                        (rp_width - (2 * firstCenterLine)) /
                        (windowQty - 1);

                    appendSlimWindows(
                        buildLocXValues(
                            firstCenterLine,
                            spacing,
                            windowQty
                        ),
                        true
                    );
                }
            } else {
                const offset = slimOffset(glass_shape);

                if (window_pos === "both") {
                    const firstIndex = enabledArr.indexOf(true);
                    const lastIndex = enabledArr.lastIndexOf(true);

                    for (let index = 0; index < MAX_WINDOWS; index++) {
                        const shapeForIndex = getShapeForIndex(index);
                        const windowWidth = widthMap[shapeForIndex] || 0;
                        const windowHeight = heightMap[shapeForIndex] || 0;

                        if (index === firstIndex) {
                            cnc += `,${WC[index]},${windowWidth},${windowHeight},${rp_width - offset},${location_y}`;
                        } else if (index === lastIndex && firstIndex !== lastIndex) {
                            cnc += `,${WC[index]},${windowWidth},${windowHeight},${offset},${location_y}`;
                        } else {
                            cnc += ",0,0,0,0,0";
                        }
                    }
                } else {
                    let slim_loc_x;

                    if (window_pos === "center") {
                        slim_loc_x = rp_width / 2;
                    } else {
                        slim_loc_x =
                            window_pos === "left"
                                ? rp_width - offset
                                : offset;
                    }

                    const windowIndex = enabledArr.findIndex(function (value) {
                        return value === true;
                    });

                    const shapeForIndex = getShapeForIndex(windowIndex);
                    const windowWidth = widthMap[shapeForIndex] || 0;
                    const windowHeight = heightMap[shapeForIndex] || 0;

                    cnc += `,${WC[windowIndex]},${windowWidth},${windowHeight},${slim_loc_x},${location_y}`;

                    for (let index = 1; index < MAX_WINDOWS; index++) {
                        cnc += ",0,0,0,0,0";
                    }
                }
            }
        } else {
            /*
             * Standard non-slim logic.
             * Mixed also comes here.
             */
            for (let index = 0; index < MAX_WINDOWS; index++) {
                if (enabledArr[index]) {
                    cnc += `,${WC[index]},${WIDTHS[index]},${HEIGHTS[index]},${RLL[index]},${LOC_Y[index]}`;
                } else {
                    cnc += ",0,0,0,0,0";
                }
            }
        }

        return cnc;

    } catch (err) {
        console.error("ERROR in getCNCString:", err);
        return "";
    }
}

function buildCncCode(sectionIndex) {
    const window_position = getState("WINDOW_POSITION");
    const glass_shape = getState("GLASS_SHAPE");
    const total_sections = Number(getState("NUM_OF_SEC")) || 0;
    const face = getState("FACE");

    if (!glass_shape && face !== "M") {
        return "";
    }

    const match = getMatchingSC(sectionIndex);
    if (!match) return "";

    const { sc_part_no, height_key } = match;
    const section_height = getState(height_key);
    const isTopSection = sectionIndex === total_sections;

    let glz_code_section = "";

    if (sectionIndex === 1) {
        if (window_position === "top") return "";
        glz_code_section = getState("GLZ_CODE_SECTION_01");
    } else if (window_position === "top") {
        if (!isTopSection) return "";
        glz_code_section = getState(`GLZ_CODE_SECTION_0${sectionIndex}`);
    } else {
        glz_code_section = getState(`GLZ_CODE_SECTION_0${sectionIndex}`);
    }

    if (!glz_code_section) return "";

    // Only fetch/cache this section’s SMARTCOM values
    const smartcomCode = getState(`SECTION_0${sectionIndex}_SMARTCOM_CODE`);
    SECTION_RLL_VALUES[sectionIndex - 1] = getAllRLLValuesForSmartcom(smartcomCode);

    return getCNCString(section_height, sc_part_no, sectionIndex);
}

function getAttributeValuesRaw(iName, iVal) {
    let url = $("#header-serial_number")[0].baseURI;
    let configId = url.split("/").pop().split("?")[0];

    let data = null;

    // IMPORTANT: use "&", not "&amp;"
    let query = "id=" + configId + "&iName=" + encodeURIComponent(iName);

    if (iVal != null && iVal !== "") {
        query += "&iVal=" + encodeURIComponent(iVal);
    }

    const fullUrl = "/spr/Configuration/interface/api/beta/attribute?" + query;

    $.ajax({
        url: fullUrl,
        type: "GET",
        async: false,
        success: function (response) {
            data = response;
        },
        error: function (err) {
            console.error("API error:", err);
            data = null;
        }
    });

    return data;
}

function parseAllRLLValues(data) {
    const values = Array(15).fill(0);

    if (data && data.option && data.option.length > 0) {
        const results = data.option[0].result || [];

        for (let i = 0; i < results.length; i++) {
            const item = results[i];
            const attr = item.attr;
            const match = attr && attr.match(/^(\d+)X$/);

            if (match) {
                const idx = parseInt(match[1], 10);

                if (idx >= 1 && idx <= 15) {
                    if (Array.isArray(item.value) && item.value.length > 0) {
                        values[idx - 1] = item.value[0];
                    } else if (item.value != null) {
                        values[idx - 1] = item.value;
                    } else {
                        values[idx - 1] = 0;
                    }
                }
            }
        }
    }

    return values;
}

function getAllRLLValuesForSmartcom(smartcomCode) {
    if (!smartcomCode) {
        return Array(15).fill(0);
    }

    // ✅ Cache by SMARTCOM code
    if (RLL_CACHE_BY_SMARTCOM[smartcomCode]) {
        // console.log("Using cached RLL values for", smartcomCode);
        return RLL_CACHE_BY_SMARTCOM[smartcomCode];
    }

    // ✅ One API call only
    const rawData = getAttributeValuesRaw("RLL_VALUES", smartcomCode);
    const values = parseAllRLLValues(rawData);


    RLL_CACHE_BY_SMARTCOM[smartcomCode] = values;
    // console.log("Cached RLL values:", smartcomCode, values);

    return values;
}

// function generateGlazingCodeString(glassKey) {

//     const ext_frame_1 = getState("EXTERIOR_FRAME_1");
//     const ext_frame_2 = getState("EXTERIOR_FRAME_2");
//     const int_frame_1 = getState("INTERIOR_FRAME_1");
//     const int_frame_2 = getState("INTERIOR_FRAME_2");
//     const screw = getState("SCREWS");
//     const glass = getState(glassKey);
//     const insert_1 = getState("INSERT_1");
//     const insert_2 = getState("INSERT_2");
//     const insert_1_qty = getState("INSERT_1_QTY");
//     const insert_2_qty = getState("INSERT_2_QTY");
//     const glass_shape = getState("GLASS_SHAPE");
//     // const liteLocation = getState("LITE_LOCATION");
//     const frameKit = getState("FRAME_KIT");
//     let face = getState("FACE");

//     if (glass_shape.includes("slim") && getState("DOOR_MODEL") === 'A') {
//         return [
//             frameKit,
//             glass,
//             screw,
//             insert_1,
//             insert_1_qty
//             // liteLocation
//         ].join(",");
//     }
//     else if (face === 'M') {
//         return [
//             ext_frame_1,
//             ext_frame_2,
//             glass,
//             int_frame_1,
//             int_frame_2,
//             screw,
//             insert_1,
//             insert_1_qty,
//             insert_2,
//             insert_2_qty
//         ]
//     }
//     else return [
//         ext_frame_1,
//         glass,
//         int_frame_1,
//         screw,
//         insert_1,
//         insert_1_qty
//         // liteLocation
//     ].join(",");
// }

function generateGlazingCodeString(glassKey, options) {
    options = options || {};

    const ext_frame_1 = getState("EXTERIOR_FRAME_1");
    const ext_frame_2 = getState("EXTERIOR_FRAME_2");

    const int_frame_1 = getState("INTERIOR_FRAME_1");
    const int_frame_2 = getState("INTERIOR_FRAME_2");

    const screw = getState("SCREWS");

    const glass =
        options.glassValue !== undefined
            ? options.glassValue
            : getState(glassKey);

    const insert_1 = getState("INSERT_1");
    const insert_2 = getState("INSERT_2");

    const glass_shape = getState("GLASS_SHAPE") || "";
    const frameKit = getState("FRAME_KIT");
    const face = getState("FACE");

    const scKey = options.scKey || "";

    const glassQty = getSectionGlassQtyFromScKey(scKey, false);
    const glassQtyTempOrMixed = getSectionGlassQtyFromScKey(scKey, true);

    if (glass_shape.includes("slim") && getState("DOOR_MODEL") === "A") {
        return [
            frameKit,
            glass,
            screw,
            insert_1,
            glassQty
        ].join(",");
    }

    if (face === "M") {
        return [
            ext_frame_1,
            ext_frame_2,
            glass,
            int_frame_1,
            int_frame_2,
            screw,
            insert_1,
            glassQty,
            insert_2,
            glassQtyTempOrMixed
        ].join(",");
    }

    return [
        ext_frame_1,
        glass,
        int_frame_1,
        screw,
        insert_1,
        options.useTempQty === true
            ? glassQtyTempOrMixed
            : glassQty
    ].join(",");
}

function getGlassQtyFieldFromScKey(scKey) {
    const match = String(scKey || "").match(/^BUNDLE(\d+)_SC(\d+)_SPNUM$/);

    if (!match) {
        return "";
    }

    return `GLASS_QTY_B${match[1]}_SC${match[2]}`;
}

function hasInsertSelected() {
    const glassInsert = getState("GLASS_INSERT");
    return !!glassInsert && glassInsert !== "";
}

function getSectionGlassQtyFromScKey(scKey, useTempOrMixedQty) {
    if (!hasInsertSelected()) {
        return 0;
    }

    const baseField = getGlassQtyFieldFromScKey(scKey);

    if (!baseField) {
        return 0;
    }

    const qtyField = useTempOrMixedQty
        ? `${baseField}_TEMP_OR_MIXED`
        : baseField;

    return Number(getState(qtyField)) || 0;
}

function getSectionInfo() {
    return [...getDoorInfo().sections].reverse();
}

function countMixedPanelStyles(pattern) {
    const result = {
        C: 0,
        R: 0
    };

    if (!pattern) {
        return result;
    }

    String(pattern).split("").forEach(function (char) {
        const style = char.toUpperCase();

        if (style === "C" || style === "R") {
            result[style]++;
        }
    });

    return result;
}