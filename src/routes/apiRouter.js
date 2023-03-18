import express from "express";
const router = express.Router();

//API ENDPOINTS
router.route('/productos-test')
    .get((req, res) => {
        //Extender la sesión un minuto
        req.session.cookie.expires = new Date(Date.now() + 60 * 1000);
        const products = generateRandomProducts(5)
        res.json({products})
    });

router.route('/randoms')
    .get((req, res) => {
        const cant = parseInt(req.query.cant) || 100000000;
        const forkedRandomNumberGenerator = fork('./lib/generateRandomNumbers.js')

        forkedRandomNumberGenerator.on("message", (result) => {
            //handle async ES6 import
            if (result === "Iniciado") {
                forkedRandomNumberGenerator.send(cant)
            } else {
                res.json(result)
            }
        })
    });


export { router as apiRouter };