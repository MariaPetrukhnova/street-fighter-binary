import createElement from '../helpers/domHelper';

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (fighter) {
        const fighterImage = createFighterImage(fighter);
        const fighterName = createElement({ tagName: 'h2' });
        const fighterDetails = createElement({
            tagName: 'div'
        });
        const fighterInfoThumb = createElement({
            tagName: 'div',
            className: 'fighter-info-thumb'
        });
        fighterDetails.innerHTML = `
        <div>
            <p class="fighter-info">Health: ${fighter.health}</p>
        </div>
        <div>
            <p class="fighter-info">Attack: ${fighter.attack}</p>
        </div>
        <div>
            <p class="fighter-info">Defense: ${fighter.defense}</p>
        </div>
        `;
        fighterName.innerText = fighter.name;
        fighterInfoThumb.append(fighterName, fighterDetails);
        fighterElement.append(fighterImage, fighterInfoThumb);
    }

    return fighterElement;
}
