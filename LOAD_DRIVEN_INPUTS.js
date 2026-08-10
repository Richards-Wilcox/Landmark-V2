const LITE_RESULT_CACHE = {};

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

  // addNode({
  //   id: "FRAME_COLOR",
  //   value: null,
  //   logic: function () {
  //     // Only fall back to door color if user hasn't made an explicit pick
  //     if (!frameColorUserOverride) {
  //       const doorColor = getNode("COLOR")?.value;
  //       if (doorColor?.value) {
  //         const match = [...AvailableColorImages, ...OptionalColorImages]
  //           .find(c => c.value === doorColor.value);
  //         this.value = match ?? null;
  //       }
  //     }
  //   }
  // }, ["COLOR"]);

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
    let SelectedInclinedTrack = getState("INCLINEDTRACK");
    $(".lift-option").hide();


    // Hide entire Lift Type section when hardware set is not selected
    if (!selectedHardware) {
      $("#liftTypeSection").hide();
      return;
    } else {
      $("#liftTypeSection").show();
    }


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

  }, ["HARDWARE_SET", "SPRING_TYPE", "INCLINEDTRACK"])

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

    else {
      const result = resolveLiteResult({
        width: getState("WIDTH"),
        panel_style: getState("FACE"),
        glass_shape: getState("GLASS_SHAPE") || "",
        spacing: getState("PANEL_SPACING") || ""
      });
      this.value = result ? (result.center_hinge_code || "") : "";
    }

  }, ["WIDTH", "FACE", "PANEL_SPACING", "GLASS_SHAPE"]);


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
      if (face === 'M') {
        $("#GLASS_SHAPE_LAYOUT").hide();


        $("#more_glass_types")
          .prop("checked", false)
          .trigger("change");

        $("#more_glass_types_container").hide();

        return;
      } else $("#GLASS_SHAPE_LAYOUT").show();

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
      // const $checked = $("input[name='GLASS_SHAPE']:checked");
      // if ($checked.length && !$checked.closest(".rw-button").is(":visible")) {
      //   clearRadio("GLASS_SHAPE");
      //   clearRadio("GLASS_TYPE");
      // }

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
      if (!glass_shape) {
        clearRadio("GLASS_TYPE");
        return;
      }

      if (face === "M") {

        $("#more_glass_types")
          .prop("checked", false)
          .trigger("change");

        $("#more_glass_types_container").hide();

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
            { value: "A", text: "CRC (MP-1)" }
          ]
        },
        {
          min: 120,
          max: 143,
          options: [
            { value: "B", text: "RCR (MP-2)" }
          ]
        },
        {
          min: 144,
          max: 167,
          options: [
            { value: "C", text: "CRRC (MP-3)" },
            { value: "D", text: "RCCR (MP-4)" },
            { value: "E", text: "CCRCC (MP-5)" }
          ]
        },
        {
          min: 168,
          max: 191,
          options: [
            { value: "J", text: "CRCRC (MP-10)" },
            { value: "K", text: "RCCCR (MP-11)" }
          ]
        },
        {
          min: 192,
          max: 211,
          options: [
            { value: "F", text: "CRRRC (MP-6)" },
            { value: "G", text: "CRRCRC (MP-7)" },
            { value: "H", text: "RCRCR (MP-8)" },
            { value: "I", text: "CRRRCC (MP-9)" },
            { value: "N", text: "CCRRCCC (MP-14)" },
            { value: "O", text: "RCCCCR (MP-15)" }
          ]
        },
        {
          min: 212,
          max: 237,
          options: [
            { value: "L", text: "CRCCCRC (MP-12)" },
            { value: "M", text: "CCRCRCC (MP-13)" }
          ]
        },
        {
          min: 238,
          max: 255,
          options: [
            { value: "P", text: "RCCRCCR (MP-16)" },
            { value: "Q", text: "RCCCCCR (MP-17)" }
          ]
        },
        {
          min: 256,
          max: 278,
          options: [
            { value: "R", text: "CCCRCRCCC (MP-18)" },
            { value: "S", text: "CCRCCRCC (MP-19)" }
          ]
        },
        {
          min: 279,
          max: Infinity,
          options: [
            { value: "T", text: "RCCCCCCCCR (MP-20)" },
            { value: "U", text: "CCRCCCCRCC (MP-21)" }
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
            text: item.text
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
    ["DOOR_MODEL", "GLASS_SHAPE"]
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

  // Hide optional colors during slim
  if (isSlimA) {
    $("#OptionalFrameColorsSection .color-button-container").hide();
  } else {
    $("#OptionalFrameColorsSection .color-button-container").show();
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