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

  addLogic("FACE", function () {
    this.value = $("input[name='FACE']:checked").val();
  }, [""])

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

  //  addNode({
  //   id: "FRAME_COLOR",
  //   value: null,
  // }, []);

  // addNode({
  //   id: "INSERT_COLOR",
  //   value: null,
  // }, []);

  addNode({
    id: "FRAME_COLOR",
    value: null,
    logic: function () {
      // Only fall back to door color if user hasn't made an explicit pick
      if (!frameColorUserOverride) {
        const doorColor = getNode("COLOR")?.value;
        if (doorColor?.value) {
          const match = [...AvailableColorImages, ...OptionalColorImages]
            .find(c => c.value === doorColor.value);
          this.value = match ?? null;
        }
      }
    }
  }, ["COLOR"]);

  addNode({
    id: "INSERT_COLOR",
    value: null,
    logic: function () {
      if (!insertColorUserOverride) {
        const doorColor = getNode("COLOR")?.value;
        if (doorColor?.value) {
          const match = [...AvailableColorImages, ...OptionalColorImages]
            .find(c => c.value === doorColor.value);
          this.value = match ?? null;
        }
      }
    }
  }, ["COLOR"]);

  //  addNode({
  //   id: "FRAME_COLOR",
  //   value: null,
  //   logic: function () {
  //     const doorColor = getNode("COLOR")?.value;
  //     if (!frameColorUserOverride && doorColor?.value) {
  //       const match = [...AvailableColorImages, ...OptionalColorImages]
  //         .find(c => c.value === doorColor.value);
  //       this.value = match ?? null;
  //     }
  //     // if user overrode, this.value stays as whatever setState last set
  //   }
  // }, ["COLOR"]);

  // addNode({
  //   id: "INSERT_COLOR",
  //   value: null,
  //   logic: function () {
  //     const doorColor = getNode("COLOR")?.value;
  //     if (!insertColorUserOverride && doorColor?.value) {
  //       const match = [...AvailableColorImages, ...OptionalColorImages]
  //         .find(c => c.value === doorColor.value);
  //       this.value = match ?? null;
  //     }
  //   }
  // }, ["COLOR"]);


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
            // this.value = Number($select.val());
            const val = Number($select.val());
            setState("NUM_OF_SEC", val);
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


  addLogic("STUCCO", function () {
    const panel_style = getState("FACE");
    const woodTones = ["X", "Y"];
    const stuccoFaces = ["F", "V", "T"];
    const door_color = getState("COLOR");
    const $stucco = $("#finishStucco");

    // default: hide
    let show = false;
    if (stuccoFaces.includes(panel_style) && !woodTones.includes(door_color)) {
      show = true;
    }

    $stucco.toggle(show);


  }, ["FACE", "COLOR"])

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

  // addLogic("SPRINGCYCLE", function () {
  //   let hardware = getState("HARDWARE_SET");
  //   const springCycle10k = $("#10K").closest(".rw-sliding-button");
  //   const springCycle20k = $("#20K").closest(".rw-sliding-button");
  //   var labelText = $('input[name="HARDWARE_SET"]:checked').next('label').text();

  //   console.log("hardware", hardware);
  //   if (hardware === "Y") {
  //     //disable 10k
  //     $("#10K").prop("disabled", true).removeAttr("checked");
  //     springCycle10k.addClass("disabled").removeClass("btn-checked selected");
  //     springCycle10k.addClass("color-tooltip");
  //     springCycle10k.attr("data-tooltip", `Spring Cycle 10K not available for ${labelText} Hardware`);

  //     //select 20k
  //     $("#20K").prop("checked", true).attr("checked", "checked");
  //     springCycle20k.addClass("btn-checked selected");
  //   } else {
  //     // Enable both
  //     springCycle10k.prop('disabled', false);
  //     springCycle20k.prop('disabled', false);

  //     // Default back to 10K
  //     $("#10K").prop('checked', true).attr("checked", "checked");
  //     $("#20K").prop('checked', false).removeAttr("checked");

  //     springCycle10k.addClass('selected btn-checked');
  //     springCycle20k.removeClass('selected btn-checked');
  //   }

  //   this.value = $(`input[type="radio"][name="SPRINGCYCLE"][checked]`).val()

  // }, ["HARDWARE_SET"])


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

  
  createNode(
    "GLASS_SHAPE_VISIBILITY",
    function () {

      const door_model = getState("DOOR_MODEL");
      const face = getState("FACE");
      const width = Number(getState("WIDTH"));

      const allowedFacesColonial = ["R", "C", "B", "F", "V", "M"];
      const allowedFacesRanch = ["R", "C", "B", "S", "T", "F", "V"];
      const allowedFacesSlim = ["F", "V"];

      const doorColor = getState("COLOR")?.value;
      const woodTones = ["X", "Y"];
      const isWoodTone = woodTones.includes(doorColor);


      $("input[name='GLASS_SHAPE']").each(function () {

        const value = $(this).val();
        const isGrandShape = value.startsWith("grand_");
        const isColonial = value === "colonial";
        const isRanch = value === "ranch";
        const isSlim = value.startsWith("slim_");

        let show = false;

        //condition to show granview buttons only
        if (door_model === "G" && isGrandShape) {
          show = true;
        }

        //condition to show colonial glass
        if (isColonial) {

          // default hide
          show = false;

          // allowed only when NOT G
          if (
            door_model !== "G" &&
            allowedFacesColonial.includes(face)
          ) {

            // Ranch special width restriction
            if (face === "R") {

              // hide between 76–95 6-4,7-11
              show = !(width >= 76 && width < 95);
            }

            // M special width restriction
            else if (face === "M") {

              show = (width >= 96);
            }

            // other valid faces
            else {

              show = true;
            }
          }
        }
        else if (isRanch) {
          if (allowedFacesRanch.includes(face) && door_model != 'G') {
            switch (face) {
              case "C":

                show = isWoodTone
                  ? width >= 95
                  : !(width >= 76 && width < 95);

                break;

              case "B":

                show = width >= 96;

                break;

              case "R":

                show = isWoodTone
                  ? width >= 76
                  : true;

                break;

              default:

                show = true;
            }

          }
        } else if (isSlim) {
          if (width > 96 && allowedFacesSlim.includes(face) && door_model != 'G') {
            show = true;
          }
        }

        $(this).closest(".rw-button").toggle(show);
      });


      // const $selected =
      //   $("input[name='GLASS_SHAPE']:checked")
      //     .closest(".rw-button");

      // if ($selected.length && $selected.is(":hidden")) {

      //   $("input[name='GLASS_SHAPE']")
      //     .prop("checked", false);

      //   const $firstVisible =
      //     $("input[name='GLASS_SHAPE']")
      //       .filter(function () {
      //         return $(this).closest(".rw-button").is(":visible");
      //       })
      //       .first();

      //   // $firstVisible
      //   //   .prop("checked", true)
      //   //   .trigger("change");
      // }

      const $checked =
        $("input[name='GLASS_SHAPE']:checked");

      if (
        $checked.length &&
        !$checked.closest(".rw-button").is(":visible")
      ) {

        $checked
          .prop("checked", false)
          .data("checked", false);

        $checked
          .closest(".rw-button")
          .removeClass("selected btn-checked");

        setState("GLASS_SHAPE", "");
      }

    },
    "",
    $("#GLASS_SHAPE_VISIBILITY")[0],
    ["DOOR_MODEL", "FACE", "WIDTH", "COLOR"]
  );

}

