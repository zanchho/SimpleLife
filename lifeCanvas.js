//vars

let isPaused = false
let PARTICEL_SIZE = 4
let multiplier = 2

//handle Settings
const settingButton = document.getElementById("btn_settings")
const settingPanel = document.getElementById("settings_panel")
const panelContent = document.getElementById("panel_content")

const Settings = {
  widthVarCSS: "--setting-panel-offset:",
  width: "40vw",
  isPanelExtended: false,
}

const toggleSettingsPanel = () => {
  Settings.isPanelExtended = !Settings.isPanelExtended

  if (Settings.isPanelExtended === true) {
    const str = Settings.widthVarCSS + Settings.width + ";"
    settingButton.style.cssText = str
    settingPanel.style.cssText = str
    panelContent.style.cssText = ""
  } else {
    settingButton.style.cssText = ""
    settingPanel.style.cssText = ""
    panelContent.style.cssText = "display: none;"
  }
}
toggleSettingsPanel()
settingButton.addEventListener("click", toggleSettingsPanel)

//handle Types
const Types = []
//create Types
const typeName = document.getElementById("type_name")
const typeAmount = document.getElementById("type_amount")
const typeColor = document.getElementById("type_color")
const createTypeButton = document.getElementById("create_type_button")

const validateCreateNew = () => {
  //typeName =="" or eq in typeArr
  //amount !== 0 or -x
  //color is valid?
  //on err add new StyleClass .err
  // components should remove .err onfocus
}
createTypeButton.addEventListener("click", validateCreateNew)
//handle Canvas
let canvas = document.getElementById("life")
canvas.width = canvas.getBoundingClientRect().width
canvas.height = canvas.getBoundingClientRect().height

const WINDOW = {
  width: canvas.getBoundingClientRect().width,
  height: canvas.getBoundingClientRect().height,
}
const ctx = canvas.getContext("2d")

const draw = (x, y, c, sx, sy) => {
  ctx.fillStyle = c
  ctx.fillRect(x, y, sx, sy)
}

const particles = []
const particle = (x, y, c) => {
  return { x: x, y: y, vx: 0, vy: 0, color: c }
}
const randomX = () => {
  return Math.random() * WINDOW.width - PARTICEL_SIZE * 4
}

const randomY = () => {
  return Math.random() * WINDOW.height - PARTICEL_SIZE * 4
}
const create = (number, color) => {
  group = []
  for (let i = 0; i < number; i++) {
    group.push(particle(randomX(), randomY(), color))
    particles.push(group[i])
  }
  return group
}

const rule = (p1, p2, g) => {
  for (let i = 0; i < p1.length; i++) {
    fx = 0
    fy = 0
    for (let j = 0; j < p2.length; j++) {
      a = p1[i]
      b = p2[j]

      dx = a.x - b.x
      dy = a.y - b.y

      d = Math.sqrt(dx * dx + dy * dy)

      if (d > 0 && d < 80) {
        //assuming 1px = 1mass
        F = (g * 1) / d
        fx += F * dx
        fy += F * dy
      }
    }
    slowfactor = 0.5
    a.vx = (a.vx + fx) * slowfactor
    a.vy = (a.vy + fy) * slowfactor

    a.x += a.vx
    a.y += a.vy
    //dodge on borders
    if (a.x <= 0 || a.x >= WINDOW.width - PARTICEL_SIZE) a.vx *= -1
    if (a.y <= 0 || a.y >= WINDOW.height - PARTICEL_SIZE) a.vy *= -1
  }
}

//create Objects

yellow = create(200 * multiplier, "yellow")
red = create(30 * multiplier, "red")
green = create(150 * multiplier, "green")
blue = create(35 * multiplier, "blue")

const rules = () => {
  rule(green, green, Math.random() * 2 - 1)
  rule(green, red, Math.random() * 2 - 1)
  rule(green, yellow, Math.random() * 2 - 1)
  rule(green, blue, Math.random() * 2 - 1)
  rule(red, red, Math.random() * 2 - 1)
  rule(red, green, Math.random() * 2 - 1)
  rule(red, blue, Math.random() * 2 - 1)
  rule(yellow, yellow, Math.random() * 2 - 1)
  rule(yellow, green, Math.random() * 2 - 1)
  rule(yellow, blue, Math.random() * 2 - 1)
  rule(blue, blue, Math.random() * 2 - 1)
  rule(blue, red, Math.random() * 2 - 1)
  rule(blue, yellow, Math.random() * 2 - 1)
  rule(blue, green, Math.random() * 2 - 1)
}

const update = () => {
  rules()

  draw(0, 0, "rgba(0,0,0,0.95)", WINDOW.width, WINDOW.height)
  for (let i = 0; i < particles.length; i++) {
    draw(
      particles[i].x,
      particles[i].y,
      particles[i].color,
      PARTICEL_SIZE,
      PARTICEL_SIZE
    )
  }
  if (!isPaused) requestAnimationFrame(update)
}

const handlePause = () => {
  isPaused = !isPaused
  if (isPaused === false) {
    update()
    return
  }
}
document.getElementById("btn_pause").addEventListener("click", handlePause)

update()
