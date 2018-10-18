# MediaQuerySensor

_MediaQuerySensor_ (MQS) is a very simple and powerful event wrapper that allows you to perform _actions_ based on _media queries_ specified by you.

## Installation

You can install it with the package manager of your preference.

**npm:**
`npm install mediaquerysensor`

**yarn:**
`yarn add mediaquerysensor`

Include it directly in the browser with a CDN:

```
https://cdn.jsdelivr.net/npm/mediaquerysensor@1.0.2/src/MediaQuerySensor.js
```

## Usage

_MediaQuerySensor exposes the function `MQS` in the window object if you include it in your project using a script tag._ If you desire to use it as a npm module, you can just import it and use it in the same way in your code.

**Using it is very simple:**

```javascript
import MQS from 'mediaquerysensor';

MQS({
    value: '(min-width: 991px)' /* Your custom media query string */,
    action: () => {
        /* Do something for screens greater than 991px */
    }
});
```

**Another example using a previously defined action:**

```javascript
const consoleLogger = () => console.log('Between 480px and 990px');

MQS({
    value: '(min-width: 480px) and (max-width: 990px)',
    action: consoleLogger
});
```

MQS takes an object with the following properties:

| Property | type                      | Description                                                        |
| -------- | ------------------------- | ------------------------------------------------------------------ |
| value    | _String:mediaQueryString_ | MediaQuery in which the action is going to be executed             |
| action   | _Function_                | Function to execute when the mediaquery conditions are fullfilled. |

## How it works

Instead of adding a listener to the window's `resize` event, MQS creates a wrapper around the window property [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) which makes it fast and performant, it assigns the action passed to the correspondent media query listener and then executes the action passed when the media query defined for that action matches the current screen size.
