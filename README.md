# MetaMiles

Please do visit our [docs](https://smits-organization-1.gitbook.io/metamiles)


![Screenshot from 2025-07-03 21-07-57](https://github.com/user-attachments/assets/8b863218-18b6-449f-ac1f-18d50c19b837)

---

## Introduction

As MetaMask Card brings crypto spending to the real world, users need more than just payments — they need a **smart, rewarding experience** built around how and where they spend.

**MetaMiles** is a modular, onchain rewards engine designed to turn every MetaMask Card transaction into meaningful perks, insights, and status. Whether it’s unlocking event tickets, food discounts, or NFT-based merchandise, MetaMiles transforms proof of spend into real-world value.

Built for MetaMask Card users, MetaMiles enables:

 **Spending Analytics** – Track and visualize your card payments with real-time dashboards
 **Tiered Rewards** – Progress through Bronze, Silver, and Gold tiers based on monthly card spend
 **Perk Unlocks** – Get token-gated access to localized drops, discounts, and exclusive events
 **Cross-Chain Flexibility** – Thanks to **LI.FI SDK** and **Circle CCTP**, users can bridge rewards and redeem perks across chains effortlessly

All rewards are claimable via a smooth, gas-efficient onchain flow — and optional **zero-knowledge proofs** ensure users can prove eligibility (e.g., "I spent \$500 this month") **without revealing full payment data**, preserving flexibility and privacy where needed.

---


##  Meet James – Just Another Crypto User... Until MetaMiles

James is your typical Web3 native. He buys NFTs, swaps tokens, earns yield in DeFi. But when it comes to everyday spending — groceries, coffee, concert tickets — it's always the same: money goes out… and that's it.

### Then James Gets the MetaMask Card.

It’s sleek. It connects directly to his MetaMask wallet.
**And with MetaMiles, something amazing happens:**

 **Every swipe becomes a gateway to something more.**

*  James spends \$200 on flight tickets → He unlocks early access to a music festival
* He grabs coffee every morning → MetaMiles gives him discounts at his favorite café
* He shops online for a gift → Boom, he earns exclusive DAO merch

###  And the Best Part?

He never shares private data.
MetaMiles uses **Zero-Knowledge Proofs** — so James can prove he spent over a threshold like **\$500** without showing a single transaction.

 No forms
 No tracking
Just verified, private, onchain proof that unlocks perks

---

##  One Month Later…

James gets a ping from MetaMiles:

> “You’ve hit **Gold Tier!**
> Claim your bonus airdrop + 25% off your next event ticket.”

He smiles.
For the first time, his everyday spending is **rewarding him in the real world** — without selling his soul to ads, apps, or middlemen.

---

##  What James Found in MetaMiles:

 **Real-world rewards** for onchain users
**Privacy by default**
**Perks tailored to his lifestyle and location**

A system that speaks Web3 — no banks, no nonsense

Now James tells every crypto friend:

> **“If you’re using MetaMask, and not using the card with MetaMiles…
> you’re literally leaving rewards on the table.”**


---

## **User Flow – MetaMiles Spend-to-Reward Journey**

### 1. Onboarding

* User visits the MetaMiles dApp
* Connects MetaMask Wallet via MetaMask SDK
* Verifies MetaMask Card ownership using a signed message
* Optionally enrolls in Circle Wallet for reward custody or delivery

### 2. Spending & Tracking

* User makes purchases using the MetaMask Card
* Spend data is securely retrieved via Chainlink Functions
* An on-chain SpendTracker Contract is updated with the total spend amount
* No transaction-level data is stored on-chain, preserving privacy

### 3. Proof Generation (Zero-Knowledge)

* User opens the MetaMiles dApp to claim eligible rewards
* A zero-knowledge circuit runs locally in the browser

  * Example: “Prove I’ve spent more than \$X this month”
* A ZK-SNARK proof is generated using the user’s pseudonymous identity
* The proof is submitted on-chain to the ZKVerifier Contract

### 4. Reward Unlock

* The ZKVerifier smart contract confirms the proof is valid
* A Soulbound NFT is minted to represent the user’s current tier (Bronze, Silver, Gold)
* Based on the tier, users gain access to:

  * Token-gated event ticketing
  * Real-world discounts (via QR/NFC or digital pass)
  * Exclusive merch, airdrops, or DAO perks

### 5. Cross-Chain and Custody

* If a reward exists on a different chain:

  * The LI.FI SDK is used to bridge rewards cross-chain
  * Circle’s CCTP V2 facilitates secure asset transfer
* Reward is delivered to the user’s preferred destination chain 

### 6. Ongoing Use

* Spend tracking resets monthly (or on a rolling basis)
* Users repeat the cycle: spend → prove → unlock
* The MetaMiles dashboard displays:

  * Tier progress
  * Claimable rewards
  * Reward history and streaks

---

## **Partner Flow – How Brands, DAOs, and Events Integrate**

### 1. Partner Onboarding

* Partner (brand, DAO, festival, e-commerce platform) visits the **MetaMiles Partner Portal**
* Registers as a verified reward provider
* Sets up organization profile, including region, category, and contact details

### 2. Perk Configuration

* Partner defines region-specific and tier-based rewards

  * Example: “Users in NYC who spend \$200+ unlock a backstage concert pass”
* Uploads reward inventory:

  * NFT reward tokens
  * NFC/QR unlock codes for in-person experiences
  * Airdrops, merch coupons, or gated Discord invites
* Sets eligibility thresholds and maps to reward tiers: Bronze / Silver / Gold

### 3. Integration & Monitoring

* Uses **MetaMiles SDK** or **Reward API** to:

  * Validate wallet tier and region eligibility
  * Programmatically issue or mint rewards
  * Track redemptions, availability, and user interaction

### 4. Cross-Chain Ready

* Rewards can be distributed across chains using:

  * **LI.FI SDK** 
  * **Circle CCTP v2** 
* Ensures seamless user experience regardless of user chain preferences

### 5. Insights & Loyalty Analytics

* Access to the **Partner Dashboard** for ongoing intelligence:

  * Engagement data by region, time, and tier
  * Most redeemed rewards and user retention stats
  * Redemption conversion funnel
* Future loyalty extensions:

  * Trigger additional perks for Gold-tier streaks
  * Airdrop collectibles for highly engaged users
  * Enable DAO governance access based on spend-tier NFTs

---


##  **Scalability & Future Roadmap**

### **Phase 1: Launch & Core Platform**

**Timeline:** *July 3 – August 31, 2025*

* MetaMiles v1 launches with MetaMask Card spend tracking
* ZK proof system operational for private spend verification
* Tier-based IRL reward system live (Bronze/Silver/Gold NFTs)
* Initial brand/DAO partners integrated in pilot cities

---

### **Phase 2: Localized Campaigns**

**Timeline:** *September 1 – October 15, 2025*

* Regional event-based campaigns go live:

  * “**OnChain Diwali**” with Indian merchants
  * “**NYC Art Week**” with art-based NFTs and IRL tickets
* Time zone-aware and merchant-specific reward logic enabled
* Launch regionalized UI/UX flows

---

### **Phase 3: Merchant & DAO Expansion**

**Timeline:** *October 16 – December 15, 2025*

* Self-serve **Partner Dashboard** launches
* Open onboarding for:

  * Local merchants, stores, cafes
  * DAOs offering gated perks or regional rewards
* Insights dashboard for partners:

  * Redemption metrics, top-tier earners, campaign ROI

---

### **Phase 4: Advanced Rewards & Loyalty Mechanics**

**Timeline:** *December 16, 2025 – February 28, 2026*

* Introduce **staking-based multipliers**: stake USDC/ETH to boost spend rewards
* Launch **Loyalty Badges** (Soulbound NFTs) as proof-of-spend collectibles
* Soulbound perks:

  * Lifetime discounts
  * Discord roles
  * VIP access to events

---

### **Phase 5: Developer SDK + Ecosystem Tools**

**Timeline:** *March 1 – May 30, 2026*

* Release **MetaMiles SDK** for:

  * eCommerce platforms
  * Ticketing sites
  * Wallet apps
* Enable token-gated checkout buttons, claim flows, and campaign automation
* Public APIs for:

  * Reward inventory upload
  * Region + tier logic configuration
  * User verification & claiming

---




