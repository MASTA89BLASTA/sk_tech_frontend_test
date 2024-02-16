import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import { TState } from '../reducers/main';

const getMain = (state: AppState): TState => state.main as TState;

export const getMainUsername = createSelector(
    [getMain],
    (main: TState) => main.username,
);

export const getMainMessagesList = createSelector(
    [getMain],
    (main: TState) => main.messagesList,
);

export const getMainMessengerError = createSelector(
    [getMain],
    (main: TState) => main.messengerError,
);

export default {
    getMainUsername,
    getMainMessagesList,
    getMainMessengerError,
};