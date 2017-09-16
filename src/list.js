const pouch = require("pouchdb");
const IPFS = require("ipfs-api");
const db = pouch("ipfs_test3");
const concat = require("concat-stream");
const Buffer = require("safe-buffer").Buffer;
const $ = require("jquery");

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
						if (err) {
							console.log(err);
						}
						file.pipe(
							concat(data => {
								let post = JSON.parse(data);
								let name = "quill" + row;
								$('.something').append(`<div class="post">
									<h4>${post.title}</h4>
									<div id="${name}"></div>
								</div>`)
								let q = new Quill("#" + name, {});
								q.setContents(post.text);
							})
						);
					});
				}
			}
		}
	});
}

document.addEventListener("DOMContentLoaded", () => {
	articleList();
});
