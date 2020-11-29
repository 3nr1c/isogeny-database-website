const fastglob = require("fast-glob");
const fs = require('fs');

module.exports = function (eleventyConfig) {
	eleventyConfig.setTemplateFormats(["html", "json", "ico", "js", "njk", "pdf", "css", "svg", "eot", "ttf", "woff", "woff2"]);

	eleventyConfig.addNunjucksFilter("sortGraphPages", function(graphs) {
		graphs.sort((a, b) => a.data.graphs[0].prime - b.data.graphs[0].prime);
		return graphs;
	});

	eleventyConfig.addNunjucksFilter("truncate", function(value) {
		return Number.parseFloat(value).toFixed(4);
	});  

	eleventyConfig.addCollection("graphs", async (collectionAPI) => {
		// Grab all talk filenames
		const graphPaths = await fastglob("../isogeny-database/graphs/*/*_metadata.json", {
			caseSensitiveMatch: false
		});

		let graphs = Array();

		for (let path of graphPaths) {
			let rawData = fs.readFileSync(path);
			let graph = JSON.parse(rawData);

			if (graph.prime > 30000) {
				continue;
			}

			graphs.push(graph);
		}

		graphs.sort((a, b) => a.prime - b.prime);

		return [...graphs];
	});

	return {
		dir: {
			input: 'src', 
			includes: '_includes'
		},
	};
};