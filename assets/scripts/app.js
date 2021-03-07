const attack_value = 10;
const strong_attack_value = 17;
const monster_attack_value = 14;
const heal_value = 20;

const mode_attack = 'attack';
const mode_strong_attack = 'strong_attack';
const log_event_player_attack = 'player_attack';
const log_event_player_strong_attack = 'player_strong_attack';
const log_event_monster_attack = 'monster_attack';
const log_event_player_heal = 'player_heal';
const log_event_game_over = 'game_over';

let battleLog = [];
let lastLoggedEntry;

function getMaxLifeValues() {
    const enteredValue = prompt('Choose maximum life for you and the monster.', '100');

    const parsedValue = parseInt(enteredValue);
    if (isNaN(parsedValue) || chosenMaxLife <= 0) {
        throw {message: 'Invalid user input, not a number'};
    }
    return parsedValue;
}

let chosenMaxLife;

try {
    chosenMaxLife = getMaxLifeValues();
} catch (error) {
    console.log(error);
    chosenMaxLife = 100;
    alert('You entered something wrong, default value of 100 was used.')
    // throw error;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
    let logEntry = {
        event: event,
        value: value,
        target: 'Monster',
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    };
    switch (event) {
        case log_event_player_attack:
            logEntry.target = 'Monster';
            break;
        case log_event_player_strong_attack:
            logEntry.target ='Monster';
            break;
        case log_event_monster_attack:
            logEntry.target ='Person';
            break;
        case log_event_player_heal:
            logEntry.target ='Person';
            break;
        case log_event_game_over:
            logEntry;
            break;
        default:
            logEntry = {};
    } 
    battleLog.push(logEntry);
}

function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(monster_attack_value);
    currentPlayerHealth -= playerDamage;
    writeToLog(log_event_monster_attack, playerDamage, currentMonsterHealth, currentPlayerHealth);
    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('You would be dead but the bonus life saved you!');
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You Won!');
        reset();
        writeToLog(log_event_game_over, 'Player Won', currentMonsterHealth, currentPlayerHealth);
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('You lost')
        reset();
        writeToLog(log_event_game_over, 'Monster Won', currentMonsterHealth, currentPlayerHealth);
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        alert('You have a draw')
        reset();
        writeToLog(log_event_game_over, 'A draw', currentMonsterHealth, currentPlayerHealth);
    }
}

function attackMonster(mode) {
    const maxDamage = mode === mode_attack ? attack_value : strong_attack_value;
    const logEvent = mode === mode_attack ? log_event_player_attack : log_event_player_strong_attack;
    // if (mode === mode_attack) {
    //     maxDamage = attack_value;
    //     logEvent = log_event_player_attack;
    // } else if (mode === mode_strong_attack) {
    //     maxDamage = strong_attack_value;
    //     log_event_player_strong_attack;
    // }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
    endRound();
}

function attackHandler() {
    attackMonster(mode_attack);
}

function strongAttackHandler() {
    attackMonster(mode_strong_attack);
}

function healPlayerHandler() {
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - heal_value) {
        alert('You can not heal more than your max initial health.');
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = heal_value;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(log_event_player_heal, healValue, currentMonsterHealth, currentPlayerHealth);
    endRound();
}

function printLogHandler() {
    // for (let i = 0; i < 3; i++) {
    //     console.log('--------------');
    // }
    let j = 0;
    while (j < 3) {
        console.log('--------------');
        j++;
    }
    // for (let i = 0; i < battleLog.length; i++) {
    //     console.log(battleLog[i]);
    // } // you get access to the index because i is the index
    let i = 0;
    for (const logEntry of battleLog) { // you dont have access to the index, only the element, we manually did this by creating line before
        if (!lastLoggedEntry && lastLoggedEntry !== 0 || lastLoggedEntry === i) {
            console.log(`#${i}`);
            for (const key in logEntry) {
                console.log(`#${key} => ${logEntry[key]}`);
            }
            lastLoggedEntry = i;
            break;
        }
        i++;
    } 
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);