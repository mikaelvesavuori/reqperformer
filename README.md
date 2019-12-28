# ReqPerformer

A tool for response performance testing, which lets you output results to an HTML table.

Good especially when you need something dynamic in an app or online context and don't want to do terminal-riding in a CLI thingamabob.

## Setup

1. Create a mounting DIV (default is a DIV element with the class name `Tables`)
2. Instantiate new RequestPerformer like `const rqp = new ReqPerformer.MakeRequest();`
3. Run it with `rqp.runTests(tests)` where `tests` is an array of objects as exemplified below
4. Output will be written as tables into the mounting DIV

```
// User configuration and test running using GET
const tests = [
	{
		url: "https://swapi.co/api/planets/3/"
	}
];

// Same thing but as POST request with body in whatever shape you need
const testWithBody = [
	{
		url: "https://swapi.co/api/planets/3/",
		body: {
			somethingHere: "value"
		}
	}
]

const rqp = new ReqPerformer.MakeRequest();

rqp.runTests(tests);
```

## Configuration

The structure of parameters, and their defaults are:

```
// The constructor and the default values
constructor({
	requestCount = 5,
	doWarmupCall = false,
	mountingDivClassName = `Tables`,
	tableNamePrefix = `Table`,
	tableElementTemplate = `<table class="{{TABLE_NAME}}"></table>`,
	tableHeaderFieldTemplate = `<tr><th>{{URL}}</th></tr>`,
	tableRequestFieldTemplate = `<tr>
		<td>{{REQUEST_TIME_STRING}}</td>
	</tr>`,
	tableRequestTimingFieldTemplate = `<tr>
		<td><strong>{{AVERAGE_RESP_TIME}}</strong></td>
	</tr>`
})

// Example: Setting `requestCount` to 20, `doWarmupCall` to true, and adding custom `mountingDivClassName` and `tableNamePrefix`
const rqp = new ReqPerformer.MakeRequest(20, true, 'MyReqPerfTable', 'rqp-table');
```

### Changing the element templates

Make sure to keep the templating values (denoted by double curly braces, like `{{REQUEST_TIME_STRING}}` and `{{TABLE_NAME}}`) since those match hardcoded values in the source code.

## Commands

### Development server

Run `yarn dev` or `npm run dev` to start a development server. It will mount the Javascript into `src/index.html` which is a very simple frame for validating or testing your functionality.

### Build for production

Run `yarn build` or `npm run build` and it will use Webpack to bundle a UMD build into the `dist` folder. Supported browsers can be seen below.

Note that the template/demo HTML page in `/src` will not be bundled when building.

## Compatibility and .browserslist settings

I've compiled the distribution code with the following `.browserslist` settings:

```
Chrome >= 77
Safari >= 12
iOS >= 11
Firefox >= 70
Edge >= 15
> 5%
not IE 11
```

At the time of doing version `1.0.0`, this had global coverage of **76.89%**.

## Usage

### Browser

Load the script from [unpkg](https://unpkg.com) with:

```
<script src="https://unpkg.com/reqperformer@1.0.8/dist/reqperformer.js"></script>
```

Unfortunately with version 1.0.0, I did something wrong on the Unpkg end, so the shorthand syntax (`https://unpkg.com/reqperformer`) will point to a version that does not work with Unpkg. That's why you should prefer the longhand syntax above.

Or just use it old-school, by downloading the script and referencing it locally if you prefer.

### Frontend SPA (React etc.)

You should be able to import it just fine, presumably with something normal-looking like `import { makeRequest } from 'reqperformer'`. Do a pull request if there is something with the import that's flaky and needs work.

## Tests

None right now.

## Possible future improvements

- Calculate on median values instead?
