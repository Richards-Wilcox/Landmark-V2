//This file contains all the inputs related to section bundle and raw panel.
//Author Name: Charmi Surati
//Last Modify Date: May 11, 2026


function addSectionBundleDrivers() {

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

    addLogic("YLINE_DESC", function () {
        const doorType = "DF"
        let color = getState("COLOR").desc;
        let doorModel = getNode("DOOR_MODEL").getAttribute("desc")
        let panelStyle = getNode("FACE").getAttribute("desc");
        let num_of_sec = getState("NUM_OF_SEC");

        this.value = `${doorType} ${getState("DOOR_WIDTH_FEET")}-0x${getState("DOOR_HEIGHT_FEET")}-0(${num_of_sec}) ${doorModel} ${color} ${panelStyle}`
    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "DOOR_MODEL", "COLOR", "customSwitch", "FACE"])


    //each section heights
    addLogic("BTM_SECTION", function () {
        let sections = getSectionBundle();
        this.value = sections[1];
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
        // let sections = getSectionBundle();
        // if (getState("NUM_OF_SEC") == '4') {
        //     this.value = sections[0]
        // }
        // else this.value = sections[4];

        const sections = getSectionBundle();
        const numOfSections = Number(getState("NUM_OF_SEC"));

        if (numOfSections === 4) {
            this.value = sections[0];
        } else if (numOfSections > 4) {
            this.value = sections[4];
        } else {
            this.value = "";
        }

    }, SECTION_DEPS)

    addLogic("INT4_SECTION", function () {
        const sections = getSectionBundle();
        const numOfSections = Number(getState("NUM_OF_SEC"));

        if (numOfSections === 5) {
            this.value = sections[0];
        } else if (numOfSections > 5) {
            this.value = sections[5];
        } else {
            this.value = "";
        }
    }, SECTION_DEPS)

    addLogic("INT5_SECTION", function () {
        const sections = getSectionBundle();
        const numOfSections = Number(getState("NUM_OF_SEC"));

        if (numOfSections === 6) {
            this.value = sections[0];
        } else if (numOfSections > 6) {
            this.value = sections[6];
        } else {
            this.value = "";
        }
    }, SECTION_DEPS)

    addLogic("INT6_SECTION", function () {
        const sections = getSectionBundle();
        const numOfSections = Number(getState("NUM_OF_SEC"));

        if (numOfSections === 7) {
            this.value = sections[0];
        } else if (numOfSections > 7) {
            this.value = sections[7];
        } else {
            this.value = "";
        }
    }, SECTION_DEPS)

    addLogic("INT7_SECTION", function () {
        const sections = getSectionBundle();
        const numOfSections = Number(getState("NUM_OF_SEC"));

        if (numOfSections === 8) {
            this.value = sections[0];
        } else if (numOfSections > 8) {
            this.value = sections[8];
        } else {
            this.value = "";
        }
    }, SECTION_DEPS)

    addLogic("INT8_SECTION", function () {
        const sections = getSectionBundle();
        const numOfSections = Number(getState("NUM_OF_SEC"));

        if (numOfSections === 9) {
            this.value = sections[0];
        } else if (numOfSections > 9) {
            this.value = sections[9];
        } else {
            this.value = "";
        }
    }, SECTION_DEPS)


    //Bundle heights and Qty
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
        this.value = bundles[1]?.sections[0] ?? "";
    }, ["BUNDLE_2_HEIGHT"])

    addLogic("BUNDLE2_SC2_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[1]?.sections[1] ?? "";
    }, ["BUNDLE_2_HEIGHT"])

    addLogic("BUNDLE_2_QTY", function () {
        this.value = getState("BUNDLE_2_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_2_HEIGHT"])

    addLogic("BUNDLE2_SC1_QTY", function () {
        this.value = getState("BUNDLE2_SC1_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_2_HEIGHT"])

    addLogic("BUNDLE2_SC2_QTY", function () {
        this.value = getState("BUNDLE2_SC2_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_2_HEIGHT"])


    //BUNDLE 3
    addLogic("BUNDLE_3_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[2]?.sections?.reduce((a, b) => a + b, 0) ?? 0;
    }, SECTION_DEPS);

    addLogic("BUNDLE3_SC1_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[2]?.sections[0] ?? 0;
    }, ["BUNDLE_3_HEIGHT"])

    addLogic("BUNDLE3_SC2_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[2]?.sections[1] ?? 0;
    }, ["BUNDLE_3_HEIGHT"])

    addLogic("BUNDLE_3_QTY", function () {
        this.value = getState("BUNDLE_3_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_3_HEIGHT"])

    addLogic("BUNDLE3_SC1_QTY", function () {
        this.value = getState("BUNDLE3_SC1_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_3_HEIGHT"])

    addLogic("BUNDLE3_SC2_QTY", function () {
        this.value = getState("BUNDLE3_SC2_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_3_HEIGHT"])


    //BUNDLE 4
    addLogic("BUNDLE_4_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[3]?.sections?.reduce((a, b) => a + b, 0) ?? 0;
    }, SECTION_DEPS);

    addLogic("BUNDLE4_SC1_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[3]?.sections[0] ?? 0;
    }, ["BUNDLE_4_HEIGHT"])

    addLogic("BUNDLE4_SC2_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[3]?.sections[1] ?? 0;
    }, ["BUNDLE_4_HEIGHT"])

    addLogic("BUNDLE_4_QTY", function () {
        this.value = getState("BUNDLE_4_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_4_HEIGHT"])

    addLogic("BUNDLE4_SC1_QTY", function () {
        this.value = getState("BUNDLE4_SC1_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_4_HEIGHT"])

    addLogic("BUNDLE4_SC2_QTY", function () {
        this.value = getState("BUNDLE4_SC2_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_4_HEIGHT"])


    //BUNDLE 5
    addLogic("BUNDLE_5_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[4]?.sections?.reduce((a, b) => a + b, 0) ?? 0;
    }, SECTION_DEPS);

    addLogic("BUNDLE5_SC1_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[4]?.sections[0] ?? 0;
    }, ["BUNDLE_5_HEIGHT"])

    addLogic("BUNDLE_5_QTY", function () {
        this.value = getState("BUNDLE_5_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_5_HEIGHT"])

    addLogic("BUNDLE5_SC1_QTY", function () {
        this.value = getState("BUNDLE5_SC1_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_5_HEIGHT"])


    //Section bundles part# and Desc
    //SB1
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

        const TALLEST_SECTION_QTY = getState('TALLEST_SECTION_QTY');
        // let prefix = bundle1_height > 32 ? 'SB-TB' : 'SB-B';
        let prefix = '';
        if (bundle1_height < 32) {
            prefix = 'SB-B';
        } else {
            if (TALLEST_SECTION_QTY % 2 === 0) { //even condition
                prefix = 'SB-TB';
            } else prefix = 'SB-BI';
        }

        this.value = `${prefix} ${doorWidthFeet}-${doorWidthInches}x${bundle1_height} ${doorModelDesc} ${color} ${panelStyle}`;

    }, ["DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "BUNDLE_1_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "HEIGHT", "NUM_OF_SEC"])

    //SB2
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
        let Prefix = '';
        if (bundle2_height > 32) {
            prefix = 'SB-II'
        } else prefix = 'SB-I';

        this.value = `${prefix} ${doorWidthFeet}-${doorWidthInches}x${bundle2_height} ${doorModelDesc} ${color} ${panelStyle}`;
    }, ["DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "BUNDLE_2_HEIGHT", "DOOR_MODEL", "COLOR", "FACE"])

    //SB3
    addLogic("SB3_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle3_qty = getState("BUNDLE_3_QTY");
        if (bundle3_qty > 0) this.value = `SB${doorModelId}03`
        else this.value = 'None';
    }, ["DOOR_MODEL", "WIDTH", "HEIGHT", "NUM_OF_SEC", "BUNDLE_3_QTY"])

    addLogic("SB3_DESC", function () {
        let doorWidthFeet = getState("DOOR_WIDTH_FEET");
        doorWidthFeet = String(doorWidthFeet).padStart(2, "0");
        let doorWidthInches = getState("DOOR_WIDTH_INCHES");
        let doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc")
        let color = getState("COLOR").desc;
        let panelStyle = getNode("FACE").getAttribute("desc");
        let bundle3_height = getState("BUNDLE_3_HEIGHT");
        let bundle3_qty = getState("BUNDLE_3_QTY");

        let Prefix = '';
        if (bundle3_qty > 0) {
            if (bundle3_height > 32) {
                Prefix = 'SB-II'
            } else Prefix = 'SB-I';

            this.value = `${Prefix} ${doorWidthFeet}-${doorWidthInches}x${bundle3_height} ${doorModelDesc} ${color} ${panelStyle}`;
        } else this.value = '';
    }, [DIMENSION_DEPS, "BUNDLE_3_HEIGHT", "DOOR_MODEL", "COLOR", "FACE"])

    addLogic("SB4_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle4_qty = getState("BUNDLE_4_QTY");
        if (bundle4_qty > 0) this.value = `SB${doorModelId}04`
        else this.value = 'None';
    }, ["DOOR_MODEL", "WIDTH", "HEIGHT", "NUM_OF_SEC", "BUNDLE_4_QTY"])

    addLogic("SB4_DESC", function () {
        let doorWidthFeet = getState("DOOR_WIDTH_FEET");
        doorWidthFeet = String(doorWidthFeet).padStart(2, "0");
        let doorWidthInches = getState("DOOR_WIDTH_INCHES");
        let doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc")
        let color = getState("COLOR").desc;
        let panelStyle = getNode("FACE").getAttribute("desc");
        let bundle4_height = getState("BUNDLE_4_HEIGHT");
        let bundle4_qty = getState("BUNDLE_4_QTY");

        let Prefix = '';
        if (bundle4_qty > 0) {
            if (bundle4_height > 32) {
                Prefix = 'SB-II'
            } else Prefix = 'SB-I';

            this.value = `${Prefix} ${doorWidthFeet}-${doorWidthInches}x${bundle4_height} ${doorModelDesc} ${color} ${panelStyle}`;
        } else this.value = '';
    }, [DIMENSION_DEPS, "BUNDLE_4_HEIGHT", "DOOR_MODEL", "COLOR", "FACE"])


    //Section Components part# and Desc for each bundle
    //SC1
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

    //SC2
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

    //SC 3
    addLogic("BUNDLE3_SC1_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle3_sc1_height = getState("BUNDLE3_SC1_HEIGHT");

        if (bundle3_sc1_height > 0) {
            this.value = `SC${doorModelId}03`
        } else this.value = 'None';

    }, ["DOOR_MODEL", "BUNDLE3_SC1_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE3_SC1_DESC", function () {
        let doorWidthFeet = getState("DOOR_WIDTH_FEET");
        doorWidthFeet = String(doorWidthFeet).padStart(2, "0");
        let doorWidthInches = getState("DOOR_WIDTH_INCHES");
        let doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc")
        let color = getState("COLOR").desc;
        let panelStyle = getNode("FACE").getAttribute("desc");
        let bundle3_sc1_height = getState("BUNDLE3_SC1_HEIGHT");

        if (bundle3_sc1_height > 0) {
            this.value = `SC ${doorWidthFeet}-${doorWidthInches}x${bundle3_sc1_height} ${doorModelDesc} ${color} ${panelStyle}`;
        } else this.value = '';
    }, ["DOOR_MODEL", "COLOR", "FACE", DIMENSION_DEPS, "BUNDLE3_SC1_HEIGHT"])

    addLogic("BUNDLE3_SC2_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle3_sc2_height = getState("BUNDLE3_SC2_HEIGHT");

        if (bundle3_sc2_height > 0) {
            this.value = `SC${doorModelId}03`
        } else this.value = 'None';

    }, ["DOOR_MODEL", "BUNDLE3_SC2_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE3_SC2_DESC", function () {
        let doorWidthFeet = getState("DOOR_WIDTH_FEET");
        doorWidthFeet = String(doorWidthFeet).padStart(2, "0");
        let doorWidthInches = getState("DOOR_WIDTH_INCHES");
        let doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc")
        let color = getState("COLOR").desc;
        let panelStyle = getNode("FACE").getAttribute("desc");
        let bundle3_sc2_height = getState("BUNDLE3_SC2_HEIGHT");

        if (bundle3_sc2_height > 0) {
            this.value = `SC ${doorWidthFeet}-${doorWidthInches}x${bundle3_sc2_height} ${doorModelDesc} ${color} ${panelStyle}`;
        } else this.value = '';

    }, [DIMENSION_DEPS, "BUNDLE3_SC2_HEIGHT", "DOOR_MODEL", "COLOR", "FACE"])

    //sc 4
    addLogic("BUNDLE4_SC1_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle4_sc1_height = getState("BUNDLE4_SC1_HEIGHT");

        if (bundle4_sc1_height > 0) {
            this.value = `SC${doorModelId}04`
        } else this.value = 'None';

    }, ["DOOR_MODEL", "BUNDLE4_SC1_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE4_SC1_DESC", function () {
        let doorWidthFeet = getState("DOOR_WIDTH_FEET");
        doorWidthFeet = String(doorWidthFeet).padStart(2, "0");
        let doorWidthInches = getState("DOOR_WIDTH_INCHES");
        let doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc")
        let color = getState("COLOR").desc;
        let panelStyle = getNode("FACE").getAttribute("desc");
        let bundle4_sc1_height = getState("BUNDLE4_SC1_HEIGHT");

        if (bundle4_sc1_height > 0) {
            this.value = `SC ${doorWidthFeet}-${doorWidthInches}x${bundle4_sc1_height} ${doorModelDesc} ${color} ${panelStyle}`;
        } else this.value = '';
    }, ["DOOR_MODEL", "COLOR", "FACE", DIMENSION_DEPS, "BUNDLE4_SC1_HEIGHT"])

    addLogic("BUNDLE4_SC2_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle4_sc2_height = getState("BUNDLE4_SC2_HEIGHT");

        if (bundle4_sc2_height > 0) {
            this.value = `SC${doorModelId}04`
        } else this.value = 'None';

    }, ["DOOR_MODEL", "BUNDLE4_SC2_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE4_SC2_DESC", function () {
        let doorWidthFeet = getState("DOOR_WIDTH_FEET");
        doorWidthFeet = String(doorWidthFeet).padStart(2, "0");
        let doorWidthInches = getState("DOOR_WIDTH_INCHES");
        let doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc")
        let color = getState("COLOR").desc;
        let panelStyle = getNode("FACE").getAttribute("desc");
        let bundle4_sc2_height = getState("BUNDLE4_SC2_HEIGHT");

        if (bundle4_sc2_height > 0) {
            this.value = `SC ${doorWidthFeet}-${doorWidthInches}x${bundle4_sc2_height} ${doorModelDesc} ${color} ${panelStyle}`;
        } else this.value = '';

    }, [DIMENSION_DEPS, "BUNDLE4_SC2_HEIGHT", "DOOR_MODEL", "COLOR", "FACE"])



    //Raw panel Part# and Desc for Each bundle
    // set bundle 1 rp1 part#
    addLogic("BUNDLE1_RP1_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        this.value = `SR${doorModelId}01`;
    }, ["DOOR_MODEL"])

    // set bundle1 rp1 desc
    addLogic("BUNDLE1_RP1_DESC", function () {
        let doorWidthFeet = getState("DOOR_WIDTH_FEET");
        doorWidthFeet = String(doorWidthFeet).padStart(2, "0");
        let doorWidthInches = getState("DOOR_WIDTH_INCHES");
        let doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc")
        let color = getState("COLOR").desc;
        let panelStyle = getNode("FACE").getAttribute("desc");
        let bundle1_sc1_height = getState("BUNDLE1_SC1_HEIGHT");

        this.value = `SR ${doorWidthFeet}-${doorWidthInches}x${bundle1_sc1_height} ${doorModelDesc} ${color} ${panelStyle}`;

    }, ["DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "DOOR_MODEL", "COLOR", "FACE", "BUNDLE1_SC1_HEIGHT"])

    // set bundle 1 rp2 part#
    addLogic("BUNDLE1_RP2_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        this.value = `SR${doorModelId}01`;
    }, ["DOOR_MODEL"])

    // set bundle 1 rp2 desc
    addLogic("BUNDLE1_RP2_DESC", function () {
        let doorWidthFeet = getState("DOOR_WIDTH_FEET");
        doorWidthFeet = String(doorWidthFeet).padStart(2, "0");
        let doorWidthInches = getState("DOOR_WIDTH_INCHES");
        let doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc")
        let color = getState("COLOR").desc;
        let panelStyle = getNode("FACE").getAttribute("desc");
        let bundle1_sc2_height = getState("BUNDLE1_SC2_HEIGHT");

        this.value = `SR ${doorWidthFeet}-${doorWidthInches}x${bundle1_sc2_height} ${doorModelDesc} ${color} ${panelStyle}`;

    }, ["DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "DOOR_MODEL", "COLOR", "FACE", "BUNDLE1_SC2_HEIGHT"])

    // bundle2 rp1 part#
    addLogic("BUNDLE2_RP1_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        this.value = `SR${doorModelId}01`;
    }, ["DOOR_MODEL"])

    // bundle 2 rp1 desc
    addLogic("BUNDLE2_RP1_DESC", function () {
        let doorWidthFeet = getState("DOOR_WIDTH_FEET");
        doorWidthFeet = String(doorWidthFeet).padStart(2, "0");
        let doorWidthInches = getState("DOOR_WIDTH_INCHES");
        let doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc")
        let color = getState("COLOR").desc;
        let panelStyle = getNode("FACE").getAttribute("desc");
        let bundle2_sc1_height = getState("BUNDLE2_SC1_HEIGHT");

        this.value = `SR ${doorWidthFeet}-${doorWidthInches}x${bundle2_sc1_height} ${doorModelDesc} ${color} ${panelStyle}`;

    }, ["DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "DOOR_MODEL", "COLOR", "FACE", "BUNDLE2_SC1_HEIGHT"])

    // bundle 2 rp2 part#
    addLogic("BUNDLE2_RP2_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        this.value = `SR${doorModelId}01`;
    }, ["DOOR_MODEL"])

    // bundle 2 rp2 desc
    addLogic("BUNDLE2_RP2_DESC", function () {
        let doorWidthFeet = getState("DOOR_WIDTH_FEET");
        doorWidthFeet = String(doorWidthFeet).padStart(2, "0");
        let doorWidthInches = getState("DOOR_WIDTH_INCHES");
        let doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc")
        let color = getState("COLOR").desc;
        let panelStyle = getNode("FACE").getAttribute("desc");
        let bundle2_sc2_height = getState("BUNDLE2_SC2_HEIGHT");

        this.value = `SR ${doorWidthFeet}-${doorWidthInches}x${bundle2_sc2_height} ${doorModelDesc} ${color} ${panelStyle}`;

    }, ["DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "DOOR_MODEL", "COLOR", "FACE", "BUNDLE2_SC2_HEIGHT"])

    //bundle 3 rp1 part#
    addLogic("BUNDLE3_RP1_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle3_sc1_height = getState("BUNDLE3_SC1_HEIGHT");

        if (bundle3_sc1_height > 0) {
            this.value = `SR${doorModelId}01`;
        } else this.value = 'None';
    }, ["DOOR_MODEL", "BUNDLE3_SC1_HEIGHT", DIMENSION_DEPS])

    //bundle 3 rp1 desc
    addLogic("BUNDLE3_RP1_DESC", function () {
        let doorWidthFeet = getState("DOOR_WIDTH_FEET");
        doorWidthFeet = String(doorWidthFeet).padStart(2, "0");
        let doorWidthInches = getState("DOOR_WIDTH_INCHES");
        let doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc")
        let color = getState("COLOR").desc;
        let panelStyle = getNode("FACE").getAttribute("desc");
        let bundle3_sc1_height = getState("BUNDLE3_SC1_HEIGHT");
        if (bundle3_sc1_height > 0) {
            this.value = `SR ${doorWidthFeet}-${doorWidthInches}x${bundle3_sc1_height} ${doorModelDesc} ${color} ${panelStyle}`;
        } else this.value = '';

    }, [DIMENSION_DEPS, "DOOR_MODEL", "COLOR", "FACE", "BUNDLE3_SC1_HEIGHT"])

    //bundle3 rp2 
    addLogic("BUNDLE3_RP2_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle3_sc2_height = getState("BUNDLE3_SC2_HEIGHT");

        if (bundle3_sc2_height > 0) {
            this.value = `SR${doorModelId}01`;
        } else this.value = 'None';
    }, ["DOOR_MODEL", "BUNDLE3_SC2_HEIGHT", DIMENSION_DEPS])

    //bundle 3 rp desc
    addLogic("BUNDLE3_RP2_DESC", function () {
        let doorWidthFeet = getState("DOOR_WIDTH_FEET");
        doorWidthFeet = String(doorWidthFeet).padStart(2, "0");
        let doorWidthInches = getState("DOOR_WIDTH_INCHES");
        let doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc")
        let color = getState("COLOR").desc;
        let panelStyle = getNode("FACE").getAttribute("desc");
        let bundle3_sc2_height = getState("BUNDLE3_SC2_HEIGHT");
        if (bundle3_sc2_height > 0) {
            this.value = `SR ${doorWidthFeet}-${doorWidthInches}x${bundle3_sc2_height} ${doorModelDesc} ${color} ${panelStyle}`;
        } else this.value = '';

    }, [DIMENSION_DEPS, "DOOR_MODEL", "COLOR", "FACE", "BUNDLE3_SC2_HEIGHT"])


    // RP BASE Part# for each section
    addLogic("BUNDLE1_SC1_RP_BASE_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id")
        let bundle1_sc1_height = getState("BUNDLE1_SC1_HEIGHT");

        this.value = `${doorModelId}-${bundle1_sc1_height}`;
    }, ["DOOR_MODEL", "BUNDLE1_SC1_HEIGHT"])

    addLogic("BUNDLE1_SC2_RP_BASE_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id")
        let bundle1_sc2_height = getState("BUNDLE1_SC2_HEIGHT");

        this.value = `${doorModelId}-${bundle1_sc2_height}`;
    }, ["DOOR_MODEL", "BUNDLE1_SC2_HEIGHT"])

    addLogic("BUNDLE2_SC1_RP_BASE_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id")
        let bundle2_sc1_height = getState("BUNDLE2_SC1_HEIGHT");

        this.value = `${doorModelId}-${bundle2_sc1_height}`;
    }, ["DOOR_MODEL", "BUNDLE2_SC1_HEIGHT"])

    addLogic("BUNDLE2_SC2_RP_BASE_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id")
        let bundle2_sc2_height = getState("BUNDLE2_SC2_HEIGHT");
        this.value = `${doorModelId}-${bundle2_sc2_height}`;
    }, ["DOOR_MODEL", "BUNDLE2_SC2_HEIGHT"])

    addLogic("BUNDLE3_SC1_RP_BASE_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id")
        let bundle3_sc1_height = getState("BUNDLE3_SC1_HEIGHT");
        if (bundle3_sc1_height > 0) {
            this.value = `${doorModelId}-${bundle3_sc1_height}`;
        } else this.value = 'None'
    }, ["DOOR_MODEL", "BUNDLE3_SC1_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE3_SC2_RP_BASE_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id")
        let bundle3_sc2_height = getState("BUNDLE3_SC2_HEIGHT");
        if (bundle3_sc2_height > 0) {
            this.value = `${doorModelId}-${bundle3_sc2_height}`;
        } else this.value = 'None';
    }, ["DOOR_MODEL", "BUNDLE3_SC2_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE4_SC1_RP_BASE_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id")
        let bundle4_sc1_height = getState("BUNDLE4_SC1_HEIGHT");
        if (bundle4_sc1_height > 0) {
            this.value = `${doorModelId}-${bundle4_sc1_height}`;
        } else this.value = 'None'
    }, ["DOOR_MODEL", "BUNDLE4_SC1_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE4_SC2_RP_BASE_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id")
        let bundle4_sc2_height = getState("BUNDLE4_SC2_HEIGHT");
        if (bundle4_sc2_height > 0) {
            this.value = `${doorModelId}-${bundle4_sc2_height}`;
        } else this.value = 'None';
    }, ["DOOR_MODEL", "BUNDLE4_SC2_HEIGHT", DIMENSION_DEPS])


    addLogic("RP_BASE_QTY", function () {
        this.value = getState("WIDTH");
    }, ["WIDTH"])

    //RP Top Sheets part# and Desc for each section
    addLogic("BUNDLE1_SC1_RP_TOP_SHEET_SPNUM", function () {
        let color = getState("COLOR").value;
        let bundle1_sc1_height = getState("BUNDLE1_SC1_HEIGHT");
        this.value = `LND-${bundle1_sc1_height}${color}`;
    }, ["BUNDLE1_SC1_HEIGHT", "COLOR"])

    addLogic("BUNDLE1_SC2_RP_TOP_SHEET_SPNUM", function () {
        let color = getState("COLOR").value;
        let bundle1_sc2_height = getState("BUNDLE1_SC2_HEIGHT");
        this.value = `LND-${bundle1_sc2_height}${color}`;
    }, ["BUNDLE1_SC2_HEIGHT", "COLOR"])

    addLogic("BUNDLE2_SC1_RP_TOP_SHEET_SPNUM", function () {
        let color = getState("COLOR").value;
        let bundle2_sc1_height = getState("BUNDLE2_SC1_HEIGHT");
        this.value = `LND-${bundle2_sc1_height}${color}`;
    }, ["BUNDLE2_SC1_HEIGHT", "COLOR"])

    addLogic("BUNDLE2_SC2_RP_TOP_SHEET_SPNUM", function () {
        let color = getState("COLOR").value;
        let bundle2_sc2_height = getState("BUNDLE2_SC2_HEIGHT");
        this.value = `LND-${bundle2_sc2_height}${color}`;
    }, ["BUNDLE2_SC2_HEIGHT", "COLOR"])

    addLogic("BUNDLE3_SC1_RP_TOP_SHEET_SPNUM", function () {
        let color = getState("COLOR").value;
        let bundle3_sc1_height = getState("BUNDLE3_SC1_HEIGHT");
        if (bundle3_sc1_height > 0) {
            this.value = `LND-${bundle3_sc1_height}${color}`;
        } else this.value = 'None';
    }, ["BUNDLE3_SC1_HEIGHT", "COLOR", DIMENSION_DEPS])

    addLogic("BUNDLE3_SC2_RP_TOP_SHEET_SPNUM", function () {
        let color = getState("COLOR").value;
        let bundle3_sc2_height = getState("BUNDLE3_SC2_HEIGHT");
        if (bundle3_sc2_height > 0) {
            this.value = `LND-${bundle3_sc2_height}${color}`;
        } else this.value = 'None';
    }, ["BUNDLE3_SC2_HEIGHT", "COLOR", DIMENSION_DEPS])

     addLogic("BUNDLE4_SC1_RP_TOP_SHEET_SPNUM", function () {
        let color = getState("COLOR").value;
        let bundle4_sc1_height = getState("BUNDLE4_SC1_HEIGHT");
        if (bundle4_sc1_height > 0) {
            this.value = `LND-${bundle4_sc1_height}${color}`;
        } else this.value = 'None';
    }, ["BUNDLE4_SC1_HEIGHT", "COLOR", DIMENSION_DEPS])

    addLogic("BUNDLE4_SC2_RP_TOP_SHEET_SPNUM", function () {
        let color = getState("COLOR").value;
        let bundle4_sc2_height = getState("BUNDLE4_SC2_HEIGHT");
        if (bundle4_sc2_height > 0) {
            this.value = `LND-${bundle4_sc2_height}${color}`;
        } else this.value = 'None';
    }, ["BUNDLE4_SC2_HEIGHT", "COLOR", DIMENSION_DEPS])


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

    //Calculate the section bundle logic
    addLogic("SHORTEST_SECTION", function () { //find the shortest value
        let door_height = getState("HEIGHT");
        let num_of_sec = getState("NUM_OF_SEC");
        this.value = Math.floor((door_height / num_of_sec) / 3) * 3;
    }, ["HEIGHT", "NUM_OF_SEC", "WIDTH"])

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



    //End Caps Logic for bundle 1
    addLogic("BUNDLE1_SC1_END_CAPS_SPNUM", function () {
        let end_caps = getState("EndCaps");
        let door_model = getState("DOOR_MODEL");
        let BUNDLE1_SC1_HEIGHT = getState("BUNDLE1_SC1_HEIGHT");

        //door model = A = L138, d= L200
        //end caps = yes = double end caps
        //end caps = no = single end caps

        this.value = getEndCapsPartNum(BUNDLE1_SC1_HEIGHT, door_model, end_caps);

    }, ["BUNDLE1_SC1_HEIGHT", "DOOR_MODEL", "EndCaps"])

    addLogic("BUNDLE1_SC2_END_CAPS_SPNUM", function () {
        let end_caps = getState("EndCaps");
        let door_model = getState("DOOR_MODEL");
        let BUNDLE1_SC2_HEIGHT = getState("BUNDLE1_SC2_HEIGHT");
        this.value = getEndCapsPartNum(BUNDLE1_SC2_HEIGHT, door_model, end_caps);

    }, ["BUNDLE1_SC2_HEIGHT", "DOOR_MODEL", "EndCaps"])

    addLogic("BUNDLE2_SC1_END_CAPS_SPNUM", function () {
        let end_caps = getState("EndCaps");
        let door_model = getState("DOOR_MODEL");
        let bundle2_sc1_height = getState("BUNDLE2_SC1_HEIGHT");

        this.value = getEndCapsPartNum(bundle2_sc1_height, door_model, end_caps);

    }, ["BUNDLE2_SC1_HEIGHT", "DOOR_MODEL", "EndCaps"])

    addLogic("BUNDLE2_SC2_END_CAPS_SPNUM", function () {
        let end_caps = getState("EndCaps");
        let door_model = getState("DOOR_MODEL");
        let bundle2_sc2_height = getState("BUNDLE2_SC2_HEIGHT");

        this.value = getEndCapsPartNum(bundle2_sc2_height, door_model, end_caps);

    }, ["BUNDLE2_SC2_HEIGHT", "DOOR_MODEL", "EndCaps"])

    addLogic("BUNDLE3_SC1_END_CAPS_SPNUM", function () {
        let end_caps = getState("EndCaps");
        let door_model = getState("DOOR_MODEL");
        let bundle3_sc1_height = getState("BUNDLE3_SC1_HEIGHT");
        if (bundle3_sc1_height > 0) {
            this.value = getEndCapsPartNum(bundle3_sc1_height, door_model, end_caps);
        } else this.value = 'None';

    }, ["BUNDLE3_SC1_HEIGHT", "DOOR_MODEL", "EndCaps"])

    addLogic("BUNDLE3_SC2_END_CAPS_SPNUM", function () {
        let end_caps = getState("EndCaps");
        let door_model = getState("DOOR_MODEL");
        let bundle3_sc2_height = getState("BUNDLE3_SC2_HEIGHT");

        if (bundle3_sc2_height > 0) {
            this.value = getEndCapsPartNum(bundle3_sc2_height, door_model, end_caps);
        } else this.value = 'None';


    }, ["BUNDLE3_SC2_HEIGHT", "DOOR_MODEL", "EndCaps"])


    //Packaging Input logic
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
    // console.log("end caps part$", partNumbers[door_model]?.[end_caps]?.[section_height]);
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
    console.log("section heights", sectionHeights);
    // console.log("Sections", sectionHeights);
    return sectionHeights;
}

// function bundleByHeight(sections) {
//     const MAX_BUNDLE_WEIGHT = 150;
//     const bundles = [];
//     let width = getState("WIDTH");

//     // RULE: If width >= 199 → NO bundling, return all singles
//     if (width >= 199) {
//         return sections.map(h => ({
//             sections: [h],
//             weight: calculateSectionShipWeight(h, false)
//         }));
//     }


//     let remaining = [...sections];

//     // 🟢 STEP 0: Handle tallest odd FIRST
//     if (remaining.length) {
//         const tallest = remaining[0]; // array already sorted DESC
//         console.log("tallest", tallest);

//         const tallestCount = remaining.filter(h => h === tallest).length;
//         console.log("tallestCount", tallestCount);

//         if (tallestCount % 2 === 1) {
//             // remove ONE tallest
//             const index = remaining.indexOf(tallest);
//             remaining.splice(index, 1);

//             bundles.push({
//                 sections: [tallest],
//                 weight: calculateSectionShipWeight(tallest, false)
//             });
//         }
//     }

//     // 1️⃣ Bottom + Top special check
//     if (remaining.length >= 2) {
//         const bottom = remaining[0];
//         const top = remaining[1];

//         const weight =
//             calculateSectionShipWeight(bottom, true) +
//             calculateSectionShipWeight(top, false);

//         if (bottom === top && weight <= MAX_BUNDLE_WEIGHT) {
//             bundles.push({
//                 sections: [top, bottom],
//                 weight
//             });

//             remaining.splice(0, 2);
//         }
//     }

//     // 2️⃣ Process intermediates
//     const singles = [];
//     const pairs = [];
//     let i = 0;

//     while (i < remaining.length) {
//         const height = remaining[i];

//         let j = i;
//         while (j < remaining.length && remaining[j] === height) j++;

//         const count = j - i;

//         if (count % 2 === 1) {
//             singles.push({
//                 sections: [height],
//                 weight: calculateSectionShipWeight(height, false)
//             });
//             i += 1;
//         }

//         while (i + 1 < j) {
//             const weight =
//                 calculateSectionShipWeight(height, false) +
//                 calculateSectionShipWeight(height, true);

//             if (weight <= MAX_BUNDLE_WEIGHT) {
//                 pairs.push({
//                     sections: [height, height],
//                     weight
//                 });
//             } else {
//                 pairs.push({
//                     sections: [height],
//                     weight: calculateSectionShipWeight(height, false)
//                 });
//                 pairs.push({
//                     sections: [height],
//                     weight: calculateSectionShipWeight(height, true)
//                 });
//             }
//             i += 2;
//         }
//     }

//     // sort pairs DESC
//     pairs.sort((a, b) => b.sections[0] - a.sections[0]);

//     // sort singles ASC
//     singles.sort((a, b) => a.sections[0] - b.sections[0]);

//     const result = [
//         ...bundles,
//         ...pairs,
//         ...singles
//     ];

//      console.log("bundles", result);

//     return result;
// }

function bundleByHeight() {

    const width = Number(getState("WIDTH"));

    const shortest = Number(getState("SHORTEST_SECTION"));
    const sQty = Number(getState("SHORTEST_SECTIONS_QTY"));

    const tallest = Number(getState("TALLEST_SECTION"));
    const tQty = Number(getState("TALLEST_SECTION_QTY"));

    const result = [];

    // =========================================================
    // 🔵 MODE 1: NO BUNDLING (width >= 199)
    // =========================================================
    if (width >= 199) {

        const allSections = [];

        // expand tallest
        for (let i = 0; i < tQty; i++) {
            allSections.push(tallest);
        }

        // expand shortest
        for (let i = 0; i < sQty; i++) {
            allSections.push(shortest);
        }

        return allSections
            .sort((a, b) => b - a) // tallest → shortest
            .map(h => ({
                sections: [h],
                weight: calculateSectionShipWeight(h, false)
            }));
    }

    // =========================================================
    // 🔵 MODE 2: SMART BUNDLING (width < 199)
    // =========================================================

    // =========================
    // STEP 1: TALLEST RULES
    // =========================

    if (tQty === 1) {
        // single tallest will go last (handled later)
    }

    else if (tQty > 1 && tQty % 2 === 1) {

        // 1️⃣ first tallest single
        result.push({
            sections: [tallest],
            weight: calculateSectionShipWeight(tallest, false)
        });

        // 2️⃣ remaining pairs
        let remaining = tQty - 1;

        while (remaining >= 2) {
            result.push({
                sections: [tallest, tallest],
                weight:
                    calculateSectionShipWeight(tallest, false) +
                    calculateSectionShipWeight(tallest, true)
            });
            remaining -= 2;
        }
    }

    else if (tQty > 1 && tQty % 2 === 0) {

        let remaining = tQty;

        while (remaining >= 2) {
            result.push({
                sections: [tallest, tallest],
                weight:
                    calculateSectionShipWeight(tallest, false) +
                    calculateSectionShipWeight(tallest, true)
            });
            remaining -= 2;
        }
    }

    // =========================
    // STEP 2: SHORTEST RULES
    // =========================

    let sRemaining = sQty;

    while (sRemaining >= 2) {
        result.push({
            sections: [shortest, shortest],
            weight:
                calculateSectionShipWeight(shortest, false) +
                calculateSectionShipWeight(shortest, true)
        });
        sRemaining -= 2;
    }

    if (sRemaining === 1) {
        result.push({
            sections: [shortest],
            weight: calculateSectionShipWeight(shortest, false)
        });
    }

    // =========================
    // STEP 3: SINGLE TALLEST LAST (ONLY IF 1)
    // =========================

    if (tQty === 1) {
        result.push({
            sections: [tallest],
            weight: calculateSectionShipWeight(tallest, false)
        });
    }

    console.log("result", result);
    return result;
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
    let weightPerFoot;

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

