/**
 * REFACTORED LOAD_CANVAS_LANDMARK.js
 */

function loadImageCanvasPlugin(url, elem) {
    if (url === "")
        return ""
    return new Promise((resolve, reject) => {
        elem.onload = () => resolve(elem);
        elem.onerror = reject;
        elem.src = url;
    });
}

const DoorUtils = {

    // Private cache object
    _textureCache: {},

	_imageCache: {},

    /**
     * Creates or retrieves a cached canvas pattern
     */
    createTexturePattern: async function(ctx, imageUrl) {
        // 1. Check if we already have this pattern cached
        if (this._textureCache[imageUrl]) {
            return this._textureCache[imageUrl];
        }

        return new Promise((resolve) => {
            const img = new Image();
            img.src = imageUrl;

            img.onload = () => {
                const pattern = ctx.createPattern(img, 'repeat');

                // 2. Save the pattern to the cache
                this._textureCache[imageUrl] = pattern;

                resolve(pattern);
            };

            img.onerror = () => {
                console.error("Failed to load texture at:", imageUrl);
                resolve(null);
            };
        });
    },

	createImage: async function(url) {
		if (this._imageCache[url]) {
			return this._imageCache[url];
		}

		return new Promise((resolve) => {
			const img = new Image();
			img.src = url;

			img.onload = () => {
				this._imageCache[url] = img;
				resolve(img);
			};

			img.onerror = () => {
                console.error("Failed to load image at:", url);
                resolve(null);
			};
		});
	},

    /**
     * Determines shadow/highlight colors based on background luminance
     */
    getShadowSettings: (bgColor) => {
        const ctx = document.createElement("canvas").getContext("2d");
        ctx.fillStyle = bgColor;
        const color = ctx.fillStyle; // Normalizes hex/rgb/name

        let r, g, b;
        if (color.startsWith("rgb")) {
            [r, g, b] = color.match(/\d+/g).map(Number);
        } else {
            const hex = color.replace("#", "");
            r = parseInt(hex.slice(0, 2), 16);
            g = parseInt(hex.slice(2, 4), 16);
            b = parseInt(hex.slice(4, 6), 16);
        }

        const avg = (r + g + b) / 3;
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

        return {
            dark: avg < 40 ? "rgba(255,255,255,0.22)" : (avg > 220 ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.45)"),
            fade: avg < 40 ? "rgba(255,255,255,0)" : "rgba(0,0,0,0)",
            isDark: luminance < 65,
            isLight: luminance > 200,
			color: bgColor,
        };
    },

    /*
     * Draws a beveled/shaded panel with 4-way gradients
     */
    drawBeveledPanel: (ctx, x, y, w, h, inset, colors) => {
        const { dark, fade } = colors;
        const iX = x + inset, iY = y + inset, iW = w - inset * 2, iH = h - inset * 2;
        if (iW <= 0 || iH <= 0) return;

        const drawGrad = (x0, y0, x1, y1, pts) => {
            const g = ctx.createLinearGradient(x0, y0, x1, y1);
            g.addColorStop(0, dark); g.addColorStop(1, fade);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.moveTo(pts[0], pts[1]);
            for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
            ctx.closePath(); ctx.fill();
        };

        // Top, Left, Bottom, Right
        drawGrad(0, y, 0, iY, [x, y, x + w, y, iX + iW, iY, iX, iY]);
        drawGrad(x, 0, iX, 0, [x, y, iX, iY, iX, iY + iH, x, y + h]);
        drawGrad(0, iY + iH, 0, y + h, [iX, iY + iH, iX + iW, iY + iH, x + w, y + h, x, y + h]);
        drawGrad(iX + iW, 0, x + w, 0, [iX + iW, iY, x + w, y, x + w, y + h, iX + iW, iY + iH]);
    }
};

function drawSectionPanel(ctx, section, info) {
	const scale = info.scale;
	const panel_width = section.panel_width * scale;
	const panel_height = section.panel_height * scale;
	const colors = info.colors

	const y_offset = (section.height * scale - panel_height) / 2;
	const py = section.ypos * scale + info.ypos + y_offset;

    for (const px of section.positions) {
		const x = px * scale + info.xpos;
        DoorUtils.drawBeveledPanel(ctx, x, py, panel_width, panel_height, 2 * scale, colors);
    }
}

function drawPlankSection(ctx, section, info) {
	const line_map = {
		'24': 5,
		'21': 4,
		'18': 3
	};

	const sY = section.ypos * info.scale + info.ypos;
	const width = info.door_width * info.scale;

	ctx.save();
	ctx.strokeStyle = "rgba(0,0,0,0.55)";
	ctx.lineWidth = 1;

	ctx.shadowBlur = 2;
	ctx.shadowOffsetX = -1;
	ctx.shadowColor = info.colors.isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.45)";

	const sH = section.height * info.scale;
	const num_lines = line_map[String(section.height)];
	const spacing = sH / (num_lines+1);

	for (let p = 1; p <= num_lines; p++) {
		ctx.beginPath(); ctx.moveTo(info.xpos, sY + spacing * p);
		ctx.lineTo(info.xpos + width, sY + spacing * p); ctx.stroke();
	}
	ctx.restore();
}

function drawGroovedPanel(ctx, px, py, pW, pH, num_grooves, colors) {
	// Inset Shadow
	ctx.save();
	ctx.beginPath();
	ctx.rect(px, py, pW, pH);
	ctx.clip();

	//ctx.shadowBlur = s.colors.isDark ? 8 : 12; // Slightly higher for inner shadows
	ctx.shadowBlur = 8;
	ctx.shadowColor = colors.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.7)";
	ctx.lineWidth = 4;

	// Offset the stroke to push shadow inward
	ctx.strokeRect(px - 2, py - 2, pW + 4, pH + 4);
	ctx.restore();

	// --- VERTICAL INSET LINES ---
	const spacing = pW / (num_grooves + 1); // Divide width into 14 equal slots
	const verticalPadding = 0;            // Inset from top and bottom edges

	ctx.save();
	ctx.lineWidth = colors.isLight ? 1 : 1.2;

	for (let i = 1; i <= num_grooves; i++) {
		const lx = px + (spacing * i);
		const top = py + verticalPadding;
		const bottom = py + pH - verticalPadding;

		// Draw Shadow/Highlight for depth
		if (colors.isLight) {
			ctx.strokeStyle = "rgba(0,0,0,0.15)";
		} else {
			// Dark doors: Use the background color with a shadow effect
			ctx.strokeStyle = colors.color;
			ctx.shadowColor = "rgba(0,0,0,0.45)";
			ctx.shadowBlur = 2;
			ctx.shadowOffsetX = -1;
		}

		ctx.beginPath();
		ctx.moveTo(lx, top);
		ctx.lineTo(lx, bottom);
		ctx.stroke();

		// Add a highlight on the opposite side for dark colors
		if (!colors.isLight) {
			ctx.save();
			ctx.strokeStyle = "rgba(255,255,255,0.2)";
			ctx.shadowBlur = 0;
			ctx.beginPath();
			ctx.moveTo(lx + 1, top);
			ctx.lineTo(lx + 1, bottom);
			ctx.stroke();
			ctx.restore();
		}
	}
	ctx.restore();
}

function drawColonialGroovedSection(ctx, section, info) {
    const pW = section.panel_width * info.scale;
    const pH = section.panel_height * info.scale;

	const num_grooves = 5;

	const y_offset = (section.height * info.scale - pH) / 2;
	const py = section.ypos * info.scale + info.ypos + y_offset;
    for (const x of section.positions) {
		const px = x * info.scale + info.xpos;
        drawGroovedPanel(ctx, px, py, pW, pH, num_grooves, info.colors);
    }
}

function drawRanchGroovedSection(ctx, section, info) {
    drawSmoothRanchSection(ctx, section, info, true);
}

function drawSmoothRanchSection(ctx, section, info, grooved=false) {
    const pW = section.panel_width * info.scale;
    const pH = section.panel_height * info.scale;

	const num_grooves = grooved ? 13 : 0;

	const y_offset = (section.height * info.scale - pH) / 2;
	const py = section.ypos * info.scale + info.ypos + y_offset;
    for (const x of section.positions) {
		const px = x * info.scale + info.xpos;
        drawGroovedPanel(ctx, px, py, pW, pH, num_grooves, info.colors);
    }
}

function drawInsertStockton(ctx, x, y, width, height, scale, color, num_vlines=1, arched=false, flip=false) {
	const muntinWidth = 1 * scale;
	const framePad = (1.33 + 0.5) * scale;
	ctx.save();
	ctx.strokeStyle = color;
	ctx.lineWidth = muntinWidth;
	ctx.lineCap = "square";

	ctx.beginPath();
	// vertical divider
	const spacing = (width-2*framePad-2*muntinWidth)/(num_vlines+1);
	for (let i = 0; i < num_vlines; i++) {
		const v_x = x+framePad+muntinWidth + spacing*(i+1);
		ctx.moveTo(v_x, y+framePad);
		ctx.lineTo(v_x, y+height-framePad);
	}

	// horizontal divider
	const v_y = y + height/2;
	ctx.moveTo(x+framePad, v_y);
	ctx.lineTo(x+width-framePad, v_y);
	ctx.closePath();

	ctx.lineWidth = muntinWidth + 1;
	ctx.strokeStyle = 'rgba(0,0,0,0.2)';
	ctx.stroke();

	ctx.strokeStyle = color;
	ctx.lineWidth = muntinWidth;
	ctx.stroke();
	ctx.strokeRect(x+framePad,y+framePad,width-2*framePad,height-2*framePad);

	if (arched) {
		ctx.beginPath();
		//ctx.fillStyle = "red";
		ctx.fillStyle = color
		const w = (width-2*framePad);
		const h = (5/8) * (height-2*framePad-muntinWidth)/2;
		const radius = (w*w + h*h) / (2*h);
		const angle = Math.asin(w/radius);
		const offset = Math.PI*3/2;
		ctx.arc(flip ? (x+framePad) : (x+width-framePad),
			y+framePad+muntinWidth/2+radius,
			radius, offset-(flip ? 0 : angle), offset+(flip ? angle : 0));
		ctx.lineTo(x+width-framePad,y+framePad+muntinWidth/2);
		ctx.lineTo(x+framePad,y+framePad+muntinWidth/2);
		ctx.lineTo(x+framePad,y+framePad+muntinWidth/2+(flip ? 0 : h));

		ctx.closePath();
		ctx.fill();
	}
	ctx.restore();
}

function drawInsertStockbridge(ctx, x, y, width, height, scale, color, num_vlines=1, arched=false, flip=false) {
	const muntinWidth = 1 * scale;
	const framePad = (1.33 + 0.5) * scale;
	ctx.save();
	ctx.strokeStyle = color;
	ctx.lineWidth = muntinWidth;
	ctx.lineCap = "square";

	ctx.beginPath();
	// vertical divider
	const spacing = (width-2*framePad-2*muntinWidth)/(num_vlines+1);
	for (let i = 0; i < num_vlines; i++) {
		const v_x = x+framePad+muntinWidth + spacing*(i+1);
		ctx.moveTo(v_x, y+framePad);
		ctx.lineTo(v_x, y+height-framePad);
	}

	ctx.closePath();

	ctx.lineWidth = muntinWidth + 1;
	ctx.strokeStyle = 'rgba(0,0,0,0.2)';
	ctx.stroke();

	ctx.strokeStyle = color;
	ctx.lineWidth = muntinWidth;
	ctx.stroke();
	ctx.strokeRect(x+framePad,y+framePad,width-2*framePad,height-2*framePad);

	if (arched) {
		ctx.beginPath();
		//ctx.fillStyle = "red";
		ctx.fillStyle = color
		const w = (width-2*framePad);
		const h = (5/8) * (height-2*framePad-muntinWidth)/2;
		const radius = (w*w + h*h) / (2*h);
		const angle = Math.asin(w/radius);
		const offset = Math.PI*3/2;
		ctx.arc(flip ? (x+framePad) : (x+width-framePad),
			y+framePad+muntinWidth/2+radius,
			radius, offset-(flip ? 0 : angle), offset+(flip ? angle : 0));
		ctx.lineTo(x+width-framePad,y+framePad+muntinWidth/2);
		ctx.lineTo(x+framePad,y+framePad+muntinWidth/2);
		ctx.lineTo(x+framePad,y+framePad+muntinWidth/2+(flip ? 0 : h));

		ctx.closePath();
		ctx.fill();
	}

	ctx.restore();
}

function drawInsertWaterton(ctx, x, y, width, height, scale, color, num_diamonds=1) {
	const muntinWidth = 1 * scale;
	const framePad = (1.33 + 0.5) * scale;

	ctx.save();
    ctx.strokeStyle = color;
	ctx.lineWidth = muntinWidth;
	ctx.lineCap = "square";

    const midY = y + height / 2;
    const diamondWidth = height - framePad*2 - muntinWidth;

    // Create Diamond Path
    ctx.beginPath();

	const spacing = (width-2*framePad-(2+num_diamonds-1)*muntinWidth)/num_diamonds;
	for (let i = 0; i < num_diamonds; i++) {
		// Diamond Coordinates (relative to the right section)
		const offsetX = x +framePad + (i+1)*muntinWidth + i*spacing;
		const diamondCenterX = offsetX + spacing/2;

		ctx.moveTo(diamondCenterX - diamondWidth / 2, midY); // Left
		ctx.lineTo(diamondCenterX, midY - diamondWidth / 2); // Top
		ctx.lineTo(diamondCenterX + diamondWidth / 2, midY); // Right
		ctx.lineTo(diamondCenterX, midY + diamondWidth / 2); // Bottom
		ctx.lineTo(diamondCenterX - diamondWidth / 2, midY); // Left

		// From divider to diamond
		ctx.moveTo(offsetX, midY);
		ctx.lineTo(diamondCenterX - diamondWidth / 2, midY);

		// From diamond to outer frame
		ctx.moveTo(diamondCenterX + diamondWidth / 2, midY);
		ctx.lineTo(offsetX + spacing + muntinWidth/2, midY);
	}

	for (let i = 1; i < num_diamonds; i++) {
		const offsetX = x +framePad + (i+1)*muntinWidth + i*spacing - muntinWidth/2;
		ctx.moveTo(offsetX, y+framePad);
		ctx.lineTo(offsetX, y+height-framePad);
	}

    ctx.closePath();

	ctx.lineWidth = muntinWidth + 1;
	ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.stroke();

	ctx.strokeStyle = color;
	ctx.lineWidth = muntinWidth;
	ctx.stroke();
	ctx.strokeRect(x+framePad,y+framePad,width-2*framePad,height-2*framePad);

	ctx.restore()
}

function drawInsertPrairie(ctx, x, y, width, height, scale, color) {
	const muntinWidth = 1 * scale;
	const framePad = (1.33 + 0.5) * scale;
	ctx.save();

	// Distance from glass edge to the bar
	const gridOffset = 2 * scale + framePad;

    ctx.strokeStyle = color;
	ctx.lineWidth = muntinWidth;

    // Vertical Bars
	ctx.beginPath();
	ctx.moveTo(x + gridOffset, y+framePad);
	ctx.lineTo(x + gridOffset, y + height-framePad);
	ctx.moveTo(x + width - gridOffset, y+framePad);
	ctx.lineTo(x + width - gridOffset, y + height - framePad);

    // Horizontal Bars
	ctx.moveTo(x+framePad, y + gridOffset);
	ctx.lineTo(x + width-framePad, y + gridOffset);
	ctx.moveTo(x+framePad, y + height - gridOffset);
	ctx.lineTo(x + width-framePad, y + height - gridOffset);

	ctx.closePath();

	ctx.lineWidth = muntinWidth + 1;
	ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.stroke();

	ctx.strokeStyle = color;
	ctx.lineWidth = muntinWidth;
	ctx.stroke();
	ctx.strokeRect(x+framePad,y+framePad,width-2*framePad,height-2*framePad);

	ctx.restore()
}

function drawInsertCascade(ctx, x, y, width, height, scale, color, num_vlines=1) {
	const muntinWidth = 1 * scale;
	const framePad = (1.33 + 0.5) * scale;
	ctx.save();
	//ctx.strokeStyle = 'yellow';
	ctx.strokeStyle = color;
	ctx.lineWidth = muntinWidth;
	ctx.lineCap = "square";

	ctx.beginPath();
	// vertical divider
	const spacing = (width-2*framePad-2*muntinWidth)/(num_vlines+1);
	for (let i = 0; i < num_vlines; i++) {
		const v_x = x+framePad+muntinWidth + spacing*(i+1);
		ctx.moveTo(v_x, y+framePad);
		ctx.lineTo(v_x, y+height-framePad);
	}

	// horizontal divider
	const v_y = y + height/2;
	ctx.moveTo(x, v_y);
	ctx.lineTo(x+width, v_y);
	ctx.closePath();

	ctx.lineWidth = muntinWidth + 1;
	ctx.strokeStyle = 'rgba(0,0,0,0.2)';
	ctx.stroke();

	ctx.strokeStyle = color;
	ctx.lineWidth = muntinWidth;
	ctx.stroke();
	ctx.strokeRect(x+framePad,y+framePad,width-2*framePad,height-2*framePad);

	ctx.beginPath();
	//ctx.fillStyle = "red";
	ctx.fillStyle = color
	const w = (width-2*framePad)/2;
	const h = (height-2*framePad-3*muntinWidth)/4;
	const radius = (w*w + h*h) / (2*h);
	const angle = Math.asin(w/radius);
	const offset = Math.PI*3/2;
	ctx.arc(x+width/2,y+framePad+muntinWidth/2+radius,radius,offset-angle,offset+angle);
	ctx.lineTo(x+width-framePad,y+framePad+muntinWidth/2);
	ctx.lineTo(x+framePad,y+framePad+muntinWidth/2);
	ctx.lineTo(x+framePad,y+framePad+muntinWidth/2+h);

	ctx.closePath();
	ctx.fill();


	ctx.restore()
}

async function drawGrandviewArched(ctx, px, py, pW, pH, info, index) {
	const arched_heights = [ 12.51, 14.46, 15.75, ];
	const spacing_4 = [ 10.25, 8.40, 8.40, 10.25 ];
	const scale = info.scale;
	const muntinWidth = 0.76 * scale;
	const framePad = 3.18/2 * scale;

	ctx.beginPath();
	const flip = Boolean(index%2);
	const w = pW;
	const h = pH-10.56*scale;
	const radius = (w*w + h*h) / (2*h);
	const angle = Math.asin(w/radius)
	const offset = Math.PI*3/2;
	ctx.arc(flip ? (px) : (px+pW), py+radius, radius, offset-(flip ? 0 : angle), offset+(flip ? angle : 0));
	ctx.lineTo(px+pW, py+pH);
	ctx.lineTo(px, py+pH);
	ctx.lineTo(px, py+(flip ? pH : h));
	ctx.closePath()

	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(0,0,0,0.2)";
	ctx.stroke();

	const deco_offset = framePad + 0.2*scale;
	if (info.glass_shape == "grand_wrought_iron_double_arched") {
		const image = await DoorUtils.createImage(`/HTML/products/162059085/images/wrought_iron_arched.svg`);

		ctx.save();
		if (flip) {
			ctx.translate(px+pW-deco_offset, py+deco_offset);
			ctx.scale(-1, 1);
			ctx.drawImage(image, 0, 0, pW-2*deco_offset, pH-2*deco_offset);
		} else {
			ctx.drawImage(image, px+deco_offset, py+deco_offset, pW-2*deco_offset, pH-2*deco_offset);
		}
		ctx.restore();

		const framePad = 3.1 * scale;
		// frame
		ctx.lineWidth = scale;
		ctx.lineCap = "square";
		ctx.strokeStyle = "black";
		ctx.beginPath();
		const radius2 = radius-framePad/2;
		const angle2 = Math.asin((w-framePad/2)/radius2);
		const angle2_1 = -Math.asin(framePad/2/radius2);
		ctx.arc(flip ? (px) : (px+pW), py+radius,
			radius2, offset-(flip ? angle2_1 : angle2), offset+(flip ? angle2 : angle2_1));
		ctx.lineTo(px+pW-framePad/2, py+pH-framePad/2);
		ctx.lineTo(px+framePad/2, py+pH-framePad/2);
		ctx.closePath();
		ctx.stroke();
	}

	ctx.lineCap = "square";
	ctx.strokeStyle = info.background.insert_color;

	const count4 = info.glass_shape.split('4').length - 1;
	if (count4 >= 1) {
		ctx.lineWidth = muntinWidth;
		ctx.beginPath();
		let x = px + framePad;
		if (flip) {
			arched_heights.reverse();
		}
		for (const [i, height] of arched_heights.entries()) {
			x += spacing_4[i] * scale;
			const mx = x + muntinWidth/2;
			const height_offset = pH-height*scale;
			ctx.moveTo(mx,py+height_offset);
			ctx.lineTo(mx,py+pH-framePad);
			x += muntinWidth;
		}
		ctx.stroke();
		ctx.closePath();
	}

	if (count4 == 2) {
		const v_y = py + pH/2;
		ctx.beginPath();
		ctx.moveTo(px+framePad, v_y);
		ctx.lineTo(px+pW-framePad, v_y);
		ctx.stroke();
		ctx.closePath();
	}

	// frame
	ctx.lineWidth = framePad;
	ctx.strokeStyle = info.background.frame_color;
	//ctx.strokeStyle = "red";
	ctx.beginPath();
	const radius2 = radius-framePad/2;
	const angle2 = Math.asin((w-framePad/2)/radius2);
	const angle2_1 = -Math.asin(framePad/2/radius2);
	ctx.arc(flip ? (px) : (px+pW), py+radius,
		radius2, offset-(flip ? angle2_1 : angle2), offset+(flip ? angle2 : angle2_1));
	ctx.lineTo(px+pW-framePad/2, py+pH-framePad/2);
	ctx.lineTo(px+framePad/2, py+pH-framePad/2);
	ctx.closePath();
	ctx.stroke();

	// inset shadow
	ctx.strokeStyle = "rgba(0,0,0,0.2)";
	const inner_thickness = 0.505 * info.scale;
	const frame_offset = framePad-inner_thickness;
	const radius3 = radius-frame_offset;
	const angle3 = Math.asin((w-frame_offset)/radius3);
	const angle3_1 = -Math.asin(frame_offset/radius3);
	ctx.lineWidth = inner_thickness/2;
	ctx.beginPath();
	ctx.arc(flip ? (px) : (px+pW), py+radius,
		radius3, offset-(flip ? angle3_1 : angle3), offset+(flip ? angle3 : angle3_1));
	ctx.lineTo(px+pW-frame_offset, py+pH-frame_offset);
	ctx.lineTo(px+frame_offset, py+pH-frame_offset);
	ctx.closePath();
	ctx.stroke();

	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(px+frame_offset,py+frame_offset+(flip ? 0 : (pH-10.56*scale)));
	ctx.lineTo(px,py+(flip ? 0 : (pH-10.56*scale)));
	ctx.moveTo(px+frame_offset,py+pH-frame_offset);
	ctx.lineTo(px,py+pH);
	ctx.moveTo(px+pW-frame_offset,py+frame_offset+(flip ? (pH-10.56*scale) : 0));
	ctx.lineTo(px+pW,py+(flip ? (pH-10.56*scale) : 0));
	ctx.moveTo(px+pW-frame_offset,py+pH-frame_offset);
	ctx.lineTo(px+pW,py+pH);
	ctx.stroke();
	ctx.closePath();

	ctx.lineWidth = 2;
	// Top highlight
	ctx.beginPath();
	ctx.strokeStyle = "rgba(255,255,255,0.3)";
	ctx.arc(flip ? (px) : (px+pW), py+radius,
		radius, offset-(flip ? 0 : angle), offset+(flip ? angle : 0));
	ctx.moveTo(px, py+(flip ? 0 : (pH-10.56*scale)));
	ctx.lineTo(px, py + pH);
	ctx.stroke();
	ctx.closePath();

	// Bottom shadow
	ctx.beginPath();
	ctx.strokeStyle = "rgba(0,0,0,0.4)";
	ctx.moveTo(px + pW, py+(flip ? (pH-10.56*scale) : 0));
	ctx.lineTo(px + pW, py + pH);
	ctx.lineTo(px, py + pH);
	ctx.stroke();
	ctx.closePath();
}

async function drawGrandview(ctx, px, py, pW, pH, info, index) {
	const spacing_4 = [ 10.25, 8.40, 8.40, 10.25 ];
	const scale = info.scale;
	const muntinWidth = 0.76 * scale;
	const framePad = 3.18/2 * scale;

	ctx.fillRect(px, py, pW, pH);

	const deco_offset = framePad + 0.2*scale;
	if (info.glass_shape == "grand_wrought_iron_rectangle") {
		const image = await DoorUtils.createImage(`/HTML/products/162059085/images/wrought_iron_rectangle.svg`);

		ctx.drawImage(image, px+deco_offset, py+deco_offset, pW-2*deco_offset, pH-2*deco_offset);

		const framePad = 3.1 * scale;
		// frame
		ctx.lineWidth = scale;
		ctx.lineCap = "square";
		ctx.strokeStyle = "black";
		ctx.strokeRect(px+framePad/2, py+framePad/2, pW-framePad, pH-framePad);
	}

	ctx.lineCap = "square";
	ctx.strokeStyle = info.background.insert_color;

	const count4 = info.glass_shape.split('4').length - 1;
	if (count4 >= 1) {
		ctx.lineWidth = muntinWidth;
		ctx.beginPath();
		let x = px + framePad;
		for (let i = 0; i < 3; i++) {
			x += spacing_4[i] * scale;
			const mx = x + muntinWidth/2;
			ctx.moveTo(mx,py+framePad);
			ctx.lineTo(mx,py+pH-framePad);
			x += muntinWidth;
		}
		ctx.stroke();
		ctx.closePath();
	}

	if (count4 == 2) {
		const v_y = py + pH/2;
		ctx.beginPath();
		ctx.moveTo(px+framePad, v_y);
		ctx.lineTo(px+pW-framePad, v_y);
		ctx.stroke();
		ctx.closePath();
	}

	// frame
	ctx.lineWidth = framePad;
	ctx.strokeStyle = info.background.frame_color;
	ctx.strokeRect(px+framePad/2, py+framePad/2, pW-framePad, pH-framePad);

	// inset shadow
	ctx.strokeStyle = "rgba(0,0,0,0.2)";
	const inner_thickness = 0.505 * info.scale;
	const frame_offset = framePad-inner_thickness;
	ctx.lineWidth = inner_thickness/2;
	ctx.strokeRect(px+frame_offset,py+frame_offset,pW-2*frame_offset,pH-2*frame_offset);

	// miter joints
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(px+frame_offset,py+frame_offset);
	ctx.lineTo(px,py);
	ctx.moveTo(px+frame_offset,py+pH-frame_offset);
	ctx.lineTo(px,py+pH);
	ctx.moveTo(px+pW-frame_offset,py+frame_offset);
	ctx.lineTo(px+pW,py);
	ctx.moveTo(px+pW-frame_offset,py+pH-frame_offset);
	ctx.lineTo(px+pW,py+pH);
	ctx.stroke();
	ctx.closePath();

	ctx.lineWidth = 2;
	// Top highlight
	ctx.beginPath();
	ctx.strokeStyle = "rgba(255,255,255,0.3)";
	ctx.moveTo(px,py);
	ctx.lineTo(px+pW,py);
	ctx.moveTo(px, py);
	ctx.lineTo(px, py + pH);
	ctx.stroke();
	ctx.closePath();

	// Bottom shadow
	ctx.beginPath();
	ctx.strokeStyle = "rgba(0,0,0,0.4)";
	ctx.moveTo(px + pW, py);
	ctx.lineTo(px + pW, py + pH);
	ctx.lineTo(px, py + pH);
	ctx.stroke();
	ctx.closePath();
}

function drawWindowFrame(ctx, px, py, pW, pH, info) {
	ctx.save();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "black";
	ctx.strokeRect(px, py, pW, pH);

	const thickness = 1.33 * info.scale;
	// 1. Draw the main frame body
	ctx.lineWidth = thickness;
	ctx.strokeStyle = info.background.frame_color; // Main frame color
	ctx.strokeRect(px + thickness/2, py + thickness/2, pW - thickness, pH-thickness);

	// 3. Inner Shadow (Depth)
	// This creates the "inset" look where the glass meets the frame
	ctx.strokeStyle = "rgba(0,0,0,0.2)";
	const inner_thickness = thickness - 0.505 * info.scale;
	ctx.lineWidth = inner_thickness/2;
	ctx.strokeRect(px + inner_thickness, py + inner_thickness,
		pW - (inner_thickness * 2), pH - (inner_thickness * 2));

	// 4. Outer Highlight (Bevel)
	// A light line on the top/left and dark on bottom/right creates 3D depth
	ctx.lineWidth = 2;

	// Top highlight
	ctx.beginPath();
	ctx.strokeStyle = "rgba(255,255,255,0.3)";
	ctx.moveTo(px, py + pH); ctx.lineTo(px, py); ctx.lineTo(px + pW, py);
	ctx.stroke();

	// Bottom shadow
	ctx.beginPath();
	ctx.strokeStyle = "rgba(0,0,0,0.4)";
	ctx.moveTo(px + pW, py); ctx.lineTo(px + pW, py + pH);
	ctx.lineTo(px, py + pH);
	ctx.stroke();
	ctx.restore()
}

async function drawWindows(ctx, section, info, hints) {
	const drawInsertFn = {
		'stockton_colonial': (ctx, x, y, width, height, scale, color, idx) => {
			drawInsertStockton(ctx, x, y, width, height, scale, color, 1, false, false);
		},
		'stockton_ranch': (ctx, x, y, width, height, scale, color, idx) => {
			drawInsertStockton(ctx, x, y, width, height, scale, color, 4, false, false);
		},
		'waterton_colonial': (ctx, x, y, width, height, scale, color, idx) => {
			drawInsertWaterton(ctx, x, y, width, height, scale, color, 1);
		},
		'waterton_ranch': (ctx, x, y, width, height, scale, color, idx) => {
			drawInsertWaterton(ctx, x, y, width, height, scale, color, 2);
		},
		'cascade_colonial': (ctx, x, y, width, height, scale, color, idx) => {
			drawInsertCascade(ctx, x, y, width, height, scale, color, 1);
		},
		'cascade_ranch': (ctx, x, y, width, height, scale, color, idx) => {
			drawInsertCascade(ctx, x, y, width, height, scale, color, 4);
		},
		'prairie': drawInsertPrairie,
		'arched_stockton': (ctx, x, y, width, height, scale, color, idx) => {
			drawInsertStockton(ctx, x, y, width, height, scale, color, 4, true, idx%2);
		},
		'arched_stockbridge': (ctx, x, y, width, height, scale, color, idx) => {
			drawInsertStockbridge(ctx, x, y, width, height, scale, color, 3, true, idx%2);
		},
		'stockbridge': (ctx, x, y, width, height, scale, color, idx) => {
			drawInsertStockbridge(ctx, x, y, width, height, scale, color, 3, false, false);
		},
		'arched_stockton_3': (ctx, x, y, width, height, scale, color, idx) => {
			if (idx == 0) {
				drawInsertStockton(ctx, x, y, width, height, scale, color, 4, true, false);
			} else if (idx == 1) {
				drawInsertStockton(ctx, x, y, width, height, scale, color, 4, false, false);
			} else if (idx == 2) {
				drawInsertStockton(ctx, x, y, width, height, scale, color, 4, true, true);
			}
		},
		'arched_stockbridge_3': (ctx, x, y, width, height, scale, color, idx) => {
			if (idx == 0) {
				drawInsertStockbridge(ctx, x, y, width, height, scale, color, 4, true, false);
			} else if (idx == 1) {
				drawInsertStockbridge(ctx, x, y, width, height, scale, color, 4, false, false);
			} else if (idx == 2) {
				drawInsertStockbridge(ctx, x, y, width, height, scale, color, 4, true, true);
			}
		},
		'arched_stockton_4': (ctx, x, y, width, height, scale, color, idx) => {
			if (idx == 0) {
				drawInsertStockton(ctx, x, y, width, height, scale, color, 4, true, false);
			} else if (idx == 1 || idx == 2) {
				drawInsertStockton(ctx, x, y, width, height, scale, color, 4, false, false);
			} else if (idx == 3) {
				drawInsertStockton(ctx, x, y, width, height, scale, color, 4, true, true);
			}
		},
		'arched_stockbridge_4': (ctx, x, y, width, height, scale, color, idx) => {
			if (idx == 0) {
				drawInsertStockbridge(ctx, x, y, width, height, scale, color, 4, true, false);
			} else if (idx == 1 || idx == 2) {
				drawInsertStockbridge(ctx, x, y, width, height, scale, color, 4, false, false);
			} else if (idx == 3) {
				drawInsertStockbridge(ctx, x, y, width, height, scale, color, 4, true, true);
			}
		},
	};

    const pW = section.panel_width * info.scale;
    const pH = section.panel_height * info.scale;

	ctx.save();

	const y_offset = (section.height * info.scale - pH) / 2;
	const py = section.ypos * info.scale + info.ypos + y_offset;
    for (const [i, pos] of section.positions.entries()) {
		const px = pos * info.scale + info.xpos;

		if (section.enabled[i]) {
			const gradx = px+pW/2-pH/2;
			const grady = py+pH/2-pW/2;
			const gradient = ctx.createLinearGradient(gradx, grady, gradx+pH, grady+pW);
			gradient.addColorStop(0, "#a8d0ff");
			gradient.addColorStop(0.5, "#ffffff");
			gradient.addColorStop(1, "#a8d0ff");

			ctx.fillStyle = gradient;

			if (info.glass_shape.includes('grand')) {
				if (info.glass_shape.includes('arched')) {
					await drawGrandviewArched(ctx, px, py, pW, pH, info, i);
				} else {
					await drawGrandview(ctx, px, py, pW, pH, info, i);
				}
			} else {
				ctx.fillRect(px, py, pW, pH);
				if (info.insert in drawInsertFn) {
					drawInsertFn[info.insert](ctx, px, py, pW, pH, info.scale, info.background.insert_color, i);
				}

				drawWindowFrame(ctx, px, py, pW, pH, info);
			}
		}
		if (hints) {
			if (section.slim_one) {
				if (!section.selected) continue;
				const size = 10;
				const [mouse_x, mouse_y] = getCanvasMousePos();
				const x = px + pW/2;

				ctx.save();

				ctx.beginPath();
				// 1. Move to the top-left corner
				ctx.moveTo(x - size / 2, py - size);
				// 2. Draw line to the top-right corner
				ctx.lineTo(x + size / 2, py - size);
				// 3. Draw line to the bottom center (the "tip")
				ctx.lineTo(x, py);
				ctx.closePath(); // Automatically connects back to the start

				ctx.fillStyle = "red";
				ctx.fill();
				ctx.restore();
			} else {
				ctx.save();
				ctx.strokeStyle = info.colors.isDark ? "#aaaaaa" : "#0a0a0a";
				ctx.lineWidth = 2;
				ctx.setLineDash([16, 8]);
				ctx.strokeRect(px, py, pW, pH);
				ctx.restore();
			}

			const section_intersects = section.slim_one && isMouseIntersect(info.xpos, section.ypos*info.scale+info.ypos,
				info.door_width*info.scale, section.height*info.scale);
			if (section_intersects) {
				const [mouse_x, mouse_y] = getCanvasMousePos();
				const x = mouse_x - pW/2;
				const size = 10;

				ctx.save();

				ctx.beginPath();
				// 1. Move to the top-left corner
				ctx.moveTo(mouse_x - size / 2, py - size);
				// 2. Draw line to the top-right corner
				ctx.lineTo(mouse_x + size / 2, py - size);
				// 3. Draw line to the bottom center (the "tip")
				ctx.lineTo(mouse_x, py);
				ctx.closePath(); // Automatically connects back to the start

				ctx.fillStyle = "red";
				ctx.fill();

				ctx.strokeStyle = info.colors.isDark ? "#aaaaaa" : "#0a0a0a";
				ctx.lineWidth = 2;
				ctx.setLineDash([16, 8]);
				ctx.strokeRect(x, py, pW, pH);
				ctx.restore();
			}
		}
    }

	ctx.restore();
}

const CANVAS_PLUGIN = {
    loadCanvasHTML: () => {
        $("#CANVAS_PLUGIN").html(
            `<canvas id="CONFIG_CANVAS" width=1200 height=800 style="height:65vh;  border:none;background: transparent;"></canvas>`
        );
    },

    draw: async function (door_info) {
        const drawSection = {
            'colonial': drawSectionPanel,
            'plank': drawPlankSection,
            'ranch': drawSectionPanel,
            'flush': function(ctx, positions, info) {},
            'colonial_grooved': drawColonialGroovedSection,
            'ranch_grooved': drawRanchGroovedSection,
            'smooth_ranch': drawSmoothRanchSection
        };

        const canvas = $("#CONFIG_CANVAS")[0];
		const dW = door_info.door_width;
		const dH = door_info.door_height;
		const numSections = door_info.num_sections;
        const bgColor = door_info.background.color;

        const ctx = document.createElement("canvas").getContext("2d");
        ctx.canvas.width = canvas.width; ctx.canvas.height = canvas.height;

        const scale = door_info.scale;

        const pattern = await DoorUtils.createTexturePattern(ctx, door_info.background.pattern_url);
        const matrix = new DOMMatrix();
        const patternScale = door_info.background.pattern_scale * scale;
        matrix.scaleSelf(patternScale, patternScale);
        pattern.setTransform(matrix);

        const w = dW * scale, h = dH * scale;
		const [x, y] = getCanvasDoorPosition(dW, dH);

        const colors = DoorUtils.getShadowSettings(bgColor);
		door_info.colors = colors;

		const section_heights = door_info.section_heights;
		const hints = door_info.draw_hints;

        for (const section of door_info.sections) {
            const sH = section.height * scale;
			const sY = y + section.ypos * scale;

			ctx.save();
            ctx.fillStyle = bgColor;
            ctx.fillRect(x, sY, w, sH);

            ctx.globalAlpha = colors.isDark ? 1.0 :  0.5;
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = pattern;
            ctx.fillRect(x, sY, w, sH);

			if (hints && section.selected) {
				ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
				ctx.fillRect(x, sY, w, sH);
			}

            ctx.strokeStyle = "black";
            ctx.strokeRect(x, sY, w, sH);

			ctx.restore();

			drawSection[door_info.face](ctx, section, door_info);
			if (section.shape.length) {
				await drawWindows(ctx, section, door_info, hints);
			}
        }

        // Disclaimer
        ctx.font = 'bold 20px Arial'; ctx.fillStyle = "black"; ctx.textAlign = "center";
        ctx.fillText("Actual door appearance may differ slightly.", canvas.width / 2, canvas.height - 10);
        canvas.getContext("2d").putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
    },
};
