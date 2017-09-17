const concat = require("concat-stream");
const Buffer = require("safe-buffer").Buffer;
var IPFS = require("ipfs-api");
const $ = require("jquery");
const orbitDB = require("orbit-db");
const pouchdb = require("pouchdb");
const fs = require("browserify-fs");
const firebase = require("firebase");
const itob = require("image-to-blob");

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

makeblob = function(dataURL) {
	var BASE64_MARKER = ";base64,";
	if (dataURL.indexOf(BASE64_MARKER) == -1) {
		var parts = dataURL.split(",");
		var contentType = parts[0].split(":")[1];
		var raw = decodeURIComponent(parts[1]);
		return new Blob([raw], { type: contentType });
	}
	var parts = dataURL.split(BASE64_MARKER);
	var contentType = parts[0].split(":")[1];
	var raw = window.atob(parts[1]);
	var rawLength = raw.length;

	var uInt8Array = new Uint8Array(rawLength);

	for (var i = 0; i < rawLength; ++i) {
		uInt8Array[i] = raw.charCodeAt(i);
	}
	return new Blob([uInt8Array], { type: contentType });
};

var subscriptionKey = "929960c9586b4b38be7b9c82b521a21e";

var uriBase =
	"https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze";

// Request parameters.
var params = {
	visualFeatures: "Categories,Description,Color,Adult"
};

function addToIPFS() {
	var isAdult = false;
	var imgs = $(".ql-editor").find("img");
	if (imgs.length) {
		console.log(imgs);
		var attr = imgs.attr("src");
		var blob = makeblob(attr);

		$.ajax({
			url: uriBase + "?" + $.param(params),

			// Request headers.
			beforeSend: function(xhrObj) {
				xhrObj.setRequestHeader(
					"Content-Type",
					"application/octet-stream"
				);
				xhrObj.setRequestHeader(
					"Ocp-Apim-Subscription-Key",
					subscriptionKey
				);
			},
			type: "POST",
			processData: false,
			// Request body.
			data: blob
		})
			.done(function(data) {
				console.log(data);
				isAdult = data.adult.isAdultContent;
				console.log(isAdult);
				if (isAdult == false) {
					console.log("img");
					console.log(isAdult);
					var text = editor.getContents();
					var title = $("#title").val();
					var article = { title: title, text: text };
					var hashfile;
					ipfs.files.add(
						Buffer.from(JSON.stringify(article)),
						(err, files) => {
							$(".hash-ref")
								.append(`<p class="hash-ref">Document uploaded to IPFS! -
			<span>${files[0].hash}</span> </p>`);
							var hash = {
								_id: new Date().toISOString(),
								hash: files[0].hash
							};
							database.child("hashes").push(files[0].hash);
							db.put(hash, (err, res) => {
								console.log("successful put");
							});
						}
					);
				} else {
					$(".hash-ref").append(`<p>Adult content restricted!</p>`);
				}
			})
			.fail(function(data) {
				console.log(data);
			});
	} else {
		console.log("text");
		console.log(isAdult);
		var text = editor.getContents();
		var title = $("#title").val();
		var article = { title: title, text: text };
		var hashfile;
		ipfs.files.add(
			Buffer.from(JSON.stringify(article)),
			(err, files) => {
				$(".hash-ref")
					.append(`<p class="hash-ref">Document uploaded to IPFS! -
			<span>${files[0].hash}</span> </p>`);
				var hash = {
					_id: new Date().toISOString(),
					hash: files[0].hash
				};
				database.child("hashes").push(files[0].hash);
				db.put(hash, (err, res) => {
					console.log("successful put");
				});
			}
		);
	}
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
