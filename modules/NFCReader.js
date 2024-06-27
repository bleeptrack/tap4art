'use strict';

export default class NFCReader extends HTMLElement {
	
	
	constructor() {
		super();
		
		this.shadow = this.attachShadow({ mode: 'open' });
		
		const urlParams = new URLSearchParams(window.location.search);
		const nfcinfo = urlParams.get('uid').split("x")
		this.uid = nfcinfo[0]
		this.tapcount = Number(`0x${nfcinfo[1]}`)
		

		const container = document.createElement('template');

		// creating the inner HTML of the editable list element
		container.innerHTML = `
			<style>
				
			</style>
			<div id="content">
				<h1>${this.uid}</h1>
				<h1>${this.tapcount}</h1>
				<button id="save">saveSticker</button>
			</div>
		`;

		//background-image: url("${this.mediaPath}");
		this.shadow.appendChild(container.content.cloneNode(true));
		this.shadow.getElementById("save").addEventListener("click", () => {
			
			var svg = paper.project.exportSVG({asString: true, bounds:'content'})
			var svgBlob = new Blob([svg], {type:"image/svg+xml;charset=utf-8"});
			var svgUrl = URL.createObjectURL(svgBlob);
			var downloadLink = document.createElement("a");
			downloadLink.href = svgUrl;
			downloadLink.download = `tap4art-${this.uid}-${this.tapcount}.svg`;
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
	
		})
	}
	
	connectedCallback() {
		paper.install(window)
		paper.setup(new Size(400, 400));
		//this.createImage(this.uid, this.tapcount)
		this.createImage(this.uid+Math.random().toString(), 0)
	}
	
	createImage(uid, tapcount){
		
		let worker = new Worker("/modules/svg-worker.js")
		worker.addEventListener("message", (event) => {
			paper.project.clear()
			paper.project.importJSON(event.data.svg)
			
			paper.project.importSVG("https://tap4art.bleeptrack.de/tap4art2.svg", {
				onLoad: (item) => {
					console.log(item)
					//let bgCirc = new Path.Circle(view.center, 80)
					//bgCirc.fillColor = "white"
					
					item.position = view.center
					item.bringToFront()
					//item.fillColor = "black"
					item.scale(16)
					let item2 = item.clone()
					item.strokeColor = "white"
					item.strokeJoin = 'round'
					item.strokeWidth = 5
					
					
					let newSVG = paper.project.exportSVG({bounds: "content"})
					//console.log("clip", newSVG.getElementById("clip-1"))
					newSVG.getElementById("clip-1").id = `clip-${tapcount}`
					//console.log("clip", newSVG.querySelector('[clip-path="url(#clip-1)"]'))
					newSVG.querySelector('[clip-path="url(#clip-1)"]').setAttribute("clip-path", `url(#clip-${tapcount})`)
					this.shadow.getElementById("content").appendChild(newSVG)
					if(tapcount > 0){
						this.createImage(uid, tapcount-1)
					}
					
				}
				
			})
			
			
		})
		worker.postMessage({
			uid: uid,
			tapcount: tapcount
		})
	}
	
	

}

customElements.define('nfc-reader', NFCReader);
