export function updateHealthIndicator(currentHealth, health, position) {
    const healthIndicator = document.getElementById(`${position}-fighter-indicator`);
    const indicatorWidth = Math.max(0, (currentHealth * 100) / health);
    healthIndicator.style.width = `${indicatorWidth}%`;
}

export const createIsDamageReceivedHandler = position => (currentHealth, health) => {
    updateHealthIndicator(currentHealth, health, position);
};

export const createFighterConfigs = position => ({
    onDamageReceived: createIsDamageReceivedHandler(position)
});
