const shapeContainer = document.getElementById("shapeContainer")
const triangleButton = document.getElementById("CreateTriangle")

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


function registerShape(div, _type)
{
    const shape = {
        x: 0,
        y: 0,
        height: 100,
        width: 100,
        rotation: 0,
        type: _type
    }

    div.onmousedown = (ev) => {
        const x = ev.clientX
        const y = ev.clientY

        DragStartX = x
        DragStartY = y

        xOffset = x-shape.x
        yOffset = y-shape.y
        dragging = shape;
        dragingDiv = div

        const originalAngle = Math.atan2(y-(dragging.y+dragging.height/2), x-(dragging.x+dragging.width/2))/Math.PI*180;

        startingAngle = (shape.angle || 0) - originalAngle;
    }

    div.classList.add("shape")
    
    shapeDivs.push(div)

    activeShapes.push(shape)

    return shape
}

function CreateTriangle()
{
    const baseGroup = document.createElementNS(NSSvg, "g")
    const triangle = document.createElementNS(NSSvg, "path")

    triangle.setAttribute("d", trianglePath)
    triangle.classList.add("triangle")

    baseGroup.appendChild(triangle)

    const shape = registerShape(baseGroup, "Triangle");

    shapeContainer.appendChild(baseGroup)
}

// Buttons
triangleButton.onclick = CreateTriangle
document.getElementById("MoveTool").onclick= () => tool = "Move"
document.getElementById("RotateTool").onclick= () => tool = "Rotate"

const rotGrid = 5
const moveGrid = 2

function grid(value, gri)
{
    return Math.floor(value/gri)*gri
}

document.onmousemove = (ev) => {
    const x = ev.clientX
    const y = ev.clientY

    const widthStuff = shapeContainer.clientWidth/100

    if (dragging)
    {
        if (tool == "Move")
        {
            dragging.x = (x-xOffset)
            dragging.y = (y-yOffset)
            dragingDiv.style.translate  = `${grid(dragging.x/widthStuff, moveGrid)}% ${grid(dragging.y/widthStuff, moveGrid)}%`
        } else if (tool == "Rotate") {
            const angle = Math.atan2(y-(dragging.y+dragging.height/2), x-(dragging.x+dragging.width/2))
            dragging.angle = grid(startingAngle + angle/Math.PI*180, 5)
            dragingDiv.style.transformOrigin = `5px 5px`
            dragingDiv.style.rotate = `z ${dragging.angle}deg`
        }
    }
}

document.getElementById("SavePattern").onclick = () => {
    patterns.push(structuredClone(activeShapes))
}

document.getElementById("Compile").onclick = () => {
    // Reorganizing data

    const shapes = []

    let shapeCount = 0
    const patternCount = patterns.length
    for (let shapeIndex in patterns[0])
    {
        const shape = patterns[0][shapeIndex]
        shapes.push({
            type: shape.type,
            sects: []
        })
        shapeCount++;
    }

    for (let patternIndex in patterns)
    {
        const pattern = patterns[patternIndex]
        for (let i = 0; i < shapeCount; i++)
        {
            shapes[i].sects.push(pattern[i])
        }
    }

    console.log(shapes)

    // Basic File Starters
    let svgFile = SVGStart

    // Creating the middle bulk of files

    // Ending files and displaying somehow
    svgFile += SVGEnd
}

document.onmouseup = () => {
    dragging = null;
}