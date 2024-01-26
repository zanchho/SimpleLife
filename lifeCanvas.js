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
let rulesArr = []
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
  { name: "green", amount: "200", color: "green" },
  { name: "yellow", amount: "200", color: "yellow" },
  { name: "blue", amount: "30", color: "blue" },
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
  updateRuleSet()
  createRuleSetUI()
}
function findTypeByName() {}
function findRuleValue(affector, affects, arr) {
  if (arr === undefined) arr = [...rulesArr]
  let res = NaN
  arr.forEach(function (rule) {
    //{ affector: Types[i], affects: Types[j], value: 0.34 }
    if (rule.affector === affector && rule.affects === affects) res = rule.value
  })
  return res
}
function updateRuleSet() {
  const arr = [...rulesArr]
  rulesArr = []
  const obj = {}
  for (let i = 0; i < Types.length; i++) {
    for (let j = 0; j < Types.length; j++) {
      let value = findRuleValue(Types[i].name, Types[j].name, arr)
      if (isNaN(value)) value = Math.round((Math.random() * 2 - 1) * 100) / 100

      if (isNaN(value))
        console.error("updateRuleSet value is NaN:", Types[i], Types[j])
      rulesArr.push({
        affector: Types[i].name,
        affects: Types[j].name,
        value: value,
      })
    }
  }
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

    //recreate if %ouside of canvas
    // const maxOutSide = 1 / 4 // 25%
    // const maxW = WINDOW.width * maxOutSide
    // if (a.x <= 0 - maxW || a.x >= WINDOW.width + maxW) console.log("outside")
  }
}
function createRuleSetUI() {
  const handleOnChange = (r1Name, r2Name, value, showValueElement) => {
    const arr = [...rulesArr]
    rulesArr.forEach(function (rule) {
      if (rule.affector === r1Name && rule.affects === r2Name) {
        rule.value = value
        showValueElement.textContent = value
      }
    })
    console.log(arr, rulesArr)
  }
  const rootOfListID = "rules_list"
  const _el = document.getElementById(rootOfListID)
  _el.innerHTML = "" //reset inner

  for (let i = 0; i < Types.length; i++) {
    const li = document.createElement("div")
    const ri1 = document.createElement("h2")
    ri1.textContent = Types[i].name
    li.appendChild(ri1)

    for (let j = 0; j < Types.length; j++) {
      const entry = document.createElement("div")
      entry.classList.add("entry")

      const ri2 = document.createElement("span")
      ri2.textContent = "Attraction to: " + Types[j].name

      const range = document.createElement("input")
      let rangeValue = findRuleValue(Types[i].name, Types[j].name)
      range.setAttribute("type", "range")
      range.setAttribute("min", "-1")
      range.setAttribute("max", "1")
      range.setAttribute("step", "0.01")
      range.addEventListener("change", function (ev) {
        handleOnChange(Types[i].name, Types[j].name, ev.target.value, ri2val)
      })

      range.setAttribute("value", rangeValue)

      const ri2val = document.createElement("span")
      ri2val.textContent = rangeValue

      entry.appendChild(ri2)
      entry.appendChild(range)
      entry.appendChild(ri2val)
      li.appendChild(entry)
    }
    _el.appendChild(li)
  }
}

function rules() {
  for (let i = 0; i < particles.length; i++) {
    const A = particles[i]

    for (let j = 0; j < particles.length; j++) {
      const B = particles[j]

      rule(A.group, B.group, findRuleValue(A.name, B.name))
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
  }
}

//add initial Values
for (let i = 0; i < initTypes.length; i++) {
  addType(initTypes[i].name, initTypes[i].amount, initTypes[i].color)
}

document.getElementById("btn_pause").addEventListener("click", handlePause)

update()
