
function setTool(t)
{
    tool = t;
    document.getElementById("top-bar").dataset.tool = t;
}

function onMouseDown(e, div, shape)
{
    const shapePos = getShapePos(div, shape)

    dragData = {
        shape: shape,
        div: drawnDivs[shape.index],
        start: {
            x: e.clientX,
            y: e.clientY
        },
        offset: {
            x: e.clientX-shapePos.x,
            y: e.clientX-shapePos.y,
        },
        startShapePos: shapePos,

        original: structuredClone(shape)
    }
}

document.onmousemove = (e) => {
    const mouseX = e.clientX
    const mouseY = e.clientX
}