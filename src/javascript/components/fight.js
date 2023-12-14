import controls from '../../constants/controls';
import { createFighterConfigs } from './fightConfig';

function createArenaFighter(fighter, configs) {
    const { onDamageReceived } = configs;

    return {
        ...fighter,
        currentHealth: fighter.health,
        currentCritPoints: 0,
        critAvailable: false,
        isBlocking: false,
        isAttacking: false,
        setCritTimer() {
            this.critAvailable = false;
            // console.log(`${this.critAvailable} cooldown`)

            setTimeout(() => {
                this.critAvailable = true;
                // console.log(`${this.critAvailable} able`)
            }, 10000);
        },
        receiveDamage(value) {
            if (this.isBlocking === false) {
                this.currentHealth -= value;
                onDamageReceived(this.currentHealth, this.health);
            }
            return value;
        },
        setIsBlocking(payload) {
            this.isBlocking = payload;
        },
        setIsAttacking(payload) {
            this.isAttacking = payload;
        },
        doAttack(defender, damage) {
            defender.receiveDamage(damage);
        },
        doCritAttack(defender) {
            if (!this.critAvailable) return;
            this.setCritTimer();
            defender.receiveDamage(this.attack * 2);
        }
    };
}

export function getHitPower(fighter) {
    const criticalHitChance = Math.random() * (2 - 1) + 1;
    return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    const dodgeChance = Math.random() * (2 - 1) + 1;
    return fighter.defense * dodgeChance;
}

export function getDamage(attacker, defender) {
    const damage = getHitPower(attacker) - getBlockPower(defender);
    return damage > 0 ? damage : 0;
}

function whileFighting(attacker, defender) {
    if (attacker.isBlocking) {
        return;
    }
    if (defender.isBlocking) {
        attacker.doAttack(defender, 0);
        return;
    }

    attacker.doAttack(defender, getDamage(attacker, defender));
}

function doFight(firstFighter, secondFighter, keyMap, currentCode) {
    if (currentCode === controls.PlayerOneBlock && !firstFighter.isAttacking) {
        firstFighter.setIsBlocking(true);
        return;
    }
    if (currentCode === controls.PlayerTwoBlock && !secondFighter.isAttacking) {
        secondFighter.setIsBlocking(true);
        return;
    }
    if (currentCode === controls.PlayerOneAttack && !firstFighter.isBlocking) {
        firstFighter.setIsAttacking(true);
        whileFighting(firstFighter, secondFighter, keyMap);
        return;
    }
    if (currentCode === controls.PlayerTwoAttack && !secondFighter.isBlocking) {
        secondFighter.setIsAttacking(true);
        whileFighting(secondFighter, firstFighter, keyMap);
        return;
    }
    if (controls.PlayerOneCriticalHitCombination.every(code => keyMap.has(code))) {
        firstFighter.doCritAttack(secondFighter);
        return;
    }
    if (controls.PlayerTwoCriticalHitCombination.every(code => keyMap.has(code))) {
        secondFighter.doCritAttack(firstFighter);
    }
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        const firstChosenFighter = createArenaFighter(firstFighter, createFighterConfigs('left'));
        const secondChosenFighter = createArenaFighter(secondFighter, createFighterConfigs('right'));

        firstChosenFighter.setCritTimer();
        secondChosenFighter.setCritTimer();

        const fightSet = new Map();

        function onKeyUp(e) {
            if (e.code === controls.PlayerOneAttack) {
                firstChosenFighter.setIsAttacking(false);
            }
            if (e.code === controls.PlayerTwoAttack) {
                secondChosenFighter.setIsAttacking(false);
            }
            if (e.code === controls.PlayerOneBlock) {
                firstChosenFighter.setIsBlocking(false);
            }
            if (e.code === controls.PlayerTwoBlock) {
                secondChosenFighter.setIsBlocking(false);
            }
            fightSet.delete(e.code);
        }

        function onKeyDown(e) {
            const gameKeys = Object.values(controls).flat(2);
            if (e.repeat || !gameKeys.some(key => key === e.code)) return;
            fightSet.set(e.code, true);
            doFight(firstChosenFighter, secondChosenFighter, fightSet, e.code);

            if (firstChosenFighter.currentHealth <= 0) {
                resolve(secondChosenFighter);
                document.removeEventListener('keydown', onKeyDown);
                document.removeEventListener('keyup', onKeyUp);
            } else if (secondChosenFighter.currentHealth <= 0) {
                resolve(firstChosenFighter);
                document.removeEventListener('keydown', onKeyDown);
                document.removeEventListener('keyup', onKeyUp);
            }
        }

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
    });
}
