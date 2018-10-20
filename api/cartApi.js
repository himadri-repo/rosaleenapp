//jshint esversion:6

export default class cartApi {
    static getCart() {
        let url = 'http://139.59.92.9:3000/invoices'; //put the service api url here
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

    static saveCart(cart) {
        let url = 'http://139.59.92.9:3000/invoices'; //put the service api url here
        //let url = 'http://10.0.2.2:4000/invoices'; //put the service api url here

        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cart),
            })
            //.then(response=>response.json())
            .then(response=> {
                console.log('Save Cart response -> ' + response);
                //console.log('Save Cart response -> ' + JSON.stringify(response));
                resolve(response);
            })
            .catch(reason=> {
                console.log('Save Cart failed -> ' + reason);
                reject(reason);
            });
        });
    }
}