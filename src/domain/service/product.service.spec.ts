import Product from "../entity/product";
import ProductService from "./product.service";

describe("Product service unit test", () => {

    it("should change the prices of all produtc", () => {

        const produtc1 = new Product("product1", "Produtct 1", 10);
        const produtc2 = new Product("product2", "Produtct 2", 20);
        const products = [produtc1, produtc2];
        
        ProductService.increasePrice(products, 100);

        expect(produtc1.price).toBe(20);
        expect(produtc2.price).toBe(40);

    });

})