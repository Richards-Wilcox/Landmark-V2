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

  addLogic("PANEL_SPACING", function () {

    const panel_style = getState("FACE") || "";
    const glass_shape = getState("GLASS_SHAPE") || "";

    // face style - C, R, M => S
    // face style - B, S, T => C

    // special:
    // F and V with colonial glass => S
    // F and V with ranch glass => R

    const spacingSGroup = ["C", "R", "M"];
    const spacingCGroup = ["B", "S", "T"];


    // Special cases first for F and V
    if (panel_style === "F" || panel_style === "V") {
      if (glass_shape === "colonial") {
        this.value = "S";
        return;
      }

      if (glass_shape === "ranch") {
        this.value = "R";
        return;
      }

    }

    // General mappings
    if (spacingSGroup.includes(panel_style)) {
      this.value = "S";
    } else if (spacingCGroup.includes(panel_style)) {
      this.value = "C";
    } else {
      this.value = "";
    }

  }, ["FACE", "GLASS_SHAPE"])

  // createNode(
  //   "GLASS_SHAPE_VISIBILITY",
  //   function () {

  //     const door_model = getState("DOOR_MODEL");
  //     const face = getState("FACE");
  //     const width = Number(getState("WIDTH"));

  //     const allowedFacesColonial = ["R", "C", "B", "F", "V", "M"];
  //     const allowedFacesRanch = ["R", "C", "B", "S", "T", "F", "V"];
  //     const allowedFacesSlim = ["F", "V"];

  //     const doorColor = getState("COLOR")?.value;
  //     const woodTones = ["X", "Y"];
  //     const isWoodTone = woodTones.includes(doorColor);


  //     $("input[name='GLASS_SHAPE']").each(function () {

  //       const value = $(this).val();
  //       const isGrandShape = value.startsWith("grand_");
  //       const isColonial = value === "colonial";
  //       const isRanch = value === "ranch";
  //       const isSlim = value.startsWith("slim_");

  //       let show = false;

  //       //condition to show granview buttons only
  //       if (door_model === "G" && isGrandShape) {
  //         show = true;
  //       }

  //       //condition to show colonial glass
  //       if (isColonial) {

  //         // default hide
  //         show = false;

  //         // allowed only when NOT G
  //         if (
  //           door_model !== "G" &&
  //           allowedFacesColonial.includes(face)
  //         ) {

  //           // Ranch special width restriction
  //           if (face === "R") {

  //             // hide between 76–95 6-4,7-11
  //             show = !(width >= 76 && width < 95);
  //           }

  //           // M special width restriction
  //           else if (face === "M") {

  //             show = (width >= 96);
  //           }

  //           // other valid faces
  //           else {

  //             show = true;
  //           }
  //         }
  //       }
  //       else if (isRanch) {
  //         if (allowedFacesRanch.includes(face) && door_model != 'G') {
  //           switch (face) {
  //             case "C":

  //               show = isWoodTone
  //                 ? width >= 95
  //                 : !(width >= 76 && width < 95);

  //               break;

  //             case "B":

  //               show = width >= 96;

  //               break;

  //             case "R":

  //               show = isWoodTone
  //                 ? width >= 76
  //                 : true;

  //               break;

  //             default:

  //               show = true;
  //           }

  //         }
  //       } else if (isSlim) {
  //         if (width > 96 && allowedFacesSlim.includes(face) && door_model != 'G') {
  //           show = true;
  //         }
  //       }

  //       $(this).closest(".rw-button").toggle(show);
  //     });

  //     const $checked =
  //       $("input[name='GLASS_SHAPE']:checked");


  //     if (
  //       $checked.length &&
  //       !$checked.closest(".rw-button").is(":visible")
  //     ) {

  //       $checked
  //         .prop("checked", false)
  //         .data("checked", false);

  //       $checked
  //         .closest(".rw-button")
  //         .removeClass("selected btn-checked");

  //       setState("GLASS_SHAPE", "");

  //       $("input[name='GLASS_TYPE']:checked").prop("checked", false)
  //         .data("checked", false);
  //       $("input[name='GLASS_TYPE']:checked")
  //         .closest(".rw-button")
  //         .removeClass("selected btn-checked");
  //       setState("GLASS_TYPE", "");

  //     }

  //   },
  //   "",
  //   $("#GLASS_SHAPE_VISIBILITY")[0],
  //   ["DOOR_MODEL", "FACE", "WIDTH", "COLOR"]
  // );

  // createNode(
  //   "GLASS_TYPE_VISIBILITY",
  //   function () {

  //     const door_model = getState("DOOR_MODEL");
  //     const glass_shape = getState("GLASS_SHAPE");
  //     const currentGlassType = getState("GLASS_TYPE");

  //     console.log("node - glass shape", glass_shape);

  //     const allowedAllGlass = [
  //       "CLEAR", "CLEAR_SINGLE", "SATIN",
  //       "OBSCURE_GLASS_PINHEAD", "OBSCURE_GLASS_SINGLE",
  //       "DARK_TINT_SEALED", "DARK_TINT_SINGLE",
  //       "BLACK_SATIN_SEALED"
  //     ];

  //     const allowedSlimGlassL138 = ["CLEAR", "SATIN"];
  //     const allowedSlimGlassL200 = ["CLEAR", "SATIN", "BLACK_SATIN_SEALED"];

  //     const slimShapes = ["slim_single", "slim_double"];

  //     // ✅ STEP 1: HANDLE NULL SHAPE
  //     if (glass_shape == null) {

  //       console.log("glass shape missing → clearing GLASS_TYPE");

  //       if (currentGlassType) {
  //         setState("GLASS_TYPE", "");
  //       }

  //       // ✅ Remove ALL selection + default attribute
  //       $("input[name='GLASS_TYPE']")
  //         .prop("checked", false)
  //         .removeAttr("checked");

  //       $("input[name='GLASS_TYPE']")
  //         .closest(".rw-button")
  //         .removeClass("selected btn-checked");

  //       return;
  //     }

  //     // ✅ STEP 2: Determine allowed list
  //     let allowedList = allowedAllGlass;

  //     if (door_model === "A" && slimShapes.includes(glass_shape)) {
  //       allowedList = allowedSlimGlassL138;

  //     } else if (door_model === "D" && slimShapes.includes(glass_shape)) {
  //       allowedList = allowedSlimGlassL200;
  //     }

  //     // ✅ STEP 3: Toggle visibility
  //     $("input[name='GLASS_TYPE']").each(function () {

  //       const value = $(this).val();
  //       const show = allowedList.includes(value);

  //       $(this).closest(".rw-button").toggle(show);
  //     });

  //     // ✅ STEP 4: AUTO-SELECT DEFAULT (your missing piece)
  //     if (!currentGlassType && allowedList.length) {

  //       const defaultValue = allowedList.includes("CLEAR")
  //         ? "CLEAR"
  //         : allowedList[0];

  //       console.log("setting default GLASS_TYPE →", defaultValue);

  //       setState("GLASS_TYPE", defaultValue);

  //       // ✅ Sync UI with state
  //       $("input[name='GLASS_TYPE']").each(function () {

  //         const value = $(this).val();

  //         if (value === defaultValue) {
  //           $(this)
  //             .prop("checked", true)
  //             .attr("checked", "checked");

  //           $(this)
  //             .closest(".rw-button")
  //             .addClass("selected btn-checked");
  //         } else {
  //           $(this)
  //             .prop("checked", false)
  //             .removeAttr("checked");

  //           $(this)
  //             .closest(".rw-button")
  //             .removeClass("selected btn-checked");
  //         }
  //       });

  //       return;
  //     }

  //     // ✅ STEP 5: Fix invalid selection
  //     if (currentGlassType && !allowedList.includes(currentGlassType)) {

  //       console.log("invalid GLASS_TYPE → resetting");

  //       const defaultValue = allowedList.includes("CLEAR")
  //         ? "CLEAR"
  //         : allowedList[0];

  //       setState("GLASS_TYPE", defaultValue);

  //       // ✅ Sync UI
  //       $("input[name='GLASS_TYPE']").each(function () {

  //         const value = $(this).val();

  //         if (value === defaultValue) {
  //           $(this)
  //             .prop("checked", true)
  //             .attr("checked", "checked");

  //           $(this)
  //             .closest(".rw-button")
  //             .addClass("selected btn-checked");
  //         } else {
  //           $(this)
  //             .prop("checked", false)
  //             .removeAttr("checked");

  //           $(this)
  //             .closest(".rw-button")
  //             .removeClass("selected btn-checked");
  //         }
  //       });
  //     }

  //   },
  //   "",
  //   $("#GLASS_TYPE_VISIBILITY")[0],
  //   ["DOOR_MODEL", "GLASS_SHAPE", "FACE"]
  // );

  // createNode(
  //   "GLASS_INSERT_VISIBILITY",
  //   function () {

  //     const glass_shape = getState("GLASS_SHAPE");
  //     const width = Number(getState("WIDTH"));
  //     const panel_style = getState("FACE");
  //     const currentInsert = getState("GLASS_INSERT");

  //     const $glassInsertSection = $("#glass_insert_section");
  //     const $moreToggleRow = $("#more_glass_inserts_toggle_row");
  //     const $moreContainer = $("#more_glass_inserts_container");
  //     const $moreSwitch = $("#more_glass_inserts");

  //     const allowedColonial = [
  //       "stockton_colonial",
  //       "waterton_colonial",
  //       "prairie",
  //       "cascade_colonial",
  //       "alum_stockton_4",
  //       "alum_stockton_6",
  //       "alum_prairie",
  //       "square_bar_stockton_4",
  //       "square_bar_stockton_6",
  //       "square_bar_prairie",
  //       "round_bar_stockton_4",
  //       "round_bar_stockton_6",
  //       "round_bar_prairie"
  //     ];

  //     const allowedRanch = [
  //       "cascade_ranch",
  //       "stockton_ranch",
  //       "waterton_ranch",
  //       "stockbridge",
  //       "prairie",
  //       "square_bar_stockton_10",
  //       "square_bar_prairie",
  //       "round_bar_stockton_10",
  //       "round_bar_prairie",
  //       "alum_stockton_10",
  //       "alum_prairie",
  //       "arched_stockton",
  //       "arched_stockbridge",
  //       "arched_stockbridge_3",
  //       "arched_stockton_3",
  //       "arched_stockton_4",
  //       "arched_stockbridge_4"
  //     ];

  //     function getAllowedRanchByWidthColStd(width) {
  //       return allowedRanch.filter((item) => {
  //         if (["alum_stockton_10", "alum_prairie"].includes(item)) {
  //           return width < 243;
  //         }
  //         if (["arched_stockton", "arched_stockbridge"].includes(item)) {
  //           return width >= 95 && width < 143;
  //         }
  //         if (["arched_stockbridge_3", "arched_stockton_3"].includes(item)) {
  //           return width >= 143 && width < 190;
  //         }
  //         if (["arched_stockton_4", "arched_stockbridge_4"].includes(item)) {
  //           return width >= 192 && width < 236;
  //         }
  //         return true;
  //       });
  //     }

  //     function getAllowedRanchByWidthRanchStd(width) {
  //       return allowedRanch.filter((item) => {
  //         if (["alum_stockton_10", "alum_prairie"].includes(item)) {
  //           return width < 259;
  //         }
  //         if (["arched_stockton", "arched_stockbridge"].includes(item)) {
  //           return width >= 96 && width < 143;
  //         }
  //         if (["arched_stockbridge_3", "arched_stockton_3"].includes(item)) {
  //           return width >= 143 && width < 190;
  //         }
  //         if (["arched_stockton_4", "arched_stockbridge_4"].includes(item)) {
  //           return width >= 190 && width < 236;
  //         }
  //         return true;
  //       });
  //     }

  //     const filteredAllowedRanch = getAllowedRanchByWidthColStd(width);
  //     const filterRanchStd = getAllowedRanchByWidthRanchStd(width);

  //     // ✅ STEP 1: FULL RESET if no GLASS_SHAPE
  //     if (!glass_shape) {

  //       console.log("resetting GLASS_INSERT due to missing shape");

  //       if (currentInsert) {
  //         setState("GLASS_INSERT", "");
  //       }

  //       $("input[name='GLASS_INSERT']")
  //         .prop("checked", false)
  //         .removeAttr("checked");

  //       $("input[name='GLASS_INSERT']")
  //         .closest(".rw-button")
  //         .removeClass("selected btn-checked");

  //       $glassInsertSection.hide();
  //       $moreToggleRow.hide();
  //       $moreContainer.hide();
  //       $moreSwitch.prop("checked", false);

  //       return;
  //     }

  //     // ✅ STEP 2: SHOW/HIDE OPTIONS
  //     $("input[name='GLASS_INSERT']").each(function () {

  //       const value = String($(this).val() || "");
  //       let show = false;

  //       if (glass_shape === "colonial") {
  //         show = width >= 49 && allowedColonial.includes(value);
  //       }

  //       if (glass_shape === "ranch" && panel_style === "C") {
  //         show = width >= 49 && filteredAllowedRanch.includes(value);
  //       }

  //       if (glass_shape === "ranch" && panel_style === "R") {
  //         show = width >= 49 && filterRanchStd.includes(value);
  //       }

  //       if (glass_shape === "ranch" && (panel_style === "F" || panel_style === "V")) {
  //         show = width >= 72 && filterRanchStd.includes(value);
  //       }

  //       $(this).closest(".rw-button").toggle(show);
  //     });

  //     // ✅ STEP 3: REMOVE INVALID SELECTION
  //     if (currentInsert) {

  //       const $selected = $(`input[name='GLASS_INSERT'][value='${currentInsert}']`);

  //       if ($selected.length && !$selected.closest(".rw-button").is(":visible")) {

  //         console.log("invalid GLASS_INSERT → resetting");

  //         setState("GLASS_INSERT", "");

  //         $("input[name='GLASS_INSERT']")
  //           .prop("checked", false)
  //           .removeAttr("checked");

  //         $("input[name='GLASS_INSERT']")
  //           .closest(".rw-button")
  //           .removeClass("selected btn-checked");
  //       }
  //     }

  //     // ✅ STEP 4: SECTION VISIBILITY
  //     const visibleMainButtons = $("#glass_insert_section .rw-button").filter(function () {
  //       return $(this).css("display") !== "none";
  //     }).length;

  //     const visibleMoreButtons = $("#more_glass_inserts_container .rw-button").filter(function () {
  //       return $(this).css("display") !== "none";
  //     }).length;

  //     if (visibleMainButtons > 0) {
  //       $glassInsertSection.show();
  //     } else {
  //       $glassInsertSection.hide();
  //     }

  //     if (visibleMoreButtons > 0) {
  //       $moreToggleRow.show();
  //     } else {
  //       $moreToggleRow.hide();
  //       $moreContainer.hide();
  //       $moreSwitch.prop("checked", false);
  //     }

  //     if (visibleMoreButtons > 0 && $moreSwitch.is(":checked")) {
  //       $moreContainer.show();
  //     } else {
  //       $moreContainer.hide();
  //     }

  //   },
  //   "",
  //   $("#GLASS_INSERT_VISIBILITY")[0],
  //   ["GLASS_SHAPE", "WIDTH", "PANEL_SPACING", "FACE"]
  // );


  createNode(
    "GLASS_SHAPE_VISIBILITY",
    function () {

      const door_model = getState("DOOR_MODEL");
      const face = getState("FACE");
      const width = Number(getState("WIDTH"));
      const doorColor = getState("COLOR")?.value;

      const isWoodTone = ["X", "Y"].includes(doorColor);
      const allowedFacesColonial = ["R", "C", "B", "F", "V", "M"];
      const allowedFacesRanch = ["R", "C", "B", "S", "T", "F", "V"];
      const allowedFacesSlim = ["F", "V"];

      $("input[name='GLASS_SHAPE']").each(function () {

        const value = $(this).val();
        const isGrandShape = value.startsWith("grand_");
        const isColonial = value === "colonial";
        const isRanch = value === "ranch";
        const isSlim = value.startsWith("slim_");

        let show = false;

        if (door_model === "G" && isGrandShape) {
          show = true;
        }

        if (isColonial) {
          if (door_model !== "G" && allowedFacesColonial.includes(face)) {
            if (face === "R") {
              show = !(width >= 76 && width < 95);
            } else if (face === "M") {
              show = width >= 96;
            } else {
              show = true;
            }
          }
        } else if (isRanch) {
          if (door_model !== "G" && allowedFacesRanch.includes(face)) {
            switch (face) {
              case "C":
                show = isWoodTone ? width >= 95 : !(width >= 76 && width < 95);
                break;
              case "B":
                show = width >= 96;
                break;
              case "R":
                show = isWoodTone ? width >= 76 : true;
                break;
              default:
                show = true;
            }
          }
        } else if (isSlim) {
          show = width > 96 && allowedFacesSlim.includes(face) && door_model !== "G";
        }

        $(this).closest(".rw-button").toggle(show);
      });

      // If the currently-selected shape is now hidden, deselect it and clear glass type too
      const $checked = $("input[name='GLASS_SHAPE']:checked");
      if ($checked.length && !$checked.closest(".rw-button").is(":visible")) {
        clearRadio("GLASS_SHAPE");
        clearRadio("GLASS_TYPE");
      }

    },
    "",
    $("#GLASS_SHAPE_VISIBILITY")[0],
    ["DOOR_MODEL", "FACE", "WIDTH", "COLOR"]
  );

  // ─── GLASS_TYPE_VISIBILITY ────────────────────────────────────────────────────

  createNode(
    "GLASS_TYPE_VISIBILITY",
    function () {

      const door_model = getState("DOOR_MODEL");
      const glass_shape = getState("GLASS_SHAPE");
      const currentGlassType = getState("GLASS_TYPE");
      
      const allowedAllGlass = [
        "CLEAR", "CLEAR_SINGLE", "SATIN",
        "OBSCURE_GLASS_PINHEAD", "OBSCURE_GLASS_SINGLE",
        "DARK_TINT_SEALED", "DARK_TINT_SINGLE",
        "BLACK_SATIN_SEALED"
      ];
      const allowedSlimGlassL138 = ["CLEAR", "SATIN"];
      const allowedSlimGlassL200 = ["CLEAR", "SATIN", "BLACK_SATIN_SEALED"];
      const slimShapes = ["slim_single", "slim_double"];

      // STEP 1: No shape selected → clear everything and bail
      if (glass_shape == null) {        
        clearRadio("GLASS_TYPE");
        return;
      }

      // STEP 2: Determine which glass types are allowed
      let allowedList = allowedAllGlass;
      if (door_model === "A" && slimShapes.includes(glass_shape)) {
        allowedList = allowedSlimGlassL138;
      } else if (door_model === "D" && slimShapes.includes(glass_shape)) {
        allowedList = allowedSlimGlassL200;
      }

      // STEP 3: Toggle button visibility
      $("input[name='GLASS_TYPE']").each(function () {
        $(this).closest(".rw-button").toggle(allowedList.includes($(this).val()));
      });

      // STEP 4 & 5: Auto-select default or fix an invalid selection
      const needsDefault = !currentGlassType && allowedList.length;
      const needsReset = currentGlassType && !allowedList.includes(currentGlassType);

      if (needsDefault || needsReset) {
        const defaultValue = allowedList.includes("CLEAR") ? "CLEAR" : allowedList[0];        
        setState("GLASS_TYPE", defaultValue);
        syncRadioUI("GLASS_TYPE", defaultValue);
      }

    },
    "",
    $("#GLASS_TYPE_VISIBILITY")[0],
    ["DOOR_MODEL", "GLASS_SHAPE", "FACE"]
  );

  // ─── GLASS_INSERT_VISIBILITY ──────────────────────────────────────────────────
  createNode(
    "GLASS_INSERT_VISIBILITY",
    function () {

      const glass_shape = getState("GLASS_SHAPE");
      const width = Number(getState("WIDTH"));
      const panel_style = getState("FACE");
      const currentInsert = getState("GLASS_INSERT");

      const $glassInsertSection = $("#glass_insert_section");
      const $moreToggleRow = $("#more_glass_inserts_toggle_row");
      const $moreContainer = $("#more_glass_inserts_container");
      const $moreSwitch = $("#more_glass_inserts");

      const allowedColonial = [
        "stockton_colonial", "waterton_colonial", "prairie",
        "cascade_colonial", "alum_stockton_4", "alum_stockton_6",
        "alum_prairie", "square_bar_stockton_4", "square_bar_stockton_6",
        "square_bar_prairie", "round_bar_stockton_4", "round_bar_stockton_6",
        "round_bar_prairie"
      ];

      const allowedRanch = [
        "cascade_ranch", "stockton_ranch", "waterton_ranch", "stockbridge",
        "prairie", "square_bar_stockton_10", "square_bar_prairie",
        "round_bar_stockton_10", "round_bar_prairie", "alum_stockton_10",
        "alum_prairie", "arched_stockton", "arched_stockbridge",
        "arched_stockbridge_3", "arched_stockton_3", "arched_stockton_4",
        "arched_stockbridge_4"
      ];

      // Width-based ranch filters — differ only in numeric thresholds
      function getAllowedRanch(width, alumMax, arch1Min, arch1Max, arch3Min, arch3Max, arch4Min, arch4Max) {
        return allowedRanch.filter((item) => {
          if (["alum_stockton_10", "alum_prairie"].includes(item)) return width < alumMax;
          if (["arched_stockton", "arched_stockbridge"].includes(item)) return width >= arch1Min && width < arch1Max;
          if (["arched_stockbridge_3", "arched_stockton_3"].includes(item)) return width >= arch3Min && width < arch3Max;
          if (["arched_stockton_4", "arched_stockbridge_4"].includes(item)) return width >= arch4Min && width < arch4Max;
          return true;
        });
      }

      const filteredAllowedRanch = getAllowedRanch(width, 243, 95, 143, 143, 190, 192, 236); // ColStd
      const filterRanchStd = getAllowedRanch(width, 259, 96, 143, 143, 190, 190, 236); // RanchStd

      // STEP 1: No shape → full reset
      if (!glass_shape) {        
        clearRadio("GLASS_INSERT");
        $glassInsertSection.hide();
        $moreToggleRow.hide();
        $moreContainer.hide();
        $moreSwitch.prop("checked", false);
        return;
      }

      // STEP 2: Toggle individual insert options
      $("input[name='GLASS_INSERT']").each(function () {

        const value = String($(this).val() || "");
        let show = false;

        if (glass_shape === "colonial") {
          show = width >= 49 && allowedColonial.includes(value);
        } else if (glass_shape === "ranch") {
          switch (panel_style) {
            case "C":
              show = width >= 49 && filteredAllowedRanch.includes(value);
              break;
            case "R":
              show = width >= 49 && filterRanchStd.includes(value);
              break;
            case "F":
            case "V":
              show = width >= 72 && filterRanchStd.includes(value);
              break;
          }
        }

        $(this).closest(".rw-button").toggle(show);
      });

      // STEP 3: Clear selection if it's now hidden
      if (currentInsert) {
        const $selected = $(`input[name='GLASS_INSERT'][value='${currentInsert}']`);
        if ($selected.length && !$selected.closest(".rw-button").is(":visible")) {          
          clearRadio("GLASS_INSERT");
        }
      }

      // STEP 4: Show/hide the insert section and "more" toggle based on visible button counts
      const visibleMain = $("#glass_insert_section .rw-button").filter(function () {
        return $(this).css("display") !== "none";
      }).length;

      const visibleMore = $("#more_glass_inserts_container .rw-button").filter(function () {
        return $(this).css("display") !== "none";
      }).length;

      $glassInsertSection.toggle(visibleMain > 0);

      if (visibleMore > 0) {
        $moreToggleRow.show();
        $moreContainer.toggle($moreSwitch.is(":checked"));
      } else {
        $moreToggleRow.hide();
        $moreContainer.hide();
        $moreSwitch.prop("checked", false);
      }

    },
    "",
    $("#GLASS_INSERT_VISIBILITY")[0],
    ["GLASS_SHAPE", "WIDTH", "PANEL_SPACING", "FACE"]
  );

}

function syncRadioUI(name, value) {
  $(`input[name='${name}']`).each(function () {
    const isMatch = $(this).val() === value;
    $(this)
      .prop("checked", isMatch)
    [isMatch ? "attr" : "removeAttr"]("checked", "checked");
    $(this)
      .closest(".rw-button")
      .toggleClass("selected btn-checked", isMatch);
  });
}

//Fully clears a radio-button group (UI + state).
function clearRadio(name) {
  $(`input[name='${name}']`)
    .prop("checked", false)
    .removeAttr("checked")
    .closest(".rw-button")
    .removeClass("selected btn-checked");
  setState(name, "");
}
