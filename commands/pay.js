require('dotenv').config();
const axios = require('axios');
const promptSync = require('prompt-sync')({ sigint: true });

const promptPaymentMethodAsync = async () => {
  console.log("Available payment methods: 1. Credit Card, 2. PayPal");
  let method;
  do {
    method = promptSync("Please choose your payment method (Enter 1 for Credit Card or 2 for PayPal): ");
  } while (method !== '1' && method !== '2');
  return method === '1' ? 'Credit Card' : 'PayPal';
}

const promptPaymentAmountAsync = async () => {
  let amount;
  do {
    amount = promptSync("Enter the amount you wish to pay: ");
  } while (isNaN(amount) || amount <= 0);
  return parseFloat(amount);
}

const submitPayment = async (paymentInformation) => {
  try {
    const response = await axios.post(`${process.env.BACKEND_API_URL}/create-payment`, paymentInformation);
    if (response.data && response.data.success) {
      console.log(`Payment processed successfully. Please follow these instructions: ${response.data.instructions}`);
    } else {
      console.error("Failed to process payment");
    }
  } catch (error) {
    console.error(`Error processing payment: ${error.message}`);
  }
}

const initiatePaymentProcess = async () => {
  try {
    const chosenPaymentMethod = await promptPaymentMethodAsync();
    const paymentAmount = await promptPaymentAmountAsync();

    const paymentInformation = {
      method: chosenPaymentMethod,
      amount: paymentAmount,
    };

    await submitPayment(paymentInformation);
  } catch (paymentError) {
    console.error(`Error: ${paymentError.message}`);
  }
};

initiatePaymentProcess();