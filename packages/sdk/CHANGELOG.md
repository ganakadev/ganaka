## [@ganaka/sdk v1.2.0](https://www.npmjs.com/package/@ganaka/sdk)

Published to npm



### Features

* **RunDrawer, RunsSidebar, dashboardAPI:** add name and tags functionality to runs ([3904579](https://github.com/ganakadev/ganaka/commit/39045797924612c5b780647da8bbca43c9fbcc2c))
* **sdk:** Add name and tags to run creation flow ([8ac8cee](https://github.com/ganakadev/ganaka/commit/8ac8ceef39adaed8b59e6f22b145c902645e34c1))

## [@ganaka/sdk v1.1.0](https://www.npmjs.com/package/@ganaka/sdk)

Published to npm



### Bug Fixes

* **RunDrawer:** update order status messages to include IST conversion and improve clarity ([e2cb8c0](https://github.com/ganakadev/ganaka/commit/e2cb8c075d378d1fbf1a90b8fd6f2b44a4b5ec5b))


### Features

* **Groww:** add NIFTY quote endpoint and related tests ([a4551ff](https://github.com/ganakadev/ganaka/commit/a4551ffa180d25afac1aaa36e5056acf1902d541))
* **RunDrawer:** add dynamic take profit price line and memoize orders ([bf4f19f](https://github.com/ganakadev/ganaka/commit/bf4f19fd083111fe6c6f5b955d73788948aced35))
* **sdk:** Add NIFTY quote callback for sdk ([431024a](https://github.com/ganakadev/ganaka/commit/431024a60d975b7aa36bd37d228b7dc6d7555382))

## [@ganaka/sdk v1.0.3](https://www.npmjs.com/package/@ganaka/sdk)

Published to npm



### Bug Fixes

* **sdk:** update fetchQuoteTimeline to accept date as string in IST format ([580c413](https://github.com/ganakadev/ganaka/commit/580c41386451f471e755494ff94f434c3e4be7b6))

## [@ganaka/sdk v1.0.2](https://www.npmjs.com/package/@ganaka/sdk)

Published to npm



### Bug Fixes

* **candles:** handle nullable start_time and end_time in API response ([72dca1d](https://github.com/ganakadev/ganaka/commit/72dca1d223af5fd30b251a3f4095a6fe547f580e))
* **RunDrawer:** convert candle timestamps to IST format ([bb83ba2](https://github.com/ganakadev/ganaka/commit/bb83ba27d489533ed65ce2c9233c812601016012))
* **sdk:** enhance minute loop timestamp handling and update trading window ([5dc7465](https://github.com/ganakadev/ganaka/commit/5dc7465bd609ea633072bf76efbe3b4cea0c0d89))
* **sdk:** update timestamp handling to string format in IST ([24ef5a9](https://github.com/ganakadev/ganaka/commit/24ef5a9df8ee5ee5c3ecdcbd2af4fdb6e25143ac))

## [@ganaka/sdk v1.0.1](https://www.npmjs.com/package/@ganaka/sdk)

Published to npm



### Bug Fixes

* **MomentumScalping:** Adjust timestamp handling for data fetching ([338bcee](https://github.com/ganakadev/ganaka/commit/338bcee1654093df9ea7568947d312992608f71d))
* **QuoteDrawer:** Correct candle timestamp handling by converting to IST format ([ad25807](https://github.com/ganakadev/ganaka/commit/ad258070ca036e04771671800fa84d620e435d7c))
* **sdk:** Standardize quotes in bundledPackages configuration ([fadc293](https://github.com/ganakadev/ganaka/commit/fadc2934aaff0c38b6208713a4712db8a51f9979))


### Features

* **groww-api:** Add parameter serialization for consistent API requests to Groww API ([1dc4001](https://github.com/ganakadev/ganaka/commit/1dc4001b443a579ff6067779bb5efe0b23f86c71))

## [@ganaka/sdk v1.0.0](https://www.npmjs.com/package/@ganaka/sdk)

Published to npm



### Bug Fixes

* Adjust column width for Target Status in RunDrawer component ([9485174](https://github.com/ganakadev/ganaka/commit/9485174b02249fc3ae9ac708f5fd12f2e17405ef))
* Adjust text styling in RunsSidebar for improved readability ([327e317](https://github.com/ganakadev/ganaka/commit/327e317f1a8d33d93fd5c67acf6f3032f7a92258))
* Correct candle timestamp handling in calculateOrderGainMetrics function ([8dc694e](https://github.com/ganakadev/ganaka/commit/8dc694e2049899ee3ec6f804a8b4f49210599e02))
* Correct expected timestamp in candles test case ([54d8cc1](https://github.com/ganakadev/ganaka/commit/54d8cc1ee0e1df3929ec70efb9a598a7feef719c))
* Correct expected timestamp in shortlist API test ([b76583e](https://github.com/ganakadev/ganaka/commit/b76583e5165f9944c75ca893ce17683188d3c7e5))
* Handle nullable values in market data collection and schema ([646213b](https://github.com/ganakadev/ganaka/commit/646213b1e386e64993436f62ac42ba82ee944936))
* Update button label in RunsSidebar for clarity ([46309cd](https://github.com/ganakadev/ganaka/commit/46309cd5350ce9f8b1b69a7adc90f42fa17b9357))
* Update expected timestamp format in shortlist API test ([8e6290c](https://github.com/ganakadev/ganaka/commit/8e6290ce104cd970bc81fc9c417fb255fce50962))
* Update test results and improve developer test cases ([dbd3b82](https://github.com/ganakadev/ganaka/commit/dbd3b82291abe0fb41e4d708f3f056387158602d))
* Update timestamp in collector API tests for consistency ([6896475](https://github.com/ganakadev/ganaka/commit/6896475461964aa5cbea3f6baf9e5658f03b7e71))


### Features

* Add bulk delete functionality to runs sidebar ([87984f4](https://github.com/ganakadev/ganaka/commit/87984f4bad5e5ac5adc1cdee589e74db8c6fe509))
* Add comprehensive API tests for dashboard endpoints ([18fba9f](https://github.com/ganakadev/ganaka/commit/18fba9f3602e7b38ddbc4f33dc2a7927851f050e))
* Add dynamic take profit price to order metrics and RunDrawer display ([6b4d260](https://github.com/ganakadev/ganaka/commit/6b4d26007bae36b7b6d1891f106e38ba57e6a258))
* Add local run preparation script and update package.json ([114df49](https://github.com/ganakadev/ganaka/commit/114df4962de249b0f3030ad48befbbc7eef60cb1))
* Add price lines support to CandleChart component ([cc9a206](https://github.com/ganakadev/ganaka/commit/cc9a206d88b039abab2f1b48292dc6497aa46d43))
* Add template strategy package with initial setup ([122ff20](https://github.com/ganakadev/ganaka/commit/122ff208b61645567ced70930f68acc4c252a86d))
* Enhance order placement with retry logic and promise support ([3f9a0de](https://github.com/ganakadev/ganaka/commit/3f9a0de01e11a2d4c4b3f06e9cae5bec9cebee3f))
* Enhance RunDrawer and Order interface with target timestamp ([0a01399](https://github.com/ganakadev/ganaka/commit/0a01399be9ff14a47b27176f86fc898af0db5b61))
* Enhance RunDrawer and Order metrics with stop loss analysis ([2bd3a3c](https://github.com/ganakadev/ganaka/commit/2bd3a3c973b6e0816e75bffc0c02bd885d8fc2ea))
* Enhance RunsSidebar with polling and refetching capabilities ([e7769da](https://github.com/ganakadev/ganaka/commit/e7769da0bc3715731897f9544a192eb4fefbd937))
* Implement collector API endpoints for shortlists and quotes ([986b384](https://github.com/ganakadev/ganaka/commit/986b3845b833935c4cfe4364dad9202cc76e871d))
* Implement current timestamp validation in API requests ([61b267a](https://github.com/ganakadev/ganaka/commit/61b267aa3223e7994fe061efc48b8b84e5e9f06f))
* Integrate dayjs for timezone handling and refactor API request structure ([43aa4bb](https://github.com/ganakadev/ganaka/commit/43aa4bb28c685d1569701629b7a362a7266d7472))
* Integrate Playwright for API testing and enhance response handling ([b7fa08a](https://github.com/ganakadev/ganaka/commit/b7fa08a40cc5005bf7f162d5b1c34e65b6c4ca2c))
* Integrate Zod schemas for quote data validation and update dependencies ([3ed609b](https://github.com/ganakadev/ganaka/commit/3ed609b8b27b65acf12d0ddf13298ea945550509))
* Introduce TypeScript definitions for FastifyRequest to include developer and admin properties ([7436677](https://github.com/ganakadev/ganaka/commit/74366778d7962e80c613363ebd4e5faa0e288f52))
* Update StockChart component to handle expanded state ([ea20144](https://github.com/ganakadev/ganaka/commit/ea20144e3e4aa679b87de8d609f82f4a3f4da240))


### Reverts

* Revert "Enhance migration script to ensure idempotency by adding checks for existing types and tables. Updated ENUM and table creation statements to use 'IF NOT EXISTS' for better migration reliability." ([92ee9e8](https://github.com/ganakadev/ganaka/commit/92ee9e8353d89999dfec5339afb0a58ae3949708))

## [1.0.1](https://github.com/workingsignature/ganaka/compare/v1.0.0...v1.0.1) (2025-10-28)


### Bug Fixes

* Simplify prepublishOnly script in package.json by removing test commands to streamline the build process. ([49267e1](https://github.com/workingsignature/ganaka/commit/49267e1facdaca609e73b54c3f458777fc36196a))

# 1.0.0 (2025-10-28)


### Bug Fixes

* Update SDK version from 0.0.1 to 0.0.2 in package.json to reflect the latest changes. ([b897473](https://github.com/workingsignature/ganaka/commit/b897473888c4fa90262180f64b6a786afd919e1b))
