var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
})

var totalCost = 0;
const productSearch = [

    {
        type: 'input',
        name: 'itemId',
        message: 'enter the Product ID'
    }, {
        type: 'number',
        name: 'productBuyQty',
        message: 'enter the quantity you want to buy'
    }, {
        type: 'input',
        name: 'exit',
        message: "Press E to exit or any key to submit purchase"
    }
]


connection.connect(function (err) {
    if (err) throw err;
    readProducts();
});

function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        //   connection.end();
        runSearch();
    });
}






function runSearch() {
    inquirer.prompt(productSearch)
        .then(function (product) {
            // console.log(product)

            if (product.exit.toLowerCase() === "e") {
            
                connection.end();
                console.log ("goodbye")
            } else {

                connection.query("select * from products where item_id=?", product.itemId, function (err, data) {
                    if (err) throw err;
                    console.table(data)
                    //[{item_id:2,stock_quantity:25134}]
                    var productQty = data[0].stock_quantity
                    var newQty = productQty - product.productBuyQty
                           var itemPrice =  data[0].price;
                    if (newQty < 0) {
                        console.log("Insufficient quantity!")
                        readProducts();
                    } else {
                        connection.query("update products set stock_quantity = ? where item_id= ? ", [newQty, product.itemId], function (err, data) {
                            if (err) throw err;

                            var totalPrice = newQty * itemPrice;
                            totalCost += totalPrice;
                            console.log("Your total cost = $", totalCost);
                            readProducts();


                        })
                    }


                })



            }


        });
}