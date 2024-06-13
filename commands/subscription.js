require('dotenv').config();
const axios = require('axios');

async function notifyUserSubscriptionStatusChange(userId, actionDone) {
    try {
        console.log(`Notification sent to user ${userId}: Your subscription has been ${actionDone}.`);
    } catch (error) {
        console.error(`Failed to notify user ${userId} about subscription status change:`, error);
    }
}

async function checkSubscription(userId) {
    try {
        const response = await axios.get(`${process.env.BACKEND_URL}/subscriptions/${userId}`, {
            headers: {
                'Authorization': `Bearer ${process.env.API_TOKEN}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch subscription status:', error);
        throw new Error(`Unable to retrieve subscription status for user ${userId}. Please check logs for details.`);
    }
}

async function subscriptionCommand(userId, action) {
    try {
        let message;
        if (action === 'check') {
            const subscriptionDetails = await checkSubscription(userId);
            message = `Your subscription status: ${subscriptionDetails.status}. Expires on: ${subscriptionDetails.expiresOn}`;
        } else if (action === 'renew' || action === 'cancel') {
            const endpoint = action === 'renew' ? 'renew' : 'cancel';
            const response = await axios.post(`${process.env.BACKEND_URL}/subscriptions/${endpoint}`, { userId }, {
                headers: {
                    'Authorization': `Bearer ${process.env.API_TOKEN}`,
                },
            });

            const actioned = action === 'renew' ? 'renewed' : 'cancelled';
            message = `Subscription ${actioned} successfully.` + (action === 'renew' ? ` New expiry date: ${response.data.expiresOn}` : '');
            await notifyUserSubscriptionStatusChange(userId, actioned);
        } else {
            message = 'Invalid action. Please use "check", "renew", or "cancel".';
        }

        console.log(message);
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Error request:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error', error.message);
        }
        console.error('An error occurred:', error.config);
    }
}

subscriptionCommand('someUserId', 'check');