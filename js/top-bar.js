// Section Picker

let section;
function setSection(sect)
{
    section = sect;
    document.getElementById("top-bar").dataset.section = sect
}

// document.getElementById("section-picker-shapes").onclick = () => setSection("shapes")
// document.getElementById("section-picker-settings").onclick = () => setSection("settings")

// Tool Picker

document.getElementById("move-tool").onclick = () => setTool("move")
document.getElementById("rotate-tool").onclick = () => setTool("rotate")
document.getElementById("scale-tool").onclick = () => setTool("scale")
document.getElementById("color-tool").onclick = () => setTool("color")

document.getElementById("square-tool").onclick = () => setTool("square")
document.getElementById("triangle-tool").onclick = () => setTool("triangle")
document.getElementById("semi-circle-tool").onclick = () => setTool("semi-circle")
document.getElementById("delete-tool").onclick = () => setTool("delete")

document.getElementById("push-hard-up-tool").onclick = () => setTool("push-hard-up")
document.getElementById("push-up-tool").onclick = () => setTool("push-up")
document.getElementById("push-down-tool").onclick = () => setTool("push-down")
document.getElementById("push-hard-down-tool").onclick = () => setTool("push-hard-down")

// Scale Tool Bar

document.getElementById("scale-x-button").onclick = () => document.getElementById("scale-tool-data").dataset.direction = "horizontal"
document.getElementById("scale-y-button").onclick = () => document.getElementById("scale-tool-data").dataset.direction = "vertical"

document.getElementById("scale-pos-button").onclick = () => document.getElementById("scale-tool-data").dataset.sign = "pos"
document.getElementById("scale-neg-button").onclick = () => document.getElementById("scale-tool-data").dataset.sign = "neg"

document.getElementById("scale-1-button").onclick = () => document.getElementById("scale-tool-data").dataset.amount = "1"
document.getElementById("scale-5-button").onclick = () => document.getElementById("scale-tool-data").dataset.amount = "5"
document.getElementById("scale-10-button").onclick = () => document.getElementById("scale-tool-data").dataset.amount = "10"

// document.getElementById("save-pattern-tool").onclick = () => setTool("save-pattern")
// document.getElementById("compile-tool").onclick = () => setTool("compile")