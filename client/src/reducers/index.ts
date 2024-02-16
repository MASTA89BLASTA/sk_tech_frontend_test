import { combineReducers } from 'redux';
import main, { TState } from './main';

export type AppState = {
    main: TState,
};

const reducers = combineReducers({
    main,
})

export default reducers;
