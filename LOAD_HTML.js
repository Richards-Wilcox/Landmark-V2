const AvailableColorImages = [
  { url: "images/White_2.jpg", value: "W", colorName: "White", hex: "#fdf6ee", desc: "Wht" },
  { url: "images/Black_2.jpg", value: "K", colorName: "Black", hex: "#211f1e", desc: "Blk" },
  { url: "images/Iron Ore_2.jpg", value: "V", colorName: "Iron Ore", hex: "#313532", desc: "Ore" },
  { url: "images/Cafe_2.jpg", value: "F", colorName: "Cafe", hex: "#3b3831", desc: "Cafe" },
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

const src_path = "/HTML/products/210005530/";

let toggle_Switch = 0;
let door_height = "";
let panel_style = "";
let door_model = "";
let door_color = "";

// Woodtones colors (X, Y)
const woodTones = ["X", "Y"];

function loadForm() {
  const form = `
	<script src="/HTML/products/162059085/jscripts/panelConfigurations.js"></script>

	<div id="configurator">
    <div class="rw-configurator__layout">
        <div class="rw-configurator__layout--left">
            <div id="NAVIGATION_SPC"></div>

		   <div class="postion-container" style="display:none;" id="window_position_container">
			   <div style="text-align: center; padding-bottom: 5px;" class="config-option-title-style">Window Position</div>
			   <div class="window-position-container">
				 <div class="rw-button">
				   <label for="WINDOW_POSITION_TOP">Top</label>
				   <input type="radio" class="rw-button-toggle" style="display:none;" id="WINDOW_POSITION_TOP"  name="WINDOW_POSITION" desc="Top" value="top" code="top" >
				 </div>
				 <div class="rw-button">
				   <label for="WINDOW_POSITION_LEFT">Left</label>
				   <input type="radio" class="rw-button-toggle" style="display:none;" id="WINDOW_POSITION_LEFT"  name="WINDOW_POSITION" desc="Left" value="left" code="left" >
				 </div>
				 <div class="rw-button">
				   <label for="WINDOW_POSITION_CENTER">Center</label>
				   <input type="radio" class="rw-button-toggle" style="display:none;" id="WINDOW_POSITION_CENTER" name="WINDOW_POSITION" desc="Center" value="center" code="right">
				 </div>
				 <div class="rw-button">
				   <label for="WINDOW_POSITION_RIGHT">Right</label>
				   <input type="radio" class="rw-button-toggle" style="display:none;" id="WINDOW_POSITION_RIGHT"  name="WINDOW_POSITION" desc="Right" value="right" code="center" >
				 </div>
				 <div class="rw-button">
				   <label for="WINDOW_POSITION_BOTH">Both</label>
				   <input type="radio" class="rw-button-toggle" style="display:none;" id="WINDOW_POSITION_BOTH"  name="WINDOW_POSITION" desc="Both" code="both" value="both" >
				 </div>
			   </div>
		   </div>

            <div id="CANVAS_PLUGIN" style="display:flex;justify-content:center;">

            </div>
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
	   ">00.00
                    </span>
                </div>
            </div>

            <!-- DOOR MODEL SECTION STARTS -->

            <section id="DIMENSIONS" data-title="Door Model" class="rw-configurator__page" enabled="true"
                face="true" hardware="true">
                <div class="dropdown-container">
                    <!-- door model element -->
                    <div class="dropdown-item">
                        <h3>Door Model</h3>
                        <div class="dimension-layout">
                            <div class="rw-button">
                                <input type="radio" id="L138" name="DOOR_MODEL" value="A" desc="Cls" checked>
                                <label for="L138">Classic L138</label>
                            </div>

                            <div class="rw-button">
                                <input type="radio" id="L200" name="DOOR_MODEL" value="D" desc="Prem">
                                <label for="L200">Premium L200</label>
                            </div>
                        </div>
                    </div>

                    <!-- <div style="text-align:left" class="config-option-title-style">Dimensions</div> -->
                    <div class="dropdown-item" id="DIMENSION">
                        <h3> Door Size (4 Sections) </h3>
                        <div class="dimension-layout">
                            <div class="rw-button">
                                <label for="DIMENSIONS_0">8x7</label>
                                <input type="radio" id="DIMENSIONS_0" name="SIZE" value="0" width="8" height="7">
                            </div>
                            <div class="rw-button">
                                <label for="DIMENSIONS_1">9x7</label>
                                <input type="radio" id="DIMENSIONS_1" name="SIZE" value="1" width="9" height="7">
                            </div>
                            <div class="rw-button">
                                <label for="DIMENSIONS_2">16x7</label>
                                <input type="radio" id="DIMENSIONS_2" name="SIZE" value="2" width="16" height="7"
                                    checked>
                            </div>
                            <div class="rw-button">
                                <label for="DIMENSIONS_3">8x8</label>
                                <input type="radio" id="DIMENSIONS_3" name="SIZE" value="3" width="8" height="8">
                            </div>
                            <div class="rw-button">
                                <label for="DIMENSIONS_4">9x8</label>
                                <input type="radio" id="DIMENSIONS_4" name="SIZE" value="4" width="9" height="8">
                            </div>
                            <div class="rw-button">
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
                            <div class="rw-button panel-button">
                                <label for="RANCH">Raised Ranch</label>
                                <input type="radio" id="RANCH" name="FACE" value="R" desc="Rnc">
                            </div>
                            <div class="rw-button panel-button">
                                <label for="FLUSH">Flush</label>
                                <input type="radio" id="FLUSH" name="FACE" value="F" desc="Fls">
                            </div>
                            <div class="rw-button panel-button">
                                <label for="COLONIAL">Raised Colonial</label>
                                <input type="radio" id="COLONIAL" name="FACE" value="C" checked desc="Col">
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
                            <div class="rw-button panel-button">
                                <label for="GROOVED_RANCH">Recessed grooved Ranch</label>
                                <input type="radio" id="GROOVED_RANCH" name="FACE" value="S" desc="RncGc">
                            </div>
                            <div class="rw-button panel-button">
                                <label for="GROOVED_COLONIAL">Recessed grooved Colonial</label>
                                <input type="radio" id="GROOVED_COLONIAL" name="FACE" value="B" desc="ColGc">
                            </div>
                            <div class="rw-button panel-button">
                                <label for="SMOOTH_RANCH">Recessed smooth Ranch</label>
                                <input type="radio" id="SMOOTH_RANCH" name="FACE" value="T" desc="RncSc">
                            </div>

                            <div class="rw-button panel-button">
                                <label for="PLANK">Plank</label>
                                <input type="radio" id="PLANK" name="FACE" value="V" desc="Plk">
                            </div>
                            <div class="rw-button panel-button mixed-panel" style="display:none">
                                <label for="MIXED">Mixed</label>
                                <input type="radio" id="MIXED" name="FACE" value="M">
                            </div>
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
                                            <p>View Available Colors</p>
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
                                            <p>View Optional Colors</p>
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
                                <div class="rw-button btn-checked finish-layout-btn">
                                    <label for="WOODGRAIN">Woodgrain</label>
                                    <input type="radio" id="WOODGRAIN" name="FINISH" value="W" checked>
                                </div>
                                <div class="rw-button finish-stucco finish-layout-btn" style="display:none"
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
                data-title="Glazing">

		<!-- glass shapes -->
		<div class = "dropdown-item">
			<h3>Glass Shape</h3>
			<div class="panel-layout">
				<div class="rw-button panel-button">
					<label for="GLASS_SHAPE_COLONIAL">Colonial</label>
					<input type="radio" id="GLASS_SHAPE_COLONIAL" name="GLASS_SHAPE" value="colonial" checked>
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_SHAPE_RANCH">Ranch</label>
					<input type="radio" id="GLASS_SHAPE_RANCH" name="GLASS_SHAPE" value="ranch" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_SHAPE_3">Slim Single</label>
					<input type="radio" id="GLASS_SHAPE_3" name="GLASS_SHAPE" value="slim_single" >
				</div>
			</div>
		</div>

		<div class="dropdown-item custom-dimension-item">
			<h3>More Glass Shapes</h3>
			<label class="switch">
				<input type="checkbox" id="more_glass_shapes" value="off">
				<span class="slider round"></span>
			</label>
		</div>

		<div class="dropdown-item custom-panel-item-container" id="more_glass_shapes_container">
			<div class="panel-layout">
				<div class="rw-button panel-button">
					<label for="GLASS_SHAPE_MORE_0">Slim Double</label>
					<input type="radio" id="GLASS_SHAPE_MORE_0" name="GLASS_SHAPE" value="slim_double" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_SHAPE_MORE_17">Grand Wrought Iron - Rectangle</label>
					<input type="radio" id="GLASS_SHAPE_MORE_17" name="GLASS_SHAPE" value="grand_wrought_iron_rectangle" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_SHAPE_MORE_18">Grand Wrought Iron - Double Arched</label>
					<input type="radio" id="GLASS_SHAPE_MORE_18" name="GLASS_SHAPE" value="grand_wrought_iron_double_arched" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_SHAPE_MORE_19">Grand 4/4 - Rectangle</label>
					<input type="radio" id="GLASS_SHAPE_MORE_19" name="GLASS_SHAPE" value="grand_44_rectangle" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_SHAPE_MORE_20">Grand 4/4 - Double Arched</label>
					<input type="radio" id="GLASS_SHAPE_MORE_20" name="GLASS_SHAPE" value="grand_44_double_arched" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_SHAPE_MORE_21">Grand 4 Pane - Rectangle</label>
					<input type="radio" id="GLASS_SHAPE_MORE_21" name="GLASS_SHAPE" value="grand_4_pane_rectangle" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_SHAPE_MORE_22">Grand 4 Pane - Double Arched</label>
					<input type="radio" id="GLASS_SHAPE_MORE_22" name="GLASS_SHAPE" value="grand_4_pane_double_arched" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_SHAPE_MORE_23">Grand Clear - Rectangle</label>
					<input type="radio" id="GLASS_SHAPE_MORE_23" name="GLASS_SHAPE" value="grand_clear_rectangle" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_SHAPE_MORE_24">Grand Clear - Double Arched</label>
					<input type="radio" id="GLASS_SHAPE_MORE_24" name="GLASS_SHAPE" value="grand_clear_double_arched" >
				</div>
			</div>
		</div>
		<!-- glass shapes end>

		<!-- glass types -->
		<div class = "dropdown-item">
			<h3>Glass Type</h3>
			<div class="panel-layout">
				<div class="rw-button panel-button">
					<label for="GLASS_TYPE_0">Clear Glass</label>
					<input type="radio" class="rw-button-toggle" id="GLASS_TYPE_0" name="GLASS_TYPE" value="clear_glass" checked>
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_TYPE_1">Clear Glass Single</label>
					<input type="radio" class="rw-button-toggle" id="GLASS_TYPE_1" name="GLASS_TYPE" value="clear_glass_single" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_TYPE_2">Satin</label>
					<input type="radio" class="rw-button-toggle" id="GLASS_TYPE_2" name="GLASS_TYPE" value="satin" >
				</div>
			</div>
		</div>

		<div class="dropdown-item custom-dimension-item">
			<h3>More Glass Types</h3>
			<label class="switch">
				<input type="checkbox" id="more_glass_types" value="off">
				<span class="slider round"></span>
			</label>
		</div>

		<div class="dropdown-item custom-panel-item-container" id="more_glass_types_container">
			<div class="panel-layout">
				<div class="rw-button panel-button">
					<label for="GLASS_TYPE_MORE_0">Pinhead</label>
					<input type="radio" id="GLASS_TYPE_MORE_0" name="GLASS_TYPE" value="pinhead" checked>
				</div>
			</div>
		</div>
		<!-- glass types end>

		<!-- glass inserts -->
		<div class = "dropdown-item">
			<h3>Glass Insert</h3>
			<div class="panel-layout">
				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_1">Stockton</label>
					<input type="radio" class="rw-button-toggle" id="GLASS_INSERT_1" name="GLASS_INSERT" value="stockton_colonial" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_2">Waterton</label>
					<input type="radio" class="rw-button-toggle" id="GLASS_INSERT_2" name="GLASS_INSERT" value="waterton_colonial" checked>
				</div>

				<div class="rw-button panel-button" style="display:none;">
					<label for="GLASS_INSERT_1">Stockton</label>
					<input type="radio" class="rw-button-toggle" id="GLASS_INSERT_1" name="GLASS_INSERT" value="stockton_ranch" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_3">Waterton</label>
					<input type="radio" class="rw-button-toggle" id="GLASS_INSERT_3" name="GLASS_INSERT" value="waterton_ranch" checked>
				</div>
			</div>
		</div>

		<div class="dropdown-item custom-dimension-item">
			<h3>More Glass Inserts</h3>
			<label class="switch">
				<input type="checkbox" id="more_glass_inserts" value="off">
				<span class="slider round"></span>
			</label>
		</div>

		<div class="dropdown-item custom-panel-item-container" id="more_glass_inserts_container">
			<div class="panel-layout">
				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_0">Prairie</label>
					<input type="radio" id="GLASS_INSERT_MORE_0" name="GLASS_INSERT" value="prairie" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_1">Cascade</label>
					<input type="radio" id="GLASS_INSERT_MORE_1" name="GLASS_INSERT" value="cascade_colonial" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_25">Cascade</label>
					<input type="radio" id="GLASS_INSERT_MORE_25" name="GLASS_INSERT" value="cascade_ranch" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_2">Arched Stockton</label>
					<input type="radio" id="GLASS_INSERT_MORE_2" name="GLASS_INSERT" value="arched_stockton" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_3">Stockbridge</label>
					<input type="radio" id="GLASS_INSERT_MORE_3" name="GLASS_INSERT" value="stockbridge" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_4">Arched Stockbridge</label>
					<input type="radio" id="GLASS_INSERT_MORE_4" name="GLASS_INSERT" value="arched_stockbridge" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_5">Aluminum Grid - Stockton 4</label>
					<input type="radio" id="GLASS_INSERT_MORE_5" name="GLASS_INSERT" value="alum_stockton_4" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_6">Aluminum Grid - Stockton 6</label>
					<input type="radio" id="GLASS_INSERT_MORE_6" name="GLASS_INSERT" value="alum_stockton_6" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_7">Aluminum Grid - Prairie</label>
					<input type="radio" id="GLASS_INSERT_MORE_7" name="GLASS_INSERT" value="alum_prairie" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_8">Aluminum Grid - Stockton 10</label>
					<input type="radio" id="GLASS_INSERT_MORE_8" name="GLASS_INSERT" value="alum_stockton_10" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_9">Square Bar - Stockton 4</label>
					<input type="radio" id="GLASS_INSERT_MORE_9" name="GLASS_INSERT" value="square_bar_stockton_4" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_10">Square Bar - Stockton 6</label>
					<input type="radio" id="GLASS_INSERT_MORE_10" name="GLASS_INSERT" value="square_bar_stockton_6" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_11">Square Bar - Prairie</label>
					<input type="radio" id="GLASS_INSERT_MORE_11" name="GLASS_INSERT" value="square_bar_prairie" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_12">Round Bar - Stockton 4</label>
					<input type="radio" id="GLASS_INSERT_MORE_12" name="GLASS_INSERT" value="round_bar_stockton_4" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_13">Round Bar - Stockton 6</label>
					<input type="radio" id="GLASS_INSERT_MORE_13" name="GLASS_INSERT" value="round_bar_stockton_6" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_14">Round Bar - Prairie</label>
					<input type="radio" id="GLASS_INSERT_MORE_14" name="GLASS_INSERT" value="round_bar_prairie" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_15">Square Bar - Stockton 10</label>
					<input type="radio" id="GLASS_INSERT_MORE_15" name="GLASS_INSERT" value="square_bar_stockton_10" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_16">Round Bar - Stockton 10</label>
					<input type="radio" id="GLASS_INSERT_MORE_16" name="GLASS_INSERT" value="round_bar_stockton_10" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_17">Arched Stockton 3pc Set</label>
					<input type="radio" id="GLASS_INSERT_MORE_17" name="GLASS_INSERT" value="arched_stockton_3" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_18">Arched Stockbridge 3pc Set</label>
					<input type="radio" id="GLASS_INSERT_MORE_18" name="GLASS_INSERT" value="arched_stockbridge_3" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_19">Berkshire</label>
					<input type="radio" id="GLASS_INSERT_MORE_19" name="GLASS_INSERT" value="arched_stockton_4" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_INSERT_MORE_20">Breckenridge</label>
					<input type="radio" id="GLASS_INSERT_MORE_20" name="GLASS_INSERT" value="arched_stockbridge_4" >
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
								<p>View Available Colors</p>
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
								<p>View Optional Colors</p>
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
								<p>View Available Colors</p>
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
								<p>View Optional Colors</p>
							</div>
						</div>

						<div class='colorContainer colorContainerInactive'></div>
					</div>
				</div>
			</div>
		</div>

		<!-- tempered glass -->
		<div class = "dropdown-item">
			<h3>Tempered Glass</h3>
			<div class="panel-layout">
				<div class="rw-button panel-button">
					<label for="GLASS_TEMPERED_0">All</label>
					<input type="radio" class="rw-button-toggle" id="GLASS_TEMPERED_0" name="GLASS_TEMPERED" value="all" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_TEMPERED_1">Bottom</label>
					<input type="radio" class="rw-button-toggle" id="GLASS_TEMPERED_1" name="GLASS_TEMPERED" value="bottom_1" >
				</div>

				<div class="rw-button panel-button">
					<label for="GLASS_TEMPERED_2">Bottom 2</label>
					<input type="radio" class="rw-button-toggle" id="GLASS_TEMPERED_2" name="GLASS_TEMPERED" value="bottom_2" >
				</div>
			</div>
		</div>
		<!-- tempered glass end -->
</section>

            <!-- HARDWARE SECTION -->
            <section face="false" hardware="true" enabled="true" id="HARDWARE" class="rw-configurator__page"
                data-title="Hardware">
                <div class="dropdown-container">
                    <div class="dropdown-item">
                        <h3>Hardware Set</h3>
                        <div class="dimension-layout">
                            <div class="rw-button">
                                <input type="radio" id="STANDARD" name="HARDWARE_SET" value="A" checked>
                                <label for="STANDARD">Standard</label>
                            </div>

                            <div class="rw-button">
                                <input type="radio" id="STANDARD_PLUS" name="HARDWARE_SET" value="Y">
                                <label for="STANDARD_PLUS">Standard Plus</label>
                            </div>

                            <div class="rw-button">
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
                                                <input type="radio" style="display:none;" id="TORSION" name="SPRINGTYPE"
                                                    value="TOR" checked>
                                            </div>
                                            <div class="rw-sliding-button">
                                                <label for="EXTENSION">Extension</label>
                                                <input type="radio" style="display:none;" id="EXTENSION"
                                                    name="SPRINGTYPE" value="EXT">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="dropdown-subitem inclined-track" style="width:100%; display:none" >
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

                    <div class="dropdown-item">
                        <h3 for="LIFT_TYPE" class="">Lift Type</h3>
                        <div class="panel-layout">
                            <div class="rw-button panel-button lift-option" id="opt-STD12">
                                <input type="radio" id="STD12" name="LIFT_TYPE" value="STD12" checked>
                                <label for="STD12">Standard 12"R</label>
                            </div>
                            <div class="rw-button panel-button lift-option" id="opt-STD15">
                                <input type="radio" id="STD15" name="LIFT_TYPE" value="STD15">
                                <label for="STD15">Standard 15"R</label>
                            </div>
                            <div class="rw-button panel-button lift-option" id="opt-32R">
                                <input type="radio" id="32R" name="LIFT_TYPE" value="32R">
                                <label for="32R">Standard 32"R</label>
                            </div>
                            <div class="rw-button panel-button lift-option" id="opt-LHF">
                                <input type="radio" id="LHF" name="LIFT_TYPE" value="LHF">
                                <label for="LHF">Low Headroom Front</label>
                            </div>
                            <div class="rw-button panel-button lift-option" id="opt-LHROUT">
                                <input type="radio" id="LHROUT" name="LIFT_TYPE" value="LHROUT">
                                <label for="LHROUT">Low Headroom Rear</label>
                            </div>
                            <div class="rw-button panel-button lift-option" id="opt-LHREXT">
                                <input type="radio" id="LHREXT" name="LIFT_TYPE" value="LHREXT">
                                <label for="LHREXT">Low Headroom Ext.</label>
                            </div>
                            <div class="rw-button panel-button lift-option" id="opt-HL">
                                <input type="radio" id="HL" name="LIFT_TYPE" value="HL">
                                <label for="HL">High Lift</label>
                            </div>
                            <div class="rw-button panel-button lift-option" id="opt-VL">
                                <input type="radio" id="VL" name="LIFT_TYPE" value="VL">
                                <label for="VL">Vertical Lift</label>
                            </div>
                            <div class="rw-button panel-button lift-option" id="opt-VL">
                                <input type="radio" id="LHR_VL" name="LIFT_TYPE" value="LHR_VL">
                                <label for="LHR_VL">Vertical Lift Low Headroom</label>
                            </div>
                        </div>
                    </div>

                    <div class="dropdown-item" id="HIGHLIFT_LAYOUT" style="display:none">
                        <div class="range-slider-container">
                            <h3 id="HIGHLIFT_LABEL" for="HIGHLIFT">Highlift (in) : <span id="HIGHLIFT_VALUE"></span> | Low Headroom (in) : <span id="HEADROOM_VALUE"></span>
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
                                                <input type="radio" style="display:none;" id="10K" name="SPRINGCYCLE"
                                                    value="10K" checked>
                                            </div>
                                            <div class="rw-sliding-button">
                                                <label for="20K">20K</label>
                                                <input type="radio" style="display:none;" id="20K" name="SPRINGCYCLE"
                                                    value="20K">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="dropdown-subitem" style="width:100%">
                                    <h3 for="JAMB_SEAL" class="">Jamb Seal </h3>
                                    <select id="JAMB_SEAL" name="JAMB_SEAL">
                                        <option value="DUALA">Aluminium - Dual Fin</option>
                                        <option value="NONE">None</option>
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
                                       <a  href="https://easywebdev.rwdoors.com/HTML/products/210005530/help/JambSealChart.pdf" class="info-icon"  target="_blank"
      rel="noopener noreferrer"> ? </a>
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
                class="rw-configurator__page">


                <div class="operator-carousel-outer">
                    <div class="operator-group-container">
                        <input type="hidden" name="OPERATOR" id="OPERATOR" value="" data-max-door-height=""
                            data-is-hi-lift-compatible="" />
                        <div class="carousel-container-slide">
                            <div id="operator-carousel-container"></div>
                        </div>
                        <div id="nextButtonOperator" class="next-button-carousel">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="chevron-icon-next">
                                <path
                                    d="M471.1 297.4C483.6 309.9 483.6 330.2 471.1 342.7L279.1 534.7C266.6 547.2 246.3 547.2 233.8 534.7C221.3 522.2 221.3 501.9 233.8 489.4L403.2 320L233.9 150.6C221.4 138.1 221.4 117.8 233.9 105.3C246.4 92.8 266.7 92.8 279.2 105.3L471.2 297.3z" />
                            </svg>
                        </div>
                        <div id="prevButtonOperator" class="prev-button-carousel">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="chevron-icon-prev">
                                <path
                                    d="M169.4 297.4C156.9 309.9 156.9 330.2 169.4 342.7L361.4 534.7C373.9 547.2 394.2 547.2 406.7 534.7C419.2 522.2 419.2 501.9 406.7 489.4L237.3 320L406.6 150.6C419.1 138.1 419.1 117.8 406.6 105.3C394.1 92.8 373.8 92.8 361.3 105.3L169.3 297.3z" />
                            </svg>
                        </div>
                    </div>
                </div>



                <div class="rw-image-input">
                    <a href="https://www.rwdoors.com/liftmaster/" target="_blank" rel="noopener noreferrer">
                        <img id="ADDITIONAL_TRANSMITTER_IMAGE" class="rw-image-input-img"
                            href="https://www.rwdoors.com/liftmaster/" />
                        <div class="overlay"></div>
                    </a>
                    <div class="horizontal-inputs horizontal-inputs--quantity" style="width:75%;">
                        <div class="image-input-cell">
                            <h3 for="ADDITIONAL_TRANSMITTER" class="config-option-label-style">Additional Transmitter
                            </h3>
                            <select id="ADDITIONAL_TRANSMITTER" style="width:75%" name="ADDITIONAL_TRANSMITTER"
                                onchange="operatorImageOnChange(this)">
                                <option value=NONE selected img="" smartpartnum=>NONE</option>
                                <option value=952-135 img="952-135.jpg" smartpartnum=952-135>890MAX</option>
                                <option value=952-113 img="952-113.jpg" smartpartnum=952-113>893MAX</option>
                                <option value=952-112 img="952-112.jpg" smartpartnum=952-112>891LM</option>
                                <option value=952-116 img="952-116.jpg" smartpartnum=952-116>893LM</option>
                            </select>
                        </div>
                        <div class="image-input-cell">
                            <h3 for="ADDITIONAL_TRANSMITTER_QTY" class="config-option-label-style">Qty</h3>
                            <select id="ADDITIONAL_TRANSMITTER_QTY" name="ADDITIONAL_TRANSMITTER_QTY"
                                style="min-width: 50px;">
                                <option value="0" selected>0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                        </div>
                    </div>

                </div>

                <div class="rw-image-input">
                    <a href="https://www.rwdoors.com/liftmaster/" target="_blank" rel="noopener noreferrer">

                        <img class="rw-image-input-img" id="ADDITIONAL_CONTROL_PANEL_IMAGE"
                            href="https://www.rwdoors.com/liftmaster/">
                        <div class="overlay"></div>
                    </a>
                    <div class="horizontal-inputs horizontal-inputs--quantity" style="width:75%;">
                        <div class="image-input-cell">
                            <h3 for="ADDITIONAL_CONTROL_PANEL" class="config-option-label-style">Additional Control
                                Panel</h3>
                            <select id="ADDITIONAL_CONTROL_PANEL" style="width:75%" name="ADDITIONAL_CONTROL_PANEL"
                                onchange="operatorImageOnChange(this)">
                                <option value=NONE img="" selected smartpartnum=>None</option>
                                <option value=952-138 img="952-138.jpg" smartpartnum=952-138>881LMW</option>
                                <option value=952-211 img="952-136.jpg" smartpartnum=952-211>880LMW</option>
                                <option value=952-213 img="952-137.jpg" smartpartnum=952-213>886LMW</option>
                                <option value=952-152W img="" smartpartnum=952-152W>882LMW</option>
                                <option value=952-212 img="" smartpartnum=952-212>883LMW</option>
                                <option value=952-148 img="" smartpartnum=952-148>885LM</option>
                                <option value=952-164 img="" smartpartnum=952-164>889LM</option>
                            </select>
                        </div>
                        <div class="image-input-cell">
                            <h3 for="ADDITIONAL_CONTROL_PANEL_QTY" class="config-option-label-style">Qty</h3>
                            <select id="ADDITIONAL_CONTROL_PANEL_QTY" name="ADDITIONAL_CONTROL_PANEL_QTY"
                                style="min-width: 50px;">
                                <option value="0" selected>0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="rw-image-input">
                    <a href="https://www.rwdoors.com/liftmaster/" target="_blank" rel="noopener noreferrer">
                        <img class="rw-image-input-img" id="ADDITIONAL_KEYLESS_ENTRY_IMAGE"
                            href="https://www.rwdoors.com/liftmaster/">
                        <div class="overlay"></div>

                    </a>
                    <div class="horizontal-inputs horizontal-inputs--quantity" style="width:75%;">
                        <div class="image-input-cell">
                            <h3 for="ADDITIONAL_KEYLESS_ENTRY" class="config-option-label-style">Additional Keyless
                                Entry</h3>
                            <select id="ADDITIONAL_KEYLESS_ENTRY" style="width:75%" name="ADDITIONAL_KEYLESS_ENTRY"
                                onchange="operatorImageOnChange(this)">
                                <option value=NONE img="" selected smartpartnum=>None</option>
                                <option value=952-119 img="952-119.jpg" smartpartnum=952-119>387LM</option>
                                <option value=952-117 img="952-117.jpg" smartpartnum=952-117>877LM</option>
                                <option value=952-210 img="952-114.jpg" smartpartnum=952-210>878MAX</option>
                            </select>
                        </div>
                        <div class="image-input-cell">
                            <h3 for="ADDITIONAL_KEYLESS_ENTRY_QTY" class="config-option-label-style">Qty</h3>
                            <select id="ADDITIONAL_KEYLESS_ENTRY_QTY" name="ADDITIONAL_KEYLESS_ENTRY_QTY"
                                style="min-width: 50px;">
                                <option value="0" selected>0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Advance SECTION-->
            <section face="false" hardware="true" enabled="true" id="ADVANCED" data-title="Advanced"
                class="rw-configurator__page">
                <div class="dropdown-container">
                    <div class="dropdown-item">
                        <h3>Door Options</h3>
                        <div class="dimension-layout">
                            <div class="rw-button">
                                <input type="radio" id="DOORFACE" name="DOOROPT" value="DOORFACE">
                                <label for="DOORFACE">Door Face Only</label>
                            </div>

                            <div class="rw-button">
                                <input type="radio" id="HARDWAREONLY" name="DOOROPT" value="HARDWAREONLY">
                                <label for="HARDWAREONLY">Hardware Only</label>
                            </div>

                            <div class="rw-button">
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
                                                value="Y">
                                        </div>
                                        <div class="rw-sliding-button selected">
                                            <label for="DrillNo">NO</label>
                                            <input type="radio" style="display:none;" id="DrillNo" name="DRILL"
                                                value="N" checked>
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
                                            <input type="radio" style="display:none;" id="EndCapsYes" name="EndCaps"
                                                value="Y">
                                        </div>
                                        <div class="rw-sliding-button selected">
                                            <label for="EndCapsYesNo">NO</label>
                                            <input type="radio" style="display:none;" id="EndCapsYesNo" name="EndCaps"
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
                                            <input type="radio" style="display:none;" id="TUBE_SHAFT" name="SHAFT"
                                                value="T" checked>
                                        </div>
                                        <div class="rw-sliding-button">
                                            <label for="KEYED_TUBE_SHAFT">Keyed Tube Shaft</label>
                                            <input type="radio" style="display:none;" id="KEYED_TUBE_SHAFT" name="SHAFT"
                                                value="K">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="dropdown-item" style="flex-direction:row;">
                        <div class="dimension-layout">
                            <h3 for="JAMB_SEAL_COLOR">Frame Colour</h3>
                            <select id="JAMB_SEAL_COLOR" name="JAMB_SEAL_COLOR">
                                <option value="W" jambscrews="215-302W-050" selected="selected">White</option>
                                <option value="T" jambscrews="215-302T-050">SandStone</option>
                                <option value="A" jambscrews="215-302A-050">Almond</option>
                                <option value="C" jambscrews="215-302C-050">Slate Grey</option>
                                <option value="Z" jambscrews="215-302Z-050">Bronze</option>
                                <option value="K" jambscrews="215-302K-050">Black</option>
                                <option value="B" jambscrews="215-302B-050">Brown</option>
                                <option value="F" jambscrews="215-302F-050">Cafe</option>
                                <option value="E" jambscrews="215-302E-050">Desert Tan</option>
                                <option value="V" jambscrews="215-302C-050">Iron Ore</option>
                                <option value="NONE">None</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>


            <!-- aNNOTATION SECTION-->
            <section face="false" hardware="true" enabled="true" id="ANNOTATIONS" data-title="Annotations"
                class="rw-configurator__page">
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

                    <button type="button" name="nextPageBtn" class="button-configure" onclick="nextPage()"
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
                <div id="DEFAULTS_PLUGIN">
                    <div style="display:flex;justify-content:space-between;width:100%">
                        <button onclick="saveDefaults()" class="defaults-button">Save as Default</button>
                        <button type="CONTAINER" id="LOAD_DEFAULTS" class="defaults-button">Restore Default</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
`
  //At least one input needs to be loaded in initially to get the title.
  $('#ROOT_0').hide()

  //$('#accordion9757245').hide(); //hide the inputs from section bundle page
  $('#accordion935516314').hide(); // hide load_html page
  // accordion935516314
  //Hides the outputs
  $('#accordion1406547076').hide()
  //Hides the global data for JDE
  $("#accordion1094153584").hide()
  //Here is where we add the HTML
  $('.concept-ui-form.scrollable').append(form)
  $('.concept-ui-form.scrollable').removeClass('concept-ui-form scrollable')

  loadUI();


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
  //I just find this ugly.
  $(`#collapse1159850199`).remove();
  $(`#section_select`).on('change', (evt) => {
    showSection(Number(evt.target.value))
  })

  //Load the caching system.
  rw_init('configurator')
  loadGlobalNodes()
  //loadTrussSchedule()
  //loadPriceDrivers()

  //Needed for some minor layout
  //$('#displayMain').css('margin-bottom', '24px')
  //$('#displayMain').css('padding', '0 100px')

  //populatePrecons()

  //All warnings default to hidden
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

  // Changing Color selection and Position
  $(function () {

    if ($(".button-set.right").length > 0) {
      $(".button-set.right").hide();
    }

    const observerPosition = new MutationObserver((mutations, obs) => {

      const checkedWindowOption = $('.combined-button-container-inner input[type="radio"]:checked').val();

      // if (!checkedWindowOption || checkedWindowOption === 'none') {
      //     $('.postion-container').css('visibility', 'hidden');
      //     //$('.postion-container').hide();
      // } else if (checkedWindowOption === 'slim_40') {
      //     $('.postion-container').css('visibility', 'visible');
      //     //$('.postion-container').show();
      // }


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
        setupRadioSelectionTwoButtons("EndCaps");
        setupRadioSelectionTwoButtons("DOOROPT");
        setupRadioSelectionTwoButtons("SPRINGTYPE");
        setupRadioSelectionTwoButtons("EXTRA_TRUSS");
        setupRadioSelectionTwoButtons("SHAFT");
        setupRadioSelectionTwoButtons("SPRINGCYCLE");
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
        img: "/HTML/products/162059085/images/Operators_none.png",
        maxDoorHeight: 1000,
        isHiLiftCompatible: true,
        style: ""
      },
      1: {
        id: "operator_jackshaft",
        name: "98022 - Jackshaft",
        value: "8500W",
        img: "/HTML/products/162059085/images/EW-LM-8500W.jpg",
        maxDoorHeight: 1000,
        isHiLiftCompatible: true,
        style: ""
      },
      2: {
        id: "operator_belt",
        name: "87504-267 -Belt",
        value: "87504-267",
        img: "/HTML/products/162059085/images/87504-267.png",
        maxDoorHeight: 120,
        isHiLiftCompatible: false,
        style: ""
      },
      3: {
        id: "operator_chain",
        name: "83650-267 - Chain",
        value: "8365W-267",
        img: "/HTML/products/162059085/images/EW-LM-8365W-267.jpg",
        maxDoorHeight: 120,
        isHiLiftCompatible: false,
        style: ""
      },
      4: {
        id: "operator_chain_2",
        name: "81650 - Chain",
        value: "8165W",
        img: "/HTML/products/162059085/images/EW-LM-8165.jpg",
        maxDoorHeight: 120,
        isHiLiftCompatible: false,
        style: ""
      },
      5: {
        id: "operator_belt_2",
        name: "81550 - Belt",
        value: "8155B",
        img: "/HTML/products/162059085/images/EW-LM-8155B.jpg",
        maxDoorHeight: 120,
        isHiLiftCompatible: false,
        style: ""
      }


    }
    // Data and default start index
    const operatorDataArray = Object.values(operatorData);
    let currentOperatorIndex = 1;
    let firstTimeLoading = true;

    // Creates the HTML for operator
    function createOperatorDiv(operator, activeStatus = false) {
      const operatorItem = document.createElement('div');
      operatorItem.classList.add('carousel-operator-item');

      if (activeStatus) {
        operatorItem.classList.add('active');
      }

      // First make sure images get loaded
      let retryLoading = false;
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
      const operatorInput = document.getElementById('OPERATOR');

      content.innerHTML = '';

      content.appendChild(createOperatorDiv(operatorDataArray[operatorDataArray.length - 1]));
      operatorDataArray.forEach((operator, index) => {
        const operatorItemList = createOperatorDiv(operator, index === indexCurrent);
        content.appendChild(operatorItemList);
      });
      //content.insertBefore(createOperatorDiv(operatorDataArray[operatorDataArray.length-1]), operatorDataArray[0]);
      content.appendChild(createOperatorDiv(operatorDataArray[0]));
    }


    function updateActiveOperator(index) {
      const items = document.querySelectorAll('.carousel-operator-item');

      // First set the active tag
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
      const operatorInput = document.getElementById('OPERATOR');
      operatorInput.name = currentOperator.name;
      operatorInput.value = currentOperator.value;
      !!nodeset['OPERATOR'] ? nodeset['OPERATOR'].value = currentOperator.value : ""
      !!rw ? rw(getNode("OPERATOR")) : ""
      operatorInput.dataset.maxDoorHeight = currentOperator.maxDoorHeight;
      operatorInput.dataset.isHiLiftCompatible = currentOperator.isHiLiftCompatible;
    }

    function updateCarouselPosition(index) {
      const carousel = document.getElementById('operator-carousel-container');

      // Prevents slide affect first load
      if (firstTimeLoading) {
        carousel.classList.add('no-transition');
        carousel.style.transform = `translateX(-${index * 100}%)`;
        firstTimeLoading = false;

        requestAnimationFrame(() => {
          carousel.classList.remove('no-transition');
        });
      } else {
        carousel.style.transform = `translateX(-${index * 100}%)`;
      }
    }

    // Check if carousel buttons are added
    let buttonsAdded = false;

    // Setup carousel when tab 2 is clicked
    const observerTab2 = new MutationObserver((mutations, obs) => {
      //const tab2 = document.getElementById('tab_2');
      const $tab2 = $('#tab_2');
      if ($tab2) {
        obs.disconnect();
        $('#tab_2').on('click', function () {

          const carouselContainer = document.getElementById('operator-carousel-container');

          if (carouselContainer) {
            operatorCarouselLoad(currentOperatorIndex);
            updateSelectedOperator(currentOperatorIndex);

            if (!buttonsAdded) {

              buttonsAdded = true;

              $('#nextButtonOperator').on('click', () => {
                if (currentOperatorIndex > operatorDataArray.length) return;
                currentOperatorIndex++;
                updateSelectedOperator(currentOperatorIndex);
              });

              $('#prevButtonOperator').on('click', () => {
                if (currentOperatorIndex <= 0) return;
                currentOperatorIndex--;
                updateSelectedOperator(currentOperatorIndex);
              });


              carouselContainer.addEventListener('transitionend', () => {

                if (currentOperatorIndex > operatorDataArray.length) {
                  indexCorrectionList(carouselContainer, 1);
                }

                if (currentOperatorIndex <= 0) {
                  indexCorrectionList(carouselContainer, operatorDataArray.length);
                }
              });
            }
          } else {
            console.log('Observer missing');
          }
        });
      }
    });

    observerTab2.observe(document.body, {
      childList: true,
      subtree: true
    });


    // Update data list selection and update positioning
    function updateSelectedOperator(index) {
      updateCarouselPosition(index);
      updateActiveOperator(index);
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
  });
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

  appendDrpData();
  toggleSwitch();
  appendAvailableColors();
  appendOptionalColors();
  appendOverlappingColors();
  toggleStackColors();
  registerColorEvents();
  clickHandler();
  getAllInputVal();
  toggleMorePanelSwitch();
  toggleInclinedTrack();
  toogleSpringCycle();

  loadGlazingUI();
};


function clickHandler() {
  // Attach to all radios except color radios

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
      $(this).prop("checked", true).prop("checked", true);
      // Add class to selected
      $(this).parent().addClass("btn-checked");
    });

  $("input[type='radio'].rw-button-toggle")
	.off()
    .on("click", function(e) {
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

}


function toggleFinishOption(panel_style, door_color) {
  //enable stucco when plank or flush selected
  //else hide it by default
  if ((panel_style === 'F' || panel_style === 'V') && !woodTones.includes(door_color)) {
    //if door color is not a woodtones colors
    $(".finish-stucco").show();
  }
  else $(".finish-stucco").hide();
}

function selectFirstColor($container) {
  setTimeout(() => {
    const $first = $container.find(".color-button-container").first();
    $first.addClass("selected");
    $first.find('input[type="radio"]').prop("checked", true);
  }, 0);
}


function unselectFirstColor($container) {
  setTimeout(() => {
    const $first = $container.find(".color-button-container").first();
    $first.removeClass("selected");
    $first.find('input[type="radio"]').prop("checked", false);
  }, 0);
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

function appendAvailableColors() {
  const $container = $("#AvaialbleColorsSection .colorContainer");
  $container.html("");
  // if (!$container.length) return;

  AvailableColorImages.forEach((imgSrc, index) => {
    let isChecked = index === 0 ? "checked" : "";
    const html = `
            <div class="color-button-container ${index === 0 ? "selected" : ""}">
                <div class="color-button color-tooltip" data-tooltip = "${imgSrc.colorName}">
                    <img src="${src_path + imgSrc.url}" alt="Color ${index + 1}" class="color-image" />
                    <input
                        type="radio"
                        name="COLOR"
                        value="${imgSrc.value}"
                         ${isChecked}
                         hex="${imgSrc.hex}"
                         desc="${imgSrc.desc}"
                         colorName="${imgSrc.colorName}"
                        style="display:none"/>
                </div>
            </div>
        `;

    $container.append(html);
  });

  // ✅ Add selected class and checked radio AFTER all elements are appended
  selectFirstColor($container);
  registerColorEvents();
}

function appendOptionalColors(panel_style) {
  const $container = $("#OptionalColorsSection .colorContainer");
  //if ($container.length === 0) return;
  $container.html("");

  //remove these two colors when flush or Recessed smooth Ranch panel is selected
  const filtered = OptionalColorImages.filter(item => {
    if ((panel_style === "F" || panel_style === "T") &&
      ["Cocoa Hickory", "Honey Cedar"].includes(item.value)) {
      return false; // remove these 2
    }
    return true;
  });


  filtered.forEach((imgSrc, index) => {

    if ((panel_style === "F" || panel_style === "T") && imgSrc.restricted) {
      return;
    }

    let isChecked = index === 0 ? "checked" : "";
    const html = `
            <div class="color-button-container ${index === 0 ? "selected" : ""}">
                <div class="color-button color-tooltip" data-tooltip = "${imgSrc.colorName}">
                    <img src="${src_path + imgSrc.url}" alt="Color ${index + 1}" class="color-image" />
                    <input
                        type="radio"
                        name="COLOR"
                        value="${imgSrc.value}"
                        hex="${imgSrc.hex}"
                         desc="${imgSrc.desc}"
                         colorName="${imgSrc.colorName}"
                        ${isChecked}
                        style="display:none"
                    />
                </div>
            </div>
        `;

    $container.append(html);
  });

  registerColorEvents();
  // Add click handler
  // $container.find(".color-button-container").on("click", function () {
  //     $container.find(".color-button-container").removeClass("selected");

  //     $(this).addClass("selected");
  //     $container.find("input[type='radio']").removeAttr("checked").prop("checked", false);

  //     $(this).find('input[type="radio"]').attr("checked", "checked").prop("checked", true).trigger("change");
  // });
}

function registerColorEvents() {
  $(document).on("click", ".color-button-container", function () {
    const $container = $(this).closest(".colorContainer");

    // 1) Remove selected class from ALL color containers
    $(".color-button-container").removeClass("selected");

    // 2) Add selected class to clicked container
    $(this).addClass("selected");

    // 3) Uncheck all radios
    $(`input[type='radio'][name='COLOR']`).prop("checked", false);

    // 4) Check only clicked radio
    $(this).find(`input[type='radio']`).prop("checked", true).trigger("change");
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
    // $fs.addClass("colorContainerInactive");
    $fs.closest(".stack-wrapper").addClass("colorContainerInactive");
  };

  //function to show stack images
  const showStack = ($fs) => {
    // $fs.removeClass("colorContainerInactive");
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
    hideStack($("#optionalStackColors"));
    showContainer($("#OptionalColorsSection .colorContainer"));
    hideContainer($("#AvaialbleColorsSection .colorContainer"));
    showStack($("#availableStackColors"));
    //selectFirstColor($("#OptionalColorsSection .colorContainer"));
    //unselectFirstColor($("#AvaialbleColorsSection .colorContainer"));
    registerColorEvents();
    rw(getNode("COLOR"))
  });


  $("#availableStackColors").on("click", function () {

    setTimeout(animateTransition, 20);
    hideStack($("#availableStackColors"));
    showContainer($("#AvaialbleColorsSection .colorContainer"));
    hideContainer($("#OptionalColorsSection .colorContainer"));
    showStack($("#optionalStackColors"));
    //selectFirstColor($("#AvaialbleColorsSection .colorContainer"));
    //unselectFirstColor($("#OptionalColorsSection .colorContainer"));
    registerColorEvents();
    rw(getNode("COLOR"))

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

function appendDrpData() {

  // 1️⃣ Populate Door Width Feet (4–20)
  $("#DOOR_WIDTH_FEET").html(generateOptions(4, 20));
  $("#DOOR_WIDTH_FEET").val(16);

  // 2️⃣ Populate initial Door Width Inches (0–11)
  $("#DOOR_WIDTH_INCHES").html(generateOptions(0, 11));

  // 3️⃣ Update inches dynamically based on feet selection
  $("#DOOR_WIDTH_FEET").on("change", function () {
    const feet = parseInt($(this).val(), 10);

    const maxInches = feet === 20 ? 2 : 11; // limit inches for 20 feet
    $("#DOOR_WIDTH_INCHES").html(generateOptions(0, maxInches));
  });

  // Populate Door height Feet (6–14)
  $("#DOOR_HEIGHT_FEET").html(generateOptions(6, 14));
  // $("#DOOR_HEIGHT_FEET").val(7);

  refreshHeightInches(7);

  $("#DOOR_HEIGHT_FEET").on("change", function () {
    const feet = parseInt($(this).val(), 10);
    refreshHeightInches(feet);

  });


}

function refreshHeightInches(feet) {
  const inches = (feet === 14) ? [0] : [0, 3, 6, 9];
  $("#DOOR_HEIGHT_INCHES").html(generateOptionsFromArray(inches));
}


//function to show and hide door width and door height dropdown
function toggleSwitch() {
  $('#customSwitch').change(function () {
    if ($(this).is(':checked')) {
      toggle_Switch = 1;
      $("#customSwitch").val("on");
      $('.custom-dimension-container').slideDown();
      $('#DOOR_HEIGHT_FEET', '#DOOR_HEIGHT_INCHES', '#DOOR_WIDTH_FEET', '#DOOR_WIDTH_INCHES').prop('selectedIndex', 0);

      $(`input[name='SIZE']`).each((i, radio) => {
        $(radio).prop("checked", false).removeAttr("checked");
        $(radio).parent().removeClass("btn-checked");
        $('#DIMENSION').slideUp();

      });

      getAllInputVal(toggle_Switch);
      getCounterVal(toggle_Switch);

    } else {
      $('.custom-dimension-container').slideUp();
      $('#DIMENSION').slideDown();

      $("#DIMENSIONS_2").parent().addClass("btn-checked");
      $("#DIMENSIONS_2").prop("checked", true).trigger("change");
      $("#customSwitch").val("off");

      toggle_Switch = 0;
      getAllInputVal(toggle_Switch);
      getCounterVal(toggle_Switch);
    }
  });
}

function toggleMorePanelSwitch() {
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

      $("#COLONIAL").parent().addClass("btn-checked");
      $("#COLONIAL").prop("checked", true);
      setState("FACE", "C");
    }
  })
}

function toggleInclinedTrack() {
  $("input[name='HARDWARE_SET']").on("change", function () {
    if ($(this).val() === "C") {
      $(".inclined-track").show();
    } else {
      $(".inclined-track").hide();
    }
  });
}

function toogleSpringCycle() {

  const springCycle10k = $("#10K");
  const springCycle20k = $("#20K");

  const springCycle10kWrapper = springCycle10k.closest(".rw-sliding-button");
  const springCycle20kWrapper = springCycle20k.closest(".rw-sliding-button");

  function updateSpringCycle() {

    const selectedHardware = $("input[name='HARDWARE_SET']:checked").val();
    const labelText = $("input[name='HARDWARE_SET']:checked")
      .next("label")
      .text();

    if (selectedHardware === "Y") {

      // Disable 10K
      springCycle10k.prop("checked", false).prop("disabled", true);
      springCycle10kWrapper
        .addClass("disabled color-tooltip spring-cycle")
        .removeClass("btn-checked selected")
        .attr(
          "data-tooltip",
          `Spring Cycle 10K not available for ${labelText} Hardware`
        );

      // Select 20K
      springCycle20k.prop("checked", true).prop("disabled", false);
      springCycle20kWrapper.addClass("btn-checked selected");

    } else {

      // Enable both
      springCycle10k.prop("disabled", false);
      springCycle20k.prop("disabled", false);

      // Default back to 10K
      springCycle10k.prop("checked", true);
      springCycle20k.prop("checked", false);

      // Restore classes & tooltip
      springCycle10kWrapper
        .removeClass("disabled color-tooltip")
        .removeAttr("data-tooltip")
        .addClass("btn-checked selected");

      springCycle20kWrapper.removeClass("btn-checked selected");
    }
  }

  // Run when hardware changes
  $("input[name='HARDWARE_SET']").on("change", updateSpringCycle);

  // Run once on page load
  updateSpringCycle();
}

function getAllInputVal() {

  panel_style = $("input[name='FACE']:checked").val();
  door_model = $("input[name='DOOR_MODEL']:checked").val();
  door_color = $(".color-button-container.selected input[type='radio']").val();
  door_option = $('input[name="DOOROPT"]:checked').val();
  //toggleHardwareSection(door_option);

  // Panel style click
  $(document).off("click.togglePanelStyle").on("click.togglePanelStyle", "input[name='FACE']", function (e) {
    panel_style = e.target.value;
    //toggleFinishOption(panel_style, door_color);
    appendOptionalColors(panel_style);
  });

  // Optional: initialize checked panel style
  $("input[name='FACE']:checked").each(function () {
    appendOptionalColors(this.value);
  });

  // COLOR click
  $(document)
    .off("click.colorSelect")
    .on("click.colorSelect", `div[data-id="COLOR"] .color-button-container`, function () {
      door_color = $(`div[data-id="COLOR"] .color-button-container.selected input[type='radio']`).val();
      toggleFinishOption(panel_style, door_color);
      rw(getNode("COLOR"))
    });

  $('#FRAME_COLOR').on('click', '.color-button-container', function () {
    const color = $(this).find(`input[type='radio']`).val();
    const color_info = [...AvailableColorImages, ...OptionalColorImages].find(c => c.value == color);
    if (!color_info) return;
    setState("FRAME_COLOR", color_info);
  });

  $('#INSERT_COLOR').on('click', '.color-button-container', function () {
    const color = $(this).find(`input[type='radio']`).val();
    const color_info = [...AvailableColorImages, ...OptionalColorImages].find(c => c.value == color);
    if (!color_info) return;
    setState("INSERT_COLOR", color_info);
  });

  //door option click
  $(document)
    .off("click.doorOpt")
    .on("click.doorOpt", ".rw-sliding-button", function (e) {
      door_option = $(this).find('input[name="DOOROPT"]').val();
      //toggleHardwareSection(door_option);
    });
  $(document)
    .off("click.SPRINGTYPE")
    .on("click.SPRINGTYPE", ".rw-sliding-button", function (e) {

      $(`input[name="${e.target.name}"]`).each(function () {
        $(this).closest(".rw-sliding-button").removeClass("selected");
      });

      // Add selected to the currently checked one
      const $selected = $(`input[name="${e.target.name}"]:checked`);
      $selected.closest(".rw-sliding-button").addClass("selected");

    });


}


function getCounterVal(toggle_Switch) {
  return toggle_Switch;
}

function toggleHardwareSection(door_option) {
  if (door_option === "DOORFACE") {
    disableSection("Hardware Options")
  }
  else {
    enableSection("Hardware Options")
  }
}

function increaseValue(button, limit) {
  const $num = $(button).closest('.quantity-field').find('.number');
  let value = parseInt($num.text(), 10);

  if (isNaN(value)) value = 0;
  if (limit && value >= limit) return;

  $num.text(value + 1);
}

function decreaseValue(button) {
  const $num = $(button).closest('.quantity-field').find('.number');
  let value = parseInt($num.text(), 10);

  if (isNaN(value)) value = 0;
  if (value < 1) return;

  $num.text(value - 1);
}


function isFormValid() {
  if (!(!!getState("SPRING_SOLUTION") && getState("WEIGHT") < 750))
    return false;
  return !Object.values(nodeset).map(node => node.value).includes("ERROR")

}

function additionalSaves(json) {

}

function loadGlazingUI() {
  $('#more_glass_shapes').change(function () {
    if ($(this).is(':checked')) {
      $("#more_glass_shapes_container").slideDown();
    } else {
      $("#more_glass_shapes_container").slideUp();
    }
  });

  $('#more_glass_types').change(function () {
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

  const $frame_colors = $("#AvailableFrameColorsSection .colorContainer").html("");
  const $insert_colors = $("#AvailableInsertColorsSection .colorContainer").html("");
  AvailableColorImages.forEach((imgSrc, index) => {
    let isChecked = index === 0 ? "checked" : "";
    const html = `
            <div class="color-button-container ${index === 0 ? "selected" : ""}">
                <div class="color-button color-tooltip" data-tooltip = "${imgSrc.colorName}">
                    <img src="${src_path + imgSrc.url}" alt="Color ${index + 1}" class="color-image" />
                    <input
                        type="radio"
                        name="COLOR"
                        value="${imgSrc.value}"
                         ${isChecked}
                         hex="${imgSrc.hex}"
                         desc="${imgSrc.desc}"
                         colorName="${imgSrc.colorName}"
                        style="display:none"/>
                </div>
            </div>
        `;

    $frame_colors.append(html);
    $insert_colors.append(html);
  });

  const $opt_frame_colors = $("#OptionalFrameColorsSection .colorContainer").html("");
  const $opt_insert_colors = $("#OptionalInsertColorsSection .colorContainer").html("");

  OptionalColorImages.forEach((imgSrc, index) => {
    let isChecked = index === 0 ? "checked" : "";
    const html = `
			<div class="color-button-container ${index === 0 ? "selected" : ""}">
				<div class="color-button color-tooltip" data-tooltip = "${imgSrc.colorName}">
					<img src="${src_path + imgSrc.url}" alt="Color ${index + 1}" class="color-image" />
					<input
						type="radio"
						name="COLOR"
						value="${imgSrc.value}"
						hex="${imgSrc.hex}"
						 desc="${imgSrc.desc}"
						 colorName="${imgSrc.colorName}"
						${isChecked}
						style="display:none"
					/>
				</div>
			</div>
		`;

    $opt_frame_colors.append(html);
    $opt_insert_colors.append(html);
  });

  const $optionalfieldset_frame = $("#optionalStackFrameColors").empty();
  const $availablefieldset_frame = $("#availableStackFrameColors").empty();
  const $optionalfieldset_insert = $("#optionalStackInsertColors").empty();
  const $availablefieldset_insert = $("#availableStackInsertColors").empty();

  // Append each image
  OptionalColorImages.slice(0, 3).forEach((imgSrc, index) => {
    const html = `<img src="${src_path + imgSrc.url}" class="stacked-optional-img" />`;
    $optionalfieldset_frame.append(html);
    $optionalfieldset_insert.append(html);
  });

  AvailableColorImages.slice(0, 3).forEach((imgSrc, index) => {
    const html = `<img src="${src_path + imgSrc.url}" class="stacked-optional-img" />`;
    $availablefieldset_frame.append(html);
    $availablefieldset_insert.append(html);
  });

  $("#NAVIGATION_SPC").on('click', function (event) {
    if (currentSection == 1) {
      $("#window_position_container").show();
      if (getState("GLASS_SHAPE").includes("slim")) {
        $(`[data-id="section_slim_temp"]`).show();
      } else {
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
