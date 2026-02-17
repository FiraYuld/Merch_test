import os
import asyncio
import json
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import CommandStart
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo

# Загружаем переменные окружения
load_dotenv()
TOKEN = os.getenv("BOT_TOKEN")
MANAGER_ID = os.getenv("MANAGER_ID") # Получаем ID менеджера из .env

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
        f"Добро пожаловать в Sheep 2 Me, {message.from_user.first_name}! 🐑\n\nЖми на кнопку ниже, чтобы выбрать мерч:",
        reply_markup=markup
    )

@dp.message(F.web_app_data)
async def web_app_data_handler(message: types.Message):
    """Принимает данные из React-приложения и рассылает уведомления"""
    parsed_data = json.loads(message.web_app_data.data)
    
    items = parsed_data.get("items", [])
    total_price = parsed_data.get("totalPrice", 0)
    user = parsed_data.get("user", {}) 
    
    # Извлекаем Telegram-данные покупателя (для менеджера)
    tg_user = message.from_user
    # Если у юзера есть @username, берем его. Если нет - делаем кликабельное имя по ID
    if tg_user.username:
        tg_link = f"@{tg_user.username}"
    else:
        tg_link = f"<a href='tg://user?id={tg_user.id}'>{tg_user.first_name}</a>"

    # ==========================================
    # 1. ФОРМИРУЕМ СООБЩЕНИЕ ДЛЯ МЕНЕДЖЕРА
    # ==========================================
    manager_text = "🚨 <b>НОВЫЙ ЗАКАЗ!</b> 🚨\n\n"
    manager_text += f"👤 <b>Аккаунт ТГ:</b> {tg_link}\n"
    manager_text += f"📝 <b>ФИО (из формы):</b> {user.get('name')}\n"
    manager_text += f"📞 <b>Телефон:</b> {user.get('phone')}\n"
    manager_text += f"🏙 <b>Город:</b> {user.get('city')}\n\n"
    
    manager_text += "📦 <b>Состав заказа:</b>\n"
    for item in items:
        item_total = item['price'] * item['quantity']
        manager_text += f"▪️ {item['name']} (x{item['quantity']}) — {item_total} ₽\n"
    
    manager_text += f"\n💰 <b>ИТОГО К ОПЛАТЕ: {total_price} ₽</b>"

    # ==========================================
    # 2. ФОРМИРУЕМ ЧЕК ДЛЯ ПОКУПАТЕЛЯ
    # ==========================================
    client_text = "🎉 <b>Заказ успешно оформлен и передан менеджеру!</b>\n\n"
    client_text += "📦 <b>Ваш заказ:</b>\n"
    for item in items:
        item_total = item['price'] * item['quantity']
        client_text += f"▪️ {item['name']} (x{item['quantity']}) — {item_total} ₽\n"
    
    client_text += f"\n💰 <b>Итого: {total_price} ₽</b>\n\n"
    client_text += "<i>В ближайшее время с вами свяжутся по указанному номеру или в Telegram для подтверждения. Спасибо, что выбрали Sheep 2 Me! 🐑</i>"

    # ==========================================
    # 3. ОТПРАВЛЯЕМ СООБЩЕНИЯ
    # ==========================================
    
    # Отправляем чек клиенту
    await message.answer(client_text, parse_mode="HTML")
    
    # Отправляем уведомление менеджеру (если ID указан в .env)
    if MANAGER_ID:
        try:
            await bot.send_message(chat_id=MANAGER_ID, text=manager_text, parse_mode="HTML")
        except Exception as e:
            print(f"❌ Не удалось отправить сообщение менеджеру. Ошибка: {e}")
            await message.answer("⚠️ <i>Произошла небольшая заминка на стороне сервера, но ваш заказ сохранен.</i>", parse_mode="HTML")
    else:
        print("⚠️ ВНИМАНИЕ: MANAGER_ID не указан в файле .env. Заказ не был переслан менеджеру!")

async def main():
    print("🤖 Бот успешно запущен! Жду заказов...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())