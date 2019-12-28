/**
 * MakeRequest is a class that lets you easily do
 * testing of network/endpoint request performance and
 * output it to an HTML table.
 *
 * @class MakeRequest
 */
export class MakeRequest {
  /**
   * Creates an instance of MakeRequest.
   * @param {number} [requestCount=5] - How many times your want the test to be run per test case
   * @param {boolean} [doWarmupCall=false] - Run a first, unlisted call to warm up the test function
   * @param {string} [mountingDivClassName=`Tables`] - The name of the DIV in which you want to mount the test's output tables
   * @param {string} [tableNamePrefix=`Table`] - The prefix for your testing output tables
   * @param {string} [tableElementTemplate=`<table class="{{TABLE_NAME}}"></table>`] - Template for the boundary of the table
   * @param {string} [tableHeaderFieldTemplate=`<tr><th>{{URL}}</th></tr>`] - Template for the table headers
   * @param {string} [tableRequestFieldTemplate=`<tr>
   * 						<td>{{REQUEST_TIME_STRING}}</td>
   * 					</tr>`] - Template for the tables' individual request fields
   * @param {string} [tableRequestTimingFieldTemplate=`<tr>
   * 						<td><strong>{{AVERAGE_RESP_TIME}}</strong></td>
   * 					</tr>`] - Template for the tables' average timing fields
   * @memberof MakeRequest
   */
  constructor(
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
  ) {
    this.requestCount = requestCount;
    this.doWarmupCall = doWarmupCall;
    this.mountingDivClassName = mountingDivClassName;
    this.tableNamePrefix = tableNamePrefix;
    this.tableElementTemplate = tableElementTemplate;
    this.tableHeaderFieldTemplate = tableHeaderFieldTemplate;
    this.tableRequestFieldTemplate = tableRequestFieldTemplate;
    this.tableRequestTimingFieldTemplate = tableRequestTimingFieldTemplate;
  }

  /**
   * Run every test in the incoming array through the testing method, runTest()
   *
   * @param {{url: String, body: Object}[]} tests
   * @returns {Void}
   * @memberof MakeRequest
   */
  async runTests(tests) {
    let doTestRun = true;

    if (this.requestCount >= 25 && this.requestCount <= 100) {
      alert(
        "You are doing a lot of tests... Be courteous while doing your requests and don't overload other people's resources!\n\nTest will continue."
      );
    }

    if (this.requestCount > 100) {
      alert(
        "You are doing over 100 requests. This cap exists to prevent over-using it on other people's resources. If you really need to lift the cap, make sure you only target your own resources. You will also have to remove the cap from the source code.\n\nTest will abort."
      );
      doTestRun = false;
    }

    if (doTestRun) {
      for (let test in tests) {
        await this._runTest(tests[test]);
      }
    }
  }

  /**
   * Run the actual test on a single endpoint with configurable options block
   *
   * @param {string} url
   * @param {Object} [body={}]
   * @returns {Void}
   * @memberof MakeRequest
   */
  async _runTest({ url, body = null }) {
    if (!url) {
      console.error('Missing URL');
      return false;
    }

    // Set automatic number based on number of tables found
    // NOTE: This will probably mess things up for you if you use tables for something else on the same page!
    const TABLE_NUMBER = 1 + document.querySelectorAll('table').length;

    // Create the table for this test run
    const TABLE = this._createTablePartition(url, TABLE_NUMBER);

    // Create an empty array to collect results
    let results = [];

    // Do a loop, requesting the data
    for (
      let requestCount = this.doWarmupCall ? -1 : 0;
      requestCount++, requestCount <= this.requestCount;

    ) {
      let timeStart = performance.now();

      await this._requestData(url, {
        method: body ? 'POST' : 'GET',
        body: body ? JSON.stringify(body) : null
      });

      let timeStop = performance.now();

      if (requestCount === 0) {
        console.log('Doing warmup call for first request...');
      } else {
        const REQUEST_TIME_MS = Math.round(timeStop - timeStart);
        results.push(REQUEST_TIME_MS);
        const REQUEST_TIME_STRING = `${REQUEST_TIME_MS} ms`;

        const REQUEST_FIELD_HTML = this.tableRequestFieldTemplate.replace(
          '{{REQUEST_TIME_STRING}}',
          `${REQUEST_TIME_STRING}`
        );

        TABLE.innerHTML += REQUEST_FIELD_HTML;
      }
    }

    // Calculate average response time
    const AVERAGE_RESP_TIME = this._averageResults(results);

    const AVERAGE_RESP_TIME_FIELD = this.tableRequestTimingFieldTemplate.replace(
      '{{AVERAGE_RESP_TIME}}',
      `${AVERAGE_RESP_TIME}`
    );

    TABLE.innerHTML += AVERAGE_RESP_TIME_FIELD;
  }

  /**
   * Request data by using Fetch.
   * Do regular JSON body content extraction and send it back,
   * else send error if something went wrong
   *
   * @param {string} url
   * @param {Object} options
   * @returns {Object|Error}
   * @memberof MakeRequest
   */
  async _requestData(url, options) {
    return await fetch(url, options)
      .then(res => res.json())
      .catch(error => {
        console.error(error);
        return error;
      });
  }

  /**
   * Create a new HTML table within the main mounting DIV
   *
   * @param {string} url
   * @param {number} tableNumber
   * @returns {Element}
   * @memberof MakeRequest
   */
  _createTablePartition(url, tableNumber) {
    const TABLES = document.querySelector(`.${this.mountingDivClassName}`);

    const TABLE_NAME = `${this.tableNamePrefix}-${tableNumber}`;

    const TABLE_HTML = this.tableElementTemplate.replace('{{TABLE_NAME}}', `${TABLE_NAME}`);
    TABLES.innerHTML += TABLE_HTML;

    const TABLE = document.querySelector(`.${TABLE_NAME}`);
    TABLE.innerHTML += this.tableHeaderFieldTemplate.replace('{{URL}}', `${url}`);

    return TABLE;
  }

  /**
   * Average the results of all non-warmup calls
   *
   * @param {Number[]} results
   * @returns {string}
   * @memberof MakeRequest
   */
  _averageResults(results) {
    let count = 0;

    for (let result in results) {
      count += results[result];
    }

    const AVERAGE_TIME = (count / results.length).toFixed(2);

    return `Average: ${AVERAGE_TIME} ms`;
  }
}
