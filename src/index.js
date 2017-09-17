const concat = require("concat-stream");
const Buffer = require("safe-buffer").Buffer;
var IPFS = require("ipfs-api");
const $ = require("jquery");
const orbitDB = require("orbit-db")
const pouchdb = require('pouchdb')
const fs = require('fs')

var ipfs = IPFS("localhost", "5001", {
	protocol: "http"
});

const db = pouchdb("ipfs-test3")

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
	var text = editor.getContents();
	var title = $("#title").val();
	var article = {
		title: title,
		text: text
	};
	ipfs.files.add(Buffer.from(JSON.stringify(article)), (err, files) => {
		$(".hash-ref").append(`<p class="hash-ref">Document uploaded to IPFS! -
			<span>${files[0].hash}</span> </p>`);
		var hash = {
			hash: files[0].hash
		};
		fs.writeFile("hash.txt",`${files[0].hash}`, err => {
			if (err) throw err;
			console.log("The file has been saved!");
		});
		db.put(hash, (err, res) => {
			console.log('successful put');
		})
	});
}

document.addEventListener("DOMContentLoaded", () => {
	editor = new Quill("#quill", {
		modules: {
			toolbar: toolbarOptions
		},
		placeholder: "Compose an epic...",
		readOnly: false,
		theme: "snow"
	});
	document.getElementById("post").onclick = addToIPFS;
	
});
