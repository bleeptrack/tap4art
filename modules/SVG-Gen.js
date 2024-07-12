'use strict';

export default class SVGGen extends HTMLElement {
	
	
	constructor(uid, tapcount, loadin, addCover, scrollAnim, animFactor) {
		super();
		
		this.shadow = this.attachShadow({ mode: 'open' });
		
		
		this.uid = uid
		this.tapcount = tapcount
		this.loadin = loadin
		this.addCover = addCover
		this.scrollAnim = scrollAnim
		
		
		animFactor = animFactor || 0.5
		
		this.animationLength = Math.round( (Math.random()*15 + 10)*animFactor )

		const container = document.createElement('template');
		
		this.stickertext = `<g id="" stroke="none" class="stickertext"><path d="M245.83472,258.29944l17.36685,46.47616l4.32718,2.6328l33.52715,-12.0568l0.50192,-6.94192l-28.73182,-74.10096l-8.55333,-0.352l-7.43608,-13.74112l-21.96838,-10.55984l-20.23581,5.9904l-12.63787,12.32736l-4.09486,13.64784l2.70197,17.81232l6.01832,7.47808l8.42005,7.91824l11.39954,5.03856h12.07525z" id="path19233-2 1 1" fill-opacity="0.57455" fill="#fefefe" stroke-linecap="butt" stroke-linejoin="miter"></path><path d="M246.95731,70.67481l-44.71457,108.8016c-4.93032,3.37936 -9.49187,7.26752 -13.6095,11.60032h-35.14824v-114.1264h44.53267v-6.2672h-95.16731v6.2672h44.53269v114.1264h-44.53269v117.85536h6.26731v-55.88496h55.97592c1.01904,28.2336 15.94824,54.132 39.86939,69.16368v103.83248l-47.07929,-114.5728h-6.6063l-48.42702,117.85536h6.60632l16.0817,-38.94336h58.08432l15.91634,38.94336h5.42395h1.34768h4.91133v-40.47312h42.50696l5.4157,-0.1648l28.95534,40.6384h7.44966l-29.97232,-41.82912c8.35368,-2.25776 15.1829,-6.8224 20.48867,-13.70864c5.41858,-6.99904 8.13594,-14.90784 8.13594,-23.71328c0,-7.56352 -1.97726,-14.44512 -5.92832,-20.65408c-0.51408,-0.832 -1.05328,-1.63776 -1.62058,-2.41424c5.42517,-2.55312 10.56608,-5.67088 15.33757,-9.30176v0.032h44.53267v111.58816h6.0937v-111.58816h44.53267v-6.2672l-32.25435,-44.36736c8.35366,-2.25776 15.1829,-6.83072 20.48867,-13.71696c5.41854,-6.9992 8.12766,-14.89984 8.12766,-23.70512c0,-7.56352 -1.97722,-14.44512 -5.92832,-20.65392c-3.83822,-6.20896 -9.14312,-10.8952 -15.91634,-14.056c-2.9351,-1.3552 -6.21026,-2.31328 -9.82266,-2.87744c-3.49955,-0.6768 -7.73301,-1.0176 -12.7,-1.0176h-37.29798c-0.54,-0.6 -1.08848,-1.1936 -1.64538,-1.7776v-36.496h41.15097c8.35365,0 15.51427,-1.5248 21.49739,-4.57232c6.88618,-3.49952 12.31253,-8.51712 16.2636,-15.0648c4.06392,-6.54752 6.0937,-13.71632 6.0937,-21.5056c0,-8.128 -1.97725,-15.2968 -5.92832,-21.5056c-3.95112,-6.20896 -9.31666,-11.00832 -16.08998,-14.39504c-6.6603,-3.38672 -13.93429,-5.08496 -21.83638,-5.08496h-47.4183v113.0184c-1.82891,-1.4832 -3.71843,-2.88992 -5.66373,-4.2168l-44.71459,-108.8016zM310.20101,76.94217h41.15097c7.11187,0 12.97461,1.1328 17.60306,3.38992c6.096,2.82224 10.95618,7.05568 14.56862,12.7c3.61238,5.64448 5.41568,11.85504 5.41568,18.62832c0,6.88624 -1.8033,13.14928 -5.41568,18.79376c-3.61245,5.644 -8.41187,9.87776 -14.39499,12.7c-4.62843,2.25664 -10.55192,3.3816 -17.77669,3.3816h-41.15097zM250.17366,78.80249l26.58235,64.69056h-52.99934zM221.21832,149.5868h58.07605l10.07896,24.65584c-12.08962,-6.26144 -25.50216,-9.53872 -39.11699,-9.55808c-13.6657,0.016 -27.12641,3.32464 -39.24928,9.63248zM250.00003,170.68728c43.80561,0 79.31718,35.51152 79.31712,79.31712c0.00006,43.8056 -35.5115,79.31712 -79.31712,79.31712c-43.80563,0 -79.3172,-35.51152 -79.31713,-79.31712c-0.00006,-43.8056 35.5115,-79.31712 79.31713,-79.31712zM109.11767,197.33576h74.08334c-11.09942,14.1624 -17.43723,31.4712 -18.10742,49.45232h-55.97592zM317.27033,197.33576h31.87403c8.01498,0 14.22565,0.9056 18.62832,2.712c6.09587,2.59648 10.83475,6.55104 14.22134,11.85664c3.49955,5.30592 5.25034,11.22912 5.25034,17.77664c0,5.87024 -1.46352,11.28832 -4.3987,16.25536c-2.9351,4.96704 -6.88952,8.92144 -11.85664,11.85664c-4.9671,2.93504 -10.38512,4.39872 -16.25534,4.39872h-20.12486c0.61344,-4.03408 0.9368,-8.10704 0.96736,-12.18736c-0.0304,-19.11088 -6.4775,-37.65808 -18.30584,-52.66864zM358.46265,268.29368l31.23737,43.1768h-80.48294c12.14616,-11.6336 20.58314,-26.59744 24.2507,-43.01136h19.57091zM154.49372,319.59816l26.59062,64.69056h-52.99934zM211.22203,325.81576c12.06906,6.23136 25.4515,9.4912 39.0343,9.50848c10.4264,-0.032 20.75878,-1.97328 30.48496,-5.72992c0.68976,0.8592 1.33952,1.7584 1.94304,2.70384c3.49955,5.30576 5.25032,11.22912 5.25032,17.77664c0,5.87024 -1.47184,11.28832 -4.40696,16.25536c-2.9351,4.9672 -6.88131,8.9216 -11.84837,11.85664c-4.9671,2.9352 -10.38512,4.40688 -16.25534,4.40688h-44.20195z" id="path354-1 1 1" fill="#000000" stroke-linecap="butt" stroke-linejoin="miter"></path><path d="M232.14677,188.37736c-20.26514,0 -36.75344,16.48816 -36.75345,36.75344c0.00002,20.26528 16.48832,36.75344 36.75345,36.75344c3.93955,0 7.72782,-0.6416 11.28728,-1.79696l15.31144,43.66176c1.65278,4.71296 7.18475,6.64608 12.03472,4.94528l25.90411,-9.08256c4.84994,-1.70064 7.95704,-6.66464 6.30426,-11.37792l-25.11136,-71.61936c-1.60446,-4.5752 -6.86854,-6.55488 -11.61192,-5.11136c-5.42538,-13.536 -18.66792,-23.12576 -34.11853,-23.12576zM232.14677,193.48104c13.26946,0 24.60789,8.12928 29.31672,19.69056l-7.14987,2.50656c-3.69259,-8.59088 -12.24472,-14.63184 -22.16685,-14.63184c-13.27824,0 -24.08454,10.80608 -24.08454,24.08448c0,13.2784 10.8063,24.08448 24.08454,24.08448c2.47221,0 4.85666,-0.376 7.10458,-1.072l2.49906,7.13488c-3.02869,0.9616 -6.2533,1.4944 -9.60363,1.4944c-17.50157,0 -31.61945,-14.14048 -31.61945,-31.64224c0,-17.50176 14.11789,-31.6496 31.61945,-31.6496zM232.14677,206.15c7.74894,0 14.37504,4.59952 17.32728,11.22688l-5.9192,2.07632c-2.10005,-4.1864 -6.42891,-7.08208 -11.40808,-7.08208c-7.01738,0 -12.7519,5.74224 -12.75197,12.75968c-0.00003,7.0176 5.73451,12.752 12.75197,12.752c1.15792,0 2.2771,-0.1664 3.34467,-0.4608l2.06115,5.89648c-1.71229,0.5056 -3.52475,0.784 -5.40582,0.784c-10.51483,0 -18.97317,-8.45808 -18.97317,-18.97312c0,-10.51472 8.45834,-18.9808 18.97317,-18.9808zM269.4212,216.1236c1.78902,-0.00528 3.19744,0.9216 3.6391,2.18192l25.11136,71.61952c0.5888,1.6792 -0.53904,3.94496 -3.17854,4.86976l-25.90411,9.08272c-2.63947,0.9248 -4.93029,-0.144 -5.51907,-1.81968l-25.11889,-71.61936c-0.5888,-1.6792 0.53168,-3.96768 3.17101,-4.89248l3.87317,-1.3584l0.92864,2.63504c0.40464,1.152 1.7384,1.72464 2.99736,1.2832l13.61267,-4.77152c1.25904,-0.4416 1.95261,-1.73008 1.54784,-2.88416l-0.92864,-2.62736l3.87315,-1.3584c0.66,-0.2384 1.29872,-0.3376 1.89506,-0.3408zM231.95046,217.482c0.0656,-0.0016 0.128,0 0.19632,0c2.82158,0.00016 5.26515,1.4976 6.59117,3.74496c-4.14685,2.04384 -6.6163,6.58912 -5.10381,10.90224l0.16608,0.4768c-0.532,0.112 -1.084,0.1744 -1.65346,0.1744c-4.25387,0 -7.64819,-3.39424 -7.64816,-7.64816c0.00002,-4.18736 3.29157,-7.54608 7.45186,-7.64832z" id="path19202-2 1 1" fill="#000000"  stroke-linecap="round" stroke-linejoin="round"></path></g>`

		// creating the inner HTML of the editable list element
		container.innerHTML = `
			<div id="container">
			<span id="scancount">#${this.tapcount==0 ? "sticker" : this.tapcount}</span></div>
		`;
		this.shadow.appendChild(container.content.cloneNode(true));
		paper.install(window)
		
		
		paper.setup(new Size(500, 500));
		this.createImage(this.uid, this.tapcount)
		this.id = this.tapcount
		
		if(!scrollAnim){
			this.shadow.getElementById("scancount").remove()
		}
	}
	
	connectedCallback() {
		
		//this.createImage(this.uid, 0)
		
	}
	
	flipSide(){
		if(Math.random() < 0.5){
			return -1
		}else{
			return 1
		}
	}
	
	addStyle(event){
		let s1 = this.flipSide()
		let s2 = this.flipSide()
		let style = document.createElement('template');
		style.innerHTML = `
			
			<style>
				svg{
					width: 100%;
					height: 100%;
					
				}
				
				#container{
					position: relative;
				}
				
				.container-scrollAnim{
					animation: animate-top linear;
					animation-timeline: view();
					animation-range: exit;
					
				}
				
				#scancount{
					position: absolute;
					bottom: -4svh;
					right: 20px;
					font-size: 1.5em;
					color: white;
					opacity: 0.25;
				}
				
				.scrollAnim{
					filter: drop-shadow(-10px 10px 20px rgba(0, 0, 0, .4));
					align-self: center;
					animation:  animate-shadow ease-in-out;
					animation-range: entry cover 50%;
					view-timeline: --subjectReveal block;
					animation-timeline: --subjectReveal;
				}
				
				@keyframes animate-top {
					100% { transform: translate(0,-50vh); }
				}
				
				
				
				.loadin{
					filter: drop-shadow(-10px 10px 20px rgba(0, 0, 0, .4));
					animation: animate-shadow ease-in-out;
					animation-duration: ${this.animationLength}s;
				}
				
				.loadin g[clip-path]>g:nth-child(2) {
					animation:  animate-right ease-in-out both;
					animation-duration: ${this.animationLength}s;
				}
				
				.loadin g[clip-path]>g:nth-child(3) {
					animation:  animate-left ease-in-out both;
					animation-duration: ${this.animationLength}s;
				}
				
				.loadin g[clip-path]>path:first-child {
					animation: fill-anim ease-in-out, dash ease-in-out;
					animation-duration: ${this.animationLength}s;
				}
				
				@keyframes animate-shadow {
					00% { filter: drop-shadow(0px 0px 0px rgba(0, 0, 0, .4)); }
					60% { filter: drop-shadow(0px 0px 0px rgba(0, 0, 0, .4)); }
					
				}
				
				@keyframes animate-left {
					0% { opacity: 0; transform: translate(${Math.round(s1*event.data.dir2[0])}%, ${Math.round(s1*event.data.dir2[1])}%); }
					
					100% { opacity: 1; transform: translate(0%, 0%); }
				}
				
				@keyframes animate-right {
					0% { opacity: 0; transform: translate(${Math.round(s2*event.data.dir1[0])}%, ${Math.round(s2*event.data.dir1[1])}%); }
					
					100% { opacity: 1; transform: translate(0%, 0%); }
				}
				
				.scrollAnim g[clip-path]>g:nth-child(2) {
					animation:  animate-right ease-in-out both;
					animation-timeline: --subjectReveal;
					animation-range: entry cover 50%;
				}

				.scrollAnim g[clip-path]>g:nth-child(3) {
					animation:  animate-left ease-in-out both;
					animation-timeline: --subjectReveal;
					animation-range:  entry cover 50%;
				}
				
				.scrollAnim g[clip-path]>path:first-child {
					animation: fill-anim ease-in-out, dash ease-in-out;
					animation-timeline: --subjectReveal;
					animation-range: entry 0% cover 50%, entry 0% cover 50%;
				}

				@keyframes dash {
					100% { stroke-dashoffset: 0; }
				}
				
				@keyframes fill-anim {
					0%{ fill: rgba(0,0,0,0); }
				}

				.stickertext{
					/* transform: translate(-49px, -49px); */
				}
			</style>
		`;
		this.shadow.appendChild(style.content.cloneNode(true));
	}
	
	createImage(uid, tapcount){
		console.log("call")
		let worker = new Worker("/modules/svg-worker.js")
		worker.addEventListener("message", (event) => {
			
			this.prepSVG(event, uid, tapcount)
			this.shareData = event.data.shareSvg
			this.addStyle(event)
			//this.getShare()
			
		})
		
		worker.postMessage({
			uid: uid,
			tapcount: tapcount
		})
	}
	
	getShare(){
		paper.project.clear()
		paper.project.importJSON(this.shareData)
		//paper.project.activeLayer.children.forEach(elem => { elem.position = paper.view.center } ) 
		paper.project.view.update()
		return paper.project.view.element.toDataURL("image/png;base64")
		//console.log(paper.project.view.element.toDataURL("image/png;base64"))
	}
	
	getSVG(){
		return this.shadow.querySelector("svg")
	}
	
	prepSVG(event, uid, tapcount){
			paper.project.clear()
			paper.project.importJSON(event.data.svg)
			
			let bgColor = `color-mix(in srgb, ${event.data.col1} 30%, white)`
			document.body.style.backgroundColor = bgColor
			
			if(this.shadow.getElementById("scancount")){
				this.shadow.getElementById("scancount").style.color = `color-mix(in srgb, ${event.data.mainColor} 50%, black)`
			}
			
			let newSVG = paper.project.exportSVG({bounds: "content"})
			if(this.loadin){
				newSVG.classList.add("loadin")
				newSVG.classList.add("loadin-top")
			}
			if(this.scrollAnim){
				newSVG.classList.add("scrollAnim")
				this.shadow.getElementById("container").classList.add("container-scrollAnim")
			}
			
			let conti = newSVG.querySelector('[clip-path="url(#clip-1)"]')
			
			newSVG.getElementById("clip-1").id = `clip-${tapcount}`
			conti.setAttribute("clip-path", `url(#clip-${tapcount})`)
			
			conti.firstChild.style.strokeDasharray = conti.firstChild.getTotalLength() +10
			conti.firstChild.style.strokeDashoffset = conti.firstChild.getTotalLength() +5
			
			
			if(this.addCover){
				newSVG.insertAdjacentHTML( 'beforeend', this.stickertext );
				newSVG.insertAdjacentHTML( 'beforeend', this.stickertext );
				
				newSVG.querySelector(".stickertext").setAttribute("stroke-width", 5)
				newSVG.querySelector(".stickertext").setAttribute("stroke", "white")
				
				newSVG.querySelectorAll(".stickertext").forEach(elem => elem.setAttribute("transform", "translate(-50 -50)"))
				
			}
			
			this.shadow.getElementById("container").appendChild(newSVG)
			this.dispatchEvent(new CustomEvent("created", {detail: event.data}))
			
			
			/*
			const viewTimeline = new ViewTimeline({
				'subject': newSVG,
				'axis': 'block',
				'inset': 'auto'
			});
			newSVG.animate( { fill: ['black', 'white' ] }, {
				timeline: viewTimeline,
				rangeStart: 'entry',
				rangeEnd: 'entry',
				fill: 'both'
			});
			*/
			

	}
	
	

}

customElements.define('svg-gen', SVGGen);
