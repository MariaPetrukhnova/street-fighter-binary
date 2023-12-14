import showModal from './modal';
import { createFighterImage } from '../fighterPreview';

export default function showWinnerModal(fighter) {
    const imageElement = createFighterImage(fighter);
    const modalElement = {
        title: `${fighter.name.toUpperCase()} win!!!`,
        bodyElement: imageElement,
        onClose: () => {
            window.location.reload();
        }
    };
    showModal(modalElement);
}
