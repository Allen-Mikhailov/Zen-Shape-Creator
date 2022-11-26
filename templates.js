const NSSvg = "http://www.w3.org/2000/svg"

const SVGStart = `
<svg id="shapeContainer" viewBox="0 0 100 100" width="100vh" height="100vh" xmlns="${NSSvg}">
    <style>
        /* Styles */
    </style>
`
const SVGEnd = `</svg>`

const trianglePath = "M 0 0 L 10 0 L 0 10"
const squarePath = "M 0 0 L 10 0 L 10 10 L 0 10 L 0 0"
const halfCirclePath = "M 0 10 A 1 1 0 0 1 10 10"

const baseStyleSheet = `
.TrianglePath {
    fill: red;
}

.SquarePath {
    fill: red;
}

.HalfCirclePath {
    fill: red;
}
`

// Utils

const pointWidth = 4
function debugPoint(i, x, y)
{
    document.getElementById("DebugLine"+i).style.width = pointWidth+"px"
    document.getElementById("DebugLine"+i).style.height = pointWidth+"px"
    document.getElementById("DebugLine"+i).style.left = (x-pointWidth/2)+"px"
    document.getElementById("DebugLine"+i).style.top = (y-pointWidth/2)+"px"
}

function distancePointOnLine([px, py], angle, [x, y])
{
    return Math.cos(angle)*(py-y) - Math.sin(angle)*(px-x)
}

function closestPointOnLine([px, py], angle, [x, y])
{
    const distance = distancePointOnLine([px, py], angle, [x, y])
    const perpendicularA = angle + Math.PI/2
    return [x + Math.cos(perpendicularA)*distance, y + Math.sin(perpendicularA)*distance]
}