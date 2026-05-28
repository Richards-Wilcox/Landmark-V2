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


function addGlazingCodeLogic() {

    // Generate all 9 sections
    const GLZ_DEPS = [
        "WINDOW_POSITION",
        "GLAZING_CODE", 
        "WINDOW_1", "WINDOW_1_QTY",
        "HEIGHT", "WIDTH", "NUM_OF_SEC", "LITE_LOCATION"
        // "SB1_SPNUM", "SB2_SPNUM", "SB3_SPNUM", "SB4_SPNUM",
        // "BUNDLE1_SC1_SPNUM", "BUNDLE1_SC2_SPNUM",
        // "BUNDLE2_SC1_SPNUM", "BUNDLE2_SC2_SPNUM",
        // "BUNDLE3_SC1_SPNUM", "BUNDLE3_SC2_SPNUM",
        // "BUNDLE4_SC1_SPNUM", "BUNDLE4_SC2_SPNUM",
        // "BUNDLE_1_HEIGHT", "BUNDLE_2_HEIGHT",
        // "BUNDLE_3_HEIGHT", "BUNDLE_4_HEIGHT",
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

    addLogic("PANEL_SPACING", function () {
        const panel_style = getState("FACE");

        //face style - C, R, F, V, M, panel_spacing - S
        //face style -B, S, T, panel_spacing - C

        const spacingSGroup = ["C", "R", "F", "V", "M"];
        const spacingCGroup = ["B", "S", "T"];

        if (spacingSGroup.includes(panel_style)) {
            this.value = "S";
        } else if (spacingCGroup.includes(panel_style)) {
            this.value = "C";
        } else {
            this.value = ""; // fallback if unexpected value
        }


    }, ["FACE"])


    addLogic("WINDOW_1", function () {

        const door_model = getState("DOOR_MODEL");
        const glass_shape = getState("GLASS_SHAPE") || "";
        const frame_color = getState("FRAME_COLOR")?.value || "";
        const glass_type = getState("GLASS_TYPE") || "";

        let frame_size = "";
        let window_code = "";

        // =========================
        // STOP if nothing selected
        // =========================

        if (!glass_shape || !glass_type) {
            this.value = "0";
            return;
        }

        // =========================
        // FRAME SIZE
        // =========================

        if (door_model === "A") {

            if (glass_shape === "colonial") {
                frame_size = "2";
            }
            else if (glass_shape === "ranch") {
                frame_size = "3";
            }

        }
        else if (door_model === "D") {

            if (glass_shape === "colonial") {
                frame_size = "6";
            }
            else if (glass_shape === "ranch") {
                frame_size = "7";
            }
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
            "DARK_TINT_SEALED": "014",
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
            "DARK_TINT_SEALED": "514",
            "BLACK_SATIN_SEALED": "516"
        };


        if (glass_shape === "colonial") {
            window_code = glassTypeColonialMap[glass_type] || "";
        }
        else if (glass_shape === 'ranch') {
            window_code = glassTypeRanchMap[glass_type] || "";
        }

        if (!frame_size || !window_code) {
            this.value = "0";
            return;
        }

        this.value = `4${frame_size}${frame_color}-${window_code}`;

    }, ["GLASS_SHAPE", "FRAME_COLOR", "DOOR_MODEL", "GLASS_TYPE"]);

    addLogic("WINDOW_1_QTY", function () {
        const width = getState("WIDTH");
        const panel_style = getState("FACE");
        const glass_shape = getState("GLASS_SHAPE") || "";
        const glass_type = getState("GLASS_TYPE") || "";

        if (!glass_shape && !glass_type) {
            this.value = "0";
            return;
        }

        // let window_type = '';
        // if (panel_style === 'C') {
        //     if (glass_shape === 'colonial') {
        //         window_type = 'colonial_std'
        //     }
        //     if (glass_shape === 'ranch') {
        //         window_type = 'RanchOverColonialStd';
        //     }
        // }

        // if (panel_style === 'R') {
        //     if (glass_shape === 'colonial') {
        //         window_type = 'ColonialOverRanchStd'
        //     }
        // }

        // if (!window_type) {
        //     this.value = "";
        //     return;
        // }

        // this.value = getLites(width, window_type);

        this.value = CalculateLitesInsertQty();

    }, ["WIDTH", "FACE", "GLASS_SHAPE"])

    addLogic("LITE_LOCATION", function () {
        const glass_shape = getState("GLASS_SHAPE") || "";
        const window_1_qty = getState("WINDOW_1_QTY") || 0;
        const liteCode = liteCodeMap[glass_shape] ?? "";
        this.value = liteCode.repeat(window_1_qty);


    }, ["WINDOW_1_QTY", "GLASS_SHAPE"])

    addLogic("INSERT_1", function () {
        const glass_insert = getState("GLASS_INSERT");

        if (!glass_insert || glass_insert === "") {
            this.value = "0";
            return;
        }

        this.value = getNode("GLASS_INSERT").getAttribute("insertCode") ?? "";

    }, ["GLASS_INSERT"])

    addLogic("INSERT_1_QTY", function () {
        const glass_insert = getState("GLASS_INSERT");
        if (!glass_insert || glass_insert === "") {
            this.value = "0";
            return;
        }
        this.value = CalculateLitesInsertQty();
    }, ["WIDTH", "FACE", "GLASS_INSERT"]);

    addLogic("WINDOW_2", function () {
        this.value = "0"; //use only when mix panel is selected

    }, ["FACE"])

    addLogic("WINDOW_2_QTY", function () {
        this.value = 0; //use only when mix panel is selected

    }, ["FACE"])

    addLogic("INSERT_2", function () {
        this.value = 0; //use only when mix panel is selected
    }, ["FACE"])

    addLogic("INSERT_2_QTY", function () {
        this.value = 0; //use only when mix panel is selected
    }, ["FACE"])

    addLogic("GLAZING_CODE", function () {
        const window_1 = getState("WINDOW_1");
        const window_1_qty = getState("WINDOW_1_QTY");
        const insert_1 = getState("INSERT_1");
        const insert_1_qty = getState("INSERT_1_QTY");
        const window_2 = getState("WINDOW_2");
        const window_2_qty = getState("WINDOW_2_QTY");
        const insert_2 = getState("INSERT_2");
        const insert_2_qty = getState("INSERT_2_QTY");
        const panel_spacing = getState("PANEL_SPACING");
        const lite_location = getState("LITE_LOCATION");


        this.value = `${window_1},${window_1_qty},${insert_1},${insert_1_qty},${window_2},${window_2_qty},${insert_2},${insert_2_qty},${panel_spacing},${lite_location}`;

    }, ["WINDOW_1", "WINDOW_1_QTY", "INSERT_1", "INSERT_1_QTY", "WINDOW_2", "WINDOW_2_QTY", "INSERT_2", "INSERT_2_QTY", "PANEL_SPACING", "LITE_LOCATION"]);

    addNode({
        id: "NO_GLAZING_CODE",
        value: "",
        logic: function () {
            this.value = "0,0,0,0,0,0,0,0,0,0";
        }
    }, [""])

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
    }, ["GLZ_CODE_SECTION_01"]);

    addLogic("CNC_SECTION_02", function () {
        const glz = getState("GLZ_CODE_SECTION_02");
        this.value = glz ? buildCncCode(2) : "";
    },  ["GLZ_CODE_SECTION_02"]);

    addLogic("CNC_SECTION_03", function () {
        const glz = getState("GLZ_CODE_SECTION_03");
        this.value = glz ? buildCncCode(3) : "";
    },  ["GLZ_CODE_SECTION_03"]);

    addLogic("CNC_SECTION_04", function () {
        const glz = getState("GLZ_CODE_SECTION_04");
        this.value = glz ? buildCncCode(4) : "";
    },  ["GLZ_CODE_SECTION_04"]);

    addLogic("CNC_SECTION_05", function () {
        const glz = getState("GLZ_CODE_SECTION_05");
        this.value = glz ? buildCncCode(5) : "";
    },  ["GLZ_CODE_SECTION_05"]);

    addLogic("CNC_SECTION_06", function () {
        const glz = getState("GLZ_CODE_SECTION_06");
        this.value = glz ? buildCncCode(6) : "";
    },  ["GLZ_CODE_SECTION_06"]);

    addLogic("CNC_SECTION_07", function () {
        const glz = getState("GLZ_CODE_SECTION_07");
        this.value = glz ? buildCncCode(7) : "";
    },  ["GLZ_CODE_SECTION_07"]);

    addLogic("CNC_SECTION_08", function () {
        const glz = getState("GLZ_CODE_SECTION_08");
        this.value = glz ? buildCncCode(8) : "";
    },  ["GLZ_CODE_SECTION_08"]);

    addLogic("CNC_SECTION_09", function () {
        const glz = getState("GLZ_CODE_SECTION_09");
        this.value = glz ? buildCncCode(9) : "";
    },  ["GLZ_CODE_SECTION_09"]);
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


function buildGlzCode(sectionIndex) {
    const window_position = getState("WINDOW_POSITION");
    const glazing_code = getState("GLAZING_CODE");
    const no_glz_code = getState("NO_GLAZING_CODE");
    const total_sections = Number(getState("NUM_OF_SEC")) || 0;

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

    // --- Section 1 ---
    if (sectionIndex === 1) {
        return window_position === "top"
            ? `${sb_part_no},SB-BTM,${sc_part_no},${no_glz_code}`
            : `${sb_part_no},SB-BTM,${sc_part_no},${glazing_code}`;
    }

    // --- Other sections ---
    if (window_position === "top") {
        return isTopSection
            ? getGlazingCode(sb_part_no, panel_identity, sc_part_no, glazing_code)
            : getGlazingCode(sb_part_no, panel_identity, sc_part_no, no_glz_code);
    }

    return getGlazingCode(sb_part_no, panel_identity, sc_part_no, glazing_code);
}


function getTopSectionIndex() {
    const sections = getSectionBundle();
    return sections.length;
}

function getGlazingCode(sb_part_no, panel_identity, sc_part_no, glazing_code) {
    return `${sb_part_no},${panel_identity},${sc_part_no},${glazing_code}`;
}

function getLites(width, type) {

    const ranges = {
        colonial_std: [
            { min: 48, max: 71, lites: 2 },
            { min: 72, max: 94, lites: 3 },
            { min: 95, max: 104, lites: 4 },
            { min: 105, max: 119, lites: 5 },
            { min: 120, max: 143, lites: 6 },
            { min: 144, max: 178, lites: 7 },
            { min: 179, max: 202, lites: 8 },
            { min: 203, max: 228, lites: 9 },
            { min: 229, max: 236, lites: 10 },
            { min: 237, max: 259, lites: 11 },
            { min: 260, max: 282, lites: 12 },
        ],

        RanchOverColonialStd: [
            { min: 48, max: 75, lites: 1 },
            { min: 76, max: 76, lites: 0 },
            { min: 77, max: 119, lites: 2 },
            { min: 120, max: 178, lites: 3 },
            { min: 179, max: 228, lites: 4 },
            { min: 229, max: 259, lites: 5 },
            { min: 260, max: 282, lites: 6 },
        ],

        ColonialOverRanchStd: [
            { min: 48, max: 75, lites: 2 },
            { min: 76, max: 76, lites: 0 },
            { min: 77, max: 119, lites: 4 },
            { min: 120, max: 178, lites: 6 },
            { min: 179, max: 228, lites: 8 },
            { min: 229, max: 259, lites: 10 },
            { min: 260, max: 282, lites: 12 },
        ],

    };

    const table = ranges[type];

    if (!table) {
        console.warn(`getLites: unknown type "${type}"`);
        return null;
    }

    const match = table.find(r => width >= r.min && width <= r.max);

    return match ? match.lites : null;
}

function CalculateLitesInsertQty() {
    const width = getState("WIDTH");
    const panel_style = getState("FACE");
    const glass_shape = getState("GLASS_SHAPE") || "";

    // if (!glass_shape) return "";

    let window_type = '';

    if (panel_style === 'C') {
        if (glass_shape === 'colonial') window_type = 'colonial_std';
        if (glass_shape === 'ranch') window_type = 'RanchOverColonialStd';
    }

    if (panel_style === 'R') {
        if (glass_shape === 'colonial') window_type = 'ColonialOverRanchStd';
    }

    if (!window_type) return "";

    return getLites(width, window_type) ?? "";
}

function getCNCString(section_height, panel_identity) {
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
        const RLL = buildArray(num_of_windows, 0); // placeholder

        let cnc = `${panel_identity},${door_thickness},${lite_location},${rp_width},${section_height},LR`;        

        // 14 zeros
        cnc += "," + Array(14).fill(0).join(",");

        // window count
        cnc += `,${num_of_windows}`;

        // window data (5 values per window)
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

    // ── Get SC using same index matching as buildGlzCode ──
    const match = getMatchingSC(sectionIndex);
    if (!match) return "";

    const { sc_part_no, height_key } = match;

    const isTopSection = sectionIndex === total_sections;
    const section_height = getState(height_key);

    // ── Panel identity ──────────────────────────────────
    const panel_identity = sectionIndex === 1
        ? `SB-BTM`
        : `SB-INT${sc_part_no.slice(-2)}`;

    // ── Determine if this section should get CNC ────────
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

    return getCNCString(section_height, panel_identity);
}