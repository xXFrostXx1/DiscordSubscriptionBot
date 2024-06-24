from flask import Flask, request
from your_controller import create_payment, check_payment_status, manage_subscriptions
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

@app.route('/create-payment', methods=['POST'])
def create_payment_route():
    """Route to create a payment."""
    payment_details = request.json
    return create_payment(payment_details)

@app.route('/payment-status/<payment_id>', methods=['GET'])
def check_payment_status_route(payment_id):
    """Route to check the payment status based on payment_id."""
    return check_payment_status(payment_id)

@app.route('/manage-subscription', methods=['POST', 'PUT', 'DELETE'])
def manage_subscriptions_route():
    """Route to manage subscriptions. Supports creation, update, and deletion."""
    if request.method == 'POST':
        subscription_details = request.json
        return manage_subscriptions('create', subscription_details)
    elif request.method == 'PUT':
        subscription_details = request.json
        return manage_subscriptions('update', subscription_details)
    elif request.method == 'DELETE':
        subscription_id = request.args.get('id')
        return manage_subscriptions('delete', subscription_id)

if __name__ == '__main__':
    port = os.getenv('PORT', 5000)
    app.run(debug=True, port=port)