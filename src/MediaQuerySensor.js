class MediaQuerySensor {
    static get UNAVAILABLE_MSG() {
        return `MediaQuerySensor is not supported on this browser.`;
    }

    static get NO_BREAKPOINTS_MSG() {
        return `No valid breakpoints were passed to MediaQuerySensor.`;
    }

    _checkValidations(breakpoints) {
        if (!this._window.matchMedia) {
            this._window.console.warning(MediaQuerySensor.UNAVAILABLE_MSG);

            return false;
        }

        if (!Array.isArray(breakpoints) || !breakpoints.length) {
            this._window.console.info(MediaQuerySensor.NO_BREAKPOINTS_MSG);

            return false;
        }

        return true;
    }

    _mediaChangeHandler(mediaQuery, action) {
        return () => {
            if (mediaQuery.matches) {
                action();
            }
        };
    }

    _bindMediaQueries(breakpoints) {
        breakpoints.forEach(({ value, action }) => {
            if (
                !value ||
                !action ||
                typeof value !== 'string' ||
                typeof action !== 'function'
            ) {
                return false;
            }

            const mediaQuery = this._window.matchMedia(value);
            const onMediaChange = this._mediaChangeHandler(mediaQuery, action);

            mediaQuery.addListener(onMediaChange);
            onMediaChange();
        });
    }

    init(breakpoints, _window = window) {
        this._window = _window;

        if (!this._checkValidations(breakpoints)) {
            return false;
        }

        this._bindMediaQueries(breakpoints);
    }
}

export default MediaQuerySensor;
