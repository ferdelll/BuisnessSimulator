var balance = 100;
var passiveIncome = 0;
var properties = {
    smallShop: { 
        cost: 100, 
        passiveIncome: 2, 
        upgraded: false, 
        upgradeCost: 100, 
        upgradeMultiplier: 1.2 
    },
    middleShop: { 
        cost: 500, 
        passiveIncome: 5, 
        upgraded: false, 
        upgradeCost: 300, 
        upgradeMultiplier: 1.5 
    },
    bigShop: { 
        cost: 1000, 
        passiveIncome: 10, 
        upgraded: false, 
        upgradeCost: 500, 
        upgradeMultiplier: 2 
    },
};

var perClick = 1;
var property = {
    smallShop: false,
    middleShop: false,
    bigShop: false,
};

var bar = new ProgressBar.Line('#progressContainer', {
    strokeWidth: 4,
    color: '#007aff', 
    trailColor: '#ddd', 
    trailWidth: 1,
    text: {
        style: {
            color: '#333',
            position: 'absolute',
            right: '0',
            top: '-30px',
            padding: 0,
            margin: 0,
            transform: null
        },
        autoStyleContainer: false
    },
    from: { color: '#FFEA82' },
    to: { color: '#ED6A5A' },
    strokeLinecap: 'round', 
    step: (state, bar) => {
        bar.setText(Math.round(bar.value() * 100) + ' %');
    }
});

function addpr(percent) {
    var currentValue = bar.value() * 100;
    var newValue = currentValue + percent;

    if (newValue > 100) {
        newValue = 100;
    }

    bar.animate(newValue / 100);
}

function perClickinc() {
    if (bar.value() === 1) {
        perClick++;
        bar.animate(0);
    }
}

function workFunc() {
    balance += perClick;
    ubdate();
    addpr(2);
    perClickinc();
}

function passiveIncomeFunc() {
    balance += passiveIncome;
}

function buyItem(name) {
    if (property.hasOwnProperty(name)) {
        if (property[name]) {
            return; 
        }

        var cost = properties[name].cost;
        if (balance >= cost) {
            balance -= cost;
            property[name] = true;
            passiveIncome += properties[name].passiveIncome;
            ubdate(); 
        }
    }
}

function upgradeItem(name) {
    if (!property[name]) {
        return; 
    }

    if (properties[name].upgraded) {
        return; 
    }

    var upgradeCost = properties[name].upgradeCost;
    if (balance >= upgradeCost) {
        balance -= upgradeCost;
        passiveIncome *= properties[name].upgradeMultiplier; 
        properties[name].upgraded = true; 
        ubdate(); 
    }
}

function ubdate() {
    var labelMoney = document.getElementById('balanceVar');
    var labelPassiveIncome = document.getElementById('passiveInc');
    var smallShopCost = document.getElementById('smallShoplbl');
    var middleShopCost = document.getElementById('midleShoplbl');
    var bigShopCost = document.getElementById('bigShoplbl');

    labelMoney.innerHTML = "Balance: " + balance.toFixed(2) + '$'; 
    labelPassiveIncome.innerHTML = "Passive income: " + passiveIncome.toFixed(2) + "$"; 
    smallShopCost.innerHTML = "Стоимость: " + properties.smallShop.cost + "$ (Улучшение: " + properties.smallShop.upgradeCost + "$)";
    middleShopCost.innerHTML = "Стоимость: " + properties.middleShop.cost + "$ (Улучшение: " + properties.middleShop.upgradeCost + "$)";
    bigShopCost.innerHTML = "Стоимость: " + properties.bigShop.cost + "$ (Улучшение: " + properties.bigShop.upgradeCost + "$)";

    alreadyBuyed("smallShop", "smallShopERR", "smallShopBtn", "smallShopubgBtn");
    alreadyBuyed("middleShop", "midleShopERR", "midleShopBtn", "midleShopubgBtn");
    alreadyBuyed("bigShop", "bigShopERR", "bigShopBtn", "bigShopubgBtn");
}

function alreadyBuyed(item, itemLbl, shopBtn, itemubgbtn) {
    if (property[item] === true) {
        document.getElementById(itemLbl).style.display = "block";
        document.getElementById(shopBtn).innerHTML = "Куплено"; 
        document.getElementById(shopBtn).disabled = true; 
        document.getElementById(shopBtn).title = "Уже куплено";

        var upgradeButton = document.getElementById(itemubgbtn);
        if (properties[item].upgraded) {
            upgradeButton.disabled = true; 
            upgradeButton.title = "Улучшение уже куплено"; 
        } else {
            upgradeButton.disabled = balance < properties[item].upgradeCost; 
            upgradeButton.title = upgradeButton.disabled 
                ? "Недостаточно средств для улучшения (нужно " + properties[item].upgradeCost + "$)" 
                : "Нажмите, чтобы улучшить"; 
        }
    } else {
        document.getElementById(itemLbl).style.display = "none";
        document.getElementById(itemubgbtn).disabled = true; 
        document.getElementById(itemubgbtn).title = "Купите, чтобы улучшить"; 
        document.getElementById(shopBtn).title = "Нажмите, чтобы купить";
    }
}

document.getElementById('click_btn').onclick = function() {
    workFunc();
};

document.getElementById('smallShopBtn').onclick = function() {
    buyItem("smallShop");
};

document.getElementById('midleShopBtn').onclick = function() {
    buyItem("middleShop");
};

document.getElementById('bigShopBtn').onclick = function() {
    buyItem("bigShop");
};

document.getElementById('smallShopubgBtn').onclick = function() {
    upgradeItem("smallShop");
};

document.getElementById('midleShopubgBtn').onclick = function() {
    upgradeItem("middleShop");
};

document.getElementById('bigShopubgBtn').onclick = function() {
    upgradeItem("bigShop");
};

setInterval(ubdate, 500);
setInterval(passiveIncomeFunc, 1000);
