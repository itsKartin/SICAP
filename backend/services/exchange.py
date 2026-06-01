import requests
import os
from dotenv import load_dotenv

load_dotenv()
BCV_API_URL = "https://bcvapi.tech/api/v1/dolar"
API_KEY = os.getenv("BCV_API_KEY")


def usd_value():
    headers = {"Authorization": API_KEY}
    response = requests.get(BCV_API_URL, headers=headers)
    data = response.json()
    return data["tasa"]


def usd_to_bs(amount_usd:float):
    rate = usd_value()
    return rate * amount_usd