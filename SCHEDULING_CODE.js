function addSchedulingCodeLogic() {

    addLogic("BTM_SECTION_DOOR_MODEL", function () {
        let btm_section = getState("BTM_SECTION");

        if (btm_section) {
            this.value = getState("LM_DOOR_MODEL")
        } else this.value = '';

    }, ["BTM_SECTION", "LM_DOOR_MODEL"])

    // addLogic("TOP_SECTION_DOOR_MODEL", function () {
    //     let top_section = getState("TOP_SECTION");

    //     if (top_section) {
    //         this.value = getState("LM_DOOR_MODEL")
    //     } else this.value = '';

    // }, ["TOP_SECTION", "LM_DOOR_MODEL"])

    addLogic("INT1_SECTION_DOOR_MODEL", function () {
        let INT1_SECTION = getState("INT1_SECTION");

        if (INT1_SECTION) {
            this.value = getState("LM_DOOR_MODEL")
        } else this.value = '';

    }, ["INT1_SECTION", "LM_DOOR_MODEL"])

    addLogic("INT2_SECTION_DOOR_MODEL", function () {
        let INT2_SECTION = getState("INT2_SECTION");

        if (INT2_SECTION) {
            this.value = getState("LM_DOOR_MODEL")
        } else this.value = '';

    }, ["INT2_SECTION", "LM_DOOR_MODEL"])

    addLogic("INT3_SECTION_DOOR_MODEL", function () {
        let INT3_SECTION = getState("INT3_SECTION");

        if (INT3_SECTION) {
            this.value = getState("LM_DOOR_MODEL")
        } else this.value = '';

    }, ["INT3_SECTION", "LM_DOOR_MODEL"])

    addLogic("INT4_SECTION_DOOR_MODEL", function () {
        let INT4_SECTION = getState("INT4_SECTION");

        if (INT4_SECTION) {
            this.value = getState("LM_DOOR_MODEL")
        } else this.value = '';
    }, ["INT4_SECTION", "LM_DOOR_MODEL"])

    addLogic("INT5_SECTION_DOOR_MODEL", function () {
        let INT5_SECTION = getState("INT5_SECTION");

        if (INT5_SECTION) {
            this.value = getState("LM_DOOR_MODEL")
        } else this.value = '';
    }, ["INT5_SECTION", "LM_DOOR_MODEL"])

    addLogic("INT6_SECTION_DOOR_MODEL", function () {
        let INT6_SECTION = getState("INT6_SECTION");
        if (INT6_SECTION) {
            this.value = getState("LM_DOOR_MODEL")
        } else this.value = '';
    }, ["INT6_SECTION", "LM_DOOR_MODEL"])

    addLogic("INT7_SECTION_DOOR_MODEL", function () {
        let INT7_SECTION = getState("INT7_SECTION");
        if (INT7_SECTION) {
            this.value = getState("LM_DOOR_MODEL")
        } else this.value = '';
    }, ["INT7_SECTION", "LM_DOOR_MODEL"])

}