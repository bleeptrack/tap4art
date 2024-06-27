onmessage = function(e) {
	
	self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.15/paper-full.min.js')
	self.importScripts('https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js')
	self.importScripts('/node_modules/seedrandom/seedrandom.min.js')
	
	paper.install(this)
	paper.setup(new Size(400, 400));
	paper.project.clear()
	
	this.sticker = false
	if(e.data.tapcount < 1){
		console.log("STICKER TIME")
		this.sticker = true
	}
	
	console.log("initializing with", e.data.uid, e.data.tapcount, e.data.tapcount < 1)
	let IDrng = new Math.seedrandom(e.data.uid)
	let TAPrng = new Math.seedrandom(e.data.uid + e.data.tapcount)
	
	let gridgap = IDrng()*130 + 70 //100-300
	let lineWidth = 4 + IDrng() * gridgap/4
	
	let circleRadius = (gridgap - (lineWidth*3))/2
	let lineRadius = (gridgap - lineWidth)/2
	let mainColor = new Color(IDrng(), IDrng(), IDrng())
	let col1 = new Color(IDrng(), IDrng(), IDrng())
	let col2 = new Color(IDrng(), IDrng(), IDrng())

	let rot1 = IDrng()*360
	let rot2 = rot1 + 20 + IDrng()*120
	
	
	let mainShape = createBigShape(rot1, rot2)
	mainShape.fillColor = mainColor
	
	let ref = mainShape.clone()
	
	let g = new Group([
		mainShape,
		mainShape.clone(),
		createShapeGroup(rot1, rot2, col1),
		createShapeGroup(rot2, rot1, col2),
		])
	g.clipped = true;
	
	
	
	
	postMessage({svg: paper.project.exportJSON(), mainColor: mainColor.toCSS(), col1: col1.toCSS(), col2:col2.toCSS()});
	
	function createBigCutout(rot, rot2, mainShape, flip1, flip2){
		let l = (lineWidth + lineRadius*2) 
		let dir1 = new Point(0,1).normalize(l / Math.sin( (rot2-rot)* Math.PI / 180  )).rotate(rot) 
		let dir2 = new Point(0,1).normalize(l / Math.sin( (rot2-rot)* Math.PI / 180  )).rotate(rot2) 
		
		let point = new Point(mainShape.position)
		point = point.add(dir1.multiply(Math.round(TAPrng()*4 -2)) )
		point = point.add(dir2.multiply(Math.round(TAPrng()*4 -2)) )
		
		if(mainShape.contains(point)){
			let shapes = [
				createCutout(dir1, dir2, point, mainShape, 1, 1),
				createCutout(dir1, dir2, point, mainShape, 1, -1),
				createCutout(dir1, dir2, point, mainShape, -1, 1),
				createCutout(dir1, dir2, point, mainShape, -1, -1)
			]
			
			shapes = shapes.filter( s => s!=null)
			shapes.forEach( s => s.remove())
			shapes = shapes.map( s => s.intersect(mainShape))
			shapes.sort( (a,b) => b.area - a.area)
			let fin = shapes.pop()
			
			return fin
		}
		return null
	}
	
	function createCutout(dir1, dir2, point, mainShape, flip1, flip2){
		let c = new Path.Circle(point, circleRadius)
		c.fillColor = 'black'
		//c.remove()
		
		let p = c.getOffsetsWithTangent(dir1)
		let p2 = c.getOffsetsWithTangent(dir2)
		console.log(p)
		let lines = [
			new Path.Line(c.getPointAt(p[0]), c.getPointAt(p[0]).add(dir1.multiply(5*flip1))),
			new Path.Line(c.getPointAt(p[1]), c.getPointAt(p[1]).add(dir1.multiply(5*flip1))),
			new Path.Line(c.getPointAt(p2[0]), c.getPointAt(p2[0]).add(dir2.multiply(5*flip2))),
			new Path.Line(c.getPointAt(p2[1]), c.getPointAt(p2[1]).add(dir2.multiply(5*flip2)))
		]
		lines.forEach( l => l.remove() )
		
		
		lines = findNonIntersectingLines(lines)
		let shape = new Path()
		shape.add(lines[0].firstSegment.point)
		shape.add(lines[0].lastSegment.point)
		shape.add(lines[1].lastSegment.point)
		shape.add(lines[1].firstSegment.point)
		shape.fillColor = "black"
		shape.remove()
		
		c.scale(1.001)
		shape = c.unite(shape)
		c.remove()
		
		if(mainShape.intersects(shape)){
			//ref.clone()
			//fin = ref.intersect(shape)
			//fin.fillColor = 'red'
			//shape.remove()
			
			return shape
		}
		return null
		//let fin = mainShape.intersect(shape)
		//shape.remove()
		
	}
	
	function findNonIntersectingLines(arr){
		for(let l1 = 0; l1<arr.length; l1++){
			for(let l2 = l1+1; l2<arr.length; l2++){
				if(arr[l1].intersects(arr[l2])){
					console.log("intersect", l1, l2)
					return arr.filter((x, idx) => idx != l1 && idx != l2 )
				}
			}
			
		}
	}
	
	function createBigShape(rot, rot2){
		let r = new Rectangle([0,0], [400,400])
		let outerRect = new Path.Rectangle(r, circleRadius)
		outerRect.position = view.center
		
		if(!this.sticker){
			
			let deco = []
			
			let cuto = createBigCutout(rot1, rot2, outerRect)
			let cuto2 = createBigCutout(rot1, rot2, outerRect)
			if(cuto && cuto.area < outerRect.area/5){
				deco.push(cuto)
			}
			
			if(cuto2 && cuto2.area < outerRect.area/5 && !cuto2.intersects(cuto)){
				deco.push(cuto2)
			}
			
			
			for(let i = 0; i<TAPrng()*4+1; i++){
				let line 
				if(TAPrng() < 0.5){
					line = thinLine(rot, rot2)
				}else{
					line = thinLine(rot2, rot)
				}
				if(intersectsCorrect(line, outerRect, deco)){
					deco.push(line)
				}else{
					line.remove()
					i--
					//line.fillColor = "black"
				}
			}
			
			let shape = cut(outerRect, deco)
			return shape
		}
		return outerRect
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
			if(elem.intersects(d)){
				return false
			}
		}
		return true
	}

	function thinLine(rot, rot2){
		let l = (lineWidth + lineRadius*2) 
		let dir1 = new Point(0,1).normalize(l / Math.sin( (rot2-rot)* Math.PI / 180  )).rotate(rot) 
		let dir2 = new Point(0,1).normalize(l / Math.sin( (rot2-rot)* Math.PI / 180  )).rotate(rot2) 
		
		let line = new Path.Rectangle([0,0], [900,lineWidth])
		line.pivot = line.bounds.leftCenter
		line.rotate(dir1.angle)
		line.position = view.center
		line.translate(dir1.multiply(Math.round(TAPrng()*3)))
		line.translate(dir2.multiply(Math.round(TAPrng()*3)))
		line.strokeColor = "blue"
		if(TAPrng()<0.5){
			line.rotate(180)
		}

		let c
		let endType = Math.floor(TAPrng()*2)
		switch(endType){
			case 0:
				c = new Path.Circle(line.pivot, lineWidth/2)
				break
			case 1:
				c = new Path.Circle(line.pivot, Math.max(circleRadius, lineWidth/2))
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
