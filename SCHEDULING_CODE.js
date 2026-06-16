function addSchedulingCodeLogic() {

    addLogic("SECTION_01_SC_CODE", createSectionScCodeLogic(0), ["SECTION_01", "WINDOW_POSITION", "GLASS_SHAPE", "COLOR", "EndCaps"]);
    addLogic("SECTION_02_SC_CODE", createSectionScCodeLogic(1), ["SECTION_02", "WINDOW_POSITION", "GLASS_SHAPE", "COLOR", "EndCaps"]);
    addLogic("SECTION_03_SC_CODE", createSectionScCodeLogic(2), ["SECTION_03", "WINDOW_POSITION", "GLASS_SHAPE", "COLOR", "EndCaps"]);
    addLogic("SECTION_04_SC_CODE", createSectionScCodeLogic(3), ["SECTION_04", "WINDOW_POSITION", "GLASS_SHAPE", "COLOR", "EndCaps"]);
    addLogic("SECTION_05_SC_CODE", createSectionScCodeLogic(4), ["SECTION_05", "WINDOW_POSITION", "GLASS_SHAPE", "COLOR", "EndCaps"]);
    addLogic("SECTION_06_SC_CODE", createSectionScCodeLogic(5), ["SECTION_06", "WINDOW_POSITION", "GLASS_SHAPE", "COLOR", "EndCaps"]);
    addLogic("SECTION_07_SC_CODE", createSectionScCodeLogic(6), ["SECTION_07", "WINDOW_POSITION", "GLASS_SHAPE", "COLOR", "EndCaps"]);
    addLogic("SECTION_08_SC_CODE", createSectionScCodeLogic(7), ["SECTION_08", "WINDOW_POSITION", "GLASS_SHAPE", "COLOR", "EndCaps"]);
    addLogic("SECTION_09_SC_CODE", createSectionScCodeLogic(8), ["SECTION_09", "WINDOW_POSITION", "GLASS_SHAPE", "COLOR", "EndCaps"]);
}

function getSectionInfo() {
    return [...getDoorInfo().sections].reverse();
}

function generateScCode(glazed, btm_retainer, panel_seq, section_height, sc_code) {

    // smartcom_code, width_code, panel_per_sb, setup_code
    const door_model = getState("LM_DOOR_MODEL");
    const panel_style = getState("FACE");
    const door_color = getState("COLOR")?.value;
    const drill = getState("DRILL");
    let drill_code = `${panel_style}${getState("PANEL_SPACING")}`;
    let end_caps = getState("EndCaps") === 'Y' ? 1 : 0;
    let width_code = `${section_height}-R${door_color}`;
    let panel_per_sb = 1;

    return `${door_model},${panel_style},${door_color},${drill},${drill_code},${glazed},${btm_retainer},${end_caps},${panel_seq},${sc_code},${width_code},${panel_per_sb}`;
}


function createSectionScCodeLogic(sectionIndex) {
    return function () {

        const section = getSectionInfo();

        if (section?.length && section[sectionIndex] != null && section[sectionIndex] !== "") {

            let sequence = section.map((_, index) => {
                if (index === 0) return 3;
                if (index === section.length - 1) return 1;
                return 2;
            });

            let glazed = section?.[sectionIndex]?.enabled?.some(v => v) ? 1 : 0;
            let btm_retainer = sectionIndex === 0 ? 1 : 0;
            let panel_seq = sequence[sectionIndex] ?? 0;
            let section_height = section?.[sectionIndex].height;
            let sc_code = getState(`SECTION_0${sectionIndex+1}_SMARTCOM_CODE`);
            

            // ✅ FIX HERE
            this.value = generateScCode(glazed, btm_retainer, panel_seq, section_height, sc_code);
        } else {
            this.value = null; // optional safety
        }
    };
}
