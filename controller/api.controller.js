import { logger } from '../utils/logger.js'
import { generateRandomProducts } from '../middleware/generateRandomProducts.js'
import { fork } from 'child_process';
import yargs from 'yargs'
import os from 'os';

const DEFAULT_PORT = 8080;
const DEFAULT_MODE = "FORK";
const args = yargs(process.argv.slice(2))
  .default("p", DEFAULT_PORT)
  .default("m", DEFAULT_MODE)
    .argv;
const numCPUs = os.cpus().length;

export const getProductsTest = async (req, res) => {
    logger.log({level: "info", message: "Request [GET] to /productos-test"})
    const products = generateRandomProducts(5)
    res.json({products})
};
export const getInfo = async (req, res) => {
    logger.log({ level: "info", message: "Request [GET] to /info" })
    res.json({
        argumentosEntrada: args,
        SO: process.platform,
        nodeVersion: process.version,
        reservedMemory: process.memoryUsage()['rss'],
        excPath: __filename,
        PID: process.pid,
        projectDir: process.cwd(),
        numCPUs: numCPUs,
    })
};
export const getInfoLog = async (req, res) => {
    logger.log({ level: "info", message: "Request [GET] to /info" })
    res.json({
        argumentosEntrada: args,
        SO: process.platform,
        nodeVersion: process.version,
        reservedMemory: process.memoryUsage()['rss'],
        excPath: __filename,
        PID: process.pid,
        projectDir: process.cwd(),
        numCPUs: numCPUs,
    })
};
export const getRandoms = async (req, res) => {
    logger.log({level: "info", message: "Request [GET] to /randoms"})
    const cant = parseInt(req.query.cant) || 100000000;
    const forkedRandomNumberGenerator = fork('../lib/generateRandomNumbers.js')

    forkedRandomNumberGenerator.on("message", (result) => {
        //handle async ES6 import
        if (result === "Iniciado") {
            forkedRandomNumberGenerator.send(cant)
        } else {
            res.json(result)
        }
    })
};