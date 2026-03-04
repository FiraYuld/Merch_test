import { IMAGES } from './images';

/* ===================================================================
  📘 ГАЙД ПО РАБОТЕ С ТОВАРАМИ (Sheep To Me)
  ===================================================================

  1. КАК ДОБАВИТЬ КАРТИНКУ:
     - Закинь файл в папку src/assets/ и пропиши в images.js.
     - Используй: img: IMAGES.твояКартинка

  2. КАК ДОБАВИТЬ ТОВАР:
     - Скопируй любой блок {...} внутри массива products.
     - Измени id (он должен быть уникальным!).

  3. 🆕 КНОПКА "О ТОВАРЕ" (ОБЯЗАТЕЛЬНО ДЛЯ ВСЕХ):
     - В каждом товаре должно быть поле `tgLink: "ссылка_на_пост"`.
     - Кнопка будет показываться у всех товаров в модальном окне.

  4. БЕЙДЖ "ПРЕДЗАКАЗ":
     - Добавь в товар свойство `preorder: true` — на карточке появится бейдж "Предзаказ".

  5. 🆕 КАК ДОБАВИТЬ ОПЦИИ СО СМЕНОЙ КАРТИНКИ:
     - Добавь в товар свойство `options`.
     - Внутри опции можно указать свою `img` (эмодзи или картинку из IMAGES).
     - При выборе этой опции картинка в модалке и корзине автоматически поменяется!
     - Пример:
       options: [
           { name: "Мужская версия", price: 1200, img: "👨" },
           { name: "Женская версия", price: 1000, img: "👩" }
       ]

  ===================================================================
*/

export const products = [
  
    {
        id: 8,
        name: "Фигурка Дань Хэн: Имбибитор 1/7  ",
        game: "Honkai: Star Rail",
        price: 16500, 
        img: IMAGES.dh_enchanced, // Базовая картинка
        desc: "Стандартная версия: приблизительно 22 см в длину, 21 см в ширину и 33 см в высоту. Расширенная версия: приблизительно 22 см в длину, 28 см в ширину и 38 см в высоту ",
        tgLink: "https://t.me/telegram/206",
        isAvailable: true,
        options: [
            { name: "Стандартная версия", price: 16500, img: IMAGES.dh_base }, 
            { name: "Расширенная версия", price: 21500, img: IMAGES.dh_enchanced }  
        ]
    },

    {
        id: 9,
        name: "Фигурка Март 7 1/7  ",
        game: "Honkai: Star Rail",
        price: 16500, 
        img: IMAGES.m7_base, // Базовая картинка
        // Оборачиваем описание в круглые скобки и пустые теги <> ... </>
        desc: (
        <>
          Оригинальная детализированная фигурка Март 7.<br />
          <br />
          <b>Масштаб:</b> 1/7<br />
          <b>Размеры:</b> 31 x 17,5 x 28,5 см <br />
          <b>Размеры подставки:</b> 370 x 234 x 388 мм <br />
        
        </>
        ),        
        tgLink: "https://t.me/telegram/206",
        isAvailable: true,
        options: [
            { name: "Без подставки", price: 16500, img: IMAGES.m7_base }, 
            { name: "С подставкой", price: 20500, img: IMAGES.m7_enchanced }, 
            { name: "C подставкой и подстветкой", price: 25500, img: IMAGES.m7_enchanced }  
        ]
    },

    {
        id: 10,
        name: "Фигурка Фу Сюань 1/7  ",
        game: "Honkai: Star Rail",
        price: 14500, 
        img: IMAGES.fuxuan, 
        desc: "Приблизительные размеры: высота 24 см, ширина 25 см и длина 21 см",
        tgLink: "https://t.me/telegram/202",
        isAvailable: true 
        
    },

    {
        id: 11,
        name: "Контроллер Кастории",
        game: ["Honkai: Star Rail", "Другое"],
        price: 12500, 
        img: IMAGES.cas_enchanced, // Базовая картинка
        // Оборачиваем описание в круглые скобки и пустые теги <> ... </>
        desc: (
        <>
          Номинальное входное напряжение: 5V - 1000mA. <br />
          Номинальная мощность: 0,25 Вт <br />
          <br />
          <b>Размер контроллера:</b> 150 x 101 x 56 мм<br />
          <b>Размер чехла:</b> 170 x 145 x 90 мм<br />
          <b>Размеры зарядного устройства:</b> 112 x 98 x 101 мм <br />
          <b>Размеры пина:</b> 65 x 64 мм <br />
        
        </>
        ),        
        tgLink: "https://t.me/telegram/206",
        isAvailable: true,
        options: [
            { name: "Контроллер, чехол + пин", price: 12500, img: IMAGES.cas_base }, 
            { name: "Контроллер, чехол, зарядка + пин", price: 14500, img: IMAGES.cas_enchanced }, 
        ]
    },

    {
        id: 12,
        name: "Контроллер Светлячка",
        game: ["Honkai: Star Rail", "Другое"],
        price: 12500, 
        img: IMAGES.sam_enchanced, // Базовая картинка
        // Оборачиваем описание в круглые скобки и пустые теги <> ... </>
        desc: (
        <>
          Номинальное входное напряжение: 5V – 1000 мА<br />
          Номинальная мощность: 0,25 Вт <br />
          <br />
          <b>Размер контроллера:</b> 155 x 101 x 56 мм<br />
          <b>Размер чехла:</b> 170 x 145 x 90 мм <br />
          <b>Размер пина:</b> 55 x 45 x 2 мм <br />
          <b>Размер зарядного устройства :</b> 102 x 95 x 80 мм <br />
        </>
        ),        
        tgLink: "https://t.me/telegram/206",
        isAvailable: true,
        options: [
            { name: "Контроллер, чехол + пин", price: 12500, img: IMAGES.sam_base }, 
            { name: "Контроллер, чехол, зарядка + пин", price: 14500, img: IMAGES.sam_enchanced }, 
        ]
    },

    {
        id: 13,
        name: "Клавиатура Кафки",
        game: ["Honkai: Star Rail", "Другое"],
        price: 12500, 
        img: IMAGES.kafka_kb_base, // Базовая картинка
        // Оборачиваем описание в круглые скобки и пустые теги <> ... </>
        desc: (
        <>
          <b>Размер 87 клавиш:</b> 363.80x136.60x43.66mm <br />
          <b>Размер 108 клавиш:</b> 440x136.60x43.66mm <br />
          <b>Аккумулятор:</b> 8000 mАh <br />
          <b>Подключение:</b> Bluetooth 5.0 / Wi-Fi 2.4G / Type-C <br />
          <b>Поддержка Windows/MacOS/Linux/Android</b> <br />
          <b>16 миллионов регулируемых RGB-цветов</b> <br />
        </>
        ),        
        tgLink: "https://t.me/telegram/206",
        isAvailable: true,
        options: [
            { name: "87 Клавиш", price: 12500, img: IMAGES.kafka_kb_base }, 
            { name: "108 Клавиш", price: 13500, img: IMAGES.kafka_kb_enchanced}, 
        ]
    },

    {
        id: 14,
        name: "Клавиатура Ахерон",
        game: ["Honkai: Star Rail", "Другое"],
        price: 12500, 
        img: IMAGES.acheron_kb_base, // Базовая картинка
        // Оборачиваем описание в круглые скобки и пустые теги <> ... </>
        desc: (
        <>
          <b>Размер 87 клавиш:</b> 363.80x136.60x43.66mm <br />
          <b>Размер 108 клавиш:</b> 440x136.60x43.66mm <br />
          <b>Аккумулятор:</b> 8000 mАh <br />
          <b>Подключение:</b> Bluetooth 5.0 / Wi-Fi 2.4G / Type-C <br />
          <b>Поддержка Windows/MacOS/Linux/Android</b> <br />
          <b>16 миллионов регулируемых RGB-цветов</b> <br />
        </>
        ),        
        tgLink: "https://t.me/telegram/206",
        isAvailable: true,
        options: [
            { name: "87 Клавиш", price: 12500, img: IMAGES.acheron_kb_base }, 
            { name: "108 Клавиш", price: 13500, img: IMAGES.acheron_kb_enchanced}, 
        ]
    },

    {
        id: 15,
        name: "Клавиатура Бутхилла",
        game: ["Honkai: Star Rail", "Другое"],
        price: 9000, 
        img: IMAGES.boothill_kb, 
        desc: (
        <>
          <b>Размер 97 клавиш:</b> 387.8x143x40.8mm <br />
          <b>Аккумулятор:</b> 3000 mАh <br />
          <b>Подключение:</b> Bluetooth 5.0 / Wi-Fi 2.4G / Type-C <br />
          <b>Поддержка Windows/MacOS/Android</b> <br />
          <b>16 миллионов регулируемых RGB-цветов</b> <br />
        </>
        ),
        tgLink: "https://t.me/telegram/202",
        isAvailable: true 
        
    },

    {
        id: 16,
        name: "Сумка Ахерон",
        game: ["Honkai: Star Rail", "Другое"],
        price: 6500, 
        img: IMAGES.acheron_bag, 
        desc: (
        <>
          <b>Размер:</b> 28,3 см x 7 см x 23,7 см (без учета плечевых ремней) <br />
          <b>Материал:</b> искусственная кожа из полиуретана, 100% полиэфирное волокно, цинковый сплав. <br />
        </>
        ),
        tgLink: "https://t.me/telegram/202",
        isAvailable: true 
        
    },

    {
        id: 17,
        name: "Портфель Авантюрина",
        game: ["Honkai: Star Rail", "Другое"],
        price: 6500, 
        img: IMAGES.aventurine_bag, 
        desc: (
        <>
          <b>Размер:</b> 31 см х 8 см х 24 см. Плечевая лямка 90–120 см (регулируемая). <br />
          <b>Материал:</b> Искусственная кожа из полиуретана, 100% поливинилхлорид (ПВХ), цинковый сплав/железо. <br />
        </>
        ),
        tgLink: "https://t.me/telegram/202",
        isAvailable: true 
        
    },

    {
        id: 18,
        name: "Сумка Фэйсяо",
        game: ["Honkai: Star Rail", "Другое"],
        price: 6500, 
        img: IMAGES.feixiao_bag, 
        desc: (
        <>
          <b>Размер:</b> 390×300×110 мм (Длина плечевого ремня составляет 680 мм.) <br />
          <b>Материал:</b> Искусственная кожа из полиуретана (ПУ). Использовались термопластичный полиуретан (TPU), горячее прессование, вышивка и покраска краев. <br />
        </>
        ),
        tgLink: "https://t.me/telegram/202",
        isAvailable: true 
        
    },

    {
        id: 19,
        name: "Портфель Кафки",
        game: ["Honkai: Star Rail", "Другое"],
        price: 6500, 
        img: IMAGES.kafka_bag, 
        desc: (
        <>
          <b>Размер:</b> 32 см x 7 см x 23 см (без учета плечевых ремней). <br />
          <b>Материал:</b> Искусственная кожа из полиуретана (ПУ), 100% полиэстер, полиуретановая синтетическая кожа (ПУ) <br />        </>
        ),
        tgLink: "https://t.me/telegram/202",
        isAvailable: true 
        
    },

    {
        id: 20,
        name: "Рандом-бокс Химеры",
        game: ["Honkai: Star Rail"],
        price: 1500, 
        img: IMAGES.chimers_random, 
        desc: (
        <>
          <b>В одном пакете 4 случайные фигурки.</b> <br />
          <b>Размеры:</b> 3.2-4.2см <br />
        </>
        ),        
        tgLink: "https://t.me/telegram/206",
        isAvailable: true,
        options: [
            { name: "1 пакетик", price: 1500, img: IMAGES.chimers_random }, 
            { name: "Полный коплект", price: 14500, img: IMAGES.chimers_random}, 
        ]
    },

    {
        id: 21,
        name: "Плюшевые куклы",
        game: ["Honkai: Star Rail"],
        price: 6500, 
        img: IMAGES.plush_1, 
        desc: (
        <>
          <b>Размер:</b>  высота игрушки в сидячем положении около 35 см. <br />
          <b>Карточка и резиновый обвес с персонажем в подарок. </b>
        </>
        ),        
        tgLink: "https://t.me/telegram/206",
        isAvailable: true,
        options: [
            { name: "Кафка", price: 6500, img: IMAGES.plush_1}, 
            { name: "Блэйд", price: 6500, img: IMAGES.plush_1},
            { name: "Цзинлю", price: 6500, img: IMAGES.plush_1}, 
            { name: "Цзинь Юань", price: 6500, img: IMAGES.plush_1}, 
        ]
    },

    {
        id: 22,
        name: "Рандом-бокс Банбу от PopMart",
        game: ["Zenless Zone Zero", "PopMart"],
        price: 1500, 
        img: IMAGES.banboo_popmart, 
        desc: (
        <>
          <b></b>В боксе 1 случайный банбу <br />
          <b>Размеры:</b> 7-9 см <br />
        </>
        ),        
        tgLink: "https://t.me/telegram/206",
        isAvailable: true,
        options: [
            { name: "1 бокс", price: 1500, img: IMAGES.banboo_popmart }, 
            { name: "Полный комплект", price: 14500, img: IMAGES.banboo_popmart}, 
        ]
    },

    {
        id: 23,
        name: "Рандом-бокс Genshin Impact от PopMart",
        game: ["Genshin Impact", "PopMart"],
        price: 2400, // Цена отображаемая в каталоге (за 1 бокс)
        img: IMAGES.genshin_popmart, // Не забудь добавить переменную в images.js
        desc: (
        <>
          Внутри 1 случайная фигурка серии: Айно, Дурин, Варка, Флинс, Колумбина, Инеффа или редкий секретный дроп — Рери. <br />
          <br />
          <b>Размеры:</b> 7.4 - 8.2 см <br />
          <br />
          <i>*При покупке набора из 6 боксов есть шанс получить секретную золотую фигурку Рери (выпадение не гарантировано).</i>
        </>
        ),        
        tgLink: "https://t.me/telegram/207", 
        isAvailable: true,
        options: [
            { name: "1 бокс", price: 2400, img: IMAGES.genshin_popmart }, 
            { name: "Набор (6 стилей)", price: 9000, img: IMAGES.genshin_popmart } 
        ]
    },

    {
        id: 24,
        name: "Нендроид Зарянка",
        game: "Honkai: Star Rail",
        price: 6500, 
        img: IMAGES.robin_nendroid, 
        desc: (
        <>
          <b>Размер:</b> высота игрушки около 10 см.<br />
          <br />
          <b>Есть сменные лица с разными эмоциями.</b>
        </>
        ),        
        tgLink: "https://t.me/telegram/208", // Замени на актуальную ссылку
        isAvailable: true
    },
    {
        id: 25,
        name: "Нендроид Воскресенье",
        game: "Honkai: Star Rail",
        price: 6500, 
        img: IMAGES.sunday_nendroid, 
        desc: (
        <>
          <b>Размер:</b> высота игрушки около 10 см.<br />
          <br />
          <b>Есть сменные лица с разными эмоциями.</b>
        </>
        ),        
        tgLink: "https://t.me/telegram/209", // Замени на актуальную ссылку
        isAvailable: true
    },
    {
        id: 26,
        name: "Нендроид Авантюрин",
        game: "Honkai: Star Rail",
        price: 6500, 
        img: IMAGES.aventurine_nendroid, 
        desc: (
        <>
          <b>Размер:</b> высота игрушки около 10 см.<br />
          <br />
          <b>Есть сменные лица с разными эмоциями.</b>
        </>
        ),        
        tgLink: "https://t.me/telegram/210", // Замени на актуальную ссылку
        isAvailable: true
    },
    {
        id: 27,
        name: "Нендроид Дань Хэн",
        game: "Honkai: Star Rail",
        price: 6300, 
        img: IMAGES.danheng_nendroid, 
        desc: (
        <>
          <b>Размер:</b> высота игрушки около 10 см.<br />
          <br />
          <b>Есть сменные лица с разными эмоциями.</b>
        </>
        ),        
        tgLink: "https://t.me/telegram/211", // Замени на актуальную ссылку
        isAvailable: true
    },
    {
        id: 28,
        name: "Нендроид Блэйд",
        game: "Honkai: Star Rail",
        price: 6300, 
        img: IMAGES.blade_nendroid, 
        desc: (
        <>
          <b>Размер:</b> высота игрушки около 10 см.<br />
          <br />
          <b>Есть сменные лица с разными эмоциями.</b>
        </>
        ),        
        tgLink: "https://t.me/telegram/212", // Замени на актуальную ссылку
        isAvailable: true
    },
    {
        id: 29,
        name: "Нендроид Март 7", // У тебя было написано "Март 8", я исправил на классическое "Март 7" (или верни Март 8, если это специфика фигурки!)
        game: "Honkai: Star Rail",
        price: 6300, 
        img: IMAGES.march_nendroid, 
        desc: (
        <>
          <b>Размер:</b> высота игрушки около 10 см.<br />
          <br />
          <b>Есть сменные лица с разными эмоциями.</b>
        </>
        ),        
        tgLink: "https://t.me/telegram/213", // Замени на актуальную ссылку
        isAvailable: true
    },

    {
        id: 30,
        name: "Брелок Мини Лабубу 10см",
        game: ["PopMart"],
        price: 1600, 
        img: IMAGES.labubu_mini1, // Не забудь добавить переменную в images.js
        desc: (
        <>
          Мини-брелок Лабубу в виде случайного бокса.<br />
          <br />
          <b>Размер:</b> 10 см.<br />
          <br />
          Доступно две версии коробок, которые отличаются цветовой палитрой. В каждой версии может выпасть 1 случайный брелок из 15 возможных цветов.<br />
          <br />
          <i>*Если вы не хотите полагаться на случайность, выберите опцию «Нужный цвет на выбор» и укажите цвет в комментариях к заказу.</i>
        </>
        ),        
        tgLink: "https://t.me/telegram/214", // Замени на актуальную ссылку
        isAvailable: true,
        options: [
            { name: "1 коробка (Версия 1)", price: 1600, img: IMAGES.labubu_mini1 }, 
            { name: "1 коробка (Версия 2)", price: 1600, img: IMAGES.labubu_mini2 }, 
            { name: "Нужный цвет на выбор", price: 2100, img: IMAGES.labubu_mini1 }
        ]
    },

    {
        id: 31,
        name: "Футболки Arknights: Endfield (3 опции)",
        game: "Arknights",
        price: 2800, 
        img: IMAGES.endfield_tshirt1, // Добавь в images.js
        desc: (
        <>
          Стильная футболка по мотивам Arknights: Endfield.<br />
          <br />
          <b>Материал:</b> 75% хлопок, 25% полиэстер.<br />
          <b>Размеры:</b> M, L, XL.<br />
          <br />
          <i>*Пожалуйста, укажите нужный размер (M, L или XL) в комментарии при оформлении заказа.</i>
        </>
        ),        
        tgLink: "https://t.me/telegram/215",
        isAvailable: true,
        options: [
            { name: "Футболка Зиплайн", price: 2800, img: IMAGES.endfield_tshirt1 },
            { name: "Футболка Очки", price: 2800, img: IMAGES.endfield_tshirt2 },
            { name: "Футболка Инструменты", price: 2800, img: IMAGES.endfield_tshirt3 }
        ]
    },
    {
        id: 32,
        name: "Плюшевые зайчики Лэватейн и Ивонна",
        game: "Arknights",
        price: 1300, 
        img: IMAGES.bunnies_plush1, // Добавь в images.js
        desc: (
        <>
          Милые плюшевые зайчики в виде персонажей Лэватейн и Ивонны.<br />
          <br />
          <b>Размер:</b> 21 см.<br />
          <br />
          <i>*Одежда у игрушек полностью снимается!</i>
        </>
        ),        
        tgLink: "https://t.me/telegram/216",
        isAvailable: true,
        options: [
            { name: "Зайчик Лэватейн", price: 1300, img: IMAGES.bunnies_plush1 },
            { name: "Зайчик Ивонна", price: 1300, img: IMAGES.bunnies_plush2 }
        ]
    },
    {
        id: 33,
        name: "Стенд Ивонны (Гачапон-автомат)",
        game: "Arknights",
        price: 1700, 
        img: IMAGES.yvonne_stand, // Добавь в images.js
        desc: (
        <>
          Интерактивный акриловый стенд с Ивонной в виде автомата с игрушками.<br />
          <br />
          <b>Материал:</b> Акрил.<br />
          <b>Размер:</b> 16 см.<br />
          <br />
          <b>Особенность:</b> Стенд полностью интерактивный! Ручку автомата можно крутить, и внутри будут падать шарики.
        </>
        ),        
        tgLink: "https://t.me/telegram/217",
        isAvailable: true
    },

    {
        id: 34,
        name: "Комплект Шоппер + значки + брелок",
        game: "Arknights", // ⬅️ Замени на нужную категорию, если это мерч по игре
        price: 2100, 
        img: IMAGES.shopper_set, // Не забудь добавить в images.js
        desc: (
        <>
          Большой набор с шоппером и аксессуарами.<br />
          <br />
          <b>В комплекте:</b><br />
          • Хлопковый шоппер (34х38 см, длина ремешка регулируется до 60 см)<br />
          • Брелок (16 см)<br />
          • 2 значка (5.8 см)<br />
          • 2 значка (7.5 см)
        </>
        ),        
        tgLink: "https://t.me/telegram/218", // Замени на актуальную ссылку
        isAvailable: true
    },
    {
        id: 35,
        name: "Подарочный набор",
        game: "Arknights", // ⬅️ Замени на нужную категорию
        price: 3100, 
        img: IMAGES.gift_box, // Не забудь добавить в images.js
        desc: (
        <>
          Эксклюзивный подарочный набор для настоящих фанатов Arknights: Endfield.<br />
          <br />
          <b>В комплекте:</b><br />
          • Кружка (480 мл)<br />
          • Брелок с зайчиком (зайчик 7 см, лента 12 см)<br />
          • Брелок с карточкой (8.5х5.4 см)<br />
          • Ручка (19.6 см)
        </>
        ),        
        tgLink: "https://t.me/telegram/219", // Замени на актуальную ссылку
        isAvailable: true
    },

    {
        id: 36,
        name: "Сумка Arknights: Endfield",
        game: "Arknights",
        price: 3400, 
        img: IMAGES.endfield_bag,
        badge: "Новинка", preorder: true,
        desc: (
        <>
          Стильная и вместительная сумка по мотивам Arknights: Endfield.<br />
          <br />
          <b>Размеры:</b><br />
          • Внутренняя ширина: ~26 см<br />
          • Внешняя ширина: ~35 см<br />
          • Высота: ~24 см
        </>
        ),        
        tgLink: "https://t.me/telegram/220", // Замени на актуальную ссылку
        isAvailable: true
    },
    
    // --- ТОВАРЫ 18+ ---
    {
        id: 69,
        name: "Фигурка Super Succubus",
        game: "18+", 
        price: 8500,
        img: "🔞", 
        desc: "Коллекционная фигурка с опциональными деталями. Строго 18+.",
        tgLink: "https://t.me/telegram/6969",
        isAvailable: true
    },
    // --- СПЕЦ ТОВАР ---
    {
      id: 999,
      name: "Товар по запросу",
      game: "Индивидуально",
      price: 9999,
      img: IMAGES.individual,
      desc: "Если вы не нашли что хотели, то выбирайте этот товар и менеджер свяжется с вами. Будьте готовы прислать ссылку или фото нужного вам товара. ",
      tgLink: "https://t.me/sheep2me_mg",
      isAvailable: true
    }
];

export const categories = ["Все", "Honkai: Star Rail", "Zenless Zone Zero", "Genshin Impact", "PopMart", "Arknights", "Другое", "18+", "Индивидуально"];