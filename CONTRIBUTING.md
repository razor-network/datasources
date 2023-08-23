
# Contributing to Razor Network Datasources
If you wish to propose a new price feed to be added to the datasources used by the protocol, please follow the steps below:

1. Start by forking the repository and creating your branch from `master`.
2. Add the new job to `mainnet/jobs.json` and update `mainnet/collections.json` as needed with the correct jobIDs. (an example for `testnet` is given below)
    - For example, adding a new `ETH/USD` job to an existing collection for testnet:
```json
[
  {
    "weight": 1,
    "power": 2,
    "selectorType": 0,
    "name": "ethusd_gemini",
    "selector": "last",
    "url": "https://api.gemini.com/v1/pubticker/ethusd"
  },
  ... ( 8 other entries here) ...,
  {
    "weight": 1,
    "power": 2,
    "selectorType": 0,
    "name": "ethusd_test",
    "selector": "selector[0]",
    "url": "https://www.example.com/"
  }
]
```
Now to include this new job into an existing collection in `testnet/collections.json` we need to add the serialized jobID to the desired collection. In this case we are adding `ETH/USD` job to the existing `ethCollectionMedian` collection:

```json
[
  {
    "jobIDs": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // 10 is added here which is the jobId of the new  ethusd_test job
    "aggregationMethod": 2,
    "power": 2,
    "name": "ethCollectionMedian",
    "tolerance": 500000
  },
  ... (other collections here) ...,
]
```
_Note: *jobIds are serialized*_

- For example, adding a new `ETHUSD` collection for testnet, here we update the jobs required for the new collection:

```json
[
  ... (10 other entries here) ...,
  {
    "weight": 1,
    "power": 2,
    "selectorType": 0,
    "name": "ethusd_test1",
    "selector": "selector[0]",
    "url": "https://www.example.com/1"
  },
  {
    "weight": 1,
    "power": 2,
    "selectorType": 0,
    "name": "ethusd_test2",
    "selector": "selector[0]",
    "url": "https://www.example.com/2"
  },
  {
    "weight": 1,
    "power": 2,
    "selectorType": 0,
    "name": "ethusd_test3",
    "selector": "selector[0]",
    "url": "https://www.example.com/3"
  },
]
```

_Note: *new jobs are always appended to the end of the jobs.json*_

Now to add these jobs to a new collection, the corresponding `testnet/collections.json`:

```json
[
     ... (other collections here) ...,
  {
    "jobIDs": [11, 12, 13], // new jobIds added to jobs.json
    "aggregationMethod": 2,
    "power": 2,
    "name": "ETHUSD",
    "tolerance": 500000
  },
]
```

3. Execute the test suite using the command `npm run test`. It's crucial to ensure all tests pass. Additionally, please confirm that your code is properly formatted and aligns with the existing style guide.
4. Issue a pull request (PR) to the upstream master branch.
5. The proposed changes will be available for community discussion and review in GitHub discussions. Community members are welcome to provide feedback and votes on the proposal.



