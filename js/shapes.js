function getMousePos(x, y)
{
    const rect = document.getElementById("shape-container").getBoundingClientRect()

    return {
        x: ( x - rect.left ) / rect.width  * 100,
        y: ( x - rect.top )  / rect.height * 100,
    }
}

function shapeClass()
{
    return {
        x: 0,
        y: 0,
        height: defaultSize,
        width: defaultSize,
        angle: 0,
        type: _type,
        color: "blue",
        index: drawnShapes.length+1
    }
}

function getShapePos(div, shape)
{
    const rect = div.getBoundingClientRect()
    const containerRect = document.getElementById("shape-container").getBoundingClientRect()
    return {
        x: rect.left + containerRect.width / 20 * shape.width/2,
        y: rect.top + containerRect.height / 20 * shape.height/2,
    }
}

function getShapeTransform(shape)
{
    const originApply = `translate(${shape.width/2}%, ${shape.height/2}%)`
    const originUndo = `translate(${-shape.width/2}%, ${-shape.height/2}%)`

    const posString = `translate(${shape.x}%, ${shape.y}%)`
    const rotationString = `rotateZ(${shape.angle}deg)`
    const sizeString = `scale(${shape.width}%, ${shape.height}%)`
    // Base 
    return `${posString} ${originApply} ${rotationString} ${originUndo} ${sizeString}`
}

updateShape = function(shape, div)
{
    div.style.transform = getShapeTransform(shape)
    div.style.color = shape.color
}

addShape = function(div, _type)
{
    const shape = shapeClass();

    div.onmousedown = (e) => {onMouseDown(e, shape)}
    div.onmouseup = (e) => {
        if (dragData == shape)
            dragData = null
    }

    div.classList.add("shape")
    updateShape(shape, div)

    drawnShapes.push(shape)
    drawnDivs.push(div)
}