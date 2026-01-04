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
