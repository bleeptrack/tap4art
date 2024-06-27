onmessage = function(e) {
	console.log("worker received", e.data)
	
	
	self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.15/paper-full.min.js')
	self.importScripts('https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js')
	self.importScripts('/node_modules/seedrandom/seedrandom.min.js')
	
	paper.install(this)
	paper.setup(new Size(1000, 1000));
	
	console.log("initializing with", e.data.uid, e.data.tapcount)
	let IDrng = new Math.seedrandom(e.data.uid)
	let TAPrng = new Math.seedrandom(e.data.tapcount)
	
	console.log(IDrng())
	
	let gridgap = IDrng()*100 + 100 //100-300
	let lineWidth = 15 + IDrng() * 15
	let circleRadius = (gridgap - (lineWidth*3))/2
	let lineRadius = (gridgap - lineWidth)/2
	let mainColor = new Color(IDrng(), IDrng(), IDrng())
	let col1 = new Color(IDrng(), IDrng(), IDrng())
	let col2 = new Color(IDrng(), IDrng(), IDrng())

	let rot1 = IDrng()*45
	let rot2 = rot1 + 30 + IDrng()*90
	
	
	let mainShape = createBigShape(rot1, rot2)
	mainShape.fillColor = mainColor
	
	let g = new Group([
		mainShape,
		mainShape.clone(),
		createShapeGroup(rot1, rot2, col1),
		createShapeGroup(rot2, rot1, col2),
		])
	g.clipped = true;
	
	
	postMessage({svg: paper.project.exportJSON()});
	
	function createBigShape(rot, rot2){
		let r = new Rectangle([0,0], [400,400])
		let outerRect = new Path.Rectangle(r, circleRadius)
		outerRect.position = view.center
		
		let deco = []
		for(let i = 0; i<8; i++){
			let line 
			if(TAPrng() < 0.5){
				line = thinLine(rot, rot2)
			}else{
				line = thinLine(rot2, rot)
			}
			line.fillColor = "blue"
			if(intersectsCorrect(line, outerRect, deco)){
				deco.push(line)
			}else{
				line.remove()
			}
		}
		
		let shape = cut(outerRect, deco)
		return shape
	}
	
	function cut(rect, deco){
		let tmp
		let last = rect
		for(let d of deco){
			tmp = last.subtract(d)
			last.remove()
			d.remove()
			last = tmp
		}
		return last
	}
	
	function intersectsCorrect(elem, rect, deco){
		let rectInters = elem.getCrossings(rect)
		if(rectInters.length != 2){
			return false
		}
		for(let d of deco){
			let decoInters = elem.getIntersections(d)
			if(decoInters.length > 0){
				return false
			}
		}
		return true
	}

	function thinLine(rot, rot2){
		let l = (lineWidth + lineRadius*2) /2
		let dir1 = new Point(0,1).normalize(l / Math.sin( (rot2-rot)* Math.PI / 180  )).rotate(rot) 
		let dir2 = new Point(0,1).normalize(l / Math.sin( (rot2-rot)* Math.PI / 180  )).rotate(rot2) 
		
		let line = new Path.Rectangle([0,0], [900,lineWidth])
		line.pivot = line.bounds.leftCenter
		line.rotate(dir1.angle)
		line.position = view.center
		line.translate(dir1.multiply(Math.round(TAPrng()*2)))
		line.translate(dir2.multiply(Math.round(TAPrng()*2)))
		line.strokeColor = "blue"
		if(TAPrng()<0.5){
			line.rotate(180)
		}

		let c
		let endType = Math.floor(TAPrng()*3)
		switch(endType){
			case 0:
				c = new Path.Circle(line.pivot, lineWidth/2)
				break
			case 1:
				c = new Path.Circle(line.pivot, lineWidth)
				break
			case 2:
				c = new Path.Circle(line.pivot, circleRadius)
				break
		}
		
		
		//c.remove()
		
		let uni = line.unite(c)
		line.remove()
		c.remove()
		
		return uni
	}
	
	function createShapeGroup(rot, rot2, color){
    
		let l = (lineWidth + lineRadius*2)
		console.log("l", l)
		let dirl = new Point(0,1).normalize(l / Math.sin( (rot2-rot)* Math.PI / 180  )).rotate(rot)
		console.log(100/Math.sin( (rot2-rot)* Math.PI / 180  ))
		let transl = new Point(0,1).normalize(l / Math.sin( (rot2-rot)* Math.PI / 180  )).rotate(rot2)
		console.log(transl)
		let shapeGroup = new Group([])
		
		
		
		for(let i = 1; i<5; i++){
			let secondLine = new Path.Line([0,0], dirl.multiply( Math.round(TAPrng()*3) ) )
			secondLine.pivot = secondLine.firstSegment.point
			//secondLine.rotate(rot)
			secondLine.position = view.center
			secondLine.translate(dirl.multiply( Math.round(TAPrng()*3)) )
			secondLine.translate(transl.multiply(i))
			secondLine.remove()
			let shape = createLine(secondLine.firstSegment.point, secondLine.lastSegment.point)
			shapeGroup.addChild(shape)
		}
		shapeGroup.pivot = shapeGroup.children[Math.floor(shapeGroup.children.length/2)].pivot
		let c = new Path.Circle(shapeGroup.pivot, 3)
		c.fillColor = "red"
		shapeGroup.position = view.center
		
		
		shapeGroup.fillColor = color
		return shapeGroup
	}

	function createLine(p1, p2){
		let c1 = new Path.Circle(p1, lineRadius)
		c1.fillColor = mainColor
		let c2 = c1.clone()
		c2.position = p2
		
		let centerLine = new Path.Line(p1, p2)
		centerLine.strokeColor = "black"
		centerLine.remove()
		
		let bridge = new Path()
		let n1 = centerLine.getNormalAt(0)
		let n2 = centerLine.getNormalAt(centerLine.length)
		bridge.add(p1.add( n1.multiply(lineRadius)) )
		bridge.add(p2.add( n2.multiply(lineRadius)) )
		bridge.add(p2.subtract( n2.multiply(lineRadius)) )
		bridge.add(p1.subtract( n1.multiply(lineRadius)) )
		bridge.fillColor = mainColor
		
		let tmp = c1.unite(bridge)
		let tmp2 = tmp.unite(c2)
		c1.remove()
		c2.remove()
		bridge.remove()
		tmp.remove()
		tmp2.pivot = p1
		
		if(TAPrng()<0.3){
			let c = new Path.Circle(p1, circleRadius)
			c.fillColor = "white"
			let t = tmp2.subtract(c)
			tmp2.remove()
			t.remove()
			c.remove()
			tmp2 = t
		}
		if(TAPrng()<0.3){
			let c = new Path.Circle(p2, circleRadius)
			c.fillColor = "white"
			let t = tmp2.subtract(c)
			tmp2.remove()
			t.remove()
			c.remove()
			tmp2 = t
		}
		
		
		return tmp2
	}
	
}
