const shapeContainer = document.getElementById("shapeContainer")
const triangleButton = document.getElementById("CreateTriangle")

const shapes = []
let patterns = []

let tool = "Move"

let dragging = null;
let DragStartX
let DragStartY
let xOffset;
let yOffset;
let startingAngle;


function registerShape(div)
{
    const shape = {
        x: 0,
        y: 0,
        height: 100,
        width: 100,
        rotation: 0
    }

    div.onmousedown = (ev) => {
        const x = ev.clientX
        const y = ev.clientY

        DragStartX = x
        DragStartY = y

        xOffset = x-shape.x
        yOffset = y-shape.y
        dragging = shape;

        const originalAngle = Math.atan2(y-(dragging.y+dragging.height/2), x-(dragging.x+dragging.width/2))/Math.PI*180;

        startingAngle = (shape.angle || 0) - originalAngle;
    }

    div.classList.add("shape")
    
    shape.div = div

    shapes.push(shape)

    return shape
}

function CreateTriangle()
{
    const baseGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
    const triangle = document.createElementNS("http://www.w3.org/2000/svg", "path")

    triangle.setAttribute("d", "M 0 0 L 10 0 L 0 10")
    triangle.classList.add("triangle")

    baseGroup.appendChild(triangle)

    const shape = registerShape(baseGroup);

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
            dragging.div.style.translate  = `${grid(dragging.x/widthStuff, moveGrid)}% ${grid(dragging.y/widthStuff, moveGrid)}%`
        } else if (tool == "Rotate") {
            const angle = Math.atan2(y-(dragging.y+dragging.height/2), x-(dragging.x+dragging.width/2))
            dragging.angle = grid(startingAngle + angle/Math.PI*180, 5)
            dragging.div.style.transformOrigin = `5px 5px`
            dragging.div.style.rotate = `z ${dragging.angle}deg`
        }
    }
}

document.getElementById("SavePattern").onclick = () => {
    patterns.push(structuredClone(shapes))
}

document.getElementById("Compile").onclick = () => {
    
}

document.onmouseup = () => {
    dragging = null;
}