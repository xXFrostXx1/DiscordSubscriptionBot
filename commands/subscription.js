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

async function processSubscriptionAction(userId, action) {
    const actions = {
        check: async () => {
            const subscriptionDetails = await checkSubscription(userId);
            return `Your subscription status: ${subscriptionDetails.status}. Expires on: ${subscriptionDetails.expiresOn}`;
        },
        renew: async () => {
            return await changeSubscriptionStatus(userId, 'renew');
        },
        cancel: async () => {
            return await changeSubscriptionStatus(userId, 'cancel');
        }
    };

    if (actions[action]) {
        return await actions[action]();
    } else {
        throw new Error('Invalid action. Please use "check", "renew", or "cancel".');
    }
}

async function changeSubscriptionStatus(userId, action) {
    const response = await axios.post(`${process.env.BACKEND_URL}/subscriptions/${action}`, { userId }, {
        headers: {
            'Authorization': `Bearer ${process.env.API_TOKEN}`,
        },
    });

    const actionVerb = action === 'renew' ? 'renewed' : 'cancelled';
    const messagePart = action === 'renew' ? ` New expiry date: ${response.data.expiresOn}` : '';

    await notifyUserSubscriptionStatusChange(userId, actionVerb);

    return `Subscription ${actionVerb} successfully.${messagePart}`;
}

async function subscriptionCommand(userId, action) {
    try {
        const message = await processSubscriptionAction(userId, action);
        console.log(message);
    } catch (error) {
        handleError(error);
    }
}

function handleError(error) {
    if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
    } else if (error.request) {
        console.error('Error request:', error.request);
    } else {
        console.error('Error', error.message);
    }
    console.error('Error configuration:', error.config);
}

subscriptionCommand('someUserId', 'check');