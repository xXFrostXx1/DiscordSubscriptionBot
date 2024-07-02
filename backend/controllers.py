import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from functools import lru_cache
import requests  # Import the requests library

load_dotenv()

PAYMENT_PROCESSOR_URL = os.getenv("PAYMENT_PROCESSOR_URL", "https://payment.processor/api")
PAYMENT_API_KEY = os.getenv("PAYMENT_API_KEY", "your_api_key_here")
WEBHOOK_URL = os.getenv("WEBHOOK_URL", "your_webhook_url_here")

app = Flask(__name__)

users_subscriptions = {}

def send_webhook_notification(content):
    try:
        requests.post(WEBHOOK_URL, json=content)
    except Exception as e:
        print(f"Failed to send webhook notification: {e}")

@lru_cache
def process_payment(user_id, amount):
    print(f"Processing ${amount} payment for user {user_id}")
    # Here, we can also integrate the payment processing API using requests, but for now, we'll simulate success.
    send_webhook_notification({"type": "payment_processed", "user_id": user_id, "amount": amount})
    return True

def add_subscription(user_id, subscription_type):
    users_subscriptions[user_id] = subscription_type
    print(f"Subscription {subscription_type} added for user {user_id}")
    send_webhook_notification({"type": "new_subscription", "user_id": user_id, "subscription_type": subscription_type})

@app.route('/api/payment', methods=['POST'])
def handle_payment():
    data = request.json
    user_id = data.get('user_id')
    amount = data.get('amount')
    
    if not user_id or not amount:
        return jsonify({'error': 'Missing user_id or amount'}), 400

    payment_result = process_payment(user_id, amount)
    if payment_result:
        return jsonify({'message': 'Payment processed successfully'}), 200
    else:
        return jsonify({'error': 'Payment processing failed'}), 500

@app.route('/api/subscribe', methods=['POST'])
def handle_subscription():
    data = request.json
    user_id = data.get('user_id')
    subscription_type = data.get('subscription_id')
    
    if not user_id or not subscription_type:
        return jsonify({'error': 'Missing user_id or subscription_type'}), 400

    add_subscription(user_id, subscription_type)
    return jsonify({'message': f'User {user_id} subscribed to {subscription_type}'})