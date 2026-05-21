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

    addLogic("WINDOW_1", function () {

        //x - classic col - 2, class ranch - 3
        //x - prem col - 6, prem ranch - 7

        const door_model = getState("DOOR_MODEL");
        const glass_shape = getState("GLASS_SHAPE");
        const frame_color = getState("FRAME_COLOR").value;

        let x = '';
        if (door_model == 'A') {
            if (glass_shape == 'colonial') {
                x = 2;
            } else if (glass_shape == 'ranch') {
                x = 3;
            }
        } else if (door_model == 'D') {
            if (glass_shape == 'colonial') {
                x = 6;
            } else if (glass_shape == 'ranch') {
                x = 7;
            }
        }

        console.log('x', x);
        console.log("frame color", frame_color);

        this.value = x === '' ? '' : `4${x}${frame_color}`;
    }, ["GLASS_SHAPE", "FRAME_COLOR", "DOOR_MODEL"])
}


function getPunchCount() {

}