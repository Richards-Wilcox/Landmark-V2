const canvas_mouse = {
x: 0, y: 0,
	is_down: false,
};

function addRenderNode() {
	const GLAZING_SECTION = 1;

	addNode({
		id: "SLIM_WINDOW_LITES",
		value: "more"
	}, []);

	addNode({
		id: "SLIM_WINDOW_SPACING",
		value: "even"
	}, []);

	addNode({
		id: "FACE_desc",
		logic: function() {
			const face_map = {
				'C': 'colonial',
				'F': 'flush',
				'V': 'plank',
				'R': 'ranch',
				'B': 'colonial_grooved',
				'S': 'ranch_grooved',
				'T': 'smooth_ranch',
			};

			const face = face_map[getState('FACE')];
			this.value = face;
		},
		value: "",
	}, [ "FACE" ]);

	addLogic("GLASS_SHAPE", function() {
		const glass_shape = $("input[name='GLASS_SHAPE']:checked").val();
		this.value = glass_shape;
		addSlimUi();
	}, [ ]);

	addLogic("GLASS_INSERT", function() {
		const glass_shape = $("input[name='GLASS_INSERT']:checked").val();
		this.value = glass_shape;

		const glass = getState("GLASS_SHAPE");
		if (glass.includes('slim')) {
			this.value = "";
		}
	}, [ "GLASS_SHAPE" ]);

	addNode({
		id: "SPECIAL_FACE",
		logic: function() {
			const glass = getState('GLASS_SHAPE');
			const face = getState("FACE_desc");

			const special_ranch = [ "colonial", "ranch" ];
			const special = glass != face && special_ranch.includes(glass) && special_ranch.includes(face);
			this.value = special;
		},
		value: false,
	}, [ "FACE_desc", "GLASS_SHAPE" ])

	addNode({
		id: "WINDOW_STATE",
		value: {
			hints: false,
			sections: [],
		},
		logic: function() {
			const face = getState('FACE_desc');
			const flush = ["flush", "plank"].includes(face);
			const num_sections = getState("NUM_OF_SEC");
			const special = getState("SPECIAL_FACE");
			const glass_shape = getState("GLASS_SHAPE");
			const single_endcap = getState("EndCaps") == "N";
			const width = getState("WIDTH");

			const state = this.value;
			const sections = state.sections;
			const num_add = Math.abs(sections.length)

			while (sections.length != num_sections) {
				if (sections.length > num_sections) {
					sections.pop();
				} else {
					sections.push({
						selected: false,
						slim_one: false,
						slim_spacing: 'even',
						shape: glass_shape,
						positions: [],
						enabled: [],
						panel_width: 0,
						panel_height: 0,
					});
				}
			}

			const has_glass = sections.some(section => {
					return section.enabled.some(x => x==true);
				});

			for (const section of sections) {
				let shape = face;
				if (flush) {
					shape = glass_shape;
				}
				if (glass_shape.includes('grand')) {
					shape = "window_gv";
				}

				let positions = getPanelPositions(shape, width);

				const section_enabled = section.enabled;
				const section_glass = section_enabled.some(x => x==true);
				if (section_glass && special) {
					shape = glass_shape;
				}

				if (has_glass && special) {
					positions = getPanelPositions(shape, width, true);
				}

				const slim_one = section.slim_one;
				const slim_spacing = section.slim_spacing;
				if (["slim_single", "slim_double"].includes(glass_shape)) {
					if (section.shape.includes("slim")) {
						shape = section.shape;
					}

					if (slim_one) {
						const slim_s = 34.344;
						const slim_l = 68.344;
						const endcap_single = 4.8125;
						const endcap_double = 7.8125;

						const window_width = shape == "slim_single" ? slim_s : slim_l;
						const endcap_offset = single_endcap ? endcap_single : endcap_double;
						positions = slim_window_locationsx_in(width, window_width, 3, endcap_offset);
					} else {
						positions = slim_getWindowPositions(shape, width, slim_spacing == 'fixed', single_endcap);
					}
				}

				const enabled = (section_enabled.length != positions.length) ?
					Array(positions.length).fill(false) : Array.from(section_enabled);
				if (special && section_glass) {
					enabled.fill(true);
				}

				if (getPanelConfigurationKey(face) == "windemere") {
					shape = (face == "colonial_grooved") ? 'colonial' : 'ranch';
				}

				section.positions = positions;
				section.shape = shape;
				section.enabled = enabled;
				section.slim_one = slim_one;
				section.slim_spacing = slim_spacing;
				section.panel_width = panelConfigurations[shape]?.panelWidth;
				section.panel_height = panelConfigurations[shape]?.panelHeight;
			}
		}
	},
	[ "WIDTH", "NUM_OF_SEC", "GLASS_SHAPE", "EndCaps", "FACE_desc", "SPECIAL_FACE",
	 "SLIM_WINDOW_SPACING", "SLIM_WINDOW_LITES" ]);

	addLogic("WINDOW_POSITION", function() {
		const glass_shape = getState("GLASS_SHAPE");
		const special = getState("SPECIAL_FACE");
		let position = $("input[name='WINDOW_POSITION']:checked").val() ?? "";

		const should_disable = special || glass_shape.includes("grand");
		$(`input[name='WINDOW_POSITION']:not([value="top"])`).prop('disabled', special);
		if (glass_shape.includes("grand")) {
			position = "top";
		}

		const sections = getState("WINDOW_STATE").sections;
		const has_glass = sections.some(section => {
				return section.enabled.some(x => x==true);
			});
		if (special && has_glass) {
			position = "top";
		}

		this.value = position;
		//if (glass_shape.includes("slim") || position == "") {
		if (position == "") {
			return;
		}

		setWindowPositions(position);
	}, [ "GLASS_SHAPE", "SPECIAL_FACE", "WINDOW_STATE" ]);

	addNode({
		id: "RENDER",
		logic: renderDoor,
		value: null,
	}, ["WIDTH", "HEIGHT", "COLOR", "NUM_OF_SEC", "FACE_desc", "FINISH", "WINDOW_STATE", "WINDOW_POSITION",
	 "GLASS_INSERT", "FRAME_COLOR", "INSERT_COLOR" ]);

	addLogic("JSON_OBJ", function () {
		this.value = JSON.stringify(getState("RENDER"))
	}, ["RENDER"]);

	$(`input[name="FACE"]`).on('change', function() {
		const face = $(this).val();
		if (face == 'C') {
			$(`#GLASS_SHAPE_COLONIAL`).click();
			setState("GLASS_SHAPE", "colonial");
		} else if (face == 'R') {
			$(`#GLASS_SHAPE_RANCH`).click();
			setState("GLASS_SHAPE", "ranch");
		}
	});

	$('#CONFIG_CANVAS')
	.on('mousemove', function(event) {
		canvas_mouse.x = event.offsetX;
		canvas_mouse.y = event.offsetY;

		if (getState("SLIM_WINDOW_LITES") == "one" && getState("GLASS_SHAPE").includes("slim")) {
			const layer_obj = getDoorInfo();
			layer_obj.windows = getState("WINDOW_STATE");
			CANVAS_PLUGIN.draw(layer_obj);
		}
	})
	.on('mousedown', function(event) {
		canvas_mouse.is_down = true;
	})
	.on('mouseup', function(event) {
		canvas_mouse.is_down = false;
	})
	.on('click', function(event) {
		if (currentSection != GLAZING_SECTION) return;

		const door_width = getState("WIDTH");
		const door_height = getState("HEIGHT");
		const num_sections = getState("NUM_OF_SEC");
		const scale = getScale(door_width, door_height);
		const [ canvas_x, canvas_y ] = getCanvasDoorPosition(door_width, door_height);
		const special_panel_config = getState("SPECIAL_FACE");

		let changed = false;
		const windows = getState("WINDOW_STATE");
		const section_heights = getSectionHeights(door_height, num_sections);
		for (const [i, section] of windows.sections.entries()) {
			const panel_width = section.panel_width * scale;
			const panel_height = section.panel_height * scale;

			const y_offset = (section_heights[i] * scale - panel_height) / 2;
			const ypos = section_heights.slice(0, i).reduce((acc, val) => acc+val, 0);
			const py = ypos * scale + canvas_y + y_offset;
			const positions = section.positions
				.map(pos => ({ x: pos * scale + canvas_x, y: py }));

			let index = -1;
			if (section.slim_one) {
				if (!section.selected) continue;
				const section_intersects = isMouseIntersect(canvas_x, ypos*scale+canvas_y,
					door_width*scale, section_heights[i]*scale);
				if (!section_intersects) continue;

				const [ mouse_x, mouse_y ] = getCanvasMousePos();
				index = section.positions.map(x => x*scale+canvas_x+panel_width/2)
					.reduce((bestIdx, currVal, currIdx, arr) => {
					const currentDist = Math.abs(currVal - mouse_x);
					const bestDist = Math.abs(arr[bestIdx] - mouse_x);
					return currentDist < bestDist ? currIdx : bestIdx;
				}, 0);
			} else {
				for (const [i, pos] of positions.entries()) {
					const intersects = isMouseIntersect(pos.x, pos.y, panel_width, panel_height);
					if (intersects) {
						index = i;
						break;
					}
				}
			}

			if (index != -1) {
				if (special_panel_config) {
					const enabled = section.enabled[0];
					windows.sections.forEach(section => section.enabled.fill(false));
					section.enabled.fill(!enabled);
				} else if (section.slim_one) {
					const val = section.enabled[index];
					section.enabled.fill(false);
					if (!val) section.enabled[index] = true;
				} else {
					section.enabled[index] = !section.enabled[index];
				}
				changed = true;
				break;
			}
		}

		if (changed) {
			$(`input[name='WINDOW_POSITION']`)
				.prop("checked", false)
				.removeAttr("checked")
				.data('wasChecked', false)
				.parent().removeClass("btn-checked");
			forceRedraw();
		}
	});
}

function addSlimUi() {
	$(`[data-id="section_slim_temp"]`).remove();
	const glass_shape = getState("GLASS_SHAPE");

	const windows = getState("WINDOW_STATE");
	if (!glass_shape.includes("slim")) {
		$(`#slim_spacing_container`).remove();
		windows.sections.forEach(section => {
			section.selected = false;
			section.slim_one = false;
		});
		return;
	}

	const door_width = getState("WIDTH");
	const door_height = getState("HEIGHT");
	const scale = getScale(door_width, door_height);
	const [ canvas_x, canvas_y ] = getCanvasDoorPosition(door_width, door_height);
	const canvas = $("#CONFIG_CANVAS")[0];
	const canvas_pos = $("#CONFIG_CANVAS").offset();
	const rect = canvas.getBoundingClientRect();
	const cx = door_width * scale + canvas_x;
	const menu_y = canvas_pos.top + (canvas_y + door_height * scale/2) * (rect.height/canvas.height);

	const num_sections = getState("NUM_OF_SEC");
	const section_heights = getSectionHeights(door_height, num_sections);
	for (const [i, section] of windows.sections.entries()) {
		const ypos = section_heights.slice(0, i).reduce((acc, val) => acc+val, 0);
		const cy = (ypos + section_heights[i]/2) * scale + canvas_y;
		const x = cx * rect.width / canvas.width + canvas_pos.left;
		const y = cy * rect.height / canvas.height + canvas_pos.top;

		$(`
			<div class="rw-button-container-inner" data-id="section_slim_temp">
				<div class="rw-sliding-button">
					<i class="fas fa-pencil"></i>
					<input type="radio" style="display:none;" id="section_slim_single_${i}" name="section_slim_${i}"
						value="slim_single" />
				</div>
			</div>`)
		.css({
			'position': 'absolute',
			'left': `${x}px`,
			'top': `${y}px`,
			'transform': 'translate(0%, -50%)',
			'min-width': '0',
			'width': '40px',
		}).appendTo('body')
		.on('click', function(event) {
			event.stopPropagation();
			$(`[data-id="section_slim_temp"]`).removeClass('selected');
			$(this).addClass('selected');
			$("#slim_spacing_container").remove();
			$(`
			   <div class="slim-options-container" id="slim_spacing_container">
					 <div class="rw-button" id="SLIM_WINDOW_LITES_ONE" >
					   <label for="SLIM_WINDOW_LITES_ONE">One Lite</label>
					   <input type="radio" style="display:none;" name="SLIM_WINDOW_LITES" desc="One Lite" value="one" code="one" checked >
					 </div>
					 <div class="rw-button" id="SLIM_WINDOW_LITES_MORE" >
					   <label for="SLIM_WINDOW_LITES_MORE">More than One</label>
					   <input type="radio" style="display:none;"  name="SLIM_WINDOW_LITES" desc="More than One" value="more" code="more" >
					 </div>
					 <div class="rw-button" id="SLIM_WINDOW_SPACING_EVEN" >
					   <label for="SLIM_WINDOW_SPACING_EVEN">Evenly Spaced</label>
					   <input type="radio" style="display:none;" name="SLIM_WINDOW_SPACING" desc="Evenly Spaced" value="even" code="even" checked >
					 </div>
					 <div class="rw-button" id="SLIM_WINDOW_SPACING_FIXED" >
					   <label for="SLIM_WINDOW_SPACING_FIXED">Fixed End</label>
					   <input type="radio" style="display:none;" name="SLIM_WINDOW_SPACING" desc="Evenly Spaced Fixed End" value="fixed" code="fixed" >
					 </div>

					<div class="rw-button panel-button" id="SLIM_WINDOW_SINGLE">
						<label for="GLASS_SHAPE_3">Slim Single</label>
						<input type="radio" id="GLASS_SHAPE_3" name="GLASS_SHAPE" value="slim_single" >
					</div>

					<div class="panel-layout" id="SLIM_WINDOW_DOUBLE">
						<div class="rw-button panel-button">
							<label for="GLASS_SHAPE_MORE_0">Slim Double</label>
							<input type="radio" id="GLASS_SHAPE_MORE_0" name="GLASS_SHAPE" value="slim_double" >
						</div>
					</div>
			   </div>`)
			.css({
				'position': 'absolute',
				'left': `${x+60}px`,
				'top': `${menu_y}px`,
				'transform': 'translate(0%, -50%)',
			})
			.appendTo('body');

			$(document).on('click.slim_menu', function(event) {
				const $menu = $('#slim_spacing_container');
				// If the click was NOT on the menu AND not on a child of the menu
				if (!$menu.is(event.target) && $menu.has(event.target).length === 0) {
					$menu.remove();
					$document.off('click.slim_menu');
				}
			});

			$("#SLIM_WINDOW_LITES_ONE").on('click', function() {
				const state = getState("WINDOW_STATE");
				state.sections[i].slim_one = true;
				setState("SLIM_WINDOW_LITES", "one");
			});

			$("#SLIM_WINDOW_LITES_MORE").on('click', function() {
				const state = getState("WINDOW_STATE");
				state.sections[i].slim_one = false;
				setState("SLIM_WINDOW_LITES", "more");
			});

			$("#SLIM_WINDOW_SPACING_EVEN").on('click', function() {
				const state = getState("WINDOW_STATE");
				state.sections[i].slim_spacing = 'even';
				setState("SLIM_WINDOW_SPACING", "even");
			});

			$("#SLIM_WINDOW_SPACING_FIXED").on('click', function() {
				const state = getState("WINDOW_STATE");
				state.sections[i].slim_spacing = 'fixed';
				setState("SLIM_WINDOW_SPACING", "fixed");
			});

			$("#SLIM_WINDOW_SINGLE").on('click', function() {
				const state = getState("WINDOW_STATE");
				state.sections[i].shape = "slim_single";
				setState("GLASS_SHAPE", "slim_single");
			});

			$("#SLIM_WINDOW_DOUBLE").on('click', function() {
				const state = getState("WINDOW_STATE");
				state.sections[i].shape = "slim_double";
				setState("GLASS_SHAPE", "slim_double");
			});

			const state = getState("WINDOW_STATE");
			state.sections.forEach(section => {
				section.selected = false;
			});
			state.sections[i].selected = true;
			forceRedraw();
		});
	}
}

function getCanvasMousePos() {
	const canvas = $("#CONFIG_CANVAS")[0];
	const rect = canvas.getBoundingClientRect();

	const mouse_x = canvas_mouse.x * (canvas.width / rect.width);
	const mouse_y = canvas_mouse.y * (canvas.height / rect.height);
	return [ mouse_x, mouse_y ];
}

function isMouseIntersect(x, y, width, height) {
	const [ mouse_x, mouse_y ] = getCanvasMousePos();
	const intersect_x = mouse_x > x && mouse_x < (x + width);
	const intersect_y = mouse_y > y && mouse_y < (y + height);
	return intersect_x && intersect_y;
}

function forceRedraw() {
	setState("WINDOW_STATE", getState("WINDOW_STATE"));
}

async function renderDoor() {
	const layer_obj = getDoorInfo();
	this.value = layer_obj;
	await CANVAS_PLUGIN.draw(layer_obj);
}

function setWindowPositions(position) {
	const state = getState("WINDOW_STATE");
	const num_sections = getState("NUM_OF_SEC");

	state.sections.forEach(section => {
		section.enabled.fill(false);
	});

	if (position == "top") {
		const section = state.sections[0];
		section.enabled.fill(true);
		if (getState("SPECIAL_FACE")) {
			getNode("WINDOW_STATE").logic();
		}
	}
	if (position == "left" || position == "both") {
		state.sections.forEach(section => {
			section.enabled[0] = true;
		});
	}
	if (position == "center") {
		state.sections.forEach(section => {
			const enabled = section.enabled;
			const offset = Math.floor(enabled.length / 2);
			enabled[offset] = true;
			if (enabled.length % 2 == 0) {
				enabled[offset - 1] = true;
			}
		});
	}
	if (position == "right" || position == "both") {
		state.sections.forEach(section => {
			if (section.slim_one && position == "both")
				return;
			const enabled = section.enabled;
			enabled[enabled.length - 1] = true;
		});
	}
}

function getPanelConfigurationKey(panel_type) {
	const windemere = ['colonial_grooved', 'smooth_ranch', 'ranch_grooved'];
	if (windemere.includes(panel_type)) {
		return 'windemere';
	}

	return panel_type;
}

/**
 * Finds the correct rule for a door type based on width
 */
function getRule(type, doorWidth) {
	const configKey = getPanelConfigurationKey(type);
	const rules = panelConfigurations[configKey]?.sectionRules;
	return rules?.find(r => doorWidth >= r.sectionWidth.min && doorWidth <= r.sectionWidth.max);
}

function getPanelQuantity(panel_type, door_width) {
	const panel_qty = getRule(panel_type, door_width)?.qtyOfPanels;
	if (panel_type == "colonial_grooved") {
		return panel_qty * 2;
	}

	return panel_qty;
}

function slim_getWindowQuantity(panel_type, door_width, fixed_end, single_endcap) {
    const slim_s = 34.344;
    const slim_l = 68.344;
    const slim_h = 7.535;

    const endcap_single = 4.8125;
    const endcap_double = 7.8125;

	if (panel_type == "slim_single")
		return slim_single_per_section(door_width, fixed_end, single_endcap);
	if (panel_type == "slim_double")
		return slim_double_per_section(door_width, fixed_end, single_endcap);
}

function slim_getWindowPositions(panel_type, door_width, fixed_end, single_endcap) {
    const slim_s = 34.344;
    const slim_l = 68.344;
    const slim_h = 7.535;

    const endcap_single = 4.8125;
    const endcap_double = 7.8125;

	const num_windows = slim_getWindowQuantity(panel_type, door_width, fixed_end, single_endcap);

	const window_width = panel_type == "slim_single" ? slim_s : slim_l;
	const endcap_offset = fixed_end ? (single_endcap ? endcap_single : endcap_double) : 0;
	return slim_window_locationsx_in(door_width, window_width, num_windows, endcap_offset);
}

// int, bool, bool
function slim_single_per_section(width_in, fixed_end, single_endcap) {
	const even_single = [
		{ min: 96, max: 132, qty: 2 },
		{ min: 133, max: 175, qty: 3 },
		{ min: 176, max: 217, qty: 4 },
		{ min: 218, max: 242, qty: 5 }
	];

	const fixed_single = [
		{ min: 96, max: 128, qty: 2 },
		{ min: 129, max: 170, qty: 3 },
		{ min: 171, max: 213, qty: 4 },
		{ min: 214, max: 242, qty: 5 }
	];

	const even_double = [
		{ min: 96, max: 136, qty: 2 },
		{ min: 137, max: 179, qty: 3 },
		{ min: 180, max: 222, qty: 4 },
		{ min: 223, max: 242, qty: 5 }
	];

	const fixed_double = [
		{ min: 96, max: 134, qty: 2 },
		{ min: 135, max: 177, qty: 3 },
		{ min: 178, max: 219, qty: 4 },
		{ min: 220, max: 242, qty: 5 }
	];

	var rules = null;
	if (!fixed_end && single_endcap) {
		rules = even_single;
	} else if (fixed_end && single_endcap) {
		rules = fixed_single;
	} else if (!fixed_end && !single_endcap) {
		rules = even_double;
	} else if (fixed_end && !single_endcap) {
		rules = fixed_double;
	}

	for (var i = 0; i < rules.length; i++) {
		var rule = rules[i]
		if (width_in >= rule.min && width_in <= rule.max) {
			return rule.qty;
		}
	}

	// error
	return 0;
}

function slim_double_per_section(width_in, fixed_end, single_endcap) {
	const even_single = [
		{ min: 96, max: 158, qty: 1 }, // disabled
		{ min: 159, max: 234, qty: 2 },
		{ min: 235, max: 242, qty: 3 }
	];

	const fixed_single = [
		{ min: 96, max: 154, qty: 1 }, // disabled
		{ min: 155, max: 230, qty: 2 },
		{ min: 231, max: 242, qty: 3 }
	];

	const even_double = [
		{ min: 96, max: 161, qty: 1 }, // disabled
		{ min: 162, max: 238, qty: 2 },
		{ min: 239, max: 242, qty: 3 }
	];

	const fixed_double = [
		{ min: 96, max: 160, qty: 1 },
		{ min: 161, max: 236, qty: 2 },
		{ min: 237, max: 242, qty: 3 }
	];

	var rules = null;
	if (!fixed_end && single_endcap) {
		rules = even_single;
	} else if (fixed_end && single_endcap) {
		rules = fixed_single;
	} else if (!fixed_end && !single_endcap) {
		rules = even_double;
	} else if (fixed_end && !single_endcap) {
		rules = fixed_double;
	}

	for (var i = 0; i < rules.length; i++) {
		var rule = rules[i];
		if (width_in >= rule.min && width_in <= rule.max) {
			return rule.qty;
		}
	}

	// error
	return 0;
}

// door width (inches), window width (inches)
function slim_window_locationsx_in(width_in, window_in, num_windows, fixed_offset_in) {
	const offset_fixed = fixed_offset_in;
	const spacing_fixed = (width_in - 2 * offset_fixed - window_in) / (num_windows - 1);
	const spacing_even = (width_in - num_windows * window_in) / (num_windows + 1) + window_in;
	const offset_even = spacing_even - window_in;

	const offset = fixed_offset_in == 0 ? offset_even : offset_fixed;
	var spacing = fixed_offset_in == 0 ? spacing_even : spacing_fixed;

	// this will occur due to a div by 0, ok to set to zero since there will only be one window
	if (isNaN(spacing) || !isFinite(spacing)) {
		spacing = 0;
	}

	const results = [];
	for (let i = 0; i < num_windows; i++) {
		results.push(offset + i * spacing);
	}

	return results;
}

// order: bottom to top
function getSectionHeights(door_height, num_sections) {
	const average_height = door_height / num_sections;
	if (average_height < 18 || average_height > 24) {
		return [];
	}

	const section1 = Math.floor(average_height / 3) * 3
	const section2 = Math.ceil(average_height/3) * 3;

	const diff = average_height - section1;
	const percent = diff / 3;
	const num_section1 = Math.round((1 - percent) * num_sections);
	const num_section2 = Math.round(num_sections - num_section1);

	const stack = [ ...Array(num_section1).fill(section1), ...Array(num_section2).fill(section2) ];

	const heights = Array(num_sections).fill(0);

	let offset = 0;
	let top = false;

	heights[offset] = stack.pop();
	heights[num_sections - offset - 1] = stack.pop();
	offset++;
	while (stack.length > 0) {
		if (top) {
			heights[offset] = stack.pop();
			offset++;
		} else {
			heights[num_sections - offset - 1] = stack.pop();
		}
		top = !top;
	}

	return heights;
}

function getScale(door_width, door_height) {
	const canvas = $("#CONFIG_CANVAS")[0];
	const multiplier = 0.75;
	return Math.min(canvas.width * multiplier / door_width, canvas.height * multiplier / door_height);
}

function getCanvasDoorPosition(door_width, door_height) {
	const scale = getScale(door_width, door_height);

	const canvas = $("#CONFIG_CANVAS")[0];
	const w = door_width * scale, h = door_height * scale;
	const x = (canvas.width - w) / 2, y = (canvas.height - h) / 2;
	return [x, y];
}

// get inch offsets from the leftmost point of the door "0"
function getPanelPositions(panel_type, door_width, special=false) {
	const rule = getRule(panel_type, door_width);
	if (!rule) return [];
	let panel_qty = rule.qtyOfPanels;
	let muttSpacing = rule.muttSpacing;
	if (special && "special" in rule) {
		panel_qty = rule.special.qtyOfPanels;
		muttSpacing = rule.special.muttSpacing;
	}
	const panel_width = panelConfigurations[getPanelConfigurationKey(panel_type)].panelWidth;

    const startX = (door_width - (panel_qty * panel_width + (panel_qty - 1) * muttSpacing)) / 2;

	let positions_x = [];
    for (let p = 0; p < panel_qty; p++) {
        const px = startX + p * (panel_width + muttSpacing);
		positions_x.push(px);
	}

	if (panel_type == "colonial_grooved") {
		const offset = panel_width - panelConfigurations.colonial.panelWidth;
		positions_x = positions_x.flatMap(pos => [pos, pos + offset]);
	}

	return positions_x;
}

function getDoorInfo() {
	const url_woodtexture = `/HTML/products/162059085/images/woodtexture_dark.png`;
	const url_woodgrain = `/HTML/products/162059085/images/woodgrain_dark.png`;
	const url_stucco = `/HTML/products/162059085/images/stucco4.png`;

	let scale = 0.03;

	let url = url_woodtexture;

	// stucco
	if (getState('FINISH') == 'S') {
		url = url_stucco;
		scale = 0.005;
	}

	// honey cedar, cocoa hickory
	const woodgrains = ['X', 'Y'];
	if (woodgrains.includes(getState('COLOR').value)) {
		url = url_woodgrain;
		scale = 0.05;
	}

	const face = getState('FACE_desc');
	const flush = ["flush", "plank"].includes(face);
	const glass_shape = getState("GLASS_SHAPE") ?? "";
	const special = getState("SPECIAL_FACE");

	const width = getState("WIDTH");
	const height = getState("HEIGHT");
	const num_sections = getState("NUM_OF_SEC");

	const [ mouse_x, mouse_y ] = getCanvasMousePos();
	const window_info = getState("WINDOW_STATE");
	const section_heights = getSectionHeights(height, num_sections);

	let sum = 0;
	const sections = [];
	for (const [i, section_info] of window_info.sections.entries()) {
		const info = { ...section_info };
		info.height = section_heights[i];
		info.ypos = sum;

		sections.push(info);
		sum += section_heights[i];
	}

	const color = getState("COLOR");
	const frame_color = getState("FRAME_COLOR");
	const insert_color = getState("INSERT_COLOR");
	const insert = getState("GLASS_INSERT");

	const [x, y] = getCanvasDoorPosition(width, height);

	let hints = window_info.hints;
	if (glass_shape.includes('grand')) {
		hints = false;
	}

	return {
		mouse_x: mouse_x,
		mouse_y: mouse_y,
		xpos: x,
		ypos: y,

		door_width: width,
		door_height: height,
		num_sections: num_sections,

		special_panel_config: special,
		glass_shape: glass_shape,

		background: {
			color: color.hex,
			pattern_url: url,
			pattern_scale: scale,
			frame_color: (frame_color ? frame_color : color).hex,
			insert_color: (insert_color ? insert_color : color).hex,
		},

		insert: insert,

		sections: sections,
		scale: getScale(width, height),

		face: face,
		misc: {
			labels: true,
		},

		draw_hints: hints,
	}
}

function addChangeEvents() {
	addRenderNode()
}
