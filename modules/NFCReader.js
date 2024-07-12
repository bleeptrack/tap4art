'use strict';
import SVGGen from "./SVG-Gen.js"

export default class NFCReader extends HTMLElement {
	
	
	constructor() {
		super();
		
		this.shadow = this.attachShadow({ mode: 'open' });
		
		const urlParams = new URLSearchParams(window.location.search);
		const nfcinfo = urlParams.get('uid').split("x")
		this.uid = nfcinfo[0]
		this.tapcount = Number(`0x${nfcinfo[1]}`)
		this.renderCount = this.tapcount
		
		let animationLength = 6
		this.viewRange = 5
		

		const container = document.createElement('template');

		// creating the inner HTML of the editable list element
		container.innerHTML = `
			<link href="https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap" rel="stylesheet">
			<style>
				@import url('https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap');
				
				#content{
					
				}
				
				span{
					width: 80vw;
					text-align: center;
				}
				
				section{
					font-family: "Major Mono Display", monospace;
					font-weight: 400;
					font-style: normal;
					width: 100%;
					height: 70vh;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					align-items: center;
					color: none;
				}
				
				@keyframes animate-top {
					100% { transform: translate(0,-50vh); }
				}
				
				#arrow-down {
					animation: bounce 2s ease infinite;
					animation-delay: 8s;
				}
				@keyframes bounce {
					0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
					40% {transform: translateY(-30px);}
					60% {transform: translateY(-15px);}
				}
				
				section:first-of-type{
					animation:  animate-top linear;
					animation-timeline: view();
					animation-range: exit;
					height: 100svh !important;
				
				}
				
				
				#popover{
					font-family: "Major Mono Display", monospace;
					font-weight: 400;
					font-style: normal;
					padding: 5vw;
					box-sizing: border-box;
					height: 80svh;
					width: 80svw;
					text-align: center;
					border-radius: 5vh;
					font-size: 1em;
				}
				
				#popover a{
					color:white;
				}
				
				#popover>div{
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					height: 100%;
				}
				
				svg-gen{
					width: min(50vh, 80vw);
					height: min(50vh, 80vw);
				}
				
				#buttonbox {
					width: 70vw;
					display: flex;
					justify-content: space-around;
					flex-direction: row;
				}	
				
				#buttonbox button{
					background: none;
					border:none;
				}
				
				
				h1{
					font-size: 2.5em;
					margin-block-end: 0em;
				}
				
				::backdrop {
					background-color: black;
					opacity: 0.7;
				}

			</style>
			<div id="content">
				

				<div id="popover" popover>
					<div>
						<div>
						<p>you discovered a sticker from the generative art project TAP4ART !</p>
						<p>each sticker contains an nfc tag, which your phone can scan.</p>
						<p>the tag stores two informations: it's own ID and a SCAN COUNT.</p>
						<p>an algorithm creates:</br> a unique style (color, dimensions) from the ID and a unique shape arrangement from the SCAN COUNT.</p>
						<p>so each sticker has a different look and each scan creates a completely new image!<p>
						</div>
						<p><a href="info.bleeptrack.de">by bleeptrack</a></br><a href="https://github.com/bleeptrack/tap4art">code on github</a></p>
					</div>
				</div>

				<!-- <button id="save">saveSticker</button> -->
				<!-- <button id="share">share</button> -->
				<!-- <button popovertarget="popover">Open Popover</button> -->
			</div>
		`;

		//background-image: url("${this.mediaPath}");
		this.shadow.appendChild(container.content.cloneNode(true));
		
		
		
		
		
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
		this.observer = new IntersectionObserver((entries) => {
			if(entries[0].isIntersecting){
				this.addNextSection()
			}
			console.log(entries[0].isIntersecting)
		}, {threshold: 0.5});
		
		while(this.renderCount > this.tapcount-this.viewRange && this.renderCount >= 0){
			this.addNextSection()
		}
		
		//console.log(this.shadow.getElementById("content").lastChild)
		this.observer.observe(this.shadow.getElementById("content").lastChild)
		
	}
	

	
	addNextSection(){
		console.log("fire", this.renderCount)
		if(this.renderCount >= 0){
			this.createSection(this.uid, this.renderCount, this.renderCount==this.tapcount, this.renderCount==0, this.renderCount<this.tapcount)
			this.renderCount--
		}
	}
	
	createSection(uid, tapcount, loadin, addCover, scrollAnim){
		let svg = new SVGGen(uid, tapcount, loadin, addCover, scrollAnim)
		
		let section = document.createElement("section")
		
		if(tapcount==this.tapcount){
			let txt = `
			<h1>scan ${this.tapcount}</h1>
			<span>you revealed a new image:<span>
			`
			
			
			section.insertAdjacentHTML("beforeend", txt);
			
			svg.addEventListener("created", (data) => {
				console.log("created", data.detail)
				this.info = data.detail
				
				
				//let bgColor = `color-mix(in srgb, ${event.data.col1} 30%, white)`
				//document.body.style.backgroundColor = bgColor
				
				let mix = `color-mix(in srgb, ${data.detail.col1} 50%, black)`
				section.style.color = mix
				this.shadow.getElementById("popover").style.backgroundColor = `color-mix(in srgb, ${data.detail.mainColor} 10%, black)`
				this.shadow.getElementById("popover").style.color = `color-mix(in srgb, ${data.detail.col1} 30%, white)`
				this.shadow.querySelectorAll(".icon").forEach( elem => elem.setAttribute("fill", mix) )
				
				
			})
		}
		
		section.appendChild(svg)
		
		if(tapcount==this.tapcount){
			let d = `
			<div id="buttonbox">
				<button popovertarget="popover"><svg class="icon" xmlns="http://www.w3.org/2000/svg" height="10vw" viewBox="0 -960 960 960" width="10vw" fill="black"><path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></button>
				<button id="share-btn"><svg class="icon" xmlns="http://www.w3.org/2000/svg" height="10vw" viewBox="0 -960 960 960" width="10vw" fill="black"><path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-640q17 0 28.5-11.5T760-760q0-17-11.5-28.5T720-800q-17 0-28.5 11.5T680-760q0 17 11.5 28.5T720-720ZM240-440q17 0 28.5-11.5T280-480q0-17-11.5-28.5T240-520q-17 0-28.5 11.5T200-480q0 17 11.5 28.5T240-440Zm480 280q17 0 28.5-11.5T760-200q0-17-11.5-28.5T720-240q-17 0-28.5 11.5T680-200q0 17 11.5 28.5T720-160Zm0-600ZM240-480Zm480 280Z"/></svg></button>
			</div>`
			section.insertAdjacentHTML("beforeend", d);
			
			let bottom = `<div>
				<span>discover previous scans</span>
				<span><svg class="icon" id="arrow-down" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M480-200 240-440l56-56 184 183 184-183 56 56-240 240Zm0-240L240-680l56-56 184 183 184-183 56 56-240 240Z"/></svg></span>
			</div>`
			if(this.tapcount == 1){
				bottom = `<div>
				<span>wow, first scan!</span>
				</div>`
			}
			section.insertAdjacentHTML("beforeend", bottom);
		}
			
		
			
		this.shadow.getElementById("content").appendChild(section)
		this.observer.disconnect()
		
		if(tapcount <= this.tapcount-this.viewRange){
			console.log("observe", tapcount)
			this.observer.observe(section)
		}
		
		if(tapcount==this.tapcount){
			this.shadow.getElementById("share-btn").addEventListener("click", async () => {
			
				//alert(this.shadow.getElementById("0").imageData)
				//console.log(this.shadow.getElementById(`${this.tapcount}`))
				
				const blob = await (await fetch(this.shadow.getElementById(`${this.tapcount}`).getShare())).blob();
				const file = new File([blob], 'tap4art.png', { type: blob.type });
				
				//const blob2 = await (await fetch(this.shadow.getElementById(`${this.tapcount}`).imageData)).blob();
				//const file2 = new File([blob2], 'tap4art-sticker.png', { type: blob2.type });
				
				const shareData = {
					text: "I created this image by scanning a sticker by @bleeptrack",
					files: [file]
				}
				
				try{
					navigator.share(shareData)
				}catch (error) {
					alert(error.message)
				}
				
			})
		}
		
		if(tapcount==0){
			
			this.shadow.getElementById("0").addEventListener("dblclick", async () => {
				
				
				var svg = this.shadow.getElementById(`0`).getSVG().outerHTML
				console.log(svg, this.shadow.getElementById(`0`).getSVG())
				var svgBlob = new Blob([svg], {type:"image/svg+xml;charset=utf-8"});
				var svgUrl = URL.createObjectURL(svgBlob);
				var downloadLink = document.createElement("a");
				downloadLink.href = svgUrl;
				downloadLink.download = `tap4art-${this.uid}-${this.tapcount}.svg`;
				document.body.appendChild(downloadLink);
				downloadLink.click();
				document.body.removeChild(downloadLink);
				
				
			})
			this.shadow.getElementById("0").parentNode.style.marginBottom = "30vh"
		}
	}
	
	/*
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
	*/
	

}

customElements.define('nfc-reader', NFCReader);
