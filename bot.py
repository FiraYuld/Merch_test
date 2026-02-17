import asyncio
import json
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import CommandStart
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo

TOKEN = "8547046931:AAG4YTqKJt5RNLYOdDOvVZN0MGBNMwnvZms"
bot = Bot(token=TOKEN)
dp = Dispatcher()

# ВСТАВЬ СЮДА НОВУЮ ССЫЛКУ NGROK (без /index.html на конце!)
WEBAPP_URL = "https://untransitive-nancee-decadently.ngrok-free.dev"

@dp.message(CommandStart())
async def command_start_handler(message: types.Message):
    markup = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="🎮 Открыть магазин", web_app=WebAppInfo(url=WEBAPP_URL))]
        ],
        resize_keyboard=True
    )
    await message.answer(
        f"Добро пожаловать в Geek Store, {message.from_user.first_name}! 👾\n\nЖми на кнопку ниже, чтобы выбрать мерч:",
        reply_markup=markup
    )

@dp.message(F.web_app_data)
async def web_app_data_handler(message: types.Message):
    # 1. Распаковываем данные
    parsed_data = json.loads(message.web_app_data.data)
    
    items = parsed_data.get("items", [])
    total_price = parsed_data.get("totalPrice", 0)
    user = parsed_data.get("user", {}) 
    
    # 2. Формируем ОДНО красивое сообщение
    text = "🎉 <b>Заказ успешно оформлен!</b>\n\n"
    
    # Сначала данные клиента
    text += "👤 <b>Данные получателя:</b>\n"
    text += f"▪️ ФИО: {user.get('name')}\n"
    text += f"▪️ Телефон: {user.get('phone')}\n"
    text += f"▪️ Город: {user.get('city')}\n\n"
    
    # Затем состав заказа
    text += "📦 <b>Состав заказа:</b>\n"
    for item in items:
        # Считаем сумму за позицию (цена * кол-во)
        item_total = item['price'] * item['quantity']
        text += f"▪️ {item['name']} (x{item['quantity']}) — {item_total} ₽\n"
    
    # Итог
    text += f"\n💰 <b>ИТОГО К ОПЛАТЕ: {total_price} ₽</b>\n\n"
    text += "<i>Менеджер свяжется с вами в ближайшее время для подтверждения заказа!</i>"
    
    # 3. Отправляем итоговое сообщение
    await message.answer(text, parse_mode="HTML")

async def main():
    print("Бот успешно запущен! Жду заказов...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main()) 