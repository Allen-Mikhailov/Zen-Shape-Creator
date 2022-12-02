// Section Picker
let section;
function setSection(sect)
{
    section = sect;
    topBar.dataset.section = sect
}

document.getElementById("section-picker-shapes").onclick = () => setSection("shapes")
document.getElementById("section-picker-settings").onclick = () => setSection("settings")

// Tool Picker

document.getElementById("move-tool").onclick = () => setTool("move")
document.getElementById("rotate-tool").onclick = () => setTool("rotate")
document.getElementById("scale-tool").onclick = () => setTool("scale")
document.getElementById("color-tool").onclick = () => setTool("color")

document.getElementById("square-tool").onclick = () => setTool("square")
document.getElementById("triangle-tool").onclick = () => setTool("triangle")
document.getElementById("semi-circle-tool").onclick = () => setTool("semi-circle")