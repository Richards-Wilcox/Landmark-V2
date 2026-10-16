/**
  This file maintains the inputs of a single page configurator after navigating away. It saves the inputs as
  json to a text input (or multiple if necessary) and provides functions to load those inputs into the 
  single page configurator. 
	
  Author: Charmi Surati

**/

let savedProductType = null;

function saveInputValues(configuratorID = "configurator") {

  const json = [];
  const processedRadioGroups = {};

  $(`#${configuratorID} input:not(.navigation-button), #${configuratorID} select`)
    .each((index, input) => {

      if (input.getAttribute("ignore") === "true")
        return;

      const type = input.getAttribute("type");

      /*
      * RADIO GROUPS
      */
      if (type === "radio") {

        const name = input.getAttribute("name");

        if (!name || processedRadioGroups[name]) {
          return;
        }

        let value = null;
        let desc = "";
        let text = "";

        // --- STEP 1: FIXED VISUAL MATCH EXTRACTION PASCH ---
        // If the framework contains duplicate checked properties across hidden template section containers,
        // we isolate our lookups straight to the active visually highlighted element on the UI screen wrapper.

        const $activeVisualContainer = $(`input[name="${name}"]`)
          .closest(".rw-button.selected, .rw-sliding-button.selected, .color-button-container.selected");

        if ($activeVisualContainer.length) {
          const $activeInput = $activeVisualContainer.find(`input[name="${name}"]`);
          if ($activeInput.length) {
            value = $activeInput.val();
            desc = $activeInput.attr("desc") || "";
            text = $activeInput.attr("colorName") || $activeInput.attr("colorname") || "";
          }
        }

        // Fallback to memory states if no active visual highlight class is painted on screen elements
        if (value === null && typeof nodeset !== "undefined" && nodeset && nodeset[name]) {
          const graphState = getState(name);
          if (graphState && typeof graphState === "object") {
            value = graphState.value || null;
            desc = graphState.desc || "";
            text = graphState.colorName || graphState.text || "";
          } else {
            value = graphState || null;
          }
        }

        // Standard DOM choice fallback if memory arrays are still uninitialized
        if (value === null) {
          const selected = $(`input[name="${name}"]:checked`);
          if (selected.length) {
            value = selected.val();
            desc = selected.attr("desc") || "";
          }
        }

        if (value !== null) {

          if (name === "GLASS_TYPE") {
            const $selectedRadio = $(`input[name="${name}"][value="${value}"]`);
            const glazingType = $selectedRadio.length ? ($selectedRadio.attr("glazingType") || "") : "";

            json.push({
              id: "GLAZING_TYPE",
              value: glazingType,
              desc: glazingType,
              text: glazingType
            });
          }

          if (
            name === "COLOR" ||
            name === "FRAME_COLOR" ||
            name === "INSERT_COLOR" ||
            name === "JAMB_SEAL_COLOR"
          ) {

            if (!text) {
              const $colorRadio = $(`input[name="${name}"][value="${value}"]`);
              text = $colorRadio.length ? ($colorRadio.attr("colorName") || $colorRadio.attr("colorname") || value) : value;
            }

            json.push({
              id: name,
              value: value,
              desc: desc,
              text: text,
            });

          } else {
            if (!text) {
              const $radioOption = $(`input[name="${name}"][value="${value}"]`);
              const selectedId = $radioOption.length ? $radioOption.attr("id") : "";
              text = selectedId ? ($(`label[for="${selectedId}"]`).text().trim()) : value;
            }

            json.push({
              id: name,
              value: value,
              desc: desc,
              text: text
            });
          }

        } else {
          json.push({
            id: name,
            value: null,
            desc: "",
            text: ""
          });
        }

        processedRadioGroups[name] = true;
        return;
      }

      /*
       * CHECKBOXES
       */
      if (type === "checkbox") {

        const labelText =
          $(`label[for="${input.id}"]`)
            .text()
            .trim();

        json.push({
          id: input.id,
          value: input.checked,
          desc: "",
          text: labelText
        });

        return;
      }

      /*
       * SELECTS
       */
      if (input.tagName === "SELECT") {

        const selectedOption =
          $(`#${input.id} option:selected`);

        json.push({
          id: input.id,
          value: input.value,
          desc: selectedOption.text().trim(),
          text: selectedOption.text().trim()
        });

        return;
      }

      /*
       * ALL OTHER INPUT TYPES
       * text, hidden, range, number, etc.
       */
      const labelText =
        $(`label[for="${input.id}"]`)
          .text()
          .trim();

      json.push({
        id: input.id,
        value: input.value,
        desc: "",
        text: labelText
      });

    });

  json.push({
    id: "WEIGHT",
    value: getState("WEIGHT"),
    desc: getState("WEIGHT"),
    text: getState("WEIGHT")
  });

  additionalSaves(json);
  saveOutputValues();

  console.log(
    "FINAL GLZ04 BEFORE SAVE",
    getState("GLZ_CODE_SECTION_04")
  );

  const inputJson = JSON.stringify(json);
  console.log("json on save", inputJson);

  const inputFields = [
    "INPUT_JSON_1",
    "INPUT_JSON_2",
    "INPUT_JSON_3",
    "INPUT_JSON_4"
  ];

  // Clear all chunks first
  inputFields.forEach(field => {
    if ($(`#${field}`).length)
      $(`#${field}`).val("");

    if (nodeset[field])
      nodeset[field].value = "";
  });

  // Save chunks
  inputFields.forEach((field, index) => {
    const chunk = inputJson.substring(
      index * 4000,
      (index + 1) * 4000
    );

    if (!chunk)
      return;

    if ($(`#${field}`).length)
      $(`#${field}`).val(chunk);

    if (nodeset[field])
      nodeset[field].value = chunk;
  });

  return true;
}


function additionalSaves(json) {
  // console.log("additionalSaves", json);
}



function saveOutputValues() {
  const obj = {}
  $("#displayMainInputGroups > div > div[id!=configurator] select:not(.disabled), #displayMainInputGroups > div > div[id!=configurator] input[type='text']:not(.disabled)").each((i, e) => {
    if (
      e.getAttribute('id') === "INPUT_JSON" ||
      e.getAttribute('id') === "OUTPUT_JSON"
    ) {
      return;
    }

    obj[e.getAttribute('id')] = e.value;
  })
  const json = JSON.stringify(obj)
  let suffix = ""
  for (let i = 0; i < json.length / 4000; i++) {
    $(`#OUTPUT_JSON${suffix}`).val(json.substring(i * 4000, (i + 1) * 4000))
    suffix = suffix + "_1"
  }
}

function loadOutputValues() {
  if ($("#OUTPUT_JSON").val() === '')
    return;
  let outputjson = $("#OUTPUT_JSON").val();
  let suffix = "_1"
  while (!!$(`#OUTPUT_JSON${suffix}`).val() && $(`#OUTPUT_JSON${suffix}`).val().length > 0) {
    outputjson += $(`#OUTPUT_JSON${suffix}`).val()
    suffix = suffix + "_1"
  }
  const outputValues = JSON.parse(outputjson)
  Object.keys(outputValues).forEach(key => {
    $("#" + key).val(outputValues[key])
  })
}

// function loadInputValues() {

//   const inputFields = [
//     "INPUT_JSON",
//     "INPUT_JSON_1",
//     "INPUT_JSON_2",
//     "INPUT_JSON_3",
//     "INPUT_JSON_4"
//   ];

//   let inputJson = "";

//   // Compile split string data chunks cleanly from your payload hidden fields
//   inputFields.forEach(field => {
//     if ($(`#${field}`).length) {
//       inputJson += $(`#${field}`).val() || "";
//     }
//   });

//   if (inputJson === "")
//     return false;

//   console.log("inputJson on deep load pass", inputJson);
//   const arr = JSON.parse(inputJson);
//   if (!Array.isArray(arr)) return false;

//   if (typeof walkcache !== "undefined") {
//     walkcache.length = 0;
//   }

//   // --- STEP 1: RUNTIME HIJACK DESTRUCTIVE GRAPH VALIDATION RESET HOOKS ---
//   // Since we cannot edit react_wilcox.js, we runtime-intercept the global validate function.
//   // This completely stops hidden tab rules from wiping out your glazing variables on load.
//   const nativeValidate = typeof window.validate === "function" ? window.validate : null;
//   window.validate = function (id) {
//     console.log("Shielding variable node from automated lifecycle erasure:", id);
//     return false; // Safely swallows and skips validation dropouts during loading passes
//   };

//   // Force system user color overrides open to protect loaded parameters from auto-resetting
//   frameColorUserOverride = true;
//   insertColorUserOverride = true;
//   jambSealColorUserOverride = true;

//   // --- STEP 2: SILENT SYNCHRONOUS VALUE ASSIGNMENT & MARkUP FIXES ---
//   arr.forEach(e => {
//     if (!e || e.value === null || e.value === undefined) return;

//     if (e.id === "PRODUCT_TYPE") {
//       savedProductType = { value: e.value, text: e.text || "" };
//       return;
//     }

//     const groupName = e.id;
//     const $groupRadios = $(`input[name="${groupName}"]`);

//     // Handle multi-element radio configurations manually
//     if (typeof nodeset !== "undefined" && nodeset && nodeset[groupName] && nodeset[groupName].type === "RADIO_PARENT") {
//       // Clear checked status and visual selection classes across the entire input group name space
//       $groupRadios.prop("checked", false).removeAttr("checked").data("checked", false);
//       $groupRadios.closest(".rw-button, .rw-sliding-button, .color-button-container").removeClass("btn-checked selected");

//       // Apply your correct JSON selection value directly to both runtime property and DOM string attribute
//       const $selected = $(`input[name="${groupName}"][value="${e.value}"]`);
//       if ($selected.length) {
//         $selected.prop("checked", true).attr("checked", "checked").data("checked", true);
//         $selected.closest(".rw-button").addClass("btn-checked selected");
//         $selected.closest(".rw-sliding-button").addClass("selected");
//         $selected.closest(".color-button-container").addClass("selected");
//       }

//       nodeset[groupName].value = e.value;

//       // Formats complex color parameters directly into memory to completely satisfy getDoorInfo() rules
//       if (groupName === "COLOR" || groupName === "FRAME_COLOR" || groupName === "INSERT_COLOR" || groupName === "JAMB_SEAL_COLOR") {
//         const colorLookup = [...AvailableColorImages, ...OptionalColorImages, SilverColor].find(c => c.value === e.value);
//         if (colorLookup) {
//           nodeset[groupName].value = {
//             value: colorLookup.value,
//             hex: colorLookup.hex,
//             desc: colorLookup.desc || "",
//             colorName: colorLookup.colorName
//           };
//         }
//       }
//       return;
//     }

//     const element = $("#" + e.id);
//     if (!element.length) return;

//     if (element.attr("type") === "radio") {
//       if (e.value) {
//         element.prop("checked", true).attr("checked", "").data("checked", true).closest(".rw-button, .color-button-container").addClass("btn-checked selected");
//       } else {
//         element.prop("checked", false).removeAttr("checked").data("checked", false).closest(".rw-button, .color-button-container").removeClass("btn-checked selected");
//       }
//     } else {
//       if (element.attr("type") === "checkbox") {
//         element.prop("checked", e.value === true || e.value === "true");
//       } else {
//         element.val(e.value);
//       }
//       if (typeof nodeset !== "undefined" && nodeset && nodeset[e.id]) {
//         nodeset[e.id].value = e.value;
//       }
//     }
//   });

//   // Expand panel slider containers manually matching your saved configurations
//   const customDim = arr.find(x => x && x.id === "customSwitch");
//   if (customDim && (customDim.value === true || customDim.value === "true" || customDim.value === "on")) {
//     $("#customSwitch").prop("checked", true);
//     $(".custom-dimension-container").show();
//     $("#DIMENSION").hide();
//   }

//   const customPanel = arr.find(x => x && x.id === "customPanelSwitch");
//   if (customPanel && (customPanel.value === true || customPanel.value === "true" || customPanel.value === "on")) {
//     $("#customPanelSwitch").prop("checked", true);
//     $(".custom-panel-item-container").show();
//   }

//   // --- STEP 3: DEFERRED LIFE-CYCLE RENDERING DECOUPLING PASS ---
//   // Using a minor 100ms delay yields thread execution control to let dynamic carousels 
//   // and appendAvailableColorsTo() tasks completely finish loading on the page first.
//   setTimeout(function () {
//     console.log("Enforcing final stable UI validation passes...");

//     const coreTargets = ["GLASS_SHAPE", "GLASS_TYPE", "GLASS_INSERT", "WINDOW_POSITION", "FACE", "COLOR", "FRAME_COLOR", "INSERT_COLOR"];
//     coreTargets.forEach(id => {
//       const matchObj = arr.find(x => x && x.id === id);
//       if (matchObj && matchObj.value !== null && matchObj.value !== undefined) {

//         if (id === "COLOR" || id === "FRAME_COLOR" || id === "INSERT_COLOR") {
//           const colorLookup = [...AvailableColorImages, ...OptionalColorImages, SilverColor].find(c => c.value === matchObj.value);
//           if (colorLookup && typeof nodeset !== "undefined" && nodeset && nodeset[id]) {
//             nodeset[id].value = {
//               value: colorLookup.value,
//               hex: colorLookup.hex,
//               desc: colorLookup.desc || "",
//               colorName: colorLookup.colorName
//             };
//           }
//         } else {
//           if (typeof nodeset !== "undefined" && nodeset && nodeset[id]) {
//             nodeset[id].value = matchObj.value;
//           }
//         }

//         const $groupRadios = $(`input[name="${id}"]`);
//         if ($groupRadios.length > 0) {
//           $groupRadios.prop("checked", false).removeAttr("checked").data("checked", false);
//           $groupRadios.closest(".rw-button, .rw-sliding-button, .color-button-container").removeClass("btn-checked selected");

//           const $finalRadio = $(`input[name='${id}'][value='${matchObj.value}']`);
//           if ($finalRadio.length) {
//             $finalRadio.prop("checked", true).attr("checked", "checked").data("checked", true);
//             $finalRadio.closest(".rw-button").addClass("btn-checked selected");
//             $finalRadio.closest(".rw-sliding-button").addClass("selected");
//             $finalRadio.closest(".color-button-container").addClass("selected");
//           }
//         }
//       }
//     });

//     if (typeof nodeset !== "undefined" && nodeset) {
//       Object.values(nodeset).forEach(node => {
//         if (node && node.type === "RADIO_PARENT" && typeof node.logic === "function") {
//           node.logic();
//         }
//       });
//     }

//     if (typeof recalcWindowState === "function") {
//       recalcWindowState();
//     }

//     // --- STEP 4: PRE-ALLOCATE WINDOW PLACEMENT MATRICES IN MEMORY ---
//     const savedShape = arr.find(x => x && x.id === "GLASS_SHAPE")?.value;
//     const savedPos = arr.find(x => x && x.id === "WINDOW_POSITION")?.value;
//     const stateObj = typeof getState === "function" ? getState("WINDOW_STATE") : null;

//     if (savedShape && savedShape !== "NONE" && savedPos === "top" && stateObj && stateObj.sections) {
//       stateObj.sections.forEach(section => {
//         if (section && section.enabled) {
//           section.shape = savedShape;
//           section.enabled = Array(section.positions ? section.positions.length : 4).fill(true);
//           section.glass_qty = section.enabled.length;
//         }
//       });

//       if (nodeset["WINDOW_STATE"]) {
//         nodeset["WINDOW_STATE"].value = stateObj;
//       }
//     }

//     // Reset the internal drawing checkpoint to force a total texture refresh cascade
//     if (typeof nodeset !== "undefined" && nodeset && nodeset["RENDER"]) {
//       nodeset["RENDER"]._renderKey = "";
//     }

//     // Isolate triggers strictly to active view page containers to save tab wrappers
//     const visibleSectionId = $(".rw-configurator__page:visible").attr("id");
//     if (visibleSectionId) {
//       $(`#${visibleSectionId} input[type='radio']:checked`).trigger("change");
//     } else {
//       $("section[index='0'] input[type='radio']:checked").trigger("change");
//     }

//     // Trigger canvas validations stably across double animation frames
//     requestAnimationFrame(function () {
//       requestAnimationFrame(function () {
//         if (typeof recalcWindowState === "function") recalcWindowState();
//         if (typeof forceRedraw === "function") forceRedraw();

//         if (typeof currentSection !== "undefined" && currentSection == 1) {
//           if (typeof addSlimUi === "function") addSlimUi();

//         }
//         if (nativeValidate) {
//           window.validate = nativeValidate;
//         }
//         console.log("Restoration Complete: All tabs, variables, and graphics locked visible.");
//       });
//     });
//   }, 100);
//   return true;
// }


function loadInputValues() {

  const inputFields = [
    "INPUT_JSON",
    "INPUT_JSON_1",
    "INPUT_JSON_2",
    "INPUT_JSON_3",
    "INPUT_JSON_4"
  ];

  let inputJson = "";

  // Compile split string chunks cleanly from your payload data hidden containers
  inputFields.forEach(field => {
    if ($(`#${field}`).length) {
      inputJson += $(`#${field}`).val() || "";
    }
  });

  if (inputJson === "")
    return false;

  console.log("inputJson on dynamic universal load pass", inputJson);
  const arr = JSON.parse(inputJson);
  if (!Array.isArray(arr)) return false;

  if (typeof walkcache !== "undefined") {
    walkcache.length = 0;
  }

  // Force explicit user override switches open on load to guard color boundaries from factory resets
  frameColorUserOverride = true;
  insertColorUserOverride = true;
  jambSealColorUserOverride = true;

  // --- STEP 1: UNIVERSAL SYNCHRONOUS DOM VALUE & STATE ASSIGNMENT ---
  arr.forEach(e => {
    if (!e || e.value === null || e.value === undefined) return;

    if (e.id === "PRODUCT_TYPE") {
      savedProductType = { value: e.value, text: e.text || "" };
      return;
    }

    if (e.id.startsWith("INPUT_JSON") || e.id.startsWith("OUTPUT_JSON")) {
      return;
    }

    const groupName = e.id;
    const $groupRadios = $(`input[name="${groupName}"]`);

    // Handle multi-element radio configurations manually by group name namespace domains safely
    if ($groupRadios.length > 0 || (typeof nodeset !== "undefined" && nodeset && nodeset[groupName] && nodeset[groupName].type === "RADIO_PARENT")) {

      // Clear checked status and visual selection classes across the entire input group name space upfront
      $groupRadios.prop("checked", false).removeAttr("checked");
      $groupRadios.closest(".rw-button, .rw-sliding-button, .color-button-container").removeClass("btn-checked selected");

      const $selected = $(`input[name="${groupName}"][value="${e.value}"]`);
      if ($selected.length) {
        $selected.prop("checked", true).attr("checked", "checked").data("checked", true);
        $selected.closest(".rw-button").addClass("btn-checked selected");
        $selected.closest(".rw-sliding-button").addClass("selected");
        $selected.closest(".color-button-container").addClass("selected");

        // Extract the specific active checked radio's individual input element ID attribute string
        const targetElementId = $selected.attr("id");

        if (targetElementId && typeof nodeset !== "undefined" && nodeset) {
          // Force populate the exact individual checkbox element ID memory registry key first
          if (!nodeset[targetElementId]) {
            nodeset[targetElementId] = { id: targetElementId, value: e.value, type: "RADIO" };
          } else {
            nodeset[targetElementId].value = e.value;
          }

          // Cross-map complex color object definitions into memory registry pointers cleanly
          if (groupName === "COLOR" || groupName === "FRAME_COLOR" || groupName === "INSERT_COLOR" || groupName === "JAMB_SEAL_COLOR") {
            const colorLookup = [...AvailableColorImages, ...OptionalColorImages, SilverColor].find(c => c.value === e.value);
            if (colorLookup) {
              const compiledColorObject = {
                value: colorLookup.value,
                hex: colorLookup.hex,
                desc: colorLookup.desc || "",
                colorName: colorLookup.colorName
              };
              nodeset[groupName].value = compiledColorObject;
              nodeset[targetElementId].value = compiledColorObject;
            }
          }
          // COMPOUND DATA CONTRACT ALIGNMENT: Force seed the compound object expected by GLASS_INSERT 
          // onto both the child element id node and the parent group name node space simultaneously
          else if (groupName === "GLASS_INSERT") {
            const compiledInsertObject = {
              value: e.value,
              insertCode: $selected.attr("insertCode") || $selected.attr("insertcode") || "550-313"
            };
            nodeset[groupName].value = compiledInsertObject;
            nodeset[targetElementId].value = compiledInsertObject;
          }
          else {
            nodeset[groupName].value = e.value;
          }
        }
      }
      return;
    }

    const element = $("#" + e.id);
    if (!element.length) return;

    if (element.attr("type") === "radio") {
      if (e.value) {
        element.prop("checked", true).attr("checked", "").data("checked", true).closest(".rw-button, .color-button-container").addClass("btn-checked selected");
        if (typeof nodeset !== "undefined" && nodeset && nodeset[e.id]) nodeset[e.id].value = e.value;
      } else {
        element.prop("checked", false).removeAttr("checked").data("checked", false).closest(".rw-button, .color-button-container").removeClass("btn-checked selected");
      }
    } else {
      // DYNAMIC UNIVERESAL CHECKBOX INTERCEPTOR:
      // Works for every single slider, switch, or toggle on your form completely dynamically
      if (element.attr("type") === "checkbox") {
        const isChecked = (e.value === true || e.value === "true" || e.value === "on");
        element.prop("checked", isChecked);

        if (isChecked) {
          element.attr("checked", "checked").val("on");
          if (typeof nodeset !== "undefined" && nodeset && nodeset[e.id]) {
            nodeset[e.id].value = "on";
          }
        } else {
          element.removeAttr("checked").val("off");
          if (typeof nodeset !== "undefined" && nodeset && nodeset[e.id]) {
            nodeset[e.id].value = "off";
          }
        }
      } else {
        element.val(e.value);
        if (typeof nodeset !== "undefined" && nodeset && nodeset[e.id]) {
          nodeset[e.id].value = e.value;
        }
      }
    }
  });

  // Expand panel wrapper containers if their switches are checked natively
  if ($("#customSwitch").is(":checked")) {
    $(".custom-dimension-container").show();
    $("#DIMENSION").hide();
  }
  if ($("#customPanelSwitch").is(":checked")) {
    $(".custom-panel-item-container").show();
  }
  if ($("#more_glass_types").is(":checked")) {
    $("#more_glass_types_container").show();
  }
  if ($("#more_glass_inserts").is(":checked")) {
    $("#more_glass_inserts_container").show();
  }

  // --- STEP 2: DEFERRED LIFE-CYCLE RENDERING RE-ENFORCEMENT PASS ---
  setTimeout(function () {
    console.log("Enforcing final stable universal UI validation pass across all inputs...");

    arr.forEach(matchObj => {
      if (!matchObj || !matchObj.id || matchObj.value === null || matchObj.value === undefined) return;
      if (matchObj.id.startsWith("INPUT_JSON") || matchObj.id.startsWith("OUTPUT_JSON")) return;

      const id = matchObj.id;
      const $radioInput = $(`input[name='${id}'][value='${matchObj.value}']`);

      if ($radioInput.length > 0) {
        const targetElementId = $radioInput.attr("id");

        if (id === "COLOR" || id === "FRAME_COLOR" || id === "INSERT_COLOR" || id === "JAMB_SEAL_COLOR") {
          const colorLookup = [...AvailableColorImages, ...OptionalColorImages, SilverColor].find(c => c.value === matchObj.value);
          if (colorLookup && typeof nodeset !== "undefined" && nodeset && nodeset[id]) {
            const compiledColorObject = {
              value: colorLookup.value,
              hex: colorLookup.hex,
              desc: colorLookup.desc || "",
              colorName: colorLookup.colorName
            };
            nodeset[id].value = compiledColorObject;
            if (targetElementId && nodeset[targetElementId]) nodeset[targetElementId].value = compiledColorObject;
          }
        }
        else if (id === "GLASS_INSERT") {
          if (typeof nodeset !== "undefined" && nodeset && nodeset[id]) {
            const compiledInsertObject = {
              value: matchObj.value,
              insertCode: $radioInput.attr("insertCode") || $radioInput.attr("insertcode") || "550-313"
            };
            nodeset[id].value = compiledInsertObject;
            if (targetElementId && nodeset[targetElementId]) nodeset[targetElementId].value = compiledInsertObject;
          }
        }
        else {
          if (typeof nodeset !== "undefined" && nodeset && nodeset[id]) {
            nodeset[id].value = matchObj.value;
            if (targetElementId && nodeset[targetElementId]) nodeset[targetElementId].value = matchObj.value;
          }
        }

        $(`input[name="${id}"]`).prop("checked", false).removeAttr("checked").data("checked", false);
        $(`input[name="${id}"]`).closest(".rw-button, .rw-sliding-button, .color-button-container").removeClass("btn-checked selected");

        $radioInput.prop("checked", true).attr("checked", "checked").data("checked", true);
        $radioInput.closest(".rw-button").addClass("btn-checked selected");
        $radioInput.closest(".rw-sliding-button").addClass("selected");
        $radioInput.closest(".color-button-container").addClass("selected");
      } else {
        const $chkElement = $("#" + id);
        if ($chkElement.length && $chkElement.attr("type") === "checkbox") {
          const isChecked = (matchObj.value === true || matchObj.value === "true" || matchObj.value === "on");
          $chkElement.prop("checked", isChecked).val(isChecked ? "on" : "off");
          if (nodeset[id]) nodeset[id].value = isChecked ? "on" : "off";
        }
      }
    });

    if (typeof nodeset !== "undefined" && nodeset) {
      Object.values(nodeset).forEach(node => {
        if (node && node.type === "RADIO_PARENT" && typeof node.logic === "function") {
          node.logic();
        }
      });
    }

    if (typeof recalcWindowState === "function") {
      recalcWindowState();
    }

    // --- STEP 3: PRE-ALLOCATE WINDOW PLACEMENT MATRICES IN MEMORY ---
    const savedShape = arr.find(x => x && x.id === "GLASS_SHAPE")?.value;
    const savedPos = arr.find(x => x && x.id === "WINDOW_POSITION")?.value;
    const stateObj = typeof getState === "function" ? getState("WINDOW_STATE") : null;

    if (savedShape && savedShape !== "NONE" && savedPos === "top" && stateObj && stateObj.sections) {
      stateObj.sections.forEach(section => {
        if (section && section.enabled) {
          section.shape = savedShape;
          section.enabled = Array(section.positions ? section.positions.length : 4).fill(true);
          section.glass_qty = section.enabled.length;
        }
      });

      if (nodeset["WINDOW_STATE"]) {
        nodeset["WINDOW_STATE"].value = stateObj;
      }
    }

    // --- STEP 4: MASTER EVENT CASCADE DISPATCH PASS ---
    arr.forEach(matchObj => {
      if (!matchObj || !matchObj.id) return;
      if (matchObj.id.startsWith("INPUT_JSON") || matchObj.id.startsWith("OUTPUT_JSON")) return;

      const $el = $("#" + matchObj.id);
      if ($el.length && $el.attr("type") === "checkbox" && $el.is(":checked")) {
        $el.trigger("change");
      }
    });

    // Reset the internal drawing checkpoint to force a total texture refresh pass natively
    if (typeof nodeset !== "undefined" && nodeset && nodeset["RENDER"]) {
      nodeset["RENDER"]._renderKey = "";
    }

    // Force your custom jQuery .data('checked') properties active on checked radios post-load cleanly
    $("input[type='radio']:checked").each(function () {
      $(this).data("checked", true);
      $(this).closest(".rw-button").addClass("btn-checked selected");
      $(this).closest(".rw-sliding-button").addClass("selected");
      $(this).closest(".color-button-container").addClass("selected");
    });

    // Isolate triggers strictly to active view page nodes to protect your top tab containers
    const visibleSectionId = $(".rw-configurator__page:visible").attr("id");
    if (visibleSectionId) {
      $(`#${visibleSectionId} input[type='radio']:checked`).trigger("change");
    } else {
      $("section[index='0'] input[type='radio']:checked").trigger("change");
    }

    // Trigger canvas validations stably across double animation frames
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (typeof recalcWindowState === "function") recalcWindowState();
        if (typeof forceRedraw === "function") forceRedraw();

        if (typeof currentSection !== "undefined" && currentSection == 1) {
          if (typeof addSlimUi === "function") addSlimUi();
        }
        console.log("Restoration Pass Completed Universally.");
      });
    });

  }, 150);

  return true;

}


function hasBeenEdited() {
  return $("#INPUT_JSON").val() !== '';
}

function editButtonAddEvents(configuratorID = "configurator") {
  $("button[name='nextPageBtn']").attr("onclick", `nextPage();editButtonSaveInputs("${configuratorID}");`)
}