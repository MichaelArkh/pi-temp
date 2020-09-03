
# Pi Temp: Track temperatures around your home!

Demo [here](https://temp.mgelsk.com)

Pi Temp utilizes a raspberry pi with a temperature sensor in order to take temperature/humidity data. It then makes it available on the web through api calls.

#### Features:
* [API](#api) __server-api__ used for retreiveing and storing temperature and humidity data
* [Website](#website) __temperature-web__ which makes the temperature data easily readable
* [Python Script](#python-script) __raspberry-local__ ran locally on the rasperry that makes periodic calls to the api

## API
Makes data retrieval and upload seamless.

##### Technologies:
* PHP - *Used as a wrapper around the database to allow entries to be made externally*
* Mariadb - *Database for storing data*

##### Documentation:

* /get endpoint __URL encoded__

|    Option    | Input Type |   Default  | Explanation                               |
|------------:|------------|----------|-------------------------------------------|
| `from`       | YYYY-MM-DD | none       | Beginning date for results                |
| `before`     | YYYY-MM-DD | none       | Ending date to give results               |
| `count`      | int        | 10         | The amount of results to return           |
| `room`       | string     | bedroom    | The room to return the data from          |
| `statistics` | boolean    | true       | Whether or not to include statistics      |
| `units`      | string     | fahrenheit | The type of unit to return the results in |

* /post endpoint __JSON__

|   Option   | Input Type | Explanation                                         |
|----------:|------------|-----------------------------------------------------|
| `token`    | string     | Any token defined in the tokens table               |
| `temp`     | double     | The temperature to store                            |
| `humidity` | double     | The humidity to store                               |
| `table`    | string     | The room to store the data in (Must be whitelisted) |

To start add your database details to `config.sample.php` and rename the file to `config.php`.

To add more rooms, you must whitelist the room in the php file `tables.php` and create the table in your database. By default if you have more than 150 rows, upon every new entry the oldest rows are deleted.

__Database:__ Table structure is given in __database-structure__. 



## Website
Displays data obtained from the api [endpoint](https://api.mgelsk.com/temp/get). Website scales and is perfectly viewable on mobile devices.

##### Technologies:
* React - *Used along with hooks to manage what the user sees*
* MaterialUI - *Styling to follow material design guidelines*
* Devexpress Charts - *Easy to understand charts to plot temperature*

##### Screenshots
| Home Page | Modal popup
|----- | ----- |
| ![image](https://user-images.githubusercontent.com/38901444/91938754-8f49a400-ecc2-11ea-8373-68114fc76b43.png)|![image](https://user-images.githubusercontent.com/38901444/91936501-f749bb80-ecbd-11ea-830f-083d5dfc13d3.png) |



## Python Script
The backbone for the whole project, grabs data from the environment and makes a request to the api endpoint to store it in the database.

#### Setup:
* Modify `settings.json` to include your respective API endpoint and API token.
* `ROOM_ID` can be changed to anything as long as it is whitelisted as a table in `config.php` and the table exists in the database.
	* If you need more rooms other than the two samples `Bedroom and Livingroom` you will need to modify the website as well to make another API request for that room.

