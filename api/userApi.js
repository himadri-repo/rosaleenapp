//jshint esversion:6

export default class userApi {
    static getUsers() {
        return new Promise((resolve, reject) => {
            let url = 'http://139.59.92.9:3000/users'; //user rest api url
            //let url = 'http://10.0.2.2:4000/users'; //user rest api url
            fetch(url)
            .then(response => response.json())
            .then(response => resolve(response))
            .catch(reason => reject(reason));
        });
    }
}