# Rewards-endpoints

## Getting Started

### Prerequisites
Make sure you have the following software installed on your machine:


- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)


### Installation

1. Clone the repository:

```bash
git clone https://github.com/ylakeah/Rewards-endpoints
```


### Navigate to the project directory:

```bash
cd rewards-enpooints
```
### Install dependencies:

```bash
npm install
```
### Usage
### Generate Weekly Rewards
To generate weekly rewards for a user, make a GET request to the following endpoint:

http
```bash
GET /users/:userId/rewards?at=:date
```
- :userId: User ID for whom rewards are generated.
- :date: Date in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ) for the week starting from that date.

Example:

```bash
GET /users/1/rewards?at=2020-03-19T12:00:00Z
```

### Redeem Rewards
To redeem a reward for a user, make a PATCH request to the following endpoint:

```bash
PATCH /users/:userId/rewards/:date/redeem
```
- :userId: User ID for whom the reward is redeemed.
- :date: Date in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ) of the available reward.

Example:

```bash
PATCH /users/1/rewards/2020-03-18T00:00:00Z/redeem
```


### Testing
This project uses Jest for unit testing. Run the tests with the following command:

```bash
npm test
```

