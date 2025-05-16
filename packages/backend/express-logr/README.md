# express-logr

`express-logr` is a lightweight middleware for logging HTTP requests in Express applications. It supports logging to the console or to a specified log file.

## Installation

Install the package using npm or your preferred package manager:

```bash
npm install express-logr
```
or with yarn:

```bash
yarn add express-logr
```
or with pnpm:

```bash
pnpm add express-logr
```

## Usage
#### Basic Usage
To log HTTP requests to the console:

```javascript
import express from 'express';
import httpLogger from 'express-logr';

const app = express();

app.use(httpLogger());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

#### Logging to a File

To log HTTP requests to a file, specify the logFilePath option:

```javascript
import express from 'express';
import path from 'path';
import httpLogger from 'express-logr';

const app = express();

app.use(httpLogger({ logFilePath: path.join(__dirname, 'logs/app.log') }));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

### API
#### httpLogger(options?: LoggerParams): RequestHandler

#### Parameters
- options (optional): An object with the following properties:
    - logFilePath (string): The path to the log file where HTTP requests will be logged. If not provided, logs will be written to the console.
#### Returns
An Express middleware function for logging HTTP requests.


### Features

- Logs HTTP requests with timestamps, methods, and URLs.
- Supports logging to the console or a file.
- Automatically creates directories for log files if they do not exist.

### License
This project is licensed under the ISC License