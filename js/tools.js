let originalTool=tool;
let ghostShape;
let ghostDiv;

function setTool(t)
{
    tool = t;
    document.getElementById("top-bar").dataset.tool = t;
    
    if (ghostShape)
    {
        ghostDiv.Destroy()
        ghostShape=null;
    }
    
    switch(tool)
    {
        case "square":
            ghostShape = shapeClass("square");
            const div = document.createElement("div");
            ghostDiv = div;
            
            div.classList.add("shape");
            document.getElementById("shape-container").appendChild(div);
            break;
    }
    
}

function MouseDown(e, div, shape)
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
    if (ghostShape)
    {
        const apos = getMousePos(e.clientX, e.clientY);
        console.log(apos)
        ghostShape.x = apos.x;
        ghostShape.y = apos.y;
        updateShape(ghostShape, ghostDiv);
    }
}