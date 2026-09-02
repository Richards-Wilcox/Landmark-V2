const LITE_RESULT_CACHE = {};

function loadDrivenInputEvents() {
  // createNode(
  //   "HIGHLIFT_LAYOUT",
  //   function () {
  //     this.setVisibility(getState("LIFT_TYPE") === 'HL')
  //   },
  //   "",
  //   $("#HIGHLIFT_LAYOUT")[0],
  //   ["LIFT_TYPE"])

  createNode(
    "HIGHLIFT_LAYOUT",
    function () {

      const isCommercial =
        getState("HARDWARE_SET") === "C";

      const maxValue = isCommercial ? 164 : 54;

      const $slider = $("#HIGHLIFT");

      $slider.attr("max", maxValue);
      $slider.prop("max", maxValue);

      const currentValue =
        Number(getState("HIGHLIFT")) || 17;

      // Reset value when current value exceeds new max
      if (currentValue > maxValue) {

        const newValue = isCommercial
          ? 54
          : 17;

        $slider.val(newValue);

        setState("HIGHLIFT", newValue);

        const highliftNode = getNode("HIGHLIFT_VALUE");
        if (highliftNode) {
          highliftNode.value = newValue;
        }

        const headroomNode = getNode("HEADROOM_VALUE");
        if (headroomNode) {
          headroomNode.value = Number(newValue) + 9;
        }
      }

      $slider.trigger("input");
      $slider.trigger("change");

      this.setVisibility(
        getState("LIFT_TYPE") === "HL"
      );
    },
    "",
    $("#HIGHLIFT_LAYOUT")[0],
    ["LIFT_TYPE", "HARDWARE_SET"]
  );

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

      const isSlimA =
        getState("DOOR_MODEL") === "A" &&
        (getState("GLASS_SHAPE") || "")
          .toLowerCase()
          .includes("slim");

      const doorColor = getNode("COLOR")?.value;

      // Silver becomes invalid outside Slim
      if (
        this.value?.value === "S" &&
        !isSlimA
      ) {

        frameColorUserOverride = false;

        const blackColor = [
          ...AvailableColorImages,
          SilverColor
        ].find(c => c.value === "K");

        if (blackColor) {
          this.value = blackColor;
          syncFrameColorUI("K");
        }

        return;
      }

      // User manually selected a color
      if (frameColorUserOverride) {
        syncFrameColorUI(this.value?.value);
        return;
      }

      // -----------------------
      // SLIM A
      // -----------------------
      if (isSlimA) {

        // Keep existing Black/Silver selection
        if (
          this.value?.value === "K" ||
          this.value?.value === "S"
        ) {
          syncFrameColorUI(this.value.value);
          return;
        }

        // Default to Black
        const blackColor = [
          ...AvailableColorImages,
          SilverColor
        ].find(c => c.value === "K");

        if (blackColor) {
          this.value = blackColor;
          syncFrameColorUI("K");
        }

        return;
      }

      // -----------------------
      // NON-SLIM
      // -----------------------
      if (doorColor?.value) {

        const match = [
          ...AvailableColorImages,
          ...OptionalColorImages
        ].find(
          c => c.value === doorColor.value
        );

        if (match) {
          this.value = match;
          syncFrameColorUI(match.value);
        }
      }
    }
  }, ["COLOR", "DOOR_MODEL", "GLASS_SHAPE"]);


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

  addNode({
    id: "JAMB_SEAL_COLOR",
    value: null,
    logic: function () {
      if (!jambSealColorUserOverride) {
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
    id: "JAMB_SEAL_SCREW_PACKAGES",
    value: null,
    logic: function () {
      this.value = Number(
        $("#JAMB_SEAL_SCREW_PACKAGES").text().trim()
      ) || 0;
    }
  }, [""])

  // addLogic("MIXED", function () {
  //   if (getState("DOOR_MODEL") === "D" && getState("WIDTH") >= 96) {
  //     $(".mixed-panel").show();
  //   } else {
  //     $(".mixed-panel").hide();
  //   }
  // }, ["DOOR_MODEL", "WIDTH"])

  createNode(
    "MIXED_PANEL_VISIBILITY",
    function () {
      const showMixed =
        getState("DOOR_MODEL") === "D" &&
        Number(getState("WIDTH")) >= 96;

      const $mixed = $(".mixed-panel");
      const $mixedInput = $("#MIXED");

      if (showMixed) {
        $mixed.show();
      } else {

        // If Mixed is selected, switch to Flush
        if (getState("FACE") === "M") {

          $("#MIXED")
            .prop("checked", false)
            .removeAttr("checked");

          $(".mixed-panel")
            .removeClass("btn-checked selected");

          $("#FLUSH")
            .prop("checked", true)
            .attr("checked", "checked")
            .trigger("change");

          $("#FLUSH")
            .closest(".rw-button")
            .addClass("btn-checked selected");

          setState("FACE", "F");
        }

        $mixedInput
          .prop("checked", false)
          .removeAttr("checked");

        $mixed
          .removeClass("btn-checked selected")
          .hide();
      }
    },
    "",
    $("#MIXED_PANEL_VISIBILITY")[0],
    ["DOOR_MODEL", "WIDTH", "FACE"]
  );


  createNode(
    "NUM_OF_SEC",
    function () {

      let toggle_Switch = getState("customSwitch");

      if (toggle_Switch === "on") {

        let height = getState("HEIGHT");
        const $select = $("#NUM_OF_SEC");

        // Get available section counts
        const list = setNumberOfSections(height);

        // Rebuild dropdown
        $select.empty();

        list.forEach(function (n) {
          $select.append(
            '<option value="' + n + '">' + n + '</option>'
          );
        });

        // Preserve previous selection if still valid
        const previous = this.value;
        const hasPrevious = list.includes(Number(previous));

        const selected = hasPrevious
          ? previous
          : list[0];

        // Update dropdown UI
        $select.val(String(selected));

        // Update RW node value
        this.value = String(selected);

        // Attach listener only once
        if (!this.listenerAdded) {

          $select.on("change", function () {

            const val = String($select.val());

            setState(
              "NUM_OF_SEC",
              val
            );

          });

          this.listenerAdded = true;
        }

      } else {

        this.value = "4";

        const $select = $("#NUM_OF_SEC");

        if ($select.length) {

          if ($select.find('option[value="4"]').length === 0) {

            $select.empty();
            $select.append(
              '<option value="4">4</option>'
            );
          }

          $select.val("4");
        }
      }
    },
    "",
    $("#NUM_OF_SEC")[0],
    ["HEIGHT", "customSwitch"]
  );

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

  addLogic("SPRING_CYCLE", function () {
    const value = $('input[name="SPRING_CYCLE"]:checked').val();
    this.value = value;
  }, ["HARDWARE_SET"])


  addLogic("SPRING_TYPE", function () {
    const value = $('input[name="SPRING_TYPE"]:checked').val();
    this.value = value;
  }, ["HARDWARE_SET"])

  addLogic("LIFT_TYPE", function () {
    let selectedHardware = getState("HARDWARE_SET");
    let SelectedSpring = getState("SPRING_TYPE");
    let SelectedInclinedTrack = getState("INCLINED_TRACK");
    $(".lift-option").hide();

    // Hide entire Lift Type section when hardware set is not selected
    // if (!selectedHardware) {
    //   $("#liftTypeSection").hide();
    //   return;
    // } else {
    //   $("#liftTypeSection").show();
    // }


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



    this.value = $(`input[type="radio"][name="LIFT_TYPE"][checked]`).val();

    const icCodeMap = {
      "STD12_TOR": { ic_code: "H", hwdesc: '12" Tor', trackCode: '12" Tor' },
      "STD12_EXT": { ic_code: "F", hwdesc: '12" Ext', trackCode: '12" Ext' },

      "STD15_TOR": { ic_code: "N", hwdesc: '15" Tor', trackCode: '15" Tor' },
      "STD15_EXT": { ic_code: "L", hwdesc: '15" Ext', trackCode: '15" Ext' },

      "32R_TOR": { ic_code: "G", hwdesc: '32" Tor', trackCode: '32" Tor' },

      "LHF_TOR": { ic_code: "T", hwdesc: 'LHF Tor', trackCode: 'LHF Tor' },

      "LHFOUT_TOR": { ic_code: "S", hwdesc: 'LHFOUT Tor', trackCode: 'LHFOUT Tor' },

      "LHR_TOR": { ic_code: "W", hwdesc: 'LHR Tor', trackCode: 'LHR Tor' },

      "LHROUT_TOR": { ic_code: "X", hwdesc: 'LHR OS Tor', trackCode: 'LHR OS Tor' },

      "LHREXT_EXT": { ic_code: "R", hwdesc: 'LH Ext', trackCode: 'LH Ext' },

      "HL_TOR": { ic_code: "I", hwdesc: 'I', trackCode: 'I' }
    };

    const selectedLiftType = this.value;
    const key = `${selectedLiftType}_${SelectedSpring}`;
    const selectedConfig = icCodeMap[key] || {};

    $(`input[name='LIFT_TYPE'][value='${selectedLiftType}']`)
      .attr("ic_code", selectedConfig.ic_code || "")
      .attr("hwdesc", selectedConfig.hwdesc || "")
      .attr("trackCode", selectedConfig.trackCode || "");

  }, ["HARDWARE_SET", "SPRING_TYPE", "INCLINED_TRACK"])

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
      if (glass_shape === "colonial" || glass_shape.includes("slim")) {
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

  addLogic("CENTER_HINGE_CODE", function () {
    const width = getState("WIDTH");
    const panel_style = getState("FACE");
    const spacing = getState("PANEL_SPACING") || "";

    if (!spacing) {
      const value = getCenterHingeCodeEarly();
      this.value = value;
    }

    if (getState("FACE") === 'M') {
      this.value = getNode("DESIGN_CODE").getAttribute("center_hinge_code");
    }
    else {
      const result = resolveLiteResult({
        width: getState("WIDTH"),
        panel_style: getState("FACE"),
        glass_shape: getState("GLASS_SHAPE") || "",
        spacing: getState("PANEL_SPACING") || ""
      });
      this.value = result ? (result.center_hinge_code || "") : "";
    }
  }, ["WIDTH", "FACE", "PANEL_SPACING", "GLASS_SHAPE", "DESIGN_CODE"]);


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

      //Hide the glass shape when mix panel is selected

      if (face === "M") {
        clearRadio("GLASS_SHAPE");
        $("#GLASS_SHAPE_LAYOUT").hide();

        $("#more_glass_types")
          .prop("checked", false)
          .trigger("change");

        $("#more_glass_types_container").hide();

        // Clear stale window position UI.
        // Do NOT select Top here.
        $("input[name='WINDOW_POSITION']")
          .prop("checked", false)
          .removeAttr("checked")
          .closest(".rw-button")
          .removeClass("selected btn-checked");

        const state = getState("WINDOW_STATE");

        if (state?.sections?.length) {

          state.sections.forEach(section => {

            // if (section.enabled?.length) {
            //   section.enabled.fill(false);
            // }

            section.selected = false;
          });

          state.hints = currentSection == 1;

          setState("WINDOW_STATE", state);
        }

        // Important:
        // Do not call setState("WINDOW_POSITION", "") here
        // because it can trigger WINDOW_POSITION logic and re-default to Top.

        forceRedraw();

        return;
      }
      else $("#GLASS_SHAPE_LAYOUT").show();

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

        clearRadio("GLASS_INSERT");
        setState("WINDOW_POSITION", "");
        forceRedraw();
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
      let face = getState("FACE");

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
      // Mixed has no GLASS_SHAPE.
      // Do not clear GLASS_TYPE for Mixed.
      if (face === "M") {

        $("#more_glass_types")
          .prop("checked", false)
          .trigger("change");

        $("#more_glass_types_container").hide();

        return;
      }

      // STEP 1: No shape selected → clear everything and bail
      if (!glass_shape) {
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

      // Show or hide the MoreGlass switch based on whether this is the narrow slim glass set.
      const $moreGlassToggleSwitch = $("#more_glass_type_switch");
      const showMoreGlassToggle = allowedList !== allowedSlimGlassL138;
      if (!showMoreGlassToggle) {
        $moreGlassToggleSwitch.prop("checked", false).trigger("change");
      }
      $moreGlassToggleSwitch.toggle(showMoreGlassToggle);


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
        "stockton_colonial",
        "waterton_colonial",
        "prairie",
        "cascade_colonial",
        "alum_stockton_4",
        "alum_stockton_6",
        "alum_prairie",
        "square_bar_stockton_4",
        "square_bar_stockton_6",
        "square_bar_prairie",
        "round_bar_stockton_4",
        "round_bar_stockton_6",
        "round_bar_prairie"
      ];

      const allowedRanch = [
        "cascade_ranch",
        "stockton_ranch",
        "waterton_ranch",
        "stockbridge",
        "prairie",
        "square_bar_stockton_10",
        "square_bar_prairie",
        "round_bar_stockton_10",
        "round_bar_prairie",
        "alum_stockton_10",
        "alum_prairie",
        "arched_stockton",
        "arched_stockbridge",
        "arched_stockbridge_3",
        "arched_stockton_3",
        "arched_stockton_4",
        "arched_stockbridge_4"
      ];

      function getAllowedRanch(width, alumMax, arch1Min, arch1Max, arch3Min, arch3Max, arch4Min, arch4Max) {
        return allowedRanch.filter((item) => {
          if (["alum_stockton_10", "alum_prairie"].includes(item)) {
            return width < alumMax;
          }

          if (["arched_stockton", "arched_stockbridge"].includes(item)) {
            return width >= arch1Min && width < arch1Max;
          }

          if (["arched_stockbridge_3", "arched_stockton_3"].includes(item)) {
            return width >= arch3Min && width < arch3Max;
          }

          if (["arched_stockton_4", "arched_stockbridge_4"].includes(item)) {
            return width >= arch4Min && width < arch4Max;
          }

          return true;
        });
      }

      const filteredAllowedRanch = getAllowedRanch(width, 243, 95, 143, 143, 190, 192, 236);
      const filterRanchStd = getAllowedRanch(width, 259, 96, 143, 143, 190, 190, 236);

      /*
       * MIXED PANEL INSERTS
       *
       * Mixed has no GLASS_SHAPE.
       * Show one insert family button.
       * Canvas will map C/R panel styles later.
       */

      if (panel_style === "M") {



        const allowedMixed = [
          ...allowedColonial
        ];

        $("input[name='GLASS_INSERT']").each(function () {

          const value = String($(this).val() || "");
          const show = allowedMixed.includes(value);

          $(this).closest(".rw-button").toggle(show);
        });

        if (currentInsert) {

          const currentValue =
            typeof currentInsert === "object"
              ? currentInsert.value
              : currentInsert;

          if (!allowedMixed.includes(currentValue)) {
            clearRadio("GLASS_INSERT");
          }
        }

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

        return;
      }

      /*
       * NON-MIXED
       * No glass shape means no insert.
       */
      if (!glass_shape) {
        clearRadio("GLASS_INSERT");
        $glassInsertSection.hide();
        $moreToggleRow.hide();
        $moreContainer.hide();
        $moreSwitch.prop("checked", false);
        return;
      }

      /*
       * NORMAL INSERT VISIBILITY
       */
      $("input[name='GLASS_INSERT']").each(function () {

        const value = String($(this).val() || "");
        let show = false;

        if (glass_shape === "colonial") {

          show =
            width >= 49 &&
            allowedColonial.includes(value);

        } else if (glass_shape === "ranch") {

          switch (panel_style) {
            case "C":
              show =
                width >= 49 &&
                filteredAllowedRanch.includes(value);
              break;

            case "R":
              show =
                width >= 49 &&
                filterRanchStd.includes(value);
              break;

            case "F":
            case "V":
              show =
                width >= 72 &&
                filterRanchStd.includes(value);
              break;
          }
        }

        $(this).closest(".rw-button").toggle(show);
      });

      /*
       * Clear selection if selected insert became hidden
       */
      if (currentInsert) {

        const currentValue =
          typeof currentInsert === "object"
            ? currentInsert.value
            : currentInsert;

        const $selected = $(`input[name='GLASS_INSERT'][value='${currentValue}']`);

        if ($selected.length && !$selected.closest(".rw-button").is(":visible")) {
          clearRadio("GLASS_INSERT");
        }
      }

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

  //LIFT TYPE VISIBILITY
  createNode(
    "LIFT_TYPE_VISIBILITY",
    function () {
      let hardware = getState("HARDWARE_SET");

      if (!hardware) {
        $("#liftTypeSection").hide();
        setState("LIFT_TYPE", "");
        // clearSwitch("SPRING_TYPE");
        // clearSwitch("SPRING_CYCLE");

      } else {
        $("#liftTypeSection").show();
      }

    }, "",
    $("#LIFT_TYPE_VISIBILITY")[0],
    ["HARDWARE_SET"]
  );

  //append design code dropdown values
  createNode(
    "DESIGN_CODE",
    function () {

      const panel_style = getState("FACE");
      const width = parseFloat(getState("WIDTH")) || 0;
      const currentValue = getState("DESIGN_CODE");

      const $designCode = $("#DESIGN_CODE");

      const designOptionsMap = [
        {
          min: 96,
          max: 119,
          options: [
            { value: "A", text: "CRC (MP-1)", pattern: "CRC", center_hinge_code: "C" }
          ]
        },
        {
          min: 120,
          max: 143,
          options: [
            { value: "B", text: "RCR (MP-2)", pattern: "RCR", center_hinge_code: "C" }
          ]
        },
        {
          min: 144,
          max: 167,
          options: [
            { value: "C", text: "CRRC (MP-3)", pattern: "CRRC", center_hinge_code: "D" },
            { value: "D", text: "RCCR (MP-4)", pattern: "RCCR", center_hinge_code: "C" },
            { value: "E", text: "CCRCC (MP-5)", pattern: "CCRCC", center_hinge_code: "C" }
          ]
        },
        {
          min: 168,
          max: 191,
          options: [
            { value: "J", text: "CRCRC (MP-10)", pattern: "CRCRC", center_hinge_code: "E" },
            { value: "K", text: "RCCCR (MP-11)", pattern: "RCCCR", center_hinge_code: "E" }
          ]
        },
        {
          min: 192,
          max: 211,
          options: [
            { value: "F", text: "CRRRC (MP-6)", pattern: "CRRRC", center_hinge_code: "E" },
            { value: "G", text: "CRCCRC (MP-7)", pattern: "CRCCRC", center_hinge_code: "E" },
            { value: "H", text: "RCRCR (MP-8)", pattern: "RCRCR", center_hinge_code: "E" },
            { value: "I", text: "CCRRCC (MP-9)", pattern: "CCRRCC", center_hinge_code: "D" },
            { value: "N", text: "CCCRCCC (MP-14)", pattern: "CCCRCCC", center_hinge_code: "E" },
            { value: "O", text: "RCCCCR (MP-15)", pattern: "RCCCCR", center_hinge_code: "D" }
          ]
        },
        {
          min: 212,
          max: 237,
          options: [
            { value: "L", text: "CRCCCRC (MP-12)", pattern: "CRCCCRC", center_hinge_code: "E" },
            { value: "M", text: "CCRCRCC (MP-13)", pattern: "CCRCRCC", center_hinge_code: "E" }
          ]
        },
        {
          min: 238,
          max: 255,
          options: [
            { value: "P", text: "RCCRCCR (MP-16)", pattern: "RCCRCCR", center_hinge_code: "E" },
            { value: "Q", text: "RCCCCCR (MP-17)", pattern: "RCCCCCR", center_hinge_code: "E" }
          ]
        },
        {
          min: 256,
          max: 278,
          options: [
            { value: "R", text: "CCCRCRCCC (MP-18)", pattern: "CCCRCRCCC", center_hinge_code: "E" },
            { value: "S", text: "CCRCCRCC (MP-19)", pattern: "CCRCCRCC", center_hinge_code: "E" }
          ]
        },
        {
          min: 279,
          max: Infinity,
          options: [
            { value: "T", text: "RCCCCCCCCR (MP-20)", pattern: "RCCCCCCCCR", center_hinge_code: "F" },
            { value: "U", text: "CCRCCCCRCC (MP-21)", pattern: "CCRCCCCRCC", center_hinge_code: "F" }
          ]
        }
      ];

      // Clear existing options
      $designCode.empty();

      // Only populate for FACE = M
      if (panel_style !== "M") {
        this.value = "";
        return "";
      }

      const match = designOptionsMap.find(item =>
        width >= item.min &&
        width <= item.max
      );

      if (!match) {
        this.value = "";
        return "";
      }

      // Populate options
      match.options.forEach(function (item) {
        $designCode.append(
          $("<option>", {
            value: item.value,
            text: item.text,
            pattern: item.pattern,
            center_hinge_code: item.center_hinge_code
          })
        );
      });

      // Keep current selection if still valid
      const isCurrentValueValid = match.options.some(
        option => option.value === currentValue
      );

      const selectedValue = isCurrentValueValid
        ? currentValue
        : match.options[0].value;

      $designCode.val(selectedValue);

      this.value = selectedValue;

      // Handle user change
      $designCode
        .off("change.designCode")
        .on("change.designCode", function () {

          const selected = $(this).val();

          // Update dropdown value
          $(this).val(selected);

          // Update state if supported
          if (typeof setState === "function") {
            setState("DESIGN_CODE", selected);
          }
        });

      return selectedValue;
    },
    "",
    $("#DESIGN_CODE")[0],
    ["FACE", "WIDTH"]
  );

  // Design Code visibility
  createNode(
    "DESIGN_CODE_VISIBILITY",
    function () {

      const panel_style = getState("FACE");
      if (panel_style === 'M') {
        $("#MixPanelLayout").show();
      } else {
        $("#MixPanelLayout").hide();
      }

    },
    "",
    $("#DESIGN_CODE_VISIBILITY")[0],
    ["FACE"]
  );

  // Inclined Track visibility
  createNode(
    "INCLINED_TRACK_VISIBILITY",
    function () {

      const hardware = getState("HARDWARE_SET");
      if (hardware === 'C') {
        $(".inclined-track").show();
      } else {
        $(".inclined-track").hide();
      }
    },
    "",
    $("#INCLINED_TRACK_VISIBILITY")[0],
    ["HARDWARE_SET"]
  );


  //Spring cycle visibility
  createNode(
    "SPRING_CYCLE_VISIBILITY",
    function () {

      let hardware = getState("HARDWARE_SET");

      const springCycle10k = $("#10K").closest(".rw-sliding-button");
      const springCycle20k = $("#20K").closest(".rw-sliding-button");

      const labelText =
        $('input[name="HARDWARE_SET"]:checked')
          .next("label")
          .text();

      if (!hardware) {
        this.value = "";
        clearSwitch("SPRING_CYCLE");
        return;
      }

      if (hardware === "Y") {

        // Disable 10K
        $("#10K")
          .prop("disabled", true)
          .prop("checked", false)
          .removeAttr("checked");

        springCycle10k
          .addClass("disabled color-tooltip")
          .removeClass("btn-checked selected");

        springCycle10k.attr(
          "data-tooltip",
          `Spring Cycle 10K not available for ${labelText} Hardware`
        );

        // Select 20K
        $("#20K")
          .prop("checked", true)
          .attr("checked", "checked");

        springCycle20k.addClass("btn-checked selected");

        this.value = "20K";
        setState("SPRING_CYCLE", "20K")

      } else {

        // Enable 10K
        $("#10K")
          .prop("disabled", false);

        springCycle10k
          .removeClass("disabled color-tooltip")
          .removeAttr("data-tooltip");

        // Enable 20K
        $("#20K")
          .prop("disabled", false);

        // Default back to 10K
        $("#10K")
          .prop("checked", true)
          .attr("checked", "checked");

        $("#20K")
          .prop("checked", false)
          .removeAttr("checked");

        springCycle10k.addClass("selected btn-checked");
        springCycle20k.removeClass("selected btn-checked");

        this.value = "10K";
        setState("SPRING_CYCLE", "10K")
      }

      return this.value;

    },
    "",
    $("#SPRING_CYCLE_VISIBILITY")[0],
    ["HARDWARE_SET"]
  );

  //SPRING TYPE VISIBILITY
  createNode(
    "SPRING_TYPE_VISIBILITY",
    function () {

      const hardware = getState("HARDWARE_SET");

      const torsionBtn = $("#TORSION").closest(".rw-sliding-button");
      const extensionBtn = $("#EXTENSION").closest(".rw-sliding-button");

      const labelText = $('input[name="HARDWARE_SET"]:checked')
        .next("label")
        .text();

      if (!hardware) {
        this.value = "";
        clearSwitch("SPRING_TYPE");
        return;
      }

      if (hardware === "A" || hardware === "C") {

        // Disable Extension
        $("#EXTENSION")
          .prop("disabled", true)
          .prop("checked", false)
          .removeAttr("checked");

        extensionBtn
          .removeClass("btn-checked selected")
          .addClass("disabled color-tooltip")
          .attr(
            "data-tooltip",
            `Extension not available for ${labelText} Hardware`
          );

        // Default to Torsion

        $("#TORSION")
          .prop("checked", true)
          .attr("checked", "checked");

        setState("SPRING_TYPE", "TOR");

        torsionBtn
          .addClass("btn-checked selected")
          .removeClass("disabled");




      } else {

        // Re-enable Extension
        $("#EXTENSION")
          .prop("disabled", false);

        extensionBtn
          .removeClass("disabled color-tooltip")
          .removeAttr("data-tooltip");

      }

      return "";

    },
    "",
    $("#SPRING_TYPE_VISIBILITY")[0],
    ["HARDWARE_SET"]
  );

  createNode(
    "FRAME_COLOR_VISIBILITY",
    function () {
      updateFrameColorRestriction();
    },
    "",
    $("#FRAME_COLOR_VISIBILITY")[0],
    ["DOOR_MODEL", "GLASS_SHAPE", "COLOR"]
  );


createNode(
  "INSERT_COLOR_VISIBILITY",
  function () {

    const glassShape =
      (getState("GLASS_SHAPE") || "").toLowerCase();

    const isSlim =
      glassShape.includes("slim");

    const doorColor =
      getNode("COLOR")?.value?.value;

    const isWoodTone =
      doorColor === "X" ||
      doorColor === "Y";

    if (isSlim) {

      $("#INSERT_COLOR").hide();

      insertColorUserOverride = false;
      setState("INSERT_COLOR", "");

    } else {

      $("#INSERT_COLOR").show();

      $("#OptionalInsertColorsSection .color-button-container").each(function () {

        const value = $(this)
          .find("input[type='radio']")
          .val();

        // X and Y only visible for woodtone doors
        if (
          value === "X" ||
          value === "Y"
        ) {

          $(this).toggle(isWoodTone);

        } else {

          $(this).show();

        }

      });

    }

  },
  "",
  $("#INSERT_COLOR_VISIBILITY")[0],
  ["GLASS_SHAPE", "COLOR"]
);
  //Full set Visibility - Decorative hardware
  createNode(
    "FULL_SETS_VISIBILITY",
    function () {
      let dec_hardware = getState("DEC_HARDWARE");

      if (dec_hardware === "FS") {
        $("#FULL_SETS_CARD").show();
      } else {
        $("#FULL_SETS").val("NONE");
        operatorImageOnChangeLM(document.getElementById("FULL_SETS"));
        setState("FULL_SETS", '');
        $("#FULL_SETS_CARD").hide();
      }

    }, "",
    $("#FULL_SETS_VISIBILITY")[0],
    ["DEC_HARDWARE"]
  );


  //Individial components for dec hardware - visibility
  createNode(
    "INDVIDIUAL_COMPO_VISIBILITY",
    function () {
      let dec_hardware = getState("DEC_HARDWARE");

      if (dec_hardware === "IC") {
        $("#INDIVIDIUAL_CARD").show();
      } else {

        // L Handle
        $("#L_HANDLE").val("NONE");
        $("#L_HANDLE_QTY").val("0");
        setState("L_HANDLE", "NONE");
        setState("L_HANDLE_QTY", 0);
        operatorImageOnChangeLM(document.getElementById("L_HANDLE"));

        // Handle
        $("#HANDLE").val("NONE");
        $("#HANDLE_QTY").val("0");
        setState("HANDLE", "NONE");
        setState("HANDLE_QTY", 0);
        operatorImageOnChangeLM(document.getElementById("HANDLE"));

        // Door Knocker
        $("#DOOR_KNOCKER").val("NONE");
        $("#DOOR_KNOCKER_QTY").val("0");
        setState("DOOR_KNOCKER", "NONE");
        setState("DOOR_KNOCKER_QTY", 0);
        operatorImageOnChangeLM(document.getElementById("DOOR_KNOCKER"));

        // Straps
        $("#STRAPS").val("NONE");
        $("#STRAPS_QTY").val("0");
        setState("STRAPS", "NONE");
        setState("STRAPS_QTY", 0);
        operatorImageOnChangeLM(document.getElementById("STRAPS"));

        $("#INDIVIDIUAL_CARD").hide();
      }

    },
    "",
    $("#INDVIDIUAL_COMPO_VISIBILITY")[0],
    ["DEC_HARDWARE"]
  );

  createNode(
    "MAGNETIC_SETS_VISIBILITY",
    function () {
      let dec_hardware = getState("DEC_HARDWARE");

      if (dec_hardware === "MS") {
        $("#MAGNETIC_SETS_CARD").show();
      } else {
        $("#MAGNETIC_SET").val("NONE");
        setState("MAGNETIC_SET", '');
        $("#MAGNETIC_SETS_CARD").hide();
      }

    }, "",
    $("#MAGNETIC_SETS_VISIBILITY")[0],
    ["DEC_HARDWARE"]
  );

  let applyingMixedGlassTypeDefault = false;

  $(document)
    .off("change.mixedGlassTypeTop")
    .on("change.mixedGlassTypeTop", "input[name='GLASS_TYPE']", function () {

      if (applyingMixedGlassTypeDefault) {
        return;
      }

      if (getState("FACE") !== "M") {
        return;
      }

      const selectedGlassType =
        $("input[name='GLASS_TYPE']:checked").val() || "";

      if (!selectedGlassType) {

        const state = getState("WINDOW_STATE");

        if (state?.sections?.length) {

          state.sections.forEach(section => {

            if (section.enabled?.length) {
              section.enabled.fill(false);
            }

            section.selected = false;
          });

          setState("WINDOW_STATE", state);
        }

        forceRedraw();
        return;
      }

      applyingMixedGlassTypeDefault = true;

      try {

        // Select TOP window position UI
        $("input[name='WINDOW_POSITION']")
          .prop("checked", false)
          .removeAttr("checked")
          .closest(".rw-button")
          .removeClass("selected btn-checked");

        $("input[name='WINDOW_POSITION'][value='top']")
          .prop("checked", true)
          .attr("checked", "checked")
          .closest(".rw-button")
          .addClass("selected btn-checked");

        // Update WINDOW_POSITION state
        const windowPositionNode = getNode("WINDOW_POSITION");

        if (windowPositionNode) {
          windowPositionNode.value = "top";
        }

        // Make sure mixed panel window positions exist
        recalcWindowState();

        const state = getState("WINDOW_STATE");

        if (state?.sections?.length) {

          state.sections.forEach(section => {
            if (section.enabled?.length) {
              section.enabled.fill(false);
            }

            section.selected = false;
          });

          // Only enable top windows while on Glazing
          if (currentSection == 1) {
            const topSection = state.sections[0];

            if (topSection?.enabled?.length) {
              topSection.enabled.fill(true);
            }
          }

          state.hints = currentSection == 1;

          setState("WINDOW_STATE", state);
        }

        setState("WINDOW_POSITION", "top");

        forceRedraw();

      } finally {

        setTimeout(() => {
          applyingMixedGlassTypeDefault = false;
        }, 0);
      }
    });

  const designCodeNode = getNode("DESIGN_CODE");

  if (designCodeNode && typeof designCodeNode.logic === "function") {
    designCodeNode.logic.call(designCodeNode);
  }

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

function clearSwitch(name) {
  $(`input[name='${name}']`)
    .prop("checked", false)
    .removeAttr("checked")
    .closest(".rw-sliding-button")
    .removeClass("selected btn-checked");
  setState(name, "");
}

function setSwitch(name) {
  $(`input[name='${name}']`)
    .prop("checked", true)
    .addAttr("checked")
    .closest(".rw-sliding-button")
    .addClass("selected btn-checked");

  let value = $(`input[name='${name}']`).val();
  setState(name, value);
}

function computeValue(field) {
  const width = getState("WIDTH");
  const panel_style = getState("FACE");
  const glass_shape = getState("GLASS_SHAPE") || "";
  const spacing = getState("PANEL_SPACING") || "";

  const result = resolveLiteResult({
    width: getState("WIDTH"),
    panel_style: getState("FACE"),
    glass_shape: getState("GLASS_SHAPE") || "",
    spacing: getState("PANEL_SPACING") || ""
  });

  return result ? (result[field] ?? 0) : 0;
}


function getCenterHingeCodeEarly() {
  const width = Number(getState("WIDTH")) || 0;
  const panel_style = getState("FACE");

  if (!width || !panel_style) {
    return "";
  }

  // Default table by FACE so it can compute before glazing is selected
  let type = "";

  if (panel_style === "C" || panel_style === "F" || panel_style === "B" || panel_style === "V") {
    type = "colonial_std";
  } else if (panel_style === "R" || panel_style === "S" || panel_style === "T") {
    type = "ranch_std";
  } else {
    return "";
  }

  const result = getLites(width, type);

  return result ? (result.center_hinge_code || "") : "";
}


function resolveLiteResult(options) {
  const width = Number(options.width) || 0;
  const panel_style = options.panel_style || "";
  const glass_shape = options.glass_shape || "";
  const spacing = options.spacing || "";

  if (!width || !panel_style) return null;

  let window_type = "";

  // FACE = C
  if (panel_style === "C") {
    if (glass_shape === "colonial") {
      window_type = "colonial_std";
    } else if (glass_shape === "ranch") {
      window_type = "RanchOverColonialStd";
    } else if (!glass_shape) {
      window_type = "colonial_std";
    }
  }

  // FACE = R
  else if (panel_style === "R") {
    if (glass_shape === "colonial") {
      window_type = "ColonialOverRanchStd";
    } else if (glass_shape === "ranch") {
      window_type = "ranch_std";
    } else if (!glass_shape) {
      window_type = "ranch_std";
    }
  }

  // FACE = F or V
  else if (panel_style === "F" || panel_style === "V") {
    if (glass_shape === "colonial") {
      window_type = "colonial_std";
    } else if (glass_shape === "ranch") {
      window_type = "ranch_std";
    }

  }

  if (!window_type) return null;

  const cacheKey = `${width}|${panel_style}|${glass_shape}|${spacing}`;

  if (LITE_RESULT_CACHE[cacheKey]) {
    return LITE_RESULT_CACHE[cacheKey];
  }

  const result = getLites(width, window_type) || null;
  LITE_RESULT_CACHE[cacheKey] = result;

  return result;
}


function getLites(width, type) {
  const ranges = {
    colonial_std: [
      { min: 48, max: 71, lites: 2, center_hinge_code: "B" },
      { min: 72, max: 94, lites: 3, center_hinge_code: "C" },
      { min: 95, max: 118, lites: 4, center_hinge_code: "B" },
      { min: 119, max: 142, lites: 5, center_hinge_code: "C" },
      { min: 143, max: 165, lites: 6, center_hinge_code: "C" },
      { min: 166, max: 189, lites: 7, center_hinge_code: "E" },
      { min: 190, max: 227, lites: 8, center_hinge_code: "D" },
      { min: 228, max: 235, lites: 9, center_hinge_code: "E" },
      { min: 236, max: 258, lites: 10, center_hinge_code: "F" },
      { min: 259, max: 281, lites: 11, center_hinge_code: "G" },
      { min: 282, max: 287, lites: 12, center_hinge_code: "F" }
    ],
    ranch_std: [
      { min: 48, max: 94, lites: 1, center_hinge_code: "B" },
      { min: 95, max: 142, lites: 2, center_hinge_code: "C" },
      { min: 143, max: 189, lites: 3, center_hinge_code: "C" },
      { min: 190, max: 235, lites: 4, center_hinge_code: "D" },
      { min: 236, max: 281, lites: 5, center_hinge_code: "E" },
      { min: 282, max: 287, lites: 6, center_hinge_code: "F" }
    ],
    RanchOverColonialStd: [
      { min: 48, max: 75, lites: 1, center_hinge_code: "B" },
      { min: 76, max: 76, lites: 0, center_hinge_code: "" },
      { min: 77, max: 119, lites: 2, center_hinge_code: "B" },
      { min: 120, max: 178, lites: 3, center_hinge_code: "C" },
      { min: 179, max: 228, lites: 4, center_hinge_code: "D" },
      { min: 229, max: 259, lites: 5, center_hinge_code: "E" },
      { min: 260, max: 282, lites: 6, center_hinge_code: "F" }
    ],
    ColonialOverRanchStd: [
      { min: 48, max: 75, lites: 2, center_hinge_code: "B" },
      { min: 76, max: 76, lites: 0, center_hinge_code: "" },
      { min: 77, max: 119, lites: 4, center_hinge_code: "B" },
      { min: 120, max: 178, lites: 6, center_hinge_code: "C" },
      { min: 179, max: 228, lites: 8, center_hinge_code: "D" },
      { min: 229, max: 259, lites: 10, center_hinge_code: "E" },
      { min: 260, max: 282, lites: 12, center_hinge_code: "F" }
    ]
  };

  const table = ranges[type];
  if (!table) return null;


  return table.find(function (r) {
    return width >= r.min && width <= r.max;
  }) || null;
}

function updateFrameColorRestriction() {

  const doorModel = getState("DOOR_MODEL");
  const glassShape = (getState("GLASS_SHAPE") || "").toLowerCase();

  const isSlimA =
    doorModel === "A" &&
    glassShape.includes("slim");

  // Show / hide available frame colors
  $("#AvailableFrameColorsSection .color-button-container").each(function () {

    const value = $(this).find("input").val();

    if (isSlimA) {

      // Only Black + Silver
      $(this).toggle(
        value === "K" ||
        value === "S"
      );

    } else {

      // Hide Silver
      $(this).toggle(value !== "S");
    }
  });

  // ==================================================
  // OPTIONAL FRAME COLORS
  // ==================================================

  const doorColor = getNode("COLOR")?.value?.value;
  const isWoodTone =
    doorColor === "X" ||
    doorColor === "Y";

  if (isSlimA) {

    // Existing slim behavior
    $("#OptionalFrameColorsSection .color-button-container").hide();

  } else {

    $("#OptionalFrameColorsSection .color-button-container").each(function () {

      const value = $(this)
        .find("input[type='radio']")
        .val();

      // X and Y only visible for woodtone doors
      if (
        value === "X" ||
        value === "Y"
      ) {

        $(this).toggle(isWoodTone);

      } else {

        $(this).show();

      }
    });
  }

  $("#optionalStackFrameColors")
    .closest(".stack-wrapper")
    .toggle(!isSlimA);

  $("#OptionalFrameColorsSection .divider")
    .toggle(!isSlimA);

  const frameColor = getState("FRAME_COLOR");

  // Slim mode default = Black
  if (
    isSlimA &&
    !frameColorUserOverride &&
    frameColor?.value !== "K"
  ) {

    const blackColor =
      [...AvailableColorImages, SilverColor]
        .find(c => c.value === "K");

    if (blackColor) {

      if (frameColor?.value !== "K") {
        setState("FRAME_COLOR", blackColor);
      }

      $("input[name='FRAME_COLOR']")
        .prop("checked", false)
        .closest(".color-button-container")
        .removeClass("selected");

      $("input[name='FRAME_COLOR'][value='K']")
        .prop("checked", true)
        .closest(".color-button-container")
        .addClass("selected");
    }
  }

  // Leaving slim with Silver selected
  if (
    !isSlimA &&
    frameColor?.value === "S"
  ) {

    frameColorUserOverride = false;

    const blackColor =
      [...AvailableColorImages, SilverColor]
        .find(c => c.value === "K");

    if (blackColor) {

      setState("FRAME_COLOR", blackColor);

      $("input[name='FRAME_COLOR']")
        .prop("checked", false)
        .closest(".color-button-container")
        .removeClass("selected");

      $("input[name='FRAME_COLOR'][value='K']")
        .prop("checked", true)
        .closest(".color-button-container")
        .addClass("selected");
    }
  }
}

function syncFrameColorUI(value) {

  if (!value) {
    return;
  }

  $("input[name='FRAME_COLOR']")
    .prop("checked", false)
    .closest(".color-button-container")
    .removeClass("selected");

  const $match = $(
    `input[name='FRAME_COLOR'][value='${value}']`
  );

  if ($match.length) {

    $match.prop("checked", true);

    $match
      .closest(".color-button-container")
      .addClass("selected");
  }
}

