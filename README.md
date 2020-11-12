# VUE Dashboard

This is an open source home dashboard you can use to display informations as:
- Time, date and a counter to a specific time
- Current fuel prices in your area
- Images and animal facts
- Route navigation data (with traffic)
- Weather in your area

The dashboard (as of now) can hold 6 dashlets in a 3 by 2 setup. Fell free to help developing new dashlets, or help improving things as setup, general functionality and configurations.

To setup the dashboard you will probably need at least some understanding of programming (Developers, feel free to improve the setup!), but the guide below will try to explain it as good as possible.

## Setup for Your home dashboard
### Decide which dashlets you want
You can find all available dashlets in the components directory. Each dashlet can be configured. The configuration of each dashlet will be explained at the head of each file (TODO! As of now find out for yourself :P Just take a look at the names of a components properties, should be self explanatory, mostly).
To include a dashlet into you dashboard, go to the App.vue file. There you can find 2 \<v-row> tags and 6 \<v-col> tags. Each \<v-col> tag will hold a dashlet. Include as dashlet as already shown in the file. After restarting your application, you will find the dashlet on the webpage.

### Adding API keys
You will need API keys for some dashlets. All APIs used in this project are either free, free to some extent or the keys need to be request via mail from the providers. You can configure the API tokens in the .env file. For the current dashlets take a look at these sites:
- Navigation: You will need a MapBox API key. Take a look here: https://docs.mapbox.com/help/how-mapbox-works/access-tokens/. MapBox will give you 100000 request free a months!
- FuelList: For Germans, you can request a Tankkoenig API token here: https://creativecommons.tankerkoenig.de/
- Weather: You will need an Open Weather API token. Take a look here: https://openweathermap.org/appid. This token will be free if used correctly.

### Additional configuration
#### Active times
You can configure the dashboard to only be active during specified hours. Note that the 0-23 hour format is used. In the .env file you can configure these times with the variable VUE_APP_ACTIVE_HOURS. This variable must be an array of array with 2 entries each. Each entry in the array is a timespan (bordered by 2 hour values).
Lets say you want your dashboard to be active from 6 to 10 in the morning and from 17 to 0 in the evening. The variable should look like this: \[[6, 9], [17, 23]]. So the dashboard will be active, when the clocks hours are in the given values (6:00 to 9:59 and 17:00 to 23:59).
Note that there is implementation needed in a component to make this work. So not all components may obey your timespans!

## Developing on the dashboard
### Developing a dashlet
Take a look at the already developed dashlets. A dashlet is considered a component and should be completely isolated from other components.
If you think the project or you dashlets would benefit from shared components, feel free to create a pull request for it!
#### Making your dashlet obey the configured active times
There is a module in src/helpers named activeChecker.js. As of now it contains one function: checkIfActive(). This function will check if the current hour is inside one of the configured timespans and will return true if yes, and false if not.
Your component most likey contains an interval, where you request data from an API or just refresh component data. I think the best way to make the component obey the active rule is to check for the checkIfActive() functions result and cancel the interval execution, if false is returned.

#### Development Roadmap (feel free to contribute)
- An **interactive shopping list component**, where users can add items to and remove items from. This should be done from another route of the webpage or via an app. The dashlet itself should not display any input components
- Better setup: Make **components and properties configurable via a config file**. As of now users have to adjust actual code to configure their dashboard
- **Common way to obay active times**: At the moment active times are checked via checking the helper function and canceling requests, if it returned false. There should be a way to let the component obey these rules automatically (if a property is set)
- Open for any ideas!

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```