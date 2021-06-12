import { getRandomNumber, getCssProp, detectColision } from '/utils/utils.js'

let game, block, hole, character, score, gameoverscreen, star, gameStopped, isJumping, scoreTotal

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
    scoreTotal = 0
}

function setEventListeners() {
    window.addEventListener('resize', () => {
        if (gameStopped) return
        resetAllAnimations()
    })
    gameoverscreen.querySelector('button').addEventListener('click', () => {
        location.reload()
    })
    document.body.parentElement.addEventListener('click', () => {
        if (gameStopped) return
        characterJump()
    })
    document.onkeypress = e => {
        // e = e || window.event
        if (e.keyCode === 32) {
            if (gameStopped) return
            characterJump()
        }
    }
}

function gameOver() {
    (new Audio('/sounds/gameover.wav')).play()
    gameStopped = true
    showGameOverScreen()
    stopBlockAnimation()
    console.log('Game Over');
}

function showGameOverScreen() {
    gameoverscreen.style.display = ''
}

function stopBlockAnimation() {
    const blockLeft = block.getBoundingClientRect().x
    block.style.animation = ''
    hole.style.animation = ''

    block.style.left = `${blockLeft}px`
    hole.style.left = `${blockLeft}px`
}

function startBgAnimation() {
    game.style.animation = 'backgroundAnimation 5s infinite linear'
}

function characterJump() {
    isJumping = true
    let jumpCount = 0
    const jumpInterval = setInterval(() => {
        changeGameState({ diff: -4, direction: 'up' })
        if (jumpCount > 20) {
            (new Audio('/sounds/fly.wav')).play()
            clearInterval(jumpInterval)
            isJumping = false
            jumpCount = 0
        }
        jumpCount++
    }, 20);
}

function changeGameState({ diff, direction }) {
    handleCharacterAnimation(direction)
    handleCharacterCollisions()
    handleCharacterPosition(diff)
}

function handleCharacterAnimation(direction) {
    if (direction === 'down') {
        character.classList.remove('go-up')
        character.classList.add('go-down')
    } else if (direction === 'up') {
        character.classList.add('go-up')
        character.classList.remove('go-down')
    }
}

function changeScoreUi() {
    score.innerText = `Score ${scoreTotal}`
    gameoverscreen.querySelector('.score').innerText = score.innerText
}

function handleCharacterCollisions() {
    const colisionBlock = detectColision(character, block)
    const colisionHole = detectColision(character, hole, { y1: -46, y2: 47 })
    if (colisionBlock && !colisionHole) {
        return gameOver()
    } else if (colisionHole) {
        scoreTotal++
        if (scoreTotal % 100 == 0) {
            (new Audio('/sounds/hole.wav')).play()
        }
        changeScoreUi()
    }
}

function handleCharacterPosition(diff) {
    const characterTop = parseInt(getCssProp(character, 'top'))
    const changeTop = characterTop + diff
    if (changeTop < 0) {
        return
    }
    if (changeTop > window.innerHeight) {
        return gameOver()
    }
    character.style.top = `${changeTop}px`
}

function initRandomHoles() {
    hole.addEventListener('animationiteration', _ => {
        const fromHeight = 57 * window.innerHeight / 100
        const toHeight = 97 * window.innerHeight / 100
        const randomTop = getRandomNumber(fromHeight, toHeight)
        hole.style.top = `-${randomTop}px`
    })
}

function beginGravity() {
    setInterval(() => {
        if (isJumping || gameStopped) return
        changeGameState({ diff: 5, direction: 'down' })
    }, 20);
}

function resetAllAnimations() {
    const seconds = 3
    const blockAnumationCss = `blockAnimation ${seconds}s infinite linear`
    block.style.animation = blockAnumationCss
    hole.style.animation = blockAnumationCss
}

function gameInit() {
    getElements()
    initRandomHoles()
    beginGravity()
    resetAllAnimations()
    setInitialValues()
    setEventListeners()
    startBgAnimation()
    handleCharacterCollisions()
}

gameInit()