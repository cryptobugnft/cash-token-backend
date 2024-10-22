// Import mainnet-js to handle wallet and token transfers
const { Wallet } = require('mainnet-js');

// Serverless function to handle token claims
module.exports = async (req, res) => {
  const { walletAddress, tokenId } = req.query;

  if (!walletAddress || !tokenId) {
    return res.status(400).send('Missing wallet address or token ID');
  }

  try {
    // Load the sponsor wallet from environment variables (you'll set this in Vercel)
    const sponsorMnemonic = process.env.SPONSOR_MNEMONIC;
    const sponsorWallet = await Wallet.fromMnemonic(sponsorMnemonic);

    // Define the amount of tokens to send (e.g., 10 tokens per claim)
    const tokenAmount = 10;

    // Send tokens to the claimant's wallet
    const txId = await sponsorWallet.token.send({
      tokenId: tokenId,
      to: walletAddress,
      amount: tokenAmount,
    });

    // Respond with the transaction ID
    res.status(200).send(`Token claimed successfully! Transaction ID: ${txId}`);
  } catch (error) {
    console.error('Error processing claim:', error);
    res.status(500).send(`Error processing claim: ${error.message}`);
  }
};
