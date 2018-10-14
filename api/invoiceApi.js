//jshint esversion:6

export default class invoiceApi {
    static getInvoices(qryURL) {
        let url = 'http://139.59.92.9:3000/invoices'; //put the service api url here
        //let url = 'http://10.0.2.2:4000/services'; //put the service api url here

        if(qryURL) {
            url = qryURL;
        }

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

    static getInvoicesByQuery(queryObject) {
        let url = 'http://139.59.92.9:3000/invoices'; //put the service api url here
        //let qry = queryObject || {start: '', end: '', mobile: '', name: ''};
        let qry = queryObject;

        //let queryObj = new InvoiceQuery(qry.start, qry.end, qry.mobile, qry.name);
        let qryData = null;

        if(qry.start)
            qryData = (qryData?qryData+'&':null) + ('start=' + qry.start);
        if(qry.end)
            qryData = (qryData?qryData+'&':null) + ('end=' + qry.end);
        if(qry.customer_mobile)
            qryData = (qryData?qryData+'&':null) + ('customer.mobile=' + qry.customer_mobile);
        if(qry.customer_name)
            qryData = (qryData?qryData+'&':null) + ('customer.name=' + qry.customer_name);
        if(qry.paymentMethod)
            qryData = (qryData?qryData+'&':null) + ('paymentMethod=' + qry.paymentMethod);
        if(qry.active)
            qryData = (qryData?qryData+'&':null) + ('active=' + qry.active);
        if(qry.totalValue)
            qryData = (qryData?qryData+'&':null) + ('totalValue=' + qry.totalValue);
        /*if(qry.others)
            qryData = (qryData?qryData+'&':null) + ('totalValue=' + qry.totalValue);*/

        if(qryData)
            url += '/?' + qryData;

        console.log(url);

        return getInvoices(url);
    }
}

export class InvoiceQuery {
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