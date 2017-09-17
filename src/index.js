const concat = require("concat-stream");
const Buffer = require("safe-buffer").Buffer;
var IPFS = require("ipfs-api");
const $ = require("jquery");
const orbitDB = require("orbit-db");
const pouchdb = require("pouchdb");
const fs = require("browserify-fs");
const firebase = require('firebase')

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

const db = pouchdb("ipfs-test3");

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
var hashfile;
function addToIPFS() {
	var text = editor.getContents();
	var title = $("#title").val();
	var article = {
		title: title,
		text: text
	};
	var hashfile;
	ipfs.files.add(Buffer.from(JSON.stringify(article)), (err, files) => {
		$(".hash-ref").append(`<p class="hash-ref">Document uploaded to IPFS! -
			<span>${files[0].hash}</span> </p>`);
		var hash = {
			_id: new Date().toISOString(),
			hash: files[0].hash
		};
		database.child("hashes").push(files[0].hash);
		db.put(hash, (err, res) => {
			console.log("successful put");
		});
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
