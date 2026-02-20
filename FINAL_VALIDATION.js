function finalvalidation() {
	const render_fn = getNode("RENDER").logic;
	getNode("RENDER").logic = () => {};

	forceInitialValidation().then(res => {
		/*
		sectionBundleNums.forEach(e => {
			nodeset[e].logic = cache[e].logic;
			nodeset[e].logic();
		});
		*/

		getNode("RENDER").logic = render_fn;
		rw(getNode("RENDER"));
		render_fn();
	});
}
