//jshint esversion:6

export default class serviceCtegoryApi {
    static getServiceCategories() {
        //let url = 'http://10.0.2.2:4000/services/categories'; //put the service api url here

        return new Promise((resolve, reject) => {
            let url = 'http://139.59.92.9:3000/services/categories'; //service url for serviceCategories
            fetch(url)
            .then(response => response.json())
            .then(response => resolve(response))
            .catch(reason => reject(reason));
        });
    }
}