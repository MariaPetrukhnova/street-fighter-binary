import callApi from '../helpers/apiHelper';

class FighterService {
    #endpoint = 'fighters.json';

    async getFighters() {
        try {
            const apiResult = await callApi(this.#endpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }

    // eslint-disable-next-line class-methods-use-this
    async getFighterDetails(id) {
        try {
            const fightersDetails = await callApi(`details/fighter/${id}.json`);
            return fightersDetails;
        } catch (error) {
            throw error;
        }
    }
}

const fighterService = new FighterService();

export default fighterService;
