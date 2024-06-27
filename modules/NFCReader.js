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
			</div>
		`;

		//background-image: url("${this.mediaPath}");
		this.shadow.appendChild(container.content.cloneNode(true));
		
	}
	
	connectedCallback() {
		paper.install(window)
		paper.setup(new Size(1000, 1000));
		
		this.createImage()
	}
	
	createImage(){
		console.log("tyring to start worker")
		this.worker = new Worker("/modules/svg-worker.js")
		this.worker.addEventListener("message", (event) => {
			paper.project.importJSON(event.data.svg)
			this.shadow.getElementById("content").appendChild(paper.project.exportSVG())
		})
		this.worker.postMessage({
			uid: this.uid,
			tapcount: this.tapcount
		})
	}
	
	

}

customElements.define('nfc-reader', NFCReader);
