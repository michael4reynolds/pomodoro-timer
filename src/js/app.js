import log, {hookConsoleLog} from 'stacklogger'
import classNames from 'classnames'
import moment from 'moment'
import 'moment-duration-format'
import Overtimer from 'overtimer'

// Model
const ONE_SECOND = moment.duration(1, 'seconds').asMilliseconds()
const timer = new Overtimer(ONE_SECOND, {start: false})
let onBreak = false

// View
const inWorkMin = document.getElementById('work-min')
const inWorkSec = document.getElementById('work-sec')
const inBreakMin = document.getElementById('break-min')
const inBreakSec = document.getElementById('break-sec')
const elTime = document.querySelector('.time')
const btnPlay = document.querySelector('.fa-play')
const btnFwd = document.querySelector('.fa-forward')
const btnPause = document.querySelector('.fa-pause')
const btnStop = document.querySelector('.fa-stop')
const lblTimer = document.querySelector('.label')

const countdownView = (t) => moment.duration(t).format('mm:ss', {trim: false})

// Controller
const getCountdownTime = () => {
  let minutes, seconds
  if (onBreak) {
    minutes = inBreakMin.value
    seconds = inBreakSec.value
  } else {
    minutes = inWorkMin.value
    seconds = inWorkSec.value
  }
  return `00:${minutes}:${seconds}`
}

const setTimerDuration = d => timer.options.repeat = d

const setupTimer = () =>{
  setTimerDuration(moment.duration(getCountdownTime()).asSeconds())
  elTime.innerText = countdownView(getCountdownTime())
  elTime.className = classNames('time', {'in-session': !onBreak, 'on-break': onBreak})
}

const startTimer = () => {
  if (timer.state === Overtimer.STATES.RUNNING) return
  if (timer.state === Overtimer.STATES.PAUSED) {
    timer.resume()
  } else {
    setupTimer()
    timer.start()
  }
}

const moveForward = () => {
  timer.stop()
  onBreak = !onBreak
  lblTimer.innerText = onBreak ? 'Break' : 'Session'
  setupTimer()
}

const pauseTimer = () => {
  if (timer.state === Overtimer.STATES.RUNNING) {
    timer.pause()
    timer.trigger('pause')
  } else {
    timer.resume()
    timer.trigger('resume')
  }
}

const stopTimer = () => {
  timer.stop()
}

// Events
timer.on('poll', () => {
  elTime.innerText = countdownView(timer.totalRemainingTime + ONE_SECOND)
})

timer.on('finish', () => {
  onBreak = !onBreak
  elTime.innerText = countdownView(timer.totalRemainingTime)
  elTime.className = classNames('time', {'in-session': !onBreak, 'on-break': onBreak})
  lblTimer.innerText = onBreak ? 'Break' : 'Session'
})

// initialize
function init() {
  try {
    btnPlay.onclick = startTimer
    btnFwd.onclick = moveForward
    btnPause.onclick = pauseTimer
    btnStop.onclick = stopTimer
    elTime.innerText = countdownView(getCountdownTime())
  } catch (e) {
    log(e)
  }
}

hookConsoleLog()
init()
