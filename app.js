import { getRandomNumber } from '/utils/utils.js'

let game, block, hole, character, score, gameoverscreen, star, gameStopped, isJumping

function getElements() {
    game = document.querySelector('#game')
    block = document.querySelector('#block')
    hole = document.querySelector('#hole')
    character = document.querySelector('#character')
    score = document.querySelector('#score')
    gameoverscreen = document.querySelector('#gameoverscreen')
    star = document.querySelector('#star')
}

function setInitialValues() {
    gameStopped = false
    isJumping = false
}

function setEventListeners() {
    window.addEventListener('resize', () => {
        if (gameStopped) return
        resetAllAnimations()
    })
    document.body.parentElement.addEventListener('click', () => {
        if (gameStopped) return
        characterJump()
    })
    document.onkeypress = e => {
        e = e || window.event
        if (e.keyCode === 32) {
            if (gameStopped) return
            characterJump()
        }
    }
}

function characterJump(params) {
    isJumping = true
}

function initRandomHoles() {
    hole.addEventListener('animationiteration', _ => {
        const fromHeight = window.innerHeight * 60 / 100
        const fromWeight = window.innerWidth * 95 / 100
        const randomTop = getRandomNumber(fromHeight, fromWeight)
        // const randomTop = Math.random() * 100
        hole.style.top = `-${randomTop}px`
    })
}

function resetAllAnimations() {
    const seconds = 2
    const blockAnumationCss = `blockAnimation ${seconds}s infinite linear`
    block.style.animation = blockAnumationCss
    hole.style.animation = blockAnumationCss

}

function gameInit() {
    getElements()
    initRandomHoles()
    resetAllAnimations()
    setInitialValues()
    setEventListeners()
}

gameInit()