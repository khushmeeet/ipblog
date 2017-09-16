const pouch = require("pouchdb");
const IPFS = require("ipfs-api");
const db = pouch("ipfs_test");

const ipfs = IPFS("localhost", "5001", {
	protocol: "http"
});

var editor;

function articleList() {
	db.allDocs({ include_docs: true }, (err, docs) => {
		for (var row in docs.rows) {
			let d = docs.rows[row];
			for (var doc in d) {
				if (doc == "doc") {
					ipfs.files.cat(d[doc].hash, (err, file) => {
						editor.setContents(file);
					});
				}
			}
		}
	});
}

document.addEventListener("DOMContentLoaded", () => {
	editor = new Quill("#quill", {
		debug: "info",
		modules: {
			toolbar: false
		},
		readOnly: true,
		theme: "snow"
	});
	articleList();
});
