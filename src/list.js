const pouch = require("pouchdb");
const IPFS = require("ipfs-api");
const db = pouch("ipfs-test3");
const concat = require("concat-stream");
const Buffer = require("safe-buffer").Buffer;
const $ = require("jquery");
var fs = require('fs')

const ipfs = IPFS("localhost", "5001", {
	protocol: "http"
});


function articleList() {
	db.allDocs({ include_docs: true }, (err, docs) => {
		for (let row in docs.rows) {
			let d = docs.rows[row];
			for (var doc in d) {
				if (doc === "doc") {
					ipfs.files.cat(d[doc].hash, (err, file) => {
						if (err) {
							console.log(err);
						}
						file.pipe(
							concat(data => {
								let post = JSON.parse(data);
								let name = "quill" + Date.now().toString();
								$(".something").append(`<div class="post">
									<h4>${post.title}</h4>
									<div id="${name}"></div>
								</div>`);
								let q = new Quill("#" + name, {});
								q.setContents(post.text);
							})
						);
					});
				}
			}
		}
	})
}

document.addEventListener("DOMContentLoaded", () => {
	articleList();
	fs.readFile('hash.txt', (err, data) => {
		console.log(data)
	})
});
