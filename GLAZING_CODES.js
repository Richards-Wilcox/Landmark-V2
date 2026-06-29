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
};


const LITE_RESULT_CACHE = {};
const DEBUG = false;

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
    const GLZ_DEPS = [
        "WINDOW_POSITION",
        "GLAZING_CODE",
        "WINDOW_1", "WINDOW_1_QTY",
        "HEIGHT", "WIDTH", "NUM_OF_SEC", "LITE_LOCATION",
        "GLASS_TEMPERED"
    ];

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


    addLogic("WINDOW_1", function () {

        const door_model = getState("DOOR_MODEL");
        const glass_shape = getState("GLASS_SHAPE") || "";
        const glass_type = getState("GLASS_TYPE") || "";

        let window_code = "";

        if (!glass_shape || !glass_type) {
            this.value = "0";
            return;
        }

        // Clear Single-005
        // Clear Sealed-004
        // Obscure Pinhead Single-007
        // Obscure Pinhead Sealed-006
        // Dark Tint Single-015
        // Dark Tint Sealed-014
        // Clear Single Tempered-009
        // Clear Sealed Tempered-024
        // Obscure Pinhead Single Tempered-027
        // Obscure Pinhead Sealed Tempered-026
        // Dark Tint Single Tempered-035
        // Dark Tint Sealed Tempered-034

        const glassTypeColonialMap = {
            "CLEAR": "004",
            "CLEAR_SINGLE": "005",
            "SATIN": "012",
            "OBSCURE_GLASS_PINHEAD": "006",
            "OBSCURE_GLASS_SINGLE": "007",
            "DARK_TINT_SEALED": "014",
            "DARK_TINT_SINGLE": "015",
            "BLACK_SATIN_SEALED": "016"
        };

        //Window type = ranch
        // Clear Single - 505
        // Clear Sealed - 504
        // Obscure Pinhead Single - 507
        // Obscure Pinhead Sealed - 506
        // Dark Tint Single - 515
        // Dark Tint Sealed - 514
        // Clear Single Tempered - 509
        // Clear Sealed Tempered - 524
        // Obscure Pinhead Single Tempered - 527
        // Obscure Pinhead Sealed Tempered - 526
        // Dark Tint Single Tempered - 535
        // Dark Tint Sealed Tempered - 534

        const glassTypeRanchMap = {
            "CLEAR": "504",
            "CLEAR_SINGLE": "505",
            "SATIN": "512",
            "OBSCURE_GLASS_PINHEAD": "506",
            "OBSCURE_GLASS_SINGLE": "507",
            "DARK_TINT_SEALED": "514",
            "DARK_TINT_SINGLE": "515",
            "BLACK_SATIN_SEALED": "516"
        };


        if (glass_shape === "colonial") {
            window_code = glassTypeColonialMap[glass_type] || "";
        }
        else if (glass_shape === 'ranch') {
            window_code = glassTypeRanchMap[glass_type] || "";
        }

        if (!window_code) {
            this.value = "0";
            return;
        }

        this.value = `552-${window_code}`;

    }, ["GLASS_SHAPE", "FRAME_COLOR", "DOOR_MODEL", "GLASS_TYPE"]);

    addLogic("WINDOW_1_QTY", function () {
        const glass_shape = getState("GLASS_SHAPE") || "";
        const glass_type = getState("GLASS_TYPE") || "";

        if (!glass_shape || !glass_type) {
            this.value = 0;
            return;
        }

        this.value = computeValue("lites");
    }, ["WIDTH", "FACE", "GLASS_SHAPE", "GLASS_TYPE", "PANEL_SPACING"]);


    addLogic("CENTER_HINGE_CODE", function () {
        const width = getState("WIDTH");
        const panel_style = getState("FACE");
        const spacing = getState("PANEL_SPACING") || "";

        // const result = resolveLiteResult({
        //     width,
        //     panel_style,
        //     glass_shape: "",
        //     spacing,
        //     mode: "early"
        // });

        const result = resolveLiteResult({
            width: getState("WIDTH"),
            panel_style: getState("FACE"),
            glass_shape: getState("GLASS_SHAPE") || "",
            spacing: getState("PANEL_SPACING") || ""
        });


        this.value = result ? (result.center_hinge_code || "") : "";
    }, ["WIDTH", "FACE", "PANEL_SPACING"]);


    addLogic("LITE_LOCATION", function () {
        const glass_shape = getState("GLASS_SHAPE") || "";
        const window_1_qty = getState("WINDOW_1_QTY") || 0;
        const liteCode = liteCodeMap[glass_shape] ?? "";
        this.value = liteCode.repeat(window_1_qty);


    }, ["WINDOW_1_QTY", "GLASS_SHAPE"])

    addLogic("INSERT_1", function () {
        const glass_insert = getState("GLASS_INSERT");
        const insert_color = getState("INSERT_COLOR").value;

        if (!glass_insert || glass_insert === "") {
            this.value = "0";
            return;
        }

        const insert_code = getNode("GLASS_INSERT").getAttribute("insertCode");
        this.value = `${insert_code}${insert_color}` ?? "";

    }, ["GLASS_INSERT", "INSERT_COLOR"])

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


    addLogic("WINDOW_2", function () {
        const door_model = getState("DOOR_MODEL");
        const glass_shape = getState("GLASS_SHAPE") || "";
        const glass_type = getState("GLASS_TYPE") || "";
        const temp_glass = getState("GLASS_TEMPERED") || "";

        let window_code = "";

        if (!glass_shape || !glass_type || !temp_glass) {
            this.value = "0";
            return;
        }


        // Clear Single Tempered-009
        // Clear Sealed Tempered-024
        // Obscure Pinhead Single Tempered-027
        // Obscure Pinhead Sealed Tempered-026
        // Dark Tint Single Tempered-035
        // Dark Tint Sealed Tempered-034

        const glassTypeColonialMap = {
            "CLEAR": "024",
            "CLEAR_SINGLE": "009",
            "OBSCURE_GLASS_PINHEAD": "026",
            "OBSCURE_GLASS_SINGLE": "027",
            "DARK_TINT_SEALED": "034",
            "DARK_TINT_SINGLE": "035"
        };

        //Window type = ranch
        // Clear Single Tempered - 509
        // Clear Sealed Tempered - 524
        // Obscure Pinhead Single Tempered - 527
        // Obscure Pinhead Sealed Tempered - 526
        // Dark Tint Single Tempered - 535
        // Dark Tint Sealed Tempered - 534

        const glassTypeRanchMap = {
            "CLEAR": "524",
            "CLEAR_SINGLE": "509",
            "OBSCURE_GLASS_PINHEAD": "526",
            "OBSCURE_GLASS_SINGLE": "527",
            "DARK_TINT_SEALED": "534",
            "DARK_TINT_SINGLE": "535",
        };


        if (glass_shape === "colonial") {
            window_code = glassTypeColonialMap[glass_type] || "";
        }
        else if (glass_shape === 'ranch') {
            window_code = glassTypeRanchMap[glass_type] || "";
        }

        if (!window_code) {
            this.value = "0";
            return;
        }

        this.value = `552-${window_code}`;

    }, ["GLASS_SHAPE", "FRAME_COLOR", "DOOR_MODEL", "GLASS_TYPE", "GLASS_TEMPERED"]);

    addLogic("WINDOW_2_QTY", function () {
        this.value = 0; //use only when mix panel is selected

    }, ["FACE"])

    addLogic("INSERT_2", function () {
        this.value = 0; //use only when mix panel is selected
    }, ["FACE"])

    addLogic("INSERT_2_QTY", function () {
        this.value = 0; //use only when mix panel is selected
    }, ["FACE"])

    addLogic("EXTERIOR_FRAME_1", function () {
        const glass_shape = getState("GLASS_SHAPE") || "";
        const color = getState("FRAME_COLOR").value;

        if (!glass_shape) {
            this.value = "";
            return;
        }
        if (glass_shape === 'colonial') this.value = `550-601${color}`;
        if (glass_shape === 'ranch') this.value = `550-651${color}`;
    }, ["GLASS_SHAPE", "FRAME_COLOR"])

    addLogic("INTERIOR_FRAME_1", function () {
        const door_model = getState("DOOR_MODEL");
        const glazingtype = getNode("GLASS_TYPE").getAttribute('glazingType');
        const glass_shape = getState("GLASS_SHAPE") || "";

        if (!glass_shape) {
            this.value = "";
            return;
        }
        //colonial window
        if (door_model === 'A' && glass_shape === 'colonial') {
            this.value = glazingtype === 'double' ? `550-606W` : `550-612W`;
        }
        else if (door_model === 'D' && glass_shape === 'colonial') {
            this.value = glazingtype === 'double' ? `550-612W` : `550-613W`;
        }

        //ranch window 
        if (door_model === 'A' && glass_shape === 'ranch') {
            this.value = glazingtype === 'double' ? `550-656W` : `550-662W`;
        }
        else if (door_model === 'D' && glass_shape === 'ranch') {
            this.value = glazingtype === 'double' ? `550-662W` : `550-663W`;
        }


    }, ["GLASS_TYPE", "DOOR_MODEL", "GLASS_SHAPE"])

    addLogic("SCREWS", function () {
        const door_model = getState("DOOR_MODEL");
        const glass_shape = getState("GLASS_SHAPE") || "";

        if (!glass_shape) {
            this.value = "";
            return;
        }

        if (door_model === 'A') this.value = `215-321`;
        if (door_model === 'D') this.value = `215-328`;

    }, ["DOOR_MODEL", "GLASS_SHAPE"])

    addLogic("SCREWS_QTY", function () {
        const glass_shape = getState("GLASS_SHAPE") || "";

        if (!glass_shape) {
            this.value = "";
            return;
        }

        if (glass_shape === 'colonial') this.value = 10;
        if (glass_shape === 'ranch') this.value = 18;


    }, ["GLASS_SHAPE"])


    addLogic("GLAZING_CODE", function () {


        const glassShape = getState("GLASS_SHAPE");

        if (!glassShape) {
            this.value = "";
            return;
        }

        this.value = generateGlazingCodeString("WINDOW_1");

        // const ext_frame_1 = getState("EXTERIOR_FRAME_1");
        // const int_frame_1 = getState("INTERIOR_FRAME_1");
        // const screw = getState("SCREWS");
        // const glass = getState("WINDOW_1");
        // const insert_1 = getState("INSERT_1");
        // const insert_1_qty = getState("INSERT_1_QTY");
        // const lite_location = getState("LITE_LOCATION");
        // const glass_shape = getState("GLASS_SHAPE");

        // // const insert_2 = getState("INSERT_2");
        // // const insert_2_qty = getState("INSERT_2_QTY");

        // if (!glass_shape) {
        //     this.value = "";
        //     return;
        // }
        // else this.value = `${ext_frame_1},${glass},${int_frame_1},${screw},${insert_1},${insert_1_qty},${lite_location}`;

    }, ["EXTERIOR_FRAME_1", "WINDOW_1", "INTERIOR_FRAME_1", "INSERT_1", "INSERT_1_QTY", "SCREWS", "PANEL_SPACING", "LITE_LOCATION", "GLASS_SHAPE", "WINDOW_POSITION"]);

    addLogic("GLAZING_CODE_TEMP", function () {


        const tempGlass = getState("GLASS_TEMPERED");

        if (!tempGlass) {
            this.value = "";
            return;
        }

        this.value = generateGlazingCodeString("WINDOW_2");


    }, ["EXTERIOR_FRAME_1", "WINDOW_2", "INTERIOR_FRAME_1", "INSERT_1", "INSERT_1_QTY", "SCREWS", "PANEL_SPACING", "LITE_LOCATION", "GLASS_SHAPE", "WINDOW_POSITION", "GLASS_TEMPERED"]);


    addNode({
        id: "NO_GLAZING_CODE",
        value: "",
        logic: function () {
            this.value = "0,0,0,0,0,0,0,0,0,0";
        }
    }, [""])

    addLogic("SECTION_01_SMARTCOM_CODE", createSmartcomLogic("SECTION_01"), ["SECTION_01", "FACE", "PANEL_SPACING", "CENTER_HINGE_CODE", "DRILL", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES"]);

    addLogic("SECTION_02_SMARTCOM_CODE", createSmartcomLogic("SECTION_02"), ["SECTION_02", "FACE", "PANEL_SPACING", "CENTER_HINGE_CODE", "DRILL", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES"]);

    addLogic("SECTION_03_SMARTCOM_CODE", createSmartcomLogic("SECTION_03"), ["SECTION_03", "FACE", "PANEL_SPACING", "CENTER_HINGE_CODE", "DRILL", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES"]);

    addLogic("SECTION_04_SMARTCOM_CODE", createSmartcomLogic("SECTION_04"), ["SECTION_04", "FACE", "PANEL_SPACING", "CENTER_HINGE_CODE", "DRILL", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES"]);

    addLogic("SECTION_05_SMARTCOM_CODE", createSmartcomLogic("SECTION_05"), ["SECTION_05", "FACE", "PANEL_SPACING", "CENTER_HINGE_CODE", "DRILL", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES"]);

    addLogic("SECTION_06_SMARTCOM_CODE", createSmartcomLogic("SECTION_06"), ["SECTION_06", "FACE", "PANEL_SPACING", "CENTER_HINGE_CODE", "DRILL", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES"]);

    addLogic("SECTION_07_SMARTCOM_CODE", createSmartcomLogic("SECTION_07"), ["SECTION_07", "FACE", "PANEL_SPACING", "CENTER_HINGE_CODE", "DRILL", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES"]);

    addLogic("SECTION_08_SMARTCOM_CODE", createSmartcomLogic("SECTION_08"), ["SECTION_08", "FACE", "PANEL_SPACING", "CENTER_HINGE_CODE", "DRILL", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES"]);

    addLogic("SECTION_09_SMARTCOM_CODE", createSmartcomLogic("SECTION_09"), ["SECTION_09", "FACE", "PANEL_SPACING", "CENTER_HINGE_CODE", "DRILL", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES"]);

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



}

function getScForSection(sectionIndex) {
    // Each bundle has 2 SCs
    // Section 1 → B1_SC1
    // Section 2 → B1_SC2 if exists, else B2_SC1
    // Section 3 → B2_SC1 or B2_SC2, etc.

    const bundles = [
        {
            sb: "SB1_SPNUM",
            sc1: "BUNDLE1_SC1_SPNUM",
            sc2: "BUNDLE1_SC2_SPNUM",
            height: "BUNDLE_1_HEIGHT",
            sc1_height: "BUNDLE1_SC1_HEIGHT",
            sc2_height: "BUNDLE1_SC2_HEIGHT"
        },
        {
            sb: "SB2_SPNUM",
            sc1: "BUNDLE2_SC1_SPNUM",
            sc2: "BUNDLE2_SC2_SPNUM",
            height: "BUNDLE_2_HEIGHT",
            sc1_height: "BUNDLE2_SC1_HEIGHT",
            sc2_height: "BUNDLE2_SC2_HEIGHT"
        },
        {
            sb: "SB3_SPNUM",
            sc1: "BUNDLE3_SC1_SPNUM",
            sc2: "BUNDLE3_SC2_SPNUM",
            height: "BUNDLE_3_HEIGHT",
            sc1_height: "BUNDLE3_SC1_HEIGHT",
            sc2_height: "BUNDLE3_SC2_HEIGHT"
        },
        {
            sb: "SB4_SPNUM",
            sc1: "BUNDLE4_SC1_SPNUM",
            sc2: "BUNDLE4_SC2_SPNUM",
            height: "BUNDLE_4_HEIGHT",
            sc1_height: "BUNDLE4_SC1_HEIGHT",
            sc2_height: "BUNDLE4_SC2_HEIGHT"
        },
        {
            sb: "SB5_SPNUM",
            sc1: "BUNDLE5_SC1_SPNUM",
            height: "BUNDLE_5_HEIGHT",
            sc1_height: "BUNDLE5_SC1_HEIGHT"
        },
        {
            sb: "SB6_SPNUM",
            sc1: "BUNDLE6_SC1_SPNUM",
            height: "BUNDLE_6_HEIGHT",
            sc1_height: "BUNDLE6_SC1_HEIGHT"
        },
        {
            sb: "SB7_SPNUM",
            sc1: "BUNDLE7_SC1_SPNUM",
            height: "BUNDLE_7_HEIGHT",
            sc1_height: "BUNDLE7_SC1_HEIGHT"
        },
        {
            sb: "SB8_SPNUM",
            sc1: "BUNDLE8_SC1_SPNUM",
            height: "BUNDLE_8_HEIGHT",
            sc1_height: "BUNDLE8_SC1_HEIGHT"
        },
        {
            sb: "SB9_SPNUM",
            sc1: "BUNDLE9_SC1_SPNUM",
            height: "BUNDLE_9_HEIGHT",
            sc1_height: "BUNDLE9_SC1_HEIGHT"
        },
    ];

    // Flatten into ordered SC slots: [B1SC1, B1SC2, B2SC1, B2SC2, ...]
    const slots = [];
    bundles.forEach(b => {
        slots.push({ sb: b.sb, sc: b.sc1, height: b.height, sc1_height: b.sc1_height });
        slots.push({ sb: b.sb, sc: b.sc2, height: b.height, sc2_height: b.sc2_height });
    });

    return slots[sectionIndex - 1]; // 1-based
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


function buildGlzCode(sectionIndex, temp_glass_flg) {
    const window_position = getState("WINDOW_POSITION");
    const glazing_code = getState("GLAZING_CODE");
    const no_glz_code = getState("NO_GLAZING_CODE");
    const glazing_code_temp = getState("GLAZING_CODE_TEMP");
    const total_sections = Number(getState("NUM_OF_SEC")) || 0;
    const temp_glass = getState("GLASS_TEMPERED");

    if (!window_position) return "";

    const allSCs = getAllSCs();

    // ✅ Match SC by last 2 digits
    const sc_part_no = allSCs.find(sc =>
        parseInt(sc.slice(-2)) === sectionIndex
    );

    if (!sc_part_no) return "";

    const sb_part_no = findSBForSC(sc_part_no);
    if (!sb_part_no) return "";

    const panel_identity = `SB-INT${sc_part_no.slice(-2)}`;
    const isTopSection = sectionIndex === total_sections;

    let finalCode = glazing_code; // default

    // --- Section 1(Bottom section) ---
    // if (sectionIndex === 1) {
    //     return window_position === "top"
    //         ? `${sb_part_no},${sc_part_no},${no_glz_code}`
    //         : `${sb_part_no},${sc_part_no},${glazing_code}`;
    // }

    if (sectionIndex === 1 && window_position === "top") {
        finalCode = no_glz_code;

        return getGlazingCode(
            sb_part_no,
            panel_identity,
            sc_part_no,
            finalCode
        );
    }



    // --- Other sections ---
    // if (window_position === "top") {
    //     return isTopSection
    //         ? getGlazingCode(sb_part_no, panel_identity, sc_part_no, glazing_code)
    //         : getGlazingCode(sb_part_no, panel_identity, sc_part_no, no_glz_code);
    // }

    // return getGlazingCode(sb_part_no, panel_identity, sc_part_no, glazing_code);

    if (temp_glass === "all") {

        if (window_position === "top") {
            // only top section temp
            finalCode = isTopSection
                ? glazing_code_temp
                : no_glz_code;
        } else {
            // all temp
            finalCode = glazing_code_temp;
        }
    }


    else if (temp_glass === "bottom_1" || temp_glass === "bottom_2") {
        if (window_position === "top") {
            // ✅ ONLY TOP = glazing, others = no_glz
            finalCode = isTopSection
                ? glazing_code
                : no_glz_code;
        } else {
            if (temp_glass === "bottom_1" && sectionIndex === 1) {
                finalCode = glazing_code_temp;
            }
            else if (temp_glass === "bottom_2" && (sectionIndex === 1 || sectionIndex === 2)) {
                // ✅ section 1 AND 2  ← FIX HERE
                finalCode = glazing_code_temp;
            }
            else {
                finalCode = glazing_code;
            }

        }
    }

    // ✅ fallback
    else {

        if (window_position === "top") {
            // ✅ ONLY TOP gets glazing
            finalCode = isTopSection
                ? glazing_code
                : no_glz_code;
        } else {
            // ✅ Normal case
            finalCode = glazing_code;
        }

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

function getLites(width, type) {
    const ranges = {
        colonial_std: [
            { min: 48, max: 71, lites: 2, center_hinge_code: "B" },
            { min: 72, max: 94, lites: 3, center_hinge_code: "C" },
            { min: 95, max: 118, lites: 4, center_hinge_code: "B" },
            { min: 119, max: 142, lites: 5, center_hinge_code: "C" },
            { min: 143, max: 165, lites: 6, center_hinge_code: "C" },
            { min: 166, max: 189, lites: 7, center_hinge_code: "E" },
            { min: 190, max: 227, lites: 8, center_hinge_code: "D" },
            { min: 228, max: 235, lites: 9, center_hinge_code: "E" },
            { min: 236, max: 258, lites: 10, center_hinge_code: "F" },
            { min: 259, max: 281, lites: 11, center_hinge_code: "G" },
            { min: 282, max: 287, lites: 12, center_hinge_code: "F" }
        ],
        ranch_std: [
            { min: 48, max: 94, lites: 1, center_hinge_code: "B" },
            { min: 95, max: 142, lites: 2, center_hinge_code: "C" },
            { min: 143, max: 189, lites: 3, center_hinge_code: "C" },
            { min: 190, max: 235, lites: 4, center_hinge_code: "D" },
            { min: 236, max: 281, lites: 5, center_hinge_code: "E" },
            { min: 282, max: 287, lites: 6, center_hinge_code: "F" }
        ],
        RanchOverColonialStd: [
            { min: 48, max: 75, lites: 1 },
            { min: 76, max: 76, lites: 0 },
            { min: 77, max: 119, lites: 2 },
            { min: 120, max: 178, lites: 3 },
            { min: 179, max: 228, lites: 4 },
            { min: 229, max: 259, lites: 5 },
            { min: 260, max: 282, lites: 6 }
        ],
        ColonialOverRanchStd: [
            { min: 48, max: 75, lites: 2 },
            { min: 76, max: 76, lites: 0 },
            { min: 77, max: 119, lites: 4 },
            { min: 120, max: 178, lites: 6 },
            { min: 179, max: 228, lites: 8 },
            { min: 229, max: 259, lites: 10 },
            { min: 260, max: 282, lites: 12 }
        ]
    };

    const table = ranges[type];
    if (!table) return null;

    return table.find(function (r) {
        return width >= r.min && width <= r.max;
    }) || null;
}

// function CalculateLitesInsertQty(width, panel_style, glass_shape) {
//     const spacing = getState("PANEL_SPACING");
//     let window_type = "";

//     if (!width || !panel_style || !glass_shape) return "";

//     if (panel_style === "C") {
//         if (glass_shape === "colonial") window_type = "colonial_std";
//         else if (glass_shape === "ranch") window_type = "RanchOverColonialStd";
//         else if (!glass_shape && spacing === "S") window_type = "colonial_std";
//     }

//     if (panel_style === "R") {
//         if (glass_shape === "colonial") window_type = "ColonialOverRanchStd";
//         else if (!glass_shape && spacing === "S") window_type = "ranch_std";
//     }

//     if (!window_type) return "";

//     const cacheKey = getLiteCacheKey(width, panel_style, glass_shape, spacing);

//     if (LITE_RESULT_CACHE[cacheKey]) {
//         return LITE_RESULT_CACHE[cacheKey];
//     }

//     const result = getLites(width, window_type) || "";
//     LITE_RESULT_CACHE[cacheKey] = result;

//     return result;
// }


// function resolveLiteResult(options) {
//     const width = Number(options.width) || 0;
//     const panel_style = options.panel_style || "";
//     const glass_shape = options.glass_shape || "";
//     const spacing = options.spacing || "";
//     const mode = options.mode || "glazing"; // "early" or "glazing"

//     if (!width || !panel_style) return null;

//     let window_type = "";

//     if (mode === "early") {
//         // Early mode: only WIDTH + FACE
//         if (panel_style === "C") {
//             window_type = "colonial_std";
//         } else if (panel_style === "R") {
//             window_type = "ranch_std";
//         }
//         else if ((panel_style === "F" || panel_style === "V") && glass_shape === 'colonial') {
//             window_type = "colonial_std";
//         }
//         else {
//             return null;
//         }
//     } else {
//         // Glazing mode: WIDTH + FACE + GLASS_SHAPE
//         if (!glass_shape) return null;

//         if (panel_style === "C") {
//             if (glass_shape === "colonial") window_type = "colonial_std";
//             else if (glass_shape === "ranch") window_type = "RanchOverColonialStd";
//             else if (!glass_shape && spacing === "S") window_type = "colonial_std";
//         }

//         if (panel_style === "R") {
//             if (glass_shape === "colonial") window_type = "ColonialOverRanchStd";
//             else if (!glass_shape && spacing === "S") window_type = "ranch_std";
//             else if (glass_shape === "ranch") window_type = "ranch_std";
//         }

//         if ((panel_style === "F" || panel_style === "V") && glass_shape === 'colonial') {
//             window_type = "colonial_std"
//         }

//         if (!window_type) return null;
//     }

//     const cacheKey = `${mode}|${width}|${panel_style}|${glass_shape}|${spacing}`;

//     if (LITE_RESULT_CACHE[cacheKey]) {
//         return LITE_RESULT_CACHE[cacheKey];
//     }

//     const result = getLites(width, window_type) || null;
//     LITE_RESULT_CACHE[cacheKey] = result;

//     return result;
// }

function resolveLiteResult(options) {
    const width = Number(options.width) || 0;
    const panel_style = options.panel_style || "";
    const glass_shape = options.glass_shape || "";
    const spacing = options.spacing || "";

    if (!width || !panel_style) return null;

    let window_type = "";

    // FACE = C
    if (panel_style === "C") {
        if (glass_shape === "colonial") {
            window_type = "colonial_std";
        } else if (glass_shape === "ranch") {
            window_type = "RanchOverColonialStd";
        } else if (!glass_shape) {
            window_type = "colonial_std";
        }
    }

    // FACE = R
    else if (panel_style === "R") {
        if (glass_shape === "colonial") {
            window_type = "ColonialOverRanchStd";
        } else if (glass_shape === "ranch") {
            window_type = "ranch_std";
        } else if (!glass_shape) {
            window_type = "ranch_std";
        }
    }

    // FACE = F or V
    else if (panel_style === "F" || panel_style === "V") {
        if (glass_shape === "colonial") {
            window_type = "colonial_std";
        } else if (glass_shape === "ranch") {
            window_type = "ranch_std";
        }
    }

    if (!window_type) return null;

    const cacheKey = `${width}|${panel_style}|${glass_shape}|${spacing}`;

    if (LITE_RESULT_CACHE[cacheKey]) {
        return LITE_RESULT_CACHE[cacheKey];
    }

    const result = getLites(width, window_type) || null;
    LITE_RESULT_CACHE[cacheKey] = result;

    return result;
}


function computeValue(field) {
    const width = getState("WIDTH");
    const panel_style = getState("FACE");
    const glass_shape = getState("GLASS_SHAPE") || "";
    const spacing = getState("PANEL_SPACING") || "";

    // const result = resolveLiteResult({
    //     width,
    //     panel_style,
    //     glass_shape,
    //     spacing,
    //     mode: "glazing"
    // });

    const result = resolveLiteResult({
        width: getState("WIDTH"),
        panel_style: getState("FACE"),
        glass_shape: getState("GLASS_SHAPE") || "",
        spacing: getState("PANEL_SPACING") || ""
    });



    return result ? (result[field] ?? 0) : 0;
}


function getCenterHingeCodeEarly() {
    const width = Number(getState("WIDTH")) || 0;
    const panel_style = getState("FACE");

    if (!width || !panel_style) {
        return "";
    }

    // Default table by FACE so it can compute before glazing is selected
    let type = "";

    if (panel_style === "C") {
        type = "colonial_std";
    } else if (panel_style === "R") {
        type = "ranch_std";
    } else {
        return "";
    }

    const result = getLites(width, type);
    return result ? (result.center_hinge_code || "") : "";
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

        var code = panel_style + panel_spacing + hinge_code + "S" + drill_code + "-" + width_ft + width_inch;

        // ✅ Apply rule
        if (sectionValue !== "" && sectionValue !== null && sectionValue !== undefined) {
            this.value = code;       // ✅ filled
        } else {
            this.value = "";         // ✅ empty
        }
    };
}

function getCNCString(section_height, sc_part_no, sectionIndex) {
    try {
        const MAX_WINDOWS = 10;

        const LOC_Y_MAP = {
            24: 12.0,
            21: 10.5,
            18: 9.0
        };

        const door_thickness = getState("DOOR_THICKNESS");
        const lite_location = getState("LITE_LOCATION");
        const rp_width = getState("WIDTH");
        const num_of_windows = Number(getState("WINDOW_1_QTY")) || 0;

        const location_y = LOC_Y_MAP[section_height] ?? 0;

        const buildArray = (count, value) =>
            Array.from({ length: MAX_WINDOWS }, (_, i) => (i < count ? value : 0));

        const buildCharArray = (count, char) =>
            Array.from({ length: MAX_WINDOWS }, (_, i) => (i < count ? char : 0));

        const WC = buildCharArray(num_of_windows, "C");
        const WIDTHS = buildArray(num_of_windows, 18.8125);
        const HEIGHTS = buildArray(num_of_windows, 13.625);
        const LOC_Y = buildArray(num_of_windows, location_y);



        const sections = getSectionInfo();

        // ✅ Get enabled array for correct section
        const enabledArr =
            Array.isArray(sections[sectionIndex - 1]?.enabled)
                ? sections[sectionIndex - 1].enabled
                : [];

        // ✅ Get RLL values (1X → nX)
        const sectionRLL =
            SECTION_RLL_VALUES[sectionIndex - 1] || Array(15).fill(0);

        // ✅ Apply enabled mask
        const RLL = Array.from({ length: MAX_WINDOWS }, (_, i) => {
            return enabledArr[i]
                ? Number(sectionRLL[i]) || 0
                : 0;
        });


        // ✅ Debug logs (optional but recommended)
        console.log("sectionIndex:", sectionIndex);
        console.log("sectionRLL:", sectionRLL);
        console.log("enabled:", enabledArr);
        console.log("final RLL:", RLL);



        let cnc = `${sc_part_no},${door_thickness},${lite_location},${rp_width},${section_height},LR`;

        cnc += "," + Array(14).fill(0).join(",");
        cnc += `,${num_of_windows}`;

        for (let i = 0; i < MAX_WINDOWS; i++) {
            if (i < num_of_windows) {
                cnc += `,${WC[i]},${WIDTHS[i]},${HEIGHTS[i]},${RLL[i]},${LOC_Y[i]}`;
            } else {
                cnc += `,0,0,0,0,0`;
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
    const total_sections = Number(getState("NUM_OF_SEC")) || 0;

    if (!window_position) return "";

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

    // ✅ Only fetch/cache this section’s SMARTCOM values
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
        console.log("Using cached RLL values for", smartcomCode);
        return RLL_CACHE_BY_SMARTCOM[smartcomCode];
    }

    // ✅ One API call only
    const rawData = getAttributeValuesRaw("RLL_VALUES", smartcomCode);
    const values = parseAllRLLValues(rawData);

    RLL_CACHE_BY_SMARTCOM[smartcomCode] = values;
    console.log("Cached RLL values:", smartcomCode, values);

    return values;
}


function generateGlazingCodeString(glassKey) {

    const ext_frame_1 = getState("EXTERIOR_FRAME_1");
    const int_frame_1 = getState("INTERIOR_FRAME_1");
    const screw = getState("SCREWS");
    const glass = getState(glassKey);
    const insert_1 = getState("INSERT_1");
    const insert_1_qty = getState("INSERT_1_QTY");
    const lite_location = getState("LITE_LOCATION");
    const glass_shape = getState("GLASS_SHAPE");
    const liteLocation = getState("LITE_LOCATION");


    return [
        ext_frame_1,
        glass,
        int_frame_1,
        screw,
        insert_1,
        insert_1_qty,
        liteLocation
    ].join(",");


}


function getSectionInfo() {
    return [...getDoorInfo().sections].reverse();
}