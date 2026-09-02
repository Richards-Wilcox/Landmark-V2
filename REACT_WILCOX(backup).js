/**
 *	React-Wilcox is a caching system / event manager designed to work with ConfigureOne. It's a graph-based
 *	system which adds two critical capacities to a configurator.
 * 		1. Event Cascading.
 *		2. Tying events to changes in variables instead of user input.
 *
 *	Dependencies: None.
 *
 * 	Changelog:
 *	2025/11/24 Fixed addNode to add isVisible automatically ZR
 * 	2025/12/01 Added setState ZR
 * 	2025/12/04 Added automatic validation for <select> elements ZR
 * 	2025/12/08 Fixed Minor Button Behaviour ZR
 *	2025/12/11 Fixed Validated on empty <select> elements ZR
 *	2026/04/23 Added root node and debounce function DS
 *	2026/04/24 Made debounce function synchronously wait for rw DS
 */

const nodeset = {};
//values depend on keys
const edgeset = {};

nodeset['ROOT'] = {
	id: 'ROOT',
	value: 0,
	element: null,
	logic: ()=>{},
	isVisible: false,
	type: 'VARIABLE',
};

function rw_init(configuratorid = "configurator") {
    const start = Date.now();

    //Add the elements directly to the nodeset
    $(
        `#${configuratorid} input:not(.navigation-button)[id], #${configuratorid} option[id], #${configuratorid} select[id]:has(option),#${configuratorid} label[id],#${configuratorid} span[id],#${configuratorid} div[id][include], #displayMainInputGroups input[id], #displayMainInputGroups select[id]:has(option), button`,
    ).each((i, e) => {
        if (!e.id) return;

        const defaultLogicFunction = function () {
            // if(this.element.id === 'LIFT_TYPE')
            if (!!this.element.value) this.value = this.element.value;
            else this.value = this.element.innerText;
        };

        const node = createNode(e.id, defaultLogicFunction, e.value ?? e.innerText, e);
        node.type = e.getAttribute("type") ?? getDefaultNodeType(node);
        node.type = node.type.toUpperCase();

        e.addEventListener("change", (evt) => {
            nodeset[node.id].value = evt.target.value;
            rw(nodeset[node.id], node.id);
            if (e.tagName === "INPUT" && node.getAttribute("type") === "radio") {
                $(`input[type="radio"][name="${e.getAttribute("name")}"][checked]`).removeAttr("checked");
                $(e).attr("checked", "");
            }
        });
        if (node.type === "BUTTON")
            e.addEventListener("click", (evt) => {
                nodeset[node.id].value = evt.target.value;
                rw(nodeset[node.id], node.id);
            });

        if (e.getAttribute("type") === "radio") {
            const radioName = e.getAttribute("name");
            if (!nodeset[radioName])
                addNode(
                    {
                        id: radioName,
                        type: "RADIO_PARENT",
                        logic: function () {
                            //The psuedo-operator :checked can't be changed programmatically.
                            this.value = $(`input[type="radio"][name="${radioName}"][checked]`).val();
                        },

                        getAttribute: function (str) {
                            return getSelected(this.id).getAttribute(str);
                        },
                    },
                    [e.getAttribute("id")],
                );
            else {
                if (!edgeset[e.getAttribute("id")]) edgeset[e.getAttribute("id")] = [radioName];
                else edgeset[e.getAttribute("id")].push(radioName);
            }
        }
    });

    //console.log("Done: ", ((Date.now() - start) / 1000).toFixed(4));
}

//Adds a new node to the nodeset by appending various needed functions
function createNode(id, logic, value, element, edges = []) {
	if (id == "ROOT") {
		throw new Error("ROOT is a reserved node name");
	}

    const node = {
        id: id,
        value: value,
        element: element,

        logic:
            logic ??
            function () {
                if (!!this.element.value) this.value = this.element.value;
                else this.value = this.element.innerText;
            },
        isVisible: !!element ? element.style.display !== "none" : false,
    };
    node.type = getDefaultNodeType(node);

    if (!!element) {
        node.getAttribute = function (str) {
            if (this.element.tagName === "SELECT") return $(this.element).children(`option[value = ${this.value}]`).attr(str);
            return this.element.getAttribute(str);
        };
        node.setAttribute = function (attr, val) {
            this.element.setAttribute(attr, val);
        };
        node.removeAttribute = function (attr) {
            this.element.removeAttribute(attr);
        };
        node.show = function () {
            this.isVisible = true && !!this.element;
        };
        node.hide = function () {
            this.isVisible = false;
        };
        node.setVisibility = function (visibility) {
            visibility ? this.show() : this.hide();
        };
    }
    nodeset[node.id] = node;

	edges.push('ROOT');
    edges.forEach((edge) => {
        if (!edgeset[edge]) edgeset[edge] = [node.id];
        else edgeset[edge].push(node.id);
    });
    return node;
}
//Runs every logic item on the nodeset.  This forces the configurator into a valid state.
function forceInitialValidation(configuratorid = "configurator") {
    return new Promise((resolve, reject) => {
        const inputNodes = $("#configurator")
            .find("select, input, option[id]")
            .toArray()
            .map((element) => element.id);
        for (let i = 0; i < inputNodes.length; i++) {
            const id = inputNodes[i];
            if (!nodeset[id]) continue;
            //RW is effectively just pushing everything into walkcache
            rw(nodeset[id], id).then((status) => {
                if (status === 1) resolve();
            });
        }
    });
}

// Runs every logic item on the nodeset.
// This forces the configurator into a valid state.
function forceInitialValidationLM(configuratorid = "configurator") {

    return new Promise((resolve) => {

        const inputNodes = $("#" + configuratorid)
            .find("select, input, option[id]")
            .toArray()
            .map((element) => element.id);

        let pending = 0;
        let completed = false;

        for (let i = 0; i < inputNodes.length; i++) {

            const id = inputNodes[i];

            if (!nodeset[id]) {
                continue;
            }

            pending++;

            rw(nodeset[id], id)
                .then((status) => {

                    pending--;

                    if (status === 1) {
                        completed = true;
                    }

                    if (pending === 0) {
                        resolve(completed ? 1 : 0);
                    }
                })
                .catch((err) => {

                    console.error(
                        "rw() failed for id:",
                        id,
                        err
                    );

                    pending--;

                    if (pending === 0) {
                        resolve(completed ? 1 : 0);
                    }
                });
        }

        if (pending === 0) {
            resolve(0);
        }
    });
}


function getNode(id) {
    return nodeset[id];
}
function printNode(node) {
    //Elements have a lot of junk on them, this strips it down to value, id, logic function, and visibility
    console.log({
        id: node.id,
        value: node.value,
        logic: node.logic,
        selected: node.tagName === "SELECT" && getSelected(node.id),
    });
}

function getSelected(id) {
    if (!nodeset[id]) return;

    if (nodeset[id].type === "RADIO_PARENT")
        //This shouldn't reference the DOM for caching purposes
        return nodeset[$(`input[name='${id}'][checked]`).attr("id")]; //Object.values(nodeset).filter(node => edgeset[node.id] && edgeset[node.id].indexOf(id) !== -1).find(node => node.value === getState(id) );

    if (nodeset[id].type === "SELECT") {
        const child = $(nodeset[id].element).find(`option:selected`);
        return nodeset[child.attr("id")] ?? child[0];
    }

    return nodeset[id];
}
function addLogic(id, logic, edges) {
   if (!nodeset[id]) {	
	return;
   }
    nodeset[id].logic = logic;
    edges.forEach((edge) => {
        if (!edgeset[edge]) edgeset[edge] = [id];
        else edgeset[edge].push(id);
    });
}
function getDefaultNodeType(node) {
    if (!node.element) return "VARIABLE";

    if (node.element.tagName === "INPUT") return node.element.getAttribute("type").toUpperCase();

    if (node.element.tagName !== "SELECT" && node.element.tagName !== "BUTTON") {
        if (node.element.children.length === 0) return "LABEL";
        else return "CONTAINER";
    }
    return node.element.tagName;
}
function addNode(node, edges) {
	if (node.id == "ROOT") {
		throw new Error("ROOT is a reserved node name");
	}

    if (!node.type) node.type = getDefaultNodeType(node);

    if (!nodeset[node.id]) nodeset[node.id] = node;
    else if (!nodeset[node.id].logic) nodeset[node.id].logic = node.logic;
    //Adding Visibility
    if (node.isVisible === undefined) {
        if (node.type === "VARIABLE" || node.type === "RADIO_PARENT") node.isVisible = false;
        else if (!!node.element) node.isVisible = node.element.style.display !== "none";
    }

    node.show = function () {
        this.isVisible = true && !!this.element;
    };
    node.hide = function () {
        this.isVisible = false;
    };
    node.setVisibility = function (visibility) {
        visibility ? this.show() : this.hide();
    };
    if (!node.logic) node.logic = function () {};

    if (!node.value) {
        node.logic();
    }

	edges.push('ROOT');
    edges.forEach((edge) => {
        if (!edgeset[edge]) edgeset[edge] = [node.id];
        else edgeset[edge].push(node.id);
    });
}

function getState(state) {
    return nodeset[state].value;
}
//Returns the set of all nodes that depend on this node id
//If you pass "HEIGHT", you will get AREA and LIFT_TYPE_HL, not DOOR_HEIGHT_FEET and DOOR_HEIGHT_INCHES.
function getEdgeSet(nodeid) {
    return edgeset[nodeid] ?? [];
}
const walkcache = [];
//RW returns 0 if it just updated the walkcache, or 1 if it updated everything.
async function rw(node, walkid) {
    //console.log("NEW RW CALL")
  
//console.log("RW",node.id, "walkcache:", walkcache.length);

    const newwalk = getWalk(node, walkid);
    beforeWalk(newwalk);
    walkcache.push({ walk: newwalk, id: walkid });

    //If walkcache has a length greater than 1, an instance of rw is already running.
    if (walkcache.length > 1) return 0;
    //  console.log("Beginning RW " + walkcache.length)
    while (walkcache.length > 0) {
        const walk = walkcache[0].walk;
        const currentwalkid = walkcache[0].id;
        //  console.log("Beginning walk " + currentwalkid)
        for (let i in walk) {
            // const startTime = Date.now()
            try {		   
                await performLogic(walk[i]);
            } catch (err) {		    
                continue;
            }
            //	if(Date.now() - startTime > 300)
            //  console.log(walk[i])
        }
        const completedwalk = walkcache.shift();

        onCompletedWalk(walk);
        //    console.log(completedwalk.id, currentwalkid)
        //    console.log("Walk ended " + completedwalk.id)
    }

    //We only update the actual inputs once RW is finished running everying
    Object.keys(nodeset).forEach((key) => {
        if (!nodeset[key].element) return;
        if (nodeset[key].element.tagName === "SELECT" || nodeset[key].element.tagName === "INPUT" || nodeset[key].element.tagName === "OPTION")
            nodeset[key].element.value = nodeset[key].value;
        else if (nodeset[key].type === "LABEL" && !nodeset[key].text) nodeset[key].element.innerText = nodeset[key].value;
        else if (nodeset[key].type !== "CONTAINER" && nodeset[key].text) nodeset[key].element.innerText = nodeset[key].text;
        //Visibility updates
        if (nodeset[key].isVisible) $(nodeset[key].element).show();
        else $(nodeset[key].element).hide();
        //if (nodeset[key].type === "SELECT" && $("#configurator").find("#" + key).length !== 0) validate(key);
	 if (nodeset[key].type === "SELECT" && $("#configurator").find("#" + key).length !== 0) {
    		try {
        		validate(key);
    		} catch (err) {
        		console.error("validate() threw for key:", key, err);
    		}
	}
    });
    onUpdate();
    return 1;
}
//This function is called when the walkcache is emptied, ie, when the actual UI is updated.
function onUpdate() {}
//This function is called after every completed walk.
function onCompletedWalk(walk) {}
//Function is called before every update to the walk cache.
function beforeWalk(walk) {}
function onCompletedDebounce() {}
function performLogic(node) {
    return new Promise((resolve, reject) => {
        resolve(node.logic());
    });
}
function getWalk(node, walkid) {
    const walk = [node];

    //We need a specific order for the walk, parent->child->child, and we need breadth first not depth first
    //We also need to make sure every edge of every node has fired before the node itself fires
    let currentEdges = [...getEdgeSet(node.id)];
    //Records nodes already present in the array
    const cache = {};
    //If a node is already present and we see it again, it needs to be added at the **latest** possible point in the walk.
    //This ensures all its dependent nodes have been recalculated when it fires.
    while (currentEdges.length > 0) {
        const nextNodeId = currentEdges.pop();

        if (!!cache[nextNodeId]) {
            //Every time we do this, we also need to add all of that node's children behind the node.
            walk.splice(walk.indexOf(getNode(nextNodeId)), 1);
        }
        cache[nextNodeId] = true;

        walk.push(getNode(nextNodeId));
        getEdgeSet(nextNodeId).forEach((edge) => {
            currentEdges.unshift(edge);
        });
    }
    return walk;
}

//TODO: only checks value, innerText, and visibility
function hasChanged(beforeLogic, afterLogic) {
    return !(
        beforeLogic.id === afterLogic.id &&
        beforeLogic.value === afterLogic.value &&
        beforeLogic.innerText === afterLogic.innerText &&
        beforeLogic.isVisible === afterLogic.isVisible &&
        beforeLogic.style === afterLogic.style
    );
}

//Helper Method. Checks if the current value is one of the inputs children.
function validate(id) {
    if (!!getNode(id) && getNode(id).type !== "RADIO" && getNode(id).type !== "SELECT" && getNode(id).type !== "RADIO_PARENT" && getNode(id).type !== "OPTION")
        return;

    if (getNode(id).type === "OPTION") return validate(getNode(id).element.parentElement.id);

    if (!!getSelected(id) && (getSelected(id).id === "" || getSelected(id).isVisible)) return;

    const childNodes = getChildNodes(id);

    for (let i = childNodes.length - 1; i >= 0; i--) {
        if (childNodes[i].isVisible) {
            nodeset[id].value = childNodes[i].value;
            return;
        }
    }
}
//TODO: Implement for RADIO_PARENT as well
function getChildNodes(id) {
    if (nodeset[id].type !== "SELECT" && nodeset[id].type !== "RADIO_PARENT") return [];
    if (nodeset[id].type === "SELECT")
        return $(`#${id}`)
            .children("[id]")
            .toArray()
            .map((e) => nodeset[e.id]);
    if (nodeset[id].type === "RADIO_PARENT")
        return $(`input[type='radio'][name='${id}'][id]`)
            .toArray()
            .map((e) => nodeset[e.id]);
}
//Set up specifically for the way radio buttons work on smooth door.
function validateRadio(name) {
    const currentValue = nodeset[name].value;
    const selectedValue = $(`input[type='radio'][name='${name}']:checked`).val();
    const selectedNode = nodeset[$(`input[type='radio'][name='${name}']:checked`).attr("id")];
    if (selectedNode.isVisible) return;

    getChildNodes(name).forEach((node) => {
        if (node.isVisible) nodeset[name].value = node.value;
    });
}
function setState(key, value) {
    nodeset[key].value = value;
    rw(getNode(key));
}


const pendingRequests = new Set();
let cacheDebounceTimer = null;
let lockDebounce = false;
function cacheDebounce(node) {
	// prevent recursive loops
  
 // console.log("cacheDebounce", node.id);
  
	if (lockDebounce) return;
	if (typeof node.debounce != 'function') {
		//console.log('cacheDebounce: warning, encountered node with no debounce function', node);
		return;
	}

	clearTimeout(cacheDebounceTimer);
	pendingRequests.add(node.id);

	const fn = async () => {
		//console.log('running debounced functions');
		lockDebounce = true;
		const nodes = getWalk(getNode('ROOT'));
		for (const node of nodes) {
			//console.log(node);
			if (!pendingRequests.has(node.id)) continue;
			//console.log('running rw');
			pendingRequests.delete(node.id);

			const result = await node.debounce();
			node.value = result;
		  
		  //console.log("DEBOUNCE RW", node.id);
		  
			await rw(node);
		  
		 // console.log("DEBOUNCE COMPLETE",node.id);
		}

		lockDebounce = false;
		onCompletedDebounce();
	};

	cacheDebounceTimer = setTimeout(fn, 2000);
}
