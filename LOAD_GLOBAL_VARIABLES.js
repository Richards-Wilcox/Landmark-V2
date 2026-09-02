function loadGlobalNodes() {

  addNode({
    id: "PRODUCT_TYPE",
    value: ""
  }, []);

  createNode(
    "PRODUCT_TYPE_TAB_VISIBILITY",
    function () {

      const productType = getState("PRODUCT_TYPE");

      if (productType === "ASSEMBLED_PANEL") {

        enableSection("GLAZING");
        //enableSection("HARDWARE");

        disableSection("HARDWARE");
        disableSection("OPERATOR_OPTIONS");

        if ($("#OPERATOR_OPTIONS").is(":visible")) {
          showSection(0);
        }

      }
      else if (productType === "RAW_PANEL") {

        enableSection("GLAZING");

        disableSection("OPERATOR_OPTIONS");
        // disableSection("GLAZING");
        disableSection("HARDWARE");

        if (
          $("#OPERATOR_OPTIONS").is(":visible") ||
          $("#GLAZING").is(":visible") ||
          $("#HARDWARE").is(":visible")
        ) {
          showSection(0);
        }

      }
      else if (productType === "COMPLETE_DOOR") {

        enableSection("GLAZING");
        enableSection("HARDWARE");
        enableSection("OPERATOR_OPTIONS");

      }

    },
    "",
    document.createElement("div"),
    ["PRODUCT_TYPE"]
  );

  addLogic("SIZE", function () {
    let toggle_Switch = getState("customSwitch");
    //if (toggle_Switch === "off") {
    this.value = $("input[name='SIZE']:checked").val();
    // }
  }, ["customSwitch"])


  addNode({
    id: "SIZE_HEIGHT",
    logic() {
      const sizeNode = getNode("SIZE");
      this.value = sizeNode
        ? Number(sizeNode.getAttribute("height")) || 0
        : 0;
    }
  }, ["SIZE"]);

  //this node fetch the with from the size radio button
  addNode({
    id: "SIZE_WIDTH",
    logic() {
      const sizeNode = getNode("SIZE");
      this.value = sizeNode
        ? Number(sizeNode.getAttribute("width")) || 0
        : 0;
      // const selectedSize = getState("SIZE");
      // const sizeNode = getNode(selectedSize);

      // this.value = sizeNode
      //   ? Number(sizeNode.getAttribute("width")) || 0
      //   : 0;
    }
  }, ["SIZE"]);

  addNode({
    id: "WIDTH",
    logic: function () {
      let toggle_Switch = getState("customSwitch");
      this.value =
        getState("customSwitch") === "on"
          ? getGlobalDoorWidthFromFeetInches()
          : getState("SIZE_WIDTH") * 12;
    }
  },
    ["SIZE_WIDTH", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "customSwitch"])

  addNode({
    id: "HEIGHT",
    logic: function () {
      let toggle_Switch = getState("customSwitch");
      this.value =
        getState("customSwitch") === "on"
          ? getGlobalDoorHeightFromFeetInches()
          : getState("SIZE_HEIGHT") * 12;

      // console.log("GET STATE HEIGHT", getState("HEIGHT"), toggle_Switch);
    }
  },
    ["SIZE_HEIGHT", "DOOR_HEIGHT_FEET", "DOOR_HEIGHT_INCHES", "customSwitch"]);

  addLogic("DOOR_WIDTH_FEET", function () {
    let toggle_Switch = getState("customSwitch");
    if (toggle_Switch === "off") {
      this.value = getState("SIZE_WIDTH");
    }
  }, ["customSwitch", "SIZE"])

  addLogic("DOOR_WIDTH_INCHES", function () {
    let toggle_Switch = getState("customSwitch");
    if (toggle_Switch === "off") {
      this.value = 0;
    } else this.value = $("#DOOR_WIDTH_INCHES").val()
  }, ["customSwitch", "DOOR_WIDTH_FEET"])

  addLogic("DOOR_HEIGHT_FEET", function () {
    let toggle_Switch = getState("customSwitch");
    if (toggle_Switch === "off") {
      // this.value = getDoorHeightFeetFromSize();
      this.value = getState("SIZE_HEIGHT");
    }
  }, ["customSwitch", "SIZE"])

  addLogic("DOOR_HEIGHT_INCHES", function () {
    let toggle_Switch = getState("customSwitch");
    if (toggle_Switch === "off") {
      this.value = 0;
    } else this.value = $("#DOOR_HEIGHT_INCHES").val()
  }, ["customSwitch", "DOOR_HEIGHT_FEET"])

  addLogic("LM_DOOR_MODEL", function () {
    this.value = getNode("DOOR_MODEL").getAttribute("id")
  }, ["DOOR_MODEL"])

  addNode({
    id: "WEIGHT", logic: function () {
      this.value = getCurrentDoorWeight()
    }, value: 500
  }, ["WIDTH", "HEIGHT", "COLOR", "HANGER_ANGLE", "HANGER_ANGLE_QTY", "END_CAPS",
    "TRUSS_QTY", "WINDOW_POSITION", "GLASS_SHAPE", "LIFT_TYPE"])

  addNode({
    id: "HANGER_ANGLE_QTY",
    logic: function () {
      this.value = Number($("#HANGER_ANGLE_QTY").text()) || 0;
    },
    value: 0
  }, []);

  addNode({
    id: "OP_6580L_VALUE",
    logic: function () {
      const height = Number(getState("DOOR_HEIGHT_FEET"));

      switch (height) {
        case 7: this.value = "951-193-07B"; break;
        case 8: this.value = "951-193-08B"; break;
        case 10: this.value = "951-193-010B"; break;
        default: this.value = "";
      }
    }
  }, ["SIZE"]);

  //OPERATOR 6590
  addNode({
    id: "OP_6590L_VALUE",
    logic: function () {
      const height = Number(getState("DOOR_HEIGHT_FEET"));

      switch (height) {
        case 7: this.value = "951-194-07B"; break;
        case 8: this.value = "951-194-08B"; break;
        case 10: this.value = "951-194-10B"; break;
        default: this.value = "";
      }
    }
  }, ["SIZE"]);


  //OPERATOR 220L CHAIN
  addNode({
    id: "OP_2220L_CHAIN_VALUE",
    logic: function () {
      const height = Number(getState("DOOR_HEIGHT_FEET"));

      switch (height) {
        case 7: this.value = "951-190-07C"; break;
        case 8: this.value = "951-190-08C"; break;
        case 10: this.value = "951-190-10C"; break;
        default: this.value = "";
      }
    }
  }, ["SIZE"]);

  //OPERATOR 2420 CHAIN
  addNode({
    id: "OP_2420L_CHAIN_VALUE",
    logic: function () {
      const height = Number(getState("DOOR_HEIGHT_FEET"));

      switch (height) {
        case 7: this.value = "951-191-07C"; break;
        case 8: this.value = "951-191-08C"; break;
        case 10: this.value = "951-191-10C"; break;
        default: this.value = "";
      }
    }
  }, ["SIZE"]);


  addLogic("HARDWARE_YESNO", function () {
    let hardware = getState("HARDWARE_SET");
    if (!hardware) {
      this.value = 0;
    } else this.value = 1;
  }, ["HARDWARE_SET"])

  addLogic("OPT_YESNO", function () {
    let opt = getState("OPERATOR");
    if (!opt || opt == 'PS') {
      this.value = 0;
    } else this.value = 1;
  }, ["OPERATOR"])

  addLogic("WINDOW_CUTOUTS_YESNO", function(){
    this.value = getState("WINDOW_CUTOUTS");
  }, ["WINDOW_CUTOUTS"])


addLogic("RAYNOR_DOOR", function () {
    const color = getState("COLOR").value;
    const face = getState("FACE");

    this.value =
        color === "X" ||
        color === "Y" ||
        face === "B"
            ? "Y"
            : "N";

}, ["COLOR", "FACE"]);

  setupQtyLogic("ADDITIONAL_TRANSMITTER", "ADDITIONAL_TRANSMITTER_QTY");
  setupQtyLogic("ADDITIONAL_CONTROL_PANEL", "ADDITIONAL_CONTROL_PANEL_QTY");
  setupQtyLogic("ADDITIONAL_KEYLESS_ENTRY", "ADDITIONAL_KEYLESS_ENTRY_QTY");
  setupQtyLogic("FULL_SETS", "FULL_SETS_QTY");
  setupQtyLogic("L_HANDLE", "L_HANDLE_QTY");
  setupQtyLogic("HANDLE", "HANDLE_QTY");
  setupQtyLogic("DOOR_KNOCKER", "DOOR_KNOCKER_QTY");
  setupQtyLogic("DOOR_STUDS", "DOOR_STUDS_QTY");
  setupQtyLogic("MAGNETIC_SET", "MAGNETIC_SET_QTY");
  setupQtyLogic("STRAPS", "STRAPS_QTY");

}

function updatePrice() {
  //Temp Function
  return Number.MAX_SAFE_INTEGER
}

function getFrameWidth() {
  return 5;
}
function getSectionHeight() {
  return 21;
}

function getSelectedNumberOfSection() {
  return parseInt(getState("NUM_OF_SEC"))
}

function setNumberOfSections(height) {
  const chart = getStackChart();
  const entries = chart[String(height)] || [];
  return entries.map(e => e.num_sections);

}

function getNumInsideHinges() {
  const width = getGlobalDoorWidth()
  if (width <= 110)
    return 1;
  if (width <= 146)
    return 2
  if (width <= 194)
    return 3
  if (width <= 230)
    return 4
  if (width <= 290)
    return 5
  if (width <= 336)
    return 6
  if (width <= 386)
    return 7
  if (width <= 434)
    return 9

}
//Needed in case we introduce headroom
function getHiLift() {
  return (Number)($("#HIGHLIFT").val())
}
function getTotalCenterHingeQTY() {

  return 1 //Yeah this isn't right but whatever
}
function getNumberOfGlazedSections() {
  if ($('#BOTTOM_SECTION > option:selected').val() === "Kick Panel")
    return getNumberofSections() - 1
  if ($('#BOTTOM_SECTION > option:selected').val() === "Thermatite")
    return getNumberOfSections() - $('#THERMA_SECTION_QTY > option:selected').attr('qty')
  return getNumberOfSections()

}

function getGlobalDoorWidth() {
  return getState("WIDTH")
}

function getGlobalDoorHeight() {
  return getState("HEIGHT")
}

function getNumberOfSections(height) {
  return getState("NUM_OF_SEC");
}

function getGlobalDoorWidthFromFeetInches() {
  return (parseInt(getState("DOOR_WIDTH_FEET")) * 12 + parseInt(getState("DOOR_WIDTH_INCHES")));
}

function getGlobalDoorWidthFromSizeRadio() {
  return (parseInt(getNode("SIZE").getAttribute("width")) || 0) * 12; // convert feet to inches
};

function getDoorWidthFeetFromSize() {
  return (parseInt(getNode("SIZE").getAttribute("width")));
};

function getGlobalDoorHeightFromFeetInches() {
  return (parseInt(getState("DOOR_HEIGHT_FEET")) * 12 + parseInt(getState("DOOR_HEIGHT_INCHES")));
}

function getDoorHeightFeetFromSize() {
  return (parseInt(getNode("SIZE").getAttribute("height")) || 0);
}

function getGlobalDoorHeightFromSizeRadio() {
  return (parseInt(getNode("SIZE").getAttribute("height")) || 0) * 12; // convert feet to inches
};

function operatorImageOnChangeLM(select) {

  const option = select.options[select.selectedIndex];
  const imageName = option.getAttribute("img");

  const img = document.getElementById(select.id + "_IMAGE");
  const link = img.closest("a");

  const placeholder = img
    .closest(".image-placeholder-container")
    .querySelector(".no-image-message");

  const qtySelect = document.getElementById(select.id + "_QTY");

  if (option.value === "NONE") {

    img.style.display = "none";
    placeholder.style.display = "flex";

    link.removeAttribute("href");
    link.style.pointerEvents = "none";

    if (qtySelect) {
      qtySelect.disabled = true;
    }

  } else {

    img.src = "/HTML/products/162059085/images/" + imageName;
    img.style.display = "block";

    placeholder.style.display = "none";

    link.href = "https://www.rwdoors.com/liftmaster/";
    link.style.pointerEvents = "auto";

    if (qtySelect) {
      qtySelect.disabled = false;
    }
  }
}

function magneticSetOnChange(select) {

  let qty = document.getElementById("MAGNETIC_SET_QTY");

  if (!qty) {
    return;
  }

  if (select.value === "NONE") {

    document.getElementById("MAGNETIC_SET_QTY").innerText = "0";

    let decreaseBtn = qty.parentElement.querySelector(".decrease-button");
    let increaseBtn = qty.parentElement.querySelector(".increase-button");

    decreaseBtn.disabled = true;
    increaseBtn.disabled = true;

  } else {

    let decreaseBtn = qty.parentElement.querySelector(".decrease-button");
    let increaseBtn = qty.parentElement.querySelector(".increase-button");

    decreaseBtn.disabled = false;
    increaseBtn.disabled = false;
  }
}


function setupQtyLogic(selectFieldId, qtyFieldId) {

  addLogic(qtyFieldId, function () {

    const selectedValue = getState(selectFieldId);
    const qty = document.getElementById(qtyFieldId);

    if (!qty) return;

    if (selectedValue === "NONE") {

      this.value = "0";
      qty.disabled = true;

    } else {

      qty.disabled = false;

      if (
        this.value === "0" ||
        this.value === "" ||
        this.value == null
      ) {

        const firstValidOption = [...qty.options].find(
          option => option.value !== "0"
        );

        if (firstValidOption) {
          this.value = firstValidOption.value;
        }
      }
    }

  }, [selectFieldId]);

}



//EasyWeb uses a fixed table to calculate section heights. This chart is provided here. 
function getStackChart() {
  return {
    '72': [
      { num_sections: 3, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24 }, //6-0
      { num_sections: 4, top_section_height: 18, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18 }, //6-0   
    ],

    '75': [
      { num_sections: 4, top_section_height: 21, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18 }
    ], //6-3
    '78': [
      { num_sections: 4, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 18, int1_rp2_height: 18 }, //6-6
    ],
    '81': [
      { num_sections: 4, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 18 },//6-9
    ],
    '84': [
      { num_sections: 4, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21 }, //7-0
    ],
    '87': [
      { num_sections: 4, top_section_height: 24, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21 }, //7-3    
    ],
    '90': [
      { num_sections: 4, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 21, int1_rp1_height: 21 }, //7-6
      { num_sections: 5, top_section_height: 18, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18 },//7-6- optional
    ],
    '93': [
      { num_sections: 4, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int1_rp2_height: 21 },//7-9
      { num_sections: 5, top_section_height: 21, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18 },//7-9 optional
    ],
    '96': [
      { num_sections: 4, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int1_rp2_height: 24 }, //8-0
      { num_sections: 5, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18 }, //8-0 optional  
    ],
    '99': [
      { num_sections: 5, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 21 }, //8-3
    ],
    '102': [
      { num_sections: 5, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 18, },//8-6
    ],
    '105': [
      { num_sections: 5, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21 }, //8-9
    ],
    '108': [
      { num_sections: 5, top_section_height: 24, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21 }, //9-0
      { num_sections: 6, top_section_height: 18, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18 }, //9-0 optional
    ],
    '111': [
      { num_sections: 5, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21 }, //9-3
      { num_sections: 6, top_section_height: 21, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18 }, //9-3 optional
    ],
    '114': [
      { num_sections: 5, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 24 }, //9-6
      { num_sections: 6, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18 }, //9-6 optional
    ],
    '117': [
      { num_sections: 5, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int1_rp2_height: 24, int2_rp1_height: 21 }, //9-9
      { num_sections: 6, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18 }, //9-9 optional
    ],
    '120': [
      { num_sections: 5, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int1_rp2_height: 24, int2_rp1_height: 24 }, //10-0
      { num_sections: 6, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 18, int2_rp2_height: 18 }, //10-0 optional
    ],
    '123': [
      { num_sections: 6, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21, int2_rp2_height: 18, }, //10-3    
    ],
    '126': [
      { num_sections: 6, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21, int2_rp2_height: 21 }, //10-6
      { num_sections: 7, top_section_height: 18, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18 }, //10-6 optional
    ],
    '129': [
      { num_sections: 6, top_section_height: 24, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21, int2_rp2_height: 21 }, //10-9
      { num_sections: 7, top_section_height: 21, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18 }, //10-9 optional
    ],
    '132': [
      { num_sections: 6, top_section_height: 21, btm_section_height: 24, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21, int2_rp2_height: 21 }, //11-0
      { num_sections: 7, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18 }, //11-0 optional
    ],
    '135': [
      { num_sections: 6, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 21, int1_rp2_height: 24, int2_rp1_height: 21, int2_rp2_height: 21 }, //11-3
      { num_sections: 7, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 18, int1_rp2_height: 21, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18 }, //11-3 optional
    ],
    '138': [
      { num_sections: 6, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int1_rp2_height: 24, int2_rp1_height: 21, int2_rp2_height: 21, }, //11-6
      { num_sections: 7, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18, }, //11-6 optional
    ],
    '141': [
      { num_sections: 6, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int1_rp2_height: 24, int2_rp1_height: 21, int2_rp2_height: 24 }, //11-9
      { num_sections: 7, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 18, int2_rp2_height: 21, int3_rp1_height: 18 }, //11-9 optional
    ],
    '144': [
      { num_sections: 6, top_section_height: 24, btm_section_height: 24, int1_r1_height: 24, int1_rp2_height: 24, int2_rp1_height: 24, int2_rp2_height: 24 }, //12-0
      { num_sections: 7, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21, int2_rp2_height: 21, int3_rp1_height: 18 }, //12-0 optional
    ],
    '147': [
      { num_sections: 7, top_section_height: 21, btm_section_height: 21, int1_r1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21, int2_rp2_height: 21, int3_rp1_height: 21 }, //12-3
      { num_sections: 8, top_section_height: 21, btm_section_height: 18, int1_r1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18, int3_rp2_height: 18 }, //12-3 optional
    ],
    '150': [
      { num_sections: 7, top_section_height: 24, btm_section_height: 21, int1_rp1_height: 21, int1_r2_height: 21, int2_rp1_height: 21, int2_rp2_height: 21, int3_rp1_height: 21 }, //12-6
      { num_sections: 8, top_section_height: 21, btm_section_height: 21, int1_r1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18, int3_rp2_height: 18 }, //12-6 optional
    ],
    '153': [
      { num_sections: 7, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 21, int1_r2_height: 21, int2_rp1_height: 21, int2_rp2_height: 21, int3_rp1_height: 21 }, //12-9
      { num_sections: 8, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 18, int1_r2_height: 21, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18, int3_rp2_height: 18 }, //12-9 optional
    ],
    '156': [
      { num_sections: 7, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 21, int1_rp2_height: 24, int2_rp1_height: 21, int2_rp2_height: 21, int3_rp1_height: 21 }, //13-0
      { num_sections: 8, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 18, int1_r2_height: 21, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18, int3_rp2_height: 18 }, //13-0 optional
    ],
    '159': [
      { num_sections: 7, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int1_rp2_height: 24, int2_rp1_height: 21, int2_rp2_height: 21, int3_rp1_height: 21 }, //13-3
      { num_sections: 8, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_r2_height: 21, int2_rp1_height: 18, int2_rp2_height: 21, int3_rp1_height: 18, int3_rp2_height: 18 }, //13-3 optional
    ],
    '162': [
      { num_sections: 7, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int1_rp2_height: 24, int2_rp1_height: 24, int2_rp2_height: 21, int3_rp1_height: 21 }, //13-6
      { num_sections: 8, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21, int2_rp2_height: 21, int3_rp1_height: 18, int3_rp2_height: 18 }, //13-6 optional
      { num_sections: 9, top_section_height: 18, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18, int3_rp2_height: 18, int4_rp1_height: 18 }, //13-6 optional
    ],
    '165': [
      { num_sections: 7, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int2_rp2_height: 24, int2_rp1_height: 24, int2_rp2_height: 24, int3_rp1_height: 21 }, //13-9
      { num_sections: 8, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int2_rp2_height: 21, int2_rp1_height: 21, int2_rp2_height: 21, int3_rp1_height: 18, int3_rp2_height: 21 }, //13-9 optional
      { num_sections: 9, top_section_height: 21, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18, int3_rp2_height: 18, int4_rp1_height: 18 }, //13-9 optional
    ],
    '168': [
      { num_sections: 7, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int1_rp2_height: 24, int2_rp1_height: 24, int2_rp2_height: 24, int3_rp1_height: 24 }, //14-0
      { num_sections: 8, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21, int2_rp2_height: 21, int3_rp1_height: 21, int3_rp2_height: 21 }, //14-0 optional      
      { num_sections: 9, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18, int3_rp2_height: 18, int4_rp1_height: 18 } //14-0 optional
    ]
  }
}


