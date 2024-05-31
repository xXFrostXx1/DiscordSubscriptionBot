require('dotenv').config();
const axios = require('axios');
const prompt = require('prompt-sync')({ sigint: true });

async function initiatePayment() {
  try {
    console.log("Available payment methods: 1. Credit Card, 2. PayPal");
    const paymentMethod = prompt("Please choose your payment method (Enter 1 for Credit Card or 2 for PayPal): ");
    const amount = prompt("Enter the amount you wish to pay: ");

    if (isNaN(amount) || amount <= 0) throw new Error("Invalid amount");
    if (paymentMethod !== '1' && paymentConfig !== '2') throw new Error("Invalid payment method");
    
    const paymentRequest = {
      method: paymentMethod === '1' ? 'Credit Card' : 'PayPal',
      amount: parseFloat(amount),
    };

    const response = await axios.post(`${process.env.BACKEND_API_URL}/create-payment`, paymentRequest);

    if (response.data && response.data.success) {
      console.log(`Payment initiated successfully. Please follow these instructions: ${response.data.instructions}`);
    } else {
      throw new Error("Failed to initiate payment");
    }
  } catch (error) {
    console.error(`Error initiating payment: ${error.message}`);
  }
}

initiatePayment();