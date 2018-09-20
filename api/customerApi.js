//jshint esversion:6

export default class customerApi {
    static getCustomers() {
        let url = 'http://139.59.92.9:3000/customers'; //put the service api url here
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

    static getCustomersByQuery(queryObject) {
        let url = 'http://139.59.92.9:3000/customers'; //put the service api url here
        //let qry = queryObject || {start: '', end: '', mobile: '', name: ''};
        let qry = queryObject;

        //let queryObj = new CustomerQuery(qry.start, qry.end, qry.mobile, qry.name);
        let qryData = null;

        if(qry.start)
            qryData = (qryData?qryData+'&':null) + ('start=' + qry.start);
        if(qry.end)
            qryData = (qryData?qryData+'&':null) + ('end=' + qry.end);
        if(qry.mobile)
            qryData = (qryData?qryData+'&':null) + ('mobile=' + qry.mobile);
        if(qry.name)
            qryData = (qryData?qryData+'&':null) + ('name=' + qry.name);

        if(qryData)
            url += '?' + qryData;

        console.log(url);
    }
}

export class CustomerQuery {
    constructor(start, end, mobile, name) {
        this.start = start;
        this.end = end;
        this.mobile = mobile;
        this.name = name;
    }

    get start() {
        return this._start;
    }
    set start(value) {
        this._start = value;
    }

    get end() {
        return this._end;
    }
    set end(value) {
        this._end = value;
    }

    get mobile() {
        return this._mobile;
    }
    set mobile(value) {
        this._mobile = value;
    }

    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }

    getQueryObject() {
        return {
            start: this.start,
            end: this.end,
            mobile: this.mobile,
            name: this.name,
        };
    }
}