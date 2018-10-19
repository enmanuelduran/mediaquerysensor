# MediaQuerySensor &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/enmanuelduran/mediaquerysensor/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/mediaquerysensor.svg?style=flat)](https://www.npmjs.com/package/mediaquerysensor) [![Coverage Status](https://coveralls.io/repos/github/enmanuelduran/mediaquerysensor/badge.svg?branch=master)](https://coveralls.io/github/enmanuelduran/mediaquerysensor?branch=master) [![CircleCI](https://circleci.com/gh/enmanuelduran/mediaquerysensor.svg?style=svg)](https://circleci.com/gh/enmanuelduran/mediaquerysensor)

_MediaQuerySensor_ (MQS) is a very simple and powerful event wrapper that allows you to add _sensors/listeners_ to your site/app, these sensors basically execute _actions_ (functions) based on media query/breakpoints specified by you.

## How it works

Instead of adding a listener to the window's `resize` event, MQS creates a wrapper around the window property [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) which makes it fast and performant, it assigns the action passed to the correspondent media query listener and then executes the action passed when the media query defined for that action matches the current screen size. _**Another big advantage of using the `matchMedia` API is that you can define media queries with the same format you use for CSS**_.

## Installation

Use the package manager of your preference:

**npm:**
`npm install mediaquerysensor`

**yarn:**
`yarn add mediaquerysensor`

Include it directly in the browser with a CDN:

```
https://cdn.jsdelivr.net/npm/mediaquerysensor@1.0.5/dist/mediaquerysensor.min.js
```

## Usage

_MediaQuerySensor exposes the `MQS` API in the window object if you include the library in your project using a script tag. If you desire to use it as a npm module, you can just import it and use it in the same way in your code._

### Adding a sensor/listener:

To add a Sensor or Listener we use the method `MQS.add({ref, value, action})`, this method takes an object as argument with the next properties:

| Property | type                      | Description                                                                                                                                                                    |
| -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ref      | _Object key_              | A valid (UNIQUE) object key (preferably a String) assigned as identifier to each pair (value and action) passed to MQS, this will allow us to remove listeners when necessary. |
| value    | _String:MediaQueryString_ | MediaQuery in which the action is going to be executed (Usually defined with the same format as CSS Media queries).                                                            |
| action   | _Function_                | Function to execute when the media query value conditions are fullfilled.                                                                                                      |

#### Example

```javascript
import MQS from 'mediaquerysensor';

MQS.add({
    ref: 'yourRef',
    value: '(min-width: 991px)' /* Your custom media query string */,
    action: () => {} /* Your function to execute */
});
```

**Another example using a previously defined action:**

```javascript
const consoleLogger = () => console.log('Between 480px and 990px');

MQS.add({
    ref: 'yourRef2',
    value: '(min-width: 480px) and (max-width: 990px)',
    action: consoleLogger
});
```

### Removing a sensor/listener:

To remove individual sensors we use the method `MQS.remove(ref)`, this method takes the next argument:

| argument | type                                    | Description                                      |
| -------- | --------------------------------------- | ------------------------------------------------ |
| ref      | _Valid Object key, preferably a string_ | Matching UNIQUE key used when adding the sensor. |

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

## Debugging:

To help you find problems/debug your implementations there is also a `MQS.get()` method available that exposes an object with all the active sensor's properties, this object uses the refs as keys so you can easily identify each element you've added.

```javascript
import MQS from 'mediaquerysensor';

MQS.get();

// You may want to console.log it sometimes
console.log(MQS.get());
```

## Browsers support

As I said before, this library is a wrapper around matchMedia [which has a great support for browsers](https://caniuse.com/#feat=matchmedia).
