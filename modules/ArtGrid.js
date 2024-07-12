'use strict';
import SVGGen from "./SVG-Gen.js"

export default class ArtGrid extends HTMLElement {
	
	
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });
		
		this.gridSizeX = 4
		this.gapSize = 10
		this.gridSizeY = 8

		const container = document.createElement('template');

		// creating the inner HTML of the editable list element
		container.innerHTML = `
			<style>
				#content{
					display: grid;
					grid-template-columns: repeat(${this.gridSizeX}, 100px);
					grid-template-rows: repeat(${this.gridSizeY}, 100px);
					
					
					min-height: 0;  /* NEW */
					min-width: 0; 
					
					gap: ${this.gapSize}px;
					
					grid-auto-flow: dense;
				}
				div{
					
				}
				#scancount{
					display: none;
				}
				.single{
					grid-column: span 1;
					grid-row: span 1;
					
				}
				.double{
					grid-column: span 2;
					grid-row: span 2;
					
				}
				.triple{
					grid-column: span 3;
					grid-row: span 3;
					
				}

			</style>
			<div id="content">
				
			</div>
		`;

		//background-image: url("${this.mediaPath}");
		this.shadow.appendChild(container.content.cloneNode(true));
		
		
		
	}
	
	connectedCallback() {
		let id = Math.round(Math.random()*999999999999)
		for(let i = 0; i<this.gridSizeX*this.gridSizeY; ){
			let c = this.createSection(id, i, true, false, false, 1)
			i += c
			console.log(i)
		}
		
		
	}
	
	createSection(uid, tapcount, loadin, addCover, scroll, animfactor){
		let svg = new SVGGen(uid, tapcount, loadin, addCover, scroll, animfactor)
		let rnd = Math.random()
		let count = 0
		let remaining = this.gridSizeX*this.gridSizeY - tapcount
		if(rnd < 0.1 && remaining >=9){
			svg.classList.add("triple")
			count = 9
		}else if(rnd < 0.3 && remaining >=4){
			svg.classList.add("double")
			count = 4
		}else{
			svg.classList.add("single")
			count = 1
		}
		this.shadow.getElementById("content").appendChild(svg)
		return count
	}
	

	

}

customElements.define('art-grid', ArtGrid);
