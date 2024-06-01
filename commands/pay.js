require('dotenv').config();
const axios = require('axios');
const getUserInput = require('prompt-sync')({ sigint: true });

async function processPayment() { 
  try {
    console.log("Available payment methods: 1. Credit Card, 2. PayPal");
    const selectedPaymentMethod = getUserInput("Please choose your payment method (Enter 1 for Credit Card or 2 for PayPal): "); 
    const paymentAmount = getUserInput("Enter the amount you wish to pay: "); 

    if (isNaN(paymentAmount) || paymentAmount <= 0) throw new Error("Invalid amount");
    if (selectedPaymentMethod !== '1' && selectedPaymentMethod !== '2') throw new Error("Invalid payment method"); 
    
    const paymentDetails = { 
      method: selectedPaymentMethod === '1' ? 'Credit Card' : 'PayPal',
      amount: parseFloat(paymentAmount),
    };

    const paymentResponse = await axios.post(`${process.env.BACKEND_API_URL}/create-payment`, paymentDetails); 

    if (paymentResponse.data && paymentResponse.data.success) {
      console.log(`Payment processed successfully. Please follow these instructions: ${paymentResponse.data.instructions}`); 
    } else {
      throw new Error("Failed to process payment");
    }
  } catch (error) {
    console.error(`Error processing payment: ${error.message}`); 
  }
}

processPayment(); 