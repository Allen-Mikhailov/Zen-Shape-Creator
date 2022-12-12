let originalTool=tool;
let ghostShape;
let ghostDiv;

let moveGrid = 1
let rotateGrid = 5

let changes

function getColor()
{
    return document.getElementById("shape-color-input").value;
}

function shapeTool()
{
    return tool == "square" || tool == "triangle" || tool == "semi-circle"
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

    if (shapeTool())
    {
        switch(tool)
        {
            case "square":
                ghostShape = shapeClass("square");
                ghostDiv = SquareBase()
                break;
            case "triangle":
                ghostShape = shapeClass("triangle");
                ghostDiv = TriangleBase()
                break;
            case "semi-circle":
                ghostShape = shapeClass("semi-circle");
                ghostDiv = SemiCircleBase()
                break;
        }

        ghostShape.color = getColor()   
        ghostDiv.classList.add("shape");
        ghostDiv.classList.add("ghost");
        document.getElementById("shape-container").appendChild(ghostDiv);
        updateShape(ghostShape, ghostDiv)
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

        case "delete":
            div.remove()
            drawnShapes[shape.index] = null

        case "push-up":
            if(div.nextElementSibling)
            div.parentNode.insertBefore(div.nextElementSibling, div);
            break;

        case "push-down":
            if(div.previousElementSibling)
            div.parentNode.insertBefore(div, div.previousElementSibling);
            break;

        case "push-hard-up":
            div.parentNode.appendChild(div)
            break;
        case "push-hard-down":
            div.parentNode.prepend(div)
            break;
    }
}

document.onmousedown = (e) => {
    const apos = getMousePos(e.clientX, e.clientY);

    if (apos.x < 0 || apos.x > 100 || apos.y < 0 || apos.y > 100) return;

    if (shapeTool())
    {
        let div, newShape
        switch(tool)
        {
            case "square":
                div = SquareBase()
                newShape = addShape(div, "square");
                break;

            case "triangle":
                div = TriangleBase()
                newShape = addShape(div, "triangle");
                break;

            case "semi-circle":
                div = SemiCircleBase()
                newShape = addShape(div, "semi-circle");
                break;
                    
        }

        document.getElementById("shape-container").appendChild(div);
        newShape.x = grid(apos.x, moveGrid)
        newShape.y = grid(apos.y, moveGrid)
        newShape.color = getColor()
        updateShape(newShape, div)
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