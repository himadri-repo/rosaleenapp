//jshint esversion:6

export default class serviceApi {    
    static getServices() {
        let url = 'http://139.59.92.9:3000/services'; //put the service api url here
        //let url = 'http://10.0.2.2:4000/services'; //put the service api url here

        //console.log("\nCalling service " + url + "\n");
        return new Promise((resolve, reject) => {
            fetch(url)
            .then(response=> response.json())
            .then(response=> {
                //console.log("\nServiceApi : " + response + "\n");
                resolve(response);
            })
            .catch(reason=> reject(reason));
        });
    }
}