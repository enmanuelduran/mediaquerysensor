# MediaQuerySensor &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/enmanuelduran/mediaquerysensor/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/mediaquerysensor.svg?style=flat)](https://www.npmjs.com/package/mediaquerysensor) [![Coverage Status](https://coveralls.io/repos/github/enmanuelduran/mediaquerysensor/badge.svg?branch=master)](https://coveralls.io/github/enmanuelduran/mediaquerysensor?branch=master) [![CircleCI](https://circleci.com/gh/enmanuelduran/mediaquerysensor.svg?style=svg)](https://circleci.com/gh/enmanuelduran/mediaquerysensor)

_MediaQuerySensor_ (MQS) is a very simple and powerful event wrapper that allows you to add listeners to your site or app, it will basically execute functions based on media query/breakpoints specified by you.

Instead of adding a listener to the window's `resize` event, MQS creates a wrapper around the window property [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) which makes it fast and performant.

## Why to use MQS?, what problems does it solve?

**The problem:**

In today's world to be able to remove and add listeners to media queries you first need to:

1. Create a _MediaQueryList object_.
1. Bind a function to the object created through a listener.
1. Check when the screen matches the media query to execute the function in the listener.
1. If you want to be able to remove a listener you will need to make sure that the reference to the _MediaQueryList object_ and the _function_ is still available in your current scope since _both_ are needed to achieve this. If you don't have access to the references you will have to define global variables and make changes in your code that could be avoided.

**Solution:**

MQS Solves all these problems because:

1. It takes care of creating _the MediaQueryList objects_.
1. It takes the responsability of binding your objects with your functions through a listener.
1. It makes the necessary checks to execute your functions when the screen size matches a media query.
1. It creates accesible references so that you can remove listeners everywhere without having to worry about the context you're currently in.

## Installation

Use the package manager of your preference:

**npm:**
`npm install mediaquerysensor`

**yarn:**
`yarn add mediaquerysensor`

Include it directly in the browser with a CDN:

```
https://cdn.jsdelivr.net/npm/mediaquerysensor@2.0.1/dist/mediaquerysensor.min.js
```

## Demo

A demo is available at https://enmascript.com/code/mediaquerysensor

## Usage

_MediaQuerySensor exposes the `MQS` API in the window object if you include the library in your project using a script tag. If you desire to use it as a npm module, you can just import it and use it in the same way in your code._

### Adding a sensor/listener:

To add a Sensor or Listener we use the method `MQS.add({ref, mediaQuery, action})`, this method takes an object as argument with the next properties:

| Property     | type                      | Description                                                                                                                                                                         |
| ------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ref`        | _Object key_              | A valid (UNIQUE) object key (preferably a String) assigned as identifier to each pair (mediaQuery and action) passed to MQS, this will allow us to remove listeners when necessary. |
| `mediaQuery` | _String:MediaQueryString_ | MediaQuery in which the action is going to be executed (You can define media queries in the same way as CSS Media queries).                                                         |
| `action`     | _Function_                | Function to execute when the media query conditions are fullfilled.                                                                                                                 |

#### Example

```javascript
import MQS from 'mediaquerysensor';

MQS.add({
    ref: 'yourRef',
    mediaQuery: '(min-width: 991px) and (min-height: 500px)', // Your Media Query
    action: () => {} /* Your function to execute */
});
```

**Another example using a previously defined action:**

```javascript
const consoleLogger = () => console.log('Between 480px and 990px');

MQS.add({
    ref: 'yourRef2',
    mediaQuery: '(min-width: 480px) and (max-width: 990px)',
    action: consoleLogger
});
```

### Removing a sensor/listener:

To remove individual sensors we use the method `MQS.remove(ref)`, this method takes the next argument:

| argument | type                                    | Description                                      |
| -------- | --------------------------------------- | ------------------------------------------------ |
| `ref`    | _Valid Object key, preferably a string_ | Matching UNIQUE key used when adding the sensor. |

#### Example

```javascript
import MQS from 'mediaquerysensor';

MQS.remove('yourRef');
```

### Remove all sensors/listeners

MQS also provides the ability to remove all the added sensors programatically by using the method `MQS.empty()`:

#### Example

```javascript
import MQS from 'mediaquerysensor';

MQS.empty();
```

### Checking/Getting active sensors

To help you make validations and find problems in your implementations there is also a `MQS.get()` method available that exposes an object with all the active sensor's properties, you can also get one specific sensor object directly to see if it is active by executing `MQS.get()['sensorRef']`.

#### Example

```javascript
import MQS from 'mediaquerysensor';

// Gets an object with all the active sensors
MQS.get();

// Gets a sensor object identified by the key "sensorRef"
MQS.get()['sensorRef'];

// You may want to console.log it sometimes
console.log(MQS.get());
```

## How it works

MQS receives an object with the properties `ref`, `mediaQuery` and `action` to create _sensors_ (as previously seen on the `add` method).

### What is a Sensor?

A _sensor_ is just an object created by MQS that contains the properties `mediaQuery` and `action` defined, each sensor uses the `ref` value defined by you as identifier. Once a sensor is created, a listener is added to bind your `mediaQuery` with your `action` together so that they can be executed when the screen matches the `mediaQuery` conditions. Also, you'll see that each sensor object contains two extra properties (mostly for debugging purposes):

| argument         | type                    | Description                                                                                                                              |
| ---------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `mediaQueryList` | _MediaQueryList Object_ | It's required to use the matchMedia API, this object allows us to add and remove listeners.                                              |
| `boundAction`    | _Function_              | The final function bound to the `mediaQueryList` listeners, this function contains the validations of when an action should be executed. |
|                  |

So, if we call the method `add` like:

```
MQS.add({
    ref: 'refId',
    mediaQuery: '(max-height: 400px)',
    action: () => console.log('maximum of 400px of height'),
});

MQS.add({
    ref: 'refId2',
    mediaQuery: '(min-width: 768px) and (max-width: 990px)',
    action: () => console.log('768px to 990px'),
});
```

It will create the following sensor objects:

```
{
    'refId': {
        mediaQuery: '(max-height: 400px)',
        action: () => console.log('maximum of 400px of height'),
        mediaQueryList: MediaQueryList{},
        boundAction: () => {}
    },
    'refId2': {
        mediaQuery: '(min-width: 768px) and (max-width: 990px)',
        action: () => console.log('768px to 990px of width'),
        mediaQueryList: MediaQueryList{},
        boundAction: () => {}
    }
}
```

## Browsers support

As I said before, this library is a wrapper around matchMedia [which has a great support for browsers](https://caniuse.com/#feat=matchmedia).
