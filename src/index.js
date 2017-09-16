const concat = require("concat-stream");
const Buffer = require("safe-buffer").Buffer;
var IPFS = require("ipfs-api");
const pouch = require("pouchdb");
const $ = require('jquery')

var db = new pouch("ipfs_test3");

var ipfs = IPFS("localhost", "5001", {
	protocol: "http"
});

var editor;
var toolbarOptions = [
	[{ header: [1, 2, 3, 4, 5, 6, false] }],
	[{ font: [] }],
	["bold", "italic", "underline", "strike"],
	[{ color: [] }, { background: [] }],
	["link", "image", "video"],
	[{ align: [] }],
	["blockquote", "code-block"],
	[{ list: "ordered" }, { list: "bullet" }],
	[{ indent: "+1" }, { indent: "-1" }],
	[{ script: "sub" }, { script: "super" }]
];

function addToIPFS() {
	var text = editor.getContents()
	var title = $('#title').val()
	console.log(title)
	var article = {
		title: title,
		text: text
	}
	ipfs.files.add(Buffer.from(JSON.stringify(article)), (err, files) => {
		var hash = {
			_id: new Date().toISOString(),
			hash: files[0].hash
		};
		db.put(hash, (err, res) => {
			if (err) {
				console.log(err);
			}
		});
	});
}

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("post").onclick = addToIPFS;
	editor = new Quill("#quill", {
		debug: "info",
		modules: {
			toolbar: toolbarOptions
		},
		placeholder: "Compose an epic...",
		readOnly: false,
		theme: "snow"
	});
});
