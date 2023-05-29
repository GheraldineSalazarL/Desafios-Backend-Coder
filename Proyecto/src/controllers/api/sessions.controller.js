import * as sessionsService from '../../services/sessions.service.js';

const register = async (req, res) => {
    try{
        const { first_name, last_name, email, age, password, rol } = req.body;

        if(!first_name || !last_name || !email || !age || !password || !rol ){
            return res.sendClientError('incomplete values');
        }

        const user = { first_name, last_name, email, age, password, rol };
        
        const result = await sessionsService.register(user);

        if(result==='exist'){
            return res.sendClientError('User already exists');
        }
        res.sendSuccess(result); 
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
        
    } catch(error){
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
        res.sendServerError(error);
    }
}

const login = async (req, res) => {
    try{
        const { email, password } = req.body;

        const result= await sessionsService.login(email, password);
        
        if(result === 'notCredentials') 
            return res.sendClientError('Incorrect credentials'); 
        
        if(!result) return res.sendClientError('Incorrect credentials'); 
        
        res.cookie('token', result, { httpOnly: true });
        res.sendSuccess({result}); 
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);

    } catch(error){
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
        res.sendServerError(error);
    }
};

const logout = async (req, res) => {
    try{
        res.clearCookie('token');
        req.session.destroy(err => {
            if (err) return res.status(500).send({ status: 'error', error: 'couldnt logout' });
            res.redirect('/login');
        })
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch(error){
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
        res.sendServerError(error);
    }
};

export { 
    register,
    login, 
    logout
}