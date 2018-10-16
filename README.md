# MediaQuerySensor

_MediaQuerySensor_ (MQS) is a very simple and powerful event wrapper that allows you to perform _actions_ based on _media queries_ specified by you. 

## Installation

You can install it with the package manager of your preference.

**npm:**
`npm install mediaquerysensor`

**yarn:**
`yarn add mediaquerysensor`
## Usage
```
import MediaQuerySensor from 'mediaquerysensor';

const MQS = new MediaQuerySensor();
MQS.init([
    {
        value: '(min-width: 480px) and (max-width: 990px)',
        action: () => { /* Do something for 480px to 990px Screens */ }
    },
    {
        value: '(min-width: 991px)',
        action: () => { /* Do something for Screens greater than 991px */ }
    }
]);
```

method | Arguments | Description
------ | ---- | -----------
init   | _Array(object(value: mediaQueryString, action: Function))_ | Sets up the media queries and actions to execute. Receives an array of objects with the properties value and action that will be bound together. 

## How it works
Makes use of the window property `window.matchMedia` to add a listener to the media queries defined in the `init` method. 
It will execute the action passed when the media query defined for that action matches the current screen size.
