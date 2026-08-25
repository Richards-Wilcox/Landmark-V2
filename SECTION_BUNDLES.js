//This file contains all the inputs related to section bundle and raw panel.
//Author Name: Charmi Surati

const SECTION_DEPS = [
    "SHORTEST_SECTION",
    "SHORTEST_SECTIONS_QTY",
    "TALLEST_SECTION",
    "TALLEST_SECTION_QTY",
    "NUM_OF_SEC"
];

const DIMENSION_DEPS = [
    "DOOR_HEIGHT_FEET",
    "DOOR_HEIGHT_INCHES",
    "DOOR_WIDTH_FEET",
    "DOOR_WIDTH_INCHES",
    "NUM_OF_SEC"
];

const BUNDLE_DEPS = [
    ...SECTION_DEPS,
    ...DIMENSION_DEPS,
    "HEIGHT",
    "WIDTH",
    "FACE",
    "DESIGN_CODE",
    "WINDOW_POSITION",
    "GLASS_SHAPE",
    "CUSTOM_WINDOWS",
    "WINDOW_STATE"
];


const BUNDLE_CONFIG = [
    { bundleNo: 1, sectionCount: 2 },
    { bundleNo: 2, sectionCount: 2 },
    { bundleNo: 3, sectionCount: 2 },
    { bundleNo: 4, sectionCount: 2 },
    { bundleNo: 5, sectionCount: 1 },
    { bundleNo: 6, sectionCount: 1 },
    { bundleNo: 7, sectionCount: 1 },
    { bundleNo: 8, sectionCount: 1 },
    { bundleNo: 9, sectionCount: 1 }
];


function addSectionBundleDrivers() {


    registerHeaderLogic();
    registerSectionHeightLogic();
    registerBundleCoreLogic();
    registerSectionBundleLogic();
    registerSectionComponentLogic();
    registerRawPanelLogic();
    registerRawPanelBaseLogic();
    registerRawPanelTopSheetLogic();
    registerBottomRetainerLogic();

    registerEndCapsLogic();
    registerPackagingLogic();

}



function getBundleHeight(bundleNo) {
    const bundle = getBundle(bundleNo);
    return bundle?.sections?.reduce((a, b) => a + b, 0) ?? 0;
}

function getBundleSectionHeight(bundleNo, sectionNo) {
    const bundle = getBundle(bundleNo);
    return bundle?.sections?.[sectionNo - 1] ?? 0;
}

function getBundleIndex(bundleNo, sectionNo) {
    const bundle = getBundle(bundleNo);
    return bundle?.indexes?.[sectionNo - 1] ?? "";
}

function getDoorModelIdShort() {
    return getNode("DOOR_MODEL").getAttribute("id").substring(1);
}

function getExactDoorModelId() {
    return getNode("DOOR_MODEL").getAttribute("id");
}

function getDoorModelDesc() {
    return getNode("DOOR_MODEL").getAttribute("desc");
}

function getFaceDesc() {
    return getNode("FACE").getAttribute("desc");
}

function getColorDesc() {
    return getState("COLOR")?.desc || "";
}

function getColorValue() {
    return getState("COLOR")?.value || "";
}

function getBundleQtyValue(bundleHeightField) {
    return getState(bundleHeightField) === 0 ? 0 : 1;
}

function getSectionQtyValue(sectionHeightField) {
    return getState(sectionHeightField) === 0 ? 0 : 1;
}

function bundleField(bundleNo, suffix) {
    return `BUNDLE_${bundleNo}_${suffix}`;
}

function bundleScField(bundleNo, sectionNo, suffix) {
    return `BUNDLE${bundleNo}_SC${sectionNo}_${suffix}`;
}

function sbField(bundleNo, suffix) {
    return `SB${bundleNo}_${suffix}`;
}

function bundleRpField(bundleNo, rpNo, suffix) {
    return `BUNDLE${bundleNo}_RP${rpNo}_${suffix}`;
}


function registerHeaderLogic() {
    addLogic("YLINE_DESC", function () {
        const doorType = "DF";
        const color = getColorDesc();
        const doorModel = getDoorModelDesc();
        const panelStyle = getFaceDesc();
        const numOfSec = getState("NUM_OF_SEC");
        //const design_code = getNode("DESIGN_CODE").getAttribute("pattern");

        let panel_desc = '';
        panel_desc = panelStyle != "mixed" ? panelStyle : getNode("DESIGN_CODE").getAttribute("pattern");

        this.value = `${doorType} ${getState("DOOR_WIDTH_FEET")}-${getState("DOOR_WIDTH_INCHES")}x${getState("DOOR_HEIGHT_FEET")}-0(${numOfSec}) ${doorModel} ${color} ${panel_desc}`;
    }, ["WIDTH", ...DIMENSION_DEPS, "HEIGHT", "DOOR_MODEL", "COLOR", "customSwitch", "FACE", "DESIGN_CODE"]);
}


function registerSectionHeightLogic() {
    for (let i = 1; i <= 9; i++) {
        const fieldName = `SECTION_0${i}`;

        addLogic(fieldName, function () {
            const sections = getSectionBundle();

            if (i <= 3) {
                // Preserve current behavior for first 3
                this.value = sections[i - 1];
            } else {
                this.value = Number(getState("NUM_OF_SEC")) >= i ? sections[i - 1] : "";
            }
        }, SECTION_DEPS);
    }
}

function registerBundleCoreLogic() {
    BUNDLE_CONFIG.forEach(({ bundleNo, sectionCount }) => {
        const bundleHeightField = bundleField(bundleNo, "HEIGHT");
        const bundleQtyField = bundleField(bundleNo, "QTY");

        // Bundle total height
        addLogic(bundleHeightField, function () {
            //this.value = getBundleHeight(bundleNo);

            const value = getBundleHeight(bundleNo);
            if (this.value === value) {
                return;
            }

            this.value = value;
        }, BUNDLE_DEPS);

        // Section heights + qty
        for (let s = 1; s <= sectionCount; s++) {
            const scHeightField = bundleScField(bundleNo, s, "HEIGHT");
            const scQtyField = bundleScField(bundleNo, s, "QTY");

            addLogic(scHeightField, function () {

                // this.value = getBundleSectionHeight(bundleNo, s);
                const value = getBundleSectionHeight(bundleNo, s);

                if (this.value === value) {
                    return;
                }

                this.value = value;


            }, [bundleHeightField]);

            addLogic(scQtyField, function () {
                //this.value = getSectionQtyValue(scHeightField);

                const value = getSectionQtyValue(scHeightField);

                if (this.value === value) {
                    return;
                }

                this.value = value;

            }, [bundleHeightField]);
        }

        // Bundle qty
        addLogic(bundleQtyField, function () {
            this.value = getBundleQtyValue(bundleHeightField);
        }, [bundleHeightField]);
    });
}

function registerSectionBundleLogic() {
    for (let bundleNo = 1; bundleNo <= 9; bundleNo++) {
        const spNumField = sbField(bundleNo, "SPNUM");
        const descField = sbField(bundleNo, "DESC");
        const qtyField = bundleField(bundleNo, "QTY");
        const heightField = bundleField(bundleNo, "HEIGHT");

        addLogic(spNumField, function () {
            const doorModelId = getDoorModelIdShort();
            const qty = getState(qtyField);
            this.value = qty > 0 ? `SB${doorModelId}0${bundleNo}` : "None";
        }, ["DOOR_MODEL", "WIDTH", "HEIGHT", "NUM_OF_SEC", qtyField]);

        addLogic(descField, function () {
            const height = getState(heightField);
            const qty = getState(qtyField);
            const prefix = getSBPrefix(bundleNo === 1 ? "SB1" : "DEFAULT", height);
            this.value = buildSBDescription(prefix, height, qty);
        }, [...DIMENSION_DEPS, heightField, "DOOR_MODEL", "COLOR", "FACE", "END_CAPS", qtyField, "DESIGN_CODE"]);
    }
}


function registerSectionComponentLogic() {
    BUNDLE_CONFIG.forEach(({ bundleNo, sectionCount }) => {
        for (let s = 1; s <= sectionCount; s++) {
            const spNumField = bundleScField(bundleNo, s, "SPNUM");
            const descField = bundleScField(bundleNo, s, "DESC");
            const heightField = bundleScField(bundleNo, s, "HEIGHT");
            const qtyField = bundleScField(bundleNo, s, "QTY");

            addLogic(spNumField, function () {
                const doorModelId = getDoorModelIdShort();
                const qty = getState(qtyField);
                const index = getBundleIndex(bundleNo, s);

                this.value = qty > 0 ? `SC${doorModelId}0${index}` : "None";
            }, ["DOOR_MODEL", qtyField, ...DIMENSION_DEPS]);

            addLogic(descField, function () {
                const height = getState(heightField);
                const qty = getState(qtyField);
                this.value = buildSCDescription(height, qty);
            }, [...DIMENSION_DEPS, heightField, qtyField, "DOOR_MODEL", "COLOR", "FACE", "END_CAPS", "DESIGN_CODE"]);
        }
    });
}


function registerRawPanelLogic() {
    BUNDLE_CONFIG.forEach(({ bundleNo, sectionCount }) => {
        for (let s = 1; s <= sectionCount; s++) {
            const spNumField = bundleRpField(bundleNo, s, "SPNUM");
            const descField = bundleRpField(bundleNo, s, "DESC");
            const heightField = bundleScField(bundleNo, s, "HEIGHT");
            const qtyField = bundleScField(bundleNo, s, "QTY");

            addLogic(spNumField, function () {
                const height = getState(heightField);
                const index = getBundleIndex(bundleNo, s);
                this.value = buildRPSPNum(height, index);
            }, ["DOOR_MODEL", heightField, ...DIMENSION_DEPS]);

            addLogic(descField, function () {
                const height = getState(heightField);
                const qty = getState(qtyField);
                this.value = buildRPDescription(height, qty);
            }, [...DIMENSION_DEPS, "DOOR_MODEL", "COLOR", "FACE", heightField, qtyField, "DESIGN_CODE"]);
        }
    });
}

function registerRawPanelBaseLogic() {
    BUNDLE_CONFIG.forEach(({ bundleNo, sectionCount }) => {
        for (let s = 1; s <= sectionCount; s++) {
            const fieldName = `BUNDLE${bundleNo}_SC${s}_RP_BASE_SPNUM`;
            const heightField = bundleScField(bundleNo, s, "HEIGHT");

            addLogic(fieldName, function () {
                const height = getState(heightField);
                this.value = buildRPBaseSpNum(height);
            }, ["DOOR_MODEL", heightField, ...DIMENSION_DEPS]);
        }
    });

    addLogic("RP_BASE_QTY", function () {
        this.value = getState("WIDTH");
    }, ["WIDTH"]);
}

function registerRawPanelTopSheetLogic() {
    BUNDLE_CONFIG.forEach(({ bundleNo, sectionCount }) => {
        for (let s = 1; s <= sectionCount; s++) {
            const fieldName = `BUNDLE${bundleNo}_SC${s}_RP_TOP_SHEET_SPNUM`;
            const heightField = bundleScField(bundleNo, s, "HEIGHT");

            addLogic(fieldName, function () {
                const height = getState(heightField);
                this.value = buildRPTopSpNum(height);
            }, [heightField, "COLOR", ...DIMENSION_DEPS]);
        }
    });
}

function registerBottomRetainerLogic() {
    addLogic("BOTTOM_RETAINER", function () {
        const width = getState("WIDTH");

        const ranges = [
            { max: 96, code: "328-790-080" },
            { max: 108, code: "328-790-090" },
            { max: 120, code: "328-790-100" },
            { max: 144, code: "328-790-120" },
            { max: 168, code: "328-790-140" },
            { max: 180, code: "328-790-150" },
            { max: 192, code: "328-790-160" },
            { max: 216, code: "328-790-180" },
            { max: 240, code: "328-790-200" }
        ];

        let value = "";

        for (let i = 0; i < ranges.length; i++) {
            if (width <= ranges[i].max) {
                value = ranges[i].code;
                break;
            }
        }

        this.value = value;
    }, ["WIDTH"]);

    addLogic("BTM_SEAL_QTY", function () {
        const width = getState("WIDTH");
        this.value = (Number(width) / 12) + 0.5;
    }, ["WIDTH"]);

    addLogic("BTM_RETAINER_SCREW_QTY", function () {
        const widthFeet = getState("DOOR_WIDTH_FEET");
        this.value = Number(widthFeet) + 2;
    }, ["DOOR_WIDTH_FEET"]);
}



function registerEndCapsLogic() {
    BUNDLE_CONFIG.forEach(({ bundleNo, sectionCount }) => {
        for (let s = 1; s <= sectionCount; s++) {
            const fieldName = `BUNDLE${bundleNo}_SC${s}_END_CAPS_SPNUM`;
            const heightField = bundleScField(bundleNo, s, "HEIGHT");

            addLogic(fieldName, function () {
                const endCaps = getState("END_CAPS");
                const doorModel = getState("DOOR_MODEL");
                const sectionHeight = getState(heightField);

                if (bundleNo >= 3) {
                    this.value = sectionHeight > 0
                        ? getEndCapsPartNum(sectionHeight, doorModel, endCaps)
                        : "None";
                } else {
                    this.value = getEndCapsPartNum(sectionHeight, doorModel, endCaps);
                }
            }, [heightField, "DOOR_MODEL", "END_CAPS"]);
        }
    });
}

function registerPackagingLogic() {
    addLogic("PKG_QTY", function () {
        this.value = Number(getState("WIDTH") / 12).toFixed(1);
    }, ["WIDTH"]);

    // Bundles 1-4 have both DBL and SGL
    for (let i = 1; i <= 4; i++) {
        const heightField = bundleField(i, "HEIGHT");

        addLogic(`BUNDLE_${i}_PKG_QTY_DBL`, function () {
            const height = Number(getState(heightField)) || 0;
            this.value = height > 32 ? getState("PKG_QTY") : 0;
        }, [heightField]);

        addLogic(`BUNDLE_${i}_PKG_QTY_SGL`, function () {
            const height = Number(getState(heightField)) || 0;
            this.value = height > 0 && height < 32 ? getState("PKG_QTY") : 0;
        }, [heightField]);
    }

    // Bundles 5-9 only have SGL
    for (let i = 5; i <= 9; i++) {
        const heightField = bundleField(i, "HEIGHT");

        addLogic(`BUNDLE_${i}_PKG_QTY_SGL`, function () {
            const height = Number(getState(heightField)) || 0;
            this.value = height > 0 && height < 32 ? getState("PKG_QTY") : 0;
        }, [heightField]);
    }
}


//==========================================================
// END CAPS PART NUMBER
// ==========================================================

function getEndCapsPartNum(section_height, door_model, end_caps) {

    const partNumbers = {
        A: { // L138
            N: { // Single
                18: '426-0800',
                21: '426-0801',
                24: '426-0802'
            },
            Y: { // Double
                18: '426-0805',
                21: '426-0806',
                24: '426-0807'
            }
        },
        D: { // L200 (any non-"A" model)
            N: {
                18: '426-0810',
                21: '426-0811',
                24: '426-0812'
            },
            Y: {
                18: '426-0815',
                21: '426-0816',
                24: '426-0817'
            }
        }
    };

    // If door_model is not "A", treat it as L200
    //const modelKey = door_model === "A" ? "A" : "B";

    // If end_caps is not "N", treat as double
    //const capKey = end_caps === "N" ? "N" : "Y";
    // console.log("end caps part$", partNumbers[door_model]?.[end_caps]?.[section_height]);
    return partNumbers[door_model]?.[end_caps]?.[section_height] || null;
}






//function to get the section component desc
function buildSCDescription(height, qty) {

    let doorWidthFeet = getState("DOOR_WIDTH_FEET");
    doorWidthFeet = String(doorWidthFeet).padStart(2, "0");

    const doorWidthInches = getState("DOOR_WIDTH_INCHES");
    const doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc");
    const color = getState("COLOR").desc;
    const panelStyle = getNode("FACE").getAttribute("desc");

    const endCaps = getState("END_CAPS");
    const doubleEndCaps = endCaps === "Y" ? "DE" : "";

    let panel_desc = '';
    panel_desc = panelStyle != "mixed" ? panelStyle : getNode("DESIGN_CODE").getAttribute("pattern");

    return qty > 0
        ? `SC ${doorWidthFeet}-${doorWidthInches}x${height} ${doorModelDesc} ${color} ${panel_desc} ${doubleEndCaps}`
        : "";
}

//function to get the desc of raw panel 
function buildRPDescription(height, qty) {

    let doorWidthFeet = getState("DOOR_WIDTH_FEET");
    doorWidthFeet = String(doorWidthFeet).padStart(2, "0");

    const doorWidthInches = getState("DOOR_WIDTH_INCHES");
    const doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc");
    const color = getState("COLOR").desc;
    const panelStyle = getNode("FACE").getAttribute("desc");

    let panel_desc = '';
    panel_desc = panelStyle != "mixed" ? panelStyle : getNode("DESIGN_CODE").getAttribute("pattern");

    return qty > 0
        ? `SR ${doorWidthFeet}-${doorWidthInches}x${height} ${doorModelDesc} ${color} ${panel_desc}`
        : "";
}

//function to get the raw panel base part#
function buildRPBaseSpNum(height) {
    const doorModelId = getNode("DOOR_MODEL").getAttribute("id");
    return `RB-${doorModelId}-${height}S`;
}


function buildRPTopSpNum(height) {
    const color = getState("COLOR")?.value;
    const codeMap = {
        18: '034',
        21: '032',
        24: '033',
        28: '034',
        32: '035'
    };

    const code = codeMap[height];
    return `127-${code}${color}`;
}


//function to build section bundle desc
function buildSBDescription(prefix, height, qty) {

    if (qty <= 0) return "";

    let doorWidthFeet = getState("DOOR_WIDTH_FEET");
    doorWidthFeet = String(doorWidthFeet).padStart(2, "0");

    const doorWidthInches = getState("DOOR_WIDTH_INCHES");
    const doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc");
    const color = getState("COLOR").desc;
    const panelStyle = getNode("FACE").getAttribute("desc");

    const endCaps = getState("END_CAPS");
    const doubleEndCaps = endCaps === "Y" ? "DE" : "";

    let panel_desc = '';
    panel_desc = panelStyle != "mixed" ? panelStyle : getNode("DESIGN_CODE").getAttribute("pattern");

    return `${prefix} ${doorWidthFeet}-${doorWidthInches}x${height} ${doorModelDesc} ${color} ${panel_desc} ${doubleEndCaps}`;
}

function getSBPrefix(type, height) {

    switch (type) {

        case "SB1":
            return height < 32 ? "SB-B" : "SB-BI";

        default:
            return height > 32 ? "SB-II" : "SB-I";
    }
}

//function to create raw panel part#
function buildRPSPNum(height, suffix) {

    const doorModelId = getNode("DOOR_MODEL")
        .getAttribute("id")
        .substring(1);

    return height > 0
        ? `SR${doorModelId}0${suffix}`
        : "None";

}
