<!-- title -->
<p align="center" style="padding-top: 40px">
  <img src="./images/logo.svg?sanitize=true" width="120" alt="logo" />
</p>

<h1 align="center" style="text-align: center">KEQ-DEBUG</h1>
<!-- title -->

[![version](https://img.shields.io/npm/v/keq-debug.svg?style=for-the-badge)](https://www.npmjs.com/package/keq-debug)
[![downloads](https://img.shields.io/npm/dm/keq-debug.svg?style=for-the-badge)](https://www.npmjs.com/package/keq-debug)
[![license](https://img.shields.io/npm/l/keq-debug.svg?style=for-the-badge)](https://www.npmjs.com/package/keq-debug)
[![dependencies](https://img.shields.io/librariesio/release/npm/keq-debug?style=for-the-badge)](https://www.npmjs.com/package/keq-debug)

<!-- description -->

Log keq request Infomation to console.

<!-- description -->

## Usage

<!-- usage -->

```javascript
import { request } from "keq";
import debug from "keq-debug";

request.use(debug());

// Set Options
request.use(debug({ requestBody: false, responseBody: false }));
```

<!-- usage -->

<!-- addition -->

## Options

| Option         | Default | Description            |
| :------------- | :------ | :--------------------- |
| `requestBody`  | `false` | Log the request body.  |
| `responseBody` | `false` | Log the response body. |

<!-- addition -->

## Contributing & Development

If there is any doubt, it is very welcome to discuss the issue together.
