import * as msg from './constants/Messages';

function MediaQuerySensor(data = {}) {
    const _validateInsertion = (mediaQuery, action, ref) => {
        if (!window.matchMedia) {
            console.warn(msg.UNAVAILABLE);

            return false;
        }

        if (!action || typeof action !== 'function') {
            console.warn(msg.INVALID_ACTION);

            return false;
        }

        if (!mediaQuery || typeof mediaQuery !== 'string') {
            console.warn(msg.INVALID_MEDIAQUERY);

            return false;
        }

        if (!ref || data[ref]) {
            console.warn(msg.INVALID_REF);

            return false;
        }

        return true;
    };

    const _mediaChangeHandler = (mediaQueryList, action) => () => {
        if (mediaQueryList.matches) {
            action();
        }
    };

    const _bindMediaQueries = (mediaQueryList, ref) => {
        mediaQueryList.addListener(data[ref].boundAction);
        data[ref].boundAction();
    };

    const add = ({ mediaQuery, action, ref }) => {
        if (!_validateInsertion(mediaQuery, action, ref)) {
            return false;
        }

        const mediaQueryList = window.matchMedia(mediaQuery);

        data[ref] = {
            mediaQuery,
            action,
            mediaQueryList,
            boundAction: _mediaChangeHandler(mediaQueryList, action)
        };

        _bindMediaQueries(mediaQueryList, ref);
    };

    const remove = ref => {
        if (!(ref in data)) {
            console.warn(msg.REF_NOT_FOUND);

            return false;
        }

        data[ref].mediaQueryList.removeListener(data[ref].boundAction);

        const { [ref]: undefined, ...newData } = data;
        data = newData;
    };

    const empty = () => {
        Object.keys(data).forEach(elm => {
            data[elm].mediaQueryList.removeListener(data[elm].boundAction);
        });

        data = {};
    };

    const get = () => Object.freeze({ ...data });

    return Object.freeze({
        add,
        empty,
        get,
        remove
    });
}

export default MediaQuerySensor();
