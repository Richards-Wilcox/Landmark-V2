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
    "WINDOW_POSITION",
    "GLASS_SHAPE"
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
    registerSectionCalculationLogic();
    registerEndCapsLogic();
    registerPackagingLogic();

}

function getBundles() {
    return bundleByHeight();
}

function getBundle(bundleNo) {
    const bundles = getBundles();
    return bundles[bundleNo - 1];
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

        this.value = `${doorType} ${getState("DOOR_WIDTH_FEET")}-0x${getState("DOOR_HEIGHT_FEET")}-0(${numOfSec}) ${doorModel} ${color} ${panelStyle}`;
    }, ["WIDTH", ...DIMENSION_DEPS, "HEIGHT", "DOOR_MODEL", "COLOR", "customSwitch", "FACE"]);
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
        }, [...DIMENSION_DEPS, heightField, "DOOR_MODEL", "COLOR", "FACE", "END_CAPS", qtyField]);
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
            }, [...DIMENSION_DEPS, heightField, qtyField, "DOOR_MODEL", "COLOR", "FACE", "END_CAPS"]);
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
            }, [...DIMENSION_DEPS, "DOOR_MODEL", "COLOR", "FACE", heightField, qtyField]);
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

function registerSectionCalculationLogic() {
    addLogic("SHORTEST_SECTION", function () {
        const doorHeight = getState("HEIGHT");
        const numOfSec = getState("NUM_OF_SEC");

        this.value = Math.floor((doorHeight / numOfSec) / 3) * 3;
    }, ["HEIGHT", "NUM_OF_SEC", "WIDTH"]);

    addLogic("SHORTEST_SECTIONS_QTY", function () {
        const numOfSec = getState("NUM_OF_SEC");
        const doorHeight = getState("HEIGHT");
        const shortestSection = getState("SHORTEST_SECTION");
        const diff = (doorHeight / numOfSec) - shortestSection;

        this.value = Math.round((1 - (diff / 3)) * numOfSec);
    }, ["HEIGHT", "NUM_OF_SEC", "SHORTEST_SECTION"]);

    addLogic("TALLEST_SECTION", function () {
        const doorHeight = getState("HEIGHT");
        const numOfSec = getState("NUM_OF_SEC");

        this.value = Math.ceil((doorHeight / numOfSec) / 3) * 3;
    }, ["HEIGHT", "NUM_OF_SEC"]);

    addLogic("TALLEST_SECTION_QTY", function () {
        const doorHeight = getState("HEIGHT");
        const numOfSec = getState("NUM_OF_SEC");

        this.value = Math.round((((doorHeight / numOfSec) - getState("SHORTEST_SECTION")) / 3) * numOfSec);
    }, ["HEIGHT", "NUM_OF_SEC", "SHORTEST_SECTION"]);
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


// ==========================================================
// SECTION BUILDING
// ==========================================================

function getSectionBundle() {

    const shortestQty =
        Math.ceil(Number(getState("SHORTEST_SECTIONS_QTY"))) || 0;

    const shortestSection =
        Number(getState("SHORTEST_SECTION")) || 0;

    const tallestQty =
        Math.ceil(Number(getState("TALLEST_SECTION_QTY"))) || 0;

    const tallestSection =
        Number(getState("TALLEST_SECTION")) || 0;

    // Create sorted DESC array
    const sections = [
        ...Array(shortestQty).fill(shortestSection),
        ...Array(tallestQty).fill(tallestSection),
    ].sort((a, b) => b - a);

    const length = sections.length;
    const result = new Array(length);

    // Build placement order
    const positions = [];

    let bottom = 0;
    let top = length - 1;

    // 1st -> TOP
    positions.push(top);
    top--;

    // 2nd -> BOTTOM
    if (bottom <= top + 1) {
        positions.push(bottom);
        bottom++;
    }

    // Remaining:
    // bottom+1
    // top-1
    // bottom+2
    // top-2
    while (bottom <= top) {

        // bottom side
        positions.push(bottom);
        bottom++;

        // top side
        if (bottom <= top) {
            positions.push(top);
            top--;
        }
    }

    // Assign values
    sections.forEach((section, index) => {
        result[positions[index]] = section;
    });

    return result;
}


// ==========================================================
// BUNDLING
// ======================================================

function bundleByHeight() {
    const width = Number(getState("WIDTH"));
    const sections = getSectionBundle();

    const window_position = getState("WINDOW_POSITION");
    const glass_shape = getState("GLASS_SHAPE");

    const isGlazed =
        // window_position &&
        // window_position !== "undefined" &&
        glass_shape &&
        glass_shape !== "undefined";

    const result = [];

    if (!sections.length) return result;

    // =========================================
    // WIDTH RULE
    // =========================================
    if (width >= 199) {
        return sections.map((h, i) => ({
            sections: [h],
            indexes: [i + 1],
            weight: calculateSectionShipWeight(h, false)
        }));
    }

    const used = new Array(sections.length).fill(false);

    // =========================================
    // GLAZED RULE
    // TOP + BOTTOM BUNDLE IF SAME HEIGHT
    // =========================================
    if (isGlazed) {

        const bottomHeight = sections[0];
        const topHeight = sections[sections.length - 1];

        if (bottomHeight === topHeight) {

            result.push({
                sections: [bottomHeight, topHeight],
                indexes: [1, sections.length],
                weight:
                    calculateSectionShipWeight(bottomHeight, true) +
                    calculateSectionShipWeight(topHeight, false)
            });

            used[0] = true;
            used[sections.length - 1] = true;

        }
    }

    // =========================================
    // NORMAL RULE
    // bottom single only if not already used
    // =========================================
    if (!used[0]) {

        result.push({
            sections: [sections[0]],
            indexes: [1],
            weight: calculateSectionShipWeight(sections[0], true)
        });

        used[0] = true;
    }

    // =========================================
    // FORWARD NEAREST MATCH BUNDLING
    // =========================================
    for (let i = 1; i < sections.length; i++) {

        if (used[i]) continue;

        const height = sections[i];
        const bundleIndexes = [i + 1];

        used[i] = true;

        // nearest forward same height
        for (let j = i + 1; j < sections.length; j++) {

            if (!used[j] && sections[j] === height) {

                bundleIndexes.push(j + 1);
                used[j] = true;
                break;
            }
        }

        const weight = bundleIndexes.reduce((sum) => {
            return sum + calculateSectionShipWeight(height, false);
        }, 0);

        result.push({
            sections: bundleIndexes.map(() => height),
            indexes: bundleIndexes,
            weight
        });
    }


    return result;
}


function calculateRawPanelWeight(sectionHeightInInches) {
    let RPWeight = getState("DOOR_MODEL") === "A" ? 1.775 : 1.74;

    let width = Number(getState("DOOR_WIDTH_FEET")) || 0;
    const sectionHeightInFeet = sectionHeightInInches / 12;
    let areaSqFt = (width * sectionHeightInFeet);
    const totalWeight = Number((RPWeight * areaSqFt).toFixed(2));
    // console.log("raw panel weight", totalWeight);

    return totalWeight;
}

function calculateEndCaps(sectionHeightInInches) {
    let getEndCaps = getState("END_CAPS");
    let sectionHeightInFeet = sectionHeightInInches / 12;
    let weightPerFoot;

    if (getEndCaps === "N") { //case single
        weightPerFoot = getState("DOOR_MODEL") === "A" ? 1.02 : 1.14;
    } else {
        weightPerFoot = getState("DOOR_MODEL") === "A" ? 3.07 : 3.3;
    }

    // console.log("totalEndCapsWeight", Number((sectionHeightInFeet * weightPerFoot).toFixed(2)));
    return Number((sectionHeightInFeet * weightPerFoot).toFixed(2));
}

function calculateBTMRetainer(isBottomSection = true) { //only for bottom section
    if (!isBottomSection) return 0;
    const width = Number(getState("DOOR_WIDTH_FEET")) || 0;
    //console.log("btmRetainerWeight", btmRetainerWeight);
    return Number((width * 0.4).toFixed(2));

}

//function to calculate shipping weight
function calculateSectionShipWeight(sectionHeightInInches, isBottomSection = true) {
    let RPWeight = calculateRawPanelWeight(sectionHeightInInches);
    let EndCapsWeight = calculateEndCaps(sectionHeightInInches);
    let btmWeight = isBottomSection ? calculateBTMRetainer(Number(getState("DOOR_WIDTH_FEET")) || 0) : 0;
    let lites = 0;
    let pck_weight = 0.15;

    return Number((RPWeight + EndCapsWeight + btmWeight + lites + pck_weight).toFixed(2));
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

    return qty > 0
        ? `SC ${doorWidthFeet}-${doorWidthInches}x${height} ${doorModelDesc} ${color} ${panelStyle} ${doubleEndCaps}`
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

    return qty > 0
        ? `SR ${doorWidthFeet}-${doorWidthInches}x${height} ${doorModelDesc} ${color} ${panelStyle}`
        : "";
}

//function to get the raw panel base part#
function buildRPBaseSpNum(height) {
    const doorModelId = getNode("DOOR_MODEL").getAttribute("id");
    return `${doorModelId}-${height}`;
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


    return `${prefix} ${doorWidthFeet}-${doorWidthInches}x${height} ${doorModelDesc} ${color} ${panelStyle} ${doubleEndCaps}`;
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
