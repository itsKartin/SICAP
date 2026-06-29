import requests
import os
from datetime import date
from dotenv import load_dotenv

load_dotenv()

BCV_API_URL = "https://bcvapi.tech/api/v1/dolar"
API_KEY = os.getenv("BCV_API_KEY")

_cached_rate = None
_cache_date = None

def get_rate() -> float:
    global _cached_rate, _cache_date

    today = date.today()

    if _cached_rate is not None and _cache_date == today:
        return _cached_rate

    headers = {"Authorization": API_KEY}
    response = requests.get(BCV_API_URL, headers=headers)
    data = response.json()
    _cached_rate = float(data["tasa"])
    _cache_date = today

    return _cached_rate

def to_usd(amount_bs: float) -> float:
    return round(amount_bs / get_rate(), 2)

def to_bs(amount_usd: float) -> float:
    return round(amount_usd * get_rate(), 2)