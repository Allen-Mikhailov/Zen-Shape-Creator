const shapeContainer = document.getElementById("shapeContainer")

const activeShapes = []
const shapeDivs = []
let patterns = []

let tool = "Move"

let dragging = null;
let dragingDiv = null;
let DragStartX
let DragStartY
let xOffset;
let yOffset;
let startingAngle;
let XLineDistance;

function getShapePos(div)
{
    const rect = div.getBoundingClientRect()
    return {
        x: rect.left + (rect.right-rect.left)/2, 
        y: rect.top + (rect.bottom-rect.top)/2
    }
}

function registerShape(div, _type) {
    const shape = {
        x: 0,
        y: 0,
        height: 100,
        width: 100,
        angle: 0,
        type: _type
    }

    div.onmousedown = (ev) => {
        console.log("Dragging")
        const x = ev.clientX
        const y = ev.clientY

        DragStartX = x
        DragStartY = y

        xOffset = x - shape.x
        yOffset = y - shape.y
        dragging = shape;
        dragingDiv = div

        const pos = getShapePos(div)
        const originalAngle = Math.atan2(
            y - pos.y, 
            x - pos.x) 
        / Math.PI * 180;

        startingAngle = (shape.angle || 0) - originalAngle;

        // Line Distance
        const point = closestPointOnLine([pos.x, pos.y], dragging.angle, [x, y])
        XLineDistance = Math.sqrt(Math.pow(point[0]-pos.x, 2) + Math.pow(point[1]-pos.y, 2))
    }

    div.classList.add("shape")

    shapeDivs.push(div)

    activeShapes.push(shape)

    return shape
}

//#region shape Creation
function CreateTriangle() {
    const baseGroup = document.createElementNS(NSSvg, "g")
    const triangle = document.createElementNS(NSSvg, "path")

    triangle.setAttribute("d", trianglePath)
    triangle.classList.add("triangle")

    baseGroup.appendChild(triangle)

    const shape = registerShape(baseGroup, "Triangle");

    shapeContainer.appendChild(baseGroup)
}

function CreateSquare() {
    const baseGroup = document.createElementNS(NSSvg, "g")
    const square = document.createElementNS(NSSvg, "path")

    square.setAttribute("d", squarePath)
    square.classList.add("square")

    baseGroup.appendChild(square)

    const shape = registerShape(baseGroup, "Square");

    shapeContainer.appendChild(baseGroup)
}

function CreateHalfCircle() {
    const baseGroup = document.createElementNS(NSSvg, "g")
    const halfCircle = document.createElementNS(NSSvg, "path")

    halfCircle.setAttribute("d", halfCirclePath)
    halfCircle.classList.add("halfCircle")

    baseGroup.appendChild(halfCircle)

    const shape = registerShape(baseGroup, "HalfCircle");

    shapeContainer.appendChild(baseGroup)
}

// Buttons
document.getElementById("CreateTriangle").onclick = CreateTriangle
document.getElementById("CreateSquare").onclick = CreateSquare
document.getElementById("CreateHalfCircle").onclick = CreateHalfCircle

//#endregion

function UpdateTool(newTool)
{
    tool = newTool;
    document.getElementById("CurrentTool").innerHTML = newTool
}

document.getElementById("MoveTool").onclick   = () => UpdateTool("Move")
document.getElementById("RotateTool").onclick = () => UpdateTool("Rotate")
document.getElementById("ScaleXTool").onclick = () => UpdateTool("ScaleX")
document.getElementById("ScaleYTool").onclick = () => UpdateTool("ScaleY")

const rotGrid = 5
const moveGrid = 1

function grid(value, gri) {
    return Math.floor(value / gri) * gri
}

document.onmousemove = (ev) => {
    const x = ev.clientX
    const y = ev.clientY

    const widthStuff = shapeContainer.clientWidth / 100

    if (dragging) {
        if (tool == "Move") {
            dragging.x = (x - xOffset)
            dragging.y = (y - yOffset)
            dragingDiv.style.translate = `${grid(dragging.x / widthStuff, moveGrid)}% ${grid(dragging.y / widthStuff, moveGrid)}%`
        } else if (tool == "Rotate") {
            const pos = getShapePos(dragingDiv)
            const angle = Math.atan2(y - pos.y, x - pos.x)
            dragging.angle = grid(startingAngle + angle / Math.PI * 180, 5)
            dragingDiv.style.transformOrigin = `${dragging.width/100 * 5}px ${dragging.height/100 * 5}px`
            dragingDiv.style.rotate = `z ${dragging.angle}deg`
        } else if (tool == "ScaleX") {
            const pos = getShapePos(dragingDiv)
            const point = closestPointOnLine([pos.x, pos.y], dragging.angle, [x, y])
            const distance = Math.sqrt(Math.pow(point[0]-pos.x, 2) + Math.pow(point[1]-pos.y, 2))
            console.log(distance, XLineDistance)
            dragging.width = grid((distance-XLineDistance)/widthStuff*10, 1)
            dragingDiv.style.scale= `${dragging.width}% ${dragging.height}%`
        }
    }
}

document.getElementById("SavePattern").onclick = () => {
    patterns.push(structuredClone(activeShapes))
}

function sectForShape(shape) {
    const widthStuff = shapeContainer.clientWidth / 100
    return `
    {   
        translate: ${grid(shape.x / widthStuff, moveGrid)}% ${grid(shape.y / widthStuff, moveGrid)}%;
        rotate: z ${shape.angle || 0}deg
    }
`
}

document.getElementById("Compile").onclick = () => {
    // Base Consts
    const widthStuff = shapeContainer.clientWidth / 100

    // Reorganizing data

    const shapes = []

    let shapeCount = 0
    const patternCount = patterns.length
    for (let shapeIndex in patterns[0]) {
        const shape = patterns[0][shapeIndex]
        shapes.push({
            type: shape.type,
            sects: []
        })
        shapeCount++;
    }

    for (let patternIndex in patterns) {
        const pattern = patterns[patternIndex]
        for (let i = 0; i < shapeCount; i++) {
            shapes[i].sects.push(pattern[i])
        }
    }

    // Basic File Starters
    let svgFile = SVGStart
    let styleSheet = baseStyleSheet

    // Creating the middle bulk of files
    for (const shapeIndex in shapes) {
        // Importing the svg text
        const shape = shapes[shapeIndex]

        let shapeSVG = ""
        switch(shape.type) {
            case "Triangle":
                shapeSVG = `
<g id="shape${shapeIndex}">
    <path class="TrianglePath" id="shapePath${shapeIndex}" d="${trianglePath}"></path>
</g>
`
                break;
            case "Square":
                shapeSVG = `
<g id="shape${shapeIndex}">
    <path class="SquarePath" id="shapePath${shapeIndex}" d="${squarePath}"></path>
</g>
`           
                break;
            case "HalfCircle":
                    shapeSVG = `
<g id="shape${shapeIndex}">
    <path class="HalfCirclePath" id="shapePath${shapeIndex}" d="${halfCirclePath}"></path>
</g>
`           
                    break;
        }
        svgFile += shapeSVG

        styleSheet += `
        @keyframes shape${shapeIndex}Anim {`
        styleSheet += `0% ${sectForShape(shape.sects[patternCount - 1])}`
        for (let i = 0; i < patternCount; i++) {
            styleSheet += `${(i + 1) / patternCount * 100}% ${sectForShape(shape.sects[i])}`
        }

        styleSheet += `}`

        styleSheet += `
#shape${shapeIndex} {
    transform-origin: 5px 5px;
    animation-name: shape${shapeIndex}Anim;
    animation-duration: 4s;
    animation-iteration-count: infinite;
}
`
        
    }

    // Ending files and displaying somehow
    svgFile += SVGEnd
    svgFile = svgFile.replace("/* Styles */", styleSheet)
    console.log(svgFile)

    // Displaying the compiled stuff
    svgFile = svgFile.replaceAll("&", "&amp").replaceAll("<", "&lt").replaceAll(">", "&gt")
    document.getElementById("compileDisplay").style.visibility = "visible"
    document.getElementById("compiledText").innerHTML = svgFile
}

function HidCompileDisplay()
{
    console.log("Test")
    document.getElementById("compileDisplay").style.visibility = "hidden"
}

document.getElementById("HideCompileDisplay").onclick = HidCompileDisplay

document.onmouseup = () => {
    dragging = null;
}