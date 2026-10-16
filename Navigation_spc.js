/*
	This file controls the pagination on a Single Page Configurator. It adds the radio buttons to the top of
	the screen and functions to control the buttons on the left and right. It does not add the buttons.

	DEPENDENCIES:
	The html needs to be divided into <section> elements with "id" "index" "enabled" and "data-title" properties.
	The html needs to have a <div> element with the id NAVIGATION_SPC in order to place the HTML properly.
	Navigation buttons need to be built into the HTML.

	HOW TO USE:
	Call loadNavigationHTML
	Add formForward() and formBackward() to the onclick attribute of your navigation buttons.

	AUTHOR:
	Zachary Ringwood

	CHANGELOG:
	Changed out radio buttons for tabs 2025/03/12 ZR
	2025 / 09 / 16 Changed the way the section change works to support the sections being anywhere on the page ZR
	2025 / 10 / 27 Added the ignore attribute so react-wilcox does not create a node for each radio button.
	2025 / 12 / 04 Changed behaviour so that the IDs of the elements do not change.
	2025 / 12 / 11 Changed "title" attribute to "data-title"
	2026 / 02 / 23 Disabled sections are no longer added to #section_select DS
*/
function loadNavbarStyles() {
    const styles = `
.radio-layout{
	input[type=radio].navigation-button{
		 position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
label.navigation-tab{
color:black;
display: flex;
    align-items: center;
    gap: 8px;
}
	width:50%;
	border:1px solid black;
	border-radius:10px 10px 0px 0px;
	border-bottom:none;

	background:rgb(220,220,220);
}
.radio-layout--selected{
	background:RGBA(0,0,0,0);
}
`;
    const style = document.createElement("style");
    style.innerHTML = styles;
    document.body.appendChild(style);
}
function loadNavigationHTML() {
    const selectHTML = `
   <div
      id="section_select"
      class="rw-configurator__select"
    ></div>
  `;
    $("#NAVIGATION_SPC").append(selectHTML);
    resetNavigationRadioButtons();
    //Adding indicies to sections
    $("#configurator section").each((index, e) => {
        e.setAttribute("index", index);
    });

    $(`#section_select`).on("change", (evt) => {
        showSection(Number(evt.target.value));
    });
    showSection(0);
    loadNavbarStyles();
}
function resetNavigationRadioButtons() {
    const selectedSection = $("#section_select .radio-layout--selected").find("input").attr("index");
    $("#section_select").html("");
    let index = -1;
    //Setup Radio Buttons
    $("#configurator section").each((value, e) => {
        const radioID = `${e.getAttribute("id")}_radio`;
        if (e.getAttribute("enabled") !== "true")
			return;

		index += 1;
        $("#section_select").append(`
			  <div class="radio-layout"
				id="tab_${value}"
				index=${index}
				onclick="showSection(${value})">
				<input
				  type="radio"
				  id="${radioID}"
				  index="${index}"
				  class="navigation-button"
				name="section_select"
				  value="${value}"
				ignore
				  ${value === 0 && "checked"}
				/><label for="${value}"  class="navigation-tab">
 <i class="${e.getAttribute("data-icon") || ""}"></i>
				${e.getAttribute("data-title") ?? e.getAttribute("title")}</label>
		`);
    });

    if ($(`#tab_${selectedSection}`).is(":visible")) $(`#tab_${selectedSection}`).addClass("radio-layout--selected");
    else showSection($("#section_select").children(":visible").first().attr("index"));
}
let currentSection = 0;

function showSection(index) {
    $(`.rw-configurator__layout  section[index!="${index}"]`).hide();
    $(`.rw-configurator__layout  section[index="${index}"]`).show();
    $(`.rw-configurator__layout  section[index="${index}"]`).trigger("show");
    $(`.rw-configurator__layout  section[index="${index}"]`).attr("style", "");
    $(`input[name=section_select][value="${index}"]`).prop("checked", true);
    $(".radio-layout--selected").removeClass("radio-layout--selected");
    $(`#tab_${index}`).addClass("radio-layout--selected");
    currentSection = index;
}

function disableSection(id) {
    $(`#configurator section#${id}`).attr("enabled", "false");
    resetNavigationRadioButtons();
}
function enableSection(id) {
    $(`#configurator section#${id}`).attr("enabled", "true");
    resetNavigationRadioButtons();
}
function formForward() {
    const numSections = $(`#section_select input:visible`).length;
    const newSection = Math.abs((Number($(`#section_select input:visible:checked`).attr("index")) + 1) % numSections);
    showSection($(`#section_select input[index=${newSection}]`).val());
}
function formBackward() {
    const numSections = $(`#section_select input:visible`).length;
    const currentSection = $("#section_select input:checked").attr("index");
    const newSection = currentSection - 1 === -1 ? numSections - 1 : currentSection - 1;
    showSection($(`#section_select input[index=${newSection}]`).val());
}
