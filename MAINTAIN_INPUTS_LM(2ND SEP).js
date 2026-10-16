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

        const selected = $(`input[name="${name}"]:checked`);

        let value = null;
        let desc = "";
        let text = "";

        if (selected.length) {

          value = selected.val();
          desc = selected.attr("desc") || "";

          if (name === "GLASS_TYPE") {

            const glazingType =
              selected.attr("glazingType") ||
              "";

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
            name === "INSERT_COLOR"
          ) {

            text =
              selected.attr("colorName") ||
              selected.attr("colorname") ||
              selected.val() ||
              "";

            json.push({
              id: name,
              value: value,
              desc: desc,
              text: text,
            });

          } else {

            const selectedId = selected.attr("id");

            text = $(`label[for="${selectedId}"]`)
              .text()
              .trim();

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

  const inputJson = JSON.stringify(json);
  console.log("json on save", inputJson);

  // console.log("INPUT_JSON Length:", inputJson.length);

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

  // console.log("saveInputValues completed");

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

  // console.log("saveOutputValues", json)

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

//   inputFields.forEach(field => {

//     if ($(`#${field}`).length) {
//       inputJson += $(`#${field}`).val() || "";
//     }

//     console.log("inputJson", inputJson);
//   });

//   if (inputJson === "")
//     return;

//   // console.log(
//   //   "loadInputValues Length:",
//   //   inputJson.length
//   // );

//   const arr = JSON.parse(inputJson);

//   arr.forEach(e => {

//     if (!e)
//       return;

//     const element = $("#" + e.id);

//     if (nodeset[e.id] && nodeset[e.id].type === "RADIO_PARENT") {

//       $(`input[name="${e.id}"]`)
//         .removeAttr("checked")
//         .prop("checked", false);

//       $(`input[name="${e.id}"][value="${e.value}"]`)
//         .attr("checked", "")
//         .prop("checked", true);

//     }
//     else if (element.attr("type") === "radio") {

//       e.value
//         ? element.attr("checked", "")
//         : element.removeAttr("checked");

//     }

//   });

//   if (nodeset) {

//     Object.values(nodeset)
//       .forEach(e =>
//         e.type === "RADIO_PARENT" &&
//         e.logic()
//       );

//   }

//   $("input[type='radio'][checked]").trigger("change");

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

  inputFields.forEach(field => {

    if ($(`#${field}`).length) {
      inputJson += $(`#${field}`).val() || "";
    }

    console.log("inputJson", inputJson);

  });

  if (inputJson === "")
    return;

  const arr = JSON.parse(inputJson);

  console.log(
    arr.filter(x =>
      [
        "GLASS_SHAPE",
        "GLASS_TYPE",
        "GLASS_INSERT",
        "WINDOW_POSITION"
      ].includes(x.id)
    )
  );

  arr.forEach(e => {

    if (!e)
      return;

    if (e.id === "PRODUCT_TYPE") {

      savedProductType = {
        value: e.value,
        text: e.text || ""
      };

      return;
    }

    // RADIO PARENTS
    if (
      nodeset[e.id] &&
      nodeset[e.id].type === "RADIO_PARENT"
    ) {

      // Remove current checked radio
      $(`input[name="${e.id}"]`)
        .prop("checked", false)
        .removeAttr("checked");

      // Remove current UI styling
      $(`input[name="${e.id}"]`)
        .closest(".rw-button")
        .removeClass("btn-checked selected");

      $(`input[name="${e.id}"]`)
        .closest(".rw-sliding-button")
        .removeClass("selected");

      // Apply saved value
      const $selected =
        $(`input[name="${e.id}"][value="${e.value}"]`);

      $selected
        .prop("checked", true)
        .attr("checked", "checked");

      // Restore UI styling
      $selected
        .closest(".rw-button")
        .addClass("btn-checked selected");

      $selected
        .closest(".rw-sliding-button")
        .addClass("selected");

      //if (nodeset[e.id]) {
      nodeset[e.id].value = e.value;
      // }


      console.log(
        "RESTORING",
        e.id,
        e.value,
        nodeset[e.id]
      );

      return;
    }

    const element = $("#" + e.id);

    if (!element.length)
      return;

    // Regular radio
    if (element.attr("type") === "radio") {

      e.value
        ? element
          .prop("checked", true)
          .attr("checked", "")
        : element
          .prop("checked", false)
          .removeAttr("checked");

    } else {

      element.val(e.value);

      if (nodeset[e.id])
        nodeset[e.id].value = e.value;
    }

  });




  if (nodeset) {

    Object.values(nodeset)
      .forEach(e =>
        e.type === "RADIO_PARENT" &&
        e.logic()
      );

  }

  $("input[type='radio']:checked")
    .trigger("change");

  console.log("NODE SHAPE", nodeset["GLASS_SHAPE"]);
  console.log("STATE SHAPE", getState("GLASS_SHAPE"));

  console.log("NODE TYPE", nodeset["GLASS_TYPE"]);
  console.log("STATE TYPE", getState("GLASS_TYPE"));

  console.log("NODE POSITION", nodeset["WINDOW_POSITION"]);
  console.log("STATE POSITION", getState("WINDOW_POSITION"));


  return true;
}



function hasBeenEdited() {
  return $("#INPUT_JSON").val() !== ''
}

function editButtonAddEvents(configuratorID = "configurator") {
  $("button[name='nextPageBtn']").attr("onclick", `nextPage();editButtonSaveInputs("${configuratorID}");`)
}




function hasBeenEdited() {
  return $("#INPUT_JSON").val() !== ''
}
function editButtonAddEvents(configuratorID = "configurator") {
  $("button[name='nextPageBtn']").attr("onclick", `nextPage();editButtonSaveInputs("${configuratorID}");`)
}
