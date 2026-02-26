function addSectionBundleDrivers() {

    const SECTION_DEPS = [
        "SHORTEST_SECTION",
        "SHORTEST_SECTIONS_QTY",
        "TALLEST_SECTION",
        "TALLEST_SECTION_QTY"

    ];

    addLogic("YLINE_DESC", function () {
        const doorType = "DF"
        let color = getState("COLOR").desc;
        let doorModel = getNode("DOOR_MODEL").getAttribute("desc")
        let panelStyle = getNode("FACE").getAttribute("desc");
        let num_of_sec = getState("NUM_OF_SEC");

        this.value = `${doorType} ${getState("DOOR_WIDTH_FEET")}-0x${getState("DOOR_HEIGHT_FEET")}-0(${num_of_sec}) ${doorModel} ${color} ${panelStyle}`
    }, ["WIDTH", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "DOOR_HEIGHT_FEET", "DOOR_HEIGHT_INCHES", "HEIGHT", "DOOR_MODEL", "COLOR", "customSwitch", "FACE"])


    addLogic("BUNDLE_1_RAW_PANEL_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        this.value = `SR${doorModelId}01`;
    }, ["DOOR_MODEL"])

    addLogic("BUNDLE_1_RAW_PANEL_DESC", function () {
        let doorWidthFeet = getState("DOOR_WIDTH_FEET");
        doorWidthFeet = String(doorWidthFeet).padStart(2, "0");
        let doorWidthInches = getState("DOOR_WIDTH_INCHES");
        let doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc")
        let color = getState("COLOR").desc;
        let panelStyle = getNode("FACE").getAttribute("desc");
        let bundle1_sc1_height = getState("BUNDLE1_SC1_HEIGHT");

        this.value = `SR ${doorWidthFeet}-${doorWidthInches}x${bundle1_sc1_height} ${doorModelDesc} ${color} ${panelStyle}`;

    }, ["DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "DOOR_MODEL", "COLOR", "FACE", "BUNDLE1_SC1_HEIGHT"])

    addLogic("BUNDLE_1_SC_1_RP_BASE_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id")
        let bundle1_sc1_height = getState("BUNDLE1_SC1_HEIGHT");

        this.value = `${doorModelId}-${bundle1_sc1_height}`;
    }, ["DOOR_MODEL", "BUNDLE1_SC1_HEIGHT"])

    addLogic("BUNDLE_1_SC_2_RP_BASE_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id")
        let bundle1_sc2_height = getState("BUNDLE1_SC2_HEIGHT");

        this.value = `${doorModelId}-${bundle1_sc2_height}`;
    }, ["DOOR_MODEL", "BUNDLE1_SC2_HEIGHT"])

    addLogic("BUNDLE_2_SC_1_RP_BASE_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id")
        let bundle2_sc1_height = getState("BUNDLE2_SC1_HEIGHT");

        this.value = `${doorModelId}-${bundle2_sc1_height}`;
    }, ["DOOR_MODEL", "BUNDLE2_SC1_HEIGHT"])

    addLogic("BUNDLE_2_SC_2_RP_BASE_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id")
        let bundle2_sc2_height = getState("BUNDLE2_SC2_HEIGHT");
        this.value = `${doorModelId}-${bundle2_sc2_height}`;
    }, ["DOOR_MODEL", "BUNDLE2_SC2_HEIGHT"])



    addLogic("RP_BASE_QTY", function () {
        this.value = getState("WIDTH");
    }, ["WIDTH"])

    addLogic("BUNDLE1_SC1_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        this.value = `SC${doorModelId}01`
    }, ["DOOR_MODEL"])

    addLogic("BUNDLE1_SC1_DESC", function () {
        let doorWidthFeet = getState("DOOR_WIDTH_FEET");
        doorWidthFeet = String(doorWidthFeet).padStart(2, "0");
        let doorWidthInches = getState("DOOR_WIDTH_INCHES");
        let doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc")
        let color = getState("COLOR").desc;
        let bundle1_sc1_height = getState("BUNDLE1_SC1_HEIGHT");
        let panelStyle = getNode("FACE").getAttribute("desc");

        this.value = `SC ${doorWidthFeet}-${doorWidthInches}x${bundle1_sc1_height} ${doorModelDesc} ${color} ${panelStyle}`;
    }, ["DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "BUNDLE1_SC1_HEIGHT", "DOOR_MODEL", "COLOR", "FACE"])

    addLogic("BUNDLE1_SC2_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        this.value = `SC${doorModelId}01`
    }, ["DOOR_MODEL"])

    addLogic("BUNDLE1_SC2_DESC", function () {
        let doorWidthFeet = getState("DOOR_WIDTH_FEET");
        doorWidthFeet = String(doorWidthFeet).padStart(2, "0");
        let doorWidthInches = getState("DOOR_WIDTH_INCHES");
        let doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc")
        let color = getState("COLOR").desc;
        let panelStyle = getNode("FACE").getAttribute("desc");
        let bundle1_sc2_height = getState("BUNDLE1_SC2_HEIGHT");
        this.value = `SC ${doorWidthFeet}-${doorWidthInches}x${bundle1_sc2_height} ${doorModelDesc} ${color} ${panelStyle}`;
    }, ["DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "BUNDLE1_SC2_HEIGHT", "DOOR_MODEL", "COLOR", "FACE"])

    addLogic("BUNDLE2_SC1_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        this.value = `SC${doorModelId}02`
    }, ["DOOR_MODEL"])

    addLogic("BUNDLE2_SC1_DESC", function () {
        let doorWidthFeet = getState("DOOR_WIDTH_FEET");
        doorWidthFeet = String(doorWidthFeet).padStart(2, "0");
        let doorWidthInches = getState("DOOR_WIDTH_INCHES");
        let doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc")
        let color = getState("COLOR").desc;
        let panelStyle = getNode("FACE").getAttribute("desc");
        let bundle2_sc1_height = getState("BUNDLE2_SC1_HEIGHT");
        this.value = `SC ${doorWidthFeet}-${doorWidthInches}x${bundle2_sc1_height} ${doorModelDesc} ${color} ${panelStyle}`;
    }, ["DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "BUNDLE2_SC1_HEIGHT", "DOOR_MODEL", "COLOR", "FACE"])

    addLogic("BUNDLE2_SC2_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        this.value = `SC${doorModelId}02`
    }, ["DOOR_MODEL"])

     addLogic("BUNDLE2_SC2_DESC", function () {
        let doorWidthFeet = getState("DOOR_WIDTH_FEET");
        doorWidthFeet = String(doorWidthFeet).padStart(2, "0");
        let doorWidthInches = getState("DOOR_WIDTH_INCHES");
        let doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc")
        let color = getState("COLOR").desc;
        let panelStyle = getNode("FACE").getAttribute("desc");
        let bundle2_sc1_height = getState("BUNDLE2_SC2_HEIGHT");
        this.value = `SC ${doorWidthFeet}-${doorWidthInches}x${bundle2_sc1_height} ${doorModelDesc} ${color} ${panelStyle}`;
    }, ["DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "BUNDLE2_SC2_HEIGHT", "DOOR_MODEL", "COLOR", "FACE"])

    addLogic("BTM_SECTION", function () {
        let sections = getSectionBundle();
        this.value = sections[1];
    }, SECTION_DEPS)

    addLogic("TOP_SECTION", function () {
        let sections = getSectionBundle();
        this.value = sections[0];
    }, SECTION_DEPS)

    addLogic("INT1_SECTION", function () {
        let sections = getSectionBundle();
        this.value = sections[2];
    }, SECTION_DEPS)


    addLogic("INT2_SECTION", function () {
        let sections = getSectionBundle();
        this.value = sections[3];
    }, SECTION_DEPS)

    addLogic("INT3_SECTION", function () {
        let sections = getSectionBundle();
        this.value = sections[4] ?? "";
    }, SECTION_DEPS)

    addLogic("INT4_SECTION", function () {
        let sections = getSectionBundle();
        this.value = sections[5] ?? "";
    }, SECTION_DEPS)

    addLogic("INT5_SECTION", function () {
        let sections = getSectionBundle();
        this.value = sections[6] ?? "";
    }, SECTION_DEPS)

    addLogic("INT6_SECTION", function () {
        let sections = getSectionBundle();
        this.value = sections[7] ?? "";
    }, SECTION_DEPS)

    addLogic("INT7_SECTION", function () {
        let sections = getSectionBundle();
        this.value = sections[8] ?? "";
    }, SECTION_DEPS)


    addLogic("SB1_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        this.value = `SB${doorModelId}01`;
    }, ["DOOR_MODEL"])

    addLogic("SB1_DESC", function () {
        let doorWidthFeet = getState("DOOR_WIDTH_FEET");
        doorWidthFeet = String(doorWidthFeet).padStart(2, "0");
        let doorWidthInches = getState("DOOR_WIDTH_INCHES");
        let doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc")
        let color = getState("COLOR").desc;
        let panelStyle = getNode("FACE").getAttribute("desc");
        let bundle1_height = getState("BUNDLE_1_HEIGHT");
        this.value = `SB-TB ${doorWidthFeet}-${doorWidthInches}x${bundle1_height} ${doorModelDesc} ${color} ${panelStyle}`;
    }, ["DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "BUNDLE_1_HEIGHT", "DOOR_MODEL", "COLOR", "FACE"])

    addLogic("SB2_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        this.value = `SB${doorModelId}02`;
    }, ["DOOR_MODEL"])

    addLogic("SB2_DESC", function () {
        let doorWidthFeet = getState("DOOR_WIDTH_FEET");
        doorWidthFeet = String(doorWidthFeet).padStart(2, "0");
        let doorWidthInches = getState("DOOR_WIDTH_INCHES");
        let doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc")
        let color = getState("COLOR").desc;
        let panelStyle = getNode("FACE").getAttribute("desc");
        let bundle2_height = getState("BUNDLE_2_HEIGHT");
        this.value = `SB-II ${doorWidthFeet}-${doorWidthInches}x${bundle2_height} ${doorModelDesc} ${color} ${panelStyle}`;
    }, ["DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "BUNDLE_2_HEIGHT", "DOOR_MODEL", "COLOR", "FACE"])

    addLogic("BUNDLE_1_SC_1_RP_TOP_SHEET_SPNUM", function () {
        let color = getState("COLOR").value;
        let bundle1_sc1_height = getState("BUNDLE1_SC1_HEIGHT");
        this.value = `LND-${bundle1_sc1_height}${color}`;
    }, ["BUNDLE1_SC1_HEIGHT", "COLOR"])

    addLogic("BUNDLE_1_SC_2_RP_TOP_SHEET_SPNUM", function () {
        let color = getState("COLOR").value;
        let bundle1_sc2_height = getState("BUNDLE1_SC2_HEIGHT");
        this.value = `LND-${bundle1_sc2_height}${color}`;
    }, ["BUNDLE1_SC2_HEIGHT", "COLOR"])

    addLogic("BUNDLE_2_SC_1_RP_TOP_SHEET_SPNUM", function () {
        let color = getState("COLOR").value;
        let bundle2_sc1_height = getState("BUNDLE2_SC1_HEIGHT");
        this.value = `LND-${bundle2_sc1_height}${color}`;
    }, ["BUNDLE2_SC1_HEIGHT", "COLOR"])

    addLogic("BUNDLE_2_SC_2_RP_TOP_SHEET_SPNUM", function () {
        let color = getState("COLOR").value;
        let bundle2_sc2_height = getState("BUNDLE2_SC2_HEIGHT");
        this.value = `LND-${bundle2_sc2_height}${color}`;
    }, ["BUNDLE2_SC2_HEIGHT", "COLOR"])


    addLogic("BOTTOM_RETAINER", function () {
        let width = getState("WIDTH");
        const ranges = [
            { max: 96, code: '328-790-080' },
            { max: 108, code: '328-790-090' },
            { max: 120, code: '328-790-100' },
            { max: 144, code: '328-790-120' },
            { max: 168, code: '328-790-140' },
            { max: 180, code: '328-790-150' },
            { max: 192, code: '328-790-160' },
            { max: 216, code: '328-790-180' },
            { max: 240, code: '328-790-200' }
        ];

        let value = '';

        for (let i = 0; i < ranges.length; i++) {
            if (width <= ranges[i].max) {
                value = ranges[i].code;
                break;
            }
        }
        this.value = value;
    }, ["WIDTH"])

    addLogic("BTM_SEAL_QTY", function () {
        let width = getState("WIDTH");
        this.value = ((Number(width) / 12) + 0.5)
    }, ["WIDTH"])

    addLogic("BTM_RETAINER_SCREW_QTY", function () {
        let width_feet = getState("DOOR_WIDTH_FEET");

        this.value = ((Number(width_feet)) + 2)
    }, ["DOOR_WIDTH_FEET"])

    addLogic("SHORTEST_SECTION", function () {
        let door_height = getState("HEIGHT");
        let num_of_sec = getState("NUM_OF_SEC");
        this.value = Math.floor((door_height / num_of_sec) / 3) * 3;
    }, ["HEIGHT", "NUM_OF_SEC"])

    addLogic("SHORTEST_SECTIONS_QTY", function () {
        let num_of_sec = getState("NUM_OF_SEC");
        let door_height = getState("HEIGHT");
        let shortest_section = getState("SHORTEST_SECTION");
        let diff = (door_height / num_of_sec) - shortest_section;

        this.value = Math.round((1 - (diff) / 3) * num_of_sec);

    }, ["HEIGHT", "NUM_OF_SEC", "SHORTEST_SECTION"])


    addLogic("TALLEST_SECTION", function () {
        let door_height = getState("HEIGHT");
        let num_of_sec = getState("NUM_OF_SEC");
        this.value = Math.ceil((door_height / num_of_sec) / 3) * 3;
    }, ["HEIGHT", "NUM_OF_SEC"])

    addLogic("TALLEST_SECTION_QTY", function () {
        let door_height = getState("HEIGHT");
        let num_of_sec = getState("NUM_OF_SEC");
        this.value = Math.round((((door_height / num_of_sec) - getState("SHORTEST_SECTION")) / 3) * num_of_sec);
    }, ["HEIGHT", "NUM_OF_SEC", "SHORTEST_SECTION"])

    // bundle 1 
    addLogic("BUNDLE_1_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[0]?.sections?.reduce((a, b) => a + b, 0) ?? 0;

    }, SECTION_DEPS);

    addLogic("BUNDLE1_SC1_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[0]?.sections[0] ?? 0;
    }, ["BUNDLE_1_HEIGHT"])

    addLogic("BUNDLE1_SC2_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[0]?.sections[1] ?? 0;
    }, ["BUNDLE_1_HEIGHT"])

    addLogic("BUNDLE_1_QTY", function () {
        this.value = getState("BUNDLE_1_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_1_HEIGHT"])

    addLogic("BUNDLE1_SC1_QTY", function () {
        this.value = getState("BUNDLE1_SC1_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_1_HEIGHT"])

    addLogic("BUNDLE1_SC2_QTY", function () {
        this.value = getState("BUNDLE1_SC2_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_1_HEIGHT"])

    // BUNDLE 2 
    addLogic("BUNDLE_2_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[1]?.sections?.reduce((a, b) => a + b, 0) ?? 0;
    }, SECTION_DEPS);

    addLogic("BUNDLE2_SC1_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[1]?.sections[0] ?? 0;
    }, ["BUNDLE_2_HEIGHT"])

    addLogic("BUNDLE2_SC2_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[1]?.sections[1] ?? 0;
    }, ["BUNDLE_2_HEIGHT"])

    addLogic("BUNDLE2_SC1_QTY", function () {
        this.value = getState("BUNDLE2_SC1_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_2_HEIGHT"])

    addLogic("BUNDLE2_SC2_QTY", function () {
        this.value = getState("BUNDLE2_SC2_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_2_HEIGHT"])


    addLogic("BUNDLE_3", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[2]?.sections?.reduce((a, b) => a + b, 0) ?? 0;
    }, SECTION_DEPS);

    addLogic("BUNDLE_4", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[3]?.sections?.reduce((a, b) => a + b, 0) ?? 0;
    }, SECTION_DEPS);

    addLogic("BUNDLE_5", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[4]?.sections?.reduce((a, b) => a + b, 0) ?? 0;
    }, SECTION_DEPS);


    addLogic("BUNDLE_2_QTY", function () {
        this.value = getState("BUNDLE_2_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_2_HEIGHT"])

    addLogic("BUNDLE_3_QTY", function () {
        this.value = getState("BUNDLE_3") === 0 ? 0 : 1;
    }, ["BUNDLE_3"])

    addLogic("BUNDLE_4_QTY", function () {
        this.value = getState("BUNDLE_4") === 0 ? 0 : 1;
    }, ["BUNDLE_4"])

    addLogic("BUNDLE_5_QTY", function () {
        this.value = getState("BUNDLE_5") === 0 ? 0 : 1;
    }, ["BUNDLE_5"])

    addLogic("BUNDLE_1_SC_1_END_CAPS_SPNUM", function () {
        let end_caps = getState("EndCaps"); 
        let door_model = getState("DOOR_MODEL");
        let BUNDLE1_SC1_HEIGHT = getState("BUNDLE1_SC1_HEIGHT");

        //door model = A = L138, d= L200
        //end caps = yes = double end caps
        //end caps = no = single end caps

        this.value = getEndCapsPartNum(BUNDLE1_SC1_HEIGHT, door_model, end_caps);

    }, ["BUNDLE1_SC1_HEIGHT", "DOOR_MODEL", "EndCaps"])

    addLogic("BUNDLE_1_SC_2_END_CAPS_SPNUM", function () {
        let end_caps = getState("EndCaps");
        let door_model = getState("DOOR_MODEL");
        let BUNDLE1_SC2_HEIGHT = getState("BUNDLE1_SC2_HEIGHT");
        this.value = getEndCapsPartNum(BUNDLE1_SC2_HEIGHT, door_model, end_caps);

    }, ["BUNDLE1_SC2_HEIGHT", "DOOR_MODEL", "EndCaps"])

    addLogic("BUNDLE_2_SC_1_END_CAPS_SPNUM", function () {
        let end_caps = getState("EndCaps");
        let door_model = getState("DOOR_MODEL");
        let bundle2_sc1_height = getState("BUNDLE2_SC1_HEIGHT");

        this.value = getEndCapsPartNum(bundle2_sc1_height, door_model, end_caps);

    }, ["BUNDLE2_SC1_HEIGHT", "DOOR_MODEL", "EndCaps"])

    addLogic("BUNDLE_2_SC_2_END_CAPS_SPNUM", function () {
        let end_caps = getState("EndCaps");
        let door_model = getState("DOOR_MODEL");
        let bundle2_sc2_height = getState("BUNDLE2_SC2_HEIGHT");

        this.value = getEndCapsPartNum(bundle2_sc2_height, door_model, end_caps);

    }, ["BUNDLE2_SC2_HEIGHT", "DOOR_MODEL", "EndCaps"])


    addLogic("BUNDLE_1_PACKAGE", function () {
        let bundle1_height = Number(getState("BUNDLE_1_HEIGHT")) || 0;
        this.value = bundle1_height > 32
            ? 'LMPKG-002'
            : 'LMPKG-001';

    }, ["BUNDLE_1_HEIGHT"])

    addLogic("PKG_QTY", function () {
        this.value = getState("WIDTH")
    }, ["WIDTH"])


}

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
    console.log("end caps part$", partNumbers[door_model]?.[end_caps]?.[section_height]);
    return partNumbers[door_model]?.[end_caps]?.[section_height] || null;
}

function getSectionHeight(height, num_of_sec) {
    let stackChart = getStackChart();
    let configArray = stackChart[String(height)];

    for (let i = 0; i < configArray.length; i++) {
        const item = configArray[i];
        if (Number(item.num_sections) === Number(num_of_sec)) {
            // return item.btm_section_height;
            return item;
        }
    }
}

function getSectionBundle() {
    let sectionHeights = [];
    const shortest_section_qty = Math.ceil(Number(getState("SHORTEST_SECTIONS_QTY"))) || 0;
    const shortest_sections = Number(getState("SHORTEST_SECTION")) || 0;

    const tallest_sections = Number(getState("TALLEST_SECTION")) || 0;
    const tallest_sections_qty = Math.ceil(Number(getState("TALLEST_SECTION_QTY"))) || 0;


    for (let i = 0; i < shortest_section_qty; i++) {
        sectionHeights.push(shortest_sections);
    }

    // Add tallest sections ONLY if qty is not 0
    for (let i = 0; i < tallest_sections_qty; i++) {
        sectionHeights.push(tallest_sections);
    }

    sectionHeights.sort((a, b) => b - a);
    // console.log("Sections", sectionHeights);
    return sectionHeights;
}

function bundleByHeight(sections) {
    const MAX_BUNDLE_WEIGHT = 150;
    const bundles = [];

    let remaining = [...sections];

    // 1️⃣ Bottom + Top special check
    if (remaining.length >= 2) {
        const bottom = remaining[0];
        const top = remaining[1];

        const weight =
            calculateSectionShipWeight(bottom, true) +
            calculateSectionShipWeight(top, false);

        if (bottom === top && weight <= MAX_BUNDLE_WEIGHT) {
            bundles.push({
                sections: [top, bottom],
                weight
            });

            // remove bottom & top
            remaining.splice(0, 2);
        }
    }

    // 2️⃣ Process intermediates
    const singles = [];
    const pairs = [];
    let i = 0;

    while (i < remaining.length) {
        const height = remaining[i];

        // count same-height group
        let j = i;
        while (j < remaining.length && remaining[j] === height) j++;

        const count = j - i;

        // odd → first single
        if (count % 2 === 1) {
            singles.push({
                sections: [height],
                weight: calculateSectionShipWeight(height, false)
            });
            i += 1;
        }

        // pair the rest
        while (i + 1 < j) {
            const weight =
                calculateSectionShipWeight(height, false) +
                calculateSectionShipWeight(height, true);

            if (weight <= MAX_BUNDLE_WEIGHT) {
                pairs.push({
                    sections: [height, height],
                    weight
                });


            } else {
                pairs.push({
                    sections: [height],
                    weight: calculateSectionShipWeight(height, false)
                });
                pairs.push({
                    sections: [height],
                    weight: calculateSectionShipWeight(height, true)
                });
            }
            i += 2;
        }
    }

    // 🔽 Sort pairs by height DESC
    pairs.sort((a, b) => b.sections[0] - a.sections[0]);

    // 🔽 Singles stay last (optional: sort ASC or DESC if needed)
    singles.sort((a, b) => a.sections[0] - b.sections[0]);

    // 3️⃣ Combine final array: bottom/top first, then singles, then pairs
    console.log("bundle array", [...bundles, ...pairs, ...singles])
    // return [...bundles, ...singles, ...pairs];
    return [...bundles, ...pairs, ...singles];
}


function calculateRawPanelWeight(sectionHeightInInches) {
    let RPWeight = getState("DOOR_MODEL") === "A" ? 1.775 : 1.74;

    let width = Number(getState("DOOR_WIDTH_FEET")) || 0;
    const sectionHeightInFeet = sectionHeightInInches / 12;
    let areaSqFt = (width * sectionHeightInFeet);
    const totalWeight = Number((RPWeight * areaSqFt).toFixed(2));
    // debugger;
    // console.log("raw panel weight", totalWeight);

    return totalWeight;
}

function calculateEndCaps(sectionHeightInInches) {
    let getEndCaps = getState("EndCaps");
    let sectionHeightInFeet = sectionHeightInInches / 12;
    let weightPerFoot;;

    if (getEndCaps === "N") { //case single
        weightPerFoot = getState("DOOR_MODEL") === "A" ? 1.02 : 1.14;
    } else {
        weightPerFoot = getState("DOOR_MODEL") === "A" ? 3.07 : 3.3;
    }

    // console.log("totalEndCapsWeight", Number((sectionHeightInFeet * weightPerFoot).toFixed(2)));
    return Number((sectionHeightInFeet * weightPerFoot).toFixed(2));
}

function calculateBTMRetainer(isBottomSection = false) { //only for bottom section
    if (!isBottomSection) return 0;
    const width = Number(getState("DOOR_WIDTH_FEET")) || 0;
    // console.log("btmRetainerWeight", btmRetainerWeight);
    return Number((width * 0.4).toFixed(2));

}

function calculateSectionShipWeight(sectionHeightInInches, isBottomSection = false) {
    let RPWeight = calculateRawPanelWeight(sectionHeightInInches);
    let EndCapsWeight = calculateEndCaps(sectionHeightInInches);
    let btmWeight = isBottomSection ? calculateBTMRetainer(Number(getState("DOOR_WIDTH_FEET")) || 0) : 0;
    let lites = 0;
    let pck_weight = 0.15;

    return Number((RPWeight + EndCapsWeight + btmWeight + lites + pck_weight).toFixed(2));
}

