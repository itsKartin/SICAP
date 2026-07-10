import requests
import os
import json
from dotenv import load_dotenv

load_dotenv()
SMS_URL="https://api.httpsms.com/v1/messages/send"
SMS_KEY=os.getenv("SMS_API")
SMS_NUMBER=os.getenv("PHONE_NUMBER")
GATE_NUMBER=os.getenv("GATE_NUMBER")


def send_sms(content):
    headers={'x-api-key': SMS_KEY, 
        'Accept': 'application/json', 
        'Content-Type': 'application/json'}
    payload ={"content": content, 
      "from": SMS_NUMBER, 
      "to": GATE_NUMBER}
    response = requests.post(SMS_URL, headers=headers, data=json.dumps(payload))
    print("SMS STATUS:", response.status_code)
    print("SMS RESPONSE:", response.json())
    return response.json()

def block(owner_phone):
    return send_sms(f"Bloquear {owner_phone}")

def add(owner_phone):
    return send_sms(f"Agregar {owner_phone}")
