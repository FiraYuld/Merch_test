import os
import asyncio
import json
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import CommandStart
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo

# Загружаем переменные из локального .env (если он есть)
load_dotenv()

# Читаем настройки из окружения
TOKEN = os.getenv("BOT_TOKEN")
MANAGER_ID = os.getenv("MANAGER_ID")
# ВАЖНО: Теперь ссылка тоже берется из настроек!
WEBAPP_URL = os.getenv("WEBAPP_URL") 

if not TOKEN or not WEBAPP_URL:
    exit("❌ Ошибка: Не найден TOKEN или WEBAPP_URL. Проверь .env или настройки хостинга!")

bot = Bot(token=TOKEN)
dp = Dispatcher()

@dp.message(CommandStart())
async def command_start_handler(message: types.Message):
    markup = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="🎮 Открыть магазин", web_app=WebAppInfo(url=WEBAPP_URL))]
        ],
        resize_keyboard=True
    )
    await message.answer(
        f"Добро пожаловать в Sheep To Me, {message.from_user.first_name}! 🐑\n\nЖми на кнопку ниже, чтобы выбрать мерч:",
        reply_markup=markup
    )

@dp.message(F.web_app_data)
async def web_app_data_handler(message: types.Message):
    parsed_data = json.loads(message.web_app_data.data)
    
    items = parsed_data.get("items", [])
    user = parsed_data.get("user", {}) 
    
    # Новые поля
    subtotal = parsed_data.get("subtotal", 0)
    discount = parsed_data.get("discount", 0)
    total_price = parsed_data.get("totalPrice", 0)
    promo_code = parsed_data.get("promo")
    comment = parsed_data.get("comment", "")

    # Данные ТГ
    tg_user = message.from_user
    if tg_user.username:
        tg_link = f"@{tg_user.username}"
    else:
        tg_link = f"<a href='tg://user?id={tg_user.id}'>{tg_user.first_name}</a>"

    # --- СООБЩЕНИЕ МЕНЕДЖЕРУ ---
    manager_text = "🚨 <b>НОВЫЙ ЗАКАЗ!</b> 🚨\n\n"
    manager_text += f"👤 <b>Аккаунт:</b> {tg_link}\n"
    manager_text += f"📝 <b>ФИО:</b> {user.get('name')}\n"
    manager_text += f"📞 <b>Телефон:</b> {user.get('phone')}\n"
    manager_text += f"🏙 <b>Город:</b> {user.get('city')}\n"
    
    if comment:
        manager_text += f"💬 <b>Комментарий:</b> {comment}\n"
    
    manager_text += "\n📦 <b>Состав заказа:</b>\n"
    for item in items:
        item_total = item['price'] * item['quantity']
        manager_text += f"▪️ {item['name']} (x{item['quantity']}) — {item_total} ₽\n"
    
    manager_text += f"\n💵 <b>Подытог:</b> {subtotal} ₽\n"
    if discount > 0:
        manager_text += f"🏷 <b>Скидка ({promo_code}):</b> -{discount} ₽\n"
    
    manager_text += f"💰 <b>ИТОГО К ОПЛАТЕ: {total_price} ₽</b>"

    # --- ЧЕК КЛИЕНТУ ---
    client_text = "🎉 <b>Заказ принят!</b>\n\n"
    client_text += "📦 <b>Состав:</b>\n"
    for item in items:
        client_text += f"▪️ {item['name']} (x{item['quantity']})\n"
    
    if discount > 0:
         client_text += f"\n🏷 Скидка: -{discount} ₽"

    client_text += f"\n💰 <b>Итого: {total_price} ₽</b>\n\n"
    client_text += "<i>Менеджер свяжется с вами для подтверждения. Спасибо, что выбрали Sheep To Me! 🐑</i>"

    await message.answer(client_text, parse_mode="HTML")
    
    if MANAGER_ID:
        try:
            await bot.send_message(chat_id=MANAGER_ID, text=manager_text, parse_mode="HTML")
        except Exception as e:
            print(f"❌ Не удалось отправить менеджеру: {e}")

async def main():
    print("🤖 Бот успешно запущен! Жду заказов...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())