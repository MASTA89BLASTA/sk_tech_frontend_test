import { all, takeEvery, put, delay, call } from 'typed-redux-saga';
import { mainActions } from '../actions';
import { MainApi } from '../api'

export function* mainMessagesList(): Generator<any, void, any> {
    try {
        const data = yield call(
            MainApi.getMessagesList,
        );
        yield delay(2000); 
        console.log(data)
        yield put(mainActions.mainMessagesListSuccess(data));
    } catch (error) {
        yield put(mainActions.mainMessagesListFailed(error));
        console.log('loading error', error);
    }
}

export function* watchMainMessagesList(): Generator<any, void, any> {
    yield takeEvery(mainActions.MAIN_MESSAGES_LIST_FETCH, mainMessagesList);
}

export default function* rootSaga(): Generator<any, void, any> {
    yield all([
        watchMainMessagesList(),
    ]);
}