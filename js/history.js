const editHistory = []
let historyPointer = -1

function addPoint(point)
{
    while (editHistory.length-1 != historyPointer)
    {
        editHistory.pop()
    }
    editHistory.push(point)
    historyPointer++;
}

function addModifyPoint(shape)
{
    addPoint({
        type: "Modify",
        shape: structuredClone(shape)
    })
}

function addCreatePoint(type, pos, index)
{
    
}

function addDeletePoint(index)
{
    
}

function editUndo()
{
    // const point = 
}