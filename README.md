# Fantasy Sports Platform on Internet Computer Protocol (ICP)

A decentralized fantasy sports platform similar to Dream 11, built on the Internet Computer Protocol (ICP) blockchain. This platform enables users to create fantasy teams, participate in contests, and win rewards in a transparent and verifiable manner.

## 🏆 Features

### Core Features
- **Multi-Sport Support**: Cricket, Football, Basketball, Tennis
- **Decentralized Identity**: Internet Identity integration for secure authentication
- **Real-time Scoring**: Live player statistics and fantasy points calculation
- **Multiple Contest Types**: Head-to-Head, Multi-player, Guaranteed, Winner Takes All
- **Transparent Rewards**: Blockchain-based prize distribution
- **KYC Integration**: User verification system
- **Notification System**: Real-time updates and alerts

### Advanced Features
- **Captain/Vice-Captain System**: 2x and 1.5x point multipliers
- **Dynamic Pricing**: Player prices based on performance
- **Tournament Management**: Complete tournament and match lifecycle
- **Leaderboards**: Real-time rankings and statistics
- **Transaction History**: Complete audit trail of all transactions

## 🏗️ Architecture

### Canister Structure

The platform is built using multiple specialized canisters:

```
src/backend/
├── shared_types/          # Common data structures and types
├── user_management/       # User profiles, authentication, KYC
├── tournament/           # Tournament and match management
├── team_management/      # Player pools and fantasy team creation
├── contest/             # Contest creation and entry management
├── scoring/             # Real-time scoring and statistics
└── rewards/             # Prize distribution and token management
```

### Canister Responsibilities

#### 1. **User Management Canister**
- User registration and profile management
- KYC status management
- Balance management (tokens)
- Notification system
- User authentication

#### 2. **Tournament Canister**
- Tournament creation and management
- Match scheduling and updates
- Team registration
- Tournament status tracking

#### 3. **Team Management Canister**
- Player database management
- Fantasy team creation and validation
- Team composition rules enforcement
- Player statistics tracking

#### 4. **Contest Canister**
- Contest creation with different types
- Entry management and validation
- Contest status tracking
- Leaderboard generation

#### 5. **Scoring Canister**
- Real-time player statistics
- Fantasy points calculation
- Sport-specific scoring rules
- Captain/vice-captain multipliers

#### 6. **Rewards Canister**
- Prize pool management
- Reward distribution
- Transaction history
- Bonus and promotional rewards

## 🚀 Getting Started

### Prerequisites
- DFX (Internet Computer SDK)
- Rust and Cargo
- Node.js (for frontend development)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd stake
```

2. **Install dependencies**
```bash
npm install
```

3. **Start local replica**
```bash
dfx start --background
```

4. **Deploy canisters**
```bash
dfx deploy
```

5. **Initialize canisters**
```bash
# Initialize user management with admin principal
dfx canister call user_management init '(record { admin_principal = principal "your-admin-principal" })'

# Initialize other canisters
dfx canister call tournament init
dfx canister call team_management init
dfx canister call contest init
dfx canister call scoring init
dfx canister call rewards init
```

### Development

1. **Build the project**
```bash
dfx build
```

2. **Run tests**
```bash
cargo test
```

3. **Start frontend development server**
```bash
npm start
```

## 📊 Data Flow

### User Journey
1. **Registration**: User registers with Internet Identity
2. **KYC**: User completes KYC verification
3. **Team Creation**: User creates fantasy team for upcoming match
4. **Contest Entry**: User joins contests with entry fee
5. **Live Scoring**: Real-time points calculation during match
6. **Results**: Contest finalization and ranking
7. **Rewards**: Prize distribution to winners

### Contest Lifecycle
1. **Creation**: Admin creates contest with prize pool
2. **Open**: Contest accepts entries
3. **Full**: Contest reaches maximum participants
4. **Live**: Match starts, scoring begins
5. **Completed**: Match ends, results calculated
6. **Rewards**: Prizes distributed to winners

## 🎯 Use Cases

### For Users
- **Fantasy Sports**: Create teams and compete in contests
- **Real-time Engagement**: Follow live matches with fantasy points
- **Social Gaming**: Compete with friends and other users
- **Rewards**: Win prizes based on performance
- **Transparency**: Verifiable results and fair play

### For Platform
- **Decentralized**: No single point of failure
- **Transparent**: All transactions on blockchain
- **Scalable**: Can handle multiple sports and tournaments
- **Secure**: Internet Identity for authentication
- **Fair**: Automated scoring and reward distribution

## 🔧 Configuration

### Environment Variables
```bash
DFX_NETWORK=local  # or 'ic' for mainnet
```

### Canister Configuration
- Each canister can be configured independently
- Memory management for stable storage
- Upgrade capabilities for future improvements

## 📈 Performance

### Scalability
- Horizontal scaling with multiple canisters
- Efficient data structures for large datasets
- Optimized queries for real-time updates

### Security
- Internet Identity for secure authentication
- Canister-level access control
- Immutable transaction history

## 🛠️ Development

### Adding New Sports
1. Update `shared_types` with new sport enum
2. Add sport-specific scoring rules in `scoring` canister
3. Update player positions and statistics
4. Test with sample data

### Adding New Contest Types
1. Define new contest type in `shared_types`
2. Implement logic in `contest` canister
3. Update prize distribution rules
4. Add frontend support

### Custom Scoring Rules
1. Modify scoring rules in `scoring` canister
2. Update point calculation logic
3. Test with different scenarios
4. Deploy updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Join the community discussions

## 🔮 Future Enhancements

- **Mobile App**: Native mobile applications
- **AI Predictions**: Machine learning for player performance
- **Social Features**: Chat, leagues, and friend challenges
- **NFT Integration**: Player cards as NFTs
- **Cross-chain**: Integration with other blockchains
- **Advanced Analytics**: Detailed statistics and insights

---

**Built with ❤️ on Internet Computer Protocol**
