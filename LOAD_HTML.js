// const src_path = "/HTML/products/210005530/";
const src_path = "/HTML/products/162059085/";

const AvailableColorImages = [
    { url: "images/White_2.jpg", value: "W", colorName: "White", hex: "#fdf6ee", desc: "Wht" },
    { url: "images/Black_2.jpg", value: "K", colorName: "Black", hex: "#211f1e", desc: "Blk" },
    { url: "images/Iron Ore_2.jpg", value: "V", colorName: "Iron Ore", hex: "#313532", desc: "Ore" },
    { url: "images/Cafe_2.jpg", value: "F", colorName: "Cafe", hex: "#3b3831", desc: "Cafe" }
];

const OptionalColorImages = [
    { url: "images/Sandstone_2.jpg", value: "T", colorName: "Sandstone", hex: "#938b7d", desc: "Snd" },
    { url: "images/Brown_2.jpg", value: "B", colorName: "Brown", hex: "#453a2d", desc: "Brn" },
    { url: "images/Slate Grey_2.jpg", value: "C", colorName: "Slate Grey", hex: "#626260", desc: "SGr" },
    { url: "images/Bronze_2.jpg", value: "Z", colorName: "Bronze", hex: "#463a2e", desc: "Brz" },
    { url: "images/Desert Tan_2.jpg", value: "E", colorName: "Desert Tan", hex: "#bfb6a4", desc: "DTan" },
    { url: "images/Almond_2.jpg", value: "A", colorName: "Almond", hex: "#d1cbb3", desc: "Alm" },
    { url: "images/Honey Cedar.png", value: "X", colorName: "Honey Cedar", restricted: true, hex: "#914e27" },
    { url: "images/Cocoa Hickory.png", value: "Y", colorName: "Cocoa Hickory", restricted: true, hex: "#45261c" }
];

const SilverColor = {
    url: "images/support_silver.jpg",
    value: "S",
    colorName: "Silver",
    hex: "#d2d2d2",
    desc: "Silver"
};

const woodTones = ["X", "Y"];

//Global State
let toggle_Switch = 0;
let frameColorUserOverride = false;
let insertColorUserOverride = false;
let currentOperatorIndex = 1;
let operatorDataArray = [];



function loadForm() {

    calculatePrice();


    toggleAccordion();
    const form = createForm();
    //Here is where we append the HTML
    $('.concept-ui-form.scrollable').append(form)
    $('.concept-ui-form.scrollable').removeClass('concept-ui-form scrollable')

    loadUI();
    //All warnings default to hidden

    //loadWeightNodes()

    createNode("NEXT_PAGE_BTN_0", function () {
        if (!isFormValid())
            this.setAttribute("disabled", 'true')
        else
            this.removeAttribute("disabled")
    }, "container", $("button[name=nextPageBtn]")[0], ["SPRING_SOLUTION", "WEIGHT", "PRICE"])

    createNode("NEXT_PAGE_BTN_1", function () {
        if (!isFormValid())
            this.setAttribute("disabled", 'true')
        else
            this.removeAttribute("disabled")
    }, "container", $("button[name=nextPageBtn]")[1], ["SPRING_SOLUTION", "WEIGHT", "PRICE"])

    //The save button isn't compatible with a single page configurator
    $("div.button-set.button-2.location-border button")[0].remove()
    $("button[onclick='nextPage()']").text("Configure")


    //Adding indicies to sections
    $('#configurator section').each((index, e) => { e.setAttribute('index', index) })

    $(`#collapse1159850199`).remove();
    $(`#section_select`).on('change', (evt) => {
        showSection(Number(evt.target.value))
    })

    //Load the caching system.
    rw_init('configurator')

    $('.rw-warning').hide()
    $("#DEFAULTS_PLUGIN").html(DEFAULTS_PLUGIN.load("1825206974"))
    $('#configurator button').on("click", evt => evt.preventDefault())
    $('#LOAD_DEFAULTS').on('click', applyDefaults)
    $("#LIFT_TYPE").change((e) => $("#LIFT_TYPE_DISPLAY").html($("#LIFT_TYPE > option:selected").attr("display")))
    if ($("#INPUT_JSON").val() === '')
        applyDefaults()
    else {
        loadInputValues("configurator");
        $("#LIFT_TYPE_DISPLAY").html($("#LIFT_TYPE > option:selected").attr("display"))
    }
    populateCarousel()

}

function createForm() {

    const totalPrice = $("#TOTAL_PRICE").val();

    const form = `
	<script src="/HTML/products/162059085/jscripts/panelConfigurations.js"></script>

<div id="configurator">
    <div class="rw-configurator__layout">
        <div class="rw-configurator__layout--left">
            <div id="NAVIGATION_SPC"></div>

            <div class="postion-container" style="display:none;" id="window_position_container">

                <div class="window-position-title">
                    <span>Window Position</span>
                </div>

                <div class="window-position-container">
                    <div class="rw-button" tabindex="0" id="POSITION_TOP">
                        <label for="WINDOW_POSITION_TOP">Top</label>
                        <input type="radio" class="rw-button-toggle" style="display:none;" id="WINDOW_POSITION_TOP"
                            name="WINDOW_POSITION" desc="Top" value="top" code="top">
                    </div>
                    <div class="rw-button" tabindex="0">
                        <label for="WINDOW_POSITION_LEFT">Left</label>
                        <input type="radio" class="rw-button-toggle" style="display:none;" id="WINDOW_POSITION_LEFT"
                            name="WINDOW_POSITION" desc="Left" value="left" code="left">
                    </div>
                    <div class="rw-button" tabindex="0">
                        <label for="WINDOW_POSITION_CENTER">Center</label>
                        <input type="radio" class="rw-button-toggle" style="display:none;" id="WINDOW_POSITION_CENTER"
                            name="WINDOW_POSITION" desc="Center" value="center" code="right">
                    </div>
                    <div class="rw-button" tabindex="0">
                        <label for="WINDOW_POSITION_RIGHT">Right</label>
                        <input type="radio" class="rw-button-toggle" style="display:none;" id="WINDOW_POSITION_RIGHT"
                            name="WINDOW_POSITION" desc="Right" value="right" code="center">
                    </div>
                    <div class="rw-button" tabindex="0">
                        <label for="WINDOW_POSITION_BOTH">Both</label>
                        <input type="radio" class="rw-button-toggle" style="display:none;" id="WINDOW_POSITION_BOTH"
                            name="WINDOW_POSITION" desc="Both" code="both" value="both">
                    </div>
                    <div class="rw-button" tabindex="0"  id="POSITION_CUSTOM" >
                        <label for="WINDOW_POSITION_CUSTOM">Custom</label>
                        <input type="radio" class="rw-button-toggle" style="display:none;" id="WINDOW_POSITION_CUSTOM"
                            name="WINDOW_POSITION" desc="Custom" code="custom" value="custom">
                    </div>
                </div>
            </div>

            <div id="CANVAS_PLUGIN">
            </div>
            <!-- Loader -->
            <div class="canvas-loader" id="canvas-loader" style="display:none; position:absolute; top:50%; left:50%;
      transform:translate(-50%, -50%);
      padding:10px 20px; border-radius:8px; z-index:10;"></div>

        </div>
        <div class="rw-configurator__layout--right">
            <div id="DOOR_PROPERTIES"
                style="display:flex;flex-direction:row;justify-content:space-between; padding: 20px 0 0 0">
                <div id="SERIAL_CONTAINER" style="display:flex;flex-direction:column">

                </div>
                <div id="PRICE_CONTAINER">
                    <span id="PRICE_DISPLAY" style="
		  font-size: 24px;
		  font-weight: 700;
		  font-style: italic;
	   ">${totalPrice}
                    </span>
                </div>
            </div>

            <!-- DOOR MODEL SECTION STARTS -->

            <section id="DIMENSIONS" data-title="Door Model" class="rw-configurator__page" enabled="true" face="true"
                hardware="true" data-icon="fas fa-garage">
                <div class="dropdown-container">
                    <!-- door model element -->
                    <div class="dropdown-item">
                        <h3>Door Model</h3>
                        <div class="dimension-layout">
                            <div class="rw-button" tabindex="0">
                                <label for="L138">Classic L138</label>
                                <input type="radio" id="L138" name="DOOR_MODEL" value="A" desc="Cls" checked>
                            </div>

                            <div class="rw-button" tabindex="1">
                                <label for="L200">Premium L200</label>
                                <input type="radio" id="L200" name="DOOR_MODEL" value="D" desc="Prem">
                            </div>

                            <div class="rw-button" tabindex="2">
                                <label for="L200GV">Grandview L200GV</label>
                                <input type="radio" id="L200GV" name="DOOR_MODEL" value="G" desc="Grd">
                            </div>
                        </div>
                    </div>

                    <!-- <div style="text-align:left" class="config-option-title-style">Dimensions</div> -->
                    <div class="dropdown-item" id="DIMENSION">
                        <h3> Door Size (4 Sections) </h3>
                        <div class="dimension-layout">
                            <div class="rw-button" tabindex="0">
                                <label for="DIMENSIONS_0">8x7</label>
                                <input type="radio" id="DIMENSIONS_0" name="SIZE" value="0" width="8" height="7">
                            </div>
                            <div class="rw-button" tabindex="0">
                                <label for="DIMENSIONS_1">9x7</label>
                                <input type="radio" id="DIMENSIONS_1" name="SIZE" value="1" width="9" height="7">
                            </div>
                            <div class="rw-button" tabindex="0">
                                <label for="DIMENSIONS_2">16x7</label>
                                <input type="radio" id="DIMENSIONS_2" name="SIZE" value="2" width="16" height="7"
                                    checked>
                            </div>
                            <div class="rw-button" tabindex="0">
                                <label for="DIMENSIONS_3">8x8</label>
                                <input type="radio" id="DIMENSIONS_3" name="SIZE" value="3" width="8" height="8">
                            </div>
                            <div class="rw-button" tabindex="0">
                                <label for="DIMENSIONS_4">9x8</label>
                                <input type="radio" id="DIMENSIONS_4" name="SIZE" value="4" width="9" height="8">
                            </div>
                            <div class="rw-button" tabindex="0">
                                <label for="DIMENSIONS_5">16x8</label>
                                <input type="radio" id="DIMENSIONS_5" name="SIZE" value="5" width="16" height="8">
                            </div>
                        </div>
                    </div>

                    <!-- toggle switch for custom dimensions-->
                    <div class="dropdown-item custom-dimension-item">
                        <h3>Custom Dimension</h3>
                        <label class="switch">
                            <input type="checkbox" id="customSwitch" value="off">
                            <span class="slider round"></span>
                        </label>
                    </div>

                    <div class="custom-dimension-container">
                        <div class="custom-dimension-section">
                            <div class="dropdown-item">
                                <h3>Door Width</h3>
                                <div class="dropdown-pair">
                                    <div class="dropdown-subitem">
                                        <label for="DOOR_WIDTH_FEET">Feet</label>
                                        <select id="DOOR_WIDTH_FEET" name="DOOR_WIDTH_FEET">
                                        </select>
                                    </div>

                                    <div class="dropdown-subitem">
                                        <label for="DOOR_WIDTH_INCHES">Inches</label>
                                        <select id="DOOR_WIDTH_INCHES" name="DOOR_WIDTH_INCHES">
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="dropdown-item">
                                <h3>Door Height</h3>
                                <div class="dropdown-pair">
                                    <div class="dropdown-subitem">
                                        <label for="DOOR_HEIGHT_FEET">Feet</label>
                                        <select id="DOOR_HEIGHT_FEET" name="DOOR_HEIGHT_FEET">
                                        </select>
                                    </div>

                                    <div class="dropdown-subitem">
                                        <label for="DOOR_HEIGHT_INCHES">Inches</label>
                                        <select id="DOOR_HEIGHT_INCHES" name="DOOR_HEIGHT_INCHES">
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="dropdown-item">
                                <h3>Number Of Sections</h3>
                                <div class="dimension-layout">
                                    <select id="NUM_OF_SEC" name="NUM_OF_SEC">
                                    </select>
                                </div>

                            </div>
                        </div>

                    </div>

                    <div class="dropdown-item">
                        <h3> Panel Style </h3>
                        <div class="panel-layout">
                            <div class="rw-button panel-button" tabindex="0">
                                <label for="RANCH">Raised Ranch</label>
                                <input type="radio" id="RANCH" name="FACE" value="R" desc="Rnc">
                            </div>
                            <div class="rw-button panel-button" tabindex="0">
                                <label for="FLUSH">Flush</label>
                                <input type="radio" id="FLUSH" name="FACE" value="F" desc="Fls" checked>
                            </div>
                            <div class="rw-button panel-button" tabindex="0">
                                <label for="COLONIAL">Raised Colonial</label>
                                <input type="radio" id="COLONIAL" name="FACE" value="C" desc="Col">
                            </div>
                        </div>
                    </div>

                    <!-- toggle switch for custom dimensions-->
                    <div class="dropdown-item custom-dimension-item">
                        <h3>More Panel Style</h3>
                        <label class="switch">
                            <input type="checkbox" id="customPanelSwitch" value="off">
                            <span class="slider round"></span>
                        </label>
                    </div>

                    <div class="dropdown-item custom-panel-item-container">
                        <div class="panel-layout">
                            <div class="rw-button panel-button" tabindex="0">
                                <label for="GROOVED_RANCH">Recessed grooved Ranch</label>
                                <input type="radio" id="GROOVED_RANCH" name="FACE" value="S" desc="RncGc">
                            </div>
                            <div class="rw-button panel-button" tabindex="0">
                                <label for="GROOVED_COLONIAL">Recessed grooved Colonial</label>
                                <input type="radio" id="GROOVED_COLONIAL" name="FACE" value="B" desc="ColGc">
                            </div>
                            <div class="rw-button panel-button" tabindex="0">
                                <label for="SMOOTH_RANCH">Recessed Ranch</label>
                                <input type="radio" id="SMOOTH_RANCH" name="FACE" value="T" desc="RncSc">
                            </div>

                            <div class="rw-button panel-button" tabindex="0">
                                <label for="PLANK">Plank</label>
                                <input type="radio" id="PLANK" name="FACE" value="V" desc="Plk">
                            </div>
                            <div class="rw-button panel-button mixed-panel" tabindex="0" style="display:none">
                                <label for="MIXED">Mixed</label>
                                <input type="radio" id="MIXED" name="FACE" value="M">
                            </div>
                        </div>
                    </div>

                    <!-- Mix Panel Design code-->
                    <div class="dropdown-item" class="mix-panel-layout" style="width:50%" id="MixPanelLayout" style="display:none">
                        <h3>Design Code</h3>
                        <div>
                            <select id="DESIGN_CODE" name="DESIGN_CODE">
                            </select>
                        </div>
                    </div>


                    <!--Door colour -->
                    <div class="dropdown-item" data-id="COLOR">
                        <h3>Colour</h3>
                        <div class="colorChooser">
                            <div class="available">
                                <div class="colorsSection" id="AvaialbleColorsSection">
                                    <div class="stack-wrapper colorContainerInactive bottom">
                                        <div aria-labelledby="colors" tabindex="0" id="availableStackColors"
                                            class="colorsFieldset"></div>
                                        <div class="tooltip">
                                            <p>View Most Popular Colors</p>
                                        </div>
                                    </div>
                                    <div class='colorContainer'></div>
                                </div>
                            </div>
                            <div class="optional">
                                <div class="colorsSection" id="OptionalColorsSection">
                                    <div class="divider"></div>
                                    <div class="stack-wrapper right">
                                        <div aria-labelledby="colors" tabindex="0" id="optionalStackColors"
                                            class="colorsFieldset"></div>
                                        <div class="tooltip">
                                            <p>View Other Colors</p>
                                        </div>
                                    </div>

                                    <div class='colorContainer colorContainerInactive'></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Finish -->
                    <div class="dropdown-item" style="flex-direction: row">
                        <div class="finish-container">
                            <h3>Finish</h3>
                            <div class="finish-layout">
                                <div class="rw-button btn-checked finish-layout-btn" tabindex="0">
                                    <label for="WOODGRAIN">Woodgrain</label>
                                    <input type="radio" id="WOODGRAIN" name="FINISH" value="W" checked>
                                </div>
                                <div class="rw-button finish-stucco finish-layout-btn" tabindex="0" style="display:none"
                                    id="finishStucco">
                                    <label for="STUCCO">Stucco</label>
                                    <input type="radio" id="STUCCO" name="FINISH" value="S">
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </section>

            <!-- glazing section -->
            <section face="false" hardware="true" enabled="true" id="GLAZING" class="rw-configurator__page"
                data-title="Glazing" data-icon="fas fa-window-frame">

                <!-- glass shapes -->

                <div class="dropdown-item" id="GLASS_SHAPE_LAYOUT">
                    <h3>Glass Shape</h3>
                    <div class="panel-layout">
                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_SHAPE_COLONIAL">Colonial</label>
                            <input type="radio" id="GLASS_SHAPE_COLONIAL" name="GLASS_SHAPE" value="colonial">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_SHAPE_RANCH">Ranch</label>
                            <input type="radio" id="GLASS_SHAPE_RANCH" name="GLASS_SHAPE" value="ranch">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_SHAPE_3">Slim</label>
                            <input type="radio" id="GLASS_SHAPE_3" name="GLASS_SHAPE" value="slim_single">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_SHAPE_SLIM_DBL">Slim Double</label>
                            <input type="radio" id="GLASS_SHAPE_SLIM_DBL" name="GLASS_SHAPE" value="slim_double">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_SHAPE_MORE_17">Grand Wrought Iron - Rectangle</label>
                            <input type="radio" id="GLASS_SHAPE_MORE_17" name="GLASS_SHAPE"
                                value="grand_wrought_iron_rectangle">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_SHAPE_MORE_18">Grand Wrought Iron - Double Arched</label>
                            <input type="radio" id="GLASS_SHAPE_MORE_18" name="GLASS_SHAPE"
                                value="grand_wrought_iron_double_arched">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_SHAPE_MORE_19">Grand 4/4 - Rectangle</label>
                            <input type="radio" id="GLASS_SHAPE_MORE_19" name="GLASS_SHAPE" value="grand_44_rectangle">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_SHAPE_MORE_20">Grand 4/4 - Double Arched</label>
                            <input type="radio" id="GLASS_SHAPE_MORE_20" name="GLASS_SHAPE"
                                value="grand_44_double_arched">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_SHAPE_MORE_21">Grand 4 Pane - Rectangle</label>
                            <input type="radio" id="GLASS_SHAPE_MORE_21" name="GLASS_SHAPE"
                                value="grand_4_pane_rectangle">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_SHAPE_MORE_22">Grand 4 Pane - Double Arched</label>
                            <input type="radio" id="GLASS_SHAPE_MORE_22" name="GLASS_SHAPE"
                                value="grand_4_pane_double_arched">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_SHAPE_MORE_23">Grand Clear - Rectangle</label>
                            <input type="radio" id="GLASS_SHAPE_MORE_23" name="GLASS_SHAPE"
                                value="grand_clear_rectangle">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_SHAPE_MORE_24">Grand Clear - Double Arched</label>
                            <input type="radio" id="GLASS_SHAPE_MORE_24" name="GLASS_SHAPE"
                                value="grand_clear_double_arched">
                        </div>

                    </div>
                </div>

                <!-- glass shapes end>

		<!-- glass types -->
                <div class="dropdown-item">
                    <h3>Glass Type</h3>
                    <div class="panel-layout">
                        <div class="rw-button panel-button" tabindex="0">
                            <label for="CLEAR">Clear Sealed</label>
                            <input type="radio" class="rw-button-toggle" id="CLEAR" name="GLASS_TYPE" value="CLEAR"
                                glazingtype='double'>
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="CLEAR_SINGLE">Clear Single</label>
                            <input type="radio" class="rw-button-toggle" id="CLEAR_SINGLE" name="GLASS_TYPE"
                                value="CLEAR_SINGLE" glazingtype='single'>
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="SATIN">Satin</label>
                            <input type="radio" class="rw-button-toggle" id="SATIN" name="GLASS_TYPE" value="SATIN"
                                glazingtype='double'>
                        </div>
                    </div>
                </div>

                <div class="dropdown-item custom-dimension-item" id="more_glass_type_switch">
                    <h3>More Glass Types</h3>
                    <label class="switch">
                        <input type="checkbox" id="more_glass_types" value="off">
                        <span class="slider round"></span>
                    </label>
                </div>

                <div class="dropdown-item custom-panel-item-container" id="more_glass_types_container">
                    <div class="panel-layout">
                        <div class="rw-button panel-button" tabindex="0">
                            <label for="OBSCURE_GLASS_PINHEAD">Obscure Pinhead Sealed</label>
                            <input type="radio" id="OBSCURE_GLASS_PINHEAD" name="GLASS_TYPE"
                                value="OBSCURE_GLASS_PINHEAD" glazingtype='double'>
                        </div>
                        <div class="rw-button panel-button" tabindex="0">
                            <label for="OBSCURE_GLASS_SINGLE">Obscure Pinhead Single</label>
                            <input type="radio" id="OBSCURE_GLASS_SINGLE" name="GLASS_TYPE" value="OBSCURE_GLASS_SINGLE"
                                glazingtype='single'>
                        </div>
                        <div class="rw-button panel-button" tabindex="0">
                            <label for="DARK_TINT_SEALED">Dark Tint - Sealed</label>
                            <input type="radio" id="DARK_TINT_SEALED" name="GLASS_TYPE" value="DARK_TINT_SEALED"
                                glazingtype='double'>
                        </div>
                        <div class="rw-button panel-button" tabindex="0">
                            <label for="DARK_TINT_SINGLE">Dark Tint - Sealed</label>
                            <input type="radio" id="DARK_TINT_SINGLE" name="GLASS_TYPE" value="DARK_TINT_SINGLE"
                                glazingtype='single'>
                        </div>
                        <div class="rw-button panel-button" tabindex="0">
                            <label for="BLACK_SATIN_SEALED">Black Satin - Sealed</label>
                            <input type="radio" id="BLACK_SATIN_SEALED" name="GLASS_TYPE" value="BLACK_SATIN_SEALED"
                                glazingtype='double'>
                        </div>
                    </div>
                </div>
                <!-- glass types end>

		<!-- glass inserts -->
                <div class="dropdown-item" id="glass_insert_section">
                    <h3>Glass Insert</h3>
                    <div class="panel-layout">
                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_1">Stockton</label>
                            <input type="radio" class="rw-button-toggle" id="GLASS_INSERT_1" name="GLASS_INSERT"
                                value="stockton_colonial" insertCode='550-309'>
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_2">Waterton</label>
                            <input type="radio" class="rw-button-toggle" id="GLASS_INSERT_2" name="GLASS_INSERT"
                                value="waterton_colonial" insertCode='550-337'>
                        </div>

                        <div class="rw-button panel-button" tabindex="0" style="display:none;">
                            <label for="GLASS_INSERT_3">Stockton</label>
                            <input type="radio" class="rw-button-toggle" id="GLASS_INSERT_3" name="GLASS_INSERT"
                                value="stockton_ranch" insertCode='550-313'>
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_4">Waterton</label>
                            <input type="radio" class="rw-button-toggle" id="GLASS_INSERT_4" name="GLASS_INSERT"
                                value="waterton_ranch" insertCode='550-347'>
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_0">Prairie</label>
                            <input type="radio" id="GLASS_INSERT_MORE_0" name="GLASS_INSERT" value="prairie"
                                insertCode='550-451'>
                        </div>

                    </div>
                </div>

                <div class="dropdown-item custom-dimension-item" id="more_glass_inserts_toggle_row">
                    <h3>More Glass Inserts</h3>
                    <label class="switch">
                        <input type="checkbox" id="more_glass_inserts" value="off">
                        <span class="slider round"></span>
                    </label>
                </div>

                <div class="dropdown-item custom-panel-item-container" id="more_glass_inserts_container">
                    <div class="panel-layout">
                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_1">Cascade</label>
                            <input type="radio" id="GLASS_INSERT_MORE_1" name="GLASS_INSERT" value="cascade_colonial"
                                insertCode='550-317'>
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_25">Cascade</label>
                            <input type="radio" id="GLASS_INSERT_MORE_25" name="GLASS_INSERT" value="cascade_ranch" 
                            insertCode='550-321'>
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_2">Arched Stockton</label>
                            <input type="radio" id="GLASS_INSERT_MORE_2" name="GLASS_INSERT" value="arched_stockton" 
                            insertCode ='550-341'>
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_3">Stockbridge</label>
                            <input type="radio" id="GLASS_INSERT_MORE_3" name="GLASS_INSERT" value="stockbridge"
                            insertCode = '550-456'>
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_4">Arched Stockbridge</label>
                            <input type="radio" id="GLASS_INSERT_MORE_4" name="GLASS_INSERT" value="arched_stockbridge" 
                            insertCode = '550-396'>
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_5">Aluminum Grid - Stockton 4</label>
                            <input type="radio" id="GLASS_INSERT_MORE_5" name="GLASS_INSERT" value="alum_stockton_4">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_6">Aluminum Grid - Stockton 6</label>
                            <input type="radio" id="GLASS_INSERT_MORE_6" name="GLASS_INSERT" value="alum_stockton_6">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_7">Aluminum Grid - Prairie</label>
                            <input type="radio" id="GLASS_INSERT_MORE_7" name="GLASS_INSERT" value="alum_prairie">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_8">Aluminum Grid - Stockton 10</label>
                            <input type="radio" id="GLASS_INSERT_MORE_8" name="GLASS_INSERT" value="alum_stockton_10">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_9">Square Bar - Stockton 4</label>
                            <input type="radio" id="GLASS_INSERT_MORE_9" name="GLASS_INSERT"
                                value="square_bar_stockton_4">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_10">Square Bar - Stockton 6</label>
                            <input type="radio" id="GLASS_INSERT_MORE_10" name="GLASS_INSERT"
                                value="square_bar_stockton_6">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_11">Square Bar - Prairie</label>
                            <input type="radio" id="GLASS_INSERT_MORE_11" name="GLASS_INSERT"
                                value="square_bar_prairie">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_12">Round Bar - Stockton 4</label>
                            <input type="radio" id="GLASS_INSERT_MORE_12" name="GLASS_INSERT"
                                value="round_bar_stockton_4">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_13">Round Bar - Stockton 6</label>
                            <input type="radio" id="GLASS_INSERT_MORE_13" name="GLASS_INSERT"
                                value="round_bar_stockton_6">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_14">Round Bar - Prairie</label>
                            <input type="radio" id="GLASS_INSERT_MORE_14" name="GLASS_INSERT" value="round_bar_prairie">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_15">Square Bar - Stockton 10</label>
                            <input type="radio" id="GLASS_INSERT_MORE_15" name="GLASS_INSERT"
                                value="square_bar_stockton_10">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_16">Round Bar - Stockton 10</label>
                            <input type="radio" id="GLASS_INSERT_MORE_16" name="GLASS_INSERT"
                                value="round_bar_stockton_10">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_17">Arched Stockton 3pc Set</label>
                            <input type="radio" id="GLASS_INSERT_MORE_17" name="GLASS_INSERT" value="arched_stockton_3"
                            insertCode = '550-341'>
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_18">Arched Stockbridge 3pc Set</label>
                            <input type="radio" id="GLASS_INSERT_MORE_18" name="GLASS_INSERT"
                                value="arched_stockbridge_3" insertCode='550-396' >
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_19">Berkshire</label>
                            <input type="radio" id="GLASS_INSERT_MORE_19" name="GLASS_INSERT" value="arched_stockton_4"
                            insertCode='550-341'>
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_INSERT_MORE_20">Breckenridge</label>
                            <input type="radio" id="GLASS_INSERT_MORE_20" name="GLASS_INSERT"
                                value="arched_stockbridge_4" insertCode='550-396'>
                        </div>
                    </div>
                </div>
                <!-- glass inserts end>

		<!--Frame colour -->
                <div class="dropdown-item" id="FRAME_COLOR">
                    <h3>Frame Colour</h3>
                    <div class="colorChooser">
                        <div class="available">
                            <div class="colorsSection" id="AvailableFrameColorsSection">
                                <div class="stack-wrapper colorContainerInactive bottom">
                                    <div aria-labelledby="colors" tabindex="0" id="availableStackFrameColors"
                                        class="colorsFieldset"></div>
                                    <div class="tooltip">
                                        <p>View Most Popular Colors</p>
                                    </div>
                                </div>
                                <div class='colorContainer'></div>
                            </div>
                        </div>
                        <div class="optional">
                            <div class="colorsSection" id="OptionalFrameColorsSection">
                                <div class="divider"></div>
                                <div class="stack-wrapper right">
                                    <div aria-labelledby="colors" tabindex="0" id="optionalStackFrameColors"
                                        class="colorsFieldset"></div>
                                    <div class="tooltip">
                                        <p>View Other Colors</p>
                                    </div>
                                </div>

                                <div class='colorContainer colorContainerInactive'></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!--Insert colour -->
                <div class="dropdown-item" id="INSERT_COLOR">
                    <h3>Insert Colour</h3>
                    <div class="colorChooser">
                        <div class="available">
                            <div class="colorsSection" id="AvailableInsertColorsSection">
                                <div class="stack-wrapper colorContainerInactive bottom">
                                    <div aria-labelledby="colors" tabindex="0" id="availableStackInsertColors"
                                        class="colorsFieldset"></div>
                                    <div class="tooltip">
                                        <p>View Most Popular Colors</p>
                                    </div>
                                </div>
                                <div class='colorContainer'></div>
                            </div>
                        </div>
                        <div class="optional">
                            <div class="colorsSection" id="OptionalInsertColorsSection">
                                <div class="divider"></div>
                                <div class="stack-wrapper right">
                                    <div aria-labelledby="colors" tabindex="0" id="optionalStackInsertColors"
                                        class="colorsFieldset"></div>
                                    <div class="tooltip">
                                        <p>View Other Colors</p>
                                    </div>
                                </div>

                                <div class='colorContainer colorContainerInactive'></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- tempered glass -->
                <div class="dropdown-item">
                    <h3>Tempered Glass</h3>
                    <div class="panel-layout">
                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_TEMPERED_0">All</label>
                            <input type="radio" class="rw-button-toggle" id="GLASS_TEMPERED_0" name="GLASS_TEMPERED"
                                value="all">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_TEMPERED_1">Bottom</label>
                            <input type="radio" class="rw-button-toggle" id="GLASS_TEMPERED_1" name="GLASS_TEMPERED"
                                value="bottom_1">
                        </div>

                        <div class="rw-button panel-button" tabindex="0">
                            <label for="GLASS_TEMPERED_2">Bottom 2</label>
                            <input type="radio" class="rw-button-toggle" id="GLASS_TEMPERED_2" name="GLASS_TEMPERED"
                                value="bottom_2">
                        </div>
                    </div>
                </div>
                <!-- tempered glass end -->
            </section>

            <!-- HARDWARE SECTION -->
            <section face="false" hardware="true" enabled="true" id="HARDWARE" class="rw-configurator__page"
                data-title="Hardware" data-icon="fas fa-tools">
                <div class="dropdown-container">
                    <div class="dropdown-item">
                        <h3>Hardware Set</h3>
                        <div class="dimension-layout">
                            <div class="rw-button btn-checked" tabindex="0">
                                <input type="radio" id="STANDARD" name="HARDWARE_SET" value="A" checked>
                                <label for="STANDARD">Standard</label>
                            </div>

                            <div class="rw-button" tabindex="0">
                                <input type="radio" id="STANDARD_PLUS" name="HARDWARE_SET" value="Y">
                                <label for="STANDARD_PLUS">Standard Plus</label>
                            </div>

                            <div class="rw-button" tabindex="0">
                                <input type="radio" id="COMMERCIAL" name="HARDWARE_SET" value="C">
                                <label for="COMMERCIAL">Commercial</label>
                            </div>
                        </div>
                    </div>

                    <div class="dropdown-item">
                        <div class="springType-container">
                            <div class="dropdown-pair">
                                <div class="dropdown-subitem" style="width:100%">
                                    <h3>Spring Type</h3>
                                    <div class="combined-button-container">
                                        <div class="combined-button-container-inner">
                                            <div class="rw-sliding-button selected">
                                                <label for="TORSION">Torsion</label>
                                                <input type="radio" style="display:none;" id="TORSION"
                                                    name="SPRING_TYPE" value="TOR">
                                            </div>
                                            <div class="rw-sliding-button">
                                                <label for="EXTENSION">Extension</label>
                                                <input type="radio" style="display:none;" id="EXTENSION"
                                                    name="SPRING_TYPE" value="EXT">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="dropdown-subitem inclined-track" style="width:100%; display:none">
                                    <h3>Inclined Track</h3>
                                    <div class="combined-button-container">
                                        <div class="combined-button-container-inner">
                                            <div class="rw-sliding-button">
                                                <label for="INCLINED_YES">YES</label>
                                                <input type="radio" style="display:none;" id="INCLINED_YES"
                                                    name="INCLINEDTRACK" value="Y">
                                            </div>
                                            <div class="rw-sliding-button selected">
                                                <label for="INCLINED_NO">NO</label>
                                                <input type="radio" style="display:none;" id="INCLINED_NO"
                                                    name="INCLINEDTRACK" value="N" checked>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="dropdown-item" id="liftTypeSection">
                        <h3 for="LIFT_TYPE">Lift Type</h3>
                        <div class="panel-layout">
                            <div class="rw-button panel-button lift-option" tabindex="0" id="opt-STD12">
                                <input type="radio" id="STD12" name="LIFT_TYPE" value="STD12" ic_code='' hwdesc=''
                                    trackCode='' numval='1.0' radius="12">
                                <label for="STD12">Standard 12"R</label>
                            </div>
                            <div class="rw-button panel-button lift-option btn-checked" tabindex="0" id="opt-STD15">
                                <input type="radio" id="STD15" name="LIFT_TYPE" value="STD15" ic_code='' hwdesc=''
                                    trackCode='' numval='1.0' radius="15" checked>
                                <label for="STD15">Standard 15"R</label>
                            </div>
                            <div class="rw-button panel-button lift-option" tabindex="0" id="opt-32R">
                                <input type="radio" id="32R" name="LIFT_TYPE" value="32R" ic_code='' hwdesc=''
                                    trackCode='' numval='1.0' radius="32">
                                <label for="32R">Standard 32"R</label>
                            </div>
                            <div class="rw-button panel-button lift-option" tabindex="0" id="opt-LHF">
                                <input type="radio" id="LHF" name="LIFT_TYPE" value="LHF" ic_code='' hwdesc=''
                                    trackCode='' numval='1.0' radius="7">
                                <label for="LHF">Low Headroom Front</label>
                            </div>
                            <div class="rw-button panel-button lift-option" tabindex="0" id="opt-LHROUT">
                                <input type="radio" id="LHROUT" name="LIFT_TYPE" value="LHROUT" ic_code='' hwdesc=''
                                    trackCode='' numval='1.0' radius="7">
                                <label for="LHROUT">Low Headroom Rear</label>
                            </div>
                            <div class="rw-button panel-button lift-option" tabindex="0" id="opt-LHREXT">
                                <input type="radio" id="LHREXT" name="LIFT_TYPE" value="LHREXT" ic_code='' hwdesc=''
                                    trackCode='' numval='1.0' radius="7">
                                <label for="LHREXT">Low Headroom Ext.</label>
                            </div>
                            <div class="rw-button panel-button lift-option" tabindex="0" id="opt-HL">
                                <input type="radio" id="HL" name="LIFT_TYPE" value="HL" ic_code='' hwdesc=''
                                    trackCode='' numval='2.0' radius="0">
                                <label for="HL">High Lift</label>
                            </div>
                            <div class="rw-button panel-button lift-option" tabindex="0" id="opt-VL">
                                <input type="radio" id="VL" name="LIFT_TYPE" value="VL" ic_code='' hwdesc=''
                                    trackCode='' numval='2.0' radius="0">
                                <label for="VL">Vertical Lift</label>
                            </div>
                            <div class="rw-button panel-button lift-option" tabindex="0" id="opt-VL_HD">
                                <input type="radio" id="LHR_VL" name="LIFT_TYPE" value="LHR_VL" ic_code='' hwdesc=''
                                    trackCode='' numval='2.0' radius="0">
                                <label for="LHR_VL">Vertical Lift Low Headroom</label>
                            </div>
                        </div>
                    </div>

                    <div class="dropdown-item" id="HIGHLIFT_LAYOUT" style="display:none">
                        <div class="range-slider-container">
                            <h3 id="HIGHLIFT_LABEL" for="HIGHLIFT">Highlift (in) : <span id="HIGHLIFT_VALUE"></span> |
                                Low Headroom (in) : <span id="HEADROOM_VALUE"></span>
                            </h3>
                            <input type="range" min="15" max="54" value="17" class="range-slider" id="HIGHLIFT">
                        </div>
                    </div>

                    <div class="dropdown-item">
                        <div class="dimension-layout">
                            <div class="dropdown-pair">
                                <div class="dropdown-subitem" style="width:100%">
                                    <h3>Spring Cycle</h3>
                                    <div class="combined-button-container">
                                        <div class="combined-button-container-inner">
                                            <div class="rw-sliding-button selected">
                                                <label for="10K">10K</label>
                                                <input type="radio" style="display:none;" id="10K" name="SPRING_CYCLE"
                                                    value="10K" checked>
                                            </div>
                                            <div class="rw-sliding-button">
                                                <label for="20K">20K</label>
                                                <input type="radio" style="display:none;" id="20K" name="SPRING_CYCLE"
                                                    value="20K">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="dropdown-subitem" style="width:100%">
                                    <h3 for="JAMB_SEAL" class="">Jamb Seal </h3>
                                    <select id="JAMB_SEAL" name="JAMB_SEAL">
                                        <option value="NONE">None</option>
                                        <option value="DUALA">Aluminium - Dual Fin</option>
                                        <option value="SINGLE">PVC - Single Fin</option>
                                        <option value="DUAL">PVC - Dual Fin</option>
                                        <option value="DUALS"> Steel - Dual Fin</option>
                                    </select>
                                </div>

                            </div>
                        </div>
                    </div>



                    <div class="dropdown-item">
                        <div class="dimension-layout">
                            <div class="dropdown-pair">
                                <div class="dropdown-subitem" style="width:100%">
                                    <h3 for="HANGER_ANGLE">Hanger Angle</h3>
                                    <select id="HANGER_ANGLE" name="HANGER_ANGLE">
                                        <option value="None">None</option>
                                        <option value="950-254">10' - 16 ga. 1.25" X SP1.25" Hole/Hole</option>
                                        <option value="950-253">10' - 14 ga. 1.25" X 1.25" Hole/Hole</option>
                                        <option value="950-252">10' - 12 ga. 1.25" X 1.25" Hole/Hole</option>
                                        <option value="950-255">10' - 11 ga. 1.5" X 1.5" Hole/Slot</option>
                                        <option value="950-256">10' - 12 ga. 2" X 2" Hole/Hole</option>
                                    </select>
                                </div>
                                <div class="dropdown-subitem" style="width:100%">
                                    <h3>Hanger Qty</h3>
                                    <div class="quantity-field">
                                        <button class="value-button decrease-button"
                                            onclick="decreaseValue(this)">-</button>
                                        <div class="number" id="HANGER_ANGLE_QTY">0</div>
                                        <button class="value-button increase-button" onclick="increaseValue(this, 10)">+
                                        </button>
                                    </div>
                                </div>
                                <div class="dropdown-subitem" style="width:100%">
                                    <h3 for="JAMB_SEAL_SCREW_PACKAGES" style="display:flex; gap:6px">Screw Packages
                                        <a href="https://easywebdev.rwdoors.com/HTML/products/210005530/help/JambSealChart.pdf"
                                            class="info-icon" target="_blank" rel="noopener noreferrer"> ? </a>
                                    </h3>
                                    <div class="quantity-field">
                                        <button class="value-button decrease-button"
                                            onclick="decreaseValue(this)">-</button>
                                        <div class="number" id="JAMB_SEAL_SCREW_PACKAGES">0</div>
                                        <button class="value-button increase-button" onclick="increaseValue(this, 10)">+
                                        </button>
                                    </div>
                                    <div class="package-info" style="font-size: 12px; color: #555; margin-top: 4px;">
                                        50 screws per package
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- OPERATION SECTION-->
            <section face="false" hardware="true" enabled="true" id="OPERATOR_OPTIONS" data-title="Operator"
                class="rw-configurator__page" data-icon="fas fa-bolt">

                <div class="operator-card">

                    <div class="operator-header">
                        <div class="operator-icon">
                            ⚡
                        </div>

                        <div>
                            <h2>Operator</h2>
                            <p>Select and configure your operator system</p>
                        </div>
                    </div>

                    <input type="hidden" name="OPERATOR" id="OPERATOR" value="" data-max-door-height=""
                        data-is-hi-lift-compatible="" />

                    <div class="operator-carousel-wrapper">


                        <div id="prevButtonOperator" class="operator-arrow" role="button" tabindex="0">


                            <svg viewBox="0 0 640 640">
                                <path
                                    d="M406.7 105.3C394.2 92.8 373.9 92.8 361.4 105.3L169.4 297.3C156.9 309.8 156.9 330.1 169.4 342.6L361.4 534.6C373.9 547.1 394.2 547.1 406.7 534.6C419.2 522.1 419.2 501.8 406.7 489.3L237.3 320L406.7 150.7C419.2 138.2 419.2 117.8 406.7 105.3Z" />
                            </svg>

                        </div>

                        <div class="carousel-container-slide">
                            <div id="operator-carousel-container"></div>
                        </div>


                        <div id="nextButtonOperator" class="operator-arrow" role="button" tabindex="0">


                            <svg viewBox="0 0 640 640">
                                <path
                                    d="M233.3 534.6C245.8 547.1 266.1 547.1 278.6 534.6L470.6 342.6C483.1 330.1 483.1 309.8 470.6 297.3L278.6 105.3C266.1 92.8 245.8 92.8 233.3 105.3C220.8 117.8 220.8 138.2 233.3 150.7L402.7 320L233.3 489.3C220.8 501.8 220.8 522.1 233.3 534.6Z" />
                            </svg>

                        </div>

                    </div>

                    <div class="operator-pagination">

                    </div>

                </div>


                <div class="operator-accessories">
                    <div class="operator-accessory-card">
                        <a href="" target="_blank">
                            <div class="image-placeholder-container">
                                <img class="rw-image-input-img" id="ADDITIONAL_TRANSMITTER_IMAGE" />

                                <div class="no-image-message">
                                    <span>No</span>
                                    <span>Accessory</span>
                                    <span>Selected</span>
                                </div>
                                <div class="overlay"></div>
                            </div>
                        </a>
                        <div class="horizontal-inputs horizontal-inputs--quantity" style="width:75%;">
                            <div class="image-input-cell">
                                <h3 for="ADDITIONAL_TRANSMITTER" class="config-option-label-style">Additional
                                    Transmitter
                                </h3>
                                <select id="ADDITIONAL_TRANSMITTER" style="width:75%" name="ADDITIONAL_TRANSMITTER"
                                    onchange="operatorImageOnChangeLM(this)">
                                    <option value=NONE selected img="" smartpartnum=>NONE</option>
                                    <option value=952-232 img="L991S-(952-230)_E-Cat.png" smartpartnum=952-232>L993M
                                    </option>
                                    <option value=952-233 img="L993S-(952-233)_E-Cat.png" smartpartnum=952-233>L993S
                                    </option>
                                    <option value=952-231 img="L992U-(952-231)_E-Cat.png" smartpartnum=952-231>L992U
                                    </option>
                                    <option value=952-229 img="L932M-(952-229)_E-Cat.png" smartpartnum=952-229>L932M
                                    </option>
                                    <option value=952-230 img="L991S-(952-230)_E-Cat.png" smartpartnum=952-230>L991S
                                    </option>
                                </select>
                            </div>
                            <div class="image-input-cell">
                                <h3 for="ADDITIONAL_TRANSMITTER_QTY" class="config-option-label-style">Qty</h3>
                                <select id="ADDITIONAL_TRANSMITTER_QTY" name="ADDITIONAL_TRANSMITTER_QTY"
                                    style="min-width: 50px;" disabled>
                                    <option value="0" selected>0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                            </div>
                        </div>

                    </div>

                    <div class="operator-accessory-card">
                        <a href="" target="_blank">
                            <div class="image-placeholder-container">
                                <img class="rw-image-input-img" id="ADDITIONAL_CONTROL_PANEL_IMAGE" />

                                <div class="no-image-message">
                                    <span>No</span>
                                    <span>Accessory</span>
                                    <span>Selected</span>
                                </div>

                                <div class="overlay"></div>
                            </div>
                        </a>
                        <div class="horizontal-inputs horizontal-inputs--quantity" style="width:75%;">
                            <div class="image-input-cell">
                                <h3 for="ADDITIONAL_CONTROL_PANEL" class="config-option-label-style">Additional Control
                                    Panel</h3>
                                <select id="ADDITIONAL_CONTROL_PANEL" style="width:75%" name="ADDITIONAL_CONTROL_PANEL"
                                    onchange="operatorImageOnChangeLM(this)">
                                    <option value=NONE img="" selected smartpartnum=>None</option>
                                    <option value=952-227 img="L957W (952-227)_E-Cat.png" smartpartnum=952-227>L957W
                                    </option>
                                    <option value=952-228 img="L958W-(952-228)_E-Cat.png" smartpartnum=952-228>L958W
                                    </option>
                                    <option value=952-225 img="L955W-(952-225)_E-Cat.png" smartpartnum=952-225>L955W
                                    </option>
                                    <option value=952-226 img="L956W-(952-226)_E-Cat.png" smartpartnum=952-226>L956W
                                    </option>
                                </select>
                            </div>
                            <div class="image-input-cell">
                                <h3 for="ADDITIONAL_CONTROL_PANEL_QTY" class="config-option-label-style">Qty</h3>
                                <select id="ADDITIONAL_CONTROL_PANEL_QTY" name="ADDITIONAL_CONTROL_PANEL_QTY"
                                    style="min-width: 50px;" disabled>
                                    <option value="0" selected>0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="operator-accessory-card">
                        <a href="" target="_blank">
                            <div class="image-placeholder-container">
                                <img class="rw-image-input-img" id="ADDITIONAL_KEYLESS_ENTRY_IMAGE" />
                                <div class="no-image-message">
                                    <span>No</span>
                                    <span>Accessory</span>
                                    <span>Selected</span>
                                </div>

                                <div class="overlay"></div>
                            </div>
                        </a>
                        <div class="horizontal-inputs horizontal-inputs--quantity" style="width:75%;">
                            <div class="image-input-cell">
                                <h3 for="ADDITIONAL_KEYLESS_ENTRY" class="config-option-label-style">Additional Keyless
                                    Entry</h3>
                                <select id="ADDITIONAL_KEYLESS_ENTRY" style="width:75%" name="ADDITIONAL_KEYLESS_ENTRY"
                                    onchange="operatorImageOnChangeLM(this)">
                                    <option value=NONE img="" selected smartpartnum=>None</option>
                                    <option value=952-234 img="L979M-(952-234)_E-Cat.png" smartpartnum=952-234>L979M
                                    </option>
                                    <option value=952-235 img="L979S-(952-235)_E-Cat.png" smartpartnum=952-235>L979S
                                    </option>
                                    <option value=952-236 img="L979U-(952-236)_E-Cat.png" smartpartnum=952-236>L979U
                                    </option>
                                </select>
                            </div>
                            <div class="image-input-cell">
                                <h3 for="ADDITIONAL_KEYLESS_ENTRY_QTY" class="config-option-label-style">Qty</h3>
                                <select id="ADDITIONAL_KEYLESS_ENTRY_QTY" name="ADDITIONAL_KEYLESS_ENTRY_QTY"
                                    style="min-width: 50px;" disabled>
                                    <option value="0" selected>0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Advance SECTION-->
            <section face="false" hardware="true" enabled="true" id="ADVANCED" data-title="Advanced"
                class="rw-configurator__page" data-icon="fas fa-sliders-v">
                <div class="dropdown-container">
                    <div class="dropdown-item">
                        <h3>Door Options</h3>
                        <div class="dimension-layout">
                            <div class="rw-button" tabindex="0">
                                <input type="radio" id="DOORFACE" name="DOOROPT" value="DOORFACE">
                                <label for="DOORFACE">Door Face Only</label>
                            </div>

                            <div class="rw-button" tabindex="0">
                                <input type="radio" id="HARDWAREONLY" name="DOOROPT" value="HARDWAREONLY">
                                <label for="HARDWAREONLY">Hardware Only</label>
                            </div>

                            <div class="rw-button" tabindex="0">
                                <input type="radio" id="COMPLETEDOOR" name="DOOROPT" value="COMPLETEDOOR" checked>
                                <label for="COMPLETEDOOR">Complete Door</label>
                            </div>
                        </div>
                    </div>

                    <!-- Drill for Hinges  & End caps-->
                    <div class="dropdown-item" style="flex-direction:row;">
                        <div class="drill-container">
                            <h3>Drill for Hinges?</h3>
                            <div style="display:flex;justify-content: flex-start;">
                                <div class="combined-button-container">
                                    <div class="combined-button-container-inner">
                                        <div class="rw-sliding-button">
                                            <label for="DrillYes">YES</label>
                                            <input type="radio" style="display:none;" id="DrillYes" name="DRILL"
                                                value="Y" checked>
                                        </div>
                                        <div class="rw-sliding-button selected">
                                            <label for="DrillNo">NO</label>
                                            <input type="radio" style="display:none;" id="DrillNo" name="DRILL"
                                                value="N">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="end-cap-container">
                            <h3>Double End Caps</h3>
                            <div style="display:flex;justify-content: flex-start;">
                                <div class="combined-button-container">
                                    <div class="combined-button-container-inner">
                                        <div class="rw-sliding-button">
                                            <label for="EndCapsYes">YES</label>
                                            <input type="radio" style="display:none;" id="EndCapsYes" name="END_CAPS"
                                                value="Y">
                                        </div>
                                        <div class="rw-sliding-button selected">
                                            <label for="EndCapsYesNo">NO</label>
                                            <input type="radio" style="display:none;" id="EndCapsYesNo" name="END_CAPS"
                                                value="N" checked>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="dropdown-item" style="flex-direction:row">
                        <div class="drill-container">
                            <h3 for="EXTRA_TRUSS"> Extra Truss</h3>
                            <div style="display:flex;justify-content: flex-start;">
                                <div class="combined-button-container">
                                    <div class="combined-button-container-inner">
                                        <div class="rw-sliding-button">
                                            <label for="TRUSS_YES">YES</label>
                                            <input type="radio" style="display:none;" id="TRUSS_YES" name="EXTRA_TRUSS"
                                                value="Y">
                                        </div>
                                        <div class="rw-sliding-button selected">
                                            <label for="TRUSS_NO">NO</label>
                                            <input type="radio" style="display:none;" id="TRUSS_NO" name="EXTRA_TRUSS"
                                                value="N" checked>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="end-cap-container">
                            <h3 for="SHAFT_TYPE">Shaft Type</h3>
                            <div style="display:flex;justify-content: flex-start;">
                                <div class="combined-button-container">
                                    <div class="combined-button-container-inner">
                                        <div class="rw-sliding-button selected">
                                            <label for="TUBE_SHAFT">Tube Shaft</label>
                                            <input type="radio" style="display:none;" id="TUBE_SHAFT" name="SHAFT_TYPE"
                                                value="T" checked>
                                        </div>
                                        <div class="rw-sliding-button">
                                            <label for="KEYED_TUBE_SHAFT">Keyed Tube Shaft</label>
                                            <input type="radio" style="display:none;" id="KEYED_TUBE_SHAFT"
                                                name="SHAFT_TYPE" value="K">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- aNNOTATION SECTION-->
            <section face="false" hardware="true" enabled="true" id="ANNOTATIONS" data-title="Annotations"
                class="rw-configurator__page" data-icon="fas fa-info-square">
                <div class="config-title-style">Annotations</div>
                <h3 for="TAG" class="config-option-label-style">Tag</h3>
                <input type="text" name="TAG" id="TAG" />
                <h3 for="CONTRACTOR" class="config-option-label-style">Contractor</h3>
                <input type="text" name="CONTRACTOR" id="CONTRACTOR" />
                <h3 for="ARCHITECT" class="config-option-label-style">Architect</h3>
                <input type="text" name="ARCHITECT" id="ARCHITECT" />
                <h3 for="REFERENCE" class="config-option-label-style">Reference / Project #</h3>
                <input type="text" name="REFERENCE" id="REFERENCE" />
                <h3 for="CLIENT" class="config-option-label-style">Client</h3>
                <input type="text" name="CLIENT" id="CLIENT" />
            </section>

            <div class="footer-buttons-group">
                <div id="NEXT_PAGE_BUTTONS">

                    <button class="button-nextpage" onclick="formBackward()">
                        Back
                        <div class="chevron-outer-container">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path fill="currentColor"
                                    d="M168.9 342.6C156.4 330.1 156.4 309.8 168.9 297.3L360.9 105.3C373.4 92.8 393.7 92.8 406.2 105.3C418.7 117.8 418.7 138.1 406.2 150.6L236.8 320L406.1 489.4C418.6 501.9 418.6 522.2 406.1 534.7C393.6 547.2 373.3 547.2 360.8 534.7L168.8 342.7z" />
                            </svg>
                        </div>

                    </button>

                    <button type="button" name="nextPageBtn" class="button-configure" onclick="Configure()"
                        data-qa-selector="continue">Configure</button>

                    <button class="button-nextpage" onclick="formForward()">
                        Next
                        <div class="chevron-outer-container">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path fill="currentColor"
                                    d="M471.1 297.4C483.6 309.9 483.6 330.2 471.1 342.7L279.1 534.7C266.6 547.2 246.3 547.2 233.8 534.7C221.3 522.2 221.3 501.9 233.8 489.4L403.2 320L233.9 150.6C221.4 138.1 221.4 117.8 233.9 105.3C246.4 92.8 266.7 92.8 279.2 105.3L471.2 297.3z" />
                            </svg>
                        </div>
                    </button>
                </div>
                <div id="DEFAULTS_PLUGIN"></div>
            </div>
        </div>
    </div>
</div>
`
    return form;
}

function toggleAccordion() {
    //At least one input needs to be loaded in initially to get the title.
    $('#ROOT_0').hide()

    $('#accordion935516314').hide(); // hide load_html page
    $('#accordion991246024').hide(); //weight controller
    //Hides the outputs
    $('#accordion1406547076').hide()
    $("#accordion1094153584").hide()//Hides the global data for JDE
    $("#accordion9757245").hide() //section bundle
    $("#accordion321627220").hide() //Glazing code
    $("#accordion1892755284").hide() //Scheduling code
}

// Update data list selection and update positioning
function updateSelectedOperator(index) {
    updateCarouselPosition(index);
    updateActiveOperator(index);
    updatePaginationDots();
}

function populateCarousel() {


    if ($(".button-set.right").length > 0) {
        $(".button-set.right").hide();
    }

    const observerPosition = new MutationObserver((mutations, obs) => {

        const checkedWindowOption = $('.combined-button-container-inner input[type="radio"]:checked').val();

        if ($(".window-position-container").length > 0) {
            const $targetButton = $("#WINDOW_POSITION_3");
            const $targetWrapper = $targetButton.closest('.rw-button');
            const $windowsSelected = $("#WINDOWS_1");

            if (isHiddenPosition($targetWrapper) && $windowsSelected.prop("checked") && $targetButton.prop("checked")) {
                document.querySelector('label[for="WINDOW_POSITION_0"]').click();
            }
        }
    });

    observerPosition.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });


    // Observer for color changes
    const observer = new MutationObserver((mutations, obs) => {
        if ($(".color-button").length > 0) {
            obs.disconnect(); // stops the observer

            setupRadioSelectionTwoButtons("DRILL");
            setupRadioSelectionTwoButtons("END_CAPS");
            setupRadioSelectionTwoButtons("DOOROPT");
            setupRadioSelectionTwoButtons("SPRING_TYPE");
            setupRadioSelectionTwoButtons("EXTRA_TRUSS");
            setupRadioSelectionTwoButtons("SHAFT_TYPE");
            setupRadioSelectionTwoButtons("SPRING_CYCLE");
            setupRadioSelectionTwoButtons("INCLINEDTRACK");



            function updatedColorSelection() {
                $(".color-button-container").removeClass("selected");
                $(".door-color-text").removeClass("selected");
                const $selected = $("input[name='COLOR']:checked");
                $selected.closest(".color-button-container").addClass("selected");
                $selected.siblings(".door-color-text").addClass("selected");
            }

            updatedColorSelection();

            $("input[name='COLOR']").on("change", updatedColorSelection);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Carousel Data for Hardware
    const operatorData = {
        0: {
            id: "operator_none",
            name: "None",
            value: "PS",
            img: `${src_path}images/Operators_none.png`,
            maxDoorHeight: 1000,
            isHiLiftCompatible: true,
            style: "",
        },
        1: {
            id: "operator_jackshaft",
            name: "98022 - Jackshaft",
            value: "951-185",
            img: `${src_path}images/EW-LM-8500W.jpg`,
            maxDoorHeight: 168,
            isHiLiftCompatible: true,
            style: "",
        },
        2: {
            id: "6580L_Belt",
            name: "6580L - Belt",
            value: "OP_6580L_VALUE",
            img: `${src_path}images/6580L-(951-193)_E-Cat.png`,
            maxDoorHeight: 120,
            isHiLiftCompatible: false,
            style: "",
        },
        3: {
            id: "6590L_Belt",
            name: "6690L - Belt",
            value: "OP_6590L_VALUE",
            img: `${src_path}images/6690L-(951-194)_E-Cat.png`,
            maxDoorHeight: 120,
            isHiLiftCompatible: false,
            style: "",
        },
        4: {
            id: "2220L_Chain",
            name: "2220L - Chain",
            value: "OP_2220L_CHAIN_VALUE",
            img: `${src_path}images/2220L-(951-190)_E-Cat.png`,
            maxDoorHeight: 120,
            isHiLiftCompatible: false,
            style: "",
        },
        5: {
            id: "2420L_Chain",
            name: "2420L - Chain",
            value: "OP_2420L_CHAIN_VALUE",
            img: `${src_path}images/2420L-(951-191)_E-Cat.png`,
            maxDoorHeight: 120,
            isHiLiftCompatible: false,
            style: "",
        },
    };
    // Data and default start index
    operatorDataArray = Object.values(operatorData);


    // Creates the HTML for operator
    function createOperatorDiv(operator, activeStatus = false) {
        const operatorItem = document.createElement('div');
        operatorItem.classList.add('carousel-operator-item');

        if (activeStatus) {
            operatorItem.classList.add('active');
        }

        let retryCounter = 0;

        const image = document.createElement('img');
        image.src = operator.img;

        if (operator.img === "") {
            image.style.visibility = 'hidden';
        } else {
            image.onload = () => {
                image.style.visibility = 'visible';
            }

            image.onerror = () => {

                if (retryCounter < 5) {
                    retryCounter++;
                    setTimeout(() => {
                        image.src = operator.img + '?retry=' + Date.now();
                    }, 1000);
                } else {
                    image.style.visibility = 'hidden';
                }
            }
        }

        const operatorInnerDiv = document.createElement('div');
        operatorInnerDiv.classList.add('carousel-operator-image');
        operatorInnerDiv.appendChild(image);

        const operatorHeader = document.createElement('h3');
        operatorHeader.textContent = operator.name;


        operatorItem.appendChild(operatorInnerDiv);
        operatorItem.appendChild(operatorHeader);

        return operatorItem;
    }


    // Creates the carousel with the data (temporary needs changing for innf scrolling)
    function operatorCarouselLoad(indexCurrent) {
        const content = document.getElementById('operator-carousel-container');

        content.innerHTML = '';

        content.appendChild(createOperatorDiv(operatorDataArray[operatorDataArray.length - 1]));
        operatorDataArray.forEach((operator, index) => {
            const operatorItemList = createOperatorDiv(operator, index === indexCurrent);
            content.appendChild(operatorItemList);
        });
        //content.insertBefore(createOperatorDiv(operatorDataArray[operatorDataArray.length-1]), operatorDataArray[0]);
        content.appendChild(createOperatorDiv(operatorDataArray[0]));
    }


    function initOperatorCarousel() {

        const container = document.getElementById('operator-carousel-container');

        if (!container || container.dataset.loaded) return;

        console.log("✅ init operator carousel");

        operatorCarouselLoad(currentOperatorIndex);
        updateSelectedOperator(currentOperatorIndex);
        createOperatorPagination();

        container.dataset.loaded = "true";


        $('#nextButtonOperator')
            .off()
            .on('click', () => navigateOperator(1));

        $('#prevButtonOperator')
            .off()
            .on('click', () => navigateOperator(-1));


        // Infinite loop fix
        container.addEventListener('transitionend', () => {
            if (currentOperatorIndex > operatorDataArray.length) {
                return indexCorrectionList(container, 1);
            }

            if (currentOperatorIndex <= 0) {
                return indexCorrectionList(container, operatorDataArray.length);
            }
        });
    }



    // Move to the correct index for infinite loop
    function indexCorrectionList(container, index) {
        container.style.transition = 'none';
        currentOperatorIndex = index;
        updateSelectedOperator(currentOperatorIndex);

        requestAnimationFrame(() => {
            container.style.transition = 'transform 0.3s ease';
        });
    }

    function createOperatorPagination() {
        const pagination = document.querySelector('.operator-pagination');

        if (!pagination) return;

        pagination.innerHTML = '';

        operatorDataArray.forEach((_, index) => {
            const dot = document.createElement('button');

            dot.classList.add('operator-dot');
            dot.type = 'button';
            dot.dataset.index = index + 1; // because of cloned slide

            dot.addEventListener('click', () => {
                currentOperatorIndex = index + 1;

                updateCarouselPosition(currentOperatorIndex);
                updateActiveOperator(currentOperatorIndex);
                updatePaginationDots();
            });

            pagination.appendChild(dot);
        });

        updatePaginationDots();
    }




    // Helper function to check if parent child exists
    function isHiddenPosition($btn) {
        return $btn.length === 0 || $btn[0].offsetParent === null;
    }

    // Adding selector (temporary)
    function setupRadioSelectionTwoButtons(radioName) {
        function updateSelection() {
            // Remove selected from all containers of this group
            $(`input[name="${radioName}"]`).each(function () {
                $(this).closest(".rw-sliding-button").removeClass("selected");
            });

            // Add selected to the currently checked one
            const $selected = $(`input[name="${radioName}"]:checked`);
            $selected.closest(".rw-sliding-button").addClass("selected");
        }

        updateSelection();

        $(`input[name="${radioName}"]`).on("change", updateSelection);
    }

    // ✅ Load carousel when navigating pages
    $(document).on('click', '.button-nextpage, #NAVIGATION_SPC', function () {

        setTimeout(() => {

            if ($("#OPERATOR_OPTIONS").is(':visible')) {
                initOperatorCarousel();
            }

        }, 100);
    });

}


function updatePaginationDots() {
    const dots = document.querySelectorAll('.operator-dot');

    let activeIndex = currentOperatorIndex - 1;

    if (activeIndex < 0) {
        activeIndex = operatorDataArray.length - 1;
    }

    if (activeIndex >= operatorDataArray.length) {
        activeIndex = 0;
    }

    dots.forEach((dot, index) => {
        dot.classList.toggle('operator-dot-active', index === activeIndex);
    });
}


function navigateOperator(direction) {

    currentOperatorIndex += direction;

    const container = document.getElementById('operator-carousel-container');

    updateCarouselPosition(currentOperatorIndex);
    updateActiveOperator(currentOperatorIndex);
    updatePaginationDots();

    if (container) {
        container.style.transform =
            `translateX(-${currentOperatorIndex * 100}%)`;
    }
}

function syncOperatorState(operator) {

    $("#OPERATOR").val(operator.value);
    setState("OPERATOR", operator.value);


    if (nodeset["OPERATOR"]) {
        nodeset["OPERATOR"].value = operator.value;
    }

    if (typeof rw === "function") {
        rw(getNode("OPERATOR"));
    }

    $("#OPERATOR")
        .attr("data-max-door-height", operator.maxDoorHeight)
        .attr("data-is-hi-lift-compatible", operator.isHiLiftCompatible);
}

function updateActiveOperator(index) {
    console.log("Carousel index:", index);
    const items = document.querySelectorAll('.carousel-operator-item');


    items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    // Due to clones we need to move the index so it it not out of bounds
    let dataIndex = index - 1;


    if (dataIndex < 0) {
        dataIndex = operatorDataArray.length - 1;
    } else if (dataIndex >= operatorDataArray.length) {
        dataIndex = 0;
    }

    const currentOperator = operatorDataArray[dataIndex];
    syncOperatorState(currentOperator);

}

function updateCarouselPosition(index) {
    const carousel = document.getElementById('operator-carousel-container');
    carousel.style.transform = `translateX(-${index * 100}%)`;
}

function applyDefaults() {

}


function loadUI() {
    let serial = $("#header-serial_number").clone()
        .children("label").remove().end()
        .text().trim();

    // Insert the serial number
    $("#SERIAL_CONTAINER").append(`<h3>Serial Number: ${serial}</h3>`);

    //hide the header that coming from the revalize
    $("#ui-info").hide();

    //hide the footer buttons
    $(".bottom-buttons").hide();

    appendAvailableColorsTo("#AvaialbleColorsSection");
    appendAvailableColorsTo("#AvailableFrameColorsSection");
    appendOptionalColors();
    appendOverlappingColors();
    toggleStackColors();

    // 🔥 WAIT FOR DOM TO BE READY
    requestAnimationFrame(() => {
        selectFirstColor($("#AvaialbleColorsSection .colorContainer"));
    });

    clickHandler();
    // toogleSpringCycle();  
    loadGlazingUI();
};


function clickHandler() {

    appendDrpData();
    toggleHandler();


    $("input[type='radio']")
        .not("input[name='AVAILABLE_COLOR'], input[name='OPTIONAL_COLOR']")
        .on("click", function (e) {

            const group = e.target.name;

            // Remove active class + unchecked
            $(`input[name='${group}']`).each((i, radio) => {
                $(radio).prop("checked", false).removeAttr("checked");
                $(radio).parent().removeClass("btn-checked");
            });

            // Check this radio
            $(this).prop("checked", true);
            // Add class to selected
            $(this).parent().addClass("btn-checked");
        });

    $("input[type='radio'].rw-button-toggle")
        .off()
        .on("click", function (e) {
            const group = e.target.name;
            const checked = $(this).data('wasChecked');

            // Remove active class + unchecked
            $(`input[name='${group}']`)
                .prop("checked", false)
                .removeAttr("checked")
                .data('wasChecked', false)
                .parent().removeClass("btn-checked");

            $(this)
                .prop("checked", !checked)
                .data("wasChecked", !checked)
                .parent().toggleClass("btn-checked", !checked);
            if (checked) {
                rw(getNode(group));
            }
        });

    // Initial check styling
    $("input[type='radio']:checked")
        .not("input[name='AVAILABLE_COLOR'], input[name='OPTIONAL_COLOR']")
        .each(function () {
            $(this).parent().addClass("btn-checked");
        });

    // PANEL STYLE CHANGE
    $(document)
        .off("click.togglePanelStyle")
        .on("click.togglePanelStyle", "input[name='FACE']", function () {

            const panel_style = this.value;

            appendOptionalColors(panel_style);

            // re-select first color after render
            requestAnimationFrame(() => {
                selectFirstColor($("#OptionalColorsSection .colorContainer"));
                rw(getNode("COLOR"))
            });
        });

    $(document)
        .off("click.colorSelect")
        .on("click.colorSelect", `div[data-id="COLOR"] .color-button-container`, function () {
            const $container = $(this).closest(".colorContainer");
            $container.find(".color-button-container").removeClass("selected");
            $(this).addClass("selected");
            $container.find("input[name='COLOR']").prop("checked", false);
            $(this).find("input[name='COLOR']").prop("checked", true).trigger("change");

            const color = $(this).find("input[name='COLOR']").val();
            //setState && setState("COLOR", color);

            frameColorUserOverride = false;
            insertColorUserOverride = false;

            rw(getNode("COLOR"));
            rw(getNode("FRAME_COLOR"));
            rw(getNode("INSERT_COLOR"));

            // ── Sync selected class to new door color ──
            requestAnimationFrame(() => {
                [
                    $("#AvailableFrameColorsSection .colorContainer"),
                    $("#OptionalFrameColorsSection .colorContainer"),
                    $("#AvailableInsertColorsSection .colorContainer"),
                    $("#OptionalInsertColorsSection .colorContainer")
                ].forEach($c => {
                    $c.find(".color-button-container").removeClass("selected");
                    $c.find("input[type='radio']").prop("checked", false);

                    const $match = $c.find(`input[type='radio'][value="${color}"]`)
                        .closest(".color-button-container");

                    if ($match.length) {
                        $match.addClass("selected");
                        $match.find("input[type='radio']").prop("checked", true);
                    }
                });
            });
        });


    // FRAME color — user explicitly picked, set override
    $('#FRAME_COLOR').on('click', '.color-button-container', function () {
        const color = $(this).find(`input[type='radio']`).val();

        const color_info = [
            ...AvailableColorImages,
            ...OptionalColorImages,
            SilverColor
        ].find(c => c.value == color);
        if (!color_info) return;

        frameColorUserOverride = true;
        setState("FRAME_COLOR", color_info);
    });

    // INSERT color — user explicitly picked, set override
    $('#INSERT_COLOR').on('click', '.color-button-container', function () {
        const color = $(this).find(`input[type='radio']`).val();
        const color_info = [...AvailableColorImages, ...OptionalColorImages]
            .find(c => c.value == color);
        if (!color_info) return;

        insertColorUserOverride = true;
        setState("INSERT_COLOR", color_info);
    });

    // DOOR OPTION
    $(document)
        .off("click.doorOpt")
        .on("click.doorOpt", ".rw-sliding-button", function () {
            door_option = $(this).find('input[name="DOOROPT"]').val();
        });


    // SPRING TYPE
    $(document)
        .off("click.SPRING_TYPE")
        .on("click.SPRING_TYPE", ".rw-sliding-button", function (e) {

            const name = e.target.name;

            $(`input[name="${name}"]`).each(function () {
                $(this).closest(".rw-sliding-button").removeClass("selected");
            });

            const $selected = $(`input[name="${name}"]:checked`);
            $selected.closest(".rw-sliding-button").addClass("selected");
        });


    //select and deselect the glass inputs on glazing tab
    $('input[name="GLASS_SHAPE"]').on('click', function () {

        if ($(this).data('checked')) {
            $(this).prop('checked', false);
            $(this).data('checked', false);
            $(this).parent().removeClass("btn-checked");
            setState("GLASS_SHAPE", '');
        } else {
            $('input[name="GLASS_SHAPE"]').data('checked', false);
            $(this).data('checked', true);
            $(this).prop('checked', true);
            $(this).parent().addClass("btn-checked");
            setState("GLASS_SHAPE", $(this).val());
        }
    });

    // Glass type
    $(document).on("change", "input[name='GLASS_SHAPE']", function () {
        const glassShape = $("input[name='GLASS_SHAPE']:checked").val() || "";
        const currentGlassType = getState("GLASS_TYPE") || "";
        // if no shape, do nothing for now
        if (!glassShape) {
            return;
        }

        // only default if nothing is selected yet
        if (!currentGlassType) {
            setTimeout(() => {
                const latestGlassType = getState("GLASS_TYPE") || "";

                if (!latestGlassType) {
                    const clearLabel = document.querySelector("label[for='CLEAR']");
                    if (clearLabel) {
                        clearLabel.click();
                    }
                }
            }, 0);
        }
    });


    //select and deselect the hardware set inputs on hardware tab
    // Initialize currently checked item
    $('input[name="HARDWARE_SET"]:checked')
        .data('checked', true)
        .closest('.rw-button')
        .addClass('btn-checked');

    $('input[name="HARDWARE_SET"]')
        .off('click.hardwareSet')
        .on('click.hardwareSet', function (e) {

            const wasChecked = $(this).data('checked') === true;

            e.preventDefault();

            if (wasChecked) {

                // Deselect current selection
                $(this)
                    .prop('checked', false)
                    .removeAttr('checked')
                    .data('checked', false);

                $(this)
                    .closest('.rw-button')
                    .removeClass('btn-checked');

                setState("HARDWARE_SET", '');

                // hide commercial-only UI if needed
                $(".inclined-track").hide();

            } else {

                // Clear all others
                $('input[name="HARDWARE_SET"]')
                    .prop('checked', false)
                    .removeAttr('checked')
                    .data('checked', false)
                    .closest('.rw-button')
                    .removeClass('btn-checked');

                // Select clicked one
                $(this)
                    .prop('checked', true)
                    .attr('checked', 'checked')
                    .data('checked', true);

                $(this)
                    .closest('.rw-button')
                    .addClass('btn-checked');

                setState("HARDWARE_SET", $(this).val());

                // Commercial logic
                if ($(this).val() === "C") {
                    $(".inclined-track").show();
                } else {
                    $(".inclined-track").hide();
                }
            }
        });

}

function selectFirstColor($container) {

    const $items = $container.find(".color-button-container");

    if (!$items.length) return;

    // clear UI selection in THIS container only
    $items.removeClass("selected");

    const $first = $items.first().addClass("selected");

    const $radio = $first.find("input[type='radio']");

    const name = $radio.attr("name");

    // uncheck ONLY this group
    $container
        .find(`input[type='radio'][name='${name}']`)
        .prop("checked", false);

    // check first
    $radio.prop("checked", true).trigger("change");


}


function appendOverlappingColors() {
    const $optionalfieldset = $("#optionalStackColors"); // target the colorsFieldset
    const $availablefieldset = $("#availableStackColors");

    if (!$optionalfieldset.length) {
        return;
    }

    if (!$availablefieldset.length) {
        return;
    }

    // Use only the first 3 images
    const optionalimagesToShow = OptionalColorImages.slice(0, 3);
    const AvailableimagesToShow = AvailableColorImages.slice(0, 3);


    // Clear existing content
    $optionalfieldset.empty();
    $availablefieldset.empty();

    // Append each image
    optionalimagesToShow.forEach((imgSrc, index) => {
        const html = `<img src="${src_path + imgSrc.url}" class="stacked-optional-img" />`;
        $optionalfieldset.append(html);
    });

    AvailableimagesToShow.forEach((imgSrc, index) => {
        const html = `<img src="${src_path + imgSrc.url}" class="stacked-optional-img" />`;
        $availablefieldset.append(html);
    });
}

function appendAvailableColorsTo(containerSelector) {
    const $container = $(containerSelector + " .colorContainer");
    $container.empty();

    AvailableColorImages.forEach((imgSrc) => {
        const html = `
      <div class="color-button-container">
        <div class="color-button color-tooltip" data-tooltip="${imgSrc.colorName}">
          <img src="${src_path + imgSrc.url}" class="color-image" />
          <input
            type="radio"
            name="COLOR"
            value="${imgSrc.value}"
            hex="${imgSrc.hex}"
            desc="${imgSrc.desc}"
            colorName="${imgSrc.colorName}"
            style="display:none"
          />
        </div>
      </div>
    `;

        $container.append(html);
    });

    registerColorEvents();
}


function appendColorsTo(containerSelector, colorArray, panel_style = null) {

    const $container = $(containerSelector + " .colorContainer");
    $container.empty();

    let filteredColors = colorArray;

    // Apply panel style filtering only if panel_style is provided
    if (panel_style) {
        filteredColors = colorArray
            .filter(item => {
                // Remove 2 specific colors for F or T
                if (
                    (panel_style === "F" || panel_style === "T") &&
                    ["Cocoa Hickory", "Honey Cedar"].includes(item.colorName)
                ) {
                    return false;
                }

                // Remove restricted colors
                if (
                    (panel_style === "F" || panel_style === "T") &&
                    item.restricted
                ) {
                    return false;
                }

                return true;
            });
    }

    filteredColors.forEach(imgSrc => {
        const html = `
      <div class="color-button-container">
        <div class="color-button color-tooltip" data-tooltip="${imgSrc.colorName}">
          <img src="${src_path + imgSrc.url}" class="color-image" />
          <input
            type="radio"
            name="COLOR"
            value="${imgSrc.value}"
            hex="${imgSrc.hex}"
            desc="${imgSrc.desc}"
            colorName="${imgSrc.colorName}"
            style="display:none"
          />
        </div>
      </div>
    `;

        $container.append(html);
    });

    registerColorEvents();
    // 🔥 IMPORTANT FIX: re-select AFTER filtering
    // requestAnimationFrame(() => {
    //     selectFirstColor($container);
    // });
}

function appendOptionalColors(panel_style) {
    appendColorsTo("#OptionalColorsSection", OptionalColorImages, panel_style);
}

// function registerColorEvents() {
//     $(document).on("click", ".color-button-container", function () {
//         const $container = $(this).closest(".colorContainer");

//         // ── Scope to THIS container only, not all color buttons globally ──
//         $container.find(".color-button-container").removeClass("selected");
//         $(this).addClass("selected");

//         const inputName = $(this).find("input[type='radio']").attr("name");

//         $container.find(`input[type='radio'][name='${inputName}']`).prop("checked", false);
//         $(this).find(`input[type='radio']`).prop("checked", true).trigger("change");
//     });
// }

function registerColorEvents() {
    $(document)
        .off("click.genericColorButtons")
        .on("click.genericColorButtons", ".color-button-container", function () {

            // Door color is handled by click.colorSelect only.
            if ($(this).closest("div[data-id='COLOR']").length) {
                return;
            }

            const $container = $(this).closest(".colorContainer");

            $container.find(".color-button-container").removeClass("selected");
            $(this).addClass("selected");

            const inputName = $(this).find("input[type='radio']").attr("name");

            $container
                .find(`input[type='radio'][name='${inputName}']`)
                .prop("checked", false);

            $(this)
                .find("input[type='radio']")
                .prop("checked", true)
                .trigger("change");
        });
}


function animateTransition() {
    // Force browser reflow so transitions actually animate
    document.body.offsetHeight;
}

function toggleStackColors() {
    //function to hide stack image
    //stack images means the 3 overlap color img design
    const hideStack = ($fs) => {
        $fs.closest(".stack-wrapper").addClass("colorContainerInactive");
    };

    //function to show stack images
    const showStack = ($fs) => {
        $fs.closest(".stack-wrapper").removeClass("colorContainerInactive");
        $fs.addClass("slide-in");

        setTimeout(() => {
            $fs.removeClass("slide-in");
        }, 500);

    };

    //function to show active or optional colors - not the stack colors
    const showContainer = ($c) => {
        $c.removeClass("colorContainerInactive");
        // Add slide-in effect
        $c.addClass("slide-in");

        setTimeout(() => {
            $c.removeClass("slide-in");
        }, 500);
    };

    //const showContainer = ($c) => $c.removeClass("colorContainerInactive");
    const hideContainer = ($c) => $c.addClass("colorContainerInactive");


    $("#optionalStackColors").on("click", function () {
        setTimeout(animateTransition, 20);

        showContainer($("#OptionalColorsSection .colorContainer"));
        showStack($("#availableStackColors"));

        hideStack($("#optionalStackColors"));
        hideContainer($("#AvaialbleColorsSection .colorContainer"));


        // const $optional = $("#OptionalColorsSection .colorContainer");
        // selectFirstColor($optional);

        // rw(getNode("COLOR"))
    });

    $("#optionalStackFrameColors").on("click", function () {
        setTimeout(animateTransition, 20);
        hideStack($("#optionalStackFrameColors"));
        showContainer($("#OptionalFrameColorsSection .colorContainer"));
        hideContainer($("#AvailableFrameColorsSection .colorContainer"));
        showStack($("#availableStackFrameColors"));
        registerColorEvents();
        // rw(getNode("COLOR"))
    });

    $("#optionalStackInsertColors").on("click", function () {
        setTimeout(animateTransition, 20);
        hideStack($("#optionalStackInsertColors"));
        showContainer($("#OptionalInsertColorsSection .colorContainer"));
        hideContainer($("#AvailableInsertColorsSection .colorContainer"));
        showStack($("#availableStackInsertColors"));
        registerColorEvents();
        // rw(getNode("COLOR"))
    });



    $("#availableStackColors").on("click", function () {

        setTimeout(animateTransition, 20);

        showContainer($("#AvaialbleColorsSection .colorContainer"));
        showStack($("#optionalStackColors"));

        hideStack($("#availableStackColors"));
        hideContainer($("#OptionalColorsSection .colorContainer"));

        //selectFirstColor($("#AvaialbleColorsSection .colorContainer"));
        //unselectFirstColor($("#OptionalColorsSection .colorContainer"));

        // const $available = $("#AvaialbleColorsSection .colorContainer");
        // selectFirstColor($available);

        // // registerColorEvents();
        // rw(getNode("COLOR"))

    });

    $("#availableStackFrameColors").on("click", function () {

        setTimeout(animateTransition, 20);
        hideStack($("#availableStackFrameColors"));
        showContainer($("#AvailableFrameColorsSection .colorContainer"));
        hideContainer($("#OptionalFrameColorsSection .colorContainer"));
        showStack($("#optionalStackFrameColors"));
        registerColorEvents();
        // rw(getNode("COLOR"))

    });

    $("#availableStackInsertColors").on("click", function () {
        setTimeout(animateTransition, 20);
        hideStack($("#availableStackInsertColors"));
        showContainer($("#AvailableInsertColorsSection .colorContainer"));
        hideContainer($("#OptionalInsertColorsSection .colorContainer"));
        showStack($("#optionalStackInsertColors"));
        registerColorEvents();
        // rw(getNode("COLOR"))

    });
}

function generateOptions(start, end) {
    let options = '';
    for (let i = start; i <= end; i++) {
        options += `<option value="${i}">${i}</option>`;
    }
    return options;
}

function generateOptionsFromArray(arr) {
    return arr.map(val => `<option value="${val}">${val}</option>`).join('');
}

function updateDoorWidthInches(feet) {
    const select = document.getElementById("DOOR_WIDTH_INCHES");
    if (!select) return;

    let minInches = 0;
    let maxInches = 11;

    if (feet === 4) {
        minInches = 2;
        maxInches = 11;
    } else if (feet === 20) {
        minInches = 0;
        maxInches = 2;
    }

    // Clear old options
    select.options.length = 0;

    // Add new options
    for (let i = minInches; i <= maxInches; i++) {
        select.add(new Option(String(i), String(i)));
    }

    // IMPORTANT:
    // Set selected index after DOM finishes updating options
    setTimeout(() => {
        if (select.options.length > 0) {
            select.selectedIndex = 0;
            select.options[0].selected = true;
            select.value = select.options[0].value;
        }

        // console.log("updateDoorWidthInches =>", {
        //     feet,
        //     value: select.value,
        //     selectedIndex: select.selectedIndex
        // });

    }, 0);
}

function appendDrpData() {

    // Populate Door Width Feet (4–20)
    $("#DOOR_WIDTH_FEET").html(generateOptions(4, 20));
    $("#DOOR_WIDTH_FEET").val("16");

    // Populate initial Door Width Inches based on default width feet
    updateDoorWidthInches(16);

    // Prevent duplicate bindings, then bind width feet change
    $("#DOOR_WIDTH_FEET")
        .off("change.doorWidth")
        .on("change.doorWidth", function () {
            const feet = parseInt($(this).val(), 10);
            updateDoorWidthInches(feet);
        });

    // Populate Door Height Feet (6–14)
    $("#DOOR_HEIGHT_FEET").html(generateOptions(6, 14));
    $("#DOOR_HEIGHT_FEET").val("7");

    refreshHeightInches(7);

    $("#DOOR_HEIGHT_FEET")
        .off("change.doorHeight")
        .on("change.doorHeight", function () {
            const feet = parseInt($(this).val(), 10);
            refreshHeightInches(feet);
        });
}


function refreshHeightInches(feet) {
    let select = document.getElementById("DOOR_HEIGHT_INCHES");
    if (!select) return;

    const inches = (feet === 14) ? [0] : [0, 3, 6, 9];

    // Save current selected value before rebuilding
    const previousValue = select.value;

    // Clear old options
    select.options.length = 0;

    // Add new options
    inches.forEach(val => {
        select.add(new Option(String(val), String(val)));
    });

    setTimeout(() => {
        if (!select.options.length) return;

        // Preserve previous value if still valid
        if (inches.map(String).includes(String(previousValue))) {
            select.value = String(previousValue);
        } else {
            // Otherwise reset to first option
            select.selectedIndex = 0;
            select.options[0].selected = true;
            select.value = select.options[0].value;
        }

        // console.log("refreshHeightInches =>", {
        //     feet,
        //     previousValue,
        //     value: select.value,
        //     selectedIndex: select.selectedIndex
        // });
    }, 0);
}

function toggleHandler() {

    //custom dimension switch toggle handler
    $('#customSwitch').off("change").on("change", function () {

        if ($(this).is(':checked')) {
            toggle_Switch = 1;
            $("#customSwitch").val("on");
            $('.custom-dimension-container').slideDown();
            // $('#DOOR_HEIGHT_FEET', '#DOOR_HEIGHT_INCHES', '#DOOR_WIDTH_FEET', '#DOOR_WIDTH_INCHES').prop('selectedIndex', 0).trigger('change');
            let width = getState("DOOR_WIDTH_FEET");
            let height = getState("DOOR_HEIGHT_FEET");

            // Rebuild inches dropdowns
            updateDoorWidthInches(width);
            refreshHeightInches(height);


            $(`input[name='SIZE']`).each((i, radio) => {
                $(radio).prop("checked", false).removeAttr("checked");
                $(radio).parent().removeClass("btn-checked");
                $('#DIMENSION').slideUp();

            });

            getCounterVal(toggle_Switch);

            const waitForWidth = setInterval(() => {
                const width = getState("SIZE_WIDTH");
                const height = getState("SIZE_HEIGHT");


                if (width !== undefined && width !== null) {
                    clearInterval(waitForWidth);

                    setState("DOOR_WIDTH_FEET", width);
                }

                if (height !== undefined && height !== null) {
                    clearInterval(waitForWidth);

                    setState("DOOR_HEIGHT_FEET", height);
                }
            }, 50);


        } else {
            $('.custom-dimension-container').slideUp();
            $('#DIMENSION').slideDown();

            $("#DIMENSIONS_2").parent().addClass("btn-checked");
            $("#DIMENSIONS_2").prop("checked", true).trigger("change");
            setState("SIZE", $("#DIMENSIONS_2").val());
            $("#customSwitch").val("off");

            toggle_Switch = 0;
            getCounterVal(toggle_Switch);
        }
    });


    // more panel style toggle switch
    $('#customPanelSwitch').change(function () {

        if ($(this).is(':checked')) {
            $("#customSwitch").val("on");
            $(".custom-panel-item-container").slideDown();

        } else {
            $("#customPanelSwitch").val("off");
            $(".custom-panel-item-container").slideUp();

            $(`input[name='FACE']`).each((i, radio) => {
                $(radio).prop("checked", false).removeAttr("checked");
                $(radio).parent().removeClass("btn-checked");
            });

            $("#FLUSH").parent().addClass("btn-checked");
            $("#FLUSH").prop("checked", true);
            setState("FACE", "F");
        }
    })


    // Inclined track toggle
    $("input[name='HARDWARE_SET']").on("change", function () {
        if ($(this).val() === "C") {
            $(".inclined-track").show();
        } else {
            $(".inclined-track").hide();
        }
    });

}


function getCounterVal(toggle_Switch) {
    return toggle_Switch;
}


function increaseValue(button, limit) {
    const $num = $(button).closest('.quantity-field').find('.number');
    let value = parseInt($num.text(), 10);

    if (isNaN(value)) value = 0;
    if (limit && value >= limit) return;

    const nextValue = value + 1;
    $num.text(nextValue);
    syncQuantityNode($num, nextValue);
}

function decreaseValue(button) {
    const $num = $(button).closest('.quantity-field').find('.number');
    let value = parseInt($num.text(), 10);

    if (isNaN(value)) value = 0;
    if (value < 1) return;

    const nextValue = value - 1;
    $num.text(nextValue);
    syncQuantityNode($num, nextValue);
}

function syncQuantityNode($num, value) {
    const id = $num.attr('id');

    if (id && typeof setState === 'function' && nodeset[id]) {
        setState(id, value);
    }
}


function isFormValid() {
    if (!(!!getState("SPRING_SOLUTION") && getState("WEIGHT") < 750))
        return false;
    return !Object.values(nodeset).map(node => node.value).includes("ERROR")

}

function additionalSaves(json) {

}

function loadGlazingUI() {
    // $('#more_glass_shapes').change(function () {
    //   if ($(this).is(':checked')) {
    //     $("#more_glass_shapes_container").slideDown();
    //   } else {
    //     $("#more_glass_shapes_container").slideUp();
    //   }
    // });

    $('input[name="GLASS_SHAPE"]').prop('checked', false).data('checked', false);
    $('input[name="GLASS_TYPE"]').prop('checked', false).data('checked', false);

    $('#more_glass_types').change(function () {
        console.log("more_glass_types_container", $(this).is(':checked'));
        if ($(this).is(':checked')) {
            $("#more_glass_types_container").slideDown();
        } else {
            $("#more_glass_types_container").slideUp();
        }
    });

    $('#more_glass_inserts').change(function () {
        if ($(this).is(':checked')) {
            $("#more_glass_inserts_container").slideDown();
        } else {
            $("#more_glass_inserts_container").slideUp();
        }
    });

    const $frameColors = $("#AvailableFrameColorsSection .colorContainer").empty();
    const $insertColors = $("#AvailableInsertColorsSection .colorContainer").empty();

    function generateColorHTML(imgSrc, index, inputName) {
        const isSelected = index === 0;
        return `
        <div class="color-button-container ${isSelected ? "selected" : ""}">
            <div class="color-button color-tooltip" data-tooltip="${imgSrc.colorName}">
                <img
                    src="${src_path + imgSrc.url}"
                    alt="${imgSrc.colorName}"
                    class="color-image"
                />
                <input
                    type="radio"
                    name="${inputName}"
                    value="${imgSrc.value}"
                    ${isSelected ? "checked" : ""}
                    hex="${imgSrc.hex}"
                    desc="${imgSrc.desc}"
                    colorName="${imgSrc.colorName}"
                    style="display:none"
                />
            </div>
        </div>
    `;
    }

    const frameColorsList = [
        ...AvailableColorImages,
        SilverColor
    ];

    frameColorsList.forEach((imgSrc, index) => {
        $frameColors.append(generateColorHTML(imgSrc, index, "FRAME_COLOR"));
    });

    AvailableColorImages.forEach((imgSrc, index) => {
        // $frameColors.append(generateColorHTML(imgSrc, index, "FRAME_COLOR"));
        $insertColors.append(generateColorHTML(imgSrc, index, "INSERT_COLOR"));
    });

    const $optFrameColors = $("#OptionalFrameColorsSection .colorContainer").empty();
    const $optInsertColors = $("#OptionalInsertColorsSection .colorContainer").empty();

    OptionalColorImages.forEach((imgSrc, index) => {
        $optFrameColors.append(generateColorHTML(imgSrc, index, "FRAME_COLOR"));
        $optInsertColors.append(generateColorHTML(imgSrc, index, "INSERT_COLOR"));
    });

    const $optionalfieldset_frame = $("#optionalStackFrameColors").empty();
    const $availablefieldset_frame = $("#availableStackFrameColors").empty();
    const $optionalfieldset_insert = $("#optionalStackInsertColors").empty();
    const $availablefieldset_insert = $("#availableStackInsertColors").empty();

    OptionalColorImages.slice(0, 3).forEach((imgSrc) => {
        const html = `<img src="${src_path + imgSrc.url}" class="stacked-optional-img" />`;
        $optionalfieldset_frame.append(html);
        $optionalfieldset_insert.append(html);
    });

    AvailableColorImages.slice(0, 3).forEach((imgSrc) => {
        const html = `<img src="${src_path + imgSrc.url}" class="stacked-optional-img" />`;
        $availablefieldset_frame.append(html);
        $availablefieldset_insert.append(html);
    });

    // ── Sync frame & insert UI selection to door color on load ──
    requestAnimationFrame(() => {
        const doorValue = getNode("COLOR")?.value?.value;
        if (doorValue) {
            [
                $("#AvailableFrameColorsSection .colorContainer"),
                $("#OptionalFrameColorsSection .colorContainer"),
                $("#AvailableInsertColorsSection .colorContainer"),
                $("#OptionalInsertColorsSection .colorContainer")
            ].forEach($c => {
                $c.find(".color-button-container").removeClass("selected");
                $c.find("input[type='radio']").prop("checked", false);

                const $match = $c.find(`input[type='radio'][value="${doorValue}"]`)
                    .closest(".color-button-container");

                if ($match.length) {
                    $match.addClass("selected");
                    $match.find("input[type='radio']").prop("checked", true);
                }
            });
        }
    });

    $("#NAVIGATION_SPC").on('click', function (event) {
        if (currentSection == 1) {
            $("#window_position_container").show();
            const glass_shape = getState("GLASS_SHAPE") ?? "";
            if (glass_shape.includes("slim")) {
                $(`[data-id="section_slim_temp"]`).show();
            }
            addSlimUi();

            const state = getState("WINDOW_STATE");
            state.hints = true;
            setState("WINDOW_STATE", state);
        } else {
            $("#window_position_container").hide();
            $(`[data-id="section_slim_temp"]`).remove();
            $(`#slim_spacing_container`).remove();

            const state = getState("WINDOW_STATE");
            state.hints = false;
            setState("WINDOW_STATE", state);
        }
    });
}


function calculatePrice() {
    let DOOR_FACE_PRICE = $("#DOOR_FACE_PRICE").val();
    let GLAZING_PRICE = $("#GLAZING_PRICE").val();
    let OPERATORS_PRICE = $("#OPERATORS_PRICE").val();
    let HARDWARE_PRICE = $("#HARDWARE_PRICE").val();


    let totalPrice = DOOR_FACE_PRICE + GLAZING_PRICE + OPERATORS_PRICE + HARDWARE_PRICE;

    $("#TOTAL_PRICE").val(totalPrice)
    //setState("TOTAL_PRICE", totalPrice);



}