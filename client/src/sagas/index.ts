import { all } from 'typed-redux-saga';
import mainSagas from './mainSagas';

export default function* rootSaga(): Generator<any, void, any> {
    yield all([
        mainSagas(),
    ]);
}
