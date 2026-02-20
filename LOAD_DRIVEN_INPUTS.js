function loadDrivenInputEvents() {
  createNode(
    "HIGHLIFT_LAYOUT",
    function () {
      this.setVisibility(getState("LIFT_TYPE") === 'HL')
    },
    "",
    $("#HIGHLIFT_LAYOUT")[0],
    ["LIFT_TYPE"])

  addLogic("HIGHLIFT_VALUE", function () {
    this.value = getState("HIGHLIFT")
  }, ["HIGHLIFT"])

  addLogic("HEADROOM_VALUE", function () {
    this.value = parseInt(getState("HIGHLIFT")) + 9;
  }, ["HIGHLIFT"])

  addNode({
    id: "COLOR",
    value: "",
    logic: function () {
      const color = $(".color-button-container.selected input[type='radio']");
      this.value = {
        value: color.attr("value"),
        hex: color.attr("hex"),
        desc: color.attr("desc"),
        colorName: color.attr("colorName")
      };
    }
  }, [""])

	addNode({
		id: "FRAME_COLOR",
		value: null,
	}, []);

	addNode({
		id: "INSERT_COLOR",
		value: null,
	}, []);

  // addLogic("FACE", function () {
  //   this.value = $("input[name='FACE']:checked").val();
  // }, "customPanelSwitch")

  addLogic("MIXED", function () {
    if (getState("DOOR_MODEL") === "D" && getState("WIDTH") >= 96) {
      $(".mixed-panel").show();
    } else $(".mixed-panel").hide();
  }, ["DOOR_MODEL", "WIDTH"])


  createNode(
    "NUM_OF_SEC",
    function () {
      let toggle_Switch = getState("customSwitch");
      if (toggle_Switch === "on") {
        let height = getState("HEIGHT");
        const $select = $("#NUM_OF_SEC");

        // Get all num_sections for this height (may contain duplicates)
        const list = getNumberOfSections(height);

        // Clear and rebuild dropdown
        $select.empty();
        list.forEach(n => {
          $select.append(`<option value="${n}">${n}</option>`);
        });

        // Determine what the selected value should be
        const previous = this.value;   // what user previously selected
        const hasPrevious = list.includes(Number(previous));

        // Set dropdown selection
        const selected = hasPrevious ? previous : list[0];
        $select.val(selected);

        // Update node value
        this.value = selected;

        // add listener ONLY once
        if (!this.listenerAdded) {
          $select.on("change", () => {
            this.value = Number($select.val());
          });
          this.listenerAdded = true;
        }
      } else {
        this.value = 4;
      }

    },
    "",
    $("#NUM_OF_SEC")[0],
    ["HEIGHT", "customSwitch"])


  addLogic("FINISH", function () {
    if ((getState("FACE") === 'F' || getState("FACE") === 'V' || getState("FACE") === 'T')) {
      $(".finish-stucco").show();
    } else $(".finish-stucco").hide();
  }, ["FACE"])

  addLogic("SPRINGTYPE", function () {

    let hardware = getState("HARDWARE_SET");
    const torsionBtn = $("#TORSION").closest(".rw-sliding-button");
    const extensionBtn = $("#EXTENSION").closest(".rw-sliding-button");
    var labelText = $('input[name="HARDWARE_SET"]:checked').next('label').text();

    // If hardware = A → disable Extension
    if (hardware === "A" || hardware === "C") {

      // Disable click
      $("#EXTENSION").prop("disabled", true);
      extensionBtn.addClass("disabled");

      extensionBtn.addClass("color-tooltip");
      extensionBtn.attr("data-tooltip", `Extension not available for ${labelText} Hardware`);


      // If Extension was selected, switch to Torsion
      if (getState("SPRINGTYPE") === "EXT") {
        $("#TORSION").prop("checked", true).trigger("change");
      }

    } else {
      // Re-enable Extension for other hardware types
      $("#EXTENSION").prop("disabled", false);
      extensionBtn.removeClass("disabled");
      extensionBtn.removeClass("color-tooltip");
      extensionBtn.removeAttr("data-tooltip");
    }

    this.value = $(`input[type="radio"][name="SPRINGTYPE"][checked]`).val();

  }, ["HARDWARE_SET"]);

  addLogic("SPRINGCYCLE", function () {
    let hardware = getState("HARDWARE_SET");
    const springCycle10k = $("#10K").closest(".rw-sliding-button");
    const springCycle20k = $("#20K").closest(".rw-sliding-button");
    var labelText = $('input[name="HARDWARE_SET"]:checked').next('label').text();

    console.log("hardware", hardware);
    if (hardware === "Y") {
      //disable 10k
      $("#10K").prop("disabled", true).removeAttr("checked");
      springCycle10k.addClass("disabled").removeClass("btn-checked selected");
      springCycle10k.addClass("color-tooltip");
      springCycle10k.attr("data-tooltip", `Spring Cycle 10K not available for ${labelText} Hardware`);

      //select 20k
      $("#20K").prop("checked", true).attr("checked", "checked");
      springCycle20k.addClass("btn-checked selected");
    } else {
      // Enable both
      springCycle10k.prop('disabled', false);
      springCycle20k.prop('disabled', false);

      // Default back to 10K
      $("#10K").prop('checked', true).attr("checked", "checked");
      $("#20K").prop('checked', false).removeAttr("checked");

      springCycle10k.addClass('selected btn-checked');
      springCycle20k.removeClass('selected btn-checked');
    }

    this.value = $(`input[type="radio"][name="SPRINGCYCLE"][checked]`).val()

  }, ["HARDWARE_SET"])


  addLogic("LIFT_TYPE", function () {
    let selectedHardware = getState("HARDWARE_SET");
    let SelectedSpring = getState("SPRINGTYPE");
    let SelectedInclinedTrack = getState("INCLINEDTRACK");
    $(".lift-option").hide();

    // Mapping hardware → allowed lift types
    //map for torsion
    const liftMapTorsion = {
      "A": ["STD12", "STD15", "LHF", "LHROUT", "HL"],
      "Y": ["STD12", "STD15", "32R", "LHF", "LHROUT", "HL"],
    };

    //map for extension
    const liftMapExtension = {
      "A": [""],
      "Y": ["STD12", "STD15", "LHREXT"],
    };

    // Select the correct mapping based on spring type
    let selectedMap =
      (SelectedSpring === "EXTENSION" || SelectedSpring === "EXT") ?
        liftMapExtension :
        liftMapTorsion;

    let showList = [];

    if (selectedHardware === "C") {
      if (SelectedInclinedTrack === "N") {
        showList = ["STD12", "STD15", "LHF", "LHROUT", "HL", "VL", "LHR_VL"]
      } else {
        showList = ["STD12", "STD15", "HL", "LHR_VL"]
      }
    } else {
      showList = selectedMap[selectedHardware] || [];
    }


    // Show each option in the list
    showList.forEach(id => {
      $("#opt-" + id).show();
    });

    this.value = $(`input[type="radio"][name="LIFT_TYPE"][checked]`).val()
  }, ["HARDWARE_SET", "SPRINGTYPE", "INCLINEDTRACK"])

}

