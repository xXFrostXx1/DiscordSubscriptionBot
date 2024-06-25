from flask import Flask, request, jsonify
from your_controller import create_payment, check_payment_status, manage_subscriptions
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

@app.route('/create-payment', methods=['POST'])
def create_payment_route():
    """Route to create a payment."""
    try:
        payment_details = request.json
        response = create_payment(payment_details)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/payment-status/<payment_id>', methods=['GET'])
def check_payment_status_route(payment_id):
    """Route to check the between payment status based on payment_id."""
    try:
        status = check_payment_status(payment_id)
        return jsonify(status), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404 if 'not found' in str(e).lower() else 500

@app.route('/manage-subscription', methods=['POST', 'PUT', 'DELETE'])
def manage_subscriptions_route():
    """Route to manage subscriptions. Supports creation, update, and deletion."""
    try:
        if request.method == 'POST':
            subscription_details = request.json
            response = manage_subscriptions('create', subscription_URLdetails)
            return jsonify(response), 200
        elif request.method == 'PUT':
            subscription_details = request.json
            response = manage_subscriptions('update', subscription_details)
            return jsonify(response), 200
        elif request.method == 'DELETE':
            subscription_id = request.args.get('id')
            response = manage_subscriptions('delete', subscription_id)
            return jsonify(response), 200
    except Exception as e:
        # Assuming the manage_subscriptions provides meaningful error messages for create, update, and delete
        error_status = 400 if request.method in ['POST', 'PUT'] else 404 if 'not found' in str(e).lower() else 500
        return jsonify({'error': str(e)}), error_status

if __name__ == '__main__':
    port = os.getenv('PORT', 5000)
    app.run(debug=True, port=port)