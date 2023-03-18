import express from "express";
const router = express.Router();

function auth(req, res, next) {
    // Auth with session
    // if (req.session?.userName) {
    //     return next()
    // } else {
    //     res.sendFile('login.html', {root: path.join(__dirname, 'public')})
    // }
    // Auth with passport
    if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}


// ENDPOINTS
router.get('/info', (req, res) => {
    res.json({
        argumentosEntrada: args,
        SO: process.platform,
        nodeVersion: process.version,
        reservedMemory: process.memoryUsage()['rss'],
        excPath: __filename,
        PID: process.pid,
        projectDir: process.cwd(),
    })
});

router.get('/dashboard', auth, (req, res) => {
    //Extender la sesión un minuto
    req.session.cookie.expires = new Date(Date.now() + 60 * 1000);
    if (req.session) {
        res.sendFile('index.html', {root: path.join(__dirname, 'public')})
    } else { 
        res.sendFile('login.html', {root: path.join(__dirname, 'public')})
    }
});


export { router as userRouter };