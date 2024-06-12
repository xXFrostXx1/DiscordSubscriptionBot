require('dotenv').config();
const axios = require('axios');

async function notifyUserSubscriptionStatusChange(userId, actionDone) {
    console.log(`Notification sent to user ${userId}: Your subscription has been ${actionDone}.`);
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
        throw error;
    }
}

async function subscriptionCommand(userId, action) {
    try {
        let message = '';
        const subscriptionDetails = await checkSubscription(userId);

        if (action === 'check') {
            message = `Your subscription status: ${subscriptionDetails.status}. Expires on: ${subscriptionDetails.statusChange}`;
        } else if (action === 'renew') {
            const response = await axios.post(`${process.env.BACKEND_URL}/subscriptions/renew`, { userId }, {
                headers: {
                    'Authorization': `Bearer ${process.env.API_TOKEN}`,
                },
            });
            message = `Subscription renewed successfully. New expiry date: ${response.data.expiresOn}`;
            await notifyUserSubscriptionStatusChange(userId, "renewed");
        } else if (action === 'cancel') {
            const response = await axios.post(`${process.env.BACKEND_URL}/subscriptions/cancel`, { userId }, {
                headers: {
                    'Authorization': `Bearer ${process.env.API_TOKEN}`,
                },
            });
            message = `Subscription cancelled successfully.`;
            await notifyUserSubscriptionStatusChange(userId, "cancelled");
        } else {
            message = 'Invalid action. Please use "check", "renew", or "cancel".';
        }

        console.log(message);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

subscriptionCommand('someUserId', 'check');