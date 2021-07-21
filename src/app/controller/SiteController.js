class SiteController {
     
    manager(req , res) {
        res.render('./customer/customer.ejs');
    }
    home(req ,res) {
        res.render('./body/index.ejs');
    }
}
module.exports = new SiteController