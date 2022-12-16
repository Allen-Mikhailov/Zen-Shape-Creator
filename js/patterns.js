const patterns = []

const stallLength = 1
const TransitionLength = 1

function savePattern()
{
    let i = 0;
    for (const child of document.getElementById("shape-container").children) {
        if (drawnDivs.indexOf(child) != -1)
        {
            drawnShapes[drawnDivs.indexOf(child)].order = i;
            i++;
        }
      }

    patterns.push(structuredClone(drawnShapes))
}

function compilePatterns()
{
    // Reorganizing data

    const shapes = []

    let shapeCount = 0
    for (let shapeIndex in patterns[0]) {
        const shape = patterns[0][shapeIndex]
        shapes.push({
            type: shape.type,
            sects: []
        })
        shapeCount++;
    }

    const patternCount = patterns.length
    const time = patternCount * (stallLength + TransitionLength)
    const sectionLength = 100 / patternCount
    const stallPercent = stallLength/(stallLength+TransitionLength) * sectionLength
    const TransitionPercent = TransitionLength/(stallLength+TransitionLength)  * sectionLength

    for (let patternIndex in patterns) {
        const pattern = patterns[patternIndex]
        for (let i = 0; i < shapeCount; i++) {
            shapes[i].sects.push(pattern[i])
        }
    }

    // Basic File Starters
    let svgFile = SVGStart
    let styleSheet = baseStyleSheet

    // Creating the middle bulk of files
    for (const shapeIndex in shapes) {
        // Importing the svg text
        const shape = shapes[shapeIndex]

        let currentPercent = 0

        let shapeSVG = ""
        switch(shape.type) {
            case "triangle":
                shapeSVG = `
<g id="shape${shapeIndex}">
    <path class="TrianglePath" id="shapePath${shapeIndex}" d="${trianglePath}"></path>
</g>
`
                break;
            case "square":
                shapeSVG = `
<g id="shape${shapeIndex}">
    <path class="SquarePath" id="shapePath${shapeIndex}" d="${squarePath}"></path>
</g>
`           
                break;
            case "semi-circle":
                    shapeSVG = `
<g id="shape${shapeIndex}">
    <path class="HalfCirclePath" id="shapePath${shapeIndex}" d="${halfCirclePath}"></path>
</g>
`           
                    break;
        }
        svgFile += shapeSVG

        styleSheet += `
        @keyframes shape${shapeIndex}Anim {`
        styleSheet += `${currentPercent}% ${getShapeStyle(shape.sects[patternCount - 1])}\n`

        for (let i = 0; i < patternCount; i++) {
            styleSheet += `${currentPercent}% ${getShapeStyle(shape.sects[i])}`
            currentPercent += stallPercent
            styleSheet += `${currentPercent}% ${getShapeStyle(shape.sects[i])}`
            currentPercent += TransitionPercent
        }

        styleSheet += `100% ${getShapeStyle(shape.sects[0])}`

        styleSheet += `}`

        styleSheet += `
#shape${shapeIndex} {
    animation-name: shape${shapeIndex}Anim;
    animation-duration: ${time}s;
    animation-iteration-count: infinite;
}
`
        
    }

    // Ending files and displaying somehow
    svgFile += SVGEnd
    svgFile = svgFile.replace("/* Styles */", styleSheet)
    console.log(svgFile)

    return svgFile
    
}

function downloadCompile()
{
    const compiled = compilePatterns()

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(compiled));
    element.setAttribute('download', "createdSVG.html");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}