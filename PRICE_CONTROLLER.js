
let _bundleCache = null;
let _bundleCacheKey = null;

let _doorInfoCache = null;
let _doorInfoCacheKey = null;

let _sectionFlagsCache = null;
let _sectionFlagsCacheKey = null;

let _reversedSectionsCache = null;
let _reversedSectionsKey = null;

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

const L138SingleSlim = {
    "CLEAR": "54S-101",
    "SATIN": "54S-111",
    "BLACK_SATIN_SEALED": "54S-121",
}

const L138DoubleSlim = {
    "CLEAR": "54L-101",
    "SATIN": "54L-111",
    "BLACK_SATIN_SEALED": "54L-121",
}

const L200SingleSlim = {
    "CLEAR": "55S-201",
    "SATIN": "55S-211",
    "BLACK_SATIN_SEALED": "55S-221",
}

const L200DoubleSlim = {
    "CLEAR": "55L-201",
    "SATIN": "55L-211",
    "BLACK_SATIN_SEALED": "55L-221",
}

const glassTypeColonialMapTemp = {
    "CLEAR": "024",
    "CLEAR_SINGLE": "009",
    "OBSCURE_GLASS_PINHEAD": "026",
    "OBSCURE_GLASS_SINGLE": "027",
    "DARK_TINT_SEALED": "034",
    "DARK_TINT_SINGLE": "035"
};


const glassTypeRanchMapTemp = {
    "CLEAR": "524",
    "CLEAR_SINGLE": "509",
    "OBSCURE_GLASS_PINHEAD": "526",
    "OBSCURE_GLASS_SINGLE": "527",
    "DARK_TINT_SEALED": "534",
    "DARK_TINT_SINGLE": "535",
};


const GLASS_QTY_FIELDS = [
    { bundleIndex: 0, sectionIndex: 0, field: "GLASS_QTY_B1_SC1" },
    { bundleIndex: 0, sectionIndex: 1, field: "GLASS_QTY_B1_SC2" },

    { bundleIndex: 1, sectionIndex: 0, field: "GLASS_QTY_B2_SC1" },
    { bundleIndex: 1, sectionIndex: 1, field: "GLASS_QTY_B2_SC2" },

    { bundleIndex: 2, sectionIndex: 0, field: "GLASS_QTY_B3_SC1" },
    { bundleIndex: 2, sectionIndex: 1, field: "GLASS_QTY_B3_SC2" },

    { bundleIndex: 3, sectionIndex: 0, field: "GLASS_QTY_B4_SC1" },
    { bundleIndex: 3, sectionIndex: 1, field: "GLASS_QTY_B4_SC2" },

    { bundleIndex: 4, sectionIndex: 0, field: "GLASS_QTY_B5_SC1" },
    { bundleIndex: 5, sectionIndex: 0, field: "GLASS_QTY_B6_SC1" },
    { bundleIndex: 6, sectionIndex: 0, field: "GLASS_QTY_B7_SC1" },
    { bundleIndex: 7, sectionIndex: 0, field: "GLASS_QTY_B8_SC1" },
    { bundleIndex: 8, sectionIndex: 0, field: "GLASS_QTY_B9_SC1" }
];

const SCREW_QTY_FIELDS = [
    { field: "SCREW_QTY_B1_SC1", glassField: "GLASS_QTY_B1_SC1" },
    { field: "SCREW_QTY_B1_SC2", glassField: "GLASS_QTY_B1_SC2" },

    { field: "SCREW_QTY_B2_SC1", glassField: "GLASS_QTY_B2_SC1" },
    { field: "SCREW_QTY_B2_SC2", glassField: "GLASS_QTY_B2_SC2" },

    { field: "SCREW_QTY_B3_SC1", glassField: "GLASS_QTY_B3_SC1" },
    { field: "SCREW_QTY_B3_SC2", glassField: "GLASS_QTY_B3_SC2" },

    { field: "SCREW_QTY_B4_SC1", glassField: "GLASS_QTY_B4_SC1" },
    { field: "SCREW_QTY_B4_SC2", glassField: "GLASS_QTY_B4_SC2" },

    { field: "SCREW_QTY_B5_SC1", glassField: "GLASS_QTY_B5_SC1" },
    { field: "SCREW_QTY_B6_SC1", glassField: "GLASS_QTY_B6_SC1" },
    { field: "SCREW_QTY_B7_SC1", glassField: "GLASS_QTY_B7_SC1" },
    { field: "SCREW_QTY_B8_SC1", glassField: "GLASS_QTY_B8_SC1" },
    { field: "SCREW_QTY_B9_SC1", glassField: "GLASS_QTY_B9_SC1" }
];

const mixedInsertRanchMap = {
    stockton_colonial: "stockton_ranch",
    waterton_colonial: "waterton_ranch",
    cascade_colonial: "cascade_ranch",
    prairie: "prairie"
};



function getPrice() {
    registerSectionCalculationLogic();
    registerGlazingCalculationLogic();

    // addNode({
    //     id: "PRICEBOOK",
    //     value: "",
    //     logic: function () {
    //         let solutions;
    //         try {
    //             solutions = $.ajax({
    //                 method: "POST",
    //                 url: "/spr/custom/jpoc/json/1728612690"
    //             });
    //         } catch (err) {
    //             console.log("Spring API failed to load price", err);
    //             // Return a valid default object       
    //         }
    //         this.value = solutions;
    //         //console.log("data pricebook", solutions);
    //     }
    // }, [""])


    //door face price - dummy
    addLogic("DOOR_FACE_PRICE", function () {
        const width = getState("WIDTH") / 12;
        const height = getState("HEIGHT") / 12;
        const doorModel = getState("DOOR_MODEL");

        const sqft = width * height;

        const rate =
            doorModel === "A"
                ? 66.66
                : 77.77;

        this.value = +(sqft * rate).toFixed(2);
        $("#DOOR_FACE_PRICE").val(this.value);

    }, ["DOOR_MODEL", "WIDTH", "HEIGHT"])

    addLogic("GLAZING_PRICE", function () {        
        // const pricebookJson = getState("PRICEBOOK")?.responseJSON?.[0] || {};
        const pricebookJson = window.PRICEBOOK_CACHE || {};
        const face = getState("FACE");

        const {
            total_glass_qty = 0,
            total_temp_glass_qty = 0,
            total_colonial_glass_qty = 0,
            total_ranch_glass_qty = 0
        } = getGlassTotals();

        const totalGlassQty = Number(total_glass_qty);
        const totalTempGlassQty = Number(total_temp_glass_qty);
        const totalMixedColQty = Number(total_colonial_glass_qty);
        const totalMixedRncQty = Number(total_ranch_glass_qty);

        const window1 = getState("WINDOW_1");
        const window2 = getState("WINDOW_2");
        const insert1 = getState("INSERT_1");
        const insert2 = getState("INSERT_2");
        const exteriorFrame1 = getState("EXTERIOR_FRAME_1");
        const exteriorFrame2 = getState("EXTERIOR_FRAME_2");
        const interiorFrame1 = getState("INTERIOR_FRAME_1");
        const interiorFrame2 = getState("INTERIOR_FRAME_2");
        const frameKit = getState("FRAME_KIT");

        if (window1 === "None") {
            this.value = 0;
            return;
        }

        const window_1_price = Number(pricebookJson[window1]) || 0;
        const window_2_price = Number(pricebookJson[window2]) || 0;
        const insert_1_price = Number(pricebookJson[insert1]) || 0;
        const insert_2_price = Number(pricebookJson[insert2]) || 0;
        const ext_frame_1_price = Number(pricebookJson[exteriorFrame1]) || 0;
        const ext_frame_2_price = Number(pricebookJson[exteriorFrame2]) || 0;
        const int_frame_1_price = Number(pricebookJson[interiorFrame1]) || 0;
        const int_frame_2_price = Number(pricebookJson[interiorFrame2]) || 0;
        const frame_kit = Number(pricebookJson[frameKit]) || 0;


        let total_glass_price = 0;
        let total_insert_price = 0;
        let total_ext_frame_price = 0;
        let total_int_frame_price = 0;
        let total_frame_kit = 0;


        // Mixed panel
        if (face === "M") {

            // glass price
            const mixed_col_price = window_1_price * totalMixedColQty;
            const mixed_ranch_price = window_2_price * totalMixedRncQty;

            total_glass_price = mixed_col_price + mixed_ranch_price;

            //insert price
            const mixed_col_insert_price = insert_1_price * totalMixedColQty;
            const mixed_ranch_insert_price = insert_2_price * totalMixedRncQty;

            total_insert_price = mixed_col_insert_price + mixed_ranch_insert_price;

            //ext frame price
            const mixed_col_ext_price = ext_frame_1_price * totalMixedColQty;
            const mixed_ranch_ext_price = ext_frame_2_price * totalMixedRncQty;

            total_ext_frame_price = mixed_col_ext_price + mixed_ranch_ext_price;

            //interior frame price
            const mixed_col_int_price = int_frame_1_price * totalMixedColQty;
            const mixed_ranch_int_price = int_frame_2_price * totalMixedRncQty;

            total_int_frame_price = mixed_col_int_price + mixed_ranch_int_price;

            // console.log({
            //     mixed_col_price,
            //     mixed_ranch_price,
            //     totalMixedColQty,
            //     totalMixedRncQty,
            //     mixed_col_insert_price,
            //     mixed_ranch_insert_price,
            //     total_int_frame_price

            // });
        }

        // Standard + Tempered
        else {
            // glass price 
            const standard_price = window_1_price * totalGlassQty;
            const tempered_price = window_2_price * totalTempGlassQty;
            total_glass_price = standard_price + tempered_price;

            // Insert            
            const totalWindowQty = totalGlassQty + totalTempGlassQty;
            total_insert_price = insert_1_price * totalWindowQty;

            const useFrameKit = getState("SLIM_YES_NO_FOR_FRAMES") === "Y";

            if (useFrameKit) {
                total_frame_kit = frame_kit * totalWindowQty

            } else {
                // Exterior Frame            
                total_ext_frame_price = ext_frame_1_price * totalWindowQty;

                //interior frame
                total_int_frame_price = int_frame_1_price * totalWindowQty;

            }

            // console.log({
            //     standard_price,
            //     tempered_price,
            //     totalGlassQty,
            //     totalTempGlassQty,
            //     total_insert_price,
            //     total_ext_frame_price,
            //     total_int_frame_price,
            //     total_frame_kit
            // });
        }

        this.value = total_glass_price + total_insert_price + total_ext_frame_price + total_int_frame_price + total_frame_kit;

        // console.log("GLAZING PRICE", this.value);

        // /"RENDER"
    }, ["WINDOW_1", "WINDOW_2", "INSERT_1", "INSERT_2", "CUSTOM_WINDOWS", "SLIM_YES_NO_FOR_FRAMES"]);

    addLogic("HARDWARE_PRICE", function () {

    }, [""])

    addLogic("OPERATORS_PRICE", function () {

    }, [""])


    addNode(
        {
            id: "PRICE",
            logic: function () {
                this.value = calculateTotalPrice();
            },
            value: 0,
        },
        ["DOOR_FACE_PRICE", "HARDWARE_PRICE", "OPERATORS_PRICE", "GLAZING_PRICE"]
    );

    addLogic(
        "PRICE_DISPLAY",
        function () {
            const price = Number(getState("PRICE"));
            this.value = "$" + (Number.isFinite(price) ? price : 0).toFixed(2);
        },
        ["PRICE"],
    );

}

function calculateScrewQtyPerSection(glassField) {
    const face = getState("FACE");
    const glass_shape = getState("GLASS_SHAPE") || "";
    const door_model = getState("DOOR_MODEL");

    const primaryGlassQty =
        Number(getState(glassField)) || 0;

    const tempOrMixedGlassQty =
        Number(getState(`${glassField}_TEMP_OR_MIXED`)) || 0;

    /*
     * Mixed panel:
     * Primary qty represents Colonial windows.
     * TEMP_OR_MIXED qty represents Ranch windows.
     */
    if (face === "M") {
        const colonialScrewQty = 10;
        const ranchScrewQty = 18;

        return (
            primaryGlassQty * colonialScrewQty +
            tempOrMixedGlassQty * ranchScrewQty
        );
    }

    /*
     * Non-mixed:
     * Primary qty represents regular glass.
     * TEMP_OR_MIXED qty represents tempered glass.
     *
     * Both use the same screw quantity based on glass shape.
     */
    let screwsPerWindow = 0;

    if (glass_shape === "colonial") {
        screwsPerWindow = 10;
    } else if (glass_shape === "ranch") {
        screwsPerWindow = 18;
    } else if (glass_shape === "slim_single") {
        screwsPerWindow = door_model === "D" ? 12 : 14;
    } else if (glass_shape === "slim_double") {
        screwsPerWindow = door_model === "D" ? 20 : 22;
    }

    const totalGlassQty =
        primaryGlassQty + tempOrMixedGlassQty;

    return totalGlassQty * screwsPerWindow;
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


// function getBundles() {
//     return bundleByHeight();
// }

function getBundles() {

    const key = [
        getState("WIDTH"),
        getState("HEIGHT"),
        getState("NUM_OF_SEC"),
        getState("GLASS_SHAPE")
    ].join("|");

    if (key === _bundleCacheKey) {        
        return _bundleCache;
    }
    _bundleCacheKey = key;
    _bundleCache = bundleByHeight();

    return _bundleCache;
}
``

function getBundle(bundleNo) {
    const bundles = getBundles();
    return bundles[bundleNo - 1];
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
    const RPWeight =
        getState("DOOR_MODEL") === "A"
            ? 1.775
            : 1.74;

    const width = Number(getState("DOOR_WIDTH_FEET")) || 0;
    const sectionHeightInFeet = sectionHeightInInches / 12;

    const areaSqFt = width * sectionHeightInFeet;

    const totalWeight = Number((RPWeight * areaSqFt).toFixed(2));

    return totalWeight;
}

function calculateEndCaps(sectionHeightInInches) {
    const endCaps = getState("END_CAPS");
    const sectionHeightInFeet = sectionHeightInInches / 12;
    let weightPerFoot;

    if (endCaps === "N") { //case single
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
    const RPWeight = calculateRawPanelWeight(sectionHeightInInches);
    const EndCapsWeight = calculateEndCaps(sectionHeightInInches);
    // let btmWeight = isBottomSection ? calculateBTMRetainer(Number(getState("DOOR_WIDTH_FEET")) || 0) : 0;
    const btmWeight = isBottomSection
        ? calculateBTMRetainer()
        : 0;
    const lites = 0;
    const pck_weight = 0.15;

    return Number((RPWeight + EndCapsWeight + btmWeight + lites + pck_weight).toFixed(2));
}


function getGlassQtyByBundleSection(bundleIndex, sectionIndexInBundle, qtyFieldName) {    
    const bundle = getBundles()[bundleIndex];
    // const sections = getDoorInfo().sections.slice().reverse();
    const sections = getReversedSectionsCached();

    const sectionIndex =
        bundle?.indexes?.[sectionIndexInBundle];

    if (!sectionIndex) {
        return 0;
    }

    return Number(sections[sectionIndex - 1]?.[qtyFieldName]) || 0;
}


function getReversedSections() {
    return getDoorInfoCached()
        .sections
        .slice()
        .reverse();
}

function registerGlazingCalculationLogic() {

    const GLASS_QTY_DEPS = [
        "WINDOW_POSITION",
        "GLASS_SHAPE",
        "GLASS_TYPE",
        "GLASS_TEMPERED",
        ...BUNDLE_DEPS,
        "FACE",
        "DESIGN_CODE",
        "WINDOW_STATE"
    ]
    // addLogic("WINDOW_1", function () {

    //     const door_model = getState("DOOR_MODEL");
    //     const glass_shape = getState("GLASS_SHAPE") || "";
    //     const glass_type = getState("GLASS_TYPE") || "";
    //     const section = getDoorInfo().sections.slice().reverse();

    //     let window_code = "";

    //     //Mixed Panel
    //     if (getState("FACE") === 'M') {
    //         if (!glass_type) {
    //             this.value = "None";
    //         }
    //         window_code = glassTypeColonialMap[glass_type] || "";
    //         if (!window_code) {
    //             this.value = "None";
    //             return;
    //         }
    //         this.value = `552-${window_code}`;
    //         return;
    //     }

    //     // Non-Mixed
    //     if (!glass_shape || !glass_type) {
    //         this.value = "None";
    //         return;
    //     }

    //     if (glass_shape === "colonial") {
    //         window_code = glassTypeColonialMap[glass_type] || "";
    //     }
    //     else if (glass_shape === 'ranch') {
    //         window_code = glassTypeRanchMap[glass_type] || "";
    //     }

    //     if (getState("FACE") === 'M' && !glass_type) {
    //         window_code = glassTypeColonialMap[glass_type] || "";
    //     }

    //     if (glass_shape === 'slim_single') {
    //         if (door_model === "A") {
    //             window_code = L138SingleSlim[glass_type] || "";
    //         } else if (door_model === "D") {
    //             window_code = L200SingleSlim[glass_type] || "";
    //         }

    //     } else if (glass_shape === 'slim_double') {
    //         if (door_model === "A") {
    //             window_code = L138DoubleSlim[glass_type] || "";
    //         } else if (door_model === "D") {
    //             window_code = L200DoubleSlim[glass_type] || "";
    //         }
    //     }

    //     const isCustomSlim =
    //         getState("WINDOW_POSITION") === "custom" &&
    //         glass_shape.includes("slim");

    //     if (isCustomSlim) {

    //         if (door_model === "A") {
    //             this.value = L138SingleSlim[glass_type] || "None";
    //         } else {
    //             this.value = L200SingleSlim[glass_type] || "None";
    //         }

    //         return;
    //     }

    //     if (!window_code) {
    //         this.value = "None";
    //         return;
    //     }

    //     if (glass_shape.includes("slim")) {
    //         this.value = `${window_code}`;
    //     }
    //     else this.value = `552-${window_code}`;
    // }, ["GLASS_SHAPE", "FRAME_COLOR", "DOOR_MODEL", "GLASS_TYPE", "FACE"]);


    // addLogic("WINDOW_2", function () {
    //     // Purpose of this to show temp window logic as well as for mixed panel ranch window
    //     const door_model = getState("DOOR_MODEL");
    //     const glass_shape = getState("GLASS_SHAPE") || "";
    //     const glass_type = getState("GLASS_TYPE") || "";
    //     const temp_glass = getState("GLASS_TEMPERED") || "";

    //     const section = getDoorInfo().sections.slice().reverse();

    //     let window_code = "";
    //     //Mixed
    //     //Mixed Panel
    //     if (getState("FACE") === 'M') {
    //         if (!glass_type) {
    //             this.value = "None";
    //         }
    //         window_code = glassTypeRanchMap[glass_type] || "";
    //         if (!window_code) {
    //             this.value = "None";
    //             return;
    //         }
    //         this.value = `552-${window_code}`;
    //         return;
    //     }


    //     //Non-Mixed
    //     if (!glass_shape || !glass_type || !temp_glass) {
    //         this.value = "0";
    //         return;
    //     }

    //     if (getState("FACE") === 'M' && !glass_type) {
    //         window_code = glassTypeRanchMap[glass_type] || "";
    //         this.value = `552-${window_code}`;
    //     }

    //     if (glass_shape === "colonial") {
    //         window_code = glassTypeColonialMapTemp[glass_type] || "";
    //     }
    //     else if (glass_shape === 'ranch') {
    //         window_code = glassTypeRanchMapTemp[glass_type] || "";
    //     }

    //     if (!window_code) {
    //         this.value = "0";
    //         return;
    //     }

    //     this.value = `552-${window_code}`;

    // }, ["GLASS_SHAPE", "FRAME_COLOR", "DOOR_MODEL", "GLASS_TYPE", "GLASS_TEMPERED", "FACE", "DESIGN_CODE"]);


    addLogic("WINDOW_1", function () {        
        const door_model = getState("DOOR_MODEL");
        const glass_shape = getState("GLASS_SHAPE") || "";
        const glass_type = getState("GLASS_TYPE") || "";

        // const sections = getDoorInfo().sections.slice().reverse();
        //const sections = getReversedSectionsCached();

        let window_code = "";

        // ======================
        // CUSTOM SLIM
        // ======================      

        const { hasSlimSingle } = getSectionFlags();

        if (
            getState("WINDOW_POSITION") === "custom" &&
            glass_shape.includes("slim") &&
            hasSlimSingle
        ) {

            this.value =
                door_model === "A"
                    ? (L138SingleSlim[glass_type] || "None")
                    : (L200SingleSlim[glass_type] || "None");

            return;
        }

        // ======================
        // MIXED PANEL
        // ======================

        if (getState("FACE") === "M") {

            if (!glass_type) {
                this.value = "None";
                return;
            }

            window_code =
                glassTypeColonialMap[glass_type] || "";

            if (!window_code) {
                this.value = "None";
                return;
            }

            this.value = `552-${window_code}`;
            return;
        }

        // ======================
        // STANDARD
        // ======================

        if (!glass_shape || !glass_type) {
            this.value = "None";
            return;
        }

        if (glass_shape === "colonial") {
            window_code =
                glassTypeColonialMap[glass_type] || "";
        }

        else if (glass_shape === "ranch") {
            window_code =
                glassTypeRanchMap[glass_type] || "";
        }

        else if (glass_shape === "slim_single") {

            if (door_model === "A") {
                window_code =
                    L138SingleSlim[glass_type] || "";
            } else {
                window_code =
                    L200SingleSlim[glass_type] || "";
            }

        }

        else if (glass_shape === "slim_double") {

            if (door_model === "A") {
                window_code =
                    L138DoubleSlim[glass_type] || "";
            } else {
                window_code =
                    L200DoubleSlim[glass_type] || "";
            }
        }

        if (!window_code) {
            this.value = "None";
            return;
        }

        this.value =
            glass_shape.includes("slim")
                ? window_code
                : `552-${window_code}`;

    }, [
        "GLASS_SHAPE",
        "FRAME_COLOR",
        "DOOR_MODEL",
        "GLASS_TYPE",
        "FACE",
        "WINDOW_STATE",
        "WINDOW_POSITION",
        "CUSTOM_WINDOWS"
    ]);


    addLogic("WINDOW_2", function () {        
        const door_model = getState("DOOR_MODEL");
        const glass_shape = getState("GLASS_SHAPE") || "";
        const glass_type = getState("GLASS_TYPE") || "";
        const temp_glass = getState("GLASS_TEMPERED") || "";

        // const sections = getDoorInfo().sections.slice().reverse();
        //const sections = getReversedSectionsCached();

        // const sections = [...(getState("WINDOW_STATE")?.sections || [])].reverse();

        let window_code = "";

        // ======================
        // CUSTOM SLIM
        // ======================
        const { hasSlimDouble } = getSectionFlags();

        if (
            getState("WINDOW_POSITION") === "custom" &&
            glass_shape.includes("slim") &&
            hasSlimDouble
        ) {

            this.value =
                door_model === "A"
                    ? (L138DoubleSlim[glass_type] || "None")
                    : (L200DoubleSlim[glass_type] || "None");

            return;
        }

        // ======================
        // MIXED PANEL
        // ======================

        if (getState("FACE") === "M") {

            if (!glass_type) {
                this.value = "None";
                return;
            }

            window_code =
                glassTypeRanchMap[glass_type] || "";

            if (!window_code) {
                this.value = "None";
                return;
            }

            this.value = `552-${window_code}`;
            return;
        }

        // ======================
        // STANDARD TEMPERED
        // ======================

        if (!glass_shape || !glass_type || !temp_glass) {
            this.value = "0";
            return;
        }

        if (glass_shape === "colonial") {

            window_code =
                glassTypeColonialMapTemp[glass_type] || "";

        } else if (glass_shape === "ranch") {

            window_code =
                glassTypeRanchMapTemp[glass_type] || "";
        }

        if (!window_code) {
            this.value = "0";
            return;
        }

        this.value = `552-${window_code}`;

    }, [
        "GLASS_SHAPE",
        "FRAME_COLOR",
        "DOOR_MODEL",
        "GLASS_TYPE",
        "GLASS_TEMPERED",
        "FACE",
        "DESIGN_CODE",
        "WINDOW_STATE",
        "WINDOW_POSITION",
        "CUSTOM_WINDOWS"
    ]);

    addLogic("INSERT_1", function () {
        const glass_insert = getState("GLASS_INSERT");
        const insert_color = getState("INSERT_COLOR").value;

        if (!glass_insert || glass_insert === "") {
            this.value = "";
            return;
        }

        const insert_code = getNode("GLASS_INSERT").getAttribute("insertCode");
        this.value = `${insert_code}${insert_color}` ?? "";

    }, ["GLASS_INSERT", "INSERT_COLOR"])

    addLogic("INSERT_2", function () {
        const face = getState("FACE");
        const insert_color = getState("INSERT_COLOR")?.value || "";

        if (face !== "M") {
            this.value = "";
            return;
        }

        const glass_insert = getState("GLASS_INSERT");

        if (!glass_insert || glass_insert === "") {
            this.value = "";
            return;
        }

        const selectedValue =
            typeof glass_insert === "object"
                ? glass_insert.value
                : glass_insert;

        let ranchValue = "";

        if (selectedValue === "stockton_colonial") {
            ranchValue = "stockton_ranch";
        } else if (selectedValue === "waterton_colonial") {
            ranchValue = "waterton_ranch";
        } else if (selectedValue === "cascade_colonial") {
            ranchValue = "cascade_ranch";
        } else if (selectedValue === "prairie") {
            ranchValue = "prairie";
        }

        if (!ranchValue) {
            this.value = "";
            return;
        }

        const ranchInsertCode =
            $(`input[name='GLASS_INSERT'][value='${ranchValue}']`)
                .attr("insertCode") || "";

        if (!ranchInsertCode) {
            this.value = "";
            return;
        }

        this.value = `${ranchInsertCode}${insert_color}`;

    }, ["FACE", "GLASS_INSERT", "INSERT_COLOR"]);

    addLogic("EXTERIOR_FRAME_1", function () {
        const glass_shape = getState("GLASS_SHAPE") || "";
        const color = getState("FRAME_COLOR").value;
        let door_model = getState("DOOR_MODEL");
        let face = getState("FACE");
        let glass_type = getState("GLASS_TYPE");

        if (face === 'M') {
            if (!glass_type) {
                this.value = 'None';
                return;
            } else {
                this.value = `550-601${color}`;
            }

        }


        if (!glass_shape && face !== 'M') {
            this.value = "None";
            return;
        }
        if (glass_shape === 'colonial') this.value = `550-601${color}`;
        if (glass_shape === 'ranch') this.value = `550-651${color}`;

        if (door_model === 'D') {
            if (glass_shape === 'slim_single') this.value = `550-620${color}`;
            if (glass_shape === 'slim_double') this.value = `550-670${color}`;
        }
    }, ["GLASS_SHAPE", "FRAME_COLOR", "DOOR_MODEL", "FACE", "GLASS_TYPE"])

    addLogic("EXTERIOR_FRAME_2", function () {
        const glass_shape = getState("GLASS_SHAPE") || "";
        const color = getState("FRAME_COLOR").value;
        let face = getState("FACE");
        let glass_type = getState("GLASS_TYPE");

        if (face === 'M') {
            if (!glass_type) {
                this.value = 'None';
                return;
            } else {
                this.value = `550-651${color}`;
            }
        }
        else {
            this.value = "None";
            return;
        }

    }, ["GLASS_SHAPE", "FRAME_COLOR", "FACE", "GLASS_TYPE"])

    addLogic("INTERIOR_FRAME_1", function () {
        const door_model = getState("DOOR_MODEL");
        const glazingtype = getNode("GLASS_TYPE").getAttribute('glazingType');
        const glass_shape = getState("GLASS_SHAPE") || "";
        let face = getState("FACE");
        let glass_type = getState("GLASS_TYPE");

        if (face === 'M') {
            if (!glass_type) {
                this.value = "None";
                return;
            } else {
                //assign colonial window frame for Mixed
                this.value = glazingtype === 'double' ? `550-612X` : `550-613X`;
                return;
            }
        }

        if (!glass_shape && face !== 'M') {
            this.value = "None";
            return;
        }
        //colonial window
        if (door_model === 'A' && glass_shape === 'colonial') {
            this.value = glazingtype === 'double' ? `550-606X` : `550-612X`;
        }
        else if (door_model === 'D' && glass_shape === 'colonial') {
            this.value = glazingtype === 'double' ? `550-612X` : `550-613X`;
        }

        //ranch window 
        if (door_model === 'A' && glass_shape === 'ranch') {
            this.value = glazingtype === 'double' ? `550-656X` : `550-662X`;
        }
        else if (door_model === 'D' && glass_shape === 'ranch') {
            this.value = glazingtype === 'double' ? `550-662X` : `550-663X`;
        }

        if (door_model === 'D') {
            if (glass_shape === 'slim_single') this.value = `550-622`;
            if (glass_shape === 'slim_double') this.value = `550-672`;
        }

    }, ["GLASS_TYPE", "DOOR_MODEL", "GLASS_SHAPE", "FACE"])

    addLogic("INTERIOR_FRAME_2", function () {

        const glazingtype = getNode("GLASS_TYPE").getAttribute('glazingType');

        let face = getState("FACE");
        let glass_type = getState("GLASS_TYPE");

        if (face === 'M') {
            if (!glass_type) {
                this.value = "None";
                return;
            } else {
                //assign colonial ranch frame for Mixed
                this.value = glazingtype === 'double' ? `550-662X` : `550-663X`;
            }
        } else {
            this.value = "None";
            return;
        }



    }, ["GLASS_TYPE", "GLASS_SHAPE", "FACE"])


    addLogic("FRAME_KIT", function () {

        const doorModel = getState("DOOR_MODEL");
        const glassShape = getState("GLASS_SHAPE");
        const frameColor = getState("FRAME_COLOR")?.value || "";

        const frameKitMap = {
            slim_single: {
                S: "54S-6214",
                K: "54S-621K",
                W: "54S-621W"
            },
            slim_double: {
                S: "54L-6714",
                K: "54L-671K",
                W: "54L-671W"
            }
        };

        if (doorModel !== "A") {
            this.value = "None";
            return;
        }

        this.value =
            frameKitMap[glassShape]?.[frameColor] || "None";

    }, ["DOOR_MODEL", "GLASS_SHAPE", "FRAME_COLOR"]);


    addLogic("SCREWS", function () {
        const door_model = getState("DOOR_MODEL");
        const glass_shape = getState("GLASS_SHAPE") || "";
        const glass_type = getState("GLASS_TYPE") || "";

        //Mixed
        if (getState("FACE") === 'M') {
            if (!glass_type) {
                this.value = "";
                return;
            } else {
                this.value = `215-328`;
                return;
            }
        }

        //Non-mixed
        if (!glass_shape && getState("FACE") !== "M") {
            this.value = "";
            return;
        }

        if (door_model === 'A') this.value = `215-321`;
        if (door_model === 'D') this.value = `215-328`;

        if (door_model === 'D') {
            if (glass_shape.includes("slim")) this.value = `215-333`;
        }
        if (door_model === 'A') {
            if (glass_shape.includes("slim")) this.value = `215-334`;
        }

    }, ["DOOR_MODEL", "GLASS_SHAPE", "FACE", "GLASS_TYPE"])


    GLASS_QTY_FIELDS.forEach(function (item) {
        addLogic(item.field, function () {            
            const isCustomSlim =
                getState("WINDOW_POSITION") === "custom" &&
                (getState("GLASS_SHAPE") || "").includes("slim");

            const qtyFieldName =
                isCustomSlim
                    ? "slim_single_glass_qty"
                    : (
                        getState("FACE") === "M"
                            ? "mixed_colonial_qty"
                            : "glass_qty"
                    );

            this.value = getGlassQtyByBundleSection(
                item.bundleIndex,
                item.sectionIndex,
                qtyFieldName
            );

        }, GLASS_QTY_DEPS);

        addLogic(item.field + "_TEMP_OR_MIXED", function () {            
            const isCustomSlim =
                getState("WINDOW_POSITION") === "custom" &&
                (getState("GLASS_SHAPE") || "").includes("slim");

            const qtyFieldName =
                isCustomSlim
                    ? "slim_double_glass_qty"
                    : (
                        getState("FACE") === "M"
                            ? "mixed_ranch_qty"
                            : "temp_glass_qty"
                    );

            this.value = getGlassQtyByBundleSection(
                item.bundleIndex,
                item.sectionIndex,
                qtyFieldName
            );

        }, GLASS_QTY_DEPS);
    });

    addLogic("INSERT_YES_NO", function () {
        this.value =
            getState("GLASS_INSERT")
                ? "Y"
                : "N";
    }, ["GLASS_INSERT"])

    addLogic("SLIM_YES_NO_FOR_FRAMES", function () {

        const glass_shape = getState("GLASS_SHAPE");
        const door_model = getState("DOOR_MODEL");

        if (
            ["slim_single", "slim_double"].includes(glass_shape) &&
            door_model === "A"
        ) {
            this.value = "Y";
        } else {
            this.value = "N";
        }

    }, ["GLASS_SHAPE", "DOOR_MODEL"]);

    SCREW_QTY_FIELDS.forEach(function (item) {
        addLogic(item.field, function () {            
            const face = getState("FACE");
            const glass_shape = getState("GLASS_SHAPE") || "";

            if (!glass_shape && face !== "M") {
                this.value = 0;
                return;
            }

            this.value = calculateScrewQtyPerSection(
                item.glassField
            );

        }, [
            "FACE",
            "GLASS_SHAPE",
            "DOOR_MODEL",
            item.glassField,
            item.glassField + "_TEMP_OR_MIXED"
        ]);
    });
}

function calculateTotalPrice() {
    const DOOR_FACE_PRICE = parseFloat(getState("DOOR_FACE_PRICE")) || 0;
    const GLAZING_PRICE = parseFloat(getState("GLAZING_PRICE")) || 0;

    // const OPERATORS_PRICE = parseFloat($("#OPERATORS_PRICE").val()) || 0;
    // const HARDWARE_PRICE = parseFloat($("#HARDWARE_PRICE").val()) || 0;

    // const totalPrice =
    //     DOOR_FACE_PRICE +
    //     GLAZING_PRICE +
    //     OPERATORS_PRICE +
    //     HARDWARE_PRICE;

    const totalPrice = DOOR_FACE_PRICE + GLAZING_PRICE;

    // console.log("total price", totalPrice);
    return totalPrice;
}


function getDoorInfoCached() {
    const windowState = getState("WINDOW_STATE");

    const key = JSON.stringify({
        width: getState("WIDTH"),
        height: getState("HEIGHT"),
        numSections: getState("NUM_OF_SEC"),
        position: getState("WINDOW_POSITION"),
        glassShape: getState("GLASS_SHAPE"),
        face: getState("FACE"),
        custom: getState("CUSTOM_WINDOWS"),
        tempered: getState("GLASS_TEMPERED"),

        sections: (windowState?.sections || []).map(s => ({
            shape: s.shape,
            enabled: s.enabled,
            slim_one: s.slim_one,
            slim_spacing: s.slim_spacing
        }))
    });

    if (key === _doorInfoCacheKey) {        
        return _doorInfoCache;
    }
    
    _doorInfoCacheKey = key;
    _doorInfoCache = getDoorInfo();

    return _doorInfoCache;
}

function getGlassTotals() {
    const sections =
        getState("WINDOW_STATE")?.sections || [];

    const face = getState("FACE");
    const tempGlass =
        getState("GLASS_TEMPERED") || "";

    const totalSections = sections.length;

    let total_glass_qty = 0;
    let total_temp_glass_qty = 0;
    let total_colonial_glass_qty = 0;
    let total_ranch_glass_qty = 0;
    let total_slim_single_glass_qty = 0;
    let total_slim_double_glass_qty = 0;

    sections.forEach((section, index) => {

        const selectedGlassQty =
            (section.enabled || [])
                .filter(v => v === true)
                .length;

        // Mixed panel
        if (face === "M") {

            const mixedPanels =
                getMixedPanelLayout(
                    getState("WIDTH")
                );

            const counts =
                getMixedPanelStyleCountsForSection(
                    mixedPanels,
                    section.enabled || []
                );

            total_colonial_glass_qty +=
                counts.colonial;

            total_ranch_glass_qty +=
                counts.ranch;

            return;
        }

        // Slim totals
        if (section.shape === "slim_single") {
            total_slim_single_glass_qty +=
                selectedGlassQty;
        }

        if (section.shape === "slim_double") {
            total_slim_double_glass_qty +=
                selectedGlassQty;
        }

        // Standard / tempered totals
        const tempApplies =
            isTempGlassSection(
                tempGlass,
                index,
                totalSections
            );

        if (tempApplies) {
            total_temp_glass_qty +=
                selectedGlassQty;
        } else {
            total_glass_qty +=
                selectedGlassQty;
        }
    });

    return {
        total_glass_qty,
        total_temp_glass_qty,
        total_colonial_glass_qty,
        total_ranch_glass_qty,
        total_slim_single_glass_qty,
        total_slim_double_glass_qty
    };
}



function getSectionFlags() {

    const key = JSON.stringify({
        sections: getState("WINDOW_STATE")?.sections,
        custom: getState("CUSTOM_WINDOWS"),
        position: getState("WINDOW_POSITION")
    });

    if (key === _sectionFlagsCacheKey) {
        return _sectionFlagsCache;
    }

    const sections =
        getDoorInfoCached().sections;

    _sectionFlagsCacheKey = key;

    _sectionFlagsCache = {
        hasSlimSingle: sections.some(
            s => s.shape === "slim_single"
        ),
        hasSlimDouble: sections.some(
            s => s.shape === "slim_double"
        )
    };

    return _sectionFlagsCache;
}

function getReversedSectionsCached() {

    const windowState = getState("WINDOW_STATE");

    const key = JSON.stringify(windowState?.sections);

    if (key === _reversedSectionsKey) {
        return _reversedSectionsCache;
    }

    _reversedSectionsKey = key;

    _reversedSectionsCache =
        getDoorInfoCached()
            .sections
            .slice()
            .reverse();

    return _reversedSectionsCache;
}

