const express = require('express')
const html_to_pdf = require('html-pdf-node')
const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const Mustache = require('mustache');
let items = [
      { item: "Plan A", quantity: 1, pricePerUnit: 1999.99 },
      { item: "Plan B", quantity: 3, pricePerUnit: 12.7 },
      { item: "Plan C", quantity: 1, pricePerUnit: 125.89 },
    ].map((item) => {
      item.price = item.quantity * item.pricePerUnit;
      return item;
    });
    //const total = items.reduce((total, item) => total  item.price, 0).toFixed(2);
    // const total = "2163.98";
    
    items = items.map((item) => {
      item.pricePerUnit = item.pricePerUnit.toFixed(2);
      item.price = item.price.toFixed(2);
      return item;
    });
const data = {
    invoiceNumber: "Mr. Vinay Arora",
    companyDetails: ["UNIVEST STOCK BROKING PRIVATE LIMITED"],
    thanks:["Thank you for having business with us!"],
    customerDetails: ["Invoice #: 512", "Date: 03.01.2026"],
    ecoworksAdd: ["Ecoworks","Gandhinagar"],
    custname: "Mr. Vinay Arora",
    items
    // total
   };
const app = express()
const port = 3000
var name =  Date.now().toString();
name = "Ecoworks_" + data.custname + "_03_Jan_26";

//const html = fs.readFileSync(path.resolve(__dirname, "./template.html"), 'utf8')

const html = fs.readFileSync(path.resolve(__dirname, "./EcoworksTemplate.html"), 'utf8')
const template = Mustache.render(html, data);
const content = ejs.render(template, { title: "Payment Invoice", ecoworksAdd: "123, Sharan Business, Sector 26, Gandhinagar, Gujarat 382026" })
fs.writeFile(path.resolve(__dirname, "./public/index.html"), content, () => {
    app.use(express.static('src/public'))

    const server = app.listen(port, async () => {
        const url = `http://localhost:${port}`
        const options = { 
            format: 'A4',
            margin: {
                  top: 25,
                  left: 20,
                  right: 20,
                  bottom: 20,
                },
            // path: 'pdf_'+name+'.pdf' }
            path: name+'.pdf' }
        const file = { url }
        await html_to_pdf.generatePdf(file, options)

        server.close()
    })
})