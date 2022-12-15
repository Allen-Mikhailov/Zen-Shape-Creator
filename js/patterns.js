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
            case "Triangle":
                shapeSVG = `
<g id="shape${shapeIndex}">
    <path class="TrianglePath" id="shapePath${shapeIndex}" d="${trianglePath}"></path>
</g>
`
                break;
            case "Square":
                shapeSVG = `
<g id="shape${shapeIndex}">
    <path class="SquarePath" id="shapePath${shapeIndex}" d="${squarePath}"></path>
</g>
`           
                break;
            case "HalfCircle":
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
        styleSheet += `${currentPercent}% ${sectForShape(shape.sects[patternCount - 1])}\n`

        for (let i = 0; i < patternCount; i++) {
            styleSheet += `${currentPercent}% ${sectForShape(shape.sects[i])}`
            currentPercent += stallPercent
            styleSheet += `${currentPercent}% ${sectForShape(shape.sects[i])}`
            currentPercent += TransitionPercent
        }

        styleSheet += `100% ${sectForShape(shape.sects[0])}`

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

    // Displaying the compiled stuff
    svgFile = svgFile.replaceAll("&", "&amp").replaceAll("<", "&lt").replaceAll(">", "&gt")
    document.getElementById("compileDisplay").style.visibility = "visible"
    document.getElementById("compiledText").innerHTML = svgFile
}

function HideCompileDisplay()
{
    document.getElementById("compileDisplay").style.visibility = "hidden"
}

document.getElementById("HideCompileDisplay").onclick = HideCompileDisplay