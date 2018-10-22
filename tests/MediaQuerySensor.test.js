import * as msg from '../src/constants/Messages';
import MQS from '../src/MediaQuerySensor';

describe('When processing the media query objects', () => {
    beforeEach(() => {
        global.console = { warn: jest.fn(), log: console.log };
    });

    afterEach(() => {
        MQS.empty();
        jest.clearAllMocks();
    });

    describe('when getting the objects available', () => {
        beforeEach(() => {
            global.matchMedia = jest.fn().mockReturnValue({
                addListener: jest.fn(),
                removeListener: jest.fn(),
                matches: true
            });
        });

        const mediaQueries = [
            {
                mediaQuery: '(min-width: 600px)',
                action: jest.fn(),
                ref: 'ref'
            },
            {
                mediaQuery: '(max-width: 599px)',
                action: jest.fn(),
                ref: 'ref2'
            }
        ];

        it('should return an empty object if there are none', () => {
            expect(MQS.get()).toEqual({});
        });

        it('should return an object with correct elements and update', () => {
            MQS.add(mediaQueries[0]);

            expect(MQS.get()['ref']).toBeDefined();

            MQS.add(mediaQueries[1]);

            expect(MQS.get()['ref']).toBeDefined();
            expect(MQS.get()['ref2']).toBeDefined();
        });
    });

    describe('When adding new elements', () => {
        const mediaQueries = {
            mediaQuery: '(min-width: 600px)',
            action: jest.fn(),
            ref: 'ref'
        };

        it('should not add elements if matchMedia object is not defined', () => {
            global.matchMedia = undefined;

            expect(MQS.add(mediaQueries)).toBe(false);

            expect(global.console.warn).toHaveBeenCalledWith(msg.UNAVAILABLE);
        });

        describe('when matchMedia is defined', () => {
            beforeEach(() => {
                global.matchMedia = jest.fn().mockReturnValue({
                    addListener: jest.fn(),
                    removeListener: jest.fn(),
                    matches: false
                });
            });

            it('should not process invalid values', () => {
                expect(
                    MQS.add({ mediaQuery: '', action: () => {}, ref: 'ref' })
                ).toBe(false);
                expect(
                    MQS.add({ mediaQuery: {}, action: () => {}, ref: 'ref2' })
                ).toBe(false);

                expect(global.matchMedia).not.toHaveBeenCalled();
                expect(global.matchMedia().addListener).not.toHaveBeenCalled();
                expect(global.console.warn).toHaveBeenCalledWith(
                    msg.INVALID_MEDIAQUERY
                );
            });

            it('should not process invalid actions', () => {
                const mediaQueries = [
                    {
                        mediaQuery:
                            '(min-width: 991px) and (max-width: 1199px)',
                        action: undefined,
                        ref: 'ref'
                    },
                    {
                        mediaQuery:
                            '(min-width: 991px) and (max-width: 1199px)',
                        action: {},
                        ref: 'ref2'
                    }
                ];

                expect(MQS.add(mediaQueries[0])).toBe(false);
                expect(MQS.add(mediaQueries[1])).toBe(false);

                expect(global.matchMedia).not.toHaveBeenCalled();
                expect(global.matchMedia().addListener).not.toHaveBeenCalled();
                expect(global.console.warn).toHaveBeenCalledWith(
                    msg.INVALID_ACTION
                );
            });

            it('should not process invalid refs', () => {
                const mediaQueries = [
                    {
                        mediaQuery:
                            '(min-width: 991px) and (max-width: 1199px)',
                        action: () => {},
                        ref: 'ref'
                    },
                    {
                        mediaQuery:
                            '(min-width: 991px) and (max-width: 1199px)',
                        action: () => {},
                        ref: 'ref'
                    },
                    {
                        mediaQuery:
                            '(min-width: 991px) and (max-width: 1199px)',
                        action: () => {}
                    }
                ];

                expect(MQS.add(mediaQueries[0])).toBe(undefined);
                expect(MQS.add(mediaQueries[1])).toBe(false);
                expect(MQS.add(mediaQueries[2])).toBe(false);

                expect(global.matchMedia).toHaveBeenCalledTimes(1);
                expect(global.matchMedia().addListener).toHaveBeenCalledTimes(
                    1
                );
                expect(global.console.warn).toHaveBeenCalledWith(
                    msg.INVALID_REF
                );
            });

            it("should add new objects if they're valid", () => {
                MQS.add(mediaQueries);

                expect(MQS.get()['ref'].mediaQuery).toBe(
                    mediaQueries.mediaQuery
                );
                expect(MQS.get()['ref'].action).toEqual(mediaQueries.action);
                expect(MQS.get()['ref'].boundAction).toEqual(
                    expect.any(Function)
                );
                expect(MQS.get()['ref'].mediaQueryList).toEqual({
                    addListener: expect.any(Function),
                    removeListener: expect.any(Function),
                    matches: false
                });
            });

            it('should add the listener to the valid object', () => {
                MQS.add(mediaQueries);

                expect(global.matchMedia).toHaveBeenCalledWith(
                    mediaQueries.mediaQuery
                );
                expect(global.matchMedia().addListener).toHaveBeenCalledWith(
                    MQS.get()['ref'].boundAction
                );
            });

            it('should not execute the action if the current screen size does not match', () => {
                MQS.add(mediaQueries);

                expect(mediaQueries.action).not.toHaveBeenCalled();
            });

            it('should execute the action if the current screen size matches', () => {
                global.matchMedia = jest.fn().mockReturnValue({
                    addListener: jest.fn(),
                    removeListener: jest.fn(),
                    matches: true
                });

                MQS.add(mediaQueries);

                expect(mediaQueries.action).toHaveBeenCalled();
            });
        });
    });

    describe('When removing media queries', () => {
        const mediaQueries = [
            {
                mediaQuery: '(min-width: 600px)',
                action: jest.fn(),
                ref: 'ref'
            },
            {
                mediaQuery: '(max-width: 599px)',
                action: jest.fn(),
                ref: 'ref2'
            }
        ];

        it('should not remove anything if the ref does not exist', () => {
            expect(MQS.remove('ref')).toBe(false);

            expect(console.warn).toHaveBeenCalledWith(msg.REF_NOT_FOUND);
        });

        it('should remove elements correctly when the ref exist', () => {
            MQS.add(mediaQueries[0]);
            MQS.add(mediaQueries[1]);

            const boundAction = MQS.get()['ref'].boundAction;

            expect(MQS.get()['ref']).toBeDefined();
            expect(MQS.get()['ref2']).toBeDefined();

            MQS.remove('ref');

            expect(console.warn).not.toHaveBeenCalled();
            expect(MQS.get()['ref']).not.toBeDefined();
            expect(MQS.get()['ref2']).toBeDefined();
            expect(global.matchMedia().removeListener).toHaveBeenCalledTimes(1);
            expect(global.matchMedia().removeListener).toHaveBeenCalledWith(
                boundAction
            );
        });

        it('should be able to remove all the listeners and media queries programatically', () => {
            MQS.add(mediaQueries[0]);
            MQS.add(mediaQueries[1]);

            expect(MQS.get()['ref']).toBeDefined();
            expect(MQS.get()['ref2']).toBeDefined();

            const boundAction = MQS.get()['ref'].boundAction;
            const boundActionRef2 = MQS.get()['ref2'].boundAction;

            MQS.empty();

            expect(global.matchMedia().removeListener).toHaveBeenCalledTimes(2);
            expect(global.matchMedia().removeListener).toHaveBeenCalledWith(
                boundAction
            );
            expect(global.matchMedia().removeListener).toHaveBeenCalledWith(
                boundActionRef2
            );
            expect(MQS.get()).toEqual({});
        });
    });
});
