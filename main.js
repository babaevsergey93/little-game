;(function () {
    let height = 0;
    let width = 0;
    let score = 0;
    const message = document.querySelector("#message");
    const btn = document.getElementById("start-btn");
    const tableArea = document.getElementById('table-area');
    const imgArr = [
        'https://kde.link/test/0.png',
        'https://kde.link/test/1.png',
        'https://kde.link/test/2.png',
        'https://kde.link/test/3.png',
        'https://kde.link/test/4.png',
        'https://kde.link/test/5.png',
        'https://kde.link/test/6.png',
        'https://kde.link/test/7.png',
        'https://kde.link/test/8.png',
        'https://kde.link/test/9.png'
    ];
    let myClickedElem = [];

    (function () {
        // Получаем высоту и ширину
        function Get(yourUrl) {
            let Httpreq = new XMLHttpRequest(); // a new request
            Httpreq.open("GET", yourUrl, false);
            Httpreq.send(null);
            return Httpreq.responseText;
        }

        // закончили получать высоту и ширину

        // распарсим и присвоем ширину  и высоту из объекта
        let json_obj = JSON.parse(Get('https://kde.link/test/get_field_size.php'));

        height = json_obj.height;
        width = json_obj.width;
        // закончили
    })();


    function random(min, max) { //взял из learn.javascript.ru
        let rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
    }

    function generateImageCollection(countCells, cells) {
        let arr = []; //наши картинки

        for (let i = 0, l = countCells / 2, max = imgArr.length - 1; i < l; i++) {
            arr.push(imgArr[random(0, max)]);
        }

        for (let i = 0, l = arr.length; i < l; i++) { //записываем картинку
            let img1 = new Image();
            let img2 = new Image();

            let imgSrc = arr.splice(0, 1)[0];
            let imgId = imgSrc[imgSrc.indexOf('.png') - 1];

            img1.src = imgSrc;
            img2.src = imgSrc;

            img1.setAttribute('data-img-id', imgId);
            img2.setAttribute('data-img-id', imgId);

            img1.classList.add('hide');
            img2.classList.add('hide');

            let randomNumber = random(0, cells.length - 1); //генерируем случайное число
            let firstCell = cells.splice(randomNumber, 1)[0]; //вырезаем из коллекции пустых ячеек нашу случайную и получаем массив из одной, она нам и нужна
            firstCell.appendChild(img1);

            let randomSecondNumber = random(0, cells.length - 1);
            let secondCell = cells.splice(randomSecondNumber, 1)[0];
            secondCell.appendChild(img2);
        }
    }

    // Описываем как таблицу создавать
    function populateTable(width, height, cells, table) {
        if (!table) table = document.createElement("table");
        for (let i = 0; i < width; i++) { //генерируем строку
            let row = document.createElement("tr");

            for (let i = 0; i < height; i++) { //генерируем ячейку
                let td = document.createElement("td");
                cells.push(td);

                row.appendChild(td);
            }

            table.appendChild(row);
        }
        return table;
    }

    // закончили описывание создание таблицы

    function startGame(e) {//начало игры
        let cells = [];
        let table = tableArea.appendChild(populateTable(width, height, cells));

        table.addEventListener('click', clicker);

        generateImageCollection(width * height, cells);//заполнение таблицы

        btn.style.display = 'none';
        document.querySelector('#score').innerText = 'You\'r score: ' + score;
    }

    btn.addEventListener('click', startGame);

    function clicker(e) {//это наш ивент для делегирования
        if (e.target.className === 'filtered') {
            return;
        }
        if (e.target.hasAttributes('data-img-id')) {
            let img = e.target;
            img.classList.remove('hide');
            checkClick(img);
        }
    }

    function checkClick(img) { //проверка и действие в случае выигрыша или проигрыша
        myClickedElem.push(img);
        myClickedElem.splice(2); //убираем все остальные значения

        if (myClickedElem.length === 2
            && myClickedElem[0].getAttribute('data-img-id') === myClickedElem[1].getAttribute('data-img-id')
            && myClickedElem[0] !== myClickedElem[1]) {
            setTimeout(function () {
                myClickedElem.forEach((elem) => {
                    return elem.classList.add('filtered'); // фильтром затемняем те которые совпали
                });
                myClickedElem = []; //убираем все остальные значения
            }, 200);
            message.innerText = 'Совпадение!';
            score++;
            document.querySelector('#score').innerText = 'You\'r score: ' + score;
            checkWin(score);
        } else if (myClickedElem.length === 2) { // в массиве два элемента, но они не совпали - скрыть

            setTimeout(() => {
                myClickedElem[0].classList.add('hide');
                myClickedElem[1].classList.add('hide');

                myClickedElem.splice(0); //убираем все остальные значения
            }, 200);
            message.innerText = 'Пробуй дальше, не сдавайся!';
        }

    }

    function startTimer() { // таймер
        let timer = document.querySelector('#timer');
        timer.className = 'showing'; // показываем таймер только при нажатии на кнопку

        let time = timer.innerHTML; // получаем значение

        if (time === 0) {
            message.innerText = "Время вышло!";
            window.location.reload(); //  если время вышло перезагружаем окно

        } else { // если нет отнимаем секунду и вызываем снова
            time--;
            if (time < 10) time = "0" + time;  // что бы красивей выводились секунды

            document.getElementById("timer").innerHTML = time;
            setTimeout(startTimer, 1000); // проверяем каждую секунду
        }
    }

    function checkWin(score) {
        let images = document.querySelectorAll('img').length;
        if (score === (images / 2)) {
            alert('Вы выиграли!');
            window.location.reload();
        }
    }

    btn.addEventListener('click', startTimer);

})();


