const TRUSS_PART_SCHEDULE = [
    { maxWidth: 96, partNumber: "327-071-080P" },
    { maxWidth: 108, partNumber: "327-071-090P" },
    { maxWidth: 120, partNumber: "327-071-100P" },
    { maxWidth: 144, partNumber: "327-071-120P" },
    { maxWidth: 168, partNumber: "327-071-140P" },
    { maxWidth: 180, partNumber: "327-071-150P" },
    { maxWidth: 192, partNumber: "327-071-160P" },
    { maxWidth: 194, partNumber: "327-069-162S" },
    { maxWidth: 216, partNumber: "327-072-180P" },
    { maxWidth: 240, partNumber: "327-072-200P" },
    { maxWidth: 241, partNumber: "327-070-201S" },
    { maxWidth: 242, partNumber: "327-070-202S" }
];

function getTrussPartNumber(width) {
    const widthInInches = Number(width) || 0;
    return TRUSS_PART_SCHEDULE.find(({ maxWidth }) => widthInInches <= maxWidth)?.partNumber || "";
}

function getScheduledTrussQuantity(width, height, numOfSections) {
    const widthInInches = Number(width) || 0;
    const heightInInches = Number(height) || 0;
    const sections = Number(numOfSections) || 0;
    const isUnder12Feet3 = widthInInches < 147;

    if (isUnder12Feet3) return 0;

    switch (sections) {
        case 3:
            return widthInInches < 195 ? 1 : 3;

        case 4:
            if (heightInInches <= 84) {
                if (widthInInches < 195) return 1;
                return widthInInches < 219 ? 3 : 4;
            }

            return widthInInches < 219 ? 3 : 4;

        case 5:
            // Per the schedule, this breakpoint is door height (14'-3").
            if (heightInInches < 171) return 1;
            return widthInInches < 219 ? 3 : 5;

        case 6:
            if (widthInInches < 171) return 1;
            if (widthInInches < 195) return 3;
            return widthInInches < 219 ? 4 : 6;

        default:
            return 0;
    }
}


function loadTrussSchedule() {
    addLogic("TRUSS_QTY", function () {
        const scheduledQuantity = getScheduledTrussQuantity(
            getState("WIDTH"),
            getState("HEIGHT"),
            getState("NUM_OF_SEC")
        );
        const hasExtraTruss = ["Y", "YES"].includes(
            String(getState("EXTRA_TRUSS")).toUpperCase()
        );

        this.value = scheduledQuantity + (hasExtraTruss ? 1 : 0);
    }, ["EXTRA_TRUSS", "WIDTH", "HEIGHT", "NUM_OF_SEC"]);

    addLogic("TRUSS", function () {
        this.value = getTrussPartNumber(getState("WIDTH"));
    }, ["WIDTH"]);


}
