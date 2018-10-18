import * as msg from '../src/constants/Messages';
import MQS from '../src/MediaQuerySensor';

const mockWindow = {
    console: {
        info: jasmine.createSpy(),
        warning: jasmine.createSpy()
    }
};

describe('When initializing', () => {
    const mediaQueries = {
        value: '(min-width: 600px)',
        action: jasmine.createSpy()
    };

    it('should not initialize if matchMedia object is not available', () => {
        MQS(mediaQueries, mockWindow);

        expect(mockWindow.console.warning).toHaveBeenCalledWith(
            msg.UNAVAILABLE
        );
    });

    describe('when matchMedia is defined', () => {
        const fullWindowMock = {
            ...mockWindow,
            matchMedia: () => {}
        };

        it('should not process invalid values', () => {
            spyOn(fullWindowMock, 'matchMedia').and.returnValue({
                addListener: jasmine.createSpy()
            });

            MQS({ value: '', action: () => {} }, fullWindowMock);
            MQS({ value: {}, action: () => {} }, fullWindowMock);

            expect(fullWindowMock.matchMedia).not.toHaveBeenCalled();
            expect(
                fullWindowMock.matchMedia().addListener
            ).not.toHaveBeenCalled();
        });

        it('should not process invalid actions', () => {
            const mediaQueries = [
                {
                    value: '(min-width: 991px) and (max-width: 1199px)',
                    action: undefined
                },
                {
                    value: '(min-width: 991px) and (max-width: 1199px)',
                    action: {}
                }
            ];

            spyOn(fullWindowMock, 'matchMedia').and.returnValue({
                addListener: jasmine.createSpy()
            });

            MQS(mediaQueries[0], fullWindowMock);
            MQS(mediaQueries[1], fullWindowMock);

            expect(fullWindowMock.matchMedia).not.toHaveBeenCalled();
            expect(
                fullWindowMock.matchMedia().addListener
            ).not.toHaveBeenCalled();
        });
    });
});

describe('when processing the breakpoints passed', () => {
    const fullWindowMock = {
        ...mockWindow,
        matchMedia: () => {}
    };

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

        MQS(mediaQueries[0], fullWindowMock);
        MQS(mediaQueries[1], fullWindowMock);

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

        MQS(mediaQueries[0], fullWindowMock);

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

        MQS(mediaQueries[0], fullWindowMock);

        expect(mediaQueries[0].action).not.toHaveBeenCalled();
    });
});
