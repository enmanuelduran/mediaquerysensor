import * as msg from './constants/Messages';

const MediaQuerySensor = ({ value, action }, _window = window) => {
    const _checkValidations = () => {
        if (!_window.matchMedia) {
            _window.console.warning(msg.UNAVAILABLE);

            return false;
        }

        if (!action || typeof action !== 'function') {
            _window.console.info(msg.INVALID_ACTION);

            return false;
        }

        if (!value || typeof value !== 'string') {
            _window.console.info(msg.INVALID_VALUE);

            return false;
        }

        return true;
    };

    const _mediaChangeHandler = mediaQuery => () => {
        if (mediaQuery.matches) {
            action();
        }
    };

    const _bindMediaQueries = () => {
        const mediaQuery = _window.matchMedia(value);
        const onMediaChange = _mediaChangeHandler(mediaQuery);

        mediaQuery.addListener(onMediaChange);
        onMediaChange();
    };

    const _init = () => {
        if (!_checkValidations()) {
            return false;
        }

        _bindMediaQueries();
    };

    _init();
};

export default MediaQuerySensor;
