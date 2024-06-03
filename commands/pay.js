require('dotenv').config();
const axios = require('axios');
const getUserInput = require('prompt-sync')({ sigint: true });

async function initiatePaymentProcess() { 
  try {
    console.log("Available payment methods: 1. Credit Card, 2. PayPal");
    const chosenPaymentMethodInput = getUserInput("Please choose your payment method (Enter 1 for Credit Card or 2 for PayPal): "); 
    const paymentAmountInput = getUserInput("Enter the amount you wish to pay: "); 

    if (isNaN(paymentAmountInput) || paymentAmountInput <= 0) throw new Error("Invalid amount");
    if (chosenPaymentMethodInput !== '1' && chosenPaymentMethodInput !== '2') throw new Error("Invalid payment method"); 
    
    const paymentInformation = { 
      method: chosenPaymentMethodInput === '1' ? 'Credit Card' : 'PayPal',
      amount: parseFloat(paymentAmountInput),
    };

    const paymentSubmissionResponse = await axios.post(`${process.env.BACKEND_API_URL}/create-payment`, paymentInformation); 

    if (paymentSubmissionResponse.data && paymentSubmissionResponse.data.success) {
      console.log(`Payment processed successfully. Please follow these instructions: ${paymentSubmissionResponse.data.instructions}`); 
    } else {
      throw new Error("Failed to process payment");
    }
  } catch (paymentError) {
    console.error(`Error processing payment: ${paymentError.message}`); 
  }
}

initiatePaymentProcess();