# Mobox Front Running Bot

## Description

This project is a bot designed to front-run transactions on the Binance Smart Chain (BSC) to profit from arbitrage opportunities in the Mobox ecosystem. It monitors the mempool for pending transactions and strategically places buy and sell orders to capitalize on price discrepancies.

## Features

-   **Real-time Mempool Monitoring:** Continuously scans the BSC mempool for relevant transactions.
-   **Arbitrage Strategy:** Implements a sophisticated arbitrage strategy to identify and exploit profitable opportunities.
-   **Automated Trading:** Automatically executes trades based on predefined parameters and market conditions.
-   **Gas Optimization:** Optimizes gas usage to minimize transaction costs and maximize profits.
-   **Configurable Parameters:** Allows users to customize various parameters, such as slippage tolerance, gas prices, and trading amounts.
-   **Upgradeable Contracts:** Uses upgradeable smart contracts for future improvements and feature additions.

## Getting Started

### Prerequisites

-   Node.js (version >= 16)
-   Bun (version >= 1.0)
-   Git
-   Metamask or other web3 provider

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Kay-79/be-mobox-front-run.git
    cd be-mobox-front-run
    ```

2. Install dependencies:

    ```bash
    bun install
    ```

3. Configure environment variables:

    - Create a `.env` file based on the `.env.example` file.
    - Set the necessary environment variables, such as:
        - `PRIVATE_KEY`: Your private key for signing transactions.
        - `RPC_URL`: The RPC URL for the Binance Smart Chain.
        - `CONTRACT_ADDRESS`: The address of the Mobox contract.

4. Configure the bot:

    - Modify the configuration files in the `src/config` directory to suit your specific needs.

## Usage

1. Start the bot:

    ```bash
    make all
    ```

    or for windows

    ```bash
    make allWin
    ```

2. Monitor the bot's performance and adjust the configuration as needed.

## Contracts

The project includes the following smart contracts:

-   `Bid.sol`: Handles bidding on Mobox auctions.
-   `BidUpgradeable.sol`: An upgradeable version of the `Bid.sol` contract.
-   `Lock.sol`: Implements a locking mechanism for tokens.
-   `TokenTest.sol`: A test token contract.
-   `Wallet.sol`: A wallet contract for managing funds.

## Achievements (as of November 2024)

-   Sent over 100,000 transactions on the Binance Smart Chain.
-   Burned around $11,800 in gas fees.
-   Generated around $10,271 in profit.
-   Address list:

    ```
    0x11119d51e2ff85d5353abf499fe63be3344c0000
    0x55555d4de8df0c455c2ff368253388fe669a8888
    0x77775a358050DE851b06603864FbD380637C7777
    0xf60f9f7d06adcbc2237df5fb8dcb3a27fe13096c
    0x4444eA3CeBBD866c19F7769aA260E02B5D561111
    0x444430ba89a0741902253756d009213ba1151111
    0x666685e40D852fa173136Ef77A16142431Cc7777
    0x7979eEe1c01eab29d812c19e5d1235e1C7d24956
    0x1111c16591c4ECe1c313f46A63330D8BCf461111
    ```

## Contributing

If you have suggestions or would like to contribute to the project, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENCE` file for details.
