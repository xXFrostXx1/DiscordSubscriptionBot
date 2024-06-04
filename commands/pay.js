require('dotenv').config();
const axios = require('axios');
const getUserInput = require('prompt-sync')({ sigint: true });

function promptPaymentMethod() {
  console.log("Available payment methods: 1. Credit Card, 2. PayPal");
  let method = getUserInput("Please choose your payment method (Enter 1 for Credit Card or 2 for PayPal): ");
  if (method !== '1' && method !== '2') throw new Error("Invalid payment method");
  return method === '1' ? 'Credit Card' : 'PayPal';
}

function promptPaymentAmount() {
  let amount = getUserInput("Enter the amount you wish to pay: ");
  if (isNaN(amount) || amount <= 0) throw new Error("Invalid amount");
  return parseFloat(amount);
}

async function submitPayment(paymentInformation) {
  const response = await axios.post(`${process.env.BACKEND_API_URL}/create-payment`, paymentInformation);
  if (response.data && response.data.success) {
    console.log(`Payment processed successfully. Please follow these instructions: ${response.data.instructions}`);
  } else {
    throw new Error("Failed to process payment");
  }
}

async function initiatePaymentProcess() {
  try {
    const chosenPaymentMethod = promptPaymentMethod();
    const paymentAmount = promptPaymentAmount();

    const paymentInformation = {
      method: chosenPaymentMethod,
      amount: paymentAmount,
    };

    await submitPayment(paymentInformation);
  } catch (paymentError) {
    console.error(`Error processing payment: ${paymentError.message}`);
  }
}

initiatePaymentProcess();