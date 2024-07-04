'use strict';


export default class NFCReader extends HTMLElement {
	
	
	constructor() {
		super();
		
		this.shadow = this.attachShadow({ mode: 'open' });
		
		const urlParams = new URLSearchParams(window.location.search);
		const nfcinfo = urlParams.get('uid').split("x")
		this.uid = nfcinfo[0]
		this.tapcount = Number(`0x${nfcinfo[1]}`)
		
		let animationLength = 6
		

		const container = document.createElement('template');

		// creating the inner HTML of the editable list element
		container.innerHTML = `
			<style>
				svg{
					filter: drop-shadow(-10px 10px 20px rgba(0, 0, 0, .4));
					width: min(50vh, 80vw);
					height: min(50vh, 80vw);
					align-self: center;
					animation:  animate-shadow ease-in-out, animate-top linear;
					animation-timeline: view();
					animation-range: entry, exit;
				}
				
				@keyframes animate-top {
					100% { transform: translate(0,-50vh); }
				}
				
				@keyframes animate-shadow {
					0% { filter: drop-shadow(0px 0px 0px rgba(0, 0, 0, .4)); }
					60% { filter: drop-shadow(0px 0px 0px rgba(0, 0, 0, .4)); }
					100% { filter: drop-shadow(-10px 10px 20px rgba(0, 0, 0, .4)); }
				}
				
				
				section{
					width: 100%;
					height: 70vh;
					display: flex;
					justify-content: space-around;
				}
				
				.loadin{
					animation:  animate-shadow;
					animation-duration: ${animationLength}s;
				}
				
				.loadin g[clip-path]>g:nth-child(2) {
					animation:  animate-right ease-in-out both;
					animation-duration: ${animationLength}s;
				}
				
				.loadin g[clip-path]>g:nth-child(3) {
					animation:  animate-left ease-in-out both;
					animation-duration: ${animationLength}s;
				}
				
				.loadin g[clip-path]>path:first-child {
					animation: fill-anim ease-in-out, dash ease-in-out;
					animation-duration: ${animationLength}s;
				}
				
				@keyframes animate-left {
					0% { opacity: 0; transform: translate(-100%, -100%); }
					80% { opacity: 1; transform: translate(0%, 0%); }
				}
				
				@keyframes animate-right {
					0% { opacity: 0; transform: translate(100%, -100%); }
					80% { opacity: 1; transform: translate(0%, 0%); }
				}
				
				g[clip-path]>g:nth-child(2) {
					animation:  animate-right linear both;
					animation-timeline: view();
					animation-range: entry;
				}

				g[clip-path]>g:nth-child(3) {
					animation:  animate-left linear both;
					animation-timeline: view();
					animation-range:  entry;
				}
				
				g[clip-path]>path:first-child {
					animation: fill-anim linear, dash linear;
					animation-timeline: view();
					animation-range: entry 0% entry 80%, entry;
				}

				@keyframes dash {
					50% { stroke-dashoffset: 0; }
					100% { stroke-dashoffset: 0; }
				}
				
				@keyframes fill-anim {
					0%{ fill: rgba(0,0,0,0); }
				}

			</style>
			<div id="content">
				<!-- <h1>${this.uid}</h1> -->
				<!-- <h1>${this.tapcount}</h1> -->
				<!-- <button id="save">saveSticker</button> -->
				<button id="share">share</button>
			</div>
		`;

		//background-image: url("${this.mediaPath}");
		this.shadow.appendChild(container.content.cloneNode(true));
		
		this.shadow.getElementById("share").addEventListener("click", async () => {
			
			alert(this.imageData)
			
			const blob = await (await fetch(this.imageData)).blob();
			const file = new File([blob], 'tap4art.png', { type: blob.type });
			
			const blob2 = await (await fetch(this.imageDataSticker)).blob();
			const file2 = new File([blob2], 'tap4art-sticker.png', { type: blob2.type });
			
			const shareData = {
				text: "I created this image by scanning a sticker by @bleeptrack",
				files: [file, file2]
			}
			
			try{
				navigator.share(shareData)
			}catch (error) {
				alert(error.message)
			}
			
		})
		
		/*
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
		*/
	}
	
	connectedCallback() {
		paper.install(window)
		paper.setup(new Size(500, 500));
		this.loadfirst = false;
		this.createImage(this.uid, this.tapcount)
		//this.createImage(this.uid, 0)
	}
	
	createImage(uid, tapcount){
		
		let worker = new Worker("/modules/svg-worker.js")
		worker.addEventListener("message", (event) => {
			paper.project.clear()
			paper.project.importJSON(event.data.svg)
			
			
			
			
			
			if(tapcount == 0){
				let item = paper.project.importSVG("https://tap4art.bleeptrack.de/tap4art5.svg", {
					onLoad: (svg) => {
						console.log(item)
						
						var item = svg.children[1].clone();
						item.insertAbove(svg);
						svg.remove()
						
						//item.position = view.center
						paper.project.activeLayer.children.forEach(elem => { elem.position = paper.view.center } ) 
						item.bringToFront()
						//item.fillColor = "black"
						item.scale(16)
						let item2 = item.clone()
						item.strokeColor = "white"
						item.strokeJoin = 'round'
						item.strokeWidth = 5
						
						this.prepSVG(event, uid, tapcount)
						
						
						
					}
				
				})
			}else{
				this.prepSVG(event, uid, tapcount)
			}
			
			
			
			
			
			
		})
		
		worker.postMessage({
			uid: uid,
			tapcount: tapcount
		})
	}
	
	prepSVG(event, uid, tapcount){
		let bgColor = `color-mix(in srgb, ${event.data.col1} 30%, white)`
			document.body.style.backgroundColor = bgColor
			
			
			let newSVG = paper.project.exportSVG({bounds: "content"})
			if(!this.shadow.querySelector(".loadin")){
				newSVG.classList.add("loadin")
			}
			
			let conti = newSVG.querySelector('[clip-path="url(#clip-1)"]')
			
			newSVG.getElementById("clip-1").id = `clip-${tapcount}`
			conti.setAttribute("clip-path", `url(#clip-${tapcount})`)
			
			conti.firstChild.style.strokeDasharray = conti.firstChild.getTotalLength() +10
			conti.firstChild.style.strokeDashoffset = conti.firstChild.getTotalLength() +5
			
			
			
			
			
			let section = document.createElement("section")
			section.appendChild(newSVG)
			
			this.shadow.getElementById("content").appendChild(section)
			
			//create image for sharing
			
			paper.project.activeLayer.children.forEach(elem => { elem.position = paper.view.center } ) 
			
			var text = new PointText(paper.project.activeLayer.children[0].bounds.bottomRight.add([0,15]));
			text.justification = 'right';
			text.fillColor = event.data.mainColor
			text.content = 'tap4art @bleeptrack';
			text.opacity = 0.5

			let bg = new Path.Rectangle([0,0], [500,500])
			bg.fillColor = bgColor
			bg.sendToBack()
			
			if(tapcount == 0){
				paper.project.view.update()
				this.imageDataSticker = paper.project.view.element.toDataURL("image/png;base64")
				console.log(this.imageDataSticker)
			}else if(!this.imageData){
				paper.project.view.update()
				this.imageData = paper.project.view.element.toDataURL("image/png;base64")
				console.log(this.imageData)
			}
			
			
			
			
			if(tapcount > 0){
				this.createImage(uid, tapcount-1)
			}
	}
	
	

}

customElements.define('nfc-reader', NFCReader);
