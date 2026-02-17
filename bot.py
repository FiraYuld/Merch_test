import os
import asyncio
import json
from dotenv import load_dotenv # Читает секреты из .env файла
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import CommandStart
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo

# Загружаем переменные окружения (чтобы никто не украл токен из кода)
load_dotenv()
TOKEN = os.getenv("BOT_TOKEN")

if not TOKEN:
    exit("❌ Ошибка: Токен не найден! Проверь файл .env")

bot = Bot(token=TOKEN)
dp = Dispatcher()

# Ссылка на твое Web App (Ngrok)
WEBAPP_URL = "https://untransitive-nancee-decadently.ngrok-free.dev"

@dp.message(CommandStart())
async def command_start_handler(message: types.Message):
    """Обрабатывает команду /start и выдает кнопку-меню"""
    markup = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="🎮 Открыть магазин", web_app=WebAppInfo(url=WEBAPP_URL))]
        ],
        resize_keyboard=True
    )
    await message.answer(
        f"Добро пожаловать в Guazi Shop, {message.from_user.first_name}! 🐑\n\nЖми на кнопку ниже, чтобы выбрать мерч:",
        reply_markup=markup
    )

@dp.message(F.web_app_data)
async def web_app_data_handler(message: types.Message):
    """Принимает данные из React-приложения (корзину и форму)"""
    parsed_data = json.loads(message.web_app_data.data)
    
    items = parsed_data.get("items", [])
    total_price = parsed_data.get("totalPrice", 0)
    user = parsed_data.get("user", {}) 
    
    # Собираем красивый чек
    text = "🎉 <b>Заказ успешно оформлен!</b>\n\n"
    text += "👤 <b>Данные получателя:</b>\n"
    text += f"▪️ ФИО: {user.get('name')}\n"
    text += f"▪️ Телефон: {user.get('phone')}\n"
    text += f"▪️ Город: {user.get('city')}\n\n"
    
    text += "📦 <b>Состав заказа:</b>\n"
    for item in items:
        item_total = item['price'] * item['quantity']
        text += f"▪️ {item['name']} (x{item['quantity']}) — {item_total} ₽\n"
    
    text += f"\n💰 <b>ИТОГО К ОПЛАТЕ: {total_price} ₽</b>\n\n"
    text += "<i>Менеджер свяжется с вами в ближайшее время для подтверждения заказа!</i>"
    
    await message.answer(text, parse_mode="HTML")

async def main():
    print("🤖 Бот успешно запущен! Жду заказов...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())