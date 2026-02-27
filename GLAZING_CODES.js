function addGlazingCodeLogic() {

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
}
