//vars

let isPaused = false
let PARTICEL_SIZE = 4
let multiplier = 2

//handle Canvas
let canvas = document.getElementById("life")
canvas.width = canvas.getBoundingClientRect().width
canvas.height = canvas.getBoundingClientRect().height

const WINDOW = {
  width: canvas.getBoundingClientRect().width,
  height: canvas.getBoundingClientRect().height,
}
const ctx = canvas.getContext("2d")
const particles = []
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
const initTypes = [
  { name: "red", amount: "150", color: "red" },
  { name: "green", amount: "150", color: "green" },
  { name: "yellow", amount: "150", color: "yellow" },
  { name: "blue", amount: "150", color: "blue" },
]

const Types = []
//create Types
const typeName = document.getElementById("type_name")
const typeAmount = document.getElementById("type_amount")
const typeColor = document.getElementById("type_color")
const createTypeButton = document.getElementById("create_type_button")
const allTypesEL = document.getElementById("all_types")
typeAmount.addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, "")
})
const addType = (name, amount, color) => {
  //TODO do UI prettier
  const obj = { name: name, amount: amount, color: color }
  let li = document.createElement("li")
  li.textContent = JSON.stringify(obj)
  allTypesEL.appendChild(li)
  Types.push(obj)

  create(obj.name, obj.amount, obj.color)
}
//add initial Values
for (let i = 0; i < initTypes.length; i++) {
  addType(initTypes[i].name, initTypes[i].amount, initTypes[i].color)
}
const validateCreateNew = () => {
  let hasError = false
  const name = typeName.value
  const amount = typeAmount.value
  const color = typeColor.value
  if (name === "" || Types.some(type => type.name === name)) {
    typeName.classList.add("err")
    hasError = true
  }
  if (amount <= 0) {
    typeAmount.classList.add("err")
    hasError = true
  }

  if (!hasError) addType(name, amount, color)
}

const removeCSSErr = e => {
  if (e.target.classList.contains("err")) {
    e.target.classList.remove("err")
  }
}
typeName.addEventListener("focus", removeCSSErr)
typeAmount.addEventListener("focus", removeCSSErr)
typeColor.addEventListener("focus", removeCSSErr)
createTypeButton.addEventListener("click", validateCreateNew)

function draw(x, y, c, sx, sy) {
  ctx.fillStyle = c
  ctx.fillRect(x, y, sx, sy)
}

function particle(name, x, y, c) {
  return { name: name, x: x, y: y, vx: 0, vy: 0, color: c }
}
function randomX() {
  return Math.random() * WINDOW.width - PARTICEL_SIZE * 4
}

function randomY() {
  return Math.random() * WINDOW.height - PARTICEL_SIZE * 4
}
function create(name, number, color) {
  group = []
  for (let i = 0; i < number; i++) {
    group.push(particle(name, randomX(), randomY(), color))
    //maybe add 2d arr instead
  }
  particles.push({ name, group })
  return group
}

function rule(p1, p2, g) {
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

// yellow = create(200 * multiplier, "yellow")
// red = create(30 * multiplier, "red")
// green = create(150 * multiplier, "green")
// blue = create(35 * multiplier, "blue")
function rules() {
  for (let i = 0; i < particles.length; i++) {
    const groupA = particles[i].group

    for (let j = 0; j < particles.length; j++) {
      if (i === j) continue // self-interaction

      const groupB = particles[j].group

      // get OBJECT VIA UI and implement
      rule(groupA, groupB, Math.random() * 2 - 1)
    }
  }
}

function update() {
  rules()

  draw(0, 0, "rgba(0,0,0,0.95)", WINDOW.width, WINDOW.height)
  for (let i = 0; i < particles.length; i++) {
    const particleGroup = particles[i].group
    for (let j = 0; j < particleGroup.length; j++) {
      const particle = particleGroup[j]
      draw(particle.x, particle.y, particle.color, PARTICEL_SIZE, PARTICEL_SIZE)
    }
  }
  if (!isPaused) requestAnimationFrame(update)
}

function handlePause() {
  isPaused = !isPaused
  if (isPaused === false) {
    update()
    return
  }
}
document.getElementById("btn_pause").addEventListener("click", handlePause)

addType("purple", 100, "purple")
update()
