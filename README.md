[<img width="134" src="https://vk.com/images/apps/mini_apps/vk_mini_apps_logo.svg">](https://vk.com/services)

# task-uploader-mini-app-front

> VK мини приложение 

## Как запустить

### dev

- `yarn`
- `yarn dev`

### production

- `yarn`
- `yarn build`
- `yarn deploy`

### ODR

- Для создания ODR архива (apple) нужно воспользоваться vite.odr.config - лежит в корне
- После сборки проекта с этим конфигом в папку dist если пути до ассетов остались абсолютными ("/assets/..."), нужно поменять их на относительные ("./assets/").
- Чтобы проверить работоспособность - нужно открыть /dist/index.html
- После сборки и проверки - запаковать папку dist в архив и загрузить в настройках приложения
- Более подробная информация есть в документации к миниаппам.

## MAINTAINER
Константин Поздникин k.pozdnikin@vk.team