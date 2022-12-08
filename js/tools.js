let originalTool=tool;
let ghostShape;
let ghostDiv;

function getColor()
{
    return document.getElementById("shape-color-input").value;
}

function setTool(t)
{
    tool = t;
    document.getElementById("top-bar").dataset.tool = t;
    
    if (ghostShape)
    {
        ghostDiv.remove()
        ghostShape=null;
    }
    
    switch(tool)
    {
        case "square":
            ghostShape = shapeClass("square");
            const div = SquareBase()
            ghostDiv = div;

            ghostShape.color = getColor()
            
            div.classList.add("shape");
            div.classList.add("ghost");
            document.getElementById("shape-container").appendChild(div);
            break;
    }
    
}

function MouseDown(e, div, shape)
{
    const shapePos = getShapePos(div, shape)

    console.log(e.clientX, shapePos.x)

    dragData = {
        shape: shape,
        div: div,
        start: {
            x: e.clientX,
            y: e.clientY
        },
        offset: {
            x: e.clientX-shapePos.x,
            y: e.clientY-shapePos.y,
        },
        startShapePos: shapePos,

        original: structuredClone(shape)
    }

    e.preventDefault()
}

document.onmousedown = (e) => {
    const apos = getMousePos(e.clientX, e.clientY);
    switch(tool)
    {
        case "square":
            const div = SquareBase()
            const newShape = addShape(div, "square");
            document.getElementById("shape-container").appendChild(div);
            newShape.x = apos.x
            newShape.y = apos.y
            newShape.color = getColor()
            updateShape(newShape, div)
            break;
    }
}

document.onmouseup = (e) => {
    dragData = null;
}

document.onmousemove = (e) => {
    if (ghostShape)
    {
        const apos = getMousePos(e.clientX, e.clientY);
        ghostShape.x = apos.x;
        ghostShape.y = apos.y;
        updateShape(ghostShape, ghostDiv);
    }

    if (dragData)
    {
        switch (tool)
        {
            case "move":
                // console.log(dragData.offset)
                const apos = getMousePos(
                    e.clientX - dragData.offset.x, 
                    e.clientY - dragData.offset.y
                );
        
                dragData.shape.x = apos.x;
                dragData.shape.y = apos.y;
                updateShape(dragData.shape, dragData.div);
        }
    }
}