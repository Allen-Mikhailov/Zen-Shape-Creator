const settingsKey = "@settings:0.0"

const defaultSettings = {

}

let settings = JSON.parse(localStorage.getItem(settingsKey) || "{}")

// Checking Settings
for (const setting in defaultSettings)
{
    if (settings[setting] == undefined)
        settings[setting] = defaultSettings[setting]
}

function updateSettings()
{
    localStorage.setItem(settingsKey, JSON.stringify(settings))
}