import MediaQuerySensor from '../src/MediaQuerySensor';

const MQS = new MediaQuerySensor();

const mockWindow = {
    console: {
        info: jasmine.createSpy(),
        warning: jasmine.createSpy()
    }
};

describe('When initializing', () => {
    const mediaQueries = [
        {
            value: '(min-width: 600px)',
            action: jasmine.createSpy()
        }
    ];

    it('should not initialize if matchMedia object is not available', () => {
        expect(MQS.init(mediaQueries, mockWindow)).toBe(false);
        expect(mockWindow.console.warning).toHaveBeenCalledWith(
            MediaQuerySensor.UNAVAILABLE_MSG
        );
    });

    describe('when matchMedia is defined', () => {
        it('should not initialize if not breakpoints are passed', () => {
            const newMock = { ...mockWindow, matchMedia: jasmine.createSpy() };
            const mediaQueries = [];

            expect(MQS.init(mediaQueries, newMock)).toBe(false);
            expect(mockWindow.console.info).toHaveBeenCalledWith(
                MediaQuerySensor.NO_BREAKPOINTS_MSG
            );
        });

        it('should not initialize if breakpoints are not passed as an array', () => {
            const newMock = { ...mockWindow, matchMedia: jasmine.createSpy() };
            const mediaQueries = {};

            expect(MQS.init(mediaQueries, newMock)).toBe(false);
            expect(mockWindow.console.info).toHaveBeenCalledWith(
                MediaQuerySensor.NO_BREAKPOINTS_MSG
            );
        });

        it('should bind media queries if the breakpoints are passed correctly', () => {
            const newMock = {
                ...mockWindow,
                matchMedia: () => ({
                    addListener: jasmine.createSpy(),
                    matches: jasmine.createSpy()
                })
            };

            spyOn(MQS, '_bindMediaQueries');
            MQS.init(mediaQueries, newMock);
            expect(MQS._bindMediaQueries).toHaveBeenCalledWith(mediaQueries);
        });
    });
});

describe('when processing the breakpoints passed', () => {
    const fullWindowMock = {
        ...mockWindow,
        matchMedia: () => {}
    };

    it('should not process invalid objects', () => {
        const badMediaQueries = [
            {
                value: '',
                action: () => {}
            },
            {
                value: '(min-width: 991px) and (max-width: 1199px)',
                action: undefined
            },
            {
                value: '(min-width: 991px) and (max-width: 1199px)',
                action: {}
            },
            {
                value: {},
                action: () => {}
            }
        ];

        spyOn(fullWindowMock, 'matchMedia').and.returnValue({
            addListener: jasmine.createSpy()
        });

        MQS.init(badMediaQueries, fullWindowMock);

        expect(fullWindowMock.matchMedia).not.toHaveBeenCalled();
        expect(fullWindowMock.matchMedia().addListener).not.toHaveBeenCalled();
    });

    it('should process N valid objects', () => {
        const mediaQueries = [
            {
                value: '(min-width: 991px) and (max-width: 1199px)',
                action: () => {}
            },
            {
                value: '(min-width: 480px)',
                action: () => {}
            }
        ];

        spyOn(fullWindowMock, 'matchMedia').and.returnValue({
            addListener: jasmine.createSpy()
        });

        MQS.init(mediaQueries, fullWindowMock);

        expect(fullWindowMock.matchMedia).toHaveBeenCalledWith(
            mediaQueries[0].value
        );
        expect(fullWindowMock.matchMedia).toHaveBeenCalledWith(
            mediaQueries[1].value
        );
        expect(fullWindowMock.matchMedia().addListener).toHaveBeenCalledTimes(
            2
        );
    });

    it('should execute the actions that currently match the view port', () => {
        const mediaQueries = [
            {
                value: '(min-width: 991px) and (max-width: 1199px)',
                action: jasmine.createSpy()
            }
        ];

        spyOn(fullWindowMock, 'matchMedia').and.returnValue({
            addListener: callback => callback(),
            matches: true
        });

        MQS.init(mediaQueries, fullWindowMock);

        expect(mediaQueries[0].action).toHaveBeenCalledTimes(2);
    });

    it('should not execute the actions that does not match the view port', () => {
        const mediaQueries = [
            {
                value: '(min-width: 991px) and (max-width: 1199px)',
                action: jasmine.createSpy()
            }
        ];

        spyOn(fullWindowMock, 'matchMedia').and.returnValue({
            addListener: callback => callback(),
            matches: false
        });

        MQS.init(mediaQueries, fullWindowMock);

        expect(mediaQueries[0].action).not.toHaveBeenCalled();
    });
});
