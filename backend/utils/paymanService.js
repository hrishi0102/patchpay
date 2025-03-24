// utils/paymanService.js
//Test Payees and wallets

const { decryptData } = require('./encryption');
const Payman = require('paymanai');

// Create a PaymanAI client with the company's API key
const createPaymanClient = async (encryptedApiKey) => {
  try {
    const apiKey = decryptData(JSON.parse(encryptedApiKey));
    
    return new Payman({
      xPaymanAPISecret: apiKey
    });
  } catch (error) {
    console.error('Error creating Payman client:', error);
    throw new Error('Failed to initialize Payman client');
  }
};

// Create a payee (researcher)
const createPayee = async (paymanClient, researcherData) => {
  try {
    const payee = await paymanClient.payments.createPayee({
      type: "TEST_RAILS",
      name: researcherData.name,
      tags: ["researcher"]
    });
    return payee;
  } catch (error) {
    console.error('Error creating Payman payee:', error);
    throw new Error('Failed to create payee in Payman');
  }
};

// Send payment to a researcher
const sendPayment = async (paymanClient, paymentData) => {
  try {
    const payment = await paymanClient.payments.sendPayment({
      amountDecimal: paymentData.amount,
      payeeId: paymentData.payeeId,
      memo: paymentData.memo || "Bug bounty payment",
      metadata: paymentData.metadata || {}
    });
    
    return payment;
  } catch (error) {
    console.error('Error sending Payman payment:', error);
    throw new Error('Failed to send payment through Payman');
  }
};

// Search all payees (researchers)
const searchPayees = async (paymanClient) => {
  try {
    const payees = await paymanClient.payments.searchPayees();
    return payees;
  } catch (error) {
    console.error('Error searching Payman payees:', error);
    throw new Error('Failed to search payees in Payman');
  }
};

// Check company wallet balance
const getBalance = async (paymanClient, currency = "TSD") => {
  try {
    const balance = await paymanClient.balances.getSpendableBalance(currency);
    return balance;
  } catch (error) {
    console.error('Error checking Payman balance:', error);
    throw new Error('Failed to check balance in Payman');
  }
};

module.exports = {
  createPaymanClient,
  createPayee,
  sendPayment,
  getBalance
};