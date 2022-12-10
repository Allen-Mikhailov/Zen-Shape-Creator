let originalTool=tool;
let ghostShape;
let ghostDiv;

let moveGrid = 1
let rotateGrid = 5

function getColor()
{
    return document.getElementById("shape-color-input").value;
}

function grid(value, gri) {
    return Math.floor(value / gri) * gri
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
    const shapePos = getShapePos(div)
    const shapeMid = getShapeMid(div)

    const originalAngle = Math.atan2(
        e.clientY - shapeMid.y, 
        e.clientX - shapeMid.x) 
    / Math.PI * 180;

    startingAngle = (shape.angle || 0) - originalAngle;

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
        shapeMid: shapeMid,
        startShapePos: shapePos,
        angle: startingAngle,

        original: structuredClone(shape)
    }

    switch (tool)
    {
        case "color":
            shape.color = getColor()
            updateShape(shape, div)
            break;

        case "push-up":
            if(div.nextElementSibling)
            div.parentNode.insertBefore(div.nextElementSibling, div);
            break;

        case "push-down":
            if(div.previousElementSibling)
            div.parentNode.insertBefore(div, div.previousElementSibling);
            break;
    }
}

document.onmousedown = (e) => {
    const apos = getMousePos(e.clientX, e.clientY);

    if (apos.x < 0 || apos.x > 100 || apos.y < 0 || apos.y > 100) return;

    console.log(apos)
    switch(tool)
    {
        case "square":
            const div = SquareBase()
            const newShape = addShape(div, "square");
            document.getElementById("shape-container").appendChild(div);
            newShape.x = grid(apos.x, moveGrid)
            newShape.y = grid(apos.y, moveGrid)
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
        ghostShape.x = grid(apos.x, moveGrid);
        ghostShape.y = grid(apos.y, moveGrid);
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
        
                dragData.shape.x = grid(apos.x, moveGrid);
                dragData.shape.y = grid(apos.y, moveGrid);
                updateShape(dragData.shape, dragData.div);

                break;

            case "rotate":
                const angle = Math.atan2(e.clientY - dragData.shapeMid.y, e.clientX - dragData.shapeMid.x)
                dragData.shape.angle = grid(dragData.angle + angle / Math.PI * 180, rotateGrid)
                updateShape(dragData.shape, dragData.div);

                break;
        }
    }
}