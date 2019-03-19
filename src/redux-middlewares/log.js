const logger = ()=>{
    return ({dispatch,getState}) => next => action =>{
        console.log('dispatching', action);
        return next(action);
    }
};

export default logger;