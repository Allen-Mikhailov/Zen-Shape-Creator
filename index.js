const shapeContainer = document.getElementById("shapeContainer")
const triangleButton = document.getElementById("CreateTriangle")

const shapes = []

let tool = "Move"

let dragging = null;
let DragStartX
let DragStartY
let xOffset;
let yOffset;

function CreateShape(_type)
{

    const shape = {
        x: 0,
        y: 0,
        height: 100,
        width: 100,
        rotation: 0
    }
    const shapeDiv = document.createElementNS("http://www.w3.org/2000/svg", _type)

    // shapeDiv.classList.add("shape")

    shapeDiv.onmousedown = (ev) => {
        const x = ev.clientX
        const y = ev.clientY

        DragStartX = x
        DragStartY = y

        xOffset = x-shape.x
        yOffset = y-shape.y
        dragging = shape;
    }
    
    shape.div = shapeDiv

    return shape
}

function CreateTriangle()
{
    const shape = CreateShape("path");

    shape.div.setAttribute("d", "M 0 0 L 10 0 L 0 10")
    shape.div.classList.add("triangle")

    shapeContainer.appendChild(shape.div)
}

// Buttons
triangleButton.onclick = CreateTriangle
document.getElementById("MoveTool").onclick= () => tool = "Move"
document.getElementById("RotateTool").onclick= () => tool = "Rotate"

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
            dragging.div.style.translate  = `${dragging.x/widthStuff}% ${dragging.y/widthStuff}%`
        } else if (tool == "Rotate") {
            const angle = Math.atan2(y-DragStartY, x-DragStartX)
            dragging.angle = angle/Math.PI*180
            dragging.div.style.rotate = `z ${dragging.angle}deg`
        }
    }
}

document.onmouseup = () => {
    dragging = null;
}