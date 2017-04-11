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
const countDown = document.querySelector('.countdown')
const elTime = document.querySelector('.time')
const btnPlay = document.querySelector('.fa-play')
const btnPause = document.querySelector('.fa-pause')
const btnStop = document.querySelector('.fa-stop')

const countdownView = (t) => moment.duration(t).format('mm:ss', {trim: false})

// Controller
// todo: add 'skip' function for session and breaks
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

const startTimer = () => {
  setTimerDuration(moment.duration(getCountdownTime()).asSeconds())
  elTime.innerText = countdownView(getCountdownTime())
  setTimeout(() => {
    timer.start()
  }, ONE_SECOND)
}

// Events
timer.on('poll', () => {
  elTime.innerText = countdownView(timer.totalRemainingTime)
})

timer.on('finish', () => {
  log('done')
  onBreak = !onBreak
  countDown.className = classNames('countdown', {'on-break': onBreak})
})

// initialize
function init() {
  try {
    btnPlay.onclick = startTimer
    // btnPause.onclick = pauseTimer
    // btnStop.onclick = stopTimer
    elTime.innerText = countdownView(getCountdownTime())
  } catch (e) {
    log(e)
  }
}

hookConsoleLog()
init()
