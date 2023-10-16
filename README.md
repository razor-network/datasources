# Razor Network Datasources Repository
Welcome to the Razor Network Datasources repository! This repository contains the job configurations and collections for the price feeds used by the Razor Network protocol.

# About Razor Network Datasources
Razor Network leverages decentralized oracle solutions to obtain data from various sources. This repository serves as a central hub for the job configurations used by the protocol to fetch data and the collections that bundle multiple job outputs.

## Directory Structure
- `mainnet/jobs.json`: Contains job configurations for the main network.
- `mainnet/collections.json`: Contains collections which group multiple jobs for the main network.

_Note: The example given in the contributing guide is for testnet, but the structure for mainnet is similar._
## How to Use
If you're a developer or a data provider looking to understand or contribute to the data sources, here's how to get started:

1. Familiarize yourself with the parameters for both jobs and collections. They are detailed in the contributing guide.
2. Follow the steps mentioned in the [contributing guide](CONTRIBUTING.md) if you wish to propose a new price feed.
### Key Parameters
#### Job Parameters
- `weight`: Significance of each job's output.
- `power`: Fine-tunes the decimal precision of results.
- `selectorType`: Determines how the response from the URL should be parsed.
- `name`: Identifier for the job.
- `selector`: Specific pattern for extracting data depending on the _selectorType_.
- `url`: Source URL to fetch data from.
#### Collection Parameters
- `jobIDs`: Array of serialized job IDs in the collection from jobs.json.
- `aggregationMethod`: Technique adopted to consolidate data.
- `power`: Extent of decimal shifts applied.
- `name`: Identifier for the collection.
- `tolerance`: Acceptable variance from the network-reported value.

## Contribute
Interested in contributing to Razor Network Datasources? Follow the steps and guidelines provided in the [Contributing Guide](CONTRIBUTING.md).

## Community
Community discussion and feedback play a vital role in shaping the Razor Network protocol. Once a new price feed is proposed, the changes will be open for discussion on [GitHub](https://github.com/razor-network/governance/discussions). Community members can engage, provide feedback, and vote on the proposal.

We thank everyone who takes the time to contribute and shape the future of Razor Network! If you have questions or need further assistance, please raise an issue or join our community chat. 