import { faker } from '@faker-js/faker';

const generateRandomProducts = (_amount) => {
    let randomProducts = []
    for (let i = 0; i < _amount; i++){
        randomProducts.push(
            {
                "nombre": faker.commerce.productName(),
                "precio": faker.commerce.price(100, 1000, 0),
                "foto": faker.image.image()
            })
    }
    return randomProducts;
}

export {generateRandomProducts}