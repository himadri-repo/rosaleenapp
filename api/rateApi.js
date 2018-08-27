//jshint esversion:6
export default class rateApi {
    static getRates() {
        let url = 'http://139.59.92.9:3000/rates'; //put the service api url here

        return new Promise((resolve, reject) => {
            fetch(url).then(response => response.json()).then(response => {
                resolve(response);
            })
            .catch(reason => {
                console.log(reason);
                reject(reason);
            });
        });
    }

    static getRatesByServiceId(serviceid) {
        let url = 'http://139.59.92.9:3000/rates/' + serviceid; //put the service api url here

    }
}