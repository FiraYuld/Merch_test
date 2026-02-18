/* 
  1. import имя from './assets/файл.jpg';
  2. Добавляем в список export const IMAGES
*/

import logo from './assets/logo-without-bg.png'; 
import logobg from './assets/logo-w-bg.png';

import kafka from './assets/Kafka.jpg';


// Экспортируем все картинки как единый объект
export const IMAGES = {
    logo: logo,
    kafka: kafka,
    logobg: logobg
    // Сюда будешь добавлять новые:
    // raiden: raidenImg,
};