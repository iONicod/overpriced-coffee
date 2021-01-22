class Customer {
    constructor(username, totalPrice) {
        this.username = username
        this.totalPrice = totalPrice
    }
}

let customers = {
    add(cookieUsername) {
       if (!customers.hasOwnProperty(`${cookieUsername}`))
           customers[`${cookieUsername}`] = new Customer(cookieUsername, 0);
    },
    '123' : new Customer('123', 0),
}

export default customers;