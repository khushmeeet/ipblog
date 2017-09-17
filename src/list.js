const pouch = require("pouchdb");
const IPFS = require("ipfs-api");
const db = pouch("ipfs-test3");
const concat = require("concat-stream");
const Buffer = require("safe-buffer").Buffer;
const $ = require("jquery");
const firebase = require("firebase");

var config = {
	apiKey: "AIzaSyA2_gXBNPnMbSwJjzMSduZhvY9T47h8sUU",
	authDomain: "repo-test22-8b378.firebaseapp.com",
	databaseURL: "https://repo-test22-8b378.firebaseio.com",
	projectId: "repo-test22-8b378",
	storageBucket: "repo-test22-8b378.appspot.com",
	messagingSenderId: "918913223449"
};
firebase.initializeApp(config);
var database = firebase.database().ref();

var ipfs = IPFS("localhost", "5001", {
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
									<h2>${post.title}</h2>
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

function readHash() {
	dbRef = database.child("hashes")
	dbRef.on('value', (snap) => {
		$.each(snap.val(), (key, value) => {
			ipfs.files.cat(value, (err, file) => {
				if (err) {
					console.log(err);
				}
				file.pipe(concat(data => {
						let post = JSON.parse(data);
						let name = "quill" + Date.now().toString();
						$(".something").append(`<div class="post">
									<h4>${post.title}</h4>
									<div id="${name}"></div>
								</div>`);
						let q = new Quill("#" + name, {});
						q.setContents(post.text);
					}));
			});
		})
	})
}

document.addEventListener("DOMContentLoaded", () => {
	// articleList();
	readHash();
});
